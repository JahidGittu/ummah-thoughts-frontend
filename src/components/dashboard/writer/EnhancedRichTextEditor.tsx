'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link2, Image, AlignLeft, AlignCenter, AlignRight,
  Minus, Code2, ExternalLink, Plus, Trash2, Download, Share2, Eye, Save,
  ChevronLeft, Check, Upload, X as XIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormattedText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

interface ContentSegment {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'code' | 'image' | 'divider';
  level?: 1 | 2 | 3; // for headings
  content: string;
  listType?: 'bullet' | 'numbered';
  imageUrl?: string;
  imageCaption?: string;
  alignment?: 'left' | 'center' | 'right';
  codeLanguage?: string;
}

interface EditorState {
  title: string;
  description: string;
  segments: ContentSegment[];
  category: string;
  tags: string[];
  coverImage?: string;
}

export interface EnhancedRichTextEditorProps {
  initialContent?: EditorState;
  onSave?: (content: EditorState) => void;
  onPublish?: (content: EditorState) => void;
  isPublishing?: boolean;
  readOnly?: boolean;
}

export default function EnhancedRichTextEditor({
  initialContent,
  onSave,
  onPublish,
  isPublishing = false,
  readOnly = false,
}: EnhancedRichTextEditorProps) {
  const [content, setContent] = useState<EditorState>(
    initialContent || {
      title: '',
      description: '',
      segments: [],
      category: 'fiqh',
      tags: [],
    }
  );

  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOverSegment, setDragOverSegment] = useState<string | null>(null);

  const generateId = () => `seg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add a new segment
  const addSegment = useCallback((type: ContentSegment['type'], afterSegmentId?: string) => {
    const newSegment: ContentSegment = {
      id: generateId(),
      type,
      content: '',
      alignment: 'left',
      ...(type === 'heading' && { level: 1 as const }),
      ...(type === 'list' && { listType: 'bullet' as const }),
      ...(type === 'code' && { codeLanguage: 'javascript' as const }),
    };

    setContent(prev => {
      const newSegments = [...prev.segments];
      if (afterSegmentId) {
        const idx = newSegments.findIndex(s => s.id === afterSegmentId);
        if (idx >= 0) {
          newSegments.splice(idx + 1, 0, newSegment);
        } else {
          newSegments.push(newSegment);
        }
      } else {
        newSegments.push(newSegment);
      }
      return { ...prev, segments: newSegments };
    });

    setSelectedSegmentId(newSegment.id);
  }, []);

  // Update segment
  const updateSegment = useCallback((segmentId: string, updates: Partial<ContentSegment>) => {
    setContent(prev => ({
      ...prev,
      segments: prev.segments.map(s =>
        s.id === segmentId ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  // Delete segment
  const deleteSegment = useCallback((segmentId: string) => {
    setContent(prev => ({
      ...prev,
      segments: prev.segments.filter(s => s.id !== segmentId),
    }));
    setSelectedSegmentId(null);
  }, []);

  // Move segment
  const moveSegment = useCallback((segmentId: string, direction: 'up' | 'down') => {
    setContent(prev => {
      const idx = prev.segments.findIndex(s => s.id === segmentId);
      if (idx === -1) return prev;

      const newSegments = [...prev.segments];
      if (direction === 'up' && idx > 0) {
        [newSegments[idx], newSegments[idx - 1]] = [newSegments[idx - 1], newSegments[idx]];
      } else if (direction === 'down' && idx < newSegments.length - 1) {
        [newSegments[idx], newSegments[idx + 1]] = [newSegments[idx + 1], newSegments[idx]];
      }
      return { ...prev, segments: newSegments };
    });
  }, []);

  // Handle image upload
  const handleImageUpload = (segmentId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateSegment(segmentId, {
        imageUrl: dataUrl,
        content: segmentId,
      });
      setUploadedImages(prev => ({
        ...prev,
        [segmentId]: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Save draft
  const handleSaveDraft = () => {
    onSave?.(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Publish
  const handlePublish = () => {
    if (content.title.trim() && content.segments.length > 0) {
      onPublish?.(content);
    }
  };

  const selectedSegment = content.segments.find(s => s.id === selectedSegmentId);

  // Render preview
  const renderPreview = () => {
    return (
      <div className="prose prose-sm max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{content.title || 'Untitled'}</h1>
        {content.description && <p className="text-lg text-muted-foreground mb-6">{content.description}</p>}

        {content.segments.map(segment => (
          <div key={segment.id} style={{ textAlign: segment.alignment as any }} className="mb-4">
            {segment.type === 'heading' && (
              <div
                className={`font-bold mb-3 ${
                  segment.level === 1 ? 'text-2xl' : segment.level === 2 ? 'text-xl' : 'text-lg'
                }`}
              >
                {segment.content}
              </div>
            )}
            {segment.type === 'paragraph' && <p className="leading-7 text-foreground">{segment.content}</p>}
            {segment.type === 'quote' && (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                {segment.content}
              </blockquote>
            )}
            {segment.type === 'list' && (
              <div className={segment.listType === 'numbered' ? 'list-decimal' : 'list-disc'} style={{ paddingLeft: '2rem' }}>
                {segment.content.split('\n').map((line, i) => (
                  line.trim() && (
                    <div key={i} className={segment.listType === 'numbered' ? 'list-item' : 'list-item'}>
                      {line}
                    </div>
                  )
                ))}
              </div>
            )}
            {segment.type === 'code' && (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm font-mono">{segment.content}</code>
              </pre>
            )}
            {segment.type === 'image' && segment.imageUrl && (
              <figure className="my-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={segment.imageUrl} alt={segment.imageCaption || 'Article image'} className="w-full rounded-lg" />
                {segment.imageCaption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{segment.imageCaption}</figcaption>}
              </figure>
            )}
            {segment.type === 'divider' && <hr className="my-6 border-border" />}
          </div>
        ))}
      </div>
    );
  };

  if (!readOnly && previewMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-background"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Edit
          </button>
          <h2 className="text-lg font-semibold">Preview</h2>
          <div />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-background">{renderPreview()}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Article Editor</h1>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{content.segments.length} segments</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-muted/50 transition-colors"
          >
            <Eye className="h-4 w-4" /> Preview
          </button>

          <button
            onClick={handleSaveDraft}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved' : 'Save Draft'}
          </button>

          <button
            onClick={handlePublish}
            disabled={!content.title.trim() || content.segments.length === 0 || isPublishing}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Share2 className="h-4 w-4" />
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Metadata */}
          <div className="border-b border-border bg-card/50 p-6 space-y-4">
            <input
              value={content.title}
              onChange={e => setContent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Article Title..."
              className="w-full text-3xl font-bold outline-none border-none bg-transparent text-foreground placeholder:text-muted-foreground/40"
            />
            <textarea
              value={content.description}
              onChange={e => setContent(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description..."
              rows={2}
              className="w-full text-sm outline-none border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground/60 resize-none"
            />
          </div>

          {/* Content areas */}
          <div className="flex-1 overflow-y-auto p-8 bg-background space-y-4">
            <AnimatePresence>
              {content.segments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 text-muted-foreground"
                >
                  <Plus className="h-12 w-12 mb-2 opacity-40" />
                  <p className="text-sm">No content yet. Add your first segment from the toolbar.</p>
                </motion.div>
              ) : (
                content.segments.map((segment, idx) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onDragEnter={() => setDragOverSegment(segment.id)}
                    onDragLeave={() => setDragOverSegment(null)}
                    onDrop={() => setDragOverSegment(null)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSegmentId === segment.id
                        ? 'border-primary bg-primary/5'
                        : dragOverSegment === segment.id
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-border hover:border-border/80 bg-card'
                    }`}
                    onClick={() => setSelectedSegmentId(segment.id)}
                  >
                    <SegmentRenderer
                      segment={segment}
                      isSelected={selectedSegmentId === segment.id}
                      onUpdate={updateSegment}
                      onDelete={deleteSegment}
                      onImageUpload={handleImageUpload}
                      uploadedImages={uploadedImages}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {content.segments.length > 0 && (
              <button
                onClick={() => setShowFormatMenu(true)}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-lg border-2 border-dashed border-border text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Content Block
              </button>
            )}
          </div>
        </div>

        {/* Right toolbar */}
        {!readOnly && selectedSegment && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-64 border-l border-border bg-card overflow-y-auto flex-shrink-0 p-4 space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground">Block Settings</h3>

            {selectedSegment.type === 'heading' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Level</label>
                <select
                  value={selectedSegment.level}
                  onChange={e => updateSegment(selectedSegment.id, { level: parseInt(e.target.value) as any })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background"
                >
                  <option value={1}>Heading 1 (H1)</option>
                  <option value={2}>Heading 2 (H2)</option>
                  <option value={3}>Heading 3 (H3)</option>
                </select>
              </div>
            )}

            {selectedSegment.type === 'list' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">List Type</label>
                <select
                  value={selectedSegment.listType}
                  onChange={e => updateSegment(selectedSegment.id, { listType: e.target.value as any })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background"
                >
                  <option value="bullet">Bullet List</option>
                  <option value="numbered">Numbered List</option>
                </select>
              </div>
            )}

            {selectedSegment.type === 'code' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Language</label>
                <select
                  value={selectedSegment.codeLanguage}
                  onChange={e => updateSegment(selectedSegment.id, { codeLanguage: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="bash">Bash</option>
                </select>
              </div>
            )}

            {selectedSegment.type === 'image' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Caption</label>
                <input
                  value={selectedSegment.imageCaption || ''}
                  onChange={e => updateSegment(selectedSegment.id, { imageCaption: e.target.value })}
                  placeholder="Optional caption"
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background"
                />
              </div>
            )}

            {['paragraph', 'heading', 'quote', 'code', 'list'].includes(selectedSegment.type) && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Alignment</label>
                <div className="flex gap-1.5">
                  {(['left', 'center', 'right'] as const).map(align => (
                    <button
                      key={align}
                      onClick={() => updateSegment(selectedSegment.id, { alignment: align })}
                      className={`flex-1 h-8 rounded text-sm font-medium transition-colors ${
                        selectedSegment.alignment === align
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border hover:bg-muted/50'
                      }`}
                    >
                      {align === 'left' ? <AlignLeft className="h-4 w-4 mx-auto" /> : align === 'center' ? <AlignCenter className="h-4 w-4 mx-auto" /> : <AlignRight className="h-4 w-4 mx-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => deleteSegment(selectedSegment.id)}
              className="w-full mt-4 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-medium transition-colors"
            >
              <Trash2 className="h-4 w-4 inline mr-2" /> Delete Block
            </button>
          </motion.div>
        )}
      </div>

      {/* Add Content Block Menu */}
      <AddBlockMenu open={showFormatMenu} onClose={() => setShowFormatMenu(false)} onSelect={(type) => {
        addSegment(type);
        setShowFormatMenu(false);
      }} />

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
    </motion.div>
  );
}

// Segment Renderer Component
function SegmentRenderer({
  segment,
  isSelected,
  onUpdate,
  onDelete,
  onImageUpload,
  uploadedImages,
}: {
  segment: ContentSegment;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<ContentSegment>) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, file: File) => void;
  uploadedImages: Record<string, string>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentEditRef = useRef<HTMLDivElement>(null);

  const executeCommand = useCallback((command: string, value?: string) => {
    const elem = contentEditRef.current;
    if (!elem) return;

    elem.focus();
    
    try {
      if (value !== undefined) {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command, false);
      }
      
      // Update the content
      onUpdate(segment.id, { content: elem.innerHTML });
    } catch (e) {
      console.error('Command failed:', command, e);
    }
  }, [segment.id, onUpdate]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {/* Segment type indicator and actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground capitalize">{segment.type}</span>
        <div className="flex gap-1">
          {segment.type !== 'divider' && (
            <button
              onClick={() => onDelete(segment.id)}
              className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content input based on type */}
      {segment.type === 'heading' && (
        <div className="space-y-2">
          <div className="flex gap-1 mb-2 pb-2 border-b border-border/50 flex-wrap">
            <button
              onClick={() => executeCommand('bold')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Bold"
            >
              <Bold className="h-3 w-3" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Italic"
            >
              <Italic className="h-3 w-3" />
            </button>
            <button
              onClick={() => executeCommand('underline')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Underline"
            >
              <Underline className="h-3 w-3" />
            </button>
          </div>
          <div
            ref={contentEditRef}
            onInput={e => {
              const html = (e.currentTarget as HTMLDivElement).innerHTML;
              onUpdate(segment.id, { content: html });
            }}
            suppressContentEditableWarning
            contentEditable
            className={`w-full bg-transparent outline-none border-none text-foreground placeholder:text-muted-foreground/40 font-bold focus:ring-1 focus:ring-primary/30 rounded p-2 ${
              segment.level === 1 ? 'text-2xl' : segment.level === 2 ? 'text-xl' : 'text-lg'
            }`}
            dangerouslySetInnerHTML={{ __html: segment.content || '' }}
          />
        </div>
      )}

      {segment.type === 'paragraph' && (
        <div className="space-y-2">
          <div className="flex gap-1 mb-2 pb-2 border-b border-border/50 flex-wrap">
            <button
              onClick={() => executeCommand('bold')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Bold"
            >
              <Bold className="h-3 w-3" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Italic"
            >
              <Italic className="h-3 w-3" />
            </button>
            <button
              onClick={() => executeCommand('underline')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Underline"
            >
              <Underline className="h-3 w-3" />
            </button>
            <button
              onClick={() => executeCommand('strikethrough')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Strikethrough"
            >
              <Strikethrough className="h-3 w-3" />
            </button>
            <div className="w-px h-4 bg-border/50" />
            <button
              onClick={() => executeCommand('createLink', prompt('Enter URL:') || '')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Link"
            >
              <Link2 className="h-3 w-3" />
            </button>
          </div>
          <div
            ref={contentEditRef}
            onInput={e => {
              const html = (e.currentTarget as HTMLDivElement).innerHTML;
              onUpdate(segment.id, { content: html });
            }}
            suppressContentEditableWarning
            contentEditable
            className="w-full bg-transparent outline-none border-none text-foreground placeholder:text-muted-foreground/40 resize-none text-sm leading-relaxed focus:ring-1 focus:ring-primary/30 rounded p-2 min-h-[100px]"
            dangerouslySetInnerHTML={{ __html: segment.content || '' }}
          />
        </div>
      )}

      {segment.type === 'quote' && (
        <div className="space-y-2">
          <div className="flex gap-1 mb-2 pb-2 border-b border-border/50 flex-wrap">
            <button
              onClick={() => executeCommand('bold')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Bold"
            >
              <Bold className="h-3 w-3" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Italic"
            >
              <Italic className="h-3 w-3" />
            </button>
          </div>
          <div
            ref={contentEditRef}
            onInput={e => {
              const html = (e.currentTarget as HTMLDivElement).innerHTML;
              onUpdate(segment.id, { content: html });
            }}
            suppressContentEditableWarning
            contentEditable
            className="w-full bg-transparent outline-none border-none text-foreground placeholder:text-muted-foreground/40 resize-none italic text-sm focus:ring-1 focus:ring-primary/30 rounded p-2 min-h-[60px]"
            dangerouslySetInnerHTML={{ __html: segment.content || '' }}
          />
        </div>
      )}

      {segment.type === 'list' && (
        <div className="space-y-2">
          <div className="flex gap-1 mb-2 pb-2 border-b border-border/50 flex-wrap">
            <button
              onClick={() => executeCommand('insertUnorderedList')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Bullet List"
            >
              <List className="h-3 w-3" />
            </button>
            <button
              onClick={() => executeCommand('insertOrderedList')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="h-3 w-3" />
            </button>
            <div className="w-px h-4 bg-border/50" />
            <button
              onClick={() => executeCommand('bold')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Bold"
            >
              <Bold className="h-3 w-3" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="w-6 h-6 rounded text-xs hover:bg-muted flex items-center justify-center hover:text-foreground transition-colors"
              title="Italic"
            >
              <Italic className="h-3 w-3" />
            </button>
          </div>
          <div
            ref={contentEditRef}
            onInput={e => {
              const html = (e.currentTarget as HTMLDivElement).innerHTML;
              onUpdate(segment.id, { content: html });
            }}
            suppressContentEditableWarning
            contentEditable
            className="w-full bg-transparent outline-none border-none text-foreground placeholder:text-muted-foreground/40 resize-none text-sm focus:ring-1 focus:ring-primary/30 rounded p-2 min-h-[80px]"
            dangerouslySetInnerHTML={{ __html: segment.content || 'One item per line...' }}
          />
        </div>
      )}

      {segment.type === 'code' && (
        <div className="space-y-2">
          <div className="flex gap-1 mb-2 pb-2 border-b border-border/50 flex-wrap">
            <span className="text-xs text-muted-foreground py-1">Language:</span>
            <select
              value={segment.codeLanguage || 'javascript'}
              onChange={e => onUpdate(segment.id, { codeLanguage: e.target.value })}
              className="text-xs bg-muted rounded px-2 py-0.5 border-none outline-none text-foreground"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="bash">Bash</option>
              <option value="sql">SQL</option>
              <option value="java">Java</option>
            </select>
          </div>
          <textarea
            value={segment.content}
            onChange={e => onUpdate(segment.id, { content: e.target.value })}
            placeholder="Paste your code here..."
            rows={6}
            className="w-full bg-muted font-mono text-xs rounded p-3 outline-none border-none text-foreground resize-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      )}

      {segment.type === 'image' && (
        <div className="space-y-2">
          {segment.imageUrl || uploadedImages[segment.id] ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={segment.imageUrl || uploadedImages[segment.id]} alt="Content" className="w-full rounded-lg max-h-96 object-cover" />
              <button
                onClick={() => {
                  onUpdate(segment.id, { imageUrl: undefined, imageCaption: '', content: '' });
                }}
                className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded hover:bg-destructive transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={handleImageClick}
              className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">Click to upload image</p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
            </div>
          )}
          {(segment.imageUrl || uploadedImages[segment.id]) && (
            <input
              value={segment.imageCaption || ''}
              onChange={e => onUpdate(segment.id, { imageCaption: e.target.value })}
              placeholder="Image caption (optional)"
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-primary/30"
            />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                onImageUpload(segment.id, file);
              }
            }}
          />
        </div>
      )}

      {segment.type === 'divider' && (
        <div className="h-px bg-border w-full my-4" />
      )}
    </div>
  );
}

// Add Block Menu Component
function AddBlockMenu({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: ContentSegment['type']) => void;
}) {
  const blocks = [
    { type: 'heading' as const, icon: Heading1, label: 'Heading' },
    { type: 'paragraph' as const, icon: Quote, label: 'Paragraph' },
    { type: 'quote' as const, icon: Quote, label: 'Quote' },
    { type: 'list' as const, icon: List, label: 'Bullet List' },
    { type: 'code' as const, icon: Code2, label: 'Code Block' },
    { type: 'image' as const, icon: Image, label: 'Image' },
    { type: 'divider' as const, icon: Minus, label: 'Divider' },
  ];

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        className="bg-card rounded-lg shadow-xl p-6 w-96 max-h-96 overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-4">Add Content Block</h2>
        <div className="grid grid-cols-2 gap-3">
          {blocks.map(block => {
            const Icon = block.icon;
            return (
              <button
                key={block.type}
                onClick={() => onSelect(block.type)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Icon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{block.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 text-sm font-medium"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
