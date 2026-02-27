import React, { useState, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold, Italic, Underline, Strikethrough, Link2, AlignLeft, AlignCenter,
  AlignRight, List, ListOrdered, Quote, Code, Image, Minus,
  Heading1, Heading2, Heading3, Type, Table, Youtube, Search, Plus,
  Undo, Redo, MoreHorizontal, GripVertical, ChevronDown, ChevronUp,
  X, Eye, Save, Send, CheckCircle2, Globe, Lock, BookOpen, Tag, FileText,
  Settings, LayoutGrid, Columns, ArrowLeft, ExternalLink, Copy, Trash2,
  MoveUp, MoveDown, PanelRight, PanelRightClose, Upload, File,
  ListTree, Monitor, Tablet, Smartphone, MoreVertical, Keyboard,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
type BlockKind =
  | "paragraph" | "h1" | "h2" | "h3"
  | "quote" | "code" | "ul" | "ol"
  | "image" | "divider" | "table" | "columns";

interface Block {
  id: string;
  kind: BlockKind;
  content: string;
  align?: "left" | "center" | "right";
}

const mkBlock = (kind: BlockKind = "paragraph"): Block => ({
  id: crypto.randomUUID(), kind, content: "", align: "left",
});

/* ═══════════════════════════════════════════════════════════
   BLOCK CATALOGUE
═══════════════════════════════════════════════════════════ */
const BLOCK_CATALOGUE: { kind: BlockKind; icon: React.ElementType; label: string; desc: string; category: string }[] = [
  { kind: "paragraph", icon: Type, label: "Paragraph", desc: "Start with the building block of all narrative.", category: "Text" },
  { kind: "h1", icon: Heading1, label: "Heading", desc: "Introduce new sections and organize content.", category: "Text" },
  { kind: "h2", icon: Heading2, label: "Heading 2", desc: "A slightly smaller heading.", category: "Text" },
  { kind: "h3", icon: Heading3, label: "Heading 3", desc: "A small heading for sub-sections.", category: "Text" },
  { kind: "ul", icon: List, label: "List", desc: "Create an unordered list.", category: "Text" },
  { kind: "ol", icon: ListOrdered, label: "List", desc: "Create an ordered list.", category: "Text" },
  { kind: "quote", icon: Quote, label: "Quote", desc: "Give quoted text visual emphasis.", category: "Text" },
  { kind: "code", icon: Code, label: "Code", desc: "Display code snippets that respect your spacing.", category: "Text" },
  { kind: "image", icon: Image, label: "Image", desc: "Insert an image to make a visual statement.", category: "Media" },
  { kind: "table", icon: Table, label: "Table", desc: "Insert a table — perfect for sharing data.", category: "Design" },
  { kind: "columns", icon: Columns, label: "Columns", desc: "Display content in multiple columns.", category: "Design" },
  { kind: "divider", icon: Minus, label: "Separator", desc: "Create a break between ideas.", category: "Design" },
];

const CATALOGUE_BY_CAT = BLOCK_CATALOGUE.reduce((acc, b) => {
  (acc[b.category] = acc[b.category] ?? []).push(b);
  return acc;
}, {} as Record<string, typeof BLOCK_CATALOGUE>);

/* ═══════════════════════════════════════════════════════════
   WP ICON (WordPress logo SVG)
═══════════════════════════════════════════════════════════ */
const WPIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM3.443 12c0-1.166.24-2.275.664-3.287l3.66 10.027A8.564 8.564 0 013.443 12zm8.557 8.557c-.847 0-1.664-.12-2.44-.344L12 13.298l2.527 6.922c.017.04.037.076.058.112a8.505 8.505 0 01-2.585.225zm1.2-12.598c.494-.026.94-.076.94-.076.443-.05.39-.704-.053-.679 0 0-1.332.105-2.192.105-.81 0-2.168-.105-2.168-.105-.443-.025-.497.654-.053.679 0 0 .42.05.864.076L11.44 11l-2.252 6.756L5.63 8.96c.494-.026.94-.076.94-.076.443-.05.39-.704-.053-.679 0 0-1.332.105-2.192.105-.154 0-.336-.004-.527-.011A8.548 8.548 0 0112 3.443c2.222 0 4.251.855 5.772 2.25-.037-.002-.073-.007-.111-.007-.81 0-1.384.704-1.384 1.46 0 .679.39 1.253.806 1.933.312.545.677 1.243.677 2.252 0 .699-.269 1.51-.622 2.64l-.815 2.724-2.123-6.336zM16.5 19.442l2.164-6.255c.405-1.01.537-1.819.537-2.539 0-.261-.017-.503-.049-.731A8.54 8.54 0 0120.557 12a8.555 8.555 0 01-4.057 7.442z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   BLOCK TOOLBAR (floats above selected block — WP style)
═══════════════════════════════════════════════════════════ */
function BlockToolbar({
  block, onFormat, onChangeKind, onDelete, onMoveUp, onMoveDown, onDuplicate, activeActions,
}: {
  block: Block;
  onFormat: (f: string) => void;
  onChangeKind: (k: BlockKind) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  activeActions?: Set<string>;
}) {
  const [showKindMenu, setShowKindMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const ICON_MAP: Record<BlockKind, React.ElementType> = {
    paragraph: Type, h1: Heading1, h2: Heading2, h3: Heading3,
    quote: Quote, code: Code, ul: List, ol: ListOrdered,
    image: Image, divider: Minus, table: Table, columns: Columns,
  };
  const KindIcon = ICON_MAP[block.kind] ?? Type;

  return (
    <div
      className="absolute -top-11 left-0 z-30 flex items-center h-10 bg-white border border-[#e0e0e0] rounded shadow-[0_2px_6px_rgba(0,0,0,0.05)] select-none"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif" }}
      onMouseDown={e => e.preventDefault()}
    >
      {/* Kind switcher */}
      <div className="relative">
        <button onClick={() => setShowKindMenu(s => !s)}
          className="flex items-center gap-1 px-3 h-10 text-[#1e1e1e] hover:bg-[#f0f0f0] transition-colors border-r border-[#e0e0e0]">
          <KindIcon className="h-5 w-5" />
          <ChevronDown className="h-3.5 w-3.5 text-[#757575]" />
        </button>
        {showKindMenu && (
          <div className="absolute left-0 top-11 z-50 w-64 bg-white border border-[#e0e0e0] rounded shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="py-1 max-h-80 overflow-y-auto">
              {BLOCK_CATALOGUE.map(bt => (
                <button key={bt.kind} onClick={() => { onChangeKind(bt.kind); setShowKindMenu(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${block.kind === bt.kind ? "bg-[#007cba]/10 text-[#007cba]" : "hover:bg-[#f0f0f0] text-[#1e1e1e]"}`}>
                  <bt.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-[13px]">{bt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drag handle */}
      <button className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] text-[#757575] cursor-grab border-r border-[#e0e0e0]">
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Move up/down */}
      <div className="flex flex-col border-r border-[#e0e0e0]">
        <button onClick={onMoveUp} className="h-5 w-6 flex items-center justify-center hover:bg-[#f0f0f0] text-[#757575]">
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button onClick={onMoveDown} className="h-5 w-6 flex items-center justify-center hover:bg-[#f0f0f0] text-[#757575]">
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Inline format buttons (text blocks only) */}
      {["paragraph", "h1", "h2", "h3", "quote", "ul", "ol"].includes(block.kind) && (
        <>
          {[
            { icon: Bold, f: "bold", title: "Bold" },
            { icon: Italic, f: "italic", title: "Italic" },
            { icon: Link2, f: "link", title: "Link" },
            { icon: Strikethrough, f: "strikethrough", title: "Strikethrough" },
          ].map(({ icon: Icon, f, title }) => (
            <button key={f}
              onMouseDown={(e) => {
                e.preventDefault();
                onFormat(f);
              }}
              title={title}
              className={`w-10 h-10 flex items-center justify-center transition-colors ${activeActions?.has(f) ? "bg-[#007cba]/10 text-[#007cba]" : "hover:bg-[#f0f0f0] text-[#1e1e1e]"}`}>
              <Icon className="h-5 w-5" />
            </button>
          ))}
          <div className="w-px h-6 bg-[#e0e0e0] mx-0.5" />
          {/* Align */}
          {[
            { icon: AlignLeft, action: 'justifyLeft' },
            { icon: AlignCenter, action: 'justifyCenter' },
            { icon: AlignRight, action: 'justifyRight' }
          ].map(({ icon: Icon, action }, i) => (
            <button key={i}
              onMouseDown={(e) => {
                e.preventDefault();
                onFormat(action);
              }}
              className={`w-10 h-10 flex items-center justify-center transition-colors ${activeActions?.has(action) ? "bg-[#007cba]/10 text-[#007cba]" : "hover:bg-[#f0f0f0] text-[#1e1e1e]"}`}>
              <Icon className="h-5 w-5" />
            </button>
          ))}
          <div className="w-px h-6 bg-[#e0e0e0] mx-0.5" />
        </>
      )}

      {/* More */}
      <div className="relative">
        <button onClick={() => setShowMore(s => !s)}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] text-[#757575] transition-colors">
          <MoreVertical className="h-5 w-5" />
        </button>
        {showMore && (
          <div className="absolute right-0 top-11 z-50 w-52 bg-white border border-[#e0e0e0] rounded shadow-[0_4px_24px_rgba(0,0,0,0.15)] py-1">
            <button onClick={() => { onDuplicate(); setShowMore(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-[#1e1e1e] hover:bg-[#f0f0f0]">
              <Copy className="h-4 w-4" /> Duplicate
            </button>
            <button onClick={() => { onMoveUp(); setShowMore(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-[#1e1e1e] hover:bg-[#f0f0f0]">
              <MoveUp className="h-4 w-4" /> Move up
            </button>
            <button onClick={() => { onMoveDown(); setShowMore(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-[#1e1e1e] hover:bg-[#f0f0f0]">
              <MoveDown className="h-4 w-4" /> Move down
            </button>
            <div className="h-px bg-[#e0e0e0] my-1" />
            <button onClick={() => { onDelete(); setShowMore(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-[#cc1818] hover:bg-[#cc1818]/5">
              <Trash2 className="h-4 w-4" /> Remove block
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SINGLE BLOCK
═══════════════════════════════════════════════════════════ */
function EditorBlock({
  block, isSelected, onSelect, onChange, onChangeKind,
  onAddAfter, onDelete, onMoveUp, onMoveDown, onDuplicate,
  onDragStartBlock, onDragOverBlock, onDragEndBlock, onDropOnBlock, isDragOverBlock, isDraggingBlock,
}: {
  block: Block; isSelected: boolean;
  onSelect: () => void; onChange: (c: string) => void;
  onChangeKind: (k: BlockKind) => void;
  onAddAfter: (kind?: BlockKind) => void;
  onDelete: () => void; onMoveUp: () => void;
  onMoveDown: () => void; onDuplicate: () => void;
  onDragStartBlock: () => void; onDragOverBlock: (e: React.DragEvent) => void;
  onDragEndBlock: () => void; onDropOnBlock: () => void;
  isDragOverBlock: boolean; isDraggingBlock: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(block.kind === "image" && block.content ? block.content : null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashHighlight, setSlashHighlight] = useState(0);
  const textareaRef = useRef<HTMLDivElement>(null);
  const [activeActions, setActiveActions] = useState<Set<string>>(new Set());
  const contentRef = useRef(block.content);

  useLayoutEffect(() => {
    if (textareaRef.current && block.content !== contentRef.current) {
      textareaRef.current.innerHTML = block.content || "";
      contentRef.current = block.content;
    }
  }, [block.content]);

  const updateActiveActions = useCallback(() => {
    if (!textareaRef.current) return;
    const actions = new Set<string>();

    if (document.queryCommandState("bold")) actions.add("bold");
    if (document.queryCommandState("italic")) actions.add("italic");
    if (document.queryCommandState("underline")) actions.add("underline");
    if (document.queryCommandState("insertUnorderedList")) actions.add("ul");
    if (document.queryCommandState("insertOrderedList")) actions.add("ol");

    // Block level and alignment
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.getRangeAt(0).startContainer;
      while (node && node !== textareaRef.current) {
        if (node.nodeType === 1) {
          const element = node as HTMLElement;
          const tag = element.tagName.toLowerCase();
          if (tag === 'blockquote') actions.add('quote');

          const textAlign = element.style.textAlign || window.getComputedStyle(element).textAlign;
          if (textAlign === 'center') actions.add('justifyCenter');
          else if (textAlign === 'right') actions.add('justifyRight');
          else if (textAlign === 'left' || textAlign === 'start') actions.add('justifyLeft');
        }
        node = node.parentNode;
      }
    }

    // Check command-based alignment if not found in tree
    if (!actions.has('justifyCenter') && !actions.has('justifyRight') && !actions.has('justifyLeft')) {
      if (document.queryCommandState("justifyCenter")) actions.add("justifyCenter");
      else if (document.queryCommandState("justifyRight")) actions.add("justifyRight");
      else actions.add("justifyLeft");
    }

    setActiveActions(actions);
  }, []);

  const handleFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateActiveActions();
    if (textareaRef.current) {
      onChange(textareaRef.current.innerHTML);
    }
  }, [onChange, updateActiveActions]);

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

  const processFile = (file: File) => {
    setUploadError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    const url = URL.createObjectURL(file);
    // Revoke old preview URL to avoid memory leaks
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
    setUploadedFileName(file.name);
    onChange(file.name);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadedFileName(null);
    setUploadError(null);
    onChange("");
  };

  const WP_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif";
  const SERIF = "'Noto Serif', Georgia, serif";

  const BASE = "w-full bg-transparent outline-none resize-none placeholder:text-[#9ca3af]";
  const STYLES: Record<BlockKind, string> = {
    paragraph: `${BASE} text-[16px] leading-[1.8]`,
    h1: `${BASE} text-[40px] font-bold leading-[1.2]`,
    h2: `${BASE} text-[32px] font-bold leading-[1.3]`,
    h3: `${BASE} text-[24px] font-semibold leading-[1.4]`,
    quote: `${BASE} text-[18px] italic leading-[1.8]`,
    code: `${BASE} text-[14px] leading-[1.7] font-mono`,
    ul: `${BASE} text-[16px] leading-[1.8]`,
    ol: `${BASE} text-[16px] leading-[1.8]`,
    image: `${BASE} text-[14px]`,
    divider: `${BASE}`,
    table: `${BASE}`,
    columns: `${BASE}`,
  };

  const PLACEHOLDERS: Partial<Record<BlockKind, string>> = {
    paragraph: "Type / to choose a block",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    quote: "Add a quote",
    code: "Write code…",
    ul: "List",
    ol: "List",
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (showSlashMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashHighlight(h => (h + 1) % filteredSlashItems.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashHighlight(h => (h - 1 + filteredSlashItems.length) % filteredSlashItems.length);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredSlashItems.length > 0) {
          handleSlashSelect(filteredSlashItems[slashHighlight].kind);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSlashMenu(false);
        setSlashFilter("");
        setSlashHighlight(0);
        return;
      }
      if (e.key === "Backspace" && block.content === "") {
        setShowSlashMenu(false);
        setSlashFilter("");
        setSlashHighlight(0);
        return;
      }
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && block.kind !== "code") {
      e.preventDefault();
      onAddAfter();
    }
  };

  const handleSlashSelect = (kind: BlockKind) => {
    setShowSlashMenu(false);
    setSlashFilter("");
    setSlashHighlight(0);
    onChange("");
    onChangeKind(kind);
  };

  const filteredSlashItems = BLOCK_CATALOGUE.filter(b =>
    !slashFilter || b.label.toLowerCase().includes(slashFilter.toLowerCase())
  );

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  };


  return (
    <div
      className={`relative group transition-all duration-150 ${isDraggingBlock ? "opacity-40 scale-[0.98]" : ""} ${isDragOverBlock ? "ring-2 ring-[#007cba] ring-offset-2 rounded" : ""}`}
      onClick={onSelect}
      style={{ fontFamily: WP_FONT }}
      onDragOver={onDragOverBlock}
      onDrop={e => { e.preventDefault(); onDropOnBlock(); }}
    >
      {isSelected && (
        <BlockToolbar
          block={block}
          activeActions={activeActions}
          onFormat={handleFormat}
          onChangeKind={onChangeKind}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
        />
      )}

      <div className={`relative transition-all duration-75 ${isSelected
        ? "outline outline-[1.5px] outline-[#007cba] outline-offset-[2px]"
        : "hover:outline hover:outline-1 hover:outline-[#e0e0e0] hover:outline-offset-[2px]"
        }`}>

        {/* Drag handle on hover — WP style */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            draggable
            onDragStart={e => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", block.id); onDragStartBlock(); }}
            onDragEnd={onDragEndBlock}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#f0f0f0] text-[#757575] cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Add between button — WP style */}
        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={e => { e.stopPropagation(); onAddAfter(); }}
            className="w-6 h-6 rounded-full bg-[#1e1e1e] text-white flex items-center justify-center hover:bg-[#007cba] transition-colors shadow"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="py-1">
          {block.kind === "divider" ? (
            <div className="py-5"><hr className="border-[#e0e0e0]" /></div>
          ) : block.kind === "image" ? (
            /* Hidden real file input */
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
                onChange={handleFileInputChange}
              />
              {uploadedFileName ? (
                <div className="border border-[#e0e0e0] rounded bg-[#f0f0f0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#007cba]/10 flex items-center justify-center flex-shrink-0">
                      <File className="h-5 w-5 text-[#007cba]" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1e1e1e] truncate">{uploadedFileName}</p>
                      <p className="text-[12px] text-[#007cba]">✓ Uploaded</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleClearUpload(); }}
                      className="text-[12px] text-[#757575] hover:text-[#cc1818] px-2 py-1 rounded hover:bg-[#cc1818]/5"
                      aria-label="Replace uploaded image"
                    >
                      Replace
                    </button>
                  </div>
                  {/* Image preview */}
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Uploaded image preview"
                      className="mt-3 w-full max-h-64 object-cover rounded border border-[#e0e0e0]"
                    />
                  ) : (
                    <div className="mt-3 bg-[#e0e0e0] rounded h-44 flex items-center justify-center text-[#757575]" aria-hidden="true">
                      <Image className="h-10 w-10 opacity-30" />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  role="button"
                  aria-label="Image upload area — drag and drop or click to select an image"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded p-12 flex flex-col items-center gap-2 transition-all ${dragOver
                    ? "border-[#007cba] bg-[#007cba]/5 scale-[1.005]"
                    : "border-[#e0e0e0] text-[#757575] hover:border-[#007cba] hover:text-[#007cba]"
                    }`}
                  onClick={e => e.stopPropagation()}
                >
                  {dragOver ? (
                    <>
                      <Upload className="h-10 w-10 animate-bounce" aria-hidden="true" />
                      <p className="text-[14px] font-medium">Drop to upload</p>
                    </>
                  ) : (
                    <>
                      <Image className="h-10 w-10 opacity-40" aria-hidden="true" />
                      <p className="text-[14px] font-medium">Upload Image</p>
                      <p className="text-[12px] opacity-60">Drag and drop or click Upload — max 5MB, JPEG/PNG/WebP/GIF/SVG</p>
                      {uploadError && (
                        <p role="alert" className="text-[12px] text-[#cc1818] font-medium mt-1">
                          ⚠ {uploadError}
                        </p>
                      )}
                      <div className="mt-2 flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={handleUploadClick}
                          aria-label="Select image file to upload"
                          className="px-4 py-2 rounded bg-[#007cba] text-white text-[13px] font-medium hover:bg-[#006ba1] transition-colors"
                        >
                          Upload
                        </button>
                        <button className="px-4 py-2 rounded border border-[#757575] text-[#1e1e1e] text-[13px] font-medium hover:bg-[#f0f0f0] transition-colors">
                          Media Library
                        </button>
                        <button className="px-4 py-2 rounded border border-[#757575] text-[#1e1e1e] text-[13px] font-medium hover:bg-[#f0f0f0] transition-colors">
                          Insert from URL
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : block.kind === "code" ? (
            <div className="bg-[#282a36] rounded">
              <textarea
                value={block.content}
                onChange={e => { onChange(e.target.value); autoResize(e.currentTarget); }}
                className="w-full bg-transparent text-[#f8f8f2] text-[14px] font-mono leading-[1.7] outline-none resize-none px-4 py-3 placeholder:text-[#6272a4]"
                placeholder="Write code…"
                rows={4}
              />
            </div>
          ) : block.kind === "quote" ? (
            <div className="border-l-[4px] border-[#1e1e1e] pl-6">
              <div
                ref={textareaRef as any}
                contentEditable
                suppressContentEditableWarning
                onInput={e => {
                  const html = (e.currentTarget as HTMLDivElement).innerHTML;
                  contentRef.current = html;
                  onChange(html);
                  updateActiveActions();
                }}
                onMouseUp={updateActiveActions}
                onKeyUp={updateActiveActions}
                onFocus={updateActiveActions}
                className={`${STYLES.quote} w-full text-[#1e1e1e] outline-none`}
                style={{ fontFamily: SERIF }}
                data-placeholder="Add a quote"
              />
            </div>
          ) : block.kind === "columns" ? (
            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map(col => (
                <div key={col} className="min-h-[100px] border border-dashed border-[#e0e0e0] rounded p-4 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-[#757575] opacity-40" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div
                ref={textareaRef as any}
                contentEditable
                suppressContentEditableWarning
                onInput={e => {
                  const html = (e.currentTarget as HTMLDivElement).innerHTML;
                  contentRef.current = html;
                  onChange(html);
                  updateActiveActions();
                }}
                onKeyDown={handleKeyDown as any}
                onMouseUp={updateActiveActions}
                onKeyUp={updateActiveActions}
                onFocus={updateActiveActions}
                className={`${STYLES[block.kind]} w-full text-[#1e1e1e] outline-none`}
                style={{ fontFamily: ["h1", "h2", "h3"].includes(block.kind) ? SERIF : WP_FONT }}
                data-placeholder={PLACEHOLDERS[block.kind] ?? "Type / to choose a block"}
              />

              {/* Slash command menu — WP Gutenberg style */}
              <AnimatePresence>
                {showSlashMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="absolute left-0 top-full z-50 w-[350px] bg-white border border-[#e0e0e0] rounded shadow-[0_4px_24px_rgba(0,0,0,0.15)] mt-1"
                  >
                    <div className="px-4 py-2.5 border-b border-[#e0e0e0]">
                      <p className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider">
                        {slashFilter ? `Matching "${slashFilter}"` : "Browse all"}
                      </p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto py-1">
                      {filteredSlashItems.length > 0 ? filteredSlashItems.map((bt, idx) => (
                        <button
                          key={bt.kind}
                          onMouseDown={e => { e.preventDefault(); handleSlashSelect(bt.kind); }}
                          onMouseEnter={() => setSlashHighlight(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${idx === slashHighlight ? "bg-[#007cba]/10" : "hover:bg-[#f0f0f0]"
                            }`}
                        >
                          <div className={`w-12 h-12 rounded border flex items-center justify-center flex-shrink-0 ${idx === slashHighlight ? "border-[#007cba] bg-[#007cba]/5" : "border-[#e0e0e0] bg-white"
                            }`}>
                            <bt.icon className={`h-6 w-6 ${idx === slashHighlight ? "text-[#007cba]" : "text-[#1e1e1e]"}`} />
                          </div>
                          <div>
                            <p className={`text-[13px] font-semibold ${idx === slashHighlight ? "text-[#007cba]" : "text-[#1e1e1e]"}`}>{bt.label}</p>
                            <p className="text-[12px] text-[#757575]">{bt.desc}</p>
                          </div>
                        </button>
                      )) : (
                        <p className="text-[13px] text-[#757575] text-center py-6">No results found.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REUSABLE BLOCK TYPES
═══════════════════════════════════════════════════════════ */
interface ReusableBlock {
  id: string;
  name: string;
  blocks: Block[];
}

const DEFAULT_REUSABLE: ReusableBlock[] = [
  {
    id: "intro-template",
    name: "Article Introduction",
    blocks: [
      { id: "ri-1", kind: "h2", content: "", align: "left" },
      { id: "ri-2", kind: "paragraph", content: "", align: "left" },
      { id: "ri-3", kind: "quote", content: "", align: "left" },
    ],
  },
  {
    id: "source-section",
    name: "Source & Citation Block",
    blocks: [
      { id: "rs-1", kind: "divider", content: "", align: "left" },
      { id: "rs-2", kind: "h3", content: "Sources", align: "left" },
      { id: "rs-3", kind: "ol", content: "", align: "left" },
    ],
  },
  {
    id: "image-caption",
    name: "Image with Caption",
    blocks: [
      { id: "rc-1", kind: "image", content: "", align: "left" },
      { id: "rc-2", kind: "paragraph", content: "", align: "left" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   LEFT INSERTER PANEL (WP block library drawer)
═══════════════════════════════════════════════════════════ */
function InserterPanel({
  onInsert, onClose, onInsertReusable, reusableBlocks, currentBlocks, selectedId, onSaveReusable,
}: {
  onInsert: (kind: BlockKind) => void;
  onClose: () => void;
  onInsertReusable: (blocks: Block[]) => void;
  reusableBlocks: ReusableBlock[];
  currentBlocks: Block[];
  selectedId: string | null;
  onSaveReusable: (name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"blocks" | "patterns" | "reusable">("blocks");
  const [saveName, setSaveName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const filtered = search
    ? BLOCK_CATALOGUE.filter(b => b.label.toLowerCase().includes(search.toLowerCase()))
    : null;

  const ICON_MAP: Record<BlockKind, React.ElementType> = {
    paragraph: Type, h1: Heading1, h2: Heading2, h3: Heading3,
    quote: Quote, code: Code, ul: List, ol: ListOrdered,
    image: Image, divider: Minus, table: Table, columns: Columns,
  };

  return (
    <motion.div
      initial={{ x: -320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -320, opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 240 }}
      className="absolute left-0 top-0 h-full w-[350px] bg-white border-r border-[#e0e0e0] z-40 flex flex-col shadow-[4px_0_16px_rgba(0,0,0,0.08)]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[48px] border-b border-[#e0e0e0] flex-shrink-0">
        <h3 className="text-[13px] font-semibold text-[#1e1e1e]">
          {tab === "blocks" ? "Blocks" : tab === "patterns" ? "Patterns" : "Reusable"}
        </h3>
        <button onClick={onClose} className="w-6 h-6 rounded hover:bg-[#f0f0f0] flex items-center justify-center">
          <X className="h-4 w-4 text-[#757575]" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e0e0e0] px-2">
        {(["blocks", "patterns", "reusable"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`py-2.5 px-3 text-[13px] font-medium capitalize border-b-2 transition-colors ${tab === t ? "border-[#007cba] text-[#007cba]" : "border-transparent text-[#757575] hover:text-[#1e1e1e]"
              }`}>
            {t === "reusable" ? "Reusable" : t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-2 border border-[#e0e0e0] rounded px-3 py-2 focus-within:border-[#007cba] focus-within:shadow-[0_0_0_1px_#007cba] transition-all">
          <Search className="h-4 w-4 text-[#757575] flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-[13px] bg-transparent outline-none text-[#1e1e1e] placeholder:text-[#a0a0a0]"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === "blocks" && (
          <>
            {filtered ? (
              <div className="space-y-0.5">
                {filtered.map(bt => (
                  <button key={bt.kind} onClick={() => { onInsert(bt.kind); onClose(); }}
                    className="w-full flex items-center gap-3 px-2 py-2.5 rounded hover:bg-[#f0f0f0] text-left transition-colors">
                    <div className="w-12 h-12 rounded border border-[#e0e0e0] bg-white flex items-center justify-center flex-shrink-0">
                      <bt.icon className="h-6 w-6 text-[#1e1e1e]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#1e1e1e]">{bt.label}</p>
                      <p className="text-[11px] text-[#757575] leading-tight mt-0.5">{bt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              Object.entries(CATALOGUE_BY_CAT).map(([cat, blocks]) => (
                <div key={cat} className="mb-6">
                  <p className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider mb-3">{cat}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {blocks.map(bt => (
                      <button key={bt.kind} onClick={() => { onInsert(bt.kind); onClose(); }}
                        className="flex flex-col items-center gap-2 p-3 rounded hover:bg-[#f0f0f0] transition-colors">
                        <div className="w-12 h-12 rounded border border-[#e0e0e0] bg-white flex items-center justify-center">
                          <bt.icon className="h-6 w-6 text-[#1e1e1e]" />
                        </div>
                        <span className="text-[11px] text-[#1e1e1e] text-center leading-tight">{bt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {tab === "patterns" && (
          <div className="text-center py-12">
            <LayoutGrid className="h-10 w-10 text-[#e0e0e0] mx-auto mb-3" />
            <p className="text-[13px] text-[#757575]">Pre-designed layouts coming soon.</p>
            <p className="text-[11px] text-[#a0a0a0] mt-1">Save your own reusable blocks in the Reusable tab.</p>
          </div>
        )}

        {tab === "reusable" && (
          <div className="space-y-2">
            {/* Save current selection as reusable */}
            <div className="mb-4">
              {!showSaveForm ? (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded border border-dashed border-[#007cba] text-[#007cba] text-[13px] font-medium hover:bg-[#007cba]/5 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Save current blocks as reusable
                </button>
              ) : (
                <div className="border border-[#e0e0e0] rounded p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider">Save as reusable block</p>
                  <input
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    className="w-full text-[13px] border border-[#e0e0e0] rounded px-2.5 py-2 outline-none focus:border-[#007cba] text-[#1e1e1e] placeholder:text-[#a0a0a0]"
                    placeholder="Block name (e.g. 'My Intro Template')"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === "Enter" && saveName.trim()) {
                        onSaveReusable(saveName.trim());
                        setSaveName("");
                        setShowSaveForm(false);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (saveName.trim()) {
                          onSaveReusable(saveName.trim());
                          setSaveName("");
                          setShowSaveForm(false);
                        }
                      }}
                      disabled={!saveName.trim()}
                      className="flex-1 px-3 py-2 rounded bg-[#007cba] text-white text-[13px] font-medium hover:bg-[#006ba1] disabled:opacity-40 transition-colors"
                    >
                      Save ({currentBlocks.length} block{currentBlocks.length !== 1 ? "s" : ""})
                    </button>
                    <button
                      onClick={() => { setShowSaveForm(false); setSaveName(""); }}
                      className="px-3 py-2 rounded border border-[#e0e0e0] text-[13px] text-[#757575] hover:bg-[#f0f0f0] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List reusable blocks */}
            {reusableBlocks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-10 w-10 text-[#e0e0e0] mx-auto mb-3" />
                <p className="text-[13px] text-[#757575]">No reusable blocks yet.</p>
                <p className="text-[11px] text-[#a0a0a0] mt-1">Save block combinations to reuse across articles.</p>
              </div>
            ) : (
              reusableBlocks.map(rb => (
                <button
                  key={rb.id}
                  onClick={() => { onInsertReusable(rb.blocks); onClose(); }}
                  className="w-full flex items-start gap-3 px-3 py-3 rounded border border-[#e0e0e0] hover:border-[#007cba] hover:bg-[#007cba]/5 text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded bg-[#007cba]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#007cba]/20 transition-colors">
                    <BookOpen className="h-5 w-5 text-[#007cba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1e1e1e] group-hover:text-[#007cba] transition-colors">{rb.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {rb.blocks.slice(0, 4).map((b, i) => {
                        const Icon = ICON_MAP[b.kind] ?? Type;
                        return <Icon key={i} className="h-3.5 w-3.5 text-[#a0a0a0]" />;
                      })}
                      <span className="text-[11px] text-[#a0a0a0]">
                        {rb.blocks.length} block{rb.blocks.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RIGHT SETTINGS SIDEBAR (WP Document / Block tabs)
═══════════════════════════════════════════════════════════ */
function SettingsSidebar({
  selectedBlock, onChangeBlockKind,
}: {
  selectedBlock: Block | null;
  onChangeBlockKind: (k: BlockKind) => void;
}) {
  const [tab, setTab] = useState<"document" | "block">("document");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [status, setStatus] = useState("Pending");
  const [tags, setTags] = useState(["Islam", "Fiqh"]);
  const [tagInput, setTagInput] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "status": true, "categories": true, "tags": false, "featured": false, "excerpt": false, "discussion": false,
  });

  const toggleSection = (s: string) => setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }));
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(t => [...t, tagInput.trim()]);
      setTagInput("");
    }
  };

  const Section = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
    <div className="border-b border-[#e0e0e0]">
      <button onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-semibold text-[#1e1e1e] hover:bg-[#f0f0f0] transition-colors">
        {label}
        {expandedSections[id] ? <ChevronUp className="h-4 w-4 text-[#757575]" /> : <ChevronDown className="h-4 w-4 text-[#757575]" />}
      </button>
      {expandedSections[id] && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  return (
    <div className="w-[280px] flex-shrink-0 border-l border-[#e0e0e0] bg-white flex flex-col overflow-hidden"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* Tab bar + close */}
      <div className="flex items-center border-b border-[#e0e0e0]">
        <div className="flex flex-1">
          {(["document", "block"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-[13px] font-medium capitalize border-b-2 transition-colors ${tab === t ? "border-[#007cba] text-[#007cba]" : "border-transparent text-[#757575] hover:text-[#1e1e1e]"
                }`}>
              {t === "document" ? "Post" : "Block"}
            </button>
          ))}
        </div>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] text-[#757575]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "document" ? (
          <>
            {/* Summary */}
            <div className="px-4 py-4 border-b border-[#e0e0e0]">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-[#757575]" />
                <span className="text-[13px] font-semibold text-[#1e1e1e]">Summary</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#757575]">Status</span>
                  <button className="text-[13px] text-[#007cba] hover:underline">{status}</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#757575]">Visibility</span>
                  <button className="text-[13px] text-[#007cba] hover:underline flex items-center gap-1">
                    {visibility === "public" ? "Public" : "Private"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#757575]">Publish</span>
                  <button className="text-[13px] text-[#007cba] hover:underline">Immediately</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#757575]">URL</span>
                  <button className="text-[13px] text-[#007cba] hover:underline truncate max-w-[120px]">ummahthoughts.com/…</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#757575]">Author</span>
                  <button className="text-[13px] text-[#007cba] hover:underline">Admin</button>
                </div>
              </div>
            </div>

            <Section id="categories" label="Categories">
              <div className="space-y-1.5">
                {["Contemporary", "Technology & Islam", "Governance", "Comparative Religion", "Jurisprudence"].map(cat => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer py-0.5">
                    <input type="checkbox" className="rounded border-[#757575] w-4 h-4 accent-[#007cba]" />
                    <span className="text-[13px] text-[#1e1e1e]">{cat}</span>
                  </label>
                ))}
              </div>
              <button className="text-[13px] text-[#007cba] hover:underline mt-3 inline-block">+ Add New Category</button>
            </Section>

            <Section id="tags" label="Tags">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 bg-[#f0f0f0] text-[#1e1e1e] rounded">
                    {tag}
                    <button onClick={() => setTags(t => t.filter(x => x !== tag))}>
                      <X className="h-3 w-3 text-[#757575]" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addTag()}
                  className="flex-1 text-[13px] border border-[#e0e0e0] rounded px-2.5 py-1.5 outline-none focus:border-[#007cba] text-[#1e1e1e] placeholder:text-[#a0a0a0]"
                  placeholder="Add New Tag" />
                <button onClick={addTag} className="px-3 py-1.5 rounded border border-[#e0e0e0] text-[13px] text-[#1e1e1e] hover:bg-[#f0f0f0]">
                  Add
                </button>
              </div>
            </Section>

            <Section id="featured" label="Featured image">
              <div className="border border-dashed border-[#e0e0e0] rounded p-6 flex flex-col items-center gap-2 text-[#757575] hover:border-[#007cba] hover:text-[#007cba] transition-colors cursor-pointer">
                <Image className="h-8 w-8 opacity-50" />
                <p className="text-[13px] font-medium">Set featured image</p>
              </div>
            </Section>

            <Section id="excerpt" label="Excerpt">
              <textarea
                className="w-full text-[13px] border border-[#e0e0e0] rounded px-3 py-2 outline-none focus:border-[#007cba] text-[#1e1e1e] placeholder:text-[#a0a0a0] resize-none"
                rows={3}
                placeholder="Write an excerpt (optional)"
              />
              <p className="text-[11px] text-[#757575] mt-1.5">Write an excerpt (optional)</p>
            </Section>

            <Section id="discussion" label="Discussion">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[#757575] w-4 h-4 accent-[#007cba]" />
                <span className="text-[13px] text-[#1e1e1e]">Allow comments</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer mt-2">
                <input type="checkbox" className="rounded border-[#757575] w-4 h-4 accent-[#007cba]" />
                <span className="text-[13px] text-[#1e1e1e]">Allow pingbacks & trackbacks</span>
              </label>
            </Section>
          </>
        ) : (
          <div>
            {selectedBlock ? (
              <>
                <div className="px-4 py-4 border-b border-[#e0e0e0]">
                  <p className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider mb-3">Settings</p>
                  <div className="space-y-3">
                    {["h1", "h2", "h3", "paragraph"].includes(selectedBlock.kind) && (
                      <>
                        <div>
                          <label className="text-[13px] text-[#1e1e1e] block mb-1.5">Size</label>
                          <select className="w-full text-[13px] border border-[#e0e0e0] rounded px-2.5 py-2 outline-none focus:border-[#007cba] text-[#1e1e1e] bg-white">
                            <option>Small</option>
                            <option>Medium</option>
                            <option selected>Large</option>
                            <option>X-Large</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[13px] text-[#1e1e1e] block mb-1.5">Appearance</label>
                          <select className="w-full text-[13px] border border-[#e0e0e0] rounded px-2.5 py-2 outline-none focus:border-[#007cba] text-[#1e1e1e] bg-white">
                            <option>Default</option>
                            <option>Thin</option>
                            <option>Light</option>
                            <option>Regular</option>
                            <option>Medium</option>
                            <option>Semi Bold</option>
                            <option>Bold</option>
                            <option>Extra Bold</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="px-4 py-4 border-b border-[#e0e0e0]">
                  <p className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider mb-3">Color</p>
                  <div className="space-y-3">
                    {["Text", "Background", "Link"].map(prop => (
                      <div key={prop} className="flex items-center justify-between">
                        <span className="text-[13px] text-[#1e1e1e]">{prop}</span>
                        <button className="w-7 h-7 rounded-full border-2 border-[#e0e0e0] bg-[#1e1e1e] hover:border-[#007cba] transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-4">
                  <p className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider mb-3">Advanced</p>
                  <div>
                    <label className="text-[13px] text-[#1e1e1e] block mb-1.5">Additional CSS class(es)</label>
                    <input className="w-full text-[13px] border border-[#e0e0e0] rounded px-2.5 py-2 outline-none focus:border-[#007cba] text-[#1e1e1e] placeholder:text-[#a0a0a0]"
                      placeholder="e.g. my-custom-class" />
                  </div>
                  <div className="mt-3">
                    <label className="text-[13px] text-[#1e1e1e] block mb-1.5">HTML anchor</label>
                    <input className="w-full text-[13px] border border-[#e0e0e0] rounded px-2.5 py-2 outline-none focus:border-[#007cba] text-[#1e1e1e] placeholder:text-[#a0a0a0]"
                      placeholder="e.g. my-section" />
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <p className="text-[13px] text-[#757575]">No block selected.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN BUILDER — WordPress Gutenberg exact UI
═══════════════════════════════════════════════════════════ */
export default function WriterArticleBuilder({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([mkBlock("paragraph")]);
  const [selectedId, setSelectedId] = useState<string | null>(blocks[0].id);
  const [showInserter, setShowInserter] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [history, setHistory] = useState<Block[][]>([]);
  const [future, setFuture] = useState<Block[][]>([]);
  const [autoSaveTime, setAutoSaveTime] = useState<string | null>(null);
  const [reusableBlocks, setReusableBlocks] = useState<ReusableBlock[]>(DEFAULT_REUSABLE);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);

  const selectedBlock = blocks.find(b => b.id === selectedId) ?? null;
  const wordCount = [title, ...blocks.map(b => b.content)].join(" ").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  /* Auto-save every 30s */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setAutoSaveTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  /* History helpers */
  const commit = (next: Block[]) => {
    setHistory(h => [...h.slice(-30), blocks]);
    setFuture([]);
    setBlocks(next);
  };
  const undo = () => {
    if (!history.length) return;
    setFuture(f => [blocks, ...f]);
    setBlocks(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
  };
  const redo = () => {
    if (!future.length) return;
    setHistory(h => [...h, blocks]);
    setBlocks(future[0]);
    setFuture(f => f.slice(1));
  };

  /* Block operations */
  const addBlock = useCallback((afterId?: string, kind: BlockKind = "paragraph") => {
    const nb = mkBlock(kind);
    commit(afterId
      ? blocks.flatMap(b => b.id === afterId ? [b, nb] : [b])
      : [...blocks, nb]
    );
    setTimeout(() => setSelectedId(nb.id), 0);
  }, [blocks]);

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const changeBlockKind = (id: string, kind: BlockKind) => {
    commit(blocks.map(b => b.id === id ? { ...b, kind } : b));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length === 1) { commit([mkBlock()]); return; }
    const idx = blocks.findIndex(b => b.id === id);
    const next = blocks.filter(b => b.id !== id);
    commit(next);
    setSelectedId(next[Math.max(0, idx - 1)]?.id ?? null);
  };

  const moveBlock = (id: string, dir: "up" | "down") => {
    const idx = blocks.findIndex(b => b.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === blocks.length - 1) return;
    const next = [...blocks];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    commit(next);
  };

  const duplicateBlock = (id: string) => {
    const src = blocks.find(b => b.id === id);
    if (!src) return;
    addBlock(id, src.kind);
  };

  const handleSave = () => {
    setSaved(true);
    setAutoSaveTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setTimeout(() => setSaved(false), 2200);
  };
  const handlePublish = () => setPublished(true);

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault(); setShowInserter(s => !s);
      }
      if (e.key === "Escape") { setSelectedId(null); setShowInserter(false); }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const sel = blocks.find(b => b.id === selectedId);
        if (sel && sel.content === "" && document.activeElement?.tagName !== "TEXTAREA" && document.activeElement?.tagName !== "INPUT") {
          e.preventDefault(); deleteBlock(selectedId);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, blocks]);

  /* Preview renderer */
  const renderPreview = () => (
    <div className="max-w-[680px] mx-auto px-6 py-16" style={{ fontFamily: "'Noto Serif', Georgia, serif" }}>
      <h1 className="text-[42px] font-bold text-[#1e1e1e] mb-8 leading-[1.2]">{title || "Untitled"}</h1>
      {blocks.map(b => {
        if (!b.content && !["divider", "image", "columns"].includes(b.kind)) return null;
        switch (b.kind) {
          case "divider": return <hr key={b.id} className="border-[#e0e0e0] my-8" />;
          case "image": return <div key={b.id} className="bg-[#f0f0f0] rounded h-52 my-6 flex items-center justify-center text-[#757575] text-[14px]">[Image: {b.content}]</div>;
          case "h1": return <h2 key={b.id} className="text-[36px] font-bold text-[#1e1e1e] mt-10 mb-4 leading-[1.2]">{b.content}</h2>;
          case "h2": return <h3 key={b.id} className="text-[28px] font-bold text-[#1e1e1e] mt-8 mb-3 leading-[1.3]">{b.content}</h3>;
          case "h3": return <h4 key={b.id} className="text-[22px] font-semibold text-[#1e1e1e] mt-6 mb-2 leading-[1.4]">{b.content}</h4>;
          case "quote": return <blockquote key={b.id} className="border-l-4 border-[#1e1e1e] pl-6 italic text-[#757575] text-[18px] my-6">{b.content}</blockquote>;
          case "code": return <pre key={b.id} className="bg-[#282a36] text-[#f8f8f2] rounded p-5 text-[14px] font-mono overflow-x-auto my-6">{b.content}</pre>;
          case "ul": return <ul key={b.id} className="list-disc pl-6 text-[16px] text-[#1e1e1e] leading-[1.8] my-3 space-y-1">{b.content.split("\n").filter(Boolean).map((l, i) => <li key={i}>{l}</li>)}</ul>;
          case "ol": return <ol key={b.id} className="list-decimal pl-6 text-[16px] text-[#1e1e1e] leading-[1.8] my-3 space-y-1">{b.content.split("\n").filter(Boolean).map((l, i) => <li key={i}>{l}</li>)}</ol>;
          default: return <p key={b.id} className="text-[16px] text-[#1e1e1e] leading-[1.8] mb-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{b.content}</p>;
        }
      })}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-white">

      {/* ══════════════════════════════════════════════════
          WP GUTENBERG TOP BAR — exact #1e1e1e dark bar
      ══════════════════════════════════════════════════ */}
      <header
        className="h-[48px] flex items-center bg-[#1e1e1e] z-50 flex-shrink-0 relative select-none"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        {/* Left group */}
        <div className="flex items-center h-full">
          {/* WP logo */}
          <button onClick={onClose}
            className="w-[48px] h-[48px] flex items-center justify-center text-white hover:bg-[#007cba] transition-colors"
            title="Back to dashboard">
            <WPIcon />
          </button>

          {/* Block inserter + */}
          <button
            onClick={() => setShowInserter(s => !s)}
            className={`w-[48px] h-[48px] flex items-center justify-center transition-colors ${showInserter ? "bg-[#007cba] text-white" : "text-white hover:bg-[#333]"
              }`}
            title="Toggle block inserter (Ctrl+Shift+P)">
            <Plus className="h-6 w-6" />
          </button>

          {/* Undo / Redo */}
          <button onClick={undo} disabled={!history.length}
            className="w-[48px] h-[48px] flex items-center justify-center text-white hover:bg-[#333] disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)">
            <Undo className="h-5 w-5" />
          </button>
          <button onClick={redo} disabled={!future.length}
            className="w-[48px] h-[48px] flex items-center justify-center text-white hover:bg-[#333] disabled:opacity-30 transition-colors" title="Redo (Ctrl+Shift+Z)">
            <Redo className="h-5 w-5" />
          </button>

          {/* Add Block quick button */}
          <button
            onClick={() => addBlock(selectedId ?? blocks[blocks.length - 1]?.id)}
            className="h-[48px] px-3 flex items-center gap-1.5 text-white hover:bg-[#333] transition-colors text-[13px] font-medium"
            title="Add new block">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden lg:inline">Add Block</span>
          </button>

          {/* List view */}
          <button className="w-[48px] h-[48px] flex items-center justify-center text-white hover:bg-[#333] transition-colors" title="Document overview">
            <ListTree className="h-5 w-5" />
          </button>
        </div>

        {/* Center — title + Ctrl+K */}
        <div className="flex-1 flex items-center justify-center px-4 min-w-0">
          <button className="flex items-center gap-3 px-4 py-1.5 bg-[#333] hover:bg-[#444] rounded text-white transition-colors max-w-[500px] w-full">
            <span className="text-[13px] truncate flex-1 text-left text-[#ccc]">
              {title || "Add title"}
            </span>
            <span className="text-[12px] text-[#888] flex-shrink-0 border border-[#555] rounded px-1.5 py-0.5">Ctrl+K</span>
          </button>
        </div>

        {/* Right group */}
        <div className="flex items-center gap-1 pr-2 h-full">
          {/* Auto-save indicator */}
          {autoSaveTime && (
            <span className="text-[12px] text-[#888] mr-2 hidden sm:inline">
              {saved ? "Saved" : `Auto-saved ${autoSaveTime}`}
            </span>
          )}

          {/* Save draft */}
          <button onClick={handleSave}
            className={`h-8 px-3 rounded text-[13px] font-medium transition-colors ${saved
              ? "bg-[#007cba]/20 text-[#4db8ff]"
              : "text-white hover:bg-[#333]"
              }`}>
            {saved ? "Saved!" : "Save draft"}
          </button>

          {/* Preview — desktop/tablet/mobile icons */}
          <button
            onClick={() => setPreviewMode(p => !p)}
            className={`w-[48px] h-[48px] flex items-center justify-center transition-colors ${previewMode ? "text-[#4db8ff] bg-[#333]" : "text-white hover:bg-[#333]"
              }`}
            title="Preview">
            <Monitor className="h-5 w-5" />
          </button>

          {/* Publish */}
          <button onClick={handlePublish}
            className="h-8 px-5 rounded bg-[#007cba] text-white text-[13px] font-semibold hover:bg-[#006ba1] transition-colors ml-1">
            {published ? "Update" : "Publish"}
          </button>

          {/* Settings toggle */}
          <button onClick={() => setShowSettings(s => !s)}
            className={`w-[48px] h-[48px] flex items-center justify-center transition-colors ${showSettings ? "text-white bg-[#333]" : "text-[#ccc] hover:bg-[#333] hover:text-white"
              }`}
            title="Settings">
            <PanelRight className="h-5 w-5" />
          </button>

          {/* More options */}
          <button className="w-[48px] h-[48px] flex items-center justify-center text-[#ccc] hover:bg-[#333] hover:text-white transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          BODY: inserter | canvas | settings
      ══════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left inserter panel */}
        <AnimatePresence>
          {showInserter && (
            <InserterPanel
              onInsert={kind => addBlock(selectedId ?? undefined, kind)}
              onClose={() => setShowInserter(false)}
              onInsertReusable={(rbBlocks) => {
                const newBlocks = rbBlocks.map(b => ({ ...b, id: crypto.randomUUID(), content: b.content }));
                const insertAfter = selectedId ?? blocks[blocks.length - 1]?.id;
                if (insertAfter) {
                  commit(blocks.flatMap(b => b.id === insertAfter ? [b, ...newBlocks] : [b]));
                } else {
                  commit([...blocks, ...newBlocks]);
                }
                setTimeout(() => setSelectedId(newBlocks[0]?.id ?? null), 0);
              }}
              reusableBlocks={reusableBlocks}
              currentBlocks={blocks}
              selectedId={selectedId}
              onSaveReusable={(name) => {
                setReusableBlocks(prev => [...prev, {
                  id: crypto.randomUUID(),
                  name,
                  blocks: blocks.map(b => ({ ...b })),
                }]);
              }}
            />
          )}
        </AnimatePresence>

        {/* Canvas — white bg, no dots, matching WP */}
        <div
          className="flex-1 overflow-y-auto bg-[#f0f0f0]"
          onClick={() => setSelectedId(null)}
        >
          {previewMode ? (
            <div className="bg-white min-h-full">
              {renderPreview()}
            </div>
          ) : (
            <div className="max-w-[740px] mx-auto my-8 px-4">
              {/* White paper canvas */}
              <div
                className="bg-white shadow-[0_0_0_1px_#e0e0e0,0_2px_10px_rgba(0,0,0,0.04)] min-h-[calc(100vh-200px)] px-[52px] py-10 relative"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                onClick={e => e.stopPropagation()}
              >
                {/* Post title */}
                <textarea
                  value={title}
                  onChange={e => { setTitle(e.target.value); e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                  className="w-full text-[42px] font-bold text-[#1e1e1e] bg-transparent border-none outline-none resize-none placeholder:text-[#9ca3af] leading-[1.2] mb-4"
                  style={{ fontFamily: "'Noto Serif', Georgia, serif" }}
                  placeholder="Add title"
                  rows={1}
                />

                {/* Blocks */}
                <div className="space-y-1">
                  {blocks.map(block => (
                    <EditorBlock
                      key={block.id}
                      block={block}
                      isSelected={selectedId === block.id}
                      onSelect={() => setSelectedId(block.id)}
                      onChange={content => updateBlock(block.id, content)}
                      onChangeKind={kind => changeBlockKind(block.id, kind)}
                      onAddAfter={kind => addBlock(block.id, kind)}
                      onDelete={() => deleteBlock(block.id)}
                      onMoveUp={() => moveBlock(block.id, "up")}
                      onMoveDown={() => moveBlock(block.id, "down")}
                      onDuplicate={() => duplicateBlock(block.id)}
                      onDragStartBlock={() => setDraggedBlockId(block.id)}
                      onDragOverBlock={e => { e.preventDefault(); setDragOverBlockId(block.id); }}
                      onDragEndBlock={() => { setDraggedBlockId(null); setDragOverBlockId(null); }}
                      onDropOnBlock={() => {
                        if (draggedBlockId && draggedBlockId !== block.id) {
                          const fromIdx = blocks.findIndex(b => b.id === draggedBlockId);
                          const toIdx = blocks.findIndex(b => b.id === block.id);
                          if (fromIdx !== -1 && toIdx !== -1) {
                            const next = [...blocks];
                            const [moved] = next.splice(fromIdx, 1);
                            next.splice(toIdx, 0, moved);
                            commit(next);
                          }
                        }
                        setDraggedBlockId(null);
                        setDragOverBlockId(null);
                      }}
                      isDragOverBlock={dragOverBlockId === block.id && draggedBlockId !== block.id}
                      isDraggingBlock={draggedBlockId === block.id}
                    />
                  ))}

                  {/* End-of-canvas add block */}
                  <style jsx global>{`
                    [contenteditable]:empty:before {
                      content: attr(data-placeholder);
                      color: #9ca3af;
                      cursor: text;
                    }
                  `}</style>
                  <div className="pt-8 flex items-center gap-3">
                    <button
                      onClick={() => addBlock(blocks[blocks.length - 1]?.id)}
                      className="flex items-center gap-2 text-[13px] text-[#757575] hover:text-[#007cba] transition-colors">
                      <div className="w-6 h-6 rounded-full border border-[#e0e0e0] hover:border-[#007cba] flex items-center justify-center transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                      <span className="hidden sm:inline">Type <code className="bg-[#f0f0f0] px-1 py-0.5 rounded text-[12px]">/</code> to choose a block</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right settings sidebar */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="overflow-hidden flex-shrink-0"
            >
              <SettingsSidebar
                selectedBlock={selectedBlock}
                onChangeBlockKind={kind => selectedId && changeBlockKind(selectedId, kind)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom status bar — WP style */}
      <div className="h-[28px] bg-white border-t border-[#e0e0e0] flex items-center justify-between px-4 flex-shrink-0"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-[#757575]">{blocks.length} Block{blocks.length !== 1 ? "s" : ""}</span>
          <span className="text-[12px] text-[#757575]">{wordCount} Word{wordCount !== 1 ? "s" : ""}</span>
          <span className="text-[12px] text-[#757575]">{readTime} min read</span>
        </div>
        <div className="flex items-center gap-3">
          {autoSaveTime && (
            <span className="text-[12px] text-[#757575]">
              {saved ? "✓ Saved" : `Auto-saved at ${autoSaveTime}`}
            </span>
          )}
          <button className="text-[12px] text-[#007cba] hover:underline flex items-center gap-1">
            <Keyboard className="h-3 w-3" /> Shortcuts
          </button>
        </div>
      </div>
    </motion.div>
  );
}
