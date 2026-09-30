'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchSlot?: React.ReactNode;
  filterSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
}

/**
 * Standardized Toolbar Primitive
 * Aligns filters, search, and action toolbars with consistent height, borders, and spacing.
 */
export function Toolbar({
  searchSlot,
  filterSlot,
  actionsSlot,
  className,
  children,
  ...props
}: ToolbarProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[var(--surface-base)] border border-[var(--border)] rounded-lg shadow-sm',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2.5 flex-wrap">
        {searchSlot}
        {filterSlot}
      </div>
      {(actionsSlot || children) && (
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {actionsSlot}
          {children}
        </div>
      )}
    </div>
  );
}
