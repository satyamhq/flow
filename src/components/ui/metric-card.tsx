'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string | number | { value: string | number; isPositive?: boolean };
  deltaType?: 'positive' | 'negative' | 'neutral';
  subText?: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  deltaType = 'positive',
  subText,
  icon,
  className,
}: MetricCardProps) {
  // Normalize delta
  let deltaLabel: string | number | undefined;
  let isPositive = deltaType === 'positive';
  let isNegative = deltaType === 'negative';

  if (typeof delta === 'object' && delta !== null && 'value' in delta) {
    deltaLabel = delta.value;
    isPositive = delta.isPositive !== false;
    isNegative = delta.isPositive === false;
  } else if (delta !== undefined) {
    deltaLabel = delta;
  }

  // Render icon whether it's a component type or an instantiated element
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-4 h-4 text-[#8AB4F8]" />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        'p-4 bg-[#111622] border border-[#202637] rounded-lg shadow-sm hover:border-[#303B54] transition-all flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-[#9AA0A6]">
        <span className="font-medium tracking-wide">{title}</span>
        {renderIcon()}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold font-mono text-[#EDF2F7] tracking-tight">{value}</span>
        {deltaLabel !== undefined && (
          <span
            className={cn(
              'flex items-center text-xs font-semibold font-mono',
              isPositive && 'text-[#34A853]',
              isNegative && 'text-[#EA4335]',
              !isPositive && !isNegative && 'text-[#9AA0A6]'
            )}
          >
            {isPositive && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {isNegative && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {deltaLabel}
          </span>
        )}
      </div>

      {subText && (
        <div className="mt-2 pt-2 border-t border-[#181E2E] text-[11px] text-[#9AA0A6] flex items-center justify-between">
          <span>{subText}</span>
        </div>
      )}
    </div>
  );
}
