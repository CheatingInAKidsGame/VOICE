/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, UserRole, AnonymousFeedback } from './types';
import { FeedbackStore } from './services/feedbackStore';
import { Navbar } from './components/Navbar';
import { WelcomeModal } from './components/WelcomeModal';
import { OpeningGuidelines } from './components/OpeningGuidelines';
import { FeedbackForm } from './components/FeedbackForm';
import { AntiBullyingReport } from './components/AntiBullyingReport';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { CheckFeedback } from './components/CheckFeedback';
import { SboDashboard } from './components/SboDashboard';
import { DeveloperConsole } from './components/DeveloperConsole';
import { PrivacyPage } from './components/PrivacyPage';
import { AboutPage } from './components/AboutPage';
import { HeroHome } from './components/HeroHome';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { IntroAnimation } from './components/IntroAnimation';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => FeedbackStore.getCurrentSession().role);
  const [showIntroAnimation, setShowIntroAnimation] = useState<boolean>(() => !FeedbackStore.hasSeenWelcome());
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [hasAgreedToGuidelines, setHasAgreedToGuidelines] = useState<boolean>(false);
  const [recentSubmission, setRecentSubmission] = useState<AnonymousFeedback | null>(null);
  const [checkInitialCode, setCheckInitialCode] = useState<string>('');

  const handleIntroComplete = () => {
    setShowIntroAnimation(false);
    setShowWelcome(true);
  };

  const handleWelcomeContinue = () => {
    FeedbackStore.setSeenWelcome();
    setShowWelcome(false);
    setCurrentView('guidelines');
  };

  const handleWelcomeLearnPrivacy = () => {
    FeedbackStore.setSeenWelcome();
    setShowWelcome(false);
    setCurrentView('privacy');
  };

  const handleStartSubmit = () => {
    if (!hasAgreedToGuidelines) {
      setCurrentView('guidelines');
    } else {
      setCurrentView('submit');
    }
  };

  const handleGuidelinesProceed = () => {
    setHasAgreedToGuidelines(true);
    setCurrentView('submit');
  };

  const handleSubmissionSuccess = (feedback: AnonymousFeedback) => {
    setRecentSubmission(feedback);
  };

  const handleCheckCodeFromSuccess = (code: string) => {
    setRecentSubmission(null);
    setCheckInitialCode(code);
    setCurrentView('check');
  };

  const handleSignOut = () => {
    FeedbackStore.clearSession();
    setCurrentRole('student');
    setCurrentView('home');
  };

  const handleAuthSuccess = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'product_developer') {
      setCurrentView('dev-console');
    } else if (role === 'sbo_officer') {
      setCurrentView('sbo-portal');
    }
  };

  const handleResetData = () => {
    FeedbackStore.resetToDefaults();
    alert('System data has been reset to defaults.');
    window.location.reload();
  };

  const handleNavigate = (view: ViewMode) => {
    // If student attempts to navigate directly to privileged views without passkey, trigger AuthModal
    if (view === 'sbo-portal' && currentRole !== 'sbo_officer' && currentRole !== 'product_developer') {
      setShowAuthModal(true);
      return;
    }
    if (view === 'dev-console' && currentRole !== 'product_developer') {
      setShowAuthModal(true);
      return;
    }

    if (view === 'submit' && !hasAgreedToGuidelines) {
      setCurrentView('guidelines');
      return;
    }

    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* Primary Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentRole={currentRole}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HeroHome
            onSubmitClick={handleStartSubmit}
            onBullyingClick={() => setCurrentView('anti-bullying')}
            onCheckClick={() => {
              setCheckInitialCode('');
              setCurrentView('check');
            }}
            onGuidelinesClick={() => setCurrentView('guidelines')}
            onPrivacyClick={() => setCurrentView('privacy')}
          />
        )}

        {currentView === 'guidelines' && (
          <OpeningGuidelines
            onProceed={handleGuidelinesProceed}
            onViewPrivacy={() => setCurrentView('privacy')}
            onNavigateBullying={() => setCurrentView('anti-bullying')}
          />
        )}

        {currentView === 'submit' && (
          <FeedbackForm
            onSuccess={handleSubmissionSuccess}
            onViewGuidelines={() => setCurrentView('guidelines')}
            onNavigateBullying={() => setCurrentView('anti-bullying')}
          />
        )}

        {/* Dedicated Anti-Bullying Reporting Safe Haven */}
        {currentView === 'anti-bullying' && (
          <AntiBullyingReport
            onSuccess={handleSubmissionSuccess}
            onNavigateHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'check' && (
          <CheckFeedback
            initialCode={checkInitialCode}
            onNavigateSubmit={handleStartSubmit}
            onNavigateBullying={() => setCurrentView('anti-bullying')}
          />
        )}

        {currentView === 'privacy' && <PrivacyPage />}

        {currentView === 'about' && (
          <AboutPage
            onNavigateSubmit={handleStartSubmit}
            onNavigateBullying={() => setCurrentView('anti-bullying')}
            onNavigateGuidelines={() => setCurrentView('guidelines')}
          />
        )}

        {/* Privileged Portals */}
        {currentView === 'sbo-portal' && (
          <SboDashboard onSignOut={handleSignOut} isAdmin={currentRole === 'product_developer'} />
        )}

        {currentView === 'dev-console' && (
          <DeveloperConsole onResetData={handleResetData} onSignOut={handleSignOut} />
        )}
      </main>

      {/* Intro Animation: Voice (“Speak freely. Be heard. Stay anonymous.”) */}
      {showIntroAnimation && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

      {/* Full-screen Opening Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onContinue={handleWelcomeContinue}
        onLearnPrivacy={handleWelcomeLearnPrivacy}
        onClose={() => {
          FeedbackStore.setSeenWelcome();
          setShowWelcome(false);
        }}
      />

      {/* Passkey Authentication Modal for SBO & Developer */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Submission Success Confirmation Modal */}
      {recentSubmission && (
        <SubmissionSuccessModal
          feedback={recentSubmission}
          onCheckStatus={handleCheckCodeFromSuccess}
          onDone={() => {
            setRecentSubmission(null);
            setCurrentView('home');
          }}
        />
      )}

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenWelcome={() => setShowWelcome(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        currentRole={currentRole}
        onSignOut={handleSignOut}
        onPlayIntro={() => setShowIntroAnimation(true)}
      />
    </div>
  );
}
