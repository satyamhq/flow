'use client';

import React, { useState, useEffect } from 'react';
import { useFlow } from '@/context/flow-context';
import { Cpu, ShieldCheck, FileCheck, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface SOPRow {
  id: string;
  title: string;
  dept: string;
  verified: string;
  status: string;
}

export default function OperationsPage() {
  const { currentOrg, currentUser } = useFlow();
  const [sops, setSops] = useState<SOPRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDept, setFormDept] = useState(currentUser.department || 'Operations');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_sops`);
      if (stored) {
        setSops(JSON.parse(stored));
      } else {
        setSops([]);
      }
    } catch {
      setSops([]);
    }
  }, [currentOrg.id]);

  const handleCreateSop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newSop: SOPRow = {
      id: `sop_${Date.now()}`,
      title: formTitle.trim(),
      dept: formDept.trim() || 'Operations',
      verified: 'Today',
      status: 'active',
    };

    const updated = [newSop, ...sops];
    setSops(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_sops`, JSON.stringify(updated));
    } catch {}

    setFormTitle('');
    setIsModalOpen(false);
  };

  const columns: Column<SOPRow>[] = [
    {
      header: 'Standard Operating Procedure (SOP)',
      accessorKey: 'title',
      sortable: true,
      cell: (sop) => (
        <div>
          <span className="font-semibold text-[var(--text-primary)] block">{sop.title}</span>
          <span className="text-[11px] text-[var(--text-secondary)]">Department: {sop.dept}</span>
        </div>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'dept',
      sortable: true,
      cell: (sop) => <Badge variant="neutral">{sop.dept}</Badge>,
    },
    {
      header: 'Last Verified',
      accessorKey: 'verified',
      sortable: true,
      cell: (sop) => <span className="font-mono text-xs text-[var(--text-secondary)]">{sop.verified}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (sop) => <Badge variant="success">{sop.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Operations & Execution', href: '#' },
          { label: 'Standard Operating Procedures' },
        ]}
        title="Operations & Execution Governance"
        description="Standard operating procedures, governance checklists, and verified audit protocols."
        badge={
          <Badge variant={sops.length > 0 ? 'success' : 'neutral'}>
            {sops.length} Registered SOP{sops.length === 1 ? '' : 's'}
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add SOP
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">Register Standard Operating Procedure</h3>
          <form onSubmit={handleCreateSop} className="space-y-3">
            <div>
              <label className="text-[11px] text-[var(--text-secondary)] block mb-1">SOP Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. SOP-01: Zero-Downtime Database Failover"
                className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Department</label>
              <input
                type="text"
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save SOP
              </Button>
            </div>
          </form>
        </div>
      )}

      {sops.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No operational SOPs registered"
          description="Publish standard operating procedures to maintain compliance and reliability across teams."
          actionLabel="Add SOP"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable
          data={sops}
          columns={columns}
          searchKey="title"
          searchPlaceholder="Filter SOPs by title..."
        />
      )}
    </div>
  );
}
