'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-[var(--border)] space-x-6 overflow-x-auto select-none custom-scrollbar', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap',
              isActive
                ? 'border-[#1A73E8] text-[#1A73E8] font-semibold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[9px] px-1.5 py-0.2 rounded-full font-mono font-medium',
                  isActive
                    ? 'bg-[var(--primary-subtle)] text-[#1A73E8]'
                    : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)]'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
