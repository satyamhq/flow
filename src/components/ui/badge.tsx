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
    success: 'bg-[rgba(13,144,79,0.16)] text-[#34A853] border-[rgba(13,144,79,0.3)]',
    warning: 'bg-[rgba(227,116,0,0.16)] text-[#FBBC04] border-[rgba(227,116,0,0.3)]',
    error: 'bg-[rgba(217,48,37,0.16)] text-[#EA4335] border-[rgba(217,48,37,0.3)]',
    info: 'bg-[rgba(26,115,232,0.16)] text-[#8AB4F8] border-[rgba(26,115,232,0.3)]',
    neutral: 'bg-[#181E2E] text-[#9AA0A6] border-[#252D40]',
    outline: 'bg-transparent text-[#EDF2F7] border-[#303B54]',
  };

  const dotColors = {
    success: 'bg-[#34A853]',
    warning: 'bg-[#FBBC04]',
    error: 'bg-[#EA4335]',
    info: 'bg-[#8AB4F8]',
    neutral: 'bg-[#9AA0A6]',
    outline: 'bg-[#EDF2F7]',
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
