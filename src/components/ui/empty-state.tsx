'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon = FolderOpen,
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  action,
  className,
}: EmptyStateProps) {
  const finalActionLabel = actionLabel || action?.label;
  const finalOnAction = onAction || action?.onClick;

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        'p-10 flex flex-col items-center justify-center text-center space-y-3 max-w-sm mx-auto select-none',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[#161D2D] border border-[#202637] flex items-center justify-center text-[#8AB4F8] shadow-inner">
        {renderIcon()}
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-[#EDF2F7]">{title}</h4>
        <p className="text-[11px] text-[#9AA0A6] leading-relaxed">{description}</p>
      </div>

      {finalActionLabel && finalOnAction && (
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={finalOnAction}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>{finalActionLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
