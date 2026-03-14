'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Eye, Trash2, Search, Clock, ThumbsUp, MessageSquare,
  FileText, Zap, CheckCircle2, Pencil, Archive,
} from 'lucide-react';
import { getArticles, saveArticle, deleteArticle } from '@/lib/draftStorage';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: 'draft' | 'publishing' | 'published' | 'archived';
  wordCount: number;
  views: number;
  likes: number;
  comments: number;
  lastEdited: string;
  content?: string;
}

const DEFAULT_ARTICLES: Article[] = [
  { id: '1', title: 'The Role of Ijtihad in Contemporary Law', description: 'A comprehensive exploration of how Islamic jurisprudence adapts to modern challenges.', category: 'Fiqh', tags: ['fiqh', 'contemporary', 'jurisprudence'], status: 'published', wordCount: 4250, views: 4200, likes: 312, comments: 28, lastEdited: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString() },
  { id: '2', title: 'Women Scholars in Classical Islam', description: 'Highlighting the contributions of female scholars throughout Islamic history.', category: 'History', tags: ['women', 'history', 'scholars'], status: 'published', wordCount: 3840, views: 8700, likes: 640, comments: 54, lastEdited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString() },
  { id: '3', title: 'Fiqh of Artificial Intelligence', description: 'Exploring Islamic jurisprudential approaches to AI ethics and governance.', category: 'Technology', tags: ['technology', 'fiqh', 'ai'], status: 'draft', wordCount: 1200, views: 0, likes: 0, comments: 0, lastEdited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString() },
];

function seedArticlesIfEmpty() {
  const existing = getArticles();
  if (existing.length === 0) {
    DEFAULT_ARTICLES.forEach((a) => {
      saveArticle({ id: a.id, title: a.title, description: a.description, category: a.category, tags: a.tags, status: a.status, wordCount: a.wordCount, lastEdited: a.lastEdited, views: a.views, likes: a.likes, comments: a.comments });
    });
  }
}

function loadArticles(): Article[] {
  const stored = getArticles();
  if (stored.length === 0) return [];
  return stored.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    category: a.category,
    tags: a.tags,
    status: a.status as Article['status'],
    wordCount: a.wordCount,
    views: a.views ?? 0,
    likes: a.likes ?? 0,
    comments: a.comments ?? 0,
    lastEdited: a.lastEdited,
    content: a.content,
  }));
}

export default function ArticlePublisher() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const refreshArticles = () => {
    seedArticlesIfEmpty();
    setArticles(loadArticles());
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  useEffect(() => {
    const onFocus = () => refreshArticles();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
      refreshArticles();
    }
  };

  const handleArchiveArticle = (id: string) => {
    const a = articles.find((x) => x.id === id);
    if (!a) return;
    const nextStatus = a.status === 'archived' ? 'published' : 'archived';
    saveArticle({
      id: a.id,
      title: a.title,
      description: a.description,
      category: a.category,
      tags: a.tags,
      status: nextStatus,
      wordCount: a.wordCount,
      lastEdited: a.lastEdited,
      views: a.views,
      likes: a.likes,
      comments: a.comments,
      content: a.content,
    });
    refreshArticles();
  };

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    totalViews: articles.reduce((acc, a) => acc + a.views, 0),
    totalEngagement: articles.reduce((acc, a) => acc + a.likes + a.comments, 0),
  };

  return (
    <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Articles</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <FileText className="h-10 w-10 text-primary/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Published</p>
                <p className="text-2xl font-bold mt-1">{stats.published}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-emerald-500/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Drafts</p>
                <p className="text-2xl font-bold mt-1">{stats.drafts}</p>
              </div>
              <Pencil className="h-10 w-10 text-blue-500/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Views</p>
                <p className="text-2xl font-bold mt-1">{(stats.totalViews / 1000).toFixed(1)}K</p>
              </div>
              <Eye className="h-10 w-10 text-primary/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Engagement</p>
                <p className="text-2xl font-bold mt-1">{stats.totalEngagement}</p>
              </div>
              <Zap className="h-10 w-10 text-amber-500/20" />
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              filterStatus === 'published'
                ? 'bg-emerald-500/20 text-emerald-700 border-emerald-300'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Published
          </button>

          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              filterStatus === 'draft'
                ? 'bg-blue-500/20 text-blue-700 border-blue-300'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Drafts
          </button>

          <Link
            href="/dashboard/newarticle?from=articles"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Article
          </Link>
        </div>

        {/* Articles List */}
        <div className="space-y-3">
          {filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center"
            >
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-foreground font-medium">No articles found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? 'Try adjusting your search' : 'Create your first article to get started'}
              </p>
              {!searchTerm && (
                <Link
                  href="/dashboard/newarticle?from=articles"
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Create Article
                </Link>
              )}
            </motion.div>
          ) : (
            filteredArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {article.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          article.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-700'
                            : article.status === 'draft'
                              ? 'bg-blue-500/10 text-blue-700'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {article.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {article.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {article.description}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.lastEdited}
                      </span>
                      <span>{article.wordCount.toLocaleString()} words</span>

                      {article.status === 'published' && (
                        <>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {article.views.toLocaleString()} views
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> {article.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> {article.comments}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/dashboard/editarticle/${article.id}?from=articles`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    {article.status === 'published' && (
                      <button
                        onClick={() => handleArchiveArticle(article.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-amber-500 transition-colors"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
  );
}
