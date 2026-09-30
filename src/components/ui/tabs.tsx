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
    <div className={cn('flex border-b border-[#202637] space-x-6 overflow-x-auto select-none custom-scrollbar', className)}>
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
                ? 'border-[#1A73E8] text-[#8AB4F8] font-semibold'
                : 'border-transparent text-[#9AA0A6] hover:text-[#EDF2F7] hover:border-[#303B54]'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[9px] px-1.5 py-0.2 rounded-full font-mono font-medium',
                  isActive
                    ? 'bg-[rgba(26,115,232,0.2)] text-[#8AB4F8]'
                    : 'bg-[#181E2E] text-[#9AA0A6]'
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
