'use client';

import React, { useState, useRef, useCallback, useEffect, useReducer } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, Quote, Link2, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Minus, Code2, Table, ListTodo, Type, ChevronDown, X, Undo2, Redo2, IndentIncrease, IndentDecrease,
} from 'lucide-react';
import { getArticleEditorExtensions } from '@/lib/tipTap/articleEditorExtensions';
import { writerService } from '@/services/WriterService';
import { toast } from 'sonner';
import TableInsertModal, { type TableInsertSettings } from './TableInsertModal';
import TableControlsOverlay from './TableControlsOverlay';
import TableHoverBars from './TableHoverBars';

const EDITOR_CLASS = [
  'article-editor-prose w-full min-h-[500px] outline-none text-foreground prose prose-sm max-w-none dark:prose-invert',
  'prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground',
  '[&>h1]:text-3xl [&>h1]:mt-6 [&>h1]:mb-4 [&>h1]:text-foreground',
  '[&>h2]:text-2xl [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:text-foreground',
  '[&>h3]:text-xl [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-foreground',
  '[&_strong]:text-foreground',
  '[&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground',
  '[&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6',
  '[&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto',
  '[&>code]:font-mono [&>code]:text-sm [&>code]:bg-muted [&>code]:px-1 [&>code]:rounded',
  '[&_table]:border-collapse [&_table]:w-full [&_th]:border [&_th]:border-border [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2',
].join(' ');

export interface ArticleRichTextEditorProps {
  content?: string;
  onContentChange?: (html: string, wordCount: number) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function ArticleRichTextEditor({
  content = '',
  onContentChange,
  placeholder = 'Start writing...',
  readOnly = false,
}: ArticleRichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [tableModalOpen, setTableModalOpen] = useState(false);

  const editor = useEditor({
    extensions: getArticleEditorExtensions(placeholder),
    content: content || '',
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: EDITOR_CLASS,
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      onContentChange?.(html, words);
    },
  }, [readOnly, placeholder]);

  // Force toolbar re-render when cursor/selection changes so active states stay in sync
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    if (!editor) return;
    const onUpdate = () => forceUpdate();
    editor.on('selectionUpdate', onUpdate);
    editor.on('transaction', onUpdate);
    return () => {
      editor.off('selectionUpdate', onUpdate);
      editor.off('transaction', onUpdate);
    };
  }, [editor]);

  // Sync external content
  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  }, [content, editor]);

  const wordCount = editor
    ? editor.getText().trim().split(/\s+/).filter(Boolean).length
    : 0;

  const addLink = useCallback(() => {
    const { from, to } = editor?.state.selection ?? {};
    const selectedText = editor?.state.doc.textBetween(from ?? 0, to ?? 0, ' ') ?? '';
    setLinkText(selectedText);
    setLinkUrl('');
    setLinkModalOpen(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
      toast.success('Link added');
    } else {
      editor.chain().focus().unsetLink().run();
      toast.success('Link removed');
    }
    setLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
  }, [editor, linkUrl]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      try {
        // Use base64 for persistence in drafts (blob URLs don't persist)
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        editor.chain().focus().setImage({ src: dataUrl, alt: file.name }).run();
        toast.success('Image added');
      } catch {
        // Fallback: try writerService (returns blob URL - won't persist across reload)
        const url = await writerService.uploadImage(file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        toast.success('Image added');
      }
      e.target.value = '';
    },
    [editor]
  );

  const openTableModal = useCallback(() => {
    setTableModalOpen(true);
  }, []);

  const handleTableInsert = useCallback(
    (settings: TableInsertSettings) => {
      const ok = editor?.chain().focus().insertTable({
        rows: settings.rows,
        cols: settings.cols,
        withHeaderRow: settings.withHeaderRow,
      }).run();
      if (ok) {
        const borderColor = settings.borderColorResolved ?? settings.borderColor;
        const { borderWidth } = settings;
        requestAnimationFrame(() => {
          const wrappers = editor?.view.dom.querySelectorAll('.tableWrapper');
          const last = wrappers?.[wrappers.length - 1] as HTMLDivElement | undefined;
          if (last) {
            last.dataset.borderColor = borderColor;
            last.dataset.borderWidth = String(borderWidth);
            const table = last.querySelector('table');
            const cells = last.querySelectorAll('td, th');
            if (borderWidth > 0) {
              table?.style.setProperty('border-collapse', 'collapse');
              cells.forEach((cell) => {
                const el = cell as HTMLElement;
                el.style.borderColor = borderColor;
                el.style.borderWidth = `${borderWidth}px`;
                el.style.borderStyle = 'solid';
              });
            } else {
              cells.forEach((cell) => {
                const el = cell as HTMLElement;
                el.style.borderColor = '';
                el.style.borderWidth = '';
                el.style.borderStyle = 'none';
              });
            }
          }
        });
      }
      toast.success('Table inserted');
      setTableModalOpen(false);
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  const ToolbarButton = ({
    icon: Icon,
    label,
    onClick,
    active,
    disabled,
  }: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={label}
      disabled={disabled}
      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-colors disabled:opacity-40 ${
        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );

  const toolbarGroups = [
    {
      buttons: [
        { icon: Undo2, label: 'Undo', onClick: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() },
        { icon: Redo2, label: 'Redo', onClick: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() },
        { icon: IndentIncrease, label: 'Indent', onClick: () => editor.chain().focus().indent().run(), disabled: !editor.can().indent() },
        { icon: IndentDecrease, label: 'Outdent', onClick: () => editor.chain().focus().outdent().run(), disabled: !editor.can().outdent() },
      ],
    },
    {
      buttons: [
        { icon: Heading1, label: 'H1', onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
        { icon: Heading2, label: 'H2', onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
        { icon: Heading3, label: 'H3', onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
        { icon: Type, label: 'Body', onClick: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
      ],
    },
    {
      buttons: [
        { icon: Bold, label: 'Bold', onClick: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
        { icon: Italic, label: 'Italic', onClick: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
        { icon: Underline, label: 'Underline', onClick: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
        { icon: Strikethrough, label: 'Strike', onClick: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
      ],
    },
    {
      buttons: [
        { icon: AlignLeft, label: 'Left', onClick: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
        { icon: AlignCenter, label: 'Center', onClick: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
        { icon: AlignRight, label: 'Right', onClick: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
        { icon: AlignJustify, label: 'Justify', onClick: () => editor.chain().focus().setTextAlign('justify').run(), active: editor.isActive({ textAlign: 'justify' }) },
      ],
    },
    {
      buttons: [
        { icon: List, label: 'Bullet List', onClick: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
        { icon: ListOrdered, label: 'Numbered List', onClick: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
        { icon: ListTodo, label: 'Task List', onClick: () => editor.chain().focus().toggleTaskList().run(), active: editor.isActive('taskList') },
        { icon: Quote, label: 'Blockquote', onClick: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
      ],
    },
    {
      buttons: [
        { icon: Link2, label: 'Link', onClick: addLink, active: editor.isActive('link') },
        { icon: Image, label: 'Image', onClick: () => fileInputRef.current?.click() },
        { icon: Minus, label: 'Divider', onClick: () => editor.chain().focus().setHorizontalRule().run() },
        { icon: Code2, label: 'Code Block', onClick: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
        { icon: Table, label: 'Table', onClick: openTableModal },
      ],
    },
  ];

  return (
    <div className="w-full">
      {!readOnly && (
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card flex-wrap sticky top-0 z-20">
          {toolbarGroups.map((group, gi) => (
            <div key={gi} className="flex items-center gap-0.5">
              {gi > 0 && <div className="w-px h-5 bg-border mx-1" />}
              {group.buttons.map((btn) => (
                <ToolbarButton
                  key={btn.label}
                  icon={btn.icon}
                  label={btn.label}
                  onClick={btn.onClick}
                  active={btn.active}
                  disabled={'disabled' in btn ? btn.disabled : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <div ref={editorContainerRef} className="relative">
        <EditorContent editor={editor} />
        <TableControlsOverlay editor={editor} readOnly={readOnly} />
        <TableHoverBars editor={editor} editorContainerRef={editorContainerRef} readOnly={readOnly} />
      </div>

      {/* Link modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Insert Link</h3>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="p-1 rounded hover:bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://"
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              {linkText && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Link text</label>
                  <input
                    type="text"
                    value={linkText}
                    readOnly
                    className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg text-muted-foreground"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <TableInsertModal
        open={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        onInsert={handleTableInsert}
      />
    </div>
  );
}
