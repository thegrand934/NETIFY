'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { LayoutDashboard } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const { login, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      window.location.href = '/';
    }
  }, [isLoading, user]);

  useEffect(() => {
    api
      .get('/health')
      .then((res) => setBackendOk(res.data?.db === 'connected'))
      .catch(() => setBackendOk(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const success = login(res.data, res.data.token);
      if (!success) {
        setError('Admin privileges required.');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (!axiosErr.response) {
        setError(
          'Backend not reachable. Open a terminal and run: cd /home/kali/Desktop/NETIFY/backend && npm run dev'
        );
        return;
      }
      if (axiosErr.response.status >= 500) {
        setError(
          'Backend is not running. Start it first: cd /home/kali/Desktop/NETIFY/backend && npm run dev'
        );
        return;
      }
      setError(axiosErr.response?.data?.message || `Login failed (HTTP ${axiosErr.response.status})`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-xl shadow-2xl border border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LayoutDashboard className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-blue-400">NETIFY ADMIN</h1>
          <p className="text-gray-400 text-sm mt-2">Secure access portal</p>
        </div>

        {backendOk === false && (
          <div className="bg-amber-500/20 border border-amber-500 text-amber-100 p-3 rounded-md mb-4 text-sm">
            Backend is offline. Start it: <code className="text-xs">cd backend && npm run dev</code>
          </div>
        )}

        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-md mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@netify.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin123"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-colors mt-6"
          >
            Authenticate
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-4">
          Dev login: admin@netify.com / admin123
        </p>
      </div>
    </div>
  );
}
