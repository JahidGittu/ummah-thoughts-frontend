'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DraftArticleEditor, { DraftArticleEditorDraft, DraftStatus } from '@/components/dashboard/writer/DraftArticleEditor';
import { getDraftById, getArticleById, saveDraft, saveArticle } from '@/lib/draftStorage';

export default function EditArticlePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string | undefined;
  const from = searchParams?.get('from') || 'drafts';
  const backHref = from === 'articles' ? '/dashboard/articles' : '/dashboard/drafts';
  const [draft, setDraft] = useState<DraftArticleEditorDraft | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!id || typeof window === 'undefined') {
      setDraft(null);
      return;
    }
    const d = getDraftById(id);
    if (d) {
      setDraft({
        ...d,
        status: (d.status as DraftStatus) ?? undefined,
      });
      return;
    }
    const a = getArticleById(id);
    if (a) {
      setDraft({
        id: a.id,
        title: a.title,
        category: a.category,
        content: a.content ?? a.description ?? '',
        lastEdited: a.lastEdited,
        tags: a.tags ?? [],
      });
      return;
    }
    setDraft(null);
  }, [id]);

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

  if (draft === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (draft === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Draft or article not found.</p>
        <button
          onClick={() => router.push(backHref)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
        >
          Back to {from === 'articles' ? 'Articles' : 'Drafts'}
        </button>
      </div>
    );
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
    const progress = Math.min(100, Math.round((wordCount / 500) * 100));
    const article = getArticleById(id!);
    if (article) {
      saveArticle({
        ...article,
        title: data.title,
        category: data.category,
        content: data.content,
        tags: data.tags ?? [],
        wordCount,
        lastEdited: 'Just now',
      });
    } else {
      saveDraft({
        id: draft.id ?? id!,
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
      draft={draft}
      backLabel={from === 'articles' ? 'Articles' : 'Drafts'}
      onClose={handleClose}
      onSave={handleSave}
    />
  );
}
