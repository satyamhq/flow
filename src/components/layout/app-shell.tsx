'use client';

import React from 'react';
import { Topbar } from '@/components/navigation/topbar';
import { Sidebar } from '@/components/navigation/sidebar';
import { PageContainer } from './page-container';

export interface AppShellProps {
  children: React.ReactNode;
  maxWidth?: 'default' | 'narrow' | 'wide' | 'full';
  noPadding?: boolean;
}

/**
 * AppShell Primitive
 * Master layout container providing consistent:
 * TopBar -> Sidebar -> Content Gutter -> Main Content -> Right Gutter
 */
export function AppShell({
  children,
  maxWidth = 'default',
  noPadding = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col text-[var(--text-primary)] transition-colors">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--bg-app)] custom-scrollbar min-h-0 transition-colors">
          <PageContainer maxWidth={maxWidth} noPadding={noPadding}>
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
