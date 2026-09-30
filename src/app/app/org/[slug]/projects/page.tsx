'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import { Plus, FolderKanban } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/flow';

export default function ProjectsPage() {
  const router = useRouter();
  const { currentOrg, projects, setIsCreateOpen, setCreateType } = useFlow();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = projects.filter(
    (p) => statusFilter === 'all' || p.status === statusFilter
  );

  const columns: Column<Project>[] = [
    {
      header: 'Project Name',
      accessorKey: 'name',
      sortable: true,
      cell: (p) => (
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#EDF2F7] hover:text-[#8AB4F8] transition-colors">
              {p.name}
            </span>
            <Badge variant={p.priority === 'urgent' ? 'error' : p.priority === 'high' ? 'warning' : 'neutral'}>
              {p.priority}
            </Badge>
          </div>
          <p className="text-[11px] text-[#9AA0A6] line-clamp-1">{p.description}</p>
        </div>
      ),
    },
    {
      header: 'Owner & Team',
      accessorKey: 'ownerName',
      sortable: true,
      cell: (p) => (
        <div>
          <span className="text-[#EDF2F7] font-medium">{p.ownerName}</span>
          <span className="block text-[11px] text-[#9AA0A6]">{p.team}</span>
        </div>
      ),
    },
    {
      header: 'Progress',
      accessorKey: 'progress',
      sortable: true,
      cell: (p) => (
        <div className="w-28 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#EDF2F7] font-semibold">{p.progress}%</span>
            <span className="text-[#9AA0A6] text-[10px]">
              {p.tasksCount.done}/{p.tasksCount.total} tasks
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#161D2D] rounded-full overflow-hidden">
            <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: `${p.progress}%` }} />
          </div>
        </div>
      ),
    },
    {
      header: 'Budget (Spent / Alloc)',
      cell: (p) => (
        <div className="font-mono text-xs text-[#EDF2F7]">
          <span className="font-semibold">{formatCurrency(p.budgetSpent)}</span>
          <span className="text-[#9AA0A6] text-[11px]"> / {formatCurrency(p.budgetAllocated)}</span>
        </div>
      ),
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      sortable: true,
      cell: (p) => <span className="font-mono text-xs text-[#9AA0A6]">{p.dueDate}</span>,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Projects' },
        ]}
        title="Company Projects"
        description="Multi-disciplinary strategic initiatives connected directly to company goals and execution."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setCreateType('project');
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Button>
        }
      />

      <DataTable
        data={filteredProjects}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchableKey="name"
        searchPlaceholder="Filter projects by title..."
        onRowClick={(p) => router.push(`/app/org/${currentOrg.slug}/projects/${p.id}`)}
        filterableSlot={
          <div className="flex items-center bg-[#111622] border border-[#202637] rounded-md p-0.5 text-xs">
            {['all', 'in_progress', 'planned', 'completed'].map((s) => (
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
