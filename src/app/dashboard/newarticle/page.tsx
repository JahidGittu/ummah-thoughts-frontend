'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import DraftArticleEditor from '@/components/dashboard/writer/DraftArticleEditor';
import { saveDraft, saveArticle } from '@/lib/draftStorage';

export default function NewArticlePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get('from') || 'drafts';
  const backHref = from === 'articles' ? '/dashboard/articles' : '/dashboard/drafts';

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'writer') {
    router.push('/dashboard');
    return null;
  }

  const handleClose = () => {
    router.push(backHref);
  };

  const handleSave = (data: {
    content: string;
    title: string;
    category: string;
    tags: string[];
    status?: string;
  }) => {
    const wordCount = data.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const id = `art_${Date.now()}`;
    const text = data.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const description = text.length > 160 ? text.slice(0, 160) + '...' : text;
    if (from === 'articles') {
      saveArticle({
        id,
        title: data.title,
        description,
        category: data.category,
        tags: data.tags ?? [],
        status: 'draft',
        wordCount,
        lastEdited: 'Just now',
        content: data.content,
      });
    } else {
      const progress = Math.min(100, Math.round((wordCount / 500) * 100));
      saveDraft({
        id,
        title: data.title,
        category: data.category,
        content: data.content,
        lastEdited: 'Just now',
        progress,
        wordCount,
        tags: data.tags ?? [],
        status: data.status,
      });
    }
    handleClose();
  };

  return (
    <DraftArticleEditor
      draft={undefined}
      backLabel={from === 'articles' ? 'Articles' : 'Drafts'}
      onClose={handleClose}
      onSave={handleSave}
    />
  );
}
