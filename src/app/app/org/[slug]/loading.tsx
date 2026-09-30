'use client';

import React from 'react';

export default function OrgLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse p-2">
      {/* Header skeleton */}
      <div className="space-y-3 pb-4 border-b border-[var(--border-subtle)]">
        <div className="h-4 w-32 bg-[var(--surface-elevated)] rounded" />
        <div className="h-7 w-64 bg-[var(--surface-elevated)] rounded" />
        <div className="h-3 w-96 bg-[var(--surface-elevated)] rounded" />
      </div>

      {/* Cards Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-[var(--surface-base)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <div className="h-3 w-20 bg-[var(--surface-elevated)] rounded" />
            <div className="h-7 w-28 bg-[var(--surface-elevated)] rounded" />
          </div>
        ))}
      </div>

      {/* Content table skeleton */}
      <div className="h-72 bg-[var(--surface-base)] border border-[var(--border)] rounded-lg p-6 space-y-4">
        <div className="h-4 w-40 bg-[var(--surface-elevated)] rounded" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[var(--surface-elevated)] rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
