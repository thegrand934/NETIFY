'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Mail, Key, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/recovery/validate', { identifier, recoveryKey });
      if (res.data.tempToken) {
        sessionStorage.setItem('resetToken', res.data.tempToken);
        router.push('/reset-password');
      } else {
        setError('Invalid email or recovery key');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      if (!axiosErr.response) {
        setError('Server unreachable. Make sure the backend is running on port 5000.');
        return;
      }
      setError(axiosErr.response?.data?.message || 'Invalid email or recovery key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 selection:bg-rose-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/[0.02] border border-white/[0.05] p-8 rounded-2xl backdrop-blur-xl relative z-10 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Recovery</h1>
          <p className="text-gray-400 text-sm">Use one of your backup recovery keys to securely reset your password.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Recovery Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value.toUpperCase())}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors uppercase font-mono tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
                placeholder="e.g. X9K2-PQ7A"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Key'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Remember your password? <button onClick={() => router.push('/login')} className="text-white hover:underline hover:text-rose-400">Log in</button>
        </div>
      </motion.div>
    </div>
  );
}
