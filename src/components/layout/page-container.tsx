'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'default' | 'narrow' | 'wide' | 'full';
  noPadding?: boolean;
}

/**
 * Standardized PageContainer
 * Enforces the primary Flow rule:
 * Sidebar -> fixed gutter -> Main Content -> consistent right gutter
 * Eliminates random margins and ensures no component collides with the sidebar.
 */
export function PageContainer({
  maxWidth = 'default',
  noPadding = false,
  className,
  children,
  ...props
}: PageContainerProps) {
  const maxWidthClass = {
    narrow: 'max-w-5xl',
    default: 'max-w-[1440px]',
    wide: 'max-w-[1600px]',
    full: 'max-w-none',
  }[maxWidth];

  return (
    <div
      className={cn(
        'w-full mx-auto',
        maxWidthClass,
        !noPadding && 'px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 space-y-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
