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
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsShortcutsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#0B0F17] border border-[#26334D] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B] bg-[#0E1524]">
          <div className="flex items-center space-x-2">
            <Command className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-slate-100">Keyboard Shortcuts</span>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#1E293B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[#1E293B]/40 last:border-none text-xs">
              <span className="text-slate-300">{s.desc}</span>
              <kbd className="px-2 py-1 bg-[#131C2E] border border-[#24334E] rounded text-[11px] font-mono font-semibold text-blue-300 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-[#1E293B] bg-[#0A0D14] text-[11px] text-slate-400 text-center">
          Flow is built for keyboard-first navigation and rapid execution.
        </div>
      </div>
    </div>
  );
}
