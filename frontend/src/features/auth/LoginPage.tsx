import React, { useState } from 'react';
import { useAuth } from '../../shared/AuthContext';
import { Lock, Mail, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { EnterpriseBackground } from '../../shared/EnterpriseBackground';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Skeleton';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <EnterpriseBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 space-y-6">
            <Skeleton className="h-16 w-16 mx-auto rounded-2xl" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-4 mt-8">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full mt-4" />
            </div>
          </div>
        </div>
      </EnterpriseBackground>
    );
  }

  return (
    <EnterpriseBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10"
        >
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <LogIn size={32} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 text-sm mt-2">Enterprise Asset Intelligence Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white p-3 pl-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin@assetflow.dev"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white p-3 pl-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium border border-red-500/30"
              >
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              isLoading={loading} 
              className="w-full py-3 text-lg"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-10 p-5 bg-slate-800/40 rounded-2xl text-[11px] text-slate-400 border border-slate-700/50">
            <p className="font-bold text-slate-300 mb-2 uppercase tracking-tighter">Access Credentials</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="opacity-60">Admin</span> <span>admin@assetflow.dev</span>
              <span className="opacity-60">Dept Head</span> <span>dept@assetflow.dev</span>
              <span className="opacity-60">Employee</span> <span>john@assetflow.dev</span>
              <span className="opacity-60">Technician</span> <span>jane@assetflow.dev</span>
            </div>
          </div>
        </motion.div>
      </div>
    </EnterpriseBackground>
  );
};

