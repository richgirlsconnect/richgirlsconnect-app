import React, { useState } from 'react';
import { Crown, KeyRound, Eye, EyeOff, ShieldCheck, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigate?: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigate }) => {
  const { login } = useAuth();
  // Form fields always start completely empty with zero saved credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Please enter your password or private master passcode');
      return;
    }

    setIsSubmitting(true);
    const result = await login(password.trim(), email.trim());
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#05070a]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Luxury Card */}
        <div className="rounded-2xl border border-amber-500/25 bg-[#0a0d14]/90 backdrop-blur-xl p-8 shadow-2xl shadow-black/80">
          
          {/* Header & Crest */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800 p-0.5 shadow-xl shadow-amber-900/40 mb-4">
              <div className="w-full h-full bg-[#080b12] rounded-[14px] flex items-center justify-center">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold font-serif-luxury text-slate-100 tracking-wider">
              RICH<span className="gold-gradient-text">CONNECT</span> AI
            </h1>
            <p className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold mt-1">
              Private Relationship CRM
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Confidential access. Please enter your credentials to authenticate.
            </p>
          </div>

          {/* Form with autoComplete="off" and zero auto-fill */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* Email / Username field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin / Concierge Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="admin-email-field"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@richconnect.luxury"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-100 placeholder-slate-600 text-sm transition-all outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Passcode / Master Key *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="admin-passcode-field"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter private passcode..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-100 placeholder-slate-600 text-sm transition-all outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                <Lock className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Client Portal Link (Accessible without Admin login) */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5 text-center">
            <a
              href="/client"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/client');
                }
              }}
              className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Are you a Client? Access Client Portal &rarr;</span>
            </a>

            <div className="text-[11px] text-slate-500">
              <a href="/matchmaking" className="hover:text-slate-400 transition-colors">
                Apply for Private Membership &bull; /matchmaking
              </a>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted zero-storage authentication &bull; Pure session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
