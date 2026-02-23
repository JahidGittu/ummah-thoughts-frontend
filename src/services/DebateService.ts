// ============================================================
// Debate Service - Managing debates, voting, Q&A
// ============================================================

import { BaseService } from './BaseService';
import { Debate, DebateStatus, DebatePhase, QuestionQueue, Evidence } from '@/types';

export class DebateService extends BaseService {
  private debates: Map<string, Debate> = new Map();
  private userDebateVotes: Map<string, Map<string, 'A' | 'B'>> = new Map(); // userId -> debateId -> vote
  private userQuestionUpvotes: Map<string, Set<string>> = new Map(); // userId -> questionIds

  constructor() {
    super();
    this.initializeMockData();
  }

  /**
   * Initialize with mock debates
   */
  private initializeMockData(): void {
    const mockDebates = [
      {
        id: this.generateId('deb_'),
        title: 'Role of Ijtihad in Contemporary Islamic Law',
        topic: 'Ijtihad & Adaptation',
        description: 'Does Ijtihad have a place in modern Islamic jurisprudence?',
        status: 'scheduled' as DebateStatus,
        currentPhase: undefined,
        
        moderator: { id: 'm1', name: 'Dr. Ahmed Al-Rashid', avatar: 'A' },
        
        positions: {
          a: {
            scholar: { id: 's1', name: 'Prof. Ibrahim Khalil', specialization: 'Usul al-Fiqh', avatar: 'I' },
            position: 'Ijtihad is essential for modern Muslim societies',
            evidence: [] as Evidence[],
          },
          b: {
            scholar: { id: 's2', name: 'Dr. Amal Farouk', specialization: 'Classical Fiqh', avatar: 'A' },
            position: 'Strict adherence to established madhabs is sufficient',
            evidence: [] as Evidence[],
          },
        },
        
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 90,
        viewers: 0,
        
        voting: {
          clarityA: 0,
          clarityB: 0,
        },
        
        questions: [] as QuestionQueue[],
      },
    ];

    mockDebates.forEach(debate => {
      this.debates.set(debate.id, debate);
    });
  }

  /**
   * Get all debates
   */
  getDebates(status?: DebateStatus): Debate[] {
    return Array.from(this.debates.values()).filter(d => !status || d.status === status);
  }

  /**
   * Get single debate
   */
  getDebate(debateId: string): Debate | null {
    return this.debates.get(debateId) || null;
  }

  /**
   * Get scheduled debates
   */
  getScheduledDebates(): Debate[] {
    return this.getDebates('scheduled');
  }

  /**
   * Get live debates
   */
  getLiveDebates(): Debate[] {
    return this.getDebates('live');
  }

  /**
   * Start a debate (move to live)
   */
  async startDebate(debateId: string): Promise<Debate> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    debate.status = 'live';
    debate.currentPhase = 'opening';
    debate.startedAt = new Date();

    this.notifySubscribers();
    this.log('Debate started', { debateId });

    return debate;
  }

  /**
   * Move to next phase
   */
  async moveToPhase(debateId: string, phase: DebatePhase): Promise<Debate> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    debate.currentPhase = phase;

    this.notifySubscribers();
    this.log('Phase changed', { debateId, phase });

    return debate;
  }

  /**
   * Cast clarity vote (A or B)
   */
  async voteClarity(debateId: string, userId: string, vote: 'A' | 'B'): Promise<Debate> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    // Remove previous vote if exists
    if (!this.userDebateVotes.has(userId)) {
      this.userDebateVotes.set(userId, new Map());
    }
    
    const previousVote = this.userDebateVotes.get(userId)!.get(debateId);
    if (previousVote === 'A') {
      debate.voting.clarityA = Math.max(0, debate.voting.clarityA - 1);
    } else if (previousVote === 'B') {
      debate.voting.clarityB = Math.max(0, debate.voting.clarityB - 1);
    }

    // Add new vote
    if (vote === 'A') {
      debate.voting.clarityA += 1;
    } else {
      debate.voting.clarityB += 1;
    }

    this.userDebateVotes.get(userId)!.set(debateId, vote);
    debate.voting.myVote = vote;

    this.notifySubscribers();
    this.log('Clarity vote cast', { debateId, userId, vote });

    return debate;
  }

  /**
   * Get current user's vote
   */
  getMyVote(debateId: string, userId: string): 'A' | 'B' | null {
    return this.userDebateVotes.get(userId)?.get(debateId) || null;
  }

  /**
   * Submit a question to Q&A queue
   */
  async submitQuestion(debateId: string, userId: string, userName: string, text: string): Promise<QuestionQueue> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    const question: QuestionQueue = {
      id: this.generateId('q_'),
      user: { id: userId, name: userName },
      text,
      upvotes: 0,
      upvotedByMe: false,
      approved: false,
      timestamp: new Date(),
    };

    debate.questions.push(question);

    this.notifySubscribers();
    this.log('Question submitted', { debateId, userId, questionId: question.id });

    return question;
  }

  /**
   * Upvote a question
   */
  async upvoteQuestion(debateId: string, questionId: string, userId: string): Promise<QuestionQueue> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    const question = debate.questions.find(q => q.id === questionId);
    if (!question) throw new Error(`Question ${questionId} not found`);

    if (!this.userQuestionUpvotes.has(userId)) {
      this.userQuestionUpvotes.set(userId, new Set());
    }

    const hasUpvoted = this.userQuestionUpvotes.get(userId)!.has(questionId);
    
    if (hasUpvoted) {
      question.upvotes = Math.max(0, question.upvotes - 1);
      this.userQuestionUpvotes.get(userId)!.delete(questionId);
      question.upvotedByMe = false;
    } else {
      question.upvotes += 1;
      this.userQuestionUpvotes.get(userId)!.add(questionId);
      question.upvotedByMe = true;
    }

    this.notifySubscribers();
    this.log('Question upvoted', { debateId, questionId, userId });

    return question;
  }

  /**
   * Approve a question for Q&A
   */
  async approveQuestion(debateId: string, questionId: string): Promise<QuestionQueue> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    const question = debate.questions.find(q => q.id === questionId);
    if (!question) throw new Error(`Question ${questionId} not found`);

    question.approved = true;

    this.notifySubscribers();
    this.log('Question approved', { debateId, questionId });

    return question;
  }

  /**
   * Answer a question
   */
  async answerQuestion(debateId: string, questionId: string, answer: string): Promise<QuestionQueue> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    const question = debate.questions.find(q => q.id === questionId);
    if (!question) throw new Error(`Question ${questionId} not found`);

    question.answer = answer;
    question.answeredAt = new Date();

    this.notifySubscribers();
    this.log('Question answered', { debateId, questionId });

    return question;
  }

  /**
   * Add evidence to a position
   */
  async addEvidence(debateId: string, position: 'a' | 'b', evidence: Evidence): Promise<Evidence> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    evidence.id = this.generateId('ev_');
    debate.positions[position].evidence.push(evidence);

    this.notifySubscribers();
    this.log('Evidence added', { debateId, position, evidenceId: evidence.id });

    return evidence;
  }

  /**
   * End a debate and mark as completed
   */
  async endDebate(debateId: string): Promise<Debate> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    debate.status = 'completed';
    debate.endedAt = new Date();

    this.notifySubscribers();
    this.log('Debate ended', { debateId });

    return debate;
  }

  /**
   * Cancel a debate
   */
  async cancelDebate(debateId: string, reason?: string): Promise<Debate> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    debate.status = 'cancelled';

    this.notifySubscribers();
    this.log('Debate cancelled', { debateId, reason });

    return debate;
  }

  /**
   * Increment viewer count
   */
  async joinDebate(debateId: string): Promise<void> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    debate.viewers += 1;
    this.notifySubscribers();
  }

  /**
   * Decrement viewer count
   */
  async leaveDebate(debateId: string): Promise<void> {
    await this.delay();
    
    const debate = this.debates.get(debateId);
    if (!debate) throw new Error(`Debate ${debateId} not found`);

    debate.viewers = Math.max(0, debate.viewers - 1);
    this.notifySubscribers();
  }
}

// Singleton instance
export const debateService = new DebateService();
