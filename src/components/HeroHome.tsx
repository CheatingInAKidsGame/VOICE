import React, { useMemo } from 'react';
import { Lock, MessageSquare, Sprout, ArrowRight, ShieldCheck, CheckCircle2, Search, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';
import { FeedbackStore } from '../services/feedbackStore';

interface HeroHomeProps {
  onSubmitClick: () => void;
  onBullyingClick: () => void;
  onCheckClick: () => void;
  onGuidelinesClick: () => void;
  onPrivacyClick: () => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onSubmitClick,
  onBullyingClick,
  onCheckClick,
  onGuidelinesClick,
  onPrivacyClick,
}) => {
  const addressedFeedbacks = useMemo(() => {
    return FeedbackStore.getAll().filter((f) => f.status === 'Addressed');
  }, []);
  return (
    <div className="space-y-14 py-6 sm:py-12">
      {/* Hero Section - Pure Typographic Craft */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Anti-Slop Discipline: Clean typographic kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
          <span>VOICE · Safe & Anonymous Student Channel</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight text-balance leading-tight">
          Your Voice Matters.
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
          Speak honestly. Share your ideas. Help improve your school.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSubmitClick}
            className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            <span>Submit Anonymous Feedback</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={onBullyingClick}
            className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Report Bullying (Safe Haven)</span>
          </button>

          <button
            onClick={onCheckClick}
            className="w-full sm:w-auto px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Check Feedback</span>
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          No sign-in or student ID required · Response codes let you read official SBO replies
        </p>
      </section>

      {/* Dedicated Safe Haven Banner for Anti-Bullying */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-rose-900/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CONFIDENTIAL SAFE HAVEN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Experiencing or Witnessing Bullying?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every student deserves to feel safe at school. You can submit a private, untraceable incident report directly to the Guidance Counselor and SBO Safety Committee.
            </p>
          </div>

          <button
            onClick={onBullyingClick}
            className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Report Privately Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Three Feature Cards Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
            CORE PRINCIPLES
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How VOICE Works For You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Anonymous */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Anonymous</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Share your thoughts without publicly revealing your identity. No names, student numbers, or email addresses are tied to your submission.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Decoupled database architecture</span>
            </div>
          </div>

          {/* Card 2: Honest */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4 shadow-xs">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Honest</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Give constructive criticism and tell us what students really experience. You do not have to agree with the SBO or administration.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-700" />
              <span>Respectful discourse welcomed</span>
            </div>
          </div>

          {/* Card 3: Actionable */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center mb-4 shadow-xs">
                <Sprout className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Actionable</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Help the SBO identify problems and find ways to improve the student experience. Track resolution status in real-time with your code.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real outcomes & accountability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Impact / Recent Initiatives */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                PROVEN IMPACT
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Recent Student-Driven Improvements
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                See how anonymous suggestions from students have already sparked concrete change.
              </p>
            </div>
            <button
              onClick={onCheckClick}
              className="text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Look up your code</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-6">
            {addressedFeedbacks.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="font-bold text-slate-800 text-sm block">
                  Platform Ready for Submissions
                </span>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first to share an idea, question, or concern. As the SBO reviews and resolves feedback, addressed initiatives will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addressedFeedbacks.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{item.category}</span>
                      <span className="text-emerald-700 font-bold">● Addressed</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      “{item.message}”
                    </p>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      Target: {item.recipient} · {item.section}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Tagline & Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 text-white shadow-md space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            VOICE
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Speak freely. Be heard. Stay anonymous.
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Your voice is essential to creating a safer, better school experience for all students.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onSubmitClick}
              className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
            >
              <span>Submit General Feedback</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onBullyingClick}
              className="px-6 py-3 text-xs sm:text-sm font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900/80 border border-rose-700/50 rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Report Bullying Incident</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
