// ============================================================
// Custom Hooks - Wrapping services for easy component usage
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { writerService } from '@/services/WriterService';
import { debateService } from '@/services/DebateService';
import { adminService } from '@/services/AdminService';
import { userService } from '@/services/UserService';
import { Article, BlockType, Debate, RoleUpgradeRequest, UserProfile, UserProgress } from '@/types';

/**
 * Hook for article writing functionality
 */
export function useWriter() {
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [published, setPublished] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to service changes
  useEffect(() => {
    const unsubscribe = writerService.subscribe(() => {
      setDrafts([...writerService.getDrafts()]);
      setPublished([...writerService.getPublishedArticles()]);
    });

    // Initial load
    setDrafts([...writerService.getDrafts()]);
    setPublished([...writerService.getPublishedArticles()]);

    return unsubscribe;
  }, []);

  const createArticle = useCallback(async (title: string, category: any) => {
    setLoading(true);
    setError(null);
    try {
      const article = await writerService.createArticle(title, category);
      return article;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create article';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMetadata = useCallback(async (articleId: string, metadata: any) => {
    setLoading(true);
    setError(null);
    try {
      return await writerService.updateArticleMetadata(articleId, metadata);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update metadata';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addBlock = useCallback(async (articleId: string, blockType: BlockType) => {
    setLoading(true);
    setError(null);
    try {
      return await writerService.addBlock(articleId, blockType);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add block';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBlock = useCallback(async (articleId: string, blockId: string, updates: any) => {
    setLoading(true);
    setError(null);
    try {
      return await writerService.updateBlock(articleId, blockId, updates);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update block';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBlock = useCallback(async (articleId: string, blockId: string) => {
    setLoading(true);
    setError(null);
    try {
      await writerService.deleteBlock(articleId, blockId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete block';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderBlocks = useCallback(async (articleId: string, blockIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      await writerService.reorderBlocks(articleId, blockIds);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reorder blocks';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFormatting = useCallback(async (articleId: string, blockId: string, format: any, options?: any) => {
    setLoading(true);
    setError(null);
    try {
      await writerService.applyFormatting(articleId, blockId, format, options);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply formatting';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitForReview = useCallback(async (articleId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await writerService.submitForReview(articleId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      return await writerService.uploadImage(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    drafts,
    published,
    loading,
    error,
    createArticle,
    updateMetadata,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    applyFormatting,
    submitForReview,
    uploadImage,
  };
}

/**
 * Hook for debate functionality
 */
export function useDebate(debateId?: string) {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [currentDebate, setCurrentDebate] = useState<Debate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to service changes
  useEffect(() => {
    const unsubscribe = debateService.subscribe(() => {
      setDebates([...debateService.getDebates()]);
      if (debateId) {
        setCurrentDebate(debateService.getDebate(debateId));
      }
    });

    // Initial load
    setDebates([...debateService.getDebates()]);
    if (debateId) {
      setCurrentDebate(debateService.getDebate(debateId));
    }

    return unsubscribe;
  }, [debateId]);

  const voteClarity = useCallback(async (userId: string, vote: 'A' | 'B') => {
    if (!debateId) return;
    setLoading(true);
    setError(null);
    try {
      return await debateService.voteClarity(debateId, userId, vote);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to vote';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const submitQuestion = useCallback(async (userId: string, userName: string, text: string) => {
    if (!debateId) return;
    setLoading(true);
    setError(null);
    try {
      return await debateService.submitQuestion(debateId, userId, userName, text);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit question';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const upvoteQuestion = useCallback(async (questionId: string, userId: string) => {
    if (!debateId) return;
    setLoading(true);
    setError(null);
    try {
      return await debateService.upvoteQuestion(debateId, questionId, userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upvote';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const approveQuestion = useCallback(async (questionId: string) => {
    if (!debateId) return;
    setLoading(true);
    setError(null);
    try {
      return await debateService.approveQuestion(debateId, questionId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const answerQuestion = useCallback(async (questionId: string, answer: string) => {
    if (!debateId) return;
    setLoading(true);
    setError(null);
    try {
      return await debateService.answerQuestion(debateId, questionId, answer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to answer';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const endDebate = useCallback(async (id?: string) => {
    const targetId = id ?? debateId;
    if (!targetId) return;
    setLoading(true);
    setError(null);
    try {
      return await debateService.endDebate(targetId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to end debate';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const joinDebate = useCallback(async (id?: string) => {
    const targetId = id ?? debateId;
    if (!targetId) return;
    setLoading(true);
    setError(null);
    try {
      await debateService.joinDebate(targetId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const leaveDebate = useCallback(async () => {
    if (!debateId) return;
    setLoading(true);
    setError(null);
    try {
      await debateService.leaveDebate(debateId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to leave';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  return {
    debates,
    currentDebate,
    loading,
    error,
    voteClarity,
    submitQuestion,
    upvoteQuestion,
    approveQuestion,
    answerQuestion,
    endDebate,
    joinDebate,
    leaveDebate,
  };
}

/**
 * Hook for admin functionality
 */
export function useAdmin() {
  const [roleRequests, setRoleRequests] = useState<RoleUpgradeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to service changes
  useEffect(() => {
    const unsubscribe = adminService.subscribe(() => {
      setRoleRequests([...adminService.getRoleRequests()]);
    });

    // Initial load
    setRoleRequests([...adminService.getRoleRequests()]);

    return unsubscribe;
  }, []);

  const approveRequest = useCallback(async (requestId: string, reviewedBy: string) => {
    setLoading(true);
    setError(null);
    try {
      return await adminService.approveRoleRequest(requestId, reviewedBy);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectRequest = useCallback(async (requestId: string, reviewedBy: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      return await adminService.rejectRoleRequest(requestId, reviewedBy, reason);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const suspendUser = useCallback(async (userId: string, reason: string, suspendedBy: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.suspendUser(userId, reason, suspendedBy);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to suspend';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsuspendUser = useCallback(async (userId: string, unsuspendedBy: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.unsuspendUser(userId, unsuspendedBy);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsuspend';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyScholar = useCallback(async (userId: string, verifiedBy: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.verifyScholar(userId, verifiedBy);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    roleRequests,
    loading,
    error,
    approveRequest,
    rejectRequest,
    suspendUser,
    unsuspendUser,
    verifyScholar,
  };
}

/**
 * Hook for user profile and progress
 */
export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to service changes
  useEffect(() => {
    const unsubscribe = userService.subscribe(() => {
      if (userId) {
        userService.getProfile(userId).then(setProfile);
        userService.getProgress(userId).then(setProgress);
      }
    });

    if (userId) {
      userService.getProfile(userId).then(setProfile);
      userService.getProgress(userId).then(setProgress);
    }

    return unsubscribe;
  }, [userId]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      return await userService.updateProfile(userId, updates);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updatePreferences = useCallback(async (preferences: Partial<UserProfile['preferences']>) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      return await userService.updatePreferences(userId, preferences);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const recordArticleRead = useCallback(async (articleId: string) => {
    if (!userId) return;
    try {
      await userService.recordArticleRead(userId, articleId);
    } catch (err) {
      console.error('Failed to record article read', err);
    }
  }, [userId]);

  const recordDebateWatched = useCallback(async (debateId: string, watchedMinutes: number) => {
    if (!userId) return;
    try {
      await userService.recordDebateWatched(userId, debateId, watchedMinutes);
    } catch (err) {
      console.error('Failed to record debate watched', err);
    }
  }, [userId]);

  const requestRoleUpgrade = useCallback(async (toRole: any, reason: string, documents?: string[]) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      return await userService.requestRoleUpgrade(userId, toRole, reason, documents);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request upgrade';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const followUser = useCallback(async (targetUserId: string) => {
    if (!userId) return;
    try {
      await userService.followUser(userId, targetUserId);
    } catch (err) {
      console.error('Failed to follow user', err);
    }
  }, [userId]);

  const unfollowUser = useCallback(async (targetUserId: string) => {
    if (!userId) return;
    try {
      await userService.unfollowUser(userId, targetUserId);
    } catch (err) {
      console.error('Failed to unfollow user', err);
    }
  }, [userId]);

  return {
    profile,
    progress,
    loading,
    error,
    updateProfile,
    updatePreferences,
    recordArticleRead,
    recordDebateWatched,
    requestRoleUpgrade,
    followUser,
    unfollowUser,
  };
}
