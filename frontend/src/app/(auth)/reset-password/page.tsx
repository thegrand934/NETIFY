'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('resetToken');
    if (!token) {
      router.push('/forgot-password');
    } else {
      setTempToken(token);
    }
    setCheckingToken(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/recovery/reset', { tempToken, newPassword });
      setSuccess(true);
      sessionStorage.removeItem('resetToken');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      if (!axiosErr.response) {
        setError('Server unreachable. Make sure the backend is running on port 5000.');
        return;
      }
      setError(axiosErr.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken || (!tempToken && !success)) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/[0.02] border border-white/[0.05] p-8 rounded-2xl backdrop-blur-xl relative z-10 shadow-2xl"
      >
        {success ? (
          <div className="text-center py-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
            <p className="text-gray-400 mb-6">Your password has been successfully updated. The recovery key you used is now permanently invalid.</p>
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
              <p className="text-gray-400 text-sm">Key validated. Please enter your new password below.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter new password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Confirm new password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
              >
                {loading ? 'Updating...' : 'Update Password'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
