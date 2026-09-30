'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' | 'icon' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all select-none rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0B0E14] disabled:opacity-40 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'bg-[#1A73E8] hover:bg-[#185ABC] active:bg-[#174EA6] text-white shadow-sm font-semibold border border-transparent',
      secondary:
        'bg-[#161D2D] hover:bg-[#1C2438] active:bg-[#202A40] text-[#EDF2F7] border border-[#202637] shadow-sm',
      tertiary:
        'bg-transparent hover:bg-[#161D2D] text-[#9AA0A6] hover:text-[#EDF2F7] border border-transparent',
      danger:
        'bg-[#D93025] hover:bg-[#B31412] active:bg-[#8C0000] text-white shadow-sm font-semibold border border-transparent',
      ghost:
        'bg-transparent hover:bg-[#161D2D] text-[#9AA0A6] hover:text-[#EDF2F7]',
      icon:
        'p-1.5 bg-transparent hover:bg-[#161D2D] text-[#9AA0A6] hover:text-[#EDF2F7] rounded',
      link:
        'bg-transparent text-[#8AB4F8] hover:underline p-0 h-auto font-normal',
    };

    const sizes = {
      sm: 'text-[11px] px-2.5 py-1 gap-1.5 h-7',
      md: 'text-xs px-3 py-1.5 gap-2 h-8',
      lg: 'text-sm px-4 py-2 gap-2.5 h-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'icon' && variant !== 'link' && sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
