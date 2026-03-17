"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Clock, Pencil, Trash2, Paperclip, X, MoreVertical, BookOpen, ChevronDown, ChevronUp, Mic, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { parseDalils, getEvidenceConfig, validateDalilReference } from "@/lib/dalil";
import { FormattedText, formatTextToHtml, htmlToMarkdown } from "@/lib/format-text";
import { toast } from "sonner";

export type ChatMessage = {
  id: string;
  userId?: string;
  userName: string;
  text: string;
  audioUrl?: string;
  createdAt: string;
};

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

const CHAT_INPUT_STORAGE_KEY = "debate-chat-input-height";
const MIN_INPUT_HEIGHT = 50;
const ROW_HEIGHT = 24;
const DEFAULT_INPUT_ROWS = 2;
const MAX_INPUT_ROWS = 4;
const DEFAULT_INPUT_HEIGHT = MIN_INPUT_HEIGHT + (DEFAULT_INPUT_ROWS - 1) * ROW_HEIGHT;
const MAX_INPUT_HEIGHT = MIN_INPUT_HEIGHT + (MAX_INPUT_ROWS - 1) * ROW_HEIGHT;

const BULLET_STYLES = [
  { id: "asterisk", char: "*", label: "Default" },
  { id: "dot", char: "•", label: "Dot" },
  { id: "circle", char: "●", label: "Circle" },
  { id: "point", char: "👉", label: "Point" },
  { id: "arrow", char: "➤", label: "Arrow" },
  { id: "red", char: "🔴", label: "Red" },
  { id: "orange", char: "🟠", label: "Orange" },
  { id: "yellow", char: "🟡", label: "Yellow" },
  { id: "green", char: "🟢", label: "Green" },
  { id: "blue", char: "🔵", label: "Blue" },
  { id: "purple", char: "🟣", label: "Purple" },
  { id: "record", char: "⏺", label: "Record" },
  { id: "tai", char: "ꪜ", label: "Tai" },
];

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"];
const CIRCLED = ["⓿", "❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾", "❿", "⓫", "⓬", "⓭", "⓮", "⓯", "⓰", "⓱", "⓲", "⓳", "⓴"];
const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";

function parseBengaliNumber(s: string): number {
  let n = 0;
  for (const c of s) {
    const i = BENGALI_DIGITS.indexOf(c);
    if (i >= 0) n = n * 10 + i;
  }
  return n || 0;
}

function toBengaliNumeral(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => BENGALI_DIGITS[parseInt(d, 10)] ?? d);
}

const NUMBERED_STYLES = [
  { id: "default", fmt: (n: number) => `${n}. `, label: "1. 2. 3." },
  { id: "bengali", fmt: (n: number) => `${toBengaliNumeral(n)}. `, label: "১. ২. ৩." },
  { id: "circled", fmt: (n: number) => `${CIRCLED[n] ?? n}. `, label: "❶ ❷ ❸" },
  { id: "roman", fmt: (n: number) => `${(ROMAN[n - 1] ?? String(n)).toLowerCase()}. `, label: "i. ii. iii." },
];

const BULLET_PREFIX = /[-•*●👉➤🔴🟠🟡🟢🔵🟣⏺ꪜ](?:\s|[\u200B-\u200D\uFEFF])*/u;
const BULLET_SPLIT = /(?=\s*[-•*●👉➤🔴🟠🟡🟢🔵🟣⏺ꪜ](?:\s|[\u200B-\u200D\uFEFF])?)/u;
const BULLET_ONLY = /^[-•*●👉➤🔴🟠🟡🟢🔵🟣⏺ꪜ]\s*$/u;
const STARTS_WITH_BULLET = /^[-•*●👉➤🔴🟠🟡🟢🔵🟣⏺ꪜ]\s/u;

const NUMBER_PREFIX_ONLY = /^(\d+|[০-৯]+|[❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴])\s*\.\s*$|^[\u0069\u0076\u0078\u006c\u0063\u0064\u006d]+\s*\.\s*$/iu;

/** Merge lines split by DOM (e.g. "ꪜ" + " test" → "ꪜ test") */
function mergeSplitBulletContent(lines: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (BULLET_ONLY.test(trimmed)) {
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      const next = j < lines.length ? lines[j].trim() : "";
      if (next && !STARTS_WITH_BULLET.test(next)) {
        result.push(trimmed + " " + next);
        i = j;
        continue;
      }
    }
    result.push(lines[i]);
  }
  return result;
}

/** Merge numbered lines split by DOM (e.g. "১. " + "দৃতুকাি" → "১. দৃতুকাি") */
function mergeSplitNumberedContent(lines: string[]): string[] {
  const result: string[] = [];
  const startsWithNumber = /^(\d+|[০-৯]+|[❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴])\s*\.?\s|^[\u0069\u0076\u0078\u006c\u0063\u0064\u006d]+\s*\.?\s/iu;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (NUMBER_PREFIX_ONLY.test(trimmed)) {
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      const next = j < lines.length ? lines[j].trim() : "";
      if (next && !startsWithNumber.test(next)) {
        const prefix = trimmed.replace(/\s*\.?\s*$/, "");
        result.push(/^[.\s।]/.test(next) ? prefix + next : prefix + ". " + next);
        i = j;
        continue;
      }
    }
    result.push(lines[i]);
  }
  return result;
}

function expandMergedListLines(lines: string[], isNumbered: boolean): string[] {
  const result: string[] = [];
  const numSplit = /(?<=\S)(?=\d+\.\s)/u;
  const bengaliSplit = /(?<=\S)(?=[০-৯]+\.\s)/u;
  const circledSplit = /(?<=\S)(?=[❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴]\s)/u;
  for (const raw of lines) {
    if (isNumbered) {
      const parts = raw.split(new RegExp(`${numSplit.source}|${bengaliSplit.source}|${circledSplit.source}`));
      for (const p of parts) {
        if (p.trim()) result.push(p);
      }
    } else {
      const parts = raw.split(BULLET_SPLIT);
      for (const p of parts) {
        if (p.trim()) result.push(p);
      }
    }
  }
  return result.length > 0 ? result : lines.filter((l) => l.trim());
}

function applyListStyleToBlock(
  lines: string[],
  start: number,
  end: number,
  isNumbered: boolean,
  style: { char?: string; fmt?: (n: number) => string }
): string[] {
  const out = [...lines];
  for (let i = start; i <= end; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[-•*●👉➤🔴🟠🟡🟢🔵🟣⏺ꪜ](?:\s|[\u200B-\u200D\uFEFF])*(.*)$/su) || trimmed.match(/^[-•*](?:\s|[\u200B-\u200D\uFEFF])*(.*)$/u);
    const numMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
    const bengaliMatch = trimmed.match(/^([০-৯]+)\.\s*(.*)$/u);
    const circledMatch = trimmed.match(/^[❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴]\s*\.?\s*(.*)$/u);
    const romanMatch = trimmed.match(/^[\u0069\u0076\u0078\u006c\u0063\u0064\u006d]+\.\s*(.*)$/iu);
    if (isNumbered && (numMatch || bengaliMatch || circledMatch || romanMatch)) {
      const num = i - start + 1;
      const after = (numMatch ? numMatch[2] : bengaliMatch ? bengaliMatch[2] : circledMatch ? circledMatch[1] : romanMatch ? romanMatch[1] : "").trimStart();
      const fmt = style.fmt;
      out[i] = fmt ? fmt(num) + after : line;
    } else if (!isNumbered && bulletMatch) {
      const after = (bulletMatch[1] ?? "").trimStart();
      const char = style.char ?? "*";
      out[i] = char + " " + after;
    }
  }
  return out;
}

function getStoredInputHeight(): number {
  if (typeof window === "undefined") return DEFAULT_INPUT_HEIGHT;
  try {
    const v = parseInt(localStorage.getItem(CHAT_INPUT_STORAGE_KEY) ?? "", 10);
    return Number.isNaN(v) ? DEFAULT_INPUT_HEIGHT : Math.max(MIN_INPUT_HEIGHT, Math.min(MAX_INPUT_HEIGHT, v));
  } catch {
    return DEFAULT_INPUT_HEIGHT;
  }
}

interface DebateChatPanelProps {
  messages: ChatMessage[];
  chatInput: string;
  onInputChange: (v: string) => void;
  /** onSend(overrideText?) – if overrideText provided, send that instead of chatInput (e.g. voice transcript) */
  onSend: (overrideText?: string) => void;
  sending: boolean;
  currentUserId?: string | null;
  currentUserName?: string;
  requireLogin?: boolean;
  onLoginClick?: () => void;
  variant?: "default" | "messenger";
  className?: string;
  /** ISO date string – chat locked until this time; countdown shown before */
  scheduledAt?: string | null;
  onEditMessage?: (messageId: string, newText: string) => void | Promise<void>;
  onDeleteMessage?: (messageId: string) => void | Promise<void>;
  /** Show optional dalil (evidence) attachment */
  showDalilAttachment?: boolean;
  dalilAttachment?: { type: string; reference: string; arabic?: string; translation?: string } | null;
  onDalilChange?: (dalil: { type: string; reference: string; arabic?: string; translation?: string } | null) => void;
  /** Send voice message (audio blob) – when provided, submit sends actual recording */
  onSendVoice?: (audioBlob: Blob) => void | Promise<void>;
  /** Callback when user types (debounced) – for typing indicator */
  onTyping?: () => void;
  /** Callback when user starts/stops recording – for recording indicator */
  onRecordingChange?: (recording: boolean) => void;
  /** Users currently typing – e.g. [{ userId, userName }] */
  typingUsers?: { userId: string; userName: string }[];
  /** Max character limit for messages (default 5000) */
  maxLength?: number;
  /** When false, show banner that real-time updates are unavailable */
  realtimeAvailable?: boolean;
}

/**
 * Shared chat panel - same UI for public and scholar pages.
 * Messenger-style: bubbles, avatars, timestamps.
 */
function formatCountdown(ms: number): { days: number; hours: number; minutes: number; seconds: number } {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function DebateChatPanel({
  messages,
  chatInput,
  onInputChange,
  onSend,
  sending,
  currentUserId,
  currentUserName,
  requireLogin = false,
  onLoginClick,
  variant = "default",
  className,
  scheduledAt,
  onEditMessage,
  onDeleteMessage,
  showDalilAttachment = false,
  dalilAttachment,
  onDalilChange,
  onSendVoice,
  onTyping,
  onRecordingChange,
  typingUsers = [],
  maxLength = 5000,
  realtimeAvailable = true,
}: DebateChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const listStylePopoverRef = useRef<HTMLDivElement>(null);
  const listStylePopoverCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const POPOVER_CLOSE_DELAY_MS = 300;
  const schedulePopoverClose = () => {
    if (listStylePopoverCloseTimeoutRef.current) clearTimeout(listStylePopoverCloseTimeoutRef.current);
    listStylePopoverCloseTimeoutRef.current = setTimeout(() => {
      listStylePopoverCloseTimeoutRef.current = null;
      setListStylePopover(null);
    }, POPOVER_CLOSE_DELAY_MS);
  };
  const cancelPopoverClose = () => {
    if (listStylePopoverCloseTimeoutRef.current) {
      clearTimeout(listStylePopoverCloseTimeoutRef.current);
      listStylePopoverCloseTimeoutRef.current = null;
    }
  };
  const [listStylePopover, setListStylePopover] = useState<{
    type: "bullet" | "numbered";
    rect: DOMRect;
    lineText: string;
  } | null>(null);
  const [inputHeight, setInputHeight] = useState(() => getStoredInputHeight());
  const [now, setNow] = useState(() => Date.now());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showDalilForm, setShowDalilForm] = useState(false);
  const [dalilForm, setDalilForm] = useState({ type: "Quran", reference: "", arabic: "", translation: "" });
  const [messageForDalil, setMessageForDalil] = useState<{ id: string; text: string } | null>(null);
  const [expandedDalil, setExpandedDalil] = useState<Record<string, boolean>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const dalilTypes = ["Quran", "Hadith", "Ijma", "Qiyas", "Scholarly"];

  const dalilTemplates = [
    { type: "Quran", reference: "Surah 2:255", label: "Ayatul Kursi" },
    { type: "Quran", reference: "Surah 42:38", label: "Shura" },
    { type: "Quran", reference: "Surah 3:159", label: "Consultation" },
    { type: "Hadith", reference: "Bukhari 1:2", label: "Bukhari" },
    { type: "Hadith", reference: "Muslim 1:1", label: "Muslim" },
    { type: "Hadith", reference: "Abu Dawud", label: "Abu Dawud" },
    { type: "Scholarly", reference: "Al-Mawardi, Al-Ahkam", label: "Al-Mawardi" },
  ];

  const hasMediaRecorder = typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

  const typingThrottleRef = useRef(0);
  const handleInputChange = (v: string) => {
    onInputChange(v);
    if (onTyping && v.trim()) {
      const now = Date.now();
      if (now - typingThrottleRef.current > 800) {
        typingThrottleRef.current = now;
        onTyping();
      }
    }
  };

  const saveInputHeight = (h: number) => {
    const clamped = Math.max(MIN_INPUT_HEIGHT, Math.min(MAX_INPUT_HEIGHT, h));
    setInputHeight(clamped);
    try {
      localStorage.setItem(CHAT_INPUT_STORAGE_KEY, String(clamped));
    } catch {}
  };

  const resetInputSize = () => {
    saveInputHeight(DEFAULT_INPUT_HEIGHT);
  };

  const syncFromEditable = () => {
    const el = editableRef.current;
    if (!el) return;
    let md = htmlToMarkdown(el.innerHTML);
    if (md.length > maxLength) {
      md = md.slice(0, maxLength);
      el.innerHTML = formatTextToHtml(md);
    }
    if (md !== chatInput) handleInputChange(md);
  };

  useEffect(() => {
    if (chatInput === "" && editableRef.current) {
      editableRef.current.innerHTML = "";
    }
  }, [chatInput]);

  const getBlockAtPoint = (clientX: number, clientY: number): { text: string; rect: DOMRect; charOffset: number; lineText: string } | null => {
    const el = editableRef.current;
    if (!el) return null;
    try {
      const doc = el.ownerDocument;
      const range = (doc as Document & { caretRangeFromPoint?(x: number, y: number): Range }).caretRangeFromPoint?.(clientX, clientY);
      if (!range) return null;
      const startNode = range.startContainer;
      let block: Node | null = startNode;
      if (block.nodeType === Node.TEXT_NODE) block = block.parentElement;
      if (!block) return null;
      while (block && block !== el) {
        const tag = (block as HTMLElement).tagName?.toUpperCase();
        if (tag === "DIV" || tag === "P" || tag === "LI") break;
        block = block.parentElement;
      }
      if (!block) block = el;
      const blockText = ((block as HTMLElement).textContent ?? "").trim();
      const lineText = startNode.nodeType === Node.TEXT_NODE ? (startNode.textContent ?? "").trim() : blockText;
      const text = lineText || blockText;
      const rect = (block as HTMLElement).getBoundingClientRect();
      let charOffset = 0;
      if (startNode.nodeType === Node.TEXT_NODE) {
        charOffset = range.startOffset;
      } else {
        try {
          const blockRange = doc.createRange();
          blockRange.selectNodeContents(block);
          blockRange.setEnd(range.startContainer, range.startOffset);
          charOffset = blockRange.toString().length;
        } catch {
          charOffset = 0;
        }
      }
      return { text, rect, charOffset, lineText };
    } catch {
      return null;
    }
  };

  const getCurrentLineFromEditable = (): string => {
    const el = editableRef.current;
    if (!el) return "";
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return "";
      let block: Node | null = sel.anchorNode;
      if (!block) return "";
      if (block.nodeType === Node.TEXT_NODE) block = block.parentElement;
      if (!block) return "";
      while (block && block !== el) {
        const tag = (block as HTMLElement).tagName?.toUpperCase();
        if (tag === "DIV" || tag === "P" || tag === "LI") break;
        block = block.parentElement;
      }
      if (!block) block = el;
      const text = (block as HTMLElement).textContent ?? "";
      return text;
    } catch {
      return "";
    }
  };

  const handleEditableKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      const el = editableRef.current;
      if (!el) return;
      const currentLine = getCurrentLineFromEditable();
      const numberedMatch = currentLine.match(/^(\d+)\.\s*/);
      const bengaliMatch = currentLine.match(/^([০-৯]+)\.\s*/u);
      const bulletMatch = currentLine.match(/^[-•*]\s+/);

      if (e.shiftKey) {
        if (numberedMatch) {
          e.preventDefault();
          const num = parseInt(numberedMatch[1], 10);
          const afterNum = currentLine.slice(numberedMatch[0].length);
          if (afterNum.trim() === "") {
            document.execCommand("insertParagraph", false);
            document.execCommand("insertParagraph", false);
          } else {
            document.execCommand("insertParagraph", false);
            document.execCommand("insertText", false, `${num + 1}. `);
          }
        } else if (bengaliMatch) {
          e.preventDefault();
          const num = parseBengaliNumber(bengaliMatch[1]);
          const afterNum = currentLine.slice(bengaliMatch[0].length);
          if (afterNum.trim() === "") {
            document.execCommand("insertParagraph", false);
            document.execCommand("insertParagraph", false);
          } else {
            document.execCommand("insertParagraph", false);
            document.execCommand("insertText", false, `${toBengaliNumeral(num + 1)}. `);
          }
        } else if (bulletMatch) {
          e.preventDefault();
          const afterBullet = currentLine.slice(bulletMatch[0].length);
          if (afterBullet.trim() === "") {
            document.execCommand("insertParagraph", false);
            document.execCommand("insertParagraph", false);
          } else {
            document.execCommand("insertParagraph", false);
            document.execCommand("insertText", false, bulletMatch[0]);
          }
        }
        return;
      }

      e.preventDefault();
      if (numberedMatch || bengaliMatch || bulletMatch) {
        const after = numberedMatch ? currentLine.slice(numberedMatch[0].length) : bengaliMatch ? currentLine.slice(bengaliMatch[0].length) : currentLine.slice(bulletMatch![0].length);
        if (after.trim() === "") {
          document.execCommand("insertParagraph", false);
          document.execCommand("insertParagraph", false);
          return;
        }
      }
      const plainText = htmlToMarkdown(el.innerHTML);
      onSend(plainText.trim() ? plainText : undefined);
    } else if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      document.execCommand("bold");
    } else if (e.key === "i" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      document.execCommand("italic");
    } else if (e.key === "u" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      document.execCommand("underline");
    }
  };

  const handleEditableInput = () => {
    syncFromEditable();
  };

  const handleEditableMouseMove = (e: React.MouseEvent) => {
    const result = getBlockAtPoint(e.clientX, e.clientY);
    if (!result) {
      if (listStylePopoverRef.current?.contains(document.elementFromPoint(e.clientX, e.clientY) as Node)) {
        cancelPopoverClose();
        return;
      }
      schedulePopoverClose();
      return;
    }
    const { text, rect, charOffset, lineText } = result;
    const line = lineText || text;
    const numberedMatch = line.match(/^(\d+)\.\s*/);
    const bengaliMatch = line.match(/^([০-৯]+)\.\s*/u);
    const circledMatch = line.match(/^[❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴]\s*/u);
    const romanMatch = line.match(/^[\u0069\u0076\u0078\u006c\u0063\u0064\u006d]+\.\s*/iu);
    const bulletMatch = line.match(/^[-•*●👉➤🔴🟠🟡🟢🔵🟣⏺ꪜ](?:\s|[\u200B-\u200D\uFEFF])*/u) || line.match(/^[-•*](?:\s|[\u200B-\u200D\uFEFF])*/u);
    const prefixLen = numberedMatch ? numberedMatch[0].length : bengaliMatch ? bengaliMatch[0].length : circledMatch ? circledMatch[0].length : romanMatch ? romanMatch[0].length : bulletMatch ? bulletMatch[0].length : 0;
    if (prefixLen === 0 || charOffset > prefixLen) {
      schedulePopoverClose();
      return;
    }
    cancelPopoverClose();
    if (numberedMatch || bengaliMatch || circledMatch || romanMatch) {
      setListStylePopover({ type: "numbered", rect, lineText: line });
    } else if (bulletMatch || /^[-•*]\s+/.test(line)) {
      setListStylePopover({ type: "bullet", rect, lineText: line });
    } else {
      schedulePopoverClose();
    }
  };

  const handleEditableMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as Node | null;
    if (related && listStylePopoverRef.current?.contains(related)) return;
    schedulePopoverClose();
  };

  const applyListStyle = (style: (typeof BULLET_STYLES)[0] | (typeof NUMBERED_STYLES)[0]) => {
    const el = editableRef.current;
    if (!el || !listStylePopover) return;
    const raw = htmlToMarkdown(el.innerHTML).trim() || chatInput.trim();
    const isNumbered = listStylePopover.type === "numbered";
    const splitLines = raw.split(/\n/);
    const merged = isNumbered ? mergeSplitNumberedContent(splitLines) : mergeSplitBulletContent(splitLines);
    const lines = expandMergedListLines(merged, isNumbered);
    const targetLine = listStylePopover.lineText.trim();
    const isListLine = (l: string) => {
      const t = l.trim();
      return isNumbered
        ? !!t.match(/^(\d+)\.\s*/) || !!t.match(/^[০-৯]+\.\s*/u) || (t.length > 0 && CIRCLED.includes(t[0])) || !!t.match(/^[\u0069\u0076\u0078\u006c\u0063\u0064\u006d]+\.\s*/iu)
        : !!t.match(/^[-•*●👉➤🔴🟠🟡🟢🔵🟣⏺ꪜ](?:\s|[\u200B-\u200D\uFEFF])*/u) || !!t.match(/^[-•*](?:\s|[\u200B-\u200D\uFEFF])*/u);
    };
    const norm = (s: string) => s.trim().replace(/\s+/g, " ");
    let hoverIdx = lines.findIndex((l) => norm(l) === norm(targetLine));
    if (hoverIdx < 0) hoverIdx = lines.findIndex((l) => isListLine(l) && norm(l).includes(norm(targetLine)));
    if (hoverIdx < 0) {
      cancelPopoverClose();
      setListStylePopover(null);
      return;
    }
    let start = hoverIdx;
    while (start > 0 && isListLine(lines[start - 1])) start--;
    let end = hoverIdx;
    while (end < lines.length - 1 && isListLine(lines[end + 1])) end++;
    const newLines = applyListStyleToBlock(lines, start, end, isNumbered, style);
    const newMd = newLines.join("\n").replace(/\n{3,}/g, "\n\n");
    el.innerHTML = formatTextToHtml(newMd);
    handleInputChange(newMd);
    cancelPopoverClose();
    setListStylePopover(null);
  };

  const handleEditablePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const clearRecordingState = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
    onRecordingChange?.(false);
  };

  const pendingSendRef = useRef(false);

  const startVoiceRecord = async () => {
    if (!hasMediaRecorder || !onSendVoice) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      pendingSendRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const chunks = [...audioChunksRef.current];
        clearRecordingState();
        if (pendingSendRef.current && chunks.length > 0 && onSendVoice) {
          const blob = new Blob(chunks, { type: mimeType });
          await onSendVoice(blob);
        }
        pendingSendRef.current = false;
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
      onRecordingChange?.(true);
    } catch (err) {
      clearRecordingState();
      const msg = err instanceof Error ? err.message : "Microphone access denied";
      toast.error(msg.includes("Permission") || msg.includes("denied") ? "Microphone permission denied. Please allow access to record voice." : msg);
    }
  };

  const cancelVoiceRecord = () => {
    pendingSendRef.current = false;
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    clearRecordingState();
  };

  const stopVoiceAndSend = () => {
    pendingSendRef.current = true;
    mediaRecorderRef.current?.stop();
  };

  const scheduledMs = scheduledAt ? new Date(scheduledAt).getTime() : null;
  const chatLocked = scheduledMs != null && now < scheduledMs;
  const remaining = chatLocked && scheduledMs ? scheduledMs - now : 0;
  const countdown = formatCountdown(remaining);

  useEffect(() => {
    if (!chatLocked) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [chatLocked]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const editableWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = editableWrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      if (h >= MIN_INPUT_HEIGHT && h <= MAX_INPUT_HEIGHT) {
        setInputHeight(h);
        try {
          localStorage.setItem(CHAT_INPUT_STORAGE_KEY, String(h));
        } catch {}
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMessenger = variant === "messenger";

  return (
    <div
      ref={panelRef}
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card overflow-hidden",
        isMessenger ? "h-full min-h-[400px]" : "min-h-[400px] h-auto",
        className
      )}
    >
      <div className="px-4 py-3 border-b border-border font-semibold flex items-center gap-2 shrink-0">
        <MessageSquare className="h-4 w-4 text-primary" />
        Live Chat
      </div>

      {!realtimeAvailable && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 shrink-0">
          Real-time updates unavailable. Refresh to see new messages.
        </div>
      )}

      <div className="flex-1 min-h-[280px] overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary/60" />
            </div>
            <p className="text-sm font-medium text-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              Scholars will post their positions and evidence here when the debate begins.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isOwn = currentUserId && (String(m.userId) === String(currentUserId) || m.userName === currentUserName);
            const isEditing = editingId === m.id;
            const hasRealId = !m.id.startsWith("pusher-");
            const canEditDelete = isOwn && hasRealId && (onEditMessage || onDeleteMessage);
            return (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2 group",
                  isOwn ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    isOwn ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}
                >
                  {m.userName.charAt(0).toUpperCase()}
                </div>
                <div className={cn("flex flex-col max-w-[75%]", isOwn ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 relative",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted border border-border rounded-tl-sm"
                    )}
                  >
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              const t = editText.trim();
                              if (t && onEditMessage) {
                                onEditMessage(m.id, t);
                                setEditingId(null);
                              }
                            }
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className={cn(
                            "h-8 text-sm",
                            isOwn ? "bg-background/90 text-foreground border-border" : ""
                          )}
                          autoFocus
                        />
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              const t = editText.trim();
                              if (t && onEditMessage) {
                                onEditMessage(m.id, t);
                                setEditingId(null);
                              }
                            }}
                            disabled={!editText.trim()}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {(() => {
                          const { mainText, dalils } = parseDalils(m.text);
                          const hasDalils = dalils.length > 0;
                          const dalilOpen = expandedDalil[m.id];
                          const API_URL = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
                          return (
                            <>
                              {m.audioUrl && (
                                <div className="mb-2">
                                  <audio
                                    controls
                                    src={`${API_URL}${m.audioUrl}`}
                                    className="max-w-full h-9 min-w-[200px]"
                                    preload="metadata"
                                  />
                                </div>
                              )}
                              {(mainText.trim() || !hasDalils) && !(m.audioUrl && (mainText.trim() === "[Voice message]" || m.text === "[Voice message]")) && (
                                <FormattedText text={mainText.trim() || m.text} className="text-sm wrap-break-word pr-8" as="p" />
                              )}
                              {hasDalils && (
                                <div className="mt-2 space-y-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedDalil((p) => ({ ...p, [m.id]: !p[m.id] }))}
                                    className={cn(
                                      "flex items-center gap-1.5 text-xs font-medium transition-colors w-full",
                                      isOwn ? "text-primary-foreground/90 hover:text-primary-foreground" : "text-primary hover:text-primary/80"
                                    )}
                                  >
                                    <BookOpen className="h-3 w-3 shrink-0" />
                                    {dalils.length} dalil{dalils.length > 1 ? "s" : ""} cited
                                    {dalilOpen ? <ChevronUp className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
                                  </button>
                                  <AnimatePresence>
                                    {dalilOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden space-y-2"
                                      >
                                        {dalils.map((ev, eIdx) => {
                                          const cfg = getEvidenceConfig(ev.type);
                                          return (
                                            <div
                                              key={eIdx}
                                              className={cn(
                                                "rounded-xl border p-3 space-y-1.5",
                                                isOwn ? "bg-primary-foreground/10 border-primary-foreground/20" : "bg-muted/80 border-border"
                                              )}
                                            >
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm">{cfg.icon}</span>
                                                <Badge variant="outline" className={cn("text-[10px] py-0 px-2 border", cfg.color)}>
                                                  {cfg.label}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">— {ev.reference}</span>
                                              </div>
                                              {ev.arabic && (
                                                <p className="text-base leading-relaxed font-amiri text-right" dir="rtl">
                                                  {ev.arabic}
                                                </p>
                                              )}
                                              {ev.translation && (
                                                <p className="text-xs text-muted-foreground italic">&quot;{ev.translation}&quot;</p>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </>
                          );
                        })()}
                        {canEditDelete && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "absolute top-1.5 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                                  isOwn ? "right-2" : "left-2 right-auto"
                                )}
                                aria-label="Message options"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isOwn ? "end" : "start"} side="top" className="min-w-[140px]">
                              {onEditMessage && !m.audioUrl && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingId(m.id);
                                    setEditText(m.text);
                                  }}
                                >
                                  <Pencil className="h-3.5 w-3.5 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDeleteMessage && (
                                <DropdownMenuItem
                                  onClick={() => onDeleteMessage(m.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                              {showDalilAttachment && onEditMessage && onDalilChange && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setMessageForDalil({ id: m.id, text: m.text });
                                    setShowDalilForm(true);
                                    setEditingId(null);
                                  }}
                                >
                                  <Paperclip className="h-3.5 w-3.5 mr-2" />
                                  Add dalil
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {formatTime(m.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {chatLocked ? (
        <div className="p-4 border-t border-border shrink-0">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Chat opens when debate starts</span>
          </div>
          <div className="flex justify-center gap-2 sm:gap-4">
            {countdown.days > 0 && (
              <div className="flex flex-col items-center min-w-12 px-2 py-1.5 rounded-lg bg-muted/80 border border-border">
                <span className="text-lg font-bold tabular-nums text-foreground">{countdown.days}</span>
                <span className="text-[10px] uppercase">days</span>
              </div>
            )}
            <div className="flex flex-col items-center min-w-12 px-2 py-1.5 rounded-lg bg-muted/80 border border-border">
              <span className="text-lg font-bold tabular-nums text-foreground">{String(countdown.hours).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase">hrs</span>
            </div>
            <div className="flex flex-col items-center min-w-12 px-2 py-1.5 rounded-lg bg-muted/80 border border-border">
              <span className="text-lg font-bold tabular-nums text-foreground">{String(countdown.minutes).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase">min</span>
            </div>
            <div className="flex flex-col items-center min-w-12 px-2 py-1.5 rounded-lg bg-primary/15 border border-primary/30">
              <span className="text-lg font-bold tabular-nums text-primary animate-pulse">{String(countdown.seconds).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase text-primary/80">sec</span>
            </div>
          </div>
        </div>
      ) : requireLogin ? (
        <div className="p-3 border-t border-border text-center text-sm text-muted-foreground shrink-0">
          <Button variant="link" size="sm" onClick={onLoginClick}>
            Log in to chat
          </Button>
        </div>
      ) : (
        <div className="p-3 border-t border-border space-y-2 shrink-0">
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span>
                {typingUsers.filter((t) => t.userId !== currentUserId).slice(0, 2).map((t) => t.userName).join(", ")}
                {typingUsers.filter((t) => t.userId !== currentUserId).length > 2 ? " and others" : ""} typing...
              </span>
            </div>
          )}
          {showDalilAttachment && (
            <div className="space-y-2">
              {dalilAttachment ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  <span className="font-medium text-primary">{dalilAttachment.type}:</span>
                  <span className="text-muted-foreground truncate flex-1">{dalilAttachment.reference}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => onDalilChange?.(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : showDalilForm ? (
                <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {messageForDalil ? "Add dalil to message" : "Attach dalil (optional)"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => {
                        setShowDalilForm(false);
                        setMessageForDalil(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {dalilTemplates.map((t) => (
                      <button
                        key={`${t.type}-${t.reference}`}
                        type="button"
                        onClick={() => setDalilForm((p) => ({ ...p, type: t.type, reference: t.reference }))}
                        className="text-[10px] px-2 py-1 rounded-md border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <select
                    value={dalilForm.type}
                    onChange={(e) => setDalilForm((p) => ({ ...p, type: e.target.value }))}
                    className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    {dalilTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Reference (e.g. Surah 42:38)"
                    value={dalilForm.reference}
                    onChange={(e) => setDalilForm((p) => ({ ...p, reference: e.target.value }))}
                    className="h-8 text-sm"
                  />
                  <Input
                    placeholder="Arabic (optional)"
                    value={dalilForm.arabic}
                    onChange={(e) => setDalilForm((p) => ({ ...p, arabic: e.target.value }))}
                    className="h-8 text-sm"
                    dir="rtl"
                  />
                  <Input
                    placeholder="Translation (optional)"
                    value={dalilForm.translation}
                    onChange={(e) => setDalilForm((p) => ({ ...p, translation: e.target.value }))}
                    className="h-8 text-sm"
                  />
                  {validateDalilReference(dalilForm.type, dalilForm.reference) && dalilForm.reference.trim() && (
                    <p className="text-[10px] text-amber-600">{validateDalilReference(dalilForm.type, dalilForm.reference)}</p>
                  )}
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      if (!dalilForm.reference.trim()) return;
                      const err = validateDalilReference(dalilForm.type, dalilForm.reference);
                      if (err) return;
                      const dalilObj = {
                        type: dalilForm.type,
                        reference: dalilForm.reference.trim(),
                        arabic: dalilForm.arabic.trim() || undefined,
                        translation: dalilForm.translation.trim() || undefined,
                      };
                      const dalilText = `\n\n[${dalilObj.type}: ${dalilObj.reference}${dalilObj.arabic ? ` — ${dalilObj.arabic}` : ""}${dalilObj.translation ? ` — "${dalilObj.translation}"` : ""}]`;
                      if (messageForDalil && onEditMessage) {
                        onEditMessage(messageForDalil.id, messageForDalil.text + dalilText);
                        setMessageForDalil(null);
                      } else {
                        onDalilChange?.(dalilObj);
                      }
                      setDalilForm({ type: "Quran", reference: "", arabic: "", translation: "" });
                      setShowDalilForm(false);
                    }}
                    disabled={!dalilForm.reference.trim()}
                  >
                    {messageForDalil ? "Add dalil to message" : "Add dalil"}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => setShowDalilForm(true)}
                >
                  <Paperclip className="h-3 w-3" />
                  Attach dalil (optional)
                </Button>
              )}
            </div>
          )}
          <div className="flex gap-2 items-center">
            {isRecording ? (
              <>
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-muted/50">
                  <div className="flex items-center gap-1 h-6">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded-full animate-pulse"
                        style={{
                          height: `${8 + (i % 3) * 6}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-mono text-muted-foreground tabular-nums">
                    {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={cancelVoiceRecord}
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Cancel recording"
                  aria-label="Cancel recording"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={stopVoiceAndSend}
                  disabled={sending}
                  className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  title="Send voice message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div ref={inputContainerRef} className="relative flex items-stretch gap-2 rounded-xl border border-input bg-background px-3 py-2 min-h-[40px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    {hasMediaRecorder && onSendVoice && !chatInput.trim() && (
                      <button
                        type="button"
                        onClick={startVoiceRecord}
                        className="shrink-0 self-end p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Record voice message"
                        title="Record voice message"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    )}
                    <div
                      ref={editableWrapperRef}
                      style={{
                        height: inputHeight,
                        minHeight: MIN_INPUT_HEIGHT,
                        maxHeight: MAX_INPUT_HEIGHT,
                        resize: "vertical",
                      }}
                      className="flex-1 min-w-0 overflow-hidden rounded-lg"
                    >
                      <div
                        ref={editableRef}
                        contentEditable
                        data-placeholder="Type a message... (Enter to send, Shift+Enter for list/new line)"
                        onInput={handleEditableInput}
                        onKeyDown={handleEditableKeyDown}
                        onPaste={handleEditablePaste}
                        onMouseMove={handleEditableMouseMove}
                        onMouseLeave={handleEditableMouseLeave}
                        className="w-full h-full min-h-[40px] bg-transparent text-sm outline-none overflow-y-auto py-1 [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:text-muted-foreground"
                        suppressContentEditableWarning
                      />
                    </div>
                  </div>
                  {listStylePopover && typeof document !== "undefined" && createPortal(
                    <div
                      ref={listStylePopoverRef}
                      className={cn(
                        `fixed z-[9999] rounded-lg border bg-popover text-popover-foreground shadow-md p-2 grid gap-1 ${listStylePopover.type === "bullet" && "-mt-16" }`,
                        "grid-cols-2"
                      )}
                      style={{
                        left: (() => {
                          const popoverW = listStylePopover.type === "bullet" ? 70 : 150;
                          const panelLeft = panelRef.current?.getBoundingClientRect().left ?? listStylePopover.rect.left;
                          return Math.max(8, panelLeft - popoverW);
                        })(),
                        top: listStylePopover.type === "numbered"
                          ? (inputContainerRef.current?.getBoundingClientRect().top ?? listStylePopover.rect.top) - 4
                          : listStylePopover.rect.top - 4,
                      }}
                      onMouseEnter={cancelPopoverClose}
                      onMouseLeave={(e) => {
                        const related = e.relatedTarget as Node | null;
                        if (related && editableRef.current?.contains(related)) return;
                        schedulePopoverClose();
                      }}
                    >
                      {(listStylePopover.type === "bullet" ? BULLET_STYLES : NUMBERED_STYLES).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="h-7 min-w-[28px] px-2 rounded hover:bg-accent hover:text-accent-foreground text-sm flex items-center justify-center"
                          onClick={() => applyListStyle(s)}
                          title={s.label}
                        >
                          {listStylePopover.type === "bullet" ? (s as (typeof BULLET_STYLES)[0]).char : (s as (typeof NUMBERED_STYLES)[0]).label}
                        </button>
                      ))}
                    </div>,
                    document.body
                  )}
                  <div className="flex items-center justify-between gap-2 px-1">
                    {maxLength > 0 && (
                      <span className={cn(
                        "text-[10px] tabular-nums",
                        chatInput.length > maxLength * 0.9 ? "text-amber-600" : "text-muted-foreground"
                      )}>
                        {chatInput.length}/{maxLength}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground ml-auto"
                      onClick={resetInputSize}
                      title="Reset input size"
                      aria-label="Reset input size"
                    >
                      <RotateCcw className="h-3 w-3 mr-0.5" />
                      Reset size
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  onClick={() => {
                    const md = editableRef.current ? htmlToMarkdown(editableRef.current.innerHTML) : chatInput;
                    const toSend = md.trim();
                    if (toSend && toSend.length <= maxLength) {
                      onSend(toSend);
                      if (editableRef.current) editableRef.current.innerHTML = "";
                    }
                  }}
                  disabled={sending || !chatInput.trim() || chatInput.length > maxLength}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
