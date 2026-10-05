export type Recipient =
  | 'General School Feedback'
  | 'SBO'
  | 'SBO Officers'
  | 'Teacher'
  | 'School Staff'
  | 'School Administration'
  | 'Specific Department'
  | 'Guidance & Anti-Bullying Committee';

export type FeedbackType =
  | 'Suggestion'
  | 'Concern'
  | 'Complaint'
  | 'Appreciation'
  | 'Question'
  | 'School Improvement'
  | 'Event Feedback'
  | 'Student Experience'
  | 'Anti-Bullying Incident'
  | 'Other';

export type FeedbackStatus =
  | 'Submitted'
  | 'Being Reviewed'
  | 'In Progress'
  | 'Addressed';

export type Priority = 'Normal' | 'High' | 'Urgent';

export type BullyingCategory =
  | 'Verbal (Insults, Taunting, Slurs, Name-Calling)'
  | 'Cyberbullying (Social Media, Group Chats, Doxxing)'
  | 'Physical (Pushing, Tripping, Damaging Belongings)'
  | 'Social Exclusion & Rumor Spreading'
  | 'Intimidation & Extortion'
  | 'Other Harassment';

export interface SboResponse {
  id: string;
  authorLabel: string; // e.g. "Authorized SBO Officer"
  message: string;
  createdAt: string;
}

export interface AnonymousFeedback {
  id: string; // PV-XXXXXX or SAFE-XXXXXX
  responseCode: string; // XXXX-XXXX
  recipient: Recipient;
  category: FeedbackType;
  section: string; // e.g. "Grade 11 - ICT A"
  message: string;
  status: FeedbackStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  flaggedAsAbuse?: boolean;
  flagReason?: string;
  responses: SboResponse[];

  // Dedicated Anti-Bullying metadata
  isBullyingReport?: boolean;
  bullyingCategory?: BullyingCategory;
  reporterPerspective?: 'I am experiencing this myself' | 'I am a friend / bystander witnessing this';
  incidentLocation?: string; // e.g. "Classroom", "Hallway 2nd Floor", "Online / Discord group"
  approximateTimeframe?: string; // e.g. "Past week during lunch"
  evidenceFile?: {
    name: string;
    size: number;
    type: string;
    dataUrl: string;
  };
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'RATE_LIMIT_TOKEN_CHECK' | 'HONEYPOT_TRIGGER' | 'SUBMISSION_SALT_ROTATION' | 'BLOCKED_BOT_PROBE' | 'AUTH_ATTEMPT';
  tokenHash: string; // One-way SHA-256 slice (Zero-Knowledge)
  actionTaken: string;
  note: string;
}

export type ViewMode =
  | 'home'
  | 'submit'
  | 'anti-bullying'
  | 'guidelines'
  | 'check'
  | 'privacy'
  | 'about'
  | 'sbo-portal'
  | 'dev-console'
  | 'auth-login';

export type UserRole = 'student' | 'sbo_officer' | 'product_developer';

export interface AuthSession {
  role: UserRole;
  authenticatedAt: number;
}
