'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Compass, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center p-6 text-center text-[var(--text-primary)] transition-colors">
      <div className="max-w-md w-full space-y-6 bg-[var(--surface-base)] border border-[var(--border)] rounded-xl p-8 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-[rgba(26,115,232,0.12)] border border-[rgba(26,115,232,0.3)] flex items-center justify-center mx-auto text-[#1A73E8]">
          <Compass className="w-7 h-7 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#1A73E8] font-bold">
            HTTP 404 — Resource Not Found
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Page Not Located
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            The resource, organization workspace, or route you are attempting to reach does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              <span>Public Home</span>
            </Button>
          </Link>
          <Link href="/app" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Enter Workspace</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] font-mono">
          Flow Core Routing Engine v2.4 • Error Ref: ERR_ROUTE_NOT_FOUND
        </div>
      </div>
    </div>
  );
}
