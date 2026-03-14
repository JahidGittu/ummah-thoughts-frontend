'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check, X, Save } from "lucide-react";
import { toast } from "sonner";
import ArticleRichTextEditor from "./ArticleRichTextEditor";
import { EditorErrorBoundary } from "./EditorErrorBoundary";

const CATEGORIES = ["Contemporary", "Technology & Islam", "Governance", "Comparative Religion", "Jurisprudence", "History", "Spirituality", "Fiqh", "General"];

export type DraftStatus = "Draft" | "Under Review" | "Published";

export interface DraftArticleEditorDraft {
  id?: string | number;
  title?: string;
  category?: string;
  content?: string;
  lastEdited?: string;
  progress?: number;
  wordCount?: number;
  tags?: string[];
  status?: DraftStatus;
}

export interface DraftArticleEditorProps {
  draft?: DraftArticleEditorDraft | null;
  backLabel?: string;
  onClose: () => void;
  onSave: (data: { content: string; title: string; category: string; tags: string[]; status?: DraftStatus }) => void;
  onSubmit?: (data: { content: string; title: string; category: string; tags: string[]; status?: DraftStatus }) => void;
}

export default function DraftArticleEditor({
  draft,
  backLabel = "Drafts",
  onClose,
  onSave,
  onSubmit,
}: DraftArticleEditorProps) {
  const initialContent = useMemo(() => {
    const raw = draft?.content ?? "";
    if (!raw) return "<p><br></p>";
    if (raw.trim().startsWith("<")) return raw;
    return raw.split("\n\n").map((p) => `<p>${p}</p>`).join("");
  }, [draft?.content]);

  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(draft?.title ?? "");
  const [category, setCategory] = useState(draft?.category ?? "Contemporary");
  const [tags, setTags] = useState<string[]>(draft?.tags ?? []);
  const [status, setStatus] = useState<DraftStatus>(draft?.status ?? "Draft");
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleContentChange = useCallback((html: string) => {
    setContent(html);
  }, []);

  // Auto-save to localStorage every 45s (debounced)
  const autoSaveKey = `article-draft-${draft?.id ?? "new"}`;
  const lastSaveRef = useRef<string>("");
  useEffect(() => {
    const snapshot = JSON.stringify({ content, title, category, tags, status });
    if (snapshot === lastSaveRef.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(autoSaveKey, JSON.stringify({ content, title, category, tags, status, savedAt: Date.now() }));
        lastSaveRef.current = snapshot;
      } catch {
        // ignore quota errors
      }
    }, 45000);
    return () => clearTimeout(t);
  }, [content, title, category, tags, status, autoSaveKey]);

  // New article: always blank (no restore from localStorage).
  // Drafts/article edit: load from page/draft prop (which comes from localStorage via routes).

  const wordCount = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const progress = Math.min(100, Math.round((wordCount / 500) * 100));

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const textContent = content.replace(/<[^>]*>/g, " ").trim();
    if (!trimmedTitle) {
      toast.error("Please add a title");
      return;
    }
    if (!textContent || textContent.length < 10) {
      toast.error("Please add some content (at least 10 characters)");
      return;
    }
    onSave({ content, title: trimmedTitle, category, tags, status });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    try {
      localStorage.removeItem(autoSaveKey);
    } catch {
      // ignore
    }
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const textContent = content.replace(/<[^>]*>/g, " ").trim();
    if (!trimmedTitle) {
      toast.error("Please add a title before submitting");
      return;
    }
    if (!textContent || textContent.length < 10) {
      toast.error("Please add some content (at least 10 characters) before submitting");
      return;
    }
    const data = { content, title: trimmedTitle, category, tags, status };
    if (onSubmit) {
      onSubmit(data);
      onClose();
    } else {
      onSave(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border shadow-sm h-12 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" /> {backLabel}
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-0.5">
            <button
              onClick={() => setPreviewMode(false)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${!previewMode ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Edit
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${previewMode ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Preview
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">{wordCount.toLocaleString()} words</span>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${saved ? "bg-emerald-500 text-white" : "bg-muted text-foreground hover:bg-muted/80"}`}
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5" /> Saved
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Save Draft
              </>
            )}
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Submit for Review
          </button>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main editor column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-3xl mx-auto px-6 py-10">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-display font-bold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-2 resize-none"
                placeholder="Add title"
              />
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{category}</span>
                <span className="text-xs text-muted-foreground">· Last edited {draft?.lastEdited ?? "Now"}</span>
              </div>

              {previewMode ? (
                <div className="prose prose-sm max-w-none text-foreground dark:prose-invert" dangerouslySetInnerHTML={{ __html: content || "" }} />
              ) : (
                <EditorErrorBoundary>
                  <ArticleRichTextEditor
                    content={content}
                    onContentChange={handleContentChange}
                    placeholder="Start writing..."
                    readOnly={false}
                  />
                </EditorErrorBoundary>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden xl:flex flex-col w-64 border-l border-border bg-card overflow-y-auto shrink-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Document</p>
          </div>

          <div className="px-4 py-3 border-b border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DraftStatus)}
              className="w-full text-xs bg-muted rounded-lg px-2.5 py-1.5 border-none outline-none text-foreground"
            >
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="px-4 py-3 border-b border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs bg-muted rounded-lg px-2.5 py-1.5 border-none outline-none text-foreground"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="px-4 py-3 border-b border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tags</p>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium flex items-center gap-1 w-fit"
                >
                  {tag} <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => removeTag(tag)} />
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="w-full text-xs bg-muted rounded-lg px-2.5 py-1.5 outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="Add tag…"
              />
              <button
                type="button"
                onClick={addTag}
                className="text-xs px-2 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground"
              >
                Add
              </button>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Completion</p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>

          <div className="px-4 py-3 space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Word Count</p>
            <p className="text-2xl font-bold text-foreground">{wordCount.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">~{Math.ceil(wordCount / 200)} min read</p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
