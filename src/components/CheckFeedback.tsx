import React, { useState } from 'react';
import { AnonymousFeedback, FeedbackStatus } from '../types';
import { FeedbackStore } from '../services/feedbackStore';
import { Search, Shield, Lock, CheckCircle2, AlertCircle, MessageSquare, CornerDownRight, ShieldAlert } from 'lucide-react';

interface CheckFeedbackProps {
  initialCode?: string;
  onNavigateSubmit: () => void;
  onNavigateBullying?: () => void;
}

export const CheckFeedback: React.FC<CheckFeedbackProps> = ({
  initialCode = '',
  onNavigateSubmit,
  onNavigateBullying,
}) => {
  const [code, setCode] = useState(initialCode);
  const [feedback, setFeedback] = useState<AnonymousFeedback | null>(() => {
    if (initialCode) {
      return FeedbackStore.getByCode(initialCode) || null;
    }
    return null;
  });
  const [searched, setSearched] = useState(Boolean(initialCode));
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setSearched(true);

    const found = FeedbackStore.getByCode(code.trim());
    if (found) {
      setFeedback(found);
      setNotFound(false);
    } else {
      setFeedback(null);
      setNotFound(true);
    }
  };

  const statusSteps: FeedbackStatus[] = ['Submitted', 'Being Reviewed', 'In Progress', 'Addressed'];

  const getStepIndex = (status: FeedbackStatus) => {
    return statusSteps.indexOf(status);
  };

  const getStatusColor = (status: FeedbackStatus) => {
    switch (status) {
      case 'Submitted':
        return 'text-slate-600 bg-slate-100 border-slate-300';
      case 'Being Reviewed':
        return 'text-amber-800 bg-amber-50 border-amber-300';
      case 'In Progress':
        return 'text-sky-800 bg-sky-50 border-sky-300';
      case 'Addressed':
        return 'text-emerald-800 bg-emerald-50 border-emerald-300';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mb-3">
          <Lock className="w-3.5 h-3.5 text-slate-700" />
          <span>Private Status Inquiry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Check My Feedback or Report Status
        </h1>
        <p className="mt-2 text-slate-600 text-sm max-w-md mx-auto">
          Enter your confidential 8-character Response Code or Tracking ID to check status and read responses.
        </p>
      </div>

      {/* Code Search Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <label htmlFor="response-code-input" className="block text-sm font-semibold text-slate-900">
            Enter Your Response Code
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="response-code-input"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. DEMO-2026 or SAFE-2026"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-base font-mono uppercase tracking-wider text-slate-900 placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-slate-200" />
              <span>Check Status</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
            <span>Lost your response code? Response codes are private and only held on your device.</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNavigateSubmit}
                className="text-slate-900 hover:underline font-semibold cursor-pointer"
              >
                Submit New Feedback
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Not Found State */}
      {notFound && searched && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 text-center text-rose-900 mb-8 animate-in fade-in">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h3 className="font-bold text-base">No Records Found for this Code</h3>
          <p className="text-xs sm:text-sm text-rose-700 mt-1 max-w-md mx-auto">
            Please double-check your code format (<code className="font-mono bg-rose-100 px-1 py-0.5 rounded">XXXX-XXXX</code>). If you recently submitted, verify that all characters were typed accurately.
          </p>
        </div>
      )}

      {/* Found Feedback Details */}
      {feedback && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Status & Lifecycle Timeline Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Reference Tracking ID</span>
                <span className="font-mono text-lg font-black text-slate-900 tabular-nums">
                  {feedback.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Current Status:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(feedback.status)}`}>
                  ● {feedback.status}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-4 gap-2 text-center">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(feedback.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                          isCompleted
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-slate-200' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs ${
                          isCurrent
                            ? 'font-bold text-slate-900'
                            : isCompleted
                            ? 'font-medium text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submission Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span>Addressed to: <strong className="text-slate-800">{feedback.recipient}</strong></span>
                <span>·</span>
                <span>Type: <strong className="text-slate-800">{feedback.category}</strong></span>
              </div>
              <div>
                <span>Section: <strong className="text-slate-800">{feedback.section}</strong></span>
              </div>
            </div>

            {feedback.isBullyingReport && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Confidential Anti-Bullying Case Protocol Active</span>
                </span>
                <p className="text-rose-800">
                  Location: {feedback.incidentLocation || 'Campus area'} · Timeframe: {feedback.approximateTimeframe || 'Recent'}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Your Report / Feedback
              </h4>
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {feedback.message}
              </p>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Submitted: {new Date(feedback.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero personal data attached</span>
              </span>
            </div>
          </div>

          {/* Official Responses Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Official Responses
                </h3>
              </div>
              <span className="text-xs text-slate-500 tabular-nums font-mono">
                {feedback.responses.length} {feedback.responses.length === 1 ? 'Response' : 'Responses'}
              </span>
            </div>

            {feedback.responses.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                <p className="text-sm font-medium text-slate-700">No response posted yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Authorized officers and guidance staff review new submissions during dedicated evaluation sessions. Check back again later with your Response Code.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.responses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <CornerDownRight className="w-4 h-4 text-slate-600" />
                        <span>{resp.authorLabel}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(resp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed pt-1">
                      {resp.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
