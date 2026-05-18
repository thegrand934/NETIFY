'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Download, Copy, AlertTriangle, Check, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RecoveryKeysPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [keys, setKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<{ activeKeys: number, totalKeys: number, lastGenerated: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.replace('/login');
      return;
    }
    fetchStatus();
  }, [token, authLoading, router]);

  const fetchStatus = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/recovery/keys');
      setStatus(res.data);
      setError('');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to load recovery key status');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return setError('Password is required');
    if (!token) return router.replace('/login');
    
    setGenerating(true);
    setError('');
    try {
      const res = await api.post('/auth/recovery/generate', { password });
      setKeys(res.data.keys);
      setShowGenerateModal(false);
      setPassword('');
      await fetchStatus();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to generate keys');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(keys.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard. Please copy manually.');
    }
  };

  const downloadKeys = () => {
    try {
      const element = document.createElement('a');
      const file = new Blob([`NETIFY RECOVERY KEYS\n\n${keys.join('\n')}\n\nKeep these secure. Each key can only be used once.`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = 'netify-recovery-keys.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch {
      setError('Could not download keys. Please try again.');
    }
  };

  if (authLoading || (!token && loading)) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 font-sans selection:bg-rose-500/30">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Recovery Keys</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Enterprise-grade backup codes to recover your account if you lose access. Keep them safe.
          </p>
        </motion.div>

        {error && !showGenerateModal && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8 backdrop-blur-xl mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Status Overview</h2>
              {loading ? (
                <div className="h-5 w-48 bg-white/10 rounded animate-pulse"></div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className={`inline-block w-2 h-2 rounded-full ${status?.activeKeys ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  {status?.activeKeys || 0} active keys remaining
                  {status?.lastGenerated && ` • Generated ${new Date(status.lastGenerated).toLocaleDateString()}`}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowGenerateModal(true)}
              disabled={!token}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 w-fit disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              Generate New Keys
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {keys.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-medium">Save these keys now. You will not be able to see them again.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  {keys.map((key, i) => (
                    <div key={i} className="bg-black/50 border border-white/10 rounded-lg p-3 text-center font-mono tracking-widest text-emerald-400">
                      {key}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={copyToClipboard}
                    className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                  <button 
                    onClick={downloadKeys}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Download as TXT
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGenerateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGenerateModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              ></motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#121214] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md relative z-10 shadow-2xl"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Verify it&apos;s you</h3>
                  <p className="text-gray-400 text-sm">Generating new keys will permanently invalidate your old ones.</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleGenerate}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowGenerateModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={generating}
                      className="flex-1 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {generating ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
