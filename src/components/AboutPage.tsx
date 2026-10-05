import React from 'react';
import { ShieldCheck, Heart, Sparkles, MessageCircle, HelpCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface AboutPageProps {
  onNavigateSubmit: () => void;
  onNavigateBullying: () => void;
  onNavigateGuidelines: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateSubmit,
  onNavigateBullying,
  onNavigateGuidelines,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header - Pure Typography, No Logos, No AI Images */}
      <div className="text-center mb-10">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
          ABOUT VOICE
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
          A Bridge Between Students & School Leadership
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          VOICE was created as a student initiative to give every student a protected, constructive, and untraceable channel to share thoughts, improve campus life, and report bullying safely.
        </p>
      </div>

      {/* Core Philosophy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-10 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Our Guiding Philosophy</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            VOICE is not designed as a place where students attack people anonymously. It is designed to be a safe, constructive bridge between students and the people responsible for improving the school.
          </p>
        </div>

        {/* 4 Pillars Formula */}
        <div className="p-4 bg-slate-900 text-white rounded-xl text-center">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
            Our Core Formula
          </span>
          <p className="text-lg sm:text-xl font-extrabold tracking-wide">
            Honesty + Respect + Privacy + Accountability
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            What You Should Feel Free to Express:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              '“Something is wrong with our classroom setup.”',
              '“I have an idea for our upcoming school festival.”',
              '“I disagree with this recent policy decision.”',
              '“This is something the SBO should improve.”',
              '“This teacher or staff member is doing something really well.”',
              '“Someone is being bullied and needs help right now.”',
            ].map((quote, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 italic"
              >
                {quote}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            ...without feeling that you will immediately be judged or targeted for speaking up.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-10 space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">
              Do I have to register or create an account?
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              No. VOICE does not require accounts or logins for students. When you submit feedback or a bullying incident, you receive an 8-character Response Code that lets you check for replies privately.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">
              Can anyone find out who submitted a bullying report?
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              No. Incident reports do not store student IDs, names, or IP addresses. The report is delivered securely to the Guidance Counselor and SBO Safety Committee without sender identity.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">
              How does the SBO respond if they don't know who I am?
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Officers post official replies to the Feedback ID. You can enter your private Response Code in the "Check My Feedback" tab to view their reply at any time.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">
              Who has access to the officer and developer controls?
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Access is protected with cryptographic security passkeys. Only designated SBO officers and the system administrator can sign into the management consoles.
            </p>
          </div>
        </div>
      </div>

      {/* Tagline Callout Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4 shadow-md">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          VOICE
        </p>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          “Speak freely. Be heard. Stay anonymous.”
        </h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto">
          Take part in shaping our school today. Your constructive ideas guide real change.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onNavigateSubmit}
            className="px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Submit Feedback Now
          </button>
          <button
            onClick={onNavigateBullying}
            className="px-6 py-2.5 text-xs sm:text-sm font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/50 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Report Bullying Privately
          </button>
          <button
            onClick={onNavigateGuidelines}
            className="px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Read Guidelines
          </button>
        </div>
      </div>
    </div>
  );
};
