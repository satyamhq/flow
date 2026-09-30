'use client';

import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FormFieldProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, required, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1 text-left w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#EDF2F7]">
            {label} {required && <span className="text-[#EA4335]">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[#111622] border border-[#202637] rounded-md px-3 py-1.5 text-xs text-[#EDF2F7] placeholder-[#5F6368] transition-colors focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] disabled:opacity-40',
            error && 'border-[#D93025] focus:border-[#D93025] focus:ring-[#D93025]',
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-[10px] text-[#EA4335] block">{error}</span>
        ) : helperText ? (
          <span className="text-[10px] text-[#9AA0A6] block">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FormFieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, required, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1 text-left w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#EDF2F7]">
            {label} {required && <span className="text-[#EA4335]">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[#111622] border border-[#202637] rounded-md px-3 py-2 text-xs text-[#EDF2F7] placeholder-[#5F6368] transition-colors focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] resize-none disabled:opacity-40',
            error && 'border-[#D93025] focus:border-[#D93025] focus:ring-[#D93025]',
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-[10px] text-[#EA4335] block">{error}</span>
        ) : helperText ? (
          <span className="text-[10px] text-[#9AA0A6] block">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
