'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { X, Command } from 'lucide-react';

export function ShortcutsModal() {
  const { isShortcutsOpen, setIsShortcutsOpen } = useFlow();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: '⌘ K / Ctrl K', desc: 'Open universal command palette and search' },
    { key: 'C', desc: 'Create new task, project, or resource' },
    { key: 'G then D', desc: 'Go to Company Health Overview Dashboard' },
    { key: 'G then P', desc: 'Go to Projects center' },
    { key: 'G then T', desc: 'Go to Universal Task engine' },
    { key: 'G then S', desc: 'Go to Organization Settings' },
    { key: '?', desc: 'Show this keyboard shortcuts cheat sheet' },
    { key: 'Esc', desc: 'Close any active modal or command palette' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsShortcutsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[var(--surface-base)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-header)]">
          <div className="flex items-center space-x-2">
            <Command className="w-4 h-4 text-[#1A73E8]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</span>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-md hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)] last:border-none text-xs">
              <span className="text-[var(--text-secondary)]">{s.desc}</span>
              <kbd className="px-2 py-1 bg-[var(--surface-elevated)] border border-[var(--border)] rounded text-[11px] font-mono font-semibold text-[#1A73E8] shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-header)] text-[11px] text-[var(--text-secondary)] text-center">
          Flow is built for keyboard-first navigation and rapid execution.
        </div>
      </div>
    </div>
  );
}
