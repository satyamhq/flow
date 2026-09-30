'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrgError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Workspace Route Error:', error);
  }, [error]);

  return (
    <div className="p-8 max-w-lg mx-auto bg-[var(--surface-base)] border border-[var(--border)] rounded-xl shadow-lg text-center space-y-5 my-12">
      <div className="w-12 h-12 rounded-full bg-[rgba(217,48,37,0.12)] border border-[rgba(217,48,37,0.3)] flex items-center justify-center mx-auto text-[#EA4335]">
        <AlertCircle className="w-6 h-6 stroke-[2]" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Module Render Interrupted</h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          An error occurred while loading this module. Your data remains safe and synchronized with PostgreSQL.
        </p>
        {error.message && (
          <p className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--surface-elevated)] p-2 rounded mt-2 truncate">
            {error.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Button variant="secondary" size="md" onClick={() => reset()}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>Reload Module</span>
        </Button>
        <Link href="/app">
          <Button variant="primary" size="md">
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
            <span>Overview</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
