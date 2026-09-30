'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ChevronUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

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

  // Filter & Sort
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

  // Paginated data
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(getKey));
    }
  };

  const toggleSelectRow = (id: string, e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSort = (columnKey?: keyof T) => {
    if (!columnKey) return;
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className={cn('space-y-3 w-full', className)}>
      {/* Search and Filters Toolbar */}
      {(activeSearchKey || filterableSlot) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {activeSearchKey && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full bg-[var(--surface-base)] border border-[var(--border)] rounded-md pl-9 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
          )}

          {filterableSlot && <div className="flex items-center gap-2">{filterableSlot}</div>}
        </div>
      )}

      {/* Bulk Actions Banner */}
      {selectable && selectedIds.length > 0 && bulkActions && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--primary-subtle)] border border-[rgba(26,115,232,0.3)] rounded-md text-xs text-[var(--text-primary)] animate-in fade-in">
          <span className="font-medium text-xs">
            <span className="text-[#1A73E8] font-bold">{selectedIds.length}</span> selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions(selectedIds, () => setSelectedIds([]))}
          </div>
        </div>
      )}

      {/* The Table */}
      <div className="bg-[var(--surface-base)] border border-[var(--border)] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-[var(--text-secondary)] border-collapse">
            <thead className="bg-[var(--surface-header)] text-[var(--text-secondary)] font-medium border-b border-[var(--border)]">
              <tr>
                {selectable && (
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        filteredData.length > 0 && selectedIds.length === filteredData.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded bg-[var(--surface-elevated)] border-[var(--border)] text-[#1A73E8] focus:ring-0 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      'py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]',
                      col.sortable && 'cursor-pointer hover:text-[var(--text-primary)] select-none',
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
                            <ArrowUpDown className="w-3 h-3 text-[var(--text-muted)] opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-subtle)]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="p-8 text-center text-xs text-[var(--text-secondary)]"
                  >
                    <div className="flex items-center justify-center space-x-2 text-[#1A73E8]">
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
                paginatedData.map((item, rowIdx) => {
                  const id = getKey(item, rowIdx);
                  const isSelected = selectedIds.includes(id);

                  return (
                    <tr
                      key={id}
                      onClick={() => onRowClick && onRowClick(item)}
                      className={cn(
                        'hover:bg-[var(--surface-elevated)] transition-colors flow-table-row',
                        onRowClick && 'cursor-pointer',
                        isSelected && 'bg-[var(--primary-subtle)]'
                      )}
                    >
                      {selectable && (
                        <td className="py-3 px-3 w-8">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectRow(id, e)}
                            className="rounded bg-[var(--surface-elevated)] border-[var(--border)] text-[#1A73E8] focus:ring-0 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className={cn('py-3 px-3 text-[var(--text-primary)]', col.className)}
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

        {/* Standardized Table Pagination Footer */}
        {filteredData.length > 0 && (
          <div className="px-4 py-2.5 bg-[var(--surface-header)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-mono text-[11px]">
              Showing <span className="text-[var(--text-primary)] font-semibold">{filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
              <span className="text-[var(--text-primary)] font-semibold">
                {Math.min(currentPage * pageSize, filteredData.length)}
              </span>{' '}
              of <span className="text-[var(--text-primary)] font-semibold">{filteredData.length}</span> records
            </span>

            {totalPages > 1 && (
              <div className="flex items-center space-x-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-6 px-2 text-[10px]"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Prev</span>
                </Button>
                <span className="text-[11px] font-mono px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-6 px-2 text-[10px]"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
