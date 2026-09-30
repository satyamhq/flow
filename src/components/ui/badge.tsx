'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'neutral',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: 'bg-[var(--success-subtle)] text-[var(--success-text)] border-[rgba(13,144,79,0.3)]',
    warning: 'bg-[var(--warning-subtle)] text-[var(--warning-text)] border-[rgba(227,116,0,0.3)]',
    error: 'bg-[var(--error-subtle)] text-[var(--error-text)] border-[rgba(217,48,37,0.3)]',
    info: 'bg-[var(--info-subtle)] text-[#1A73E8] border-[rgba(26,115,232,0.3)]',
    neutral: 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]',
    outline: 'bg-transparent text-[var(--text-primary)] border-[var(--border)]',
  };

  const dotColors = {
    success: 'bg-[var(--success-text)]',
    warning: 'bg-[var(--warning-text)]',
    error: 'bg-[var(--error-text)]',
    info: 'bg-[#1A73E8]',
    neutral: 'bg-[var(--text-secondary)]',
    outline: 'bg-[var(--text-primary)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border uppercase tracking-wider select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
}
