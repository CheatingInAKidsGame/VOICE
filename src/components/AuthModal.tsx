import React, { useState } from 'react';
import { UserRole } from '../types';
import { FeedbackStore } from '../services/feedbackStore';
import { Lock, Shield, KeyRound, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successRole, setSuccessRole] = useState<UserRole | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const verifiedRole = FeedbackStore.verifyPasskey(passkey);
    if (verifiedRole) {
      FeedbackStore.setSession(verifiedRole);
      setSuccessRole(verifiedRole);
      setTimeout(() => {
        onSuccess(verifiedRole);
        onClose();
        setPasskey('');
        setSuccessRole(null);
      }, 500);
    } else {
      setError('Invalid passkey. Access denied. Only authorized personnel can sign in.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Authorized Personnel Sign-In</h3>
              <p className="text-[11px] text-slate-500">Restricted to SBO Officers & System Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {successRole ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="font-bold text-slate-900 text-base">Authorized Access Granted</h4>
              <p className="text-xs text-slate-500">
                Signing into {successRole === 'product_developer' ? 'System Developer Console' : 'SBO Officer Portal'}...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Ordinary students only have access to Student View. To access the SBO Officer dashboard or Developer controls, please enter your official passkey.
              </p>

              <div>
                <label htmlFor="auth-passkey" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enter Security Passkey
                </label>
                <div className="relative">
                  <input
                    id="auth-passkey"
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter assigned SBO or Admin Passkey"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono"
                    required
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Authenticate
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
