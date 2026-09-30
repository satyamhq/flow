'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

/**
 * Standardized Stack Primitive
 * Implements 4px/8px rhythm spacing for vertical flows and horizontal action clusters.
 */
export function Stack({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  children,
  ...props
}: StackProps) {
  const directionClass = direction === 'vertical' ? 'flex flex-col' : 'flex flex-row';

  const spacingClass = {
    none: 'gap-0',
    xs: 'gap-1.5',  // 6px
    sm: 'gap-2.5',  // 10px
    md: 'gap-4',    // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8',    // 32px
  }[spacing];

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }[align];

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }[justify];

  return (
    <div
      className={cn(
        directionClass,
        spacingClass,
        alignClass,
        justifyClass,
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
