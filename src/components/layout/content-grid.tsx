'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ContentGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'none';
}

/**
 * Standardized ContentGrid
 * Guarantees responsive card and content column distribution with enterprise gap rhythm.
 */
export function ContentGrid({
  columns = 3,
  gap = 'md',
  className,
  children,
  ...props
}: ContentGridProps) {
  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  }[columns];

  const gapClass = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-4 sm:gap-5',
    lg: 'gap-6',
  }[gap];

  return (
    <div className={cn('grid w-full', colClass, gapClass, className)} {...props}>
      {children}
    </div>
  );
}
