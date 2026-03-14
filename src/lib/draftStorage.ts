/**
 * Local storage utilities for article drafts and publisher articles.
 * Used for persistence across route navigations (newarticle, editarticle).
 */

export interface StoredDraft {
  id: string | number;
  slug?: string;
  title: string;
  category: string;
  content: string;
  lastEdited: string;
  progress: number;
  wordCount: number;
  tags: string[];
  status?: string;
}

export interface StoredArticle {
  id: string;
  slug?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: string;
  wordCount: number;
  content?: string;
  lastEdited: string;
  views?: number;
  likes?: number;
  comments?: number;
}

const DRAFTS_KEY = 'article-drafts-list';
const ARTICLES_KEY = 'article-publisher-list';

export function getDrafts(): StoredDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDraft(draft: StoredDraft): void {
  const list = getDrafts();
  const idx = list.findIndex((d) => String(d.id) === String(draft.id));
  const updated = { ...draft, lastEdited: 'Just now' };
  const next = idx >= 0 ? list.map((d, i) => (i === idx ? updated : d)) : [updated, ...list];
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
}

export function getDraftById(id: string | number): StoredDraft | null {
  const list = getDrafts();
  return list.find((d) => String(d.id) === String(id)) ?? null;
}

export function deleteDraft(id: string | number): void {
  const list = getDrafts().filter((d) => String(d.id) !== String(id));
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(list));
}

export function getArticles(): StoredArticle[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveArticle(article: StoredArticle): void {
  const list = getArticles();
  const idx = list.findIndex((a) => a.id === article.id);
  const next = idx >= 0 ? list.map((a, i) => (i === idx ? article : a)) : [article, ...list];
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(next));
}

export function getArticleById(idOrSlug: string): StoredArticle | null {
  const list = getArticles();
  return list.find((a) => a.id === idOrSlug || (a.slug && a.slug === idOrSlug)) ?? null;
}

export function deleteArticle(id: string): void {
  const list = getArticles().filter((a) => a.id !== id);
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(list));
}
