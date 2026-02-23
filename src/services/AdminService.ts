// ============================================================
// Admin Service - Managing administrative tasks
// ============================================================

import { BaseService } from './BaseService';
import { RoleUpgradeRequest, UserRole, ModerationReport } from '@/types';

export class AdminService extends BaseService {
  private roleRequests: Map<string, RoleUpgradeRequest> = new Map();
  private reports: Map<string, ModerationReport> = new Map();

  constructor() {
    super();
    this.initializeMockData();
  }

  /**
   * Initialize with mock data
   */
  private initializeMockData(): void {
    const mockRequests: RoleUpgradeRequest[] = [
      {
        id: this.generateId('req_'),
        userId: 'u2',
        from: 'user',
        to: 'writer',
        reason: 'I have written 15+ articles and want to contribute formally',
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: this.generateId('req_'),
        userId: 'u3',
        from: 'user',
        to: 'scholar',
        reason: 'PhD in Islamic Studies from Al-Azhar',
        documents: ['doctorate_certificate.pdf'],
        status: 'pending',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];

    mockRequests.forEach(req => {
      this.roleRequests.set(req.id, req);
    });
  }

  /**
   * Get all role requests
   */
  getRoleRequests(status?: 'pending' | 'approved' | 'rejected'): RoleUpgradeRequest[] {
    return Array.from(this.roleRequests.values()).filter(r => !status || r.status === status);
  }

  /**
   * Get pending role requests count
   */
  getPendingRequestsCount(): number {
    return this.getRoleRequests('pending').length;
  }

  /**
   * Approve a role request
   */
  async approveRoleRequest(requestId: string, reviewedBy: string): Promise<RoleUpgradeRequest> {
    await this.delay();
    
    const request = this.roleRequests.get(requestId);
    if (!request) throw new Error(`Request ${requestId} not found`);

    request.status = 'approved';
    request.reviewedAt = new Date();
    request.reviewedBy = reviewedBy;

    this.notifySubscribers();
    this.log('Role request approved', { requestId, userId: request.userId, to: request.to });

    return request;
  }

  /**
   * Reject a role request
   */
  async rejectRoleRequest(requestId: string, reviewedBy: string, reason: string): Promise<RoleUpgradeRequest> {
    await this.delay();
    
    const request = this.roleRequests.get(requestId);
    if (!request) throw new Error(`Request ${requestId} not found`);

    request.status = 'rejected';
    request.reviewedAt = new Date();
    request.reviewedBy = reviewedBy;
    request.rejectionReason = reason;

    this.notifySubscribers();
    this.log('Role request rejected', { requestId, reason });

    return request;
  }

  /**
   * Get all moderation reports
   */
  getReports(status?: 'pending' | 'reviewed' | 'resolved'): ModerationReport[] {
    return Array.from(this.reports.values()).filter(r => !status || r.status === status);
  }

  /**
   * Get pending reports count
   */
  getPendingReportsCount(): number {
    return this.getReports('pending').length;
  }

  /**
   * Create a moderation report
   */
  async createReport(
    userId: string,
    contentId: string,
    contentType: 'comment' | 'article' | 'debate' | 'user',
    reason: string
  ): Promise<ModerationReport> {
    await this.delay();
    
    const report: ModerationReport = {
      id: this.generateId('rep_'),
      reportedBy: { id: userId, name: 'User' },
      contentId,
      contentType,
      reason,
      status: 'pending',
      createdAt: new Date(),
    };

    this.reports.set(report.id, report);
    this.notifySubscribers();
    this.log('Report created', { reportId: report.id, contentId });

    return report;
  }

  /**
   * Resolve a report (take action)
   */
  async resolveReport(
    reportId: string,
    action: 'approved' | 'removed' | 'archived' | 'dismissed',
    reason: string,
    reviewedBy: string
  ): Promise<ModerationReport> {
    await this.delay();
    
    const report = this.reports.get(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);

    report.status = 'resolved';
    report.resolution = {
      action,
      reason,
      reviewedBy,
      reviewedAt: new Date(),
    };

    this.notifySubscribers();
    this.log('Report resolved', { reportId, action });

    return report;
  }

  /**
   * Update user role (admin action)
   */
  async updateUserRole(userId: string, newRole: UserRole, changedBy: string): Promise<void> {
    await this.delay();
    
    // In real app, this would update the database
    this.log('User role updated', { userId, newRole, changedBy });
    this.notifySubscribers();
  }

  /**
   * Suspend a user
   */
  async suspendUser(userId: string, reason: string, suspendedBy: string): Promise<void> {
    await this.delay();
    
    this.log('User suspended', { userId, reason, suspendedBy });
    this.notifySubscribers();
  }

  /**
   * Unsuspend a user
   */
  async unsuspendUser(userId: string, unsuspendedBy: string): Promise<void> {
    await this.delay();
    
    this.log('User unsuspended', { userId, unsuspendedBy });
    this.notifySubscribers();
  }

  /**
   * Verify scholar
   */
  async verifyScholar(userId: string, verifiedBy: string): Promise<void> {
    await this.delay();
    
    this.log('Scholar verified', { userId, verifiedBy });
    this.notifySubscribers();
  }

  /**
   * Remove scholar verification
   */
  async removeScholarVerification(userId: string, reason: string, removedBy: string): Promise<void> {
    await this.delay();
    
    this.log('Scholar verification removed', { userId, reason, removedBy });
    this.notifySubscribers();
  }

  /**
   * Delete article (moderation)
   */
  async deleteArticle(articleId: string, reason: string, deletedBy: string): Promise<void> {
    await this.delay();
    
    this.log('Article deleted', { articleId, reason, deletedBy });
    this.notifySubscribers();
  }

  /**
   * Delete comment (moderation)
   */
  async deleteComment(commentId: string, reason: string, deletedBy: string): Promise<void> {
    await this.delay();
    
    this.log('Comment deleted', { commentId, reason, deletedBy });
    this.notifySubscribers();
  }
}

// Singleton instance
export const adminService = new AdminService();
