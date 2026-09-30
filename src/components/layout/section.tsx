'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Standardized Section Primitive
 * Provides consistent hierarchy, title size, description spacing, and vertical rhythm.
 */
export function Section({
  title,
  description,
  badge,
  actions,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn('space-y-4', className)} {...props}>
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[var(--border-subtle)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {title && (
                <h2 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                  {title}
                </h2>
              )}
              {badge && <div>{badge}</div>}
            </div>
            {description && (
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              {actions}
            </div>
          )}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}
