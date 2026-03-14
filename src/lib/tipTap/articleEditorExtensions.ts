'use client';

import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { moveTableRow, moveTableColumn } from '@tiptap/pm/tables';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

const INDENT_PX = 40;
const MAX_INDENT = 5;

const Indent = Extension.create({
  name: 'indent',
  addOptions() {
    return { types: ['paragraph', 'heading', 'blockquote'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (el) => parseInt(el.getAttribute('data-indent') ?? '0', 10) || 0,
            renderHTML: (attrs) => (attrs.indent ? { 'data-indent': attrs.indent, style: `padding-left: ${attrs.indent * INDENT_PX}px` } : {}),
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      indent: () => ({ state, chain }: { state: EditorState; chain: () => { focus: () => { updateAttributes: (t: string, a: object) => { run: () => boolean } } } }) => {
        const { $from } = state.selection;
        const node = $from.parent;
        const typeName = node.type.name;
        if (!this.options.types.includes(typeName)) return false;
        const indent = (node.attrs.indent ?? 0) as number;
        if (indent >= MAX_INDENT) return false;
        return chain().focus().updateAttributes(typeName, { indent: indent + 1 }).run();
      },
      outdent: () => ({ state, chain }: { state: EditorState; chain: () => { focus: () => { updateAttributes: (t: string, a: object) => { run: () => boolean } } } }) => {
        const { $from } = state.selection;
        const node = $from.parent;
        const typeName = node.type.name;
        if (!this.options.types.includes(typeName)) return false;
        const indent = (node.attrs.indent ?? 0) as number;
        if (indent <= 0) return false;
        return chain().focus().updateAttributes(typeName, { indent: indent - 1 }).run();
      },
    } as Record<string, unknown>;
  },
});

export function getArticleEditorExtensions(placeholder = 'Start writing...') {
  return [
    Indent,
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline cursor-pointer',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg my-4',
      },
    }),
TextAlign.configure({
  types: ['heading', 'paragraph', 'blockquote', 'tableCell', 'tableHeader'],
    }),
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: { class: 'px-1 rounded' },
    }),
    Underline,
    Superscript,
    Subscript,
    Placeholder.configure({ placeholder }),
    Table.extend({
      addCommands() {
        return {
          ...this.parent?.(),
          moveRowUp: (rowIndex: number, pos?: number) => ({ state, dispatch }: { state: EditorState; dispatch: (tr: Transaction) => void }) => {
            if (rowIndex <= 0) return false;
            return moveTableRow({ from: rowIndex, to: rowIndex - 1, pos: pos ?? state.selection.from })(state, dispatch);
          },
          moveRowDown: (rowIndex: number, pos?: number) => ({ state, dispatch }: { state: EditorState; dispatch: (tr: Transaction) => void }) => {
            const p = pos ?? state.selection.from;
            const $pos = state.doc.resolve(p);
            let table = null;
            for (let d = $pos.depth; d > 0; d--) {
              const node = $pos.node(d);
              if (node.type.name === 'table') {
                table = node;
                break;
              }
            }
            const rowCount = table?.childCount ?? 0;
            if (rowIndex >= rowCount - 1) return false;
            return moveTableRow({ from: rowIndex, to: rowIndex + 1, pos: p })(state, dispatch);
          },
          moveColumnLeft: (colIndex: number, pos?: number) => ({ state, dispatch }: { state: EditorState; dispatch: (tr: Transaction) => void }) => {
            if (colIndex <= 0) return false;
            return moveTableColumn({ from: colIndex, to: colIndex - 1, pos: pos ?? state.selection.from })(state, dispatch);
          },
          moveColumnRight: (colIndex: number, pos?: number) => ({ state, dispatch }: { state: EditorState; dispatch: (tr: Transaction) => void }) => {
            const p = pos ?? state.selection.from;
            const $pos = state.doc.resolve(p);
            let table = null;
            for (let d = $pos.depth; d > 0; d--) {
              const node = $pos.node(d);
              if (node.type.name === 'table') {
                table = node;
                break;
              }
            }
            const colCount = table?.firstChild?.childCount ?? 0;
            if (colIndex >= colCount - 1) return false;
            return moveTableColumn({ from: colIndex, to: colIndex + 1, pos: p })(state, dispatch);
          },
          moveRowTo: (fromIndex: number, toIndex: number, pos?: number) => ({ state, dispatch }: { state: EditorState; dispatch: (tr: Transaction) => void }) => {
            if (fromIndex === toIndex) return false;
            return moveTableRow({ from: fromIndex, to: toIndex, pos: pos ?? state.selection.from })(state, dispatch);
          },
          moveColumnTo: (fromIndex: number, toIndex: number, pos?: number) => ({ state, dispatch }: { state: EditorState; dispatch: (tr: Transaction) => void }) => {
            if (fromIndex === toIndex) return false;
            return moveTableColumn({ from: fromIndex, to: toIndex, pos: pos ?? state.selection.from })(state, dispatch);
          },
        };
      },
    }).configure({
      resizable: true,
      handleWidth: 10,
      HTMLAttributes: { class: 'border-collapse border border-border my-4 w-full' },
    }),
    TableRow,
    TableHeader.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          cellBorder: {
            default: null,
            parseHTML: (el) => el.getAttribute('data-cell-border'),
            renderHTML: (attrs) => attrs.cellBorder ? { 'data-cell-border': attrs.cellBorder } : {},
          },
          cellBorderStyle: {
            default: null,
            parseHTML: (el) => el.getAttribute('data-cell-border-style'),
            renderHTML: (attrs) => attrs.cellBorderStyle ? { 'data-cell-border-style': attrs.cellBorderStyle } : {},
          },
          cellBorderWidth: {
            default: null,
            parseHTML: (el) => el.getAttribute('data-cell-border-width'),
            renderHTML: (attrs) => attrs.cellBorderWidth ? { 'data-cell-border-width': attrs.cellBorderWidth } : {},
          },
        };
      },
    }).configure({
      HTMLAttributes: { class: 'border border-border bg-muted font-bold p-2 text-left' },
    }),
    TableCell.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          cellBorder: {
            default: null,
            parseHTML: (el) => el.getAttribute('data-cell-border'),
            renderHTML: (attrs) => attrs.cellBorder ? { 'data-cell-border': attrs.cellBorder } : {},
          },
          cellBorderStyle: {
            default: null,
            parseHTML: (el) => el.getAttribute('data-cell-border-style'),
            renderHTML: (attrs) => attrs.cellBorderStyle ? { 'data-cell-border-style': attrs.cellBorderStyle } : {},
          },
          cellBorderWidth: {
            default: null,
            parseHTML: (el) => el.getAttribute('data-cell-border-width'),
            renderHTML: (attrs) => attrs.cellBorderWidth ? { 'data-cell-border-width': attrs.cellBorderWidth } : {},
          },
        };
      },
    }).configure({
      HTMLAttributes: { class: 'border border-border p-2' },
    }),
    TaskList.configure({
      HTMLAttributes: { class: 'list-none pl-0 my-3' },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: { class: 'flex items-start gap-2 my-1' },
    }),
  ];
}
