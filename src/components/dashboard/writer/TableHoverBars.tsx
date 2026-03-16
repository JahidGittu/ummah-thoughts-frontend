'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Plus, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Merge, SquareSplitVertical, Bold, Italic, Underline, Strikethrough, Eraser } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { CellSelection, selectionCell } from '@tiptap/pm/tables';
import TableCellFormatButton from './TableCellFormatButton';

const HIDE_DELAY_MS = 350;

/** Custom table extension commands - not in TipTap ChainedCommands type */
type TableChain = {
  moveRowUp: (idx: number, pos?: number) => { run: () => boolean };
  moveRowDown: (idx: number, pos?: number) => { run: () => boolean };
  moveColumnLeft: (idx: number, pos?: number) => { run: () => boolean };
  moveColumnRight: (idx: number, pos?: number) => { run: () => boolean };
  moveRowTo: (from: number, to: number, pos?: number) => { run: () => boolean };
  moveColumnTo: (from: number, to: number, pos?: number) => { run: () => boolean };
};
const tableChain = (e: Editor) => e.chain().focus() as unknown as TableChain;

type CellBorderValue = 'none' | 'all' | 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'outside';

const BorderIcons: Record<CellBorderValue, React.ReactNode> = {
  none: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="12" rx="0.5" strokeDasharray="2 2" />
    </svg>
  ),
  all: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="12" rx="0.5" />
    </svg>
  ),
  top: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="2" y1="2" x2="14" y2="2" />
      <line x1="2" y1="6" x2="2" y2="14" strokeDasharray="2 2" />
      <line x1="14" y1="6" x2="14" y2="14" strokeDasharray="2 2" />
      <line x1="2" y1="14" x2="14" y2="14" strokeDasharray="2 2" />
    </svg>
  ),
  bottom: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="2" y1="2" x2="14" y2="2" strokeDasharray="2 2" />
      <line x1="2" y1="6" x2="2" y2="14" strokeDasharray="2 2" />
      <line x1="14" y1="6" x2="14" y2="14" strokeDasharray="2 2" />
      <line x1="2" y1="14" x2="14" y2="14" />
    </svg>
  ),
  left: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="2" y1="2" x2="14" y2="2" strokeDasharray="2 2" />
      <line x1="2" y1="2" x2="2" y2="14" />
      <line x1="14" y1="2" x2="14" y2="14" strokeDasharray="2 2" />
      <line x1="2" y1="14" x2="14" y2="14" strokeDasharray="2 2" />
    </svg>
  ),
  right: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="2" y1="2" x2="14" y2="2" strokeDasharray="2 2" />
      <line x1="2" y1="2" x2="2" y2="14" strokeDasharray="2 2" />
      <line x1="14" y1="2" x2="14" y2="14" />
      <line x1="2" y1="14" x2="14" y2="14" strokeDasharray="2 2" />
    </svg>
  ),
  inside: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="2" y1="2" x2="14" y2="2" strokeDasharray="2 2" />
      <line x1="2" y1="2" x2="2" y2="14" strokeDasharray="2 2" />
      <line x1="14" y1="2" x2="14" y2="14" />
      <line x1="2" y1="14" x2="14" y2="14" />
    </svg>
  ),
  outside: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="2" y1="2" x2="14" y2="2" />
      <line x1="2" y1="2" x2="2" y2="14" />
      <line x1="14" y1="2" x2="14" y2="14" strokeDasharray="2 2" />
      <line x1="2" y1="14" x2="14" y2="14" strokeDasharray="2 2" />
    </svg>
  ),
};

const GripVertical = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="opacity-70">
    <circle cx="4" cy="3" r="1" />
    <circle cx="8" cy="3" r="1" />
    <circle cx="4" cy="6" r="1" />
    <circle cx="8" cy="6" r="1" />
    <circle cx="4" cy="9" r="1" />
    <circle cx="8" cy="9" r="1" />
  </svg>
);

const GripHorizontal = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="opacity-70">
    <circle cx="3" cy="4" r="1" />
    <circle cx="6" cy="4" r="1" />
    <circle cx="9" cy="4" r="1" />
    <circle cx="3" cy="8" r="1" />
    <circle cx="6" cy="8" r="1" />
    <circle cx="9" cy="8" r="1" />
  </svg>
);

interface TableHoverBarsProps {
  editor: Editor | null;
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
  readOnly?: boolean;
}

function getFocusedCellElement(editor: Editor): HTMLTableCellElement | null {
  const { state } = editor;
  const { selection } = state;
  let $pos = selection.$from;
  for (let d = $pos.depth; d > 0; d--) {
    const node = $pos.node(d);
    if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
      const dom = editor.view.domAtPos(selection.from);
      const el = dom.node.nodeType === 1 ? (dom.node as HTMLElement).closest?.('td, th') : null;
      return el as HTMLTableCellElement | null;
    }
  }
  return null;
}

export default function TableHoverBars({ editor, editorContainerRef, readOnly }: TableHoverBarsProps) {
  const [hoveredRow, setHoveredRow] = useState<{ tr: HTMLTableRowElement; table: HTMLTableElement; index: number } | null>(null);
  const [hoveredCol, setHoveredCol] = useState<{ cell: HTMLTableCellElement; table: HTMLTableElement; index: number } | null>(null);
  const [cellPopover, setCellPopover] = useState<DOMRect | null>(null);
  const [rowMoveOpen, setRowMoveOpen] = useState(false);
  const [colMoveOpen, setColMoveOpen] = useState(false);
  const [dragRow, setDragRow] = useState<{ table: HTMLTableElement; index: number; pos: number } | null>(null);
  const [dragCol, setDragCol] = useState<{ table: HTMLTableElement; index: number; pos: number } | null>(null);
  const [dropTargetRow, setDropTargetRow] = useState<number | null>(null);
  const [dropTargetCol, setDropTargetCol] = useState<number | null>(null);
  const barHoveredRef = useRef(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didDragRef = useRef(false);

  const hideBars = useCallback(() => {
    setHoveredRow(null);
    setHoveredCol(null);
  }, []);

  const scheduleHide = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      if (!barHoveredRef.current) hideBars();
      hideTimeoutRef.current = null;
    }, HIDE_DELAY_MS);
  }, [hideBars]);

  const cancelHide = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const setAlign = useCallback((align: 'left' | 'center' | 'right' | 'justify') => {
    editor?.chain().focus().setTextAlign(align).run();
    setCellPopover(null);
  }, [editor]);

  const setCellBorder = useCallback((value: CellBorderValue) => {
    editor?.chain().focus().setCellAttribute('cellBorder', value === 'all' ? null : value).run();
    setCellPopover(null);
  }, [editor]);

  type CellBorderStyleValue = 'solid' | 'double' | 'dashed' | 'dotted';
  const setCellBorderStyle = useCallback((value: CellBorderStyleValue | null) => {
    editor?.chain().focus().setCellAttribute('cellBorderStyle', value).run();
    setCellPopover(null);
  }, [editor]);

  const setCellBorderWidth = useCallback((value: '1' | '2' | '3' | null) => {
    editor?.chain().focus().setCellAttribute('cellBorderWidth', value).run();
    setCellPopover(null);
  }, [editor]);

  const isMultiCellSelection = editor?.state.selection instanceof CellSelection &&
    editor.state.selection.$anchorCell.pos !== editor.state.selection.$headCell.pos;

  const handleMergeCells = useCallback(() => {
    editor?.chain().focus().mergeCells().run();
    setCellPopover(null);
  }, [editor]);

  const handleMergeAndCenter = useCallback(() => {
    editor?.chain().focus().mergeCells().setTextAlign('center').run();
    setCellPopover(null);
  }, [editor]);

  const isMergedCell = (() => {
    if (!editor) return false;
    const { state } = editor;
    const { selection } = state;
    try {
      const $cell = selectionCell(state);
      if (!$cell?.nodeAfter) return false;
      const { colspan = 1, rowspan = 1 } = $cell.nodeAfter.attrs;
      return colspan > 1 || rowspan > 1;
    } catch {
      return false;
    }
  })();

  const handleSplitCell = useCallback(() => {
    editor?.chain().focus().splitCell().run();
    setCellPopover(null);
  }, [editor]);

  const handleClearFormat = useCallback(() => {
    editor?.chain().focus().unsetAllMarks().run();
    setCellPopover(null);
  }, [editor]);

  useEffect(() => {
    if (!editor || readOnly) return;
    const update = () => {
      if (getFocusedCellElement(editor)) hideBars();
    };
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    update();
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor, readOnly, hideBars]);

  useEffect(() => {
    if (!editorContainerRef.current || !editor || readOnly) return;

    const container = editorContainerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const table = target.closest('table');
      const tableWrapper = target.closest('.tableWrapper');

      if (!table || !tableWrapper) {
        scheduleHide();
        return;
      }

      const tr = target.closest('tr');
      const cell = target.closest('td, th');

      if (!tr || !cell) {
        scheduleHide();
        return;
      }

      const focusedCell = getFocusedCellElement(editor);
      if (focusedCell && cell === focusedCell) {
        hideBars();
        return;
      }

      cancelHide();
      const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(tr);
      const cells = Array.from(tr.querySelectorAll('td, th'));
      const colIndex = cells.indexOf(cell as HTMLTableCellElement);
      setHoveredRow({ tr, table, index: rowIndex });
      setHoveredCol({ cell: cell as HTMLTableCellElement, table, index: colIndex });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement;
      if (!related || !container.contains(related)) {
        scheduleHide();
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelHide();
    };
  }, [editor, editorContainerRef, readOnly, scheduleHide, cancelHide, hideBars]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cell-format-btn]')) return;
      if (cellPopover && popoverRef.current && !popoverRef.current.contains(target)) {
        setCellPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cellPopover]);

  useEffect(() => {
    if (!dragRow && !dragCol) return;
    const handleMouseMove = (e: MouseEvent) => {
      const table = dragRow?.table ?? dragCol?.table;
      if (!table) return;
      const tableRect = table.getBoundingClientRect();
      if (dragRow) {
        const rows = Array.from(table.querySelectorAll('tr'));
        let idx: number;
        if (e.clientY < tableRect.top) idx = 0;
        else if (e.clientY >= tableRect.bottom) idx = rows.length;
        else {
          idx = 0;
          for (let i = 0; i < rows.length; i++) {
            const r = rows[i].getBoundingClientRect();
            if (e.clientY < r.top + r.height / 2) {
              idx = i;
              break;
            }
            idx = i + 1;
          }
        }
        setDropTargetRow(Math.min(idx, rows.length));
      }
      if (dragCol) {
        const firstRow = table.querySelector('tr');
        const cells = firstRow ? Array.from(firstRow.querySelectorAll('td, th')) : [];
        let idx: number;
        if (e.clientX < tableRect.left) idx = 0;
        else if (e.clientX >= tableRect.right) idx = cells.length;
        else {
          idx = 0;
          for (let i = 0; i < cells.length; i++) {
            const r = cells[i].getBoundingClientRect();
            if (e.clientX < r.left + r.width / 2) {
              idx = i;
              break;
            }
            idx = i + 1;
          }
        }
        setDropTargetCol(Math.min(idx, cells.length));
      }
    };
    const handleMouseUp = () => {
      if (dragRow && dropTargetRow !== null && dropTargetRow !== dragRow.index && editor) {
        didDragRef.current = true;
        const rows = Array.from(dragRow.table.querySelectorAll('tr'));
        const toIndex = Math.min(dropTargetRow, rows.length - 1);
        if (toIndex >= 0) {
          const cell = dragRow.table.querySelector('tr td, tr th') as HTMLElement | null;
          const pos = cell ? (() => { try { return editor.view.posAtDOM(cell, 0); } catch { return undefined; } })() : undefined;
          tableChain(editor).moveRowTo(dragRow.index, toIndex, pos).run();
        }
      }
      if (dragCol && dropTargetCol !== null && dropTargetCol !== dragCol.index && editor) {
        didDragRef.current = true;
        const firstRow = dragCol.table.querySelector('tr');
        const cells = firstRow ? Array.from(firstRow.querySelectorAll('td, th')) : [];
        const toIndex = Math.min(dropTargetCol, cells.length - 1);
        if (toIndex >= 0) {
          const firstCell = dragCol.table.querySelector('tr td, tr th') as HTMLElement | null;
          const pos = firstCell ? (() => { try { return editor.view.posAtDOM(firstCell, 0); } catch { return undefined; } })() : undefined;
          tableChain(editor).moveColumnTo(dragCol.index, toIndex, pos).run();
        }
      }
      setDragRow(null);
      setDragCol(null);
      setDropTargetRow(null);
      setDropTargetCol(null);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = dragRow ? 'grabbing' : dragCol ? 'grabbing' : '';
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [dragRow, dragCol, dropTargetRow, dropTargetCol, editor]);

  const barHandlers = {
    onMouseEnter: () => { cancelHide(); barHoveredRef.current = true; },
    onMouseLeave: () => { barHoveredRef.current = false; scheduleHide(); },
  };

  if (!editor || readOnly) return null;

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };
  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const getCellPos = (cell: HTMLElement) => {
    try {
      return editor.view.posAtDOM(cell, 0);
    } catch {
      return undefined;
    }
  };

  const moveRowUp = () => {
    const cell = hoveredRow?.tr.querySelector('td, th') as HTMLElement | undefined;
    const pos = cell ? getCellPos(cell) : undefined;
    tableChain(editor).moveRowUp(hoveredRow!.index, pos).run();
  };
  const moveRowDown = () => {
    const cell = hoveredRow?.tr.querySelector('td, th') as HTMLElement | undefined;
    const pos = cell ? getCellPos(cell) : undefined;
    tableChain(editor).moveRowDown(hoveredRow!.index, pos).run();
  };
  const moveColumnLeft = () => {
    const pos = hoveredCol?.cell ? getCellPos(hoveredCol.cell) : undefined;
    tableChain(editor).moveColumnLeft(hoveredCol!.index, pos).run();
  };
  const moveColumnRight = () => {
    const pos = hoveredCol?.cell ? getCellPos(hoveredCol.cell) : undefined;
    tableChain(editor).moveColumnRight(hoveredCol!.index, pos).run();
  };

  return (
    <>
      {/* Drop indicator - highlight whole row */}
      {dragRow && dropTargetRow !== null && dragRow.table && (
        (() => {
          const rows = Array.from(dragRow.table.querySelectorAll('tr'));
          const targetRow = rows[Math.min(dropTargetRow, rows.length - 1)];
          if (!targetRow) return null;
          const rect = targetRow.getBoundingClientRect();
          const tableRect = dragRow.table.getBoundingClientRect();
          return (
            <div
              className="fixed z-50 pointer-events-none bg-primary/20 border-2 border-primary rounded"
              style={{
                left: tableRect.left,
                top: rect.top,
                width: tableRect.width,
                height: rect.height,
              }}
            />
          );
        })()
      )}
      {/* Drop indicator - highlight whole column */}
      {dragCol && dropTargetCol !== null && dragCol.table && (
        (() => {
          const firstRow = dragCol.table.querySelector('tr');
          const cells = firstRow ? Array.from(firstRow.querySelectorAll('td, th')) : [];
          const targetCell = cells[Math.min(dropTargetCol, cells.length - 1)];
          if (!targetCell) return null;
          const cellRect = (targetCell as HTMLElement).getBoundingClientRect();
          const tableRect = dragCol.table.getBoundingClientRect();
          return (
            <div
              className="fixed z-50 pointer-events-none bg-primary/20 border-2 border-primary rounded"
              style={{
                left: cellRect.left,
                top: tableRect.top,
                width: cellRect.width,
                height: tableRect.height,
              }}
            />
          );
        })()
      )}
      {/* Row bar - grip (move up/down) + plus, w-fit */}
      {hoveredRow && (
        <div
          {...barHandlers}
          className="fixed z-40 flex items-center gap-0.5 px-1 py-0.5 rounded border border-border bg-muted/95 shadow-md w-fit"
          style={{
            left: hoveredRow.tr.getBoundingClientRect().left - 28,
            top: hoveredRow.tr.getBoundingClientRect().top + (hoveredRow.tr.getBoundingClientRect().height - 24) / 2,
          }}
        >
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                if (e.button !== 0) return;
                const cell = hoveredRow.tr.querySelector('td, th') as HTMLElement | undefined;
                const pos = cell ? (() => { try { return editor.view.posAtDOM(cell, 0); } catch { return undefined; } })() : undefined;
                setDragRow({ table: hoveredRow.table, index: hoveredRow.index, pos: pos ?? 0 });
                setDropTargetRow(hoveredRow.index);
                didDragRef.current = false;
              }}
              onClick={() => {
                if (didDragRef.current) return;
                setRowMoveOpen((v) => !v);
              }}
              className="p-0.5 rounded hover:bg-muted-foreground/20 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              title="Drag to move row or click for menu"
            >
              <GripVertical />
            </button>
            {rowMoveOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setRowMoveOpen(false)} aria-hidden />
                <div className="absolute left-full ml-0.5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-0.5 p-0.5 rounded border border-border bg-muted/95 shadow-md">
                  <button
                    type="button"
                    onClick={() => { moveRowUp(); setRowMoveOpen(false); }}
                    disabled={hoveredRow.index === 0}
                    className="p-0.5 rounded hover:bg-muted-foreground/20 disabled:opacity-30 text-muted-foreground"
                    title="Move up"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { moveRowDown(); setRowMoveOpen(false); }}
                    className="p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground"
                    title="Move down"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={addRowAfter}
            className="p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground"
            title="Add row below"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Column bar - grip (move left/right) + plus, w-fit centered at top of cell */}
      {hoveredCol && (
        <div
          {...barHandlers}
          className="fixed z-40 flex items-center gap-0.5 px-1 py-0.5 rounded border border-border bg-muted/95 shadow-md w-fit"
          style={{
            left: hoveredCol.cell.getBoundingClientRect().left + (hoveredCol.cell.getBoundingClientRect().width - 28) / 2,
            top: hoveredCol.cell.getBoundingClientRect().top - 24,
          }}
        >
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                if (e.button !== 0) return;
                const pos = hoveredCol.cell ? (() => { try { return editor.view.posAtDOM(hoveredCol.cell, 0); } catch { return undefined; } })() : undefined;
                setDragCol({ table: hoveredCol.table, index: hoveredCol.index, pos: pos ?? 0 });
                setDropTargetCol(hoveredCol.index);
                didDragRef.current = false;
              }}
              onClick={() => {
                if (didDragRef.current) return;
                setColMoveOpen((v) => !v);
              }}
              className="p-0.5 rounded hover:bg-muted-foreground/20 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              title="Drag to move column or click for menu"
            >
              <GripHorizontal />
            </button>
            {colMoveOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setColMoveOpen(false)} aria-hidden />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-0.5 z-50 flex gap-0.5 p-0.5 rounded border border-border bg-muted/95 shadow-md">
                  <button
                    type="button"
                    onClick={() => { moveColumnLeft(); setColMoveOpen(false); }}
                    disabled={hoveredCol.index === 0}
                    className="p-0.5 rounded hover:bg-muted-foreground/20 disabled:opacity-30 text-muted-foreground"
                    title="Move left"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { moveColumnRight(); setColMoveOpen(false); }}
                    className="p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground"
                    title="Move right"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={addColumnAfter}
            className="p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground"
            title="Add column right"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Cell format button - arrow at right of focused cell */}
      <TableCellFormatButton
        editor={editor}
        readOnly={readOnly}
        onOpenPopover={(rect) => setCellPopover(rect)}
      />

      {/* Cell format popover - merge (multi-cell), alignment, border options */}
      {cellPopover && (() => {
        const POPOVER_WIDTH = 240;
        const POPOVER_EST_HEIGHT = 380;
        const GAP = 4;
        const PADDING = 8;
        const spaceBelow = typeof window !== 'undefined' ? window.innerHeight - cellPopover.bottom - GAP : Infinity;
        const spaceAbove = typeof window !== 'undefined' ? cellPopover.top - GAP : Infinity;
        const openAbove = spaceBelow < POPOVER_EST_HEIGHT && spaceAbove > spaceBelow;
        let left = cellPopover.right - POPOVER_WIDTH;
        if (typeof window !== 'undefined') {
          left = Math.max(PADDING, Math.min(left, window.innerWidth - POPOVER_WIDTH - PADDING));
        }
        const top = openAbove
          ? Math.max(PADDING, cellPopover.top - POPOVER_EST_HEIGHT - GAP)
          : cellPopover.bottom + GAP;
        return (
        <div
          ref={popoverRef}
          className="fixed z-50 p-3 rounded-lg border border-border bg-card shadow-xl min-w-[240px] max-h-[80vh] overflow-y-auto"
          style={{ left, top }}
        >
          {/* Text format: Bold, Italic, Underline, Strike */}
          <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Text</p>
          <div className="flex gap-0.5 mb-3">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }}
              className={`p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground ${editor?.isActive('bold') ? 'bg-muted' : ''}`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }}
              className={`p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground ${editor?.isActive('italic') ? 'bg-muted' : ''}`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }}
              className={`p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground ${editor?.isActive('underline') ? 'bg-muted' : ''}`}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleStrike().run(); }}
              className={`p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground ${editor?.isActive('strike') ? 'bg-muted' : ''}`}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleClearFormat(); }}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Clear formatting"
            >
              <Eraser className="h-4 w-4" />
            </button>
          </div>
          {(isMultiCellSelection || isMergedCell) && (
            <>
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                {isMultiCellSelection ? 'Merge cells' : 'Unmerge'}
              </p>
              <div className="flex gap-1 mb-3">
                {isMultiCellSelection && (
                  <>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleMergeCells(); }}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-xs rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Merge selected cells"
                    >
                      <Merge className="h-3.5 w-3.5" />
                      Merge
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleMergeAndCenter(); }}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-xs rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Merge and center"
                    >
                      <Merge className="h-3.5 w-3.5" />
                      <AlignCenter className="h-3.5 w-3.5" />
                      Merge & Center
                    </button>
                  </>
                )}
                {isMergedCell && (
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSplitCell(); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-xs rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Unmerge / Split cell"
                  >
                    <SquareSplitVertical className="h-3.5 w-3.5" />
                    Unmerge
                  </button>
                )}
              </div>
            </>
          )}
          <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Alignment</p>
          <div className="flex gap-0.5 mb-3">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setAlign('left'); }}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Align left"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setAlign('center'); }}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Align center"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setAlign('right'); }}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Align right"
            >
              <AlignRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setAlign('justify'); }}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Border</p>
          <div className="flex flex-wrap gap-0.5 mb-3">
            {(['none', 'all', 'top', 'bottom', 'left', 'right', 'inside', 'outside'] as CellBorderValue[]).map((v) => (
              <button
                key={v}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setCellBorder(v);
                }}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title={v.charAt(0).toUpperCase() + v.slice(1)}
              >
                {BorderIcons[v]}
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Border style</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {(['solid', 'double', 'dashed', 'dotted'] as CellBorderStyleValue[]).map((v) => (
              <button
                key={v}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setCellBorderStyle(v);
                }}
                className={`px-2 py-1.5 text-xs rounded hover:bg-muted text-muted-foreground hover:text-foreground border-2 border-border
                  ${v === 'solid' ? 'border-solid' : ''}
                  ${v === 'double' ? 'border-double' : ''}
                  ${v === 'dashed' ? 'border-dashed' : ''}
                  ${v === 'dotted' ? 'border-dotted' : ''}`}
                title={v.charAt(0).toUpperCase() + v.slice(1)}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Border width</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setCellBorderWidth('1');
              }}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              title="1px"
            >
              <span className="text-xs font-medium">1</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setCellBorderWidth('2');
              }}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground border-2 border-border"
              title="2px"
            >
              <span className="text-xs font-medium">2</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setCellBorderWidth('3');
              }}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground border-[3px] border-border"
              title="3px"
            >
              <span className="text-xs font-medium">3</span>
            </button>
          </div>
        </div>
        );
      })()}
    </>
  );
}
