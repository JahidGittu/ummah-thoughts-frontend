import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenSquare, Clock, Trash2, Eye, Save, Plus, X, Bold, Italic,
  Underline, List, ListOrdered, Quote, Link2, Image, AlignLeft,
  AlignCenter, AlignRight, Heading1, Heading2, ChevronLeft, Check,
  Type, Hash, Minus, Upload as UploadIcon
} from "lucide-react";

const drafts = [
  { id: 1, title: "Digital Caliphate: A Critical Analysis", category: "Contemporary", wordCount: 2840, lastEdited: "2 hours ago", progress: 70,
    content: "The notion of a 'Digital Caliphate' has emerged as one of the most contested concepts in contemporary Islamic discourse. Proponents argue that the internet provides an unprecedented platform for Muslim unity across geographic boundaries...\n\nHowever, classical scholars have consistently maintained that legitimate Islamic governance requires physical jurisdiction, accountability structures, and the presence of qualified scholars in positions of authority...\n\nThis analysis examines three dimensions: theological legitimacy, practical governance, and the historical precedent of Islamic political theory." },
  { id: 2, title: "Fiqh of Artificial Intelligence", category: "Technology & Islam", wordCount: 1200, lastEdited: "Yesterday", progress: 40,
    content: "Artificial intelligence presents novel fiqhi questions that classical jurists could not have anticipated. At its core, AI raises questions about agency, responsibility (mas'uliyya), and the moral status of non-human decision-makers...\n\nThe Maliki tradition's emphasis on maslaha (public interest) may offer the most flexible framework for evaluating AI applications in Islamic contexts." },
  { id: 3, title: "The Concept of Ummah in the 21st Century", category: "Governance", wordCount: 650, lastEdited: "3 days ago", progress: 20,
    content: "The ummah — the global community of Muslims — has always been more than a sociological category. It carries theological weight, implying shared obligation, mutual care (ta'awun), and collective identity..." },
  { id: 4, title: "Interfaith Dialogue: An Islamic Perspective", category: "Comparative Religion", wordCount: 3100, lastEdited: "1 week ago", progress: 85,
    content: "Islamic tradition has a rich, though often underappreciated, history of interfaith engagement. From the Constitution of Medina to the scholarly exchanges of Andalusia, Muslims have participated in substantive dialogue with adherents of other faiths...\n\nContemporary interfaith dialogue must navigate between the imperative of da'wa and the ethics of respectful engagement with the religious other." },
];

type FormatAction = { icon: React.ElementType; label: string; action: string };

const TOOLBAR_GROUPS: FormatAction[][] = [
  [
    { icon: Heading1, label: "H1", action: "h1" },
    { icon: Heading2, label: "H2", action: "h2" },
    { icon: Type, label: "Body", action: "p" },
  ],
  [
    { icon: Bold, label: "Bold", action: "bold" },
    { icon: Italic, label: "Italic", action: "italic" },
    { icon: Underline, label: "Underline", action: "underline" },
  ],
  [
    { icon: AlignLeft, label: "Left", action: "alignLeft" },
    { icon: AlignCenter, label: "Center", action: "alignCenter" },
    { icon: AlignRight, label: "Right", action: "alignRight" },
  ],
  [
    { icon: List, label: "Bullet List", action: "ul" },
    { icon: ListOrdered, label: "Numbered List", action: "ol" },
    { icon: Quote, label: "Blockquote", action: "blockquote" },
  ],
  [
    { icon: Link2, label: "Link", action: "link" },
    { icon: Image, label: "Image", action: "image" },
    { icon: Minus, label: "Divider", action: "hr" },
  ],
];

interface EditorDraft {
  id: number; title: string; category: string; wordCount: number; lastEdited: string; progress: number; content: string;
}

function RichEditor({ draft, onClose, onSave }: { draft: EditorDraft; onClose: () => void; onSave: (content: string, title: string) => void }) {
  const [content, setContent] = useState(draft.content);
  const [title, setTitle] = useState(draft.title);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleFormat = useCallback((action: string) => {
    const editable = contentEditableRef.current;
    if (!editable) return;

    editable.focus();
    
    // Execute formatting commands
    switch(action) {
      case "bold":
        document.execCommand("bold", false);
        break;
      case "italic":
        document.execCommand("italic", false);
        break;
      case "underline":
        document.execCommand("underline", false);
        break;
      case "h1":
        document.execCommand("formatBlock", false, "<h1>");
        break;
      case "h2":
        document.execCommand("formatBlock", false, "<h2>");
        break;
      case "p":
        document.execCommand("formatBlock", false, "<p>");
        break;
      case "ul":
        document.execCommand("insertUnorderedList", false);
        break;
      case "ol":
        document.execCommand("insertOrderedList", false);
        break;
      case "blockquote":
        document.execCommand("formatBlock", false, "<blockquote>");
        break;
      case "alignLeft":
        document.execCommand("justifyLeft", false);
        break;
      case "alignCenter":
        document.execCommand("justifyCenter", false);
        break;
      case "alignRight":
        document.execCommand("justifyRight", false);
        break;
      case "link":
        const url = prompt("Enter URL:");
        if (url) document.execCommand("createLink", false, url);
        break;
      case "image":
        fileInputRef.current?.click();
        break;
      case "hr":
        document.execCommand("insertHorizontalRule", false);
        break;
    }

    const next = new Set(activeFormats);
    if (next.has(action)) next.delete(action);
    else next.add(action);
    setActiveFormats(next);
    
    // Update content state
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerHTML);
    }
  }, [activeFormats]);

  const handleSave = () => {
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerHTML);
    }
    onSave(content, title);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const editable = contentEditableRef.current;
      if (editable) {
        editable.focus();
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.style.maxWidth = "100%";
        img.style.borderRadius = "0.5rem";
        img.style.margin = "0.5rem 0";
        document.execCommand("insertHTML", false, img.outerHTML);
        setContent(editable.innerHTML);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderPreview = () => {
    return (
      <div 
        className="prose prose-sm max-w-none text-foreground"
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* WP-style top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border shadow-sm h-12 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" /> Drafts
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-0.5">
            <button onClick={() => setPreviewMode(false)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${!previewMode ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>
              Edit
            </button>
            <button onClick={() => setPreviewMode(true)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${previewMode ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>
              Preview
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">{wordCount.toLocaleString()} words</span>
          <button onClick={handleSave}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${saved ? "bg-emerald-500 text-white" : "bg-muted text-foreground hover:bg-muted/80"}`}>
            {saved ? <><Check className="h-3.5 w-3.5" /> Saved</> : <><Save className="h-3.5 w-3.5" /> Save Draft</>}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
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
          {/* Format toolbar */}
          {!previewMode && (
            <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card/50 flex-wrap">
              {TOOLBAR_GROUPS.map((group, gi) => (
                <div key={gi} className="flex items-center gap-0.5">
                  {gi > 0 && <div className="w-px h-5 bg-border mx-1" />}
                  {group.map(btn => (
                    <button key={btn.action} title={btn.label} onClick={() => handleFormat(btn.action)}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-colors ${activeFormats.has(btn.action) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                      <btn.icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Content area */}
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-3xl mx-auto px-6 py-10">
              {/* Title */}
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-3xl font-display font-bold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-2 resize-none"
                placeholder="Add title"
              />
              <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{draft.category}</span>
                <span className="text-xs text-muted-foreground">· Last edited {draft.lastEdited}</span>
              </div>

              {previewMode ? (
                <div className="prose prose-sm max-w-none">{renderPreview()}</div>
              ) : (
                <div
                  ref={contentEditableRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    setContent((e.currentTarget as HTMLDivElement).innerHTML);
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData?.getData('text/html') || e.clipboardData?.getData('text/plain') || '';
                    document.execCommand('insertHTML', false, text);
                  }}
                  className="w-full min-h-[500px] bg-transparent border-none outline-none resize-none text-sm text-foreground leading-7 placeholder:text-muted-foreground/40 font-body focus:ring-0"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {draft.content}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar — Document Settings */}
        <div className="hidden xl:flex flex-col w-64 border-l border-border bg-card overflow-y-auto flex-shrink-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Document</p>
          </div>

          {/* Status */}
          <div className="px-4 py-3 border-b border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
            <select className="w-full text-xs bg-muted rounded-lg px-2.5 py-1.5 border-none outline-none text-foreground">
              <option>Draft</option>
              <option>Under Review</option>
              <option>Published</option>
            </select>
          </div>

          {/* Category */}
          <div className="px-4 py-3 border-b border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Category</p>
            <select className="w-full text-xs bg-muted rounded-lg px-2.5 py-1.5 border-none outline-none text-foreground">
              {["Contemporary","Technology & Islam","Governance","Comparative Religion","Jurisprudence","History","Spirituality"].map(c => (
                <option key={c} selected={c === draft.category}>{c}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="px-4 py-3 border-b border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tags</p>
            <div className="flex flex-wrap gap-1">
              {["Islam","Fiqh","Modern"].map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium flex items-center gap-1">
                  {tag} <X className="h-2.5 w-2.5 cursor-pointer" />
                </span>
              ))}
            </div>
            <input className="w-full text-xs bg-muted rounded-lg px-2.5 py-1.5 outline-none text-foreground placeholder:text-muted-foreground" placeholder="Add tag…" />
          </div>

          {/* Completion */}
          <div className="px-4 py-3 border-b border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Completion</p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${draft.progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{draft.progress}% complete</p>
          </div>

          {/* Word count */}
          <div className="px-4 py-3 space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Word Count</p>
            <p className="text-2xl font-bold text-foreground">{wordCount.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">~{Math.ceil(wordCount / 200)} min read</p>
          </div>
        </div>
      </div>

      {/* Hidden file input for images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </motion.div>
  );
}
export default function WriterDrafts() {
  const [editingDraft, setEditingDraft] = useState<EditorDraft | null>(null);
  const [draftList, setDraftList] = useState(drafts);

  const handleSave = (content: string, title: string) => {
    if (!editingDraft) return;
    setDraftList(prev => prev.map(d => d.id === editingDraft.id
      ? { ...d, content, title, lastEdited: "Just now", wordCount: content.trim().split(/\s+/).filter(Boolean).length }
      : d
    ));
  };

  return (
    <>
      <AnimatePresence>
        {editingDraft && (
          <RichEditor
            draft={editingDraft}
            onClose={() => setEditingDraft(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{draftList.length} drafts in progress</p>
          <button
            onClick={() => setEditingDraft({ id: Date.now(), title: "", category: "Contemporary", wordCount: 0, lastEdited: "Now", progress: 0, content: "" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> New Draft
          </button>
        </div>

        <div className="space-y-4">
          {draftList.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2 inline-block">{d.category}</span>
                  <h3 className="text-sm font-semibold text-foreground">{d.title || "Untitled Draft"}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {d.lastEdited}</span>
                    <span>{d.wordCount.toLocaleString()} words</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setEditingDraft(d)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/60 text-muted-foreground hover:text-primary transition-colors" title="Preview">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors" title="Save">
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDraftList(prev => prev.filter(x => x.id !== d.id))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Completion</span><span>{d.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${d.progress}%` }} />
                </div>
              </div>
              <button onClick={() => setEditingDraft(d)}
                className="mt-4 w-full py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                <PenSquare className="h-4 w-4" /> Continue Writing
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
