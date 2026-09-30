'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ChevronUp, ArrowUpDown, Trash2 } from 'lucide-react';
import { Button } from './button';
import { EmptyState } from './empty-state';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T, index: number) => string;
  searchPlaceholder?: string;
  searchableKey?: keyof T;
  searchKey?: keyof T;
  filterableSlot?: React.ReactNode;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  bulkActions?: (selectedIds: string[], clearSelection: () => void) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search resources...',
  searchableKey,
  searchKey,
  filterableSlot,
  onRowClick,
  selectable = false,
  bulkActions,
  emptyTitle = 'No records found',
  emptyDescription = 'No resources match your active search or filters.',
  onEmptyAction,
  emptyActionLabel,
  isLoading = false,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const activeSearchKey = searchableKey || searchKey;
  const getKey = React.useCallback(
    (item: T, idx: number): string => {
      if (keyExtractor) return keyExtractor(item, idx);
      const anyItem = item as Record<string, unknown>;
      if (anyItem && anyItem.id !== undefined) return String(anyItem.id);
      return String(idx);
    },
    [keyExtractor]
  );

  // Filter
  const filteredData = React.useMemo(() => {
    let result = [...data];
    if (search && activeSearchKey) {
      result = result.filter((item) => {
        const val = item[activeSearchKey];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(search.toLowerCase());
        }
        return false;
      });
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, activeSearchKey, sortColumn, sortDirection]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(getKey));
    }
  };

  const toggleSelectRow = (id: string, e: React.SyntheticEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (colKey?: keyof T) => {
    if (!colKey) return;
    if (sortColumn === colKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search & Filter Toolbar */}
      {(activeSearchKey || filterableSlot) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {activeSearchKey && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#5F6368] absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-[#111622] border border-[#202637] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#EDF2F7] placeholder-[#5F6368] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
          )}

          {filterableSlot && <div className="flex items-center gap-2">{filterableSlot}</div>}
        </div>
      )}

      {/* Bulk Actions Banner */}
      {selectable && selectedIds.length > 0 && bulkActions && (
        <div className="flex items-center justify-between px-4 py-2 bg-[rgba(26,115,232,0.12)] border border-[rgba(26,115,232,0.3)] rounded-md text-xs text-[#EDF2F7] animate-in fade-in">
          <span className="font-medium text-xs">
            <span className="text-[#8AB4F8] font-bold">{selectedIds.length}</span> selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions(selectedIds, () => setSelectedIds([]))}
          </div>
        </div>
      )}

      {/* The Table */}
      <div className="bg-[#111622] border border-[#202637] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#9AA0A6] border-collapse">
            <thead className="bg-[#0E131F] text-[#9AA0A6] font-medium border-b border-[#202637]">
              <tr>
                {selectable && (
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        filteredData.length > 0 && selectedIds.length === filteredData.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded bg-[#161D2D] border-[#202637] text-[#1A73E8] focus:ring-0 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      'py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA0A6]',
                      col.sortable && 'cursor-pointer hover:text-[#EDF2F7] select-none',
                      col.className
                    )}
                    onClick={() => col.sortable && handleSort(col.accessorKey)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="inline-flex">
                          {sortColumn === col.accessorKey ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3 h-3 text-[#1A73E8]" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-[#1A73E8]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-[#5F6368] opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#181E2E]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="p-8 text-center text-xs text-[#9AA0A6]"
                  >
                    <div className="flex items-center justify-center space-x-2 text-[#8AB4F8]">
                      <div className="w-2 h-2 rounded-full bg-[#1A73E8] animate-ping" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)}>
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      actionLabel={emptyActionLabel}
                      onAction={onEmptyAction}
                    />
                  </td>
                </tr>
              ) : (
                filteredData.map((item, rowIdx) => {
                  const id = getKey(item, rowIdx);
                  const isSelected = selectedIds.includes(id);

                  return (
                    <tr
                      key={id}
                      onClick={() => onRowClick && onRowClick(item)}
                      className={cn(
                        'hover:bg-[#161D2D]/60 transition-colors',
                        onRowClick && 'cursor-pointer',
                        isSelected && 'bg-[#1A73E8]/10'
                      )}
                    >
                      {selectable && (
                        <td className="py-3 px-3 w-8">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectRow(id, e)}
                            className="rounded bg-[#161D2D] border-[#202637] text-[#1A73E8] focus:ring-0 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className={cn('py-3 px-3 text-[#EDF2F7]', col.className)}
                        >
                          {col.cell
                            ? col.cell(item)
                            : col.accessorKey
                            ? String(item[col.accessorKey] ?? '')
                            : null}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
