'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { X } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      window.location.href = '/';
    }
  }, [isLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data, res.data.token);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      if (!axiosErr.response) {
        setError(
          'Server unreachable. Start the backend on port 5000 (e.g. npm run dev in backend/) and try again.'
        );
        return;
      }
      setError(axiosErr.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-background/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-black/60 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl">
        <Link href="/" className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </Link>
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Sign In</h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-md mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary/50 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-white hover:underline">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/50 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-md transition-colors mt-6"
          >
            Sign In
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          New to NETIFY? <Link href="/register" className="text-white hover:underline">Sign up now.</Link>
        </p>
      </div>
    </div>
  );
}
