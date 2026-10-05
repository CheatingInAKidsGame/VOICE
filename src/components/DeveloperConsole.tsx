import React, { useState, useMemo } from 'react';
import { AnonymousFeedback, FeedbackStatus, FeedbackType, Priority, Recipient, SecurityEvent } from '../types';
import { FeedbackStore } from '../services/feedbackStore';
import {
  ShieldAlert,
  Server,
  Database,
  Lock,
  Key,
  Terminal,
  RefreshCw,
  Cpu,
  Sliders,
  CheckCircle2,
  Trash2,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Search,
  MessageSquare,
  Send,
  Flag,
  X,
  FileText,
  Paperclip,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

interface DeveloperConsoleProps {
  onResetData: () => void;
  onSignOut?: () => void;
}

export const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({ onResetData, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<'feedbacks' | 'security'>('feedbacks');

  // Feedbacks state
  const [feedbacks, setFeedbacks] = useState<AnonymousFeedback[]>(() => FeedbackStore.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [onlyBullying, setOnlyBullying] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<AnonymousFeedback | null>(null);

  // Modal response and actions state
  const [responseText, setResponseText] = useState('');
  const [adminLabel, setAdminLabel] = useState('School Administration / Admin');
  const [flagReason, setFlagReason] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Security state
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() =>
    FeedbackStore.getSecurityEvents()
  );
  const currentPasskeys = FeedbackStore.getPasskeys();
  const [sboKey, setSboKey] = useState(currentPasskeys.sbo);
  const [devKey, setDevKey] = useState(currentPasskeys.developer);
  const [showSboKey, setShowSboKey] = useState(false);
  const [showDevKey, setShowDevKey] = useState(false);
  const [rateLimitMax, setRateLimitMax] = useState('3');
  const [rateLimitWindow, setRateLimitWindow] = useState('15');
  const [honeypotEnabled, setHoneypotEnabled] = useState(true);
  const [systemNotice, setSystemNotice] = useState<string | null>(null);

  const refreshFeedbacks = () => {
    const list = FeedbackStore.getAll();
    setFeedbacks(list);
    if (activeFeedback) {
      const updated = list.find((f) => f.id === activeFeedback.id);
      if (updated) {
        setActiveFeedback(updated);
      } else {
        setActiveFeedback(null);
      }
    }
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      if (onlyBullying && !item.isBullyingReport) return false;

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesSection = item.section.toLowerCase().includes(query);
        const matchesMessage = item.message.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesId && !matchesSection && !matchesMessage && !matchesCategory) return false;
      }

      if (selectedRecipient !== 'ALL' && item.recipient !== selectedRecipient) return false;
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;

      return true;
    });
  }, [feedbacks, onlyBullying, searchTerm, selectedRecipient, selectedStatus, selectedCategory, selectedPriority]);

  const handleStatusChange = (status: FeedbackStatus) => {
    if (!activeFeedback) return;
    FeedbackStore.updateStatus(activeFeedback.id, status);
    setSystemNotice(`Status updated to "${status}"`);
    refreshFeedbacks();
    setTimeout(() => setSystemNotice(null), 2500);
  };

  const handlePriorityChange = (priority: Priority) => {
    if (!activeFeedback) return;
    FeedbackStore.updatePriority(activeFeedback.id, priority);
    setSystemNotice(`Priority set to "${priority}"`);
    refreshFeedbacks();
    setTimeout(() => setSystemNotice(null), 2500);
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedback || !responseText.trim()) return;

    FeedbackStore.addResponse(activeFeedback.id, responseText.trim(), adminLabel.trim());
    setResponseText('');
    setSystemNotice('Admin response posted to student successfully.');
    refreshFeedbacks();
    setTimeout(() => setSystemNotice(null), 3000);
  };

  const handleFlagAbuse = () => {
    if (!activeFeedback || !flagReason.trim()) return;
    FeedbackStore.flagAbuse(activeFeedback.id, flagReason.trim());
    setShowFlagInput(false);
    setFlagReason('');
    setSystemNotice('Feedback flagged for administrative review.');
    refreshFeedbacks();
    setTimeout(() => setSystemNotice(null), 3000);
  };

  const handleUnflag = () => {
    if (!activeFeedback) return;
    FeedbackStore.unflagAbuse(activeFeedback.id);
    setSystemNotice('Abuse flag cleared.');
    refreshFeedbacks();
    setTimeout(() => setSystemNotice(null), 3000);
  };

  const handleDeleteFeedback = (id: string) => {
    FeedbackStore.deleteFeedback(id);
    setDeleteConfirmId(null);
    if (activeFeedback?.id === id) {
      setActiveFeedback(null);
    }
    setSystemNotice(`Feedback ${id} permanently deleted from database.`);
    refreshFeedbacks();
    setTimeout(() => setSystemNotice(null), 3500);
  };

  const handleSavePasskeys = (e: React.FormEvent) => {
    e.preventDefault();
    FeedbackStore.updatePasskeys(sboKey, devKey);
    setSystemNotice('Passkeys updated successfully.');
    setTimeout(() => setSystemNotice(null), 3500);
  };

  const handleRotateSalt = () => {
    FeedbackStore.recordSecurityEvent({
      eventType: 'SUBMISSION_SALT_ROTATION',
      actionTaken: 'ROTATED_IMMEDIATELY',
      note: 'Cryptographic HMAC subnet salt rotated manually by Developer console.',
    });
    setSecurityEvents(FeedbackStore.getSecurityEvents());
    setSystemNotice('Cryptographic rate-limiting salt rotated.');
    setTimeout(() => setSystemNotice(null), 3000);
  };

  const handlePurgeLogs = () => {
    FeedbackStore.recordSecurityEvent({
      eventType: 'RATE_LIMIT_TOKEN_CHECK',
      actionTaken: 'PURGED_EXPIRED_TOKENS',
      note: 'Expired ephemeral zero-knowledge tokens purged. Retention policy satisfied.',
    });
    setSecurityEvents(FeedbackStore.getSecurityEvents());
    setSystemNotice('Transient security tokens cleared.');
    setTimeout(() => setSystemNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              VOICE · MASTER ADMIN & DEVELOPER CONSOLE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-bold">
              ROLE: MASTER_ADMIN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, answer, flag, and delete student feedbacks and bullying reports, or manage security infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin Session</span>
            </button>
          )}
          <button
            onClick={onResetData}
            className="px-3.5 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset system data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {systemNotice && (
        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{systemNotice}</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('feedbacks')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'feedbacks'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage Feedbacks & Bullying Reports</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-mono">
            {feedbacks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>System Security & Passkeys</span>
        </button>
      </div>

      {/* TAB 1: MANAGE FEEDBACKS & BULLYING REPORTS */}
      {activeTab === 'feedbacks' && (
        <div className="mt-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Feedbacks</span>
              <p className="text-2xl font-mono font-bold text-slate-900 mt-1">{feedbacks.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">New Submissions</span>
              <p className="text-2xl font-mono font-bold text-slate-900 mt-1">
                {feedbacks.filter((f) => f.status === 'Submitted').length}
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Addressed</span>
              <p className="text-2xl font-mono font-bold text-emerald-700 mt-1">
                {feedbacks.filter((f) => f.status === 'Addressed').length}
              </p>
            </div>
            <button
              onClick={() => setOnlyBullying(!onlyBullying)}
              className={`p-4 rounded-xl border transition-all text-left cursor-pointer ${
                onlyBullying ? 'bg-rose-900 text-white border-rose-900' : 'bg-rose-50 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">Bullying Reports</span>
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-mono font-black mt-1">
                {feedbacks.filter((f) => f.isBullyingReport).length}
              </p>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Admin search by ID, keyword, message content, section..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <button
                onClick={refreshFeedbacks}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Refresh submissions"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

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

          {/* Feedbacks List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No Submissions Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are no student feedbacks matching this filter or search query.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredFeedbacks.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                      item.isBullyingReport ? 'bg-rose-50/30 border-l-4 border-l-rose-600' : ''
                    }`}
                  >
                    <div className="space-y-2 flex-1">
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
                            <span className="text-rose-700 font-black">URGENT</span>
                          </>
                        )}
                        {item.flaggedAsAbuse && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-red-600 font-bold flex items-center gap-1">
                              <Flag className="w-3 h-3" />
                              <span>Flagged ({item.flagReason || 'Abuse'})</span>
                            </span>
                          </>
                        )}
                        {item.evidenceFile && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-700 font-medium flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              <span>Evidence Attached</span>
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-sm text-slate-800 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-slate-900" />
                          <span>Status: <strong className="text-slate-800">{item.status}</strong></span>
                        </span>
                        <span>
                          {item.responses.length} {item.responses.length === 1 ? 'Response' : 'Responses'}
                        </span>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveFeedback(item);
                          setShowFlagInput(false);
                          setResponseText('');
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage & Answer</span>
                      </button>

                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="px-2.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete permanently from database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM ARCHITECTURE & PASSKEYS */}
      {activeTab === 'security' && (
        <div className="mt-6 space-y-8 animate-in fade-in duration-150">
          {/* Role Passkeys Manager */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <Lock className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                Access Control Passkey Management
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4 max-w-2xl leading-relaxed">
              Students cannot see or switch into administrative roles. Only individuals with these passkeys can unlock the SBO Dashboard or this Developer Console.
            </p>

            <form onSubmit={handleSavePasskeys} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    SBO Officers Passkey
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSboKey(!showSboKey)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showSboKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showSboKey ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <input
                  type={showSboKey ? 'text' : 'password'}
                  value={sboKey}
                  onChange={(e) => setSboKey(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                  required
                />
                <span className="text-[11px] text-slate-400 block">
                  Share this key exclusively with authorized student council officers.
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Only You (Master Developer Key)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDevKey(!showDevKey)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showDevKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showDevKey ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <input
                  type={showDevKey ? 'text' : 'password'}
                  value={devKey}
                  onChange={(e) => setDevKey(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold"
                  required
                />
                <span className="text-[11px] text-slate-400 block">
                  Your personal master key for full platform administration and settings.
                </span>
              </div>

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Passkey Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Database Schema Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-mono text-xs font-bold text-slate-900">
                    table: anonymous_feedback
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  Feedback & Safe Haven
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Stores student submissions and anti-bullying reports. Explicitly stripped of any network, session, or device identifiers.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-700 space-y-1 border border-slate-200">
                <div className="flex justify-between"><span>feedback_id:</span> <span className="text-slate-400">VARCHAR(16) [PK]</span></div>
                <div className="flex justify-between"><span>response_code_hash:</span> <span className="text-slate-400">SHA256 (for private lookup)</span></div>
                <div className="flex justify-between"><span>recipient:</span> <span className="text-slate-400">ENUM</span></div>
                <div className="flex justify-between"><span>is_bullying_report:</span> <span className="text-slate-400">BOOLEAN</span></div>
                <div className="flex justify-between"><span>section_tag:</span> <span className="text-slate-400">VARCHAR(64) (voluntary)</span></div>
                <div className="flex justify-between"><span>feedback_content:</span> <span className="text-slate-400">TEXT</span></div>
                <div className="flex justify-between"><span>status:</span> <span className="text-slate-400">ENUM</span></div>
                <div className="flex justify-between text-rose-600 font-semibold"><span>student_id / name / ip:</span> <span>[DOES NOT EXIST]</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="font-mono text-xs font-bold text-slate-900">
                    table: security_abuse_tokens
                  </span>
                </div>
                <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium">
                  Ephemeral Subnet Guard
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Separated cryptographic rate-limiting tokens. Salted with hourly rotating key, automatically pruned after 24 hours.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-700 space-y-1 border border-slate-200">
                <div className="flex justify-between"><span>token_id:</span> <span className="text-slate-400">UUID [PK]</span></div>
                <div className="flex justify-between"><span>ephemeral_blind_hash:</span> <span className="text-slate-400">HMAC-SHA256(Subnet, HourlySalt)</span></div>
                <div className="flex justify-between"><span>bucket_counter:</span> <span className="text-slate-400">INT (max 3 / window)</span></div>
                <div className="flex justify-between"><span>expires_at:</span> <span className="text-slate-400">TIMESTAMP (24h TTL)</span></div>
                <div className="flex justify-between text-rose-600 font-semibold"><span>feedback_id foreign key:</span> <span>[STRICTLY DISALLOWED]</span></div>
              </div>
            </div>
          </div>

          {/* Security Audit Event Log */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Decoupled Security Event Stream
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRotateSalt}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Rotate Salt
                </button>
                <button
                  onClick={handlePurgeLogs}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Purge Expired
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {securityEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">{evt.eventType}</span>
                    <span className="tabular-nums">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-900 font-bold bg-slate-200 px-1.5 py-0.5 rounded">
                      {evt.actionTaken}
                    </span>
                    <span className="text-slate-500">token: {evt.tokenHash}</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-600 pt-0.5">{evt.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE FEEDBACK ADMIN DETAIL & RESPONSE MODAL */}
      {activeFeedback && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center text-xs ${
                  activeFeedback.isBullyingReport ? 'bg-rose-700 text-white' : 'bg-slate-900 text-white'
                }`}>
                  {activeFeedback.isBullyingReport ? 'SAFE' : 'ADMIN'}
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
                    Administrator Review & Response Console
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

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Bullying Metadata if applicable */}
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

              {/* Message */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Student Message (Recipient: {activeFeedback.recipient})
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
                  {activeFeedback.message}
                </div>
              </div>

              {/* Evidence Attachment View */}
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

              {/* Compose Admin Response */}
              <form onSubmit={handleSendResponse} className="space-y-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="admin-response-box" className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                    Answer Student Feedback as Administrator
                  </label>
                  <input
                    type="text"
                    value={adminLabel}
                    onChange={(e) => setAdminLabel(e.target.value)}
                    placeholder="Sender Label"
                    className="p-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-800 w-52"
                    title="Responder label displayed to the student"
                  />
                </div>

                <textarea
                  id="admin-response-box"
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type official admin response to student... (Student will see this when entering their Response Code)"
                  className="w-full p-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!responseText.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Answer to Student</span>
                  </button>
                </div>
              </form>

              {/* Flag & Delete Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div>
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

                <div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFeedback(activeFeedback.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Feedback Permanently</span>
                  </button>
                </div>
              </div>

              {showFlagInput && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-2">
                  <p className="font-semibold text-rose-900">
                    Reason for flagging (threat, doxxing, harassment, or spam):
                  </p>
                  <input
                    type="text"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Specify violation..."
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

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveFeedback(null)}
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
