// ============================================================
// Core Type Definitions for Ummah Thoughts Platform
// ============================================================

// ============================================================
// ARTICLE & CONTENT TYPES
// ============================================================

export type BlockType = 'heading' | 'paragraph' | 'quote' | 'list' | 'image' | 'code' | 'hadith' | 'quran';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    level?: HeadingLevel;
    reference?: string;
    arabic?: string;
    alignment?: 'left' | 'center' | 'right';
    imageUrl?: string;
    caption?: string;
    language?: 'ar' | 'en' | 'bn';
  };
}

export type ArticleStatus = 'draft' | 'submitted' | 'published' | 'archived' | 'rejected';
export type ArticleCategory = 'fiqh' | 'history' | 'hadith' | 'quran' | 'governance' | 'spirituality' | 'other';

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: ContentBlock[];
  cover?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: ArticleCategory;
  tags: string[];
  status: ArticleStatus;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  rejectionReason?: string;
}

// ============================================================
// DEBATE TYPES
// ============================================================

export type DebatePhase = 'opening' | 'position_a' | 'position_b' | 'rebuttal' | 'qa' | 'closing' | 'completed';
export type DebateStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface Debate {
  id: string;
  title: string;
  topic: string;
  description: string;
  status: DebateStatus;
  currentPhase?: DebatePhase;
  
  moderator: {
    id: string;
    name: string;
    avatar?: string;
  };
  
  positions: {
    a: {
      scholar: {
        id: string;
        name: string;
        avatar?: string;
        specialization?: string;
      };
      position: string;
      evidence: Evidence[];
    };
    b: {
      scholar: {
        id: string;
        name: string;
        avatar?: string;
        specialization?: string;
      };
      position: string;
      evidence: Evidence[];
    };
  };
  
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration: number; // minutes
  viewers: number;
  
  voting: {
    clarityA: number;
    clarityB: number;
    myVote?: 'A' | 'B' | null;
  };
  
  questions: QuestionQueue[];
  transcript?: string;
  recording?: string;
}

export type EvidenceType = 'quran' | 'hadith' | 'scholarly' | 'logical';

export interface Evidence {
  id: string;
  type: EvidenceType;
  reference: string;
  arabic?: string;
  translation: string;
  scholar: 'A' | 'B';
  timestamp?: number;
}

export interface QuestionQueue {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  upvotes: number;
  upvotedByMe: boolean;
  approved: boolean;
  answer?: string;
  answeredAt?: Date;
  timestamp: Date;
}

export interface DebateInvite {
  id: string;
  debateId: string;
  scholarsInvited: string[]; // scholar IDs
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

// ============================================================
// USER & PROFILE TYPES
// ============================================================

export type UserRole = 'user' | 'writer' | 'scholar' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  banner?: string;
  bio: string;
  role: UserRole;
  specialization?: string;
  qualifications?: string[];
  verified: boolean;
  suspended: boolean;
  
  // Engagement metrics
  stats: {
    articlesPublished: number;
    debatesParticipated: number;
    questionsAnswered: number;
    followers: number;
    following: number;
    points: number;
  };
  
  // Preferences
  preferences: {
    emailNotifications: boolean;
    privateProfile: boolean;
    language: 'en' | 'bn';
    theme: 'light' | 'dark';
  };
  
  joinedAt: Date;
  lastActive: Date;
  updatedAt?: Date;
}

export interface RoleUpgradeRequest {
  id: string;
  userId: string;
  from: UserRole;
  to: UserRole;
  reason: string;
  documents?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

// ============================================================
// ADMIN TYPES
// ============================================================

export type ActivityAction = 
  | 'role_approve' | 'role_reject'
  | 'content_approve' | 'content_delete' | 'content_flag'
  | 'user_suspend' | 'user_unsuspend'
  | 'scholar_verify' | 'scholar_unverify'
  | 'debate_cancel'
  | 'role_change'
  | 'report_review';

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  actor: {
    id: string;
    name: string;
  };
  target: string; // user email, content id, etc
  detail: string;
  timestamp: Date;
  ip?: string;
  metadata?: Record<string, any>;
}

export interface ModerationReport {
  id: string;
  reportedBy: {
    id: string;
    name: string;
  };
  contentId: string;
  contentType: 'comment' | 'article' | 'debate' | 'user';
  reason: string;
  evidence?: string[];
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  resolution?: {
    action: 'approved' | 'removed' | 'archived' | 'dismissed';
    reason: string;
    reviewedBy: string;
    reviewedAt: Date;
  };
}

// ============================================================
// DASHBOARD & STATS TYPES
// ============================================================

export interface DashboardStats {
  totalUsers: number;
  activeDebates: number;
  contentFlagged: number;
  pendingRequests: number;
  weeklyGrowth: number;
}

export interface UserProgress {
  userId: string;
  level: number;
  points: number;
  articlesRead: number;
  debatesWatched: number;
  questionsAsked: number;
  timeSpent: number; // minutes
  badges: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ============================================================
// COMMENT & DISCUSSION TYPES
// ============================================================

export interface Comment {
  id: string;
  contentId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  likes: number;
  likedByMe: boolean;
  replies: Comment[];
  createdAt: Date;
  edited: boolean;
  editedAt?: Date;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export type NotificationType = 
  | 'debate_invite'
  | 'article_published'
  | 'question_answered'
  | 'role_updated'
  | 'content_flagged'
  | 'scholarship_verified'
  | 'mention'
  | 'reply'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// ============================================================
// SEARCH & FILTER TYPES
// ============================================================

export interface SearchFilters {
  query?: string;
  category?: ArticleCategory;
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  sortBy?: 'relevance' | 'newest' | 'popular' | 'trending';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  articles: Article[];
  debates: Debate[];
  users: UserProfile[];
  total: number;
}
