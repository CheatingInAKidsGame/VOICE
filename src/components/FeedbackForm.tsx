import React, { useState } from 'react';
import { Recipient, FeedbackType, AnonymousFeedback } from '../types';
import { FeedbackStore } from '../services/feedbackStore';
import { Lock, ShieldCheck, AlertCircle, Info, Send, ShieldAlert } from 'lucide-react';

interface FeedbackFormProps {
  onSuccess: (feedback: AnonymousFeedback) => void;
  onViewGuidelines: () => void;
  onNavigateBullying: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSuccess,
  onViewGuidelines,
  onNavigateBullying,
}) => {
  const [recipient, setRecipient] = useState<Recipient>('General School Feedback');
  const [section, setSection] = useState('');
  const [category, setCategory] = useState<FeedbackType>('Suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_CHARS = 2000;

  // Sensitive info detection regex
  const containsEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(message);
  const containsPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(message);
  const containsPossibleId = /\b(ID|SN|LRN|STUDENT\s*#?)[:\s-]*\d{5,12}\b/i.test(message);

  const hasPrivacyWarning = containsEmail || containsPhone || containsPossibleId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Please enter your feedback message.');
      return;
    }

    if (message.length < 10) {
      setError('Please provide at least 10 characters so your thoughts are clear.');
      return;
    }

    setIsSubmitting(true);

    try {
      setTimeout(() => {
        const result = FeedbackStore.submit({
          recipient,
          category,
          section: section.trim() || 'General / Unspecified',
          message: message.trim(),
        });
        setIsSubmitting(false);
        onSuccess(result.feedback);
      }, 400);
    } catch {
      setIsSubmitting(false);
      setError('An unexpected error occurred while saving your feedback. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Title Card */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
          <span>Anonymous Submission Active</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Submit Anonymous Feedback
        </h2>
        <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto">
          Share your suggestions, questions, concerns, or appreciation. No login or identity verification required.
        </p>
      </div>

      {/* Quick Anti-Bullying banner */}
      <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-rose-950 font-medium">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Reporting a bullying incident? Use our specialized, high-urgency channel.</span>
        </div>
        <button
          type="button"
          onClick={onNavigateBullying}
          className="text-rose-700 font-bold hover:underline shrink-0 cursor-pointer"
        >
          Bullying Safe Haven →
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Recipient Dropdown */}
        <div>
          <label htmlFor="recipient-select" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Who is your feedback for? <span className="text-slate-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Select the body responsible for reviewing this topic.
          </p>
          <select
            id="recipient-select"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value as Recipient)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
            required
          >
            <option value="General School Feedback">General School Feedback</option>
            <option value="SBO">SBO (Student Body Organization)</option>
            <option value="SBO Officers">SBO Officers</option>
            <option value="Guidance & Anti-Bullying Committee">Guidance & Anti-Bullying Committee</option>
            <option value="Teacher">Teacher</option>
            <option value="School Staff">School Staff</option>
            <option value="School Administration">School Administration</option>
            <option value="Specific Department">Specific Department</option>
          </select>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Submissions are addressed collectively to bodies, not individual personal profiles.
          </span>
        </div>

        {/* Section Field */}
        <div>
          <label htmlFor="section-input" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Your Section <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="section-input"
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Example: Grade 11 - ICT A"
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
            maxLength={60}
          />
          <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Your section helps the SBO understand which parts of the student community may be affected by an issue. Do not enter your name or other identifying information here. The system does not automatically connect your section to your identity.
            </p>
          </div>
        </div>

        {/* Feedback Type Dropdown */}
        <div>
          <label htmlFor="category-select" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Feedback Type <span className="text-slate-500">*</span>
          </label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as FeedbackType)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
            required
          >
            <option value="Suggestion">Suggestion</option>
            <option value="Concern">Concern</option>
            <option value="Complaint">Complaint</option>
            <option value="Appreciation">Appreciation</option>
            <option value="Question">Question</option>
            <option value="School Improvement">School Improvement</option>
            <option value="Event Feedback">Event Feedback</option>
            <option value="Student Experience">Student Experience</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Message Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="feedback-text" className="block text-sm font-semibold text-slate-900">
              What would you like to say? <span className="text-slate-500">*</span>
            </label>
            <span
              className={`text-xs tabular-nums font-mono ${
                message.length > MAX_CHARS * 0.9 ? 'text-amber-600 font-bold' : 'text-slate-400'
              }`}
            >
              {message.length} / {MAX_CHARS}
            </span>
          </div>

          <textarea
            id="feedback-text"
            rows={6}
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setMessage(e.target.value);
              }
            }}
            placeholder="Share your thoughts honestly and respectfully. You don't need to include your name."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none resize-y"
            required
          />

          {hasPrivacyWarning && (
            <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Privacy Recommendation:</span>
                We detected what appears to be an email address, phone number, or student ID in your draft. To protect your anonymity, please avoid including identifying details.
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onViewGuidelines}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 underline cursor-pointer"
          >
            Review Community Guidelines
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting securely...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Anonymously</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
