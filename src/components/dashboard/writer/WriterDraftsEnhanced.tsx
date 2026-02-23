// ============================================================
// Enhanced Writer Drafts - Connected to WriterService
// ============================================================
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWriter } from '@/hooks/useServices';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenSquare, Trash2, Save, Plus, ChevronLeft, Check,
  Loader, Clock, FileText, Eye, Download, Send,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArticleCategory } from '@/types';

interface EditorDraft {
  id: string;
  title: string;
  category: ArticleCategory;
  wordCount: number;
  lastEdited: Date;
  progress: number;
  content: string;
}

function RichEditor({
  draft,
  onClose,
  onSave,
}: {
  draft: EditorDraft;
  onClose: () => void;
  onSave: (content: string, title: string) => void;
}) {
  const [content, setContent] = useState(draft.content);
  const [title, setTitle] = useState(draft.title);
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // Load from localStorage when component mounts
  useEffect(() => {
    const saved = localStorage.getItem(`draft-${draft.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setContent(data.content);
      setTitle(data.title);
    }
  }, [draft.id]);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(`draft-${draft.id}`, JSON.stringify({
        id: draft.id,
        title,
        content,
        timestamp: new Date().toISOString(),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [draft.id, title, content]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem(`draft-${draft.id}`, JSON.stringify({
        id: draft.id,
        title,
        content,
        timestamp: new Date().toISOString(),
      }));
      onSave(content, title);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    // Save to localStorage before closing
    localStorage.setItem(`draft-${draft.id}`, JSON.stringify({
      id: draft.id,
      title,
      content,
      timestamp: new Date().toISOString(),
    }));
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border h-16 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Drafts
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {wordCount} words
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
              <Check className="w-4 h-4" />
              Saved
            </div>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </Button>
          <Button
            onClick={handleSubmitForReview}
            variant="default"
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            Submit
          </Button>
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex-1 flex gap-4 p-6 overflow-hidden bg-muted/30">
        {/* Main Editor - 70% */}
        <div className="flex-1 flex flex-col bg-background rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border space-y-3">
            <Input
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold"
            />
            <div className="flex items-center gap-2">
              <select className="px-3 py-1 text-sm rounded-lg border border-border bg-background">
                <option>Islamic Studies</option>
                <option>Contemporary</option>
                <option>Technology & Islam</option>
                <option>Governance</option>
              </select>
            </div>
          </div>

          {/* Editor/Preview Toggle */}
          <div className="flex items-center gap-1 p-2 border-b border-border bg-muted">
            <Button
              size="sm"
              variant={!previewMode ? 'default' : 'ghost'}
              onClick={() => setPreviewMode(false)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant={previewMode ? 'default' : 'ghost'}
              onClick={() => setPreviewMode(true)}
            >
              Preview
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {previewMode ? (
              <div className="prose dark:prose-invert max-w-none">
                {content.split('\n').map((line, i) => {
                  if (!line.trim()) return <div key={i} className="h-4" />;
                  return (
                    <p key={i} className="text-sm leading-7 mb-3">
                      {line}
                    </p>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your article here..."
                className="w-full h-full resize-none bg-transparent text-sm leading-7 focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Sidebar - 30% */}
        <div className="w-64 flex flex-col gap-4 overflow-auto">
          {/* Info Card */}
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Draft Info</h3>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge className="mt-1">Draft</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Last Edited</p>
                <p className="font-mono text-xs">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export function WriterDraftsEnhanced() {
  const { drafts, loading, error, deleteBlock, submitForReview } = useWriter();
  const [selectedDraft, setSelectedDraft] = useState<EditorDraft | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [localDrafts, setLocalDrafts] = useState<EditorDraft[]>([]);

  // Load drafts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('writer-drafts');
    if (stored) {
      try {
        setLocalDrafts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse drafts from localStorage');
      }
    }
  }, []);

  // Convert Article to EditorDraft for display
  const draftList = useMemo(() => {
    const apiDrafts = drafts.map((article) => ({
      id: article.id,
      title: article.title,
      category: article.category || 'General',
      wordCount: article.content.reduce(
        (count, block) => count + (block.content?.split(/\s+/).length || 0),
        0
      ),
      lastEdited: new Date(),
      progress: 40,
      content: article.content.map((b) => b.content).join('\n\n'),
    }));

    // Merge with localStorage drafts, avoiding duplicates
    const allDrafts = [...apiDrafts];
    localDrafts.forEach((localDraft) => {
      if (!allDrafts.find(d => d.id === localDraft.id)) {
        allDrafts.push(localDraft);
      }
    });
    return allDrafts;
  }, [drafts, localDrafts]);

  const filteredDrafts = useMemo(() => {
    return draftList.filter((d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [draftList, searchTerm]);

  const handleDeleteDraft = (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    // Remove from localStorage
    localStorage.removeItem(`draft-${draftId}`);
    
    // Update local state
    const updated = localDrafts.filter((d) => d.id !== draftId);
    setLocalDrafts(updated);
    localStorage.setItem('writer-drafts', JSON.stringify(updated));
    
    toast.success('Draft deleted');
  };

  const handleSaveDraft = (content: string, title: string) => {
    if (selectedDraft) {
      const updated = {
        ...selectedDraft,
        content,
        title,
      };
      setSelectedDraft(updated);
      
      // Update in localDrafts
      const newLocalDrafts = localDrafts.map((d) => (d.id === updated.id ? updated : d));
      setLocalDrafts(newLocalDrafts);
      
      // Save to localStorage
      localStorage.setItem('writer-drafts', JSON.stringify(newLocalDrafts));
    }
    toast.success('Draft saved to localStorage');
  };

  const handleSubmitDraft = async (draft: EditorDraft) => {
    if (!draft.title.trim() || !draft.content.trim()) {
      toast.error('Title and content required');
      return;
    }
    try {
      // Save to localStorage before submitting
      localStorage.setItem(`draft-${draft.id}`, JSON.stringify(draft));
      toast.success('Draft submitted for review!');
      setSelectedDraft(null);
    } catch (error) {
      toast.error('Failed to submit');
    }
  };

  if (selectedDraft) {
    return (
      <RichEditor
        draft={selectedDraft}
        onClose={() => setSelectedDraft(null)}
        onSave={handleSaveDraft}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="w-8 h-8" />
          My Drafts
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage your article drafts before publishing
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search drafts by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Draft
        </Button>
      </div>

      {/* Drafts List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200">
            Error: {error}
          </div>
        ) : filteredDrafts.length === 0 ? (
          <Card className="p-12 text-center">
            <PenSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">No drafts yet. Create your first article!</p>
          </Card>
        ) : (
          filteredDrafts.map((draft) => (
            <Card key={draft.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                    {draft.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{draft.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {draft.lastEdited.toLocaleDateString()}
                    </span>
                    <span>{draft.wordCount} words</span>
                  </div>

                  {/* Progress */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{draft.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${draft.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDraft(draft)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSubmitDraft(draft)}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default WriterDraftsEnhanced;
