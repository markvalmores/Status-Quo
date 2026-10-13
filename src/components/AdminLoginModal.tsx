import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === 'mdv4244@gmail.com' && password.trim() === 'mark4246') {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
      setError('');
      onAdminLoginSuccess();
      onClose();
    } else {
      setError('Access restricted. Invalid master administrator credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#120c22] border border-red-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-red-950/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#291a47] flex items-center justify-between bg-gradient-to-r from-red-500/20 via-purple-600/20 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-red-300">
                Master Admin Portal
              </h2>
              <p className="text-xs text-zinc-300">
                Restricted portal for authorized administrators only
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#251747] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter master email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#18102d] border border-[#3b276b] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-400 font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Admin Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter master password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#18102d] border border-[#3b276b] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-400 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-red-900/40 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Authenticate Master Admin</span>
          </button>
        </form>
      </div>
    </div>
  );
};
