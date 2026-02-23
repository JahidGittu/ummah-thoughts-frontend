// ============================================================
// User Service - Managing user profiles and progress
// ============================================================

import { BaseService } from './BaseService';
import { UserProfile, UserProgress, Achievement, RoleUpgradeRequest, UserRole } from '@/types';

export class UserService extends BaseService {
  private profiles: Map<string, UserProfile> = new Map();
  private progress: Map<string, UserProgress> = new Map();
  private roleRequests: Map<string, RoleUpgradeRequest> = new Map();

  constructor() {
    super();
    this.initializeMockData();
  }

  /**
   * Initialize with mock user data
   */
  private initializeMockData(): void {
    const mockProfile: UserProfile = {
      id: 'u1',
      name: 'Omar Abdullah',
      email: 'user@ummahthoughts.com',
      avatar: 'O',
      bio: 'Enthusiastic learner of Islamic sciences',
      role: 'user',
      verified: false,
      suspended: false,
      stats: {
        articlesPublished: 0,
        debatesParticipated: 3,
        questionsAnswered: 0,
        followers: 12,
        following: 45,
        points: 850,
      },
      preferences: {
        emailNotifications: true,
        privateProfile: false,
        language: 'en',
        theme: 'light',
      },
      joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      lastActive: new Date(),
    };

    const mockProgress: UserProgress = {
      userId: 'u1',
      level: 5,
      points: 850,
      articlesRead: 23,
      debatesWatched: 15,
      questionsAsked: 8,
      timeSpent: 420, // minutes
      badges: ['early_supporter', 'debate_enthusiast'],
      achievements: [
        { id: 'a1', name: 'First Question', description: 'Asked your first question', icon: '❓', unlockedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), rarity: 'common' },
        { id: 'a2', name: 'Debate Watcher', description: 'Watched 10 debates', icon: '🎬', unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), rarity: 'common' },
      ],
    };

    this.profiles.set(mockProfile.id, mockProfile);
    this.progress.set(mockProfile.id, mockProgress);
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    await this.delay();
    return this.profiles.get(userId) || null;
  }

  /**
   * Update profile information
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await this.delay();
    
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error(`User ${userId} not found`);

    // Only allow updating certain fields
    const allowedFields: (keyof UserProfile)[] = ['bio', 'avatar', 'banner', 'preferences'];
    allowedFields.forEach(field => {
      if (field in updates) {
        (profile[field] as any) = (updates[field] as any);
      }
    });

    profile.updatedAt = new Date();
    this.notifySubscribers();
    this.log('Profile updated', { userId });

    return profile;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: Partial<UserProfile['preferences']>): Promise<UserProfile> {
    await this.delay();
    
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error(`User ${userId} not found`);

    Object.assign(profile.preferences, preferences);
    this.notifySubscribers();
    this.log('Preferences updated', { userId });

    return profile;
  }

  /**
   * Get user learning progress
   */
  async getProgress(userId: string): Promise<UserProgress | null> {
    await this.delay();
    return this.progress.get(userId) || null;
  }

  /**
   * Record article read
   */
  async recordArticleRead(userId: string, articleId: string): Promise<void> {
    await this.delay();
    
    const progress = this.progress.get(userId);
    if (!progress) return;

    progress.articlesRead += 1;
    progress.points += 10;
    progress.timeSpent += 5;

    this.notifySubscribers();
    this.log('Article read recorded', { userId, articleId });
  }

  /**
   * Record debate watched
   */
  async recordDebateWatched(userId: string, debateId: string, watchedMinutes: number): Promise<void> {
    await this.delay();
    
    const progress = this.progress.get(userId);
    if (!progress) return;

    progress.debatesWatched += 1;
    progress.points += Math.floor(watchedMinutes / 5) * 10; // 10 points per 5 minutes
    progress.timeSpent += watchedMinutes;

    this.notifySubscribers();
    this.log('Debate watched recorded', { userId, debateId, watchedMinutes });
  }

  /**
   * Record question asked
   */
  async recordQuestionAsked(userId: string): Promise<void> {
    await this.delay();
    
    const progress = this.progress.get(userId);
    if (!progress) return;

    progress.questionsAsked += 1;
    progress.points += 25;

    this.notifySubscribers();
    this.log('Question asked recorded', { userId });
  }

  /**
   * Award achievement
   */
  async awardAchievement(userId: string, achievement: Achievement): Promise<void> {
    await this.delay();
    
    const progress = this.progress.get(userId);
    if (!progress) return;

    // Check if already has this achievement
    if (progress.achievements.some(a => a.id === achievement.id)) {
      return;
    }

    progress.achievements.push(achievement);
    progress.points += 100; // Bonus points for achievement

    this.notifySubscribers();
    this.log('Achievement awarded', { userId, achievementId: achievement.id });
  }

  /**
   * Update stat
   */
  async updateStat(userId: string, stat: keyof UserProfile['stats'], value: number): Promise<void> {
    await this.delay();
    
    const profile = this.profiles.get(userId);
    if (!profile) return;

    profile.stats[stat] = value;
    this.notifySubscribers();
    this.log('Stat updated', { userId, stat, value });
  }

  /**
   * Increment stat
   */
  async incrementStat(userId: string, stat: keyof UserProfile['stats'], amount: number = 1): Promise<void> {
    await this.delay();
    
    const profile = this.profiles.get(userId);
    if (!profile) return;

    profile.stats[stat] = (profile.stats[stat] as number) + amount;
    this.notifySubscribers();
    this.log('Stat incremented', { userId, stat, amount });
  }

  /**
   * Calculate next level requirement
   */
  getNextLevelPoints(currentLevel: number): number {
    return currentLevel * 500 + 500; // 1000, 1500, 2000, etc.
  }

  /**
   * Check and level up if needed
   */
  async checkAndLevelUp(userId: string): Promise<void> {
    await this.delay();
    
    const progress = this.progress.get(userId);
    const profile = this.profiles.get(userId);
    if (!progress || !profile) return;

    const nextLevelPoints = this.getNextLevelPoints(progress.level);
    
    if (progress.points >= nextLevelPoints) {
      progress.level += 1;
      
      // Award level up achievement
      this.awardAchievement(userId, {
        id: `level_${progress.level}`,
        name: `Level ${progress.level}`,
        description: `Reached level ${progress.level}`,
        icon: '⭐',
        unlockedAt: new Date(),
        rarity: progress.level > 10 ? 'rare' : 'common',
      });

      this.log('User leveled up', { userId, newLevel: progress.level });
    }
  }

  /**
   * Request role upgrade
   */
  async requestRoleUpgrade(userId: string, toRole: UserRole, reason: string, documents?: string[]): Promise<RoleUpgradeRequest> {
    await this.delay();
    
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error(`User ${userId} not found`);

    const request: RoleUpgradeRequest = {
      id: this.generateId('req_'),
      userId,
      from: profile.role,
      to: toRole,
      reason,
      documents,
      status: 'pending',
      createdAt: new Date(),
    };

    this.roleRequests.set(request.id, request);
    this.notifySubscribers();
    this.log('Role upgrade requested', { userId, toRole });

    return request;
  }

  /**
   * Get role upgrade request
   */
  async getRoleUpgradeRequest(requestId: string): Promise<RoleUpgradeRequest | null> {
    await this.delay();
    return this.roleRequests.get(requestId) || null;
  }

  /**
   * Get all role upgrade requests for user
   */
  getMyRoleRequests(userId: string): RoleUpgradeRequest[] {
    return Array.from(this.roleRequests.values()).filter(r => r.userId === userId);
  }

  /**
   * Follow user
   */
  async followUser(userId: string, targetUserId: string): Promise<void> {
    await this.delay();
    
    const profile = this.profiles.get(userId);
    if (profile) {
      profile.stats.following += 1;
    }

    const targetProfile = this.profiles.get(targetUserId);
    if (targetProfile) {
      targetProfile.stats.followers += 1;
    }

    this.notifySubscribers();
    this.log('User followed', { userId, targetUserId });
  }

  /**
   * Unfollow user
   */
  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    await this.delay();
    
    const profile = this.profiles.get(userId);
    if (profile) {
      profile.stats.following = Math.max(0, profile.stats.following - 1);
    }

    const targetProfile = this.profiles.get(targetUserId);
    if (targetProfile) {
      targetProfile.stats.followers = Math.max(0, targetProfile.stats.followers - 1);
    }

    this.notifySubscribers();
    this.log('User unfollowed', { userId, targetUserId });
  }
}

// Singleton instance
export const userService = new UserService();
