'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client exceptions
    console.error('Flow Global Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center p-6 text-center text-[var(--text-primary)] transition-colors">
      <div className="max-w-md w-full space-y-6 bg-[var(--surface-base)] border border-[var(--border)] rounded-xl p-8 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-[rgba(217,48,37,0.12)] border border-[rgba(217,48,37,0.3)] flex items-center justify-center mx-auto text-[#EA4335]">
          <AlertTriangle className="w-7 h-7 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#EA4335] font-bold">
            HTTP 500 — Application Exception
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Execution Interrupted
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            An unhandled runtime error occurred while processing this request. Our telemetry system has logged the exception context.
          </p>
          {error.message && (
            <div className="p-2.5 rounded bg-[var(--surface-header)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)] text-left truncate">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="secondary" size="md" onClick={() => reset()} className="w-full sm:w-auto">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            <span>Attempt Recovery</span>
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] font-mono">
          Digest: {error.digest || 'ERR_UNHANDLED_EXCEPTION'}
        </div>
      </div>
    </div>
  );
}
