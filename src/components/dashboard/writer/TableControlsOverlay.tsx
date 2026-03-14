'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import type { Editor } from '@tiptap/core';

interface TableControlsOverlayProps {
  editor: Editor | null;
  readOnly?: boolean;
}

export default function TableControlsOverlay({ editor, readOnly }: TableControlsOverlayProps) {
  const [inTable, setInTable] = useState(false);
  const [tableRect, setTableRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!editor || readOnly) return;

    const updateTableState = () => {
      const { state } = editor;
      const { selection } = state;
      let tableActive = false;
      let tableStart = -1;

      state.doc.descendants((node, pos) => {
        if (node.type.name === 'table') {
          const $from = state.doc.resolve(pos);
          const selectionInTable = selection.from >= pos && selection.to <= pos + node.nodeSize;
          if (selectionInTable) {
            tableActive = true;
            tableStart = pos;
          }
        }
      });

      setInTable(tableActive);

      if (tableActive) {
        const dom = editor.view.domAtPos(tableStart);
        const tableEl = dom.node.nodeType === 1 ? (dom.node as HTMLElement).closest?.('table') : null;
        if (tableEl) {
          setTableRect(tableEl.getBoundingClientRect());
        } else {
          setTableRect(null);
        }
      } else {
        setTableRect(null);
      }

    };

    editor.on('selectionUpdate', updateTableState);
    editor.on('transaction', updateTableState);
    updateTableState();

    return () => {
      editor.off('selectionUpdate', updateTableState);
      editor.off('transaction', updateTableState);
    };
  }, [editor, readOnly]);

  if (!editor || readOnly || !inTable || !tableRect) return null;

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };
  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };
  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };
  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };
  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };
  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };
  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };
  const setAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    editor.chain().focus().setTextAlign(align).run();
  };

  return (
    <>
      {/* Table toolbar - appears above table when in table */}
      <div
        className="fixed z-40 flex items-center gap-0.5 px-2 py-1 rounded-lg border border-border bg-card shadow-lg"
        style={{
          left: tableRect.left,
          top: tableRect.top - 44,
        }}
      >
        <div className="flex items-center gap-0.5 pr-2 border-r border-border">
          <button
            type="button"
            onClick={addRowBefore}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Add row above"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={addRowAfter}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Add row below"
          >
            <Plus className="h-3.5 w-3.5 rotate-180" />
          </button>
        </div>
        <div className="flex items-center gap-0.5 pr-2 border-r border-border">
          <button
            type="button"
            onClick={addColumnBefore}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Add column left"
          >
            <Plus className="h-3.5 w-3.5 -rotate-90" />
          </button>
          <button
            type="button"
            onClick={addColumnAfter}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Add column right"
          >
            <Plus className="h-3.5 w-3.5 rotate-90" />
          </button>
        </div>
        <div className="flex items-center gap-0.5 pr-2 border-r border-border">
          <button
            type="button"
            onClick={() => setAlign('left')}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Align left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlign('center')}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Align center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlign('right')}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Align right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlign('justify')}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Justify"
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={deleteRow}
          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          title="Delete row"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={deleteColumn}
          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          title="Delete column"
        >
          <Trash2 className="h-3.5 w-3.5 rotate-90" />
        </button>
        <button
          type="button"
          onClick={deleteTable}
          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive ml-1"
          title="Delete table"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </>
  );
}
