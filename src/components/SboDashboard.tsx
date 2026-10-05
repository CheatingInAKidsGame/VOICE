import React, { useState, useMemo } from 'react';
import { AnonymousFeedback, FeedbackStatus, FeedbackType, Priority, Recipient } from '../types';
import { FeedbackStore } from '../services/feedbackStore';
import {
  ShieldCheck,
  Search,
  Eye,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Flag,
  X,
  FileText,
  Lock,
  RefreshCw,
  ShieldAlert,
  LogOut,
  Paperclip,
  Trash2,
} from 'lucide-react';

interface SboDashboardProps {
  onFeedbackUpdated?: () => void;
  onSignOut?: () => void;
  isAdmin?: boolean;
}

export const SboDashboard: React.FC<SboDashboardProps> = ({ onFeedbackUpdated, onSignOut, isAdmin = false }) => {
  const [feedbacks, setFeedbacks] = useState<AnonymousFeedback[]>(() => FeedbackStore.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [onlyBullying, setOnlyBullying] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<AnonymousFeedback | null>(null);

  // Response form inside modal
  const [responseText, setResponseText] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleDeleteFeedback = (id: string) => {
    FeedbackStore.deleteFeedback(id);
    setActiveFeedback(null);
    setShowDeleteConfirm(false);
    setActionSuccess('Feedback permanently removed from database.');
    refreshData();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const refreshData = () => {
    const list = FeedbackStore.getAll();
    setFeedbacks(list);
    if (activeFeedback) {
      const updated = list.find((f) => f.id === activeFeedback.id);
      if (updated) setActiveFeedback(updated);
    }
    if (onFeedbackUpdated) onFeedbackUpdated();
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      if (onlyBullying && !item.isBullyingReport) return false;

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesSection = item.section.toLowerCase().includes(query);
        const matchesMessage = item.message.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesId && !matchesSection && !matchesMessage && !matchesCategory) return false;
      }

      // Recipient filter
      if (selectedRecipient !== 'ALL' && item.recipient !== selectedRecipient) return false;

      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;

      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

      // Priority filter
      if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;

      return true;
    });
  }, [feedbacks, onlyBullying, searchTerm, selectedRecipient, selectedStatus, selectedCategory, selectedPriority]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: feedbacks.length,
      submitted: feedbacks.filter((f) => f.status === 'Submitted').length,
      inProgress: feedbacks.filter((f) => f.status === 'In Progress' || f.status === 'Being Reviewed').length,
      addressed: feedbacks.filter((f) => f.status === 'Addressed').length,
      bullyingCount: feedbacks.filter((f) => f.isBullyingReport).length,
    };
  }, [feedbacks]);

  const handleStatusChange = (status: FeedbackStatus) => {
    if (!activeFeedback) return;
    FeedbackStore.updateStatus(activeFeedback.id, status);
    setActionSuccess(`Status updated to "${status}"`);
    refreshData();
    setTimeout(() => setActionSuccess(null), 2500);
  };

  const handlePriorityChange = (priority: Priority) => {
    if (!activeFeedback) return;
    FeedbackStore.updatePriority(activeFeedback.id, priority);
    setActionSuccess(`Priority set to "${priority}"`);
    refreshData();
    setTimeout(() => setActionSuccess(null), 2500);
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedback || !responseText.trim()) return;

    FeedbackStore.addResponse(activeFeedback.id, responseText.trim());
    setResponseText('');
    setActionSuccess('Anonymous official response posted successfully.');
    refreshData();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleFlagAbuse = () => {
    if (!activeFeedback || !flagReason.trim()) return;
    FeedbackStore.flagAbuse(activeFeedback.id, flagReason.trim());
    setShowFlagInput(false);
    setFlagReason('');
    setActionSuccess('Feedback flagged for administrative review.');
    refreshData();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleUnflag = () => {
    if (!activeFeedback) return;
    FeedbackStore.unflagAbuse(activeFeedback.id);
    setActionSuccess('Flag cleared.');
    refreshData();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              VOICE · SBO OFFICER DASHBOARD
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Identity Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            SBO Officer Feedback Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review student submissions, manage resolution status, and send confidential responses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Feedback</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {stats.total}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">New Submissions</span>
          <div className="text-2xl font-bold font-mono text-slate-800 mt-1 tabular-nums">
            {stats.submitted}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Under Review / Active</span>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
            {stats.inProgress}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Addressed / Resolved</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {stats.addressed}
          </div>
        </div>
        {/* Anti-Bullying Reports counter button */}
        <button
          onClick={() => setOnlyBullying(!onlyBullying)}
          className={`p-4 rounded-xl border transition-all text-left cursor-pointer col-span-2 lg:col-span-1 ${
            onlyBullying
              ? 'bg-rose-900 text-white border-rose-900 shadow-sm'
              : 'bg-rose-50/70 border-rose-200 text-rose-950 hover:bg-rose-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Bullying Reports</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono mt-1 tabular-nums">
            {stats.bullyingCount}
          </div>
          <span className="text-[10px] block mt-0.5 opacity-80">
            {onlyBullying ? 'Showing only bullying reports' : 'Click to filter bullying reports'}
          </span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, keyword, section, or category..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>

          <button
            onClick={refreshData}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Refresh records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="text-slate-500 block mb-1">Recipient</label>
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="ALL">All Recipients</option>
              <option value="General School Feedback">General School</option>
              <option value="SBO">SBO</option>
              <option value="SBO Officers">SBO Officers</option>
              <option value="Guidance & Anti-Bullying Committee">Guidance & Anti-Bullying</option>
              <option value="Teacher">Teacher</option>
              <option value="School Staff">School Staff</option>
              <option value="School Administration">Administration</option>
              <option value="Specific Department">Department</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 block mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Being Reviewed">Being Reviewed</option>
              <option value="In Progress">In Progress</option>
              <option value="Addressed">Addressed</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="ALL">All Categories</option>
              <option value="Anti-Bullying Incident">Anti-Bullying Incident</option>
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

          <div>
            <label className="text-slate-500 block mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="ALL">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Feedback Grid / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 text-base">No Submissions Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or filter options.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFeedbacks.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  item.isBullyingReport ? 'bg-rose-50/40 border-l-4 border-l-rose-600' : ''
                }`}
              >
                <div className="space-y-2 flex-1">
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {item.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-bold ${item.isBullyingReport ? 'text-rose-700' : 'text-slate-900'}`}>
                      {item.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>For: {item.recipient}</span>
                    <span aria-hidden="true">·</span>
                    <span>Section: {item.section}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.priority === 'Urgent' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-700 font-black">URGENT PRIORITY</span>
                      </>
                    )}
                    {item.flaggedAsAbuse && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <Flag className="w-3 h-3" />
                          <span>Flagged</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Message Preview */}
                  <p className="text-sm text-slate-800 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  {/* Status indicators */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-900" />
                      <span>Status: <strong className="text-slate-800">{item.status}</strong></span>
                    </span>
                    <span>
                      {item.responses.length} {item.responses.length === 1 ? 'Official Response' : 'Official Responses'}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveFeedback(item);
                      setShowFlagInput(false);
                      setResponseText('');
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-700" />
                    <span>Review & Respond</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review & Respond Modal Drawer */}
      {activeFeedback && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center text-xs ${
                  activeFeedback.isBullyingReport ? 'bg-rose-700 text-white' : 'bg-slate-900 text-white'
                }`}>
                  {activeFeedback.isBullyingReport ? 'SAFE' : 'SBO'}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-900">{activeFeedback.id}</span>
                    <span>·</span>
                    <span>{activeFeedback.category}</span>
                    <span>·</span>
                    <span>{activeFeedback.section}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {activeFeedback.isBullyingReport ? 'Confidential Bullying Incident Review' : 'Feedback Details & Triage'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveFeedback(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Anti-Bullying Specific Case Metadata */}
              {activeFeedback.isBullyingReport && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-950">
                  <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Bullying Incident Context</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                    <div>
                      <span className="font-bold">Reporting Perspective:</span> {activeFeedback.reporterPerspective || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-bold">Category:</span> {activeFeedback.bullyingCategory || 'Harassment'}
                    </div>
                    <div>
                      <span className="font-bold">Location:</span> {activeFeedback.incidentLocation || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-bold">Timeframe:</span> {activeFeedback.approximateTimeframe || 'Not specified'}
                    </div>
                  </div>
                </div>
              )}

              {/* Anti-Dox Notice */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Student Identity Decoupled. Zero personal metadata stored.</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Created {new Date(activeFeedback.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Full Message */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Report Content (Addressed to: {activeFeedback.recipient})
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
                  {activeFeedback.message}
                </div>
              </div>

              {/* Evidence Attachment View (if provided) */}
              {activeFeedback.evidenceFile && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-slate-600" />
                      <span>Attached Evidence: {activeFeedback.evidenceFile.name}</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {(activeFeedback.evidenceFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  {activeFeedback.evidenceFile.type.startsWith('image/') ? (
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-white max-h-80 flex items-center justify-center p-2">
                      <img
                        src={activeFeedback.evidenceFile.dataUrl}
                        alt="Evidence"
                        className="max-h-72 object-contain rounded"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-700 truncate max-w-sm">
                        {activeFeedback.evidenceFile.name}
                      </span>
                      <a
                        href={activeFeedback.evidenceFile.dataUrl}
                        download={activeFeedback.evidenceFile.name}
                        className="text-slate-900 font-bold hover:underline"
                      >
                        Download / Inspect File
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Status and Priority Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Update Progress Status
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Submitted', 'Being Reviewed', 'In Progress', 'Addressed'] as FeedbackStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(st)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                            activeFeedback.status === st
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Set Priority
                  </label>
                  <div className="flex gap-1.5">
                    {(['Normal', 'High', 'Urgent'] as Priority[]).map((pri) => (
                      <button
                        key={pri}
                        type="button"
                        onClick={() => handlePriorityChange(pri)}
                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                          activeFeedback.priority === pri
                            ? pri === 'Urgent'
                              ? 'bg-rose-700 text-white border-rose-700 font-bold'
                              : 'bg-slate-900 text-white border-slate-900 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pri}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prior Responses */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Official Responses ({activeFeedback.responses.length})
                </label>
                {activeFeedback.responses.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                    No official responses have been posted for this student yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeFeedback.responses.map((resp) => (
                      <div key={resp.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800">
                        <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                          <span>{resp.authorLabel}</span>
                          <span className="text-[11px] font-normal text-slate-500">
                            {new Date(resp.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed">{resp.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Compose New Response */}
              <form onSubmit={handleSendResponse} className="space-y-2">
                <label htmlFor="sbo-response-box" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Write Anonymous Official Response
                </label>
                <p className="text-xs text-slate-500">
                  Visible to the student when they enter their confidential Response Code. Your individual identity remains protected.
                </p>
                <textarea
                  id="sbo-response-box"
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="e.g. Thank you for notifying us. The safety committee has dispatched proctors to monitor this hallway..."
                  className="w-full p-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!responseText.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Response to Student</span>
                  </button>
                </div>
              </form>

              {/* Moderation & Flagging Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Constructive criticism should not be removed because of disagreement.
                  </span>
                  {activeFeedback.flaggedAsAbuse ? (
                    <button
                      type="button"
                      onClick={handleUnflag}
                      className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                      Clear Flag
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowFlagInput(!showFlagInput)}
                      className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Flag Inappropriate Abuse</span>
                    </button>
                  )}
                </div>

                {showFlagInput && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-2">
                    <p className="font-semibold text-rose-900">
                      Reason for flagging:
                    </p>
                    <input
                      type="text"
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value)}
                      placeholder="Specify violation of community standards..."
                      className="w-full p-2 bg-white border border-rose-300 rounded-lg text-slate-900 text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowFlagInput(false)}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleFlagAbuse}
                        disabled={!flagReason.trim()}
                        className="px-3 py-1 bg-rose-600 text-white rounded-lg font-medium cursor-pointer disabled:opacity-50"
                      >
                        Confirm Flag
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                {isAdmin && (
                  showDeleteConfirm ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDeleteFeedback(activeFeedback.id)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                      >
                        Confirm Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl cursor-pointer"
                      title="Permanently remove from database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Feedback</span>
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveFeedback(null);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
