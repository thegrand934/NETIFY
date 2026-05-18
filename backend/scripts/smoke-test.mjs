import http from 'node:http';

const BASE = process.env.API_BASE || 'http://127.0.0.1:5000/api';

function request(method, path, body, token) {
  const url = new URL(`${BASE}${path}`);
  const payload = body ? JSON.stringify(body) : '';

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let json = null;
          try {
            json = data ? JSON.parse(data) : null;
          } catch {
            json = data;
          }
          resolve({ status: res.statusCode, json });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function assert(name, condition, details = '') {
  if (!condition) {
    throw new Error(`FAIL: ${name}${details ? ` -> ${details}` : ''}`);
  }
  console.log(`PASS: ${name}`);
}

async function run() {
  console.log(`Testing backend at ${BASE}\n`);

  const health = await request('GET', '/health');
  assert('health endpoint', health.status === 200 && health.json?.db === 'connected', JSON.stringify(health));

  const adminLogin = await request('POST', '/auth/login', {
    email: 'admin@netify.com',
    password: 'admin123',
  });
  assert('admin login', adminLogin.status === 200 && adminLogin.json?.role === 'admin', JSON.stringify(adminLogin));
  const adminToken = adminLogin.json.token;

  const me = await request('GET', '/auth/me', null, adminToken);
  assert('auth me', me.status === 200 && me.json?.email === 'admin@netify.com', JSON.stringify(me));

  const stats = await request('GET', '/admin/stats', null, adminToken);
  assert('admin stats', stats.status === 200, JSON.stringify(stats));

  const users = await request('GET', '/admin/users', null, adminToken);
  assert('admin users', users.status === 200 && Array.isArray(users.json), JSON.stringify(users));

  const movies = await request('GET', '/admin/movies', null, adminToken);
  assert('admin movies', movies.status === 200 && Array.isArray(movies.json), JSON.stringify(movies));

  const badLogin = await request('POST', '/auth/login', {
    email: 'admin@netify.com',
    password: 'wrong-password',
  });
  assert('invalid login rejected', badLogin.status === 401, JSON.stringify(badLogin));

  const suffix = Date.now();
  const register = await request('POST', '/auth/register', {
    name: 'Smoke Test User',
    email: `smoke${suffix}@netify.com`,
    password: 'test1234',
  });
  assert('user register', register.status === 201 && register.json?.token, JSON.stringify(register));
  const userToken = register.json.token;

  const userOnAdmin = await request('GET', '/admin/stats', null, userToken);
  assert('non-admin blocked', userOnAdmin.status === 403, JSON.stringify(userOnAdmin));

  const keys = await request('POST', '/auth/recovery/generate', { password: 'test1234' }, userToken);
  assert('recovery keys generated', keys.status === 200 && keys.json?.keys?.length === 10, JSON.stringify(keys));

  const validate = await request('POST', '/auth/recovery/validate', {
    identifier: register.json.email,
    recoveryKey: keys.json.keys[0],
  });
  assert('recovery validate', validate.status === 200 && validate.json?.tempToken, JSON.stringify(validate));

  const reset = await request('POST', '/auth/recovery/reset', {
    tempToken: validate.json.tempToken,
    newPassword: 'reset1234',
  });
  assert('password reset', reset.status === 200, JSON.stringify(reset));

  const relogin = await request('POST', '/auth/login', {
    email: register.json.email,
    password: 'reset1234',
  });
  assert('login after reset', relogin.status === 200 && relogin.json?.token, JSON.stringify(relogin));

  console.log('\nAll backend smoke tests passed.');
}

run().catch((err) => {
  console.error('\nBackend smoke test failed.');
  console.error(err.message || err);
  process.exit(1);
});
