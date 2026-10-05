import React, { useState } from 'react';
import { AnonymousFeedback } from '../types';
import { CheckCircle2, Copy, Check, ArrowRight, ShieldCheck, Lock, ShieldAlert } from 'lucide-react';

interface SubmissionSuccessModalProps {
  feedback: AnonymousFeedback;
  onCheckStatus: (code: string) => void;
  onDone: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  feedback,
  onCheckStatus,
  onDone,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (text: string, isCode: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const isBullying = feedback.isBullyingReport;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Subtle decorative top border */}
        <div className={`h-2 w-full ${isBullying ? 'bg-rose-600' : 'bg-slate-900'}`} />

        <div className="p-6 sm:p-8 text-center">
          {/* Success Icon */}
          <div className={`mx-auto w-14 h-14 mb-4 rounded-2xl flex items-center justify-center border shadow-xs ${
            isBullying ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}>
            {isBullying ? <ShieldAlert className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
          </div>

          <p className={`text-xs font-black uppercase tracking-wider mb-1 ${
            isBullying ? 'text-rose-700' : 'text-slate-500'
          }`}>
            {isBullying ? 'SAFE HAVEN CONFIRMATION' : 'SUBMISSION CONFIRMED'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your voice has been heard.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {isBullying
              ? 'Your confidential bullying report was submitted securely without revealing your identity.'
              : 'Your feedback has been submitted anonymously.'}
          </p>

          {/* Secure Credential Cards */}
          <div className="my-6 space-y-3 text-left">
            {/* Feedback ID Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Tracking ID
                </span>
                <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                  {feedback.id}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(feedback.id, false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Copy ID"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Code Card */}
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <Lock className="w-3 h-3 text-slate-600" />
                  <span>Private Response Code</span>
                </div>
                <span className="font-mono text-lg font-black text-slate-950 tracking-wider tabular-nums">
                  {feedback.responseCode}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(feedback.responseCode, true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                title="Copy Response Code"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Explanation Callout */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left mb-6 space-y-1.5">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Save your response code somewhere private</span>
            </p>
            <p className="leading-relaxed">
              {isBullying
                ? 'You can use it at any time in "Check My Feedback" to check if the Guidance Counselor or Safety Committee has updated the case or sent a confidential follow-up message.'
                : 'You can use it later to check whether the SBO has responded. No account or password is created.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onCheckStatus(feedback.responseCode)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Check Status Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDone}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
