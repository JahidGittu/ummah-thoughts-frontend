'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { CellSelection } from '@tiptap/pm/tables';

interface TableCellFormatButtonProps {
  editor: Editor | null;
  readOnly?: boolean;
  onOpenPopover: (rect: DOMRect) => void;
}

/** Shows a small arrow - click to open format popover. For single cell: right of cell. For multi-cell: center of selection. */
export default function TableCellFormatButton({ editor, readOnly, onOpenPopover }: TableCellFormatButtonProps) {
  const [cellRect, setCellRect] = useState<DOMRect | null>(null);
  const [isMultiCell, setIsMultiCell] = useState(false);

  useEffect(() => {
    if (!editor || readOnly) return;

    const update = () => {
      const { state } = editor;
      const { selection } = state;
      let inCell = false;
      let $pos = selection.$from;

      for (let d = $pos.depth; d > 0; d--) {
        const node = $pos.node(d);
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
          inCell = true;
          break;
        }
      }

      if (!inCell) {
        setCellRect(null);
        return;
      }

      // Multi-cell selection: position button at center of selection
      if (selection instanceof CellSelection && selection.$anchorCell.pos !== selection.$headCell.pos) {
        try {
          const anchorDom = editor.view.domAtPos(selection.$anchorCell.pos);
          const headDom = editor.view.domAtPos(selection.$headCell.pos);
          const anchorCell = anchorDom.node.nodeType === 1 ? (anchorDom.node as HTMLElement).closest?.('td, th') : null;
          const headCell = headDom.node.nodeType === 1 ? (headDom.node as HTMLElement).closest?.('td, th') : null;
          if (anchorCell && headCell) {
            const r1 = anchorCell.getBoundingClientRect();
            const r2 = headCell.getBoundingClientRect();
            const left = Math.min(r1.left, r2.left);
            const right = Math.max(r1.right, r2.right);
            const top = Math.min(r1.top, r2.top);
            const bottom = Math.max(r1.bottom, r2.bottom);
            setIsMultiCell(true);
            setCellRect(new DOMRect(left, top, right - left, bottom - top));
            return;
          }
        } catch {
          // fall through to single cell
        }
      }
      setIsMultiCell(false);

      const dom = editor.view.domAtPos(selection.from);
      const cell = dom.node.nodeType === 1 ? (dom.node as HTMLElement).closest?.('td, th') : null;
      if (cell) {
        setCellRect((cell as HTMLElement).getBoundingClientRect());
      } else {
        setCellRect(null);
      }
    };

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    update();
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor, readOnly]);

  if (!cellRect) return null;

  return (
    <button
      type="button"
      data-cell-format-btn
      onClick={() => onOpenPopover(cellRect)}
      className="fixed z-40 w-5 h-5 flex items-center justify-center rounded border border-border bg-muted/90 hover:bg-muted text-muted-foreground hover:text-foreground shadow-sm"
      style={
        isMultiCell
          ? { left: cellRect.left + cellRect.width / 2 - 10, top: cellRect.top + cellRect.height / 2 - 10 }
          : { left: cellRect.right - 22, top: cellRect.top + (cellRect.height - 20) / 2 }
      }
      title="Cell format"
    >
      <ChevronDown className="h-3 w-3" />
    </button>
  );
}
