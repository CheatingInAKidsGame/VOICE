import React from 'react';
import { Shield, Lock, EyeOff, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onLearnPrivacy: () => void;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onContinue,
  onLearnPrivacy,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Subtle decorative top border */}
        <div className="h-1.5 w-full bg-slate-900" />

        <div className="p-6 sm:p-10 text-center">
          {/* Typographic Title - NO LOGO, NO PICTURES */}
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
            VOICE
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 text-balance">
            Your Voice Matters.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-md mx-auto">
            VOICE gives students a safe space to share their thoughts, concerns, ideas, and experiences without publicly revealing their identity.
          </p>

          {/* Quick trust pillars */}
          <div className="grid grid-cols-3 gap-3 mb-8 text-left bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex flex-col items-center text-center">
              <EyeOff className="w-4 h-4 text-slate-700 mb-1" />
              <span className="text-xs font-bold text-slate-900">No Account</span>
              <span className="text-[11px] text-slate-500 leading-tight">Zero sign-in needed</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-slate-200 px-2">
              <Lock className="w-4 h-4 text-slate-700 mb-1" />
              <span className="text-xs font-bold text-slate-900">No Personal Info</span>
              <span className="text-[11px] text-slate-500 leading-tight">No name, email, or ID</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-4 h-4 text-slate-700 mb-1" />
              <span className="text-xs font-bold text-slate-900">SBO Dialogue</span>
              <span className="text-[11px] text-slate-500 leading-tight">Two-way responses</span>
            </div>
          </div>

          {/* Buttons: [ Continue ] [ Learn More About Privacy ] */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <button
              onClick={onContinue}
              className="px-6 py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLearnPrivacy}
              className="px-5 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              Learn More About Privacy
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>“Speak freely. Be heard. Stay anonymous.”</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
