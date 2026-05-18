import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import User from './models/User';
import { getJwtSecret } from './config/jwt';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

let memoryServer: MongoMemoryServer | null = null;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? 'ok' : 'degraded',
    message: dbReady ? 'NETIFY Backend is running.' : 'Database not connected.',
    db: dbReady ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const ensureDevAdmin = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@netify.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    existing.role = 'admin';
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log(`Dev admin ready: ${adminEmail} (password: ${adminPassword})`);
    return;
  }

  const anyAdmin = await User.findOne({ role: 'admin' });
  if (anyAdmin) {
    return;
  }

  await User.create({
    name: 'Admin User',
    email: adminEmail,
    passwordHash,
    role: 'admin',
    isPremium: true,
  });
  console.log(`Dev admin created: ${adminEmail} (password: ${adminPassword})`);
};

const connectDB = async (): Promise<void> => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('No MONGO_URI provided. Starting in-memory MongoDB...');
    memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected successfully');
  await ensureDevAdmin();
};

const start = async (): Promise<void> => {
  getJwtSecret();
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
