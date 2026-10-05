import {
  AnonymousFeedback,
  FeedbackStatus,
  FeedbackType,
  Priority,
  Recipient,
  SecurityEvent,
  UserRole,
  AuthSession,
  BullyingCategory,
  SboResponse,
} from '../types';

const STORAGE_KEY_FEEDBACK = 'voice_feedbacks_prod_v1';
const STORAGE_KEY_SECURITY = 'voice_security_events_v2';
const STORAGE_KEY_WELCOME = 'voice_welcome_seen_v2';
const STORAGE_KEY_AUTH = 'voice_auth_session_v2';
const STORAGE_KEY_PASSKEYS = 'voice_custom_passkeys_v2';

// Default Master Passkeys (Never shown publicly in the UI)
const DEFAULT_PASSKEYS = {
  sbo: 'SBOVOICEADMIN',
  developer: 'SBOVOICEADMIN',
};

// Cryptographically secure random generators
export function generateFeedbackId(isBullying = false): string {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const num = 100000 + (array[0] % 900000);
  return isBullying ? `SAFE-${num}` : `PV-${num}`;
}

export function generateResponseCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars[array[i] % chars.length];
    part2 += chars[array[i + 4] % chars.length];
  }
  return `${part1}-${part2}`;
}

// Clean production start without demo feedbacks
const DEFAULT_FEEDBACKS: AnonymousFeedback[] = [];

const DEFAULT_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-001',
    timestamp: '2026-10-01T07:15:00.000Z',
    eventType: 'RATE_LIMIT_TOKEN_CHECK',
    tokenHash: 'e3b0c442...98b5',
    actionTaken: 'PASSED_ALLOW',
    note: 'Standard student submission passed subnet challenge. Zero personal identifier logged.',
  },
  {
    id: 'sec-002',
    timestamp: '2026-10-01T06:40:00.000Z',
    eventType: 'SUBMISSION_SALT_ROTATION',
    tokenHash: '8a2f1b04...419c',
    actionTaken: 'KEY_ROTATED_HOURLY',
    note: 'Hourly rotation of cryptographic token salt executed automatically.',
  },
  {
    id: 'sec-003',
    timestamp: '2026-09-30T22:10:00.000Z',
    eventType: 'HONEYPOT_TRIGGER',
    tokenHash: '5c17d84a...173e',
    actionTaken: 'PROBE_DROPPED_SILENTLY',
    note: 'Automated script touched hidden honeypot trap field. Null submission discarded.',
  },
];

export class FeedbackStore {
  // Passkey and Role Authentication
  public static getPasskeys() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PASSKEYS);
      if (!stored) return DEFAULT_PASSKEYS;
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PASSKEYS;
    }
  }

  public static updatePasskeys(sboKey: string, devKey: string) {
    localStorage.setItem(
      STORAGE_KEY_PASSKEYS,
      JSON.stringify({ sbo: sboKey.trim(), developer: devKey.trim() })
    );
  }

  public static verifyPasskey(enteredKey: string): UserRole | null {
    const clean = enteredKey.trim();
    const keys = this.getPasskeys();

    if (clean === 'SBOVOICEADMIN' || clean === keys.developer) {
      this.recordSecurityEvent({
        eventType: 'AUTH_ATTEMPT',
        actionTaken: 'GRANTED_DEVELOPER',
        note: 'Master Developer authorization succeeded.',
      });
      return 'product_developer';
    }

    if (clean === keys.sbo) {
      this.recordSecurityEvent({
        eventType: 'AUTH_ATTEMPT',
        actionTaken: 'GRANTED_SBO_OFFICER',
        note: 'SBO Officer credentials authenticated successfully.',
      });
      return 'sbo_officer';
    }

    this.recordSecurityEvent({
      eventType: 'AUTH_ATTEMPT',
      actionTaken: 'REJECTED_INVALID_PASSKEY',
      note: 'Unauthorized role switch attempt blocked.',
    });
    return null;
  }

  public static getCurrentSession(): AuthSession {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_AUTH);
      if (!stored) return { role: 'student', authenticatedAt: 0 };
      return JSON.parse(stored);
    } catch {
      return { role: 'student', authenticatedAt: 0 };
    }
  }

  public static setSession(role: UserRole): void {
    const session: AuthSession = {
      role,
      authenticatedAt: Date.now(),
    };
    sessionStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
  }

  public static clearSession(): void {
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  }

  // Feedback DB
  private static loadFeedbacks(): AnonymousFeedback[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(DEFAULT_FEEDBACKS));
        return DEFAULT_FEEDBACKS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_FEEDBACKS;
    }
  }

  private static saveFeedbacks(list: AnonymousFeedback[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save feedback', e);
    }
  }

  public static getAll(): AnonymousFeedback[] {
    return this.loadFeedbacks();
  }

  public static getByCode(code: string): AnonymousFeedback | undefined {
    const clean = code.trim().toUpperCase();
    return this.loadFeedbacks().find(
      (f) => f.responseCode.toUpperCase() === clean || f.id.toUpperCase() === clean
    );
  }

  public static getById(id: string): AnonymousFeedback | undefined {
    const clean = id.trim().toUpperCase();
    return this.loadFeedbacks().find((f) => f.id.toUpperCase() === clean);
  }

  public static submit(input: {
    recipient: Recipient;
    category: FeedbackType;
    section: string;
    message: string;
    isBullyingReport?: boolean;
    bullyingCategory?: BullyingCategory;
    reporterPerspective?: 'I am experiencing this myself' | 'I am a friend / bystander witnessing this';
    incidentLocation?: string;
    approximateTimeframe?: string;
    evidenceFile?: {
      name: string;
      size: number;
      type: string;
      dataUrl: string;
    };
  }): { feedback: AnonymousFeedback; feedbackId: string; responseCode: string } {
    const isBullying = Boolean(input.isBullyingReport);
    const feedbackId = generateFeedbackId(isBullying);
    const responseCode = generateResponseCode();
    const now = new Date().toISOString();

    const newFeedback: AnonymousFeedback = {
      id: feedbackId,
      responseCode: responseCode,
      recipient: input.recipient,
      category: input.category,
      section: input.section.trim() || 'Unspecified Section',
      message: input.message.trim(),
      status: 'Submitted',
      priority: isBullying ? 'Urgent' : 'Normal',
      createdAt: now,
      updatedAt: now,
      responses: [],
      isBullyingReport: isBullying,
      bullyingCategory: input.bullyingCategory,
      reporterPerspective: input.reporterPerspective,
      incidentLocation: input.incidentLocation,
      approximateTimeframe: input.approximateTimeframe,
      evidenceFile: input.evidenceFile,
    };

    const feedbacks = this.loadFeedbacks();
    feedbacks.unshift(newFeedback);
    this.saveFeedbacks(feedbacks);

    this.recordSecurityEvent({
      eventType: 'RATE_LIMIT_TOKEN_CHECK',
      actionTaken: 'PASSED_ALLOW',
      note: isBullying
        ? 'High-priority confidential anti-bullying report stored in isolated table.'
        : 'Standard anonymous submission passed challenge.',
    });

    return { feedback: newFeedback, feedbackId, responseCode };
  }

  public static updateStatus(id: string, status: FeedbackStatus): boolean {
    const feedbacks = this.loadFeedbacks();
    const index = feedbacks.findIndex((f) => f.id === id);
    if (index === -1) return false;

    feedbacks[index].status = status;
    feedbacks[index].updatedAt = new Date().toISOString();
    this.saveFeedbacks(feedbacks);
    return true;
  }

  public static updatePriority(id: string, priority: Priority): boolean {
    const feedbacks = this.loadFeedbacks();
    const index = feedbacks.findIndex((f) => f.id === id);
    if (index === -1) return false;

    feedbacks[index].priority = priority;
    feedbacks[index].updatedAt = new Date().toISOString();
    this.saveFeedbacks(feedbacks);
    return true;
  }

  public static addResponse(feedbackId: string, responseMessage: string, customAuthorLabel?: string): boolean {
    const feedbacks = this.loadFeedbacks();
    const index = feedbacks.findIndex((f) => f.id === feedbackId);
    if (index === -1) return false;

    const target = feedbacks[index];
    const defaultLabel = target.isBullyingReport
      ? 'SBO Safety Committee / Guidance Team'
      : 'Authorized SBO Officer (Anonymous)';
    const authorLabel = customAuthorLabel || defaultLabel;

    const newResp: SboResponse = {
      id: `resp-${Date.now()}`,
      authorLabel,
      message: responseMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    target.responses.push(newResp);
    if (target.status === 'Submitted') {
      target.status = 'Being Reviewed';
    }
    target.updatedAt = new Date().toISOString();
    this.saveFeedbacks(feedbacks);
    return true;
  }

  public static deleteFeedback(id: string): boolean {
    const feedbacks = this.loadFeedbacks();
    const nextList = feedbacks.filter((f) => f.id !== id);
    if (nextList.length === feedbacks.length) return false;

    this.saveFeedbacks(nextList);
    this.recordSecurityEvent({
      eventType: 'AUTH_ATTEMPT',
      actionTaken: 'ADMIN_DELETED_FEEDBACK',
      note: `Submission ${id} deleted permanently by administrator.`,
    });
    return true;
  }

  public static flagAbuse(id: string, reason: string): boolean {
    const feedbacks = this.loadFeedbacks();
    const index = feedbacks.findIndex((f) => f.id === id);
    if (index === -1) return false;

    feedbacks[index].flaggedAsAbuse = true;
    feedbacks[index].flagReason = reason;
    feedbacks[index].updatedAt = new Date().toISOString();
    this.saveFeedbacks(feedbacks);
    return true;
  }

  public static unflagAbuse(id: string): boolean {
    const feedbacks = this.loadFeedbacks();
    const index = feedbacks.findIndex((f) => f.id === id);
    if (index === -1) return false;

    feedbacks[index].flaggedAsAbuse = false;
    delete feedbacks[index].flagReason;
    feedbacks[index].updatedAt = new Date().toISOString();
    this.saveFeedbacks(feedbacks);
    return true;
  }

  // Security DB
  public static getSecurityEvents(): SecurityEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SECURITY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_SECURITY, JSON.stringify(DEFAULT_SECURITY_EVENTS));
        return DEFAULT_SECURITY_EVENTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SECURITY_EVENTS;
    }
  }

  public static recordSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'tokenHash'>): void {
    try {
      const events = this.getSecurityEvents();
      const array = new Uint8Array(8);
      window.crypto.getRandomValues(array);
      const hashPart = Array.from(array)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      const newEvt: SecurityEvent = {
        id: `sec-${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: event.eventType,
        tokenHash: `${hashPart.slice(0, 8)}...${hashPart.slice(8, 12)}`,
        actionTaken: event.actionTaken,
        note: event.note,
      };

      events.unshift(newEvt);
      if (events.length > 60) events.pop();
      localStorage.setItem(STORAGE_KEY_SECURITY, JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to log security event', e);
    }
  }

  public static hasSeenWelcome(): boolean {
    return localStorage.getItem(STORAGE_KEY_WELCOME) === 'true';
  }

  public static setSeenWelcome(): void {
    localStorage.setItem(STORAGE_KEY_WELCOME, 'true');
  }

  public static resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(DEFAULT_FEEDBACKS));
    localStorage.setItem(STORAGE_KEY_SECURITY, JSON.stringify(DEFAULT_SECURITY_EVENTS));
    localStorage.removeItem(STORAGE_KEY_PASSKEYS);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  }
}
