'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link2, Image, AlignLeft, AlignCenter, AlignRight,
  Minus, Code2, Upload, X as XIcon, ChevronLeft, Check, Save, Eye,
  Type, Trash2, Plus, MoreVertical,
} from 'lucide-react';

interface FormattingState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  h1: boolean;
  h2: boolean;
  h3: boolean;
  p: boolean;
  blockquote: boolean;
  ul: boolean;
  ol: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
}

interface AdvancedRichTextEditorProps {
  initialContent?: string;
  initialTitle?: string;
  onSave?: (content: string, title: string) => void;
  onPublish?: (content: string, title: string) => void;
  isPublishing?: boolean;
  readOnly?: boolean;
  category?: string;
}

export default function AdvancedRichTextEditor({
  initialContent = '',
  initialTitle = '',
  onSave,
  onPublish,
  isPublishing = false,
  readOnly = false,
  category = '',
}: AdvancedRichTextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [previewMode, setPreviewMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formatting, setFormatting] = useState<FormattingState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    h1: false,
    h2: false,
    h3: false,
    p: false,
    blockquote: false,
    ul: false,
    ol: false,
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // Update formatting state based on current selection
  const updateFormattingState = useCallback(() => {
    const states = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikethrough'),
      h1: false,
      h2: false,
      h3: false,
      p: false,
      blockquote: false,
      ul: document.queryCommandState('insertUnorderedList'),
      ol: document.queryCommandState('insertOrderedList'),
      alignLeft: document.queryCommandState('justifyLeft'),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
    };

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.getRangeAt(0).startContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeType === 1) {
          const tag = (node as HTMLElement).tagName.toLowerCase();
          if (tag === 'h1') states.h1 = true;
          if (tag === 'h2') states.h2 = true;
          if (tag === 'h3') states.h3 = true;
          if (tag === 'blockquote') states.blockquote = true;
          if (tag === 'p') states.p = true;
        }
        node = node.parentNode;
      }
    }

    setFormatting(prev => ({ ...prev, ...states }));
  }, []);

  // Apply formatting command
  const applyFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);

    // Update state after a small delay
    setTimeout(() => {
      updateFormattingState();
    }, 0);
  }, [updateFormattingState]);

  // Handle content change
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
    updateFormattingState();
  }, [updateFormattingState]);

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Apply block format
  const applyBlockFormat = useCallback((format: string) => {
    switch (format) {
      case 'h1':
        document.execCommand('formatBlock', false, formatting.h1 ? 'p' : 'h1');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, formatting.h2 ? 'p' : 'h2');
        break;
      case 'h3':
        document.execCommand('formatBlock', false, formatting.h3 ? 'p' : 'h3');
        break;
      case 'p':
        document.execCommand('formatBlock', false, 'p');
        break;
      case 'blockquote':
        if (formatting.blockquote) {
          document.execCommand('formatBlock', false, 'p');
          setTimeout(() => {
            if (document.queryCommandValue('formatBlock').includes('blockquote')) {
              document.execCommand('outdent', false);
            }
            updateFormattingState();
          }, 0);
        } else {
          document.execCommand('formatBlock', false, 'blockquote');
        }
        break;
      case 'ul':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'ol':
        document.execCommand('insertOrderedList', false);
        break;
      case 'pre':
        document.execCommand('formatBlock', false, '<pre>');
        break;
      default:
        break;
    }
    setTimeout(updateFormattingState, 0);
  }, [formatting, updateFormattingState]);

  // Apply alignment
  const applyAlignment = useCallback((alignment: string) => {
    switch (alignment) {
      case 'left':
        document.execCommand('justifyLeft', false);
        break;
      case 'center':
        document.execCommand('justifyCenter', false);
        break;
      case 'right':
        document.execCommand('justifyRight', false);
        break;
      default:
        break;
    }
  }, []);

  // Add link
  const addLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }, []);

  // Add image
  const addImage = useCallback((url: string) => {
    if (url) {
      const caption = prompt('Enter image caption (optional):');
      let html = `<figure style="text-align: center; margin: 1rem 0;"><img src="${url}" alt="${caption || 'Image'}" style="max-width: 100%; border-radius: 0.5rem; margin-bottom: 0.5rem;" />`;
      if (caption) {
        html += `<figcaption style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">${caption}</figcaption>`;
      }
      html += '</figure>';
      document.execCommand('insertHTML', false, html);
    }
  }, []);

  // Add divider
  const addDivider = useCallback(() => {
    document.execCommand('insertHTML', false, '<hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;" />');
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        addImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [addImage]);

  // Save draft
  const handleSaveDraft = useCallback(() => {
    onSave?.(content, title);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [content, title, onSave]);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !content) {
      editorRef.current.innerHTML = '';
    } else if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  if (previewMode) {
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
        <div className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{title || 'Untitled'}</h1>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Article Editor</h1>
          {category && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {category}
            </span>
          )}
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${saved
              ? 'bg-emerald-500 text-white'
              : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved' : 'Save Draft'}
          </button>

          <button
            onClick={() => onPublish?.(content, title)}
            disabled={!title.trim() || !content.trim() || isPublishing}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Title input */}
        <div className="border-b border-border bg-card/50 p-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title..."
            className="w-full text-3xl font-bold outline-none border-none bg-transparent text-foreground placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Formatting toolbar */}
        <div className="border-b border-border bg-card/50 p-3 overflow-x-auto flex items-center gap-0.5 flex-wrap">
          {/* Text formatting */}
          <div className="flex items-center gap-0.5 px-1">
            <ToolbarButton
              icon={Bold}
              label="Bold"
              onClick={() => applyFormat('bold')}
              active={formatting.bold}
            />
            <ToolbarButton
              icon={Italic}
              label="Italic"
              onClick={() => applyFormat('italic')}
              active={formatting.italic}
            />
            <ToolbarButton
              icon={Underline}
              label="Underline"
              onClick={() => applyFormat('underline')}
              active={formatting.underline}
            />
            <ToolbarButton
              icon={Strikethrough}
              label="Strikethrough"
              onClick={() => applyFormat('strikethrough')}
              active={formatting.strikethrough}
            />
          </div>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Headings */}
          <div className="flex items-center gap-0.5 px-1">
            <ToolbarButton
              icon={Heading1}
              label="Heading 1"
              onClick={() => applyBlockFormat('h1')}
            />
            <ToolbarButton
              icon={Heading2}
              label="Heading 2"
              onClick={() => applyBlockFormat('h2')}
            />
            <ToolbarButton
              icon={Heading3}
              label="Heading 3"
              onClick={() => applyBlockFormat('h3')}
            />
            <ToolbarButton
              icon={Type}
              label="Paragraph"
              onClick={() => applyBlockFormat('p')}
            />
          </div>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Alignment */}
          <div className="flex items-center gap-0.5 px-1">
            <ToolbarButton
              icon={AlignLeft}
              label="Align Left"
              onClick={() => applyAlignment('left')}
            />
            <ToolbarButton
              icon={AlignCenter}
              label="Align Center"
              onClick={() => applyAlignment('center')}
            />
            <ToolbarButton
              icon={AlignRight}
              label="Align Right"
              onClick={() => applyAlignment('right')}
            />
          </div>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Lists */}
          <div className="flex items-center gap-0.5 px-1">
            <ToolbarButton
              icon={List}
              label="Bullet List"
              onClick={() => applyBlockFormat('ul')}
            />
            <ToolbarButton
              icon={ListOrdered}
              label="Numbered List"
              onClick={() => applyBlockFormat('ol')}
            />
          </div>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Block elements */}
          <div className="flex items-center gap-0.5 px-1">
            <ToolbarButton
              icon={Quote}
              label="Quote"
              onClick={() => applyBlockFormat('blockquote')}
            />
            <ToolbarButton
              icon={Code2}
              label="Code Block"
              onClick={() => applyBlockFormat('pre')}
            />
            <ToolbarButton
              icon={Link2}
              label="Link"
              onClick={addLink}
            />
            <ToolbarButton
              icon={Image}
              label="Image"
              onClick={() => fileInputRef.current?.click()}
            />
            <ToolbarButton
              icon={Minus}
              label="Divider"
              onClick={addDivider}
            />
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-3xl mx-auto">
            <div
              ref={editorRef}
              contentEditable={!readOnly}
              onInput={handleContentChange}
              onPaste={handlePaste}
              onMouseUp={updateFormattingState}
              onKeyUp={updateFormattingState}
              className="min-h-96 outline-none text-foreground prose prose-sm max-w-none [&>*]:my-3 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-xl [&>h3]:font-bold [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>code]:font-mono [&>code]:text-sm"
              suppressContentEditableWarning
            />
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </motion.div>
  );
}

interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function ToolbarButton({ icon: Icon, label, onClick, active }: ToolbarButtonProps) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={label}
      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-colors ${active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
