'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/flow';

export default function TasksPage() {
  const { currentOrg, tasks, updateTaskStatus, deleteTask, setIsCreateOpen, setCreateType } = useFlow();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(
    (t) => statusFilter === 'all' || t.status === statusFilter
  );

  const columns: Column<Task>[] = [
    {
      header: 'Task Title',
      accessorKey: 'title',
      sortable: true,
      cell: (t) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateTaskStatus(t.id, t.status === 'done' ? 'todo' : 'done');
            }}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
              t.status === 'done'
                ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                : 'border-[#303B54] hover:border-[#1A73E8]'
            }`}
          >
            {t.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
          </button>
          <div className="space-y-0.5">
            <span
              className={`font-medium ${
                t.status === 'done' ? 'line-through text-[#5F6368]' : 'text-[#EDF2F7]'
              }`}
            >
              {t.title}
            </span>
            {t.description && (
              <p className="text-[11px] text-[#9AA0A6] line-clamp-1">{t.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Project',
      accessorKey: 'projectName',
      sortable: true,
      cell: (t) => (
        <span className="text-[11px] text-[#9AA0A6] font-medium truncate max-w-[140px] block">
          {t.projectName || 'General Operations'}
        </span>
      ),
    },
    {
      header: 'Assignee',
      cell: (t) => (
        <div className="flex items-center space-x-2">
          {t.assignee?.avatar && (
            <img
              src={t.assignee.avatar}
              alt={t.assignee.name}
              className="w-5 h-5 rounded-full object-cover border border-[#202637]"
            />
          )}
          <span className="text-[11px] text-[#EDF2F7]">{t.assignee?.name || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (t) => (
        <Badge
          variant={
            t.priority === 'urgent'
              ? 'error'
              : t.priority === 'high'
              ? 'warning'
              : 'neutral'
          }
        >
          {t.priority}
        </Badge>
      ),
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      sortable: true,
      cell: (t) => <span className="font-mono text-xs text-[#9AA0A6]">{t.dueDate}</span>,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Tasks' },
        ]}
        title="Universal Task Engine"
        description="Enterprise work tracking with real-time status transitions, dependencies, and bulk operations."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setCreateType('task');
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task (C)</span>
          </Button>
        }
      />

      <DataTable
        data={filteredTasks}
        columns={columns}
        keyExtractor={(t) => t.id}
        searchableKey="title"
        searchPlaceholder="Search tasks..."
        selectable
        bulkActions={(selectedIds, clearSelection) => (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                selectedIds.forEach((id) => updateTaskStatus(id, 'done'));
                clearSelection();
              }}
            >
              Mark Done
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                selectedIds.forEach((id) => deleteTask(id));
                clearSelection();
              }}
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </Button>
          </div>
        )}
        filterableSlot={
          <div className="flex items-center bg-[#111622] border border-[#202637] rounded-md p-0.5 text-xs">
            {['all', 'todo', 'in_progress', 'blocked', 'done'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded transition-colors cursor-pointer capitalize ${
                  statusFilter === s ? 'bg-[#1A73E8] text-white font-medium shadow-sm' : 'text-[#9AA0A6] hover:text-[#EDF2F7]'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}
