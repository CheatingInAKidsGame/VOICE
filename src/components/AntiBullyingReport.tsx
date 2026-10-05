import React, { useState } from 'react';
import { AnonymousFeedback, BullyingCategory } from '../types';
import { FeedbackStore } from '../services/feedbackStore';
import { ShieldAlert, Lock, AlertTriangle, Send, CheckCircle2, EyeOff, Info, Paperclip, X, FileCheck, Image as ImageIcon } from 'lucide-react';

interface AntiBullyingReportProps {
  onSuccess: (feedback: AnonymousFeedback) => void;
  onNavigateHome: () => void;
}

export const AntiBullyingReport: React.FC<AntiBullyingReportProps> = ({
  onSuccess,
  onNavigateHome,
}) => {
  const [perspective, setPerspective] = useState<'I am experiencing this myself' | 'I am a friend / bystander witnessing this'>('I am experiencing this myself');
  const [bullyingCategory, setBullyingCategory] = useState<BullyingCategory>('Verbal (Insults, Taunting, Slurs, Name-Calling)');
  const [section, setSection] = useState('');
  const [location, setLocation] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [message, setMessage] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<{
    name: string;
    size: number;
    type: string;
    dataUrl: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 8MB limit
    if (file.size > 8 * 1024 * 1024) {
      setFileError('File exceeds 8MB limit. Please choose a smaller image or document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setEvidenceFile({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: event.target.result,
        });
      }
    };
    reader.onerror = () => {
      setFileError('Could not read file. Please try another format.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setEvidenceFile(null);
    setFileError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Please describe what is happening so the guidance committee can take appropriate action.');
      return;
    }

    if (message.length < 15) {
      setError('Please provide at least 15 characters describing the situation.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const result = FeedbackStore.submit({
          recipient: 'Guidance & Anti-Bullying Committee',
          category: 'Anti-Bullying Incident',
          section: section.trim() || 'General / Unspecified Cohort',
          message: message.trim(),
          isBullyingReport: true,
          bullyingCategory,
          reporterPerspective: perspective,
          incidentLocation: location.trim() || 'Unspecified Campus Location',
          approximateTimeframe: timeframe.trim() || 'Unspecified Timeframe',
          evidenceFile: evidenceFile || undefined,
        });

        setIsSubmitting(false);
        onSuccess(result.feedback);
      } catch {
        setIsSubmitting(false);
        setError('An unexpected error occurred while transmitting your report. Please try again.');
      }
    }, 450);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner / Empathy Callout */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3 shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Safe Haven · 100% Confidential Anti-Bullying Space</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Report Bullying Without Anyone Knowing
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          You are protected here. Whether you are experiencing bullying yourself or witnessing someone else suffer, you can speak up safely. No one will know who submitted this report.
        </p>
      </div>

      {/* Safety Reassurance Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 mb-8 border border-slate-800 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <EyeOff className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm">
            <h3 className="font-bold text-white text-base">
              Our Zero-Exposure Guarantee
            </h3>
            <p className="text-slate-300 leading-relaxed">
              We do <strong>not</strong> collect your name, student ID, IP address, or device fingerprint. Your report is routed directly to the <strong>Guidance Counselor & SBO Student Safety Committee</strong> as an urgent priority without revealing your identity.
            </p>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Step 1: Perspective */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Who are you reporting for? <span className="text-rose-600">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPerspective('I am experiencing this myself')}
              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                perspective === 'I am experiencing this myself'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-semibold'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <span className="block font-bold">I am experiencing this myself</span>
              <span className={`text-xs block mt-0.5 ${perspective === 'I am experiencing this myself' ? 'text-slate-300' : 'text-slate-500'}`}>
                I need help and want this behavior stopped discreetly.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPerspective('I am a friend / bystander witnessing this')}
              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                perspective === 'I am a friend / bystander witnessing this'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-semibold'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <span className="block font-bold">I am witnessing this happen to someone</span>
              <span className={`text-xs block mt-0.5 ${perspective === 'I am a friend / bystander witnessing this' ? 'text-slate-300' : 'text-slate-500'}`}>
                I see a fellow student being harmed or targeted.
              </span>
            </button>
          </div>
        </div>

        {/* Step 2: Bullying Type */}
        <div>
          <label htmlFor="bullying-category" className="block text-sm font-semibold text-slate-900 mb-1.5">
            What type of bullying is taking place? <span className="text-rose-600">*</span>
          </label>
          <select
            id="bullying-category"
            value={bullyingCategory}
            onChange={(e) => setBullyingCategory(e.target.value as BullyingCategory)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
            required
          >
            <option value="Verbal (Insults, Taunting, Slurs, Name-Calling)">
              Verbal (Insults, Taunting, Slurs, Name-Calling)
            </option>
            <option value="Cyberbullying (Social Media, Group Chats, Doxxing)">
              Cyberbullying (Social Media, Group Chats, Doxxing)
            </option>
            <option value="Physical (Pushing, Tripping, Damaging Belongings)">
              Physical (Pushing, Tripping, Damaging Belongings)
            </option>
            <option value="Social Exclusion & Rumor Spreading">
              Social Exclusion & Rumor Spreading
            </option>
            <option value="Intimidation & Extortion">
              Intimidation & Extortion (Taking money/belongings, threats)
            </option>
            <option value="Other Harassment">
              Other Harassment
            </option>
          </select>
        </div>

        {/* Step 3: Location & Timeframe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bullying-location" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Where does this happen?
            </label>
            <input
              id="bullying-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. 2nd floor hallway, PE locker room, or Instagram chat"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="bullying-time" className="block text-sm font-semibold text-slate-900 mb-1.5">
              When does it usually happen?
            </label>
            <input
              id="bullying-time"
              type="text"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="e.g. During recess, right after 4:30 PM dismissal"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Step 4: Section / Grade Level involved */}
        <div>
          <label htmlFor="bullying-section" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Grade Level / Section Involved
          </label>
          <input
            id="bullying-section"
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="e.g. Grade 9 - St. Clare or Senior High ICT"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Helps guidance counselors identify which floor or cohort requires proctor monitoring. Do not enter your own name.
          </span>
        </div>

        {/* Step 5: Incident Description */}
        <div>
          <label htmlFor="bullying-details" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Please describe what is happening <span className="text-rose-600">*</span>
          </label>
          <textarea
            id="bullying-details"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the behavior or events as objectively as possible. What was said or done? How often does it occur? Remember: do NOT include your own name or contact details."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none resize-y"
            required
          />
        </div>

        {/* Step 6: Attach Evidence (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-900">
              Attach Evidence <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <span className="text-[11px] text-slate-500">Max 8MB · Images, PDFs, Audio</span>
          </div>

          {!evidenceFile ? (
            <div className="relative border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 rounded-xl p-5 text-center transition-colors">
              <input
                id="evidence-file-input"
                type="file"
                accept="image/*,.pdf,.txt,audio/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="w-9 h-9 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  Click or drag screenshots, photos, notes, or chat logs
                </div>
                <div className="text-[11px] text-slate-500">
                  Screenshots of messages, damaged belongings, or written notes
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3 overflow-hidden">
                {evidenceFile.type.startsWith('image/') ? (
                  <img
                    src={evidenceFile.dataUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-6 h-6 text-slate-600" />
                  </div>
                )}
                <div className="overflow-hidden text-xs">
                  <span className="font-bold text-slate-900 block truncate max-w-xs sm:max-w-md">
                    {evidenceFile.name}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {formatFileSize(evidenceFile.size)} · {evidenceFile.type || 'Document'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                title="Remove attached file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {fileError && (
            <p className="text-xs text-rose-600 mt-1.5">{fileError}</p>
          )}

          <span className="text-[11px] text-slate-500 mt-1.5 block">
            🔒 Privacy guarantee: Device EXIF metadata and author tags are stripped automatically to safeguard your anonymity.
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Urgent physical danger advisory */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Immediate Safety Notice:</strong> If anyone is in immediate physical danger right at this moment, please seek out a trusted teacher, principal, school nurse, or security officer on campus immediately.
          </p>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 underline cursor-pointer"
          >
            Cancel and Return Home
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-3 text-sm font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting confidentially...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Confidential Bullying Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
