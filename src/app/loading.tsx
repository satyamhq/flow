'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center p-6 text-[var(--text-primary)]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[#1A73E8] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[#1A73E8]">
            F
          </div>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold text-[var(--text-primary)]">Loading Flow System</p>
          <p className="text-[11px] text-[var(--text-secondary)] font-mono">Synchronizing telemetry...</p>
        </div>
      </div>
    </div>
  );
}
