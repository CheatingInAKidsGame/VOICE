import React from 'react';
import { Lock, MessageSquare, AlertTriangle, CheckCircle2, XCircle, ArrowRight, EyeOff, ShieldAlert } from 'lucide-react';

interface OpeningGuidelinesProps {
  onProceed: () => void;
  onViewPrivacy: () => void;
  onNavigateBullying?: () => void;
  embedded?: boolean;
}

export const OpeningGuidelines: React.FC<OpeningGuidelinesProps> = ({
  onProceed,
  onViewPrivacy,
  onNavigateBullying,
  embedded = false,
}) => {
  return (
    <div className={`max-w-4xl mx-auto ${embedded ? 'py-4' : 'py-8 px-4 sm:px-6'}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
          BEFORE YOU SUBMIT
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-balance">
          Community Guidelines & Privacy Information
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          VOICE is built to protect your identity while fostering honest, constructive dialogue to improve our school. Please review these essential standards before submitting.
        </p>
      </div>

      <div className="space-y-6">
        {/* Anti-Bullying Special Notice */}
        {onNavigateBullying && (
          <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-rose-950 text-sm sm:text-base">
                  Looking to report bullying or harassment?
                </h3>
                <p className="text-xs sm:text-sm text-rose-800/90 mt-0.5 leading-relaxed">
                  We have a dedicated, urgent confidential space specifically for students experiencing or witnessing bullying.
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateBullying}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer text-center"
            >
              Go to Bullying Safe Haven
            </button>
          </div>
        )}

        {/* Section 1: Your Privacy */}
        <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Privacy</h3>
              <p className="text-sm text-slate-500">VOICE is designed with privacy in mind.</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 text-sm text-slate-700 mb-4">
            <p className="font-semibold text-slate-900 mb-2">You do not need to provide:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>Your name</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>Student number</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>Email address</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>Phone number</span>
              </li>
              <li className="flex items-center gap-2 sm:col-span-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>Social media account</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-800">
              • Do not include your personal information in your feedback message.
            </p>
            <p>
              • The system is designed to collect as little information as possible.
            </p>
            <p>
              • The feedback system is engineered so that neither the Product Developer nor SBO Officers can simply look at a submission and see who submitted it.
            </p>
          </div>
        </section>

        {/* Section 2: You Can Speak Honestly */}
        <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">You Can Speak Honestly</h3>
              <p className="text-sm text-slate-500">Constructive criticism is welcome.</p>
            </div>
          </div>

          <div className="text-sm text-slate-700 mb-4">
            <p className="font-semibold text-slate-900 mb-2">You are allowed to share:</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-700">
              {[
                'Suggestions',
                'Concerns',
                'Complaints',
                'Ideas',
                'Experiences',
                'Appreciation',
                'Constructive criticism',
                'Opinions about school policies',
                'Opinions about SBO activities',
                'Opinions about teachers or staff',
                'Ideas for improving the school',
              ].map((item, index) => (
                <span
                  key={index}
                  className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/80 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-sm text-emerald-950">
            <p className="font-medium">
              You do <strong>NOT</strong> have to agree with the SBO or school administration. Constructive criticism and honest feedback are respected and encouraged.
            </p>
          </div>
        </section>

        {/* Section 3: Anonymity Does Not Mean Anything Goes */}
        <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Anonymity Does Not Mean Anything Goes</h3>
              <p className="text-sm text-slate-500">
                Criticize actions, decisions, policies, or experiences, rather than attacking people personally.
              </p>
            </div>
          </div>

          <div className="mb-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900 mb-2">Do not use VOICE to:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              {[
                'Threaten someone',
                'Bully someone',
                'Harass someone',
                "Spread someone's private information",
                'Dox someone',
                'Make credible threats',
                'Target someone with repeated abuse',
                'Spam the platform',
                'Submit malicious content',
                'Impersonate someone',
                'Submit illegal or dangerous content',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
              <div className="flex items-center gap-2 font-bold mb-1 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Allowed Example:</span>
              </div>
              <p className="italic">
                “I think the SBO should announce events earlier because students sometimes don't know about them.”
              </p>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
              <div className="flex items-center gap-2 font-bold mb-1 text-rose-800">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Not Allowed Example:</span>
              </div>
              <p className="italic">
                Personal insults, threats, harassment, or attempts to expose someone's private information.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 & 5: Moderation & Abuse Prevention */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2">Moderation Overview</h4>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
              Feedback may be reviewed by authorized SBO Officers to help identify problems and improve the school.
            </p>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 mb-3">
              <li>• Review and categorize submissions</li>
              <li>• Respond to feedback anonymously</li>
              <li>• Mark feedback as being reviewed or addressed</li>
              <li>• Remove spam or abusive content</li>
              <li>• Issue warnings when necessary</li>
            </ul>
            <p className="text-xs text-slate-500 font-medium border-t border-slate-100 pt-2">
              Note: Constructive criticism is <strong>NOT</strong> removed simply because an officer, teacher, or administrator disagrees with it.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2">Abuse Prevention & Privacy</h4>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
              Security measures prevent malicious bots and repeated harassment. Serious violations may result in:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-700 mb-3">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium">Warning</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium">Temporary Restriction</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium">Temporary Ban</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium">Permanent Ban</span>
            </div>
            <p className="text-xs text-slate-500 font-medium border-t border-slate-100 pt-2">
              Abuse-prevention systems are kept technically separate from feedback. Moderators cannot casually use security logs to identify ordinary anonymous students.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h4 className="font-bold text-base text-white">Protect anonymity while preventing abuse.</h4>
          <p className="text-xs text-slate-300">
            By proceeding, you agree to submit feedback in accordance with our community standards.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onViewPrivacy}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 cursor-pointer transition-colors"
          >
            Read Privacy Architecture
          </button>
          <button
            onClick={onProceed}
            className="flex-1 sm:flex-none px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <span>Agree & Continue to Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
