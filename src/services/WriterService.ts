// ============================================================
// Writer Service - Managing articles, drafts, formatting
// ============================================================

import { BaseService } from './BaseService';
import { Article, ArticleStatus, ContentBlock, BlockType, ArticleCategory } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export class WriterService extends BaseService {
  private articles: Map<string, Article> = new Map();
  private drafts: Map<string, Article> = new Map();

  constructor() {
    super();
    this.initializeMockData();
  }

  /**
   * Initialize with mock articles
   */
  private initializeMockData(): void {
    const mockArticles = [
      {
        id: this.generateId('art_'),
        title: 'Understanding Islamic Governance',
        slug: 'islamic-governance',
        description: 'A comprehensive look at governance principles in Islam',
        content: [
          { id: '1', type: 'heading' as BlockType, content: 'Understanding Islamic Governance', metadata: { level: 1 as const } },
          { id: '2', type: 'paragraph' as BlockType, content: 'Islamic governance is rooted in Quranic principles...' },
        ],
        author: { id: 'u1', name: 'Test Writer' },
        category: 'governance' as ArticleCategory,
        tags: ['governance', 'fiqh'],
        status: 'published' as ArticleStatus,
        views: 245,
        likes: 32,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    ];

    mockArticles.forEach(article => {
      this.articles.set(article.id, article);
    });
  }

  /**
   * Create a new article from scratch
   */
  async createArticle(title: string, category: ArticleCategory): Promise<Article> {
    await this.delay();
    
    const article: Article = {
      id: this.generateId('art_'),
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description: '',
      content: [],
      author: { id: 'u1', name: 'Current User' }, // In real app, from auth context
      category,
      tags: [],
      status: 'draft',
      views: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.drafts.set(article.id, article);
    this.notifySubscribers();
    this.log('Article created', { id: article.id, title });

    return article;
  }

  /**
   * Update article metadata
   */
  async updateArticleMetadata(
    articleId: string,
    metadata: Partial<Pick<Article, 'title' | 'description' | 'category' | 'tags' | 'cover'>>
  ): Promise<Article> {
    await this.delay();
    
    const article = this.drafts.get(articleId) || this.articles.get(articleId);
    if (!article) throw new Error(`Article ${articleId} not found`);

    Object.assign(article, metadata, { updatedAt: new Date() });
    
    this.drafts.set(articleId, article);
    this.notifySubscribers();
    this.log('Metadata updated', { articleId });

    return article;
  }

  /**
   * Add a block to article content
   */
  async addBlock(articleId: string, blockType: BlockType): Promise<ContentBlock> {
    await this.delay();
    
    const article = this.drafts.get(articleId);
    if (!article) throw new Error(`Draft ${articleId} not found`);

    const block: ContentBlock = {
      id: this.generateId('block_'),
      type: blockType,
      content: '',
      metadata: {},
    };

    // Set default metadata based on type
    switch (blockType) {
      case 'heading':
        block.metadata!.level = 2;
        block.content = 'Heading';
        break;
      case 'paragraph':
        block.content = 'Start typing...';
        break;
      case 'quote':
        block.metadata!.alignment = 'center';
        block.content = 'Your quote here';
        break;
      case 'list':
        block.content = 'List item';
        break;
      case 'quran':
        block.metadata!.arabic = '';
        block.content = 'Quranic reference';
        break;
      case 'hadith':
        block.metadata!.reference = '';
        block.content = 'Hadith text';
        break;
    }

    article.content.push(block);
    article.updatedAt = new Date();
    
    this.notifySubscribers();
    this.log('Block added', { articleId, blockType });

    return block;
  }

  /**
   * Update block content
   */
  async updateBlock(articleId: string, blockId: string, updates: Partial<ContentBlock>): Promise<ContentBlock> {
    await this.delay();
    
    const article = this.drafts.get(articleId);
    if (!article) throw new Error(`Draft ${articleId} not found`);

    const blockIndex = article.content.findIndex(b => b.id === blockId);
    if (blockIndex === -1) throw new Error(`Block ${blockId} not found`);

    const block = article.content[blockIndex];
    Object.assign(block, updates);
    article.updatedAt = new Date();

    this.notifySubscribers();
    this.log('Block updated', { articleId, blockId });

    return block;
  }

  /**
   * Delete a block
   */
  async deleteBlock(articleId: string, blockId: string): Promise<void> {
    await this.delay();
    
    const article = this.drafts.get(articleId);
    if (!article) throw new Error(`Draft ${articleId} not found`);

    article.content = article.content.filter(b => b.id !== blockId);
    article.updatedAt = new Date();

    this.notifySubscribers();
    this.log('Block deleted', { articleId, blockId });
  }

  /**
   * Reorder blocks via drag-drop
   */
  async reorderBlocks(articleId: string, blockIds: string[]): Promise<void> {
    await this.delay();
    
    const article = this.drafts.get(articleId);
    if (!article) throw new Error(`Draft ${articleId} not found`);

    const blockMap = new Map(article.content.map(b => [b.id, b]));
    article.content = blockIds.map(id => blockMap.get(id)!).filter(Boolean);
    article.updatedAt = new Date();

    this.notifySubscribers();
    this.log('Blocks reordered', { articleId });
  }

  /**
   * Apply formatting to text selection
   */
  async applyFormatting(
    articleId: string,
    blockId: string,
    format: 'bold' | 'italic' | 'underline' | 'link',
    options?: any
  ): Promise<void> {
    await this.delay();
    
    const article = this.drafts.get(articleId);
    if (!article) throw new Error(`Draft ${articleId} not found`);

    const block = article.content.find(b => b.id === blockId);
    if (!block) throw new Error(`Block ${blockId} not found`);

    // In real implementation, this would use a rich text editor like TipTap
    // For now, we just log the action
    this.log('Formatting applied', { articleId, blockId, format, options });
  }

  /**
   * Submit article for review
   */
  async submitForReview(articleId: string): Promise<Article> {
    await this.delay();
    
    const article = this.drafts.get(articleId);
    if (!article) throw new Error(`Draft ${articleId} not found`);

    article.status = 'submitted';
    this.drafts.delete(articleId);
    this.articles.set(articleId, article);

    this.notifySubscribers();
    this.log('Article submitted', { articleId });

    return article;
  }

  /**
   * Publish article (admin/editor only)
   */
  async publishArticle(articleId: string): Promise<Article> {
    await this.delay();
    
    const article = this.articles.get(articleId);
    if (!article) throw new Error(`Article ${articleId} not found`);

    article.status = 'published';
    article.publishedAt = new Date();

    this.notifySubscribers();
    this.log('Article published', { articleId });

    return article;
  }

  /**
   * Reject article with reason
   */
  async rejectArticle(articleId: string, reason: string): Promise<Article> {
    await this.delay();
    
    const article = this.articles.get(articleId);
    if (!article) throw new Error(`Article ${articleId} not found`);

    article.status = 'rejected';
    article.rejectionReason = reason;

    this.notifySubscribers();
    this.log('Article rejected', { articleId, reason });

    return article;
  }

  /**
   * Archive article
   */
  async archiveArticle(articleId: string): Promise<Article> {
    await this.delay();
    
    const article = this.articles.get(articleId);
    if (!article) throw new Error(`Article ${articleId} not found`);

    article.status = 'archived';
    this.notifySubscribers();
    this.log('Article archived', { articleId });

    return article;
  }

  /**
   * Get all drafts for current user
   */
  getDrafts(): Article[] {
    return Array.from(this.drafts.values());
  }

  /**
   * Get published articles for current user
   */
  getPublishedArticles(): Article[] {
    return Array.from(this.articles.values())
      .filter(a => a.status === 'published');
  }

  /**
   * Get single article
   */
  getArticle(articleId: string): Article | null {
    return this.articles.get(articleId) || this.drafts.get(articleId) || null;
  }

  /**
   * Simulate image upload
   */
  async uploadImage(file: File): Promise<string> {
    await this.delay(1000);
    // In real app, upload to backend/S3
    return URL.createObjectURL(file);
  }
}

// Singleton instance
export const writerService = new WriterService();
