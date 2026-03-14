'use client';

import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';

const MAX_ROWS = 10;
const MAX_COLS = 10;

export interface TableInsertSettings {
  rows: number;
  cols: number;
  withHeaderRow: boolean;
  borderColor: string;
  borderWidth: number;
  /** Resolved hex/rgb for inline styles when borderColor uses CSS var() */
  borderColorResolved?: string;
}

const BORDER_COLORS = [
  { label: 'Default', value: 'hsl(var(--border))', hex: '#e5e7eb' },
  { label: 'Primary', value: 'hsl(var(--primary))', hex: '#064e3b' },
  { label: 'Gray', value: '#6b7280', hex: '#6b7280' },
  { label: 'Black', value: '#1f2937', hex: '#1f2937' },
];

const DEFAULT_SETTINGS: TableInsertSettings = {
  rows: 3,
  cols: 3,
  withHeaderRow: true,
  borderColor: BORDER_COLORS[0].value,
  borderWidth: 1,
};

export interface TableInsertModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (settings: TableInsertSettings) => void;
}

export default function TableInsertModal({ open, onClose, onInsert }: TableInsertModalProps) {
  const [rows, setRows] = useState(DEFAULT_SETTINGS.rows);
  const [cols, setCols] = useState(DEFAULT_SETTINGS.cols);
  const [withHeaderRow, setWithHeaderRow] = useState(DEFAULT_SETTINGS.withHeaderRow);
  const [borderColor, setBorderColor] = useState(DEFAULT_SETTINGS.borderColor);
  const [borderWidth, setBorderWidth] = useState(DEFAULT_SETTINGS.borderWidth);
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);

  const handleGridClick = useCallback((r: number, c: number) => {
    setRows(r + 1);
    setCols(c + 1);
  }, []);

  const getResolvedColor = useCallback((color: string) => {
    if (color.startsWith('#')) return color;
    const preset = BORDER_COLORS.find((p) => p.value === color);
    return preset?.hex ?? color;
  }, []);

  const handleInsert = useCallback(() => {
    onInsert({
      rows,
      cols,
      withHeaderRow,
      borderColor,
      borderWidth,
      borderColorResolved: getResolvedColor(borderColor),
    });
    onClose();
    setRows(DEFAULT_SETTINGS.rows);
    setCols(DEFAULT_SETTINGS.cols);
    setWithHeaderRow(DEFAULT_SETTINGS.withHeaderRow);
    setBorderColor(DEFAULT_SETTINGS.borderColor);
    setBorderWidth(DEFAULT_SETTINGS.borderWidth);
  }, [rows, cols, withHeaderRow, borderColor, borderWidth, getResolvedColor, onInsert, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Insert Table</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Grid selector */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Select size (click to choose)
            </label>
            <div className="inline-grid gap-0.5 p-1 bg-muted/50 rounded-lg" style={{ gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)` }}>
              {Array.from({ length: MAX_ROWS }, (_, r) =>
                Array.from({ length: MAX_COLS }, (_, c) => (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onMouseEnter={() => setHoverCell({ r, c })}
                    onMouseLeave={() => setHoverCell(null)}
                    onClick={() => handleGridClick(r, c)}
                    className={`w-6 h-6 rounded border transition-all ${
                      r < rows && c < cols
                        ? 'bg-primary border-primary'
                        : (hoverCell && r <= hoverCell.r && c <= hoverCell.c)
                          ? 'bg-primary/30 border-primary/50'
                          : 'bg-background border-border hover:border-primary/50'
                    }`}
                    title={`${r + 1} × ${c + 1}`}
                  />
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {rows} × {cols} table
            </p>
          </div>

          {/* Manual inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Rows</label>
              <input
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e) => setRows(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Columns</label>
              <input
                type="number"
                min={1}
                max={20}
                value={cols}
                onChange={(e) => setCols(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Header row toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={withHeaderRow}
              onChange={(e) => setWithHeaderRow(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
            <span className="text-sm text-foreground">Header row</span>
          </label>

          {/* Table settings */}
          <div className="space-y-3 pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground">Table settings</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Border color</label>
                <div className="flex flex-wrap gap-1.5">
                  {BORDER_COLORS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBorderColor(opt.value)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        borderColor === opt.value ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: opt.hex }}
                      title={opt.label}
                    />
                  ))}
                  <input
                    type="color"
                    value={borderColor.startsWith('#') ? borderColor : '#e5e7eb'}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-background p-0"
                    title="Custom color"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Border width (px)</label>
                <select
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {[0, 1, 2, 3].map((w) => (
                    <option key={w} value={w}>
                      {w === 0 ? 'None' : `${w}px`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
}
