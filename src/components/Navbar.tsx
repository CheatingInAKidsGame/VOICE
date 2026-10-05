import React, { useState } from 'react';
import { ViewMode, UserRole } from '../types';
import { Lock, ShieldAlert, LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  currentRole: UserRole;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentRole,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: ViewMode) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const isStaffOrDev = currentRole === 'sbo_officer' || currentRole === 'product_developer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-colors">
      {/* Authorized role status banner if SBO or Developer is logged in */}
      {isStaffOrDev && (
        <div className="bg-slate-900 text-amber-300 px-4 py-1.5 text-xs flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">
              Authorized Session: {currentRole === 'product_developer' ? 'Master Developer / Admin' : 'SBO Officer'}
            </span>
            <span className="text-slate-400 hidden sm:inline">· Privileged access active</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav(currentRole === 'product_developer' ? 'dev-console' : 'sbo-portal')}
              className="text-amber-400 hover:text-white underline cursor-pointer text-[11px]"
            >
              Open {currentRole === 'product_developer' ? 'Dev Console' : 'SBO Dashboard'}
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center gap-1 text-slate-300 hover:text-white text-[11px] cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit to Student View</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Pure typographic brand wordmark - NO LOGO, NO PICTURES */}
          <div className="flex items-center">
            <button
              onClick={() => handleNav('home')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-md"
            >
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
                VOICE
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase block mt-0.5">
                Anonymous School Feedback
              </span>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('home')}
              className={`hover:text-slate-950 transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-slate-950 font-bold underline underline-offset-8 decoration-slate-900 decoration-2' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('submit')}
              className={`hover:text-slate-950 transition-colors cursor-pointer ${
                currentView === 'submit' ? 'text-slate-950 font-bold underline underline-offset-8 decoration-slate-900 decoration-2' : ''
              }`}
            >
              Submit Feedback
            </button>
            {/* Dedicated Anti-Bullying Reporting Tab */}
            <button
              onClick={() => handleNav('anti-bullying')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === 'anti-bullying'
                  ? 'text-rose-700 font-bold underline underline-offset-8 decoration-rose-600 decoration-2'
                  : 'text-rose-700 hover:text-rose-800 font-semibold'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Report Bullying</span>
            </button>
            <button
              onClick={() => handleNav('check')}
              className={`hover:text-slate-950 transition-colors cursor-pointer ${
                currentView === 'check' ? 'text-slate-950 font-bold underline underline-offset-8 decoration-slate-900 decoration-2' : ''
              }`}
            >
              Check My Feedback
            </button>
            <button
              onClick={() => handleNav('guidelines')}
              className={`hover:text-slate-950 transition-colors cursor-pointer ${
                currentView === 'guidelines' ? 'text-slate-950 font-bold underline underline-offset-8 decoration-slate-900 decoration-2' : ''
              }`}
            >
              Guidelines
            </button>
            <button
              onClick={() => handleNav('privacy')}
              className={`hover:text-slate-950 transition-colors cursor-pointer ${
                currentView === 'privacy' ? 'text-slate-950 font-bold underline underline-offset-8 decoration-slate-900 decoration-2' : ''
              }`}
            >
              Privacy
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`hover:text-slate-950 transition-colors cursor-pointer ${
                currentView === 'about' ? 'text-slate-950 font-bold underline underline-offset-8 decoration-slate-900 decoration-2' : ''
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Actions - Students only see safe actions; discrete staff access */}
          <div className="flex items-center gap-3">
            {/* Quick Submit CTA for students */}
            {currentView !== 'submit' && (
              <button
                onClick={() => handleNav('submit')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              >
                <span>Submit Feedback</span>
              </button>
            )}

            {/* Discrete SBO / Staff login trigger */}
            {!isStaffOrDev ? (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                title="SBO Officers and Admin Sign In"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline">Officer Access</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav(currentRole === 'product_developer' ? 'dev-console' : 'sbo-portal')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 cursor-pointer shadow-xs"
              >
                <span>{currentRole === 'product_developer' ? 'Dev Console' : 'SBO Dashboard'}</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="grid gap-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => handleNav('home')}
              className={`text-left px-3 py-2 rounded-lg hover:bg-slate-100 ${
                currentView === 'home' ? 'bg-slate-100 text-slate-950 font-bold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('submit')}
              className={`text-left px-3 py-2 rounded-lg hover:bg-slate-100 ${
                currentView === 'submit' ? 'bg-slate-100 text-slate-950 font-bold' : ''
              }`}
            >
              Submit Feedback
            </button>
            <button
              onClick={() => handleNav('anti-bullying')}
              className={`text-left px-3 py-2 rounded-lg text-rose-700 font-bold hover:bg-rose-50 ${
                currentView === 'anti-bullying' ? 'bg-rose-50 text-rose-800 font-bold' : ''
              }`}
            >
              Report Bullying (Safe Haven)
            </button>
            <button
              onClick={() => handleNav('check')}
              className={`text-left px-3 py-2 rounded-lg hover:bg-slate-100 ${
                currentView === 'check' ? 'bg-slate-100 text-slate-950 font-bold' : ''
              }`}
            >
              Check My Feedback
            </button>
            <button
              onClick={() => handleNav('guidelines')}
              className={`text-left px-3 py-2 rounded-lg hover:bg-slate-100 ${
                currentView === 'guidelines' ? 'bg-slate-100 text-slate-950 font-bold' : ''
              }`}
            >
              Guidelines
            </button>
            <button
              onClick={() => handleNav('privacy')}
              className={`text-left px-3 py-2 rounded-lg hover:bg-slate-100 ${
                currentView === 'privacy' ? 'bg-slate-100 text-slate-950 font-bold' : ''
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`text-left px-3 py-2 rounded-lg hover:bg-slate-100 ${
                currentView === 'about' ? 'bg-slate-100 text-slate-950 font-bold' : ''
              }`}
            >
              About VOICE
            </button>

            <div className="pt-2 border-t border-slate-200 mt-2">
              {!isStaffOrDev ? (
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left w-full px-3 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>SBO Officer & Staff Sign In</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left w-full px-3 py-2 text-xs text-red-600 font-medium flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Authorized Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
