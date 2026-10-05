import React from 'react';
import { ViewMode, UserRole } from '../types';
import { Lock, ShieldAlert, LogOut } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
  onOpenWelcome: () => void;
  onOpenAuthModal: () => void;
  currentRole: UserRole;
  onSignOut: () => void;
  onPlayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenWelcome,
  onOpenAuthModal,
  currentRole,
  onSignOut,
  onPlayIntro,
}) => {
  const isAuthorized = currentRole === 'sbo_officer' || currentRole === 'product_developer';

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info - Pure Typography, No Logos */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-black text-slate-900 text-xl tracking-tight block">
              VOICE
            </span>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              A modern, secure, and student-focused anonymous feedback and anti-bullying platform. Created to give students a safe space to speak freely, be heard, and stay anonymous.
            </p>
            <p className="text-xs text-slate-700 font-bold">
              “Speak freely. Be heard. Stay anonymous.”
            </p>
          </div>

          {/* Student Links */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
              Student Space
            </span>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Homepage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('submit')}
                  className="hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Submit Anonymous Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('anti-bullying')}
                  className="text-rose-700 font-semibold hover:text-rose-900 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Report Bullying Privately</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('check')}
                  className="hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Check My Feedback Status
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenWelcome}
                  className="hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Show Welcome Screen
                </button>
              </li>
              {onPlayIntro && (
                <li>
                  <button
                    onClick={onPlayIntro}
                    className="hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Replay Intro Animation
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Standards & Privileged Access */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
              Integrity & Access
            </span>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('guidelines')}
                  className="hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Community Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Privacy Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-slate-950 transition-colors cursor-pointer"
                >
                  About VOICE
                </button>
              </li>

              {/* Protected Staff / SBO Access with Passkey */}
              <li className="pt-2 border-t border-slate-100">
                {!isAuthorized ? (
                  <button
                    onClick={onOpenAuthModal}
                    className="hover:text-slate-950 font-medium text-slate-500 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Officer & Admin Sign In</span>
                  </button>
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => onNavigate(currentRole === 'product_developer' ? 'dev-console' : 'sbo-portal')}
                      className="font-bold text-slate-900 hover:underline cursor-pointer block"
                    >
                      {currentRole === 'product_developer' ? 'Open Developer Console' : 'Open SBO Dashboard'}
                    </button>
                    <button
                      onClick={onSignOut}
                      className="text-[11px] text-red-600 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VOICE · Created for students, by students.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-700" />
            <span>Zero-Knowledge & Privacy Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
