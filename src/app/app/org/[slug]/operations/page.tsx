'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Cpu, ShieldCheck, FileCheck, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SOPRow {
  title: string;
  dept: string;
  verified: string;
  status: string;
}

export default function OperationsPage() {
  const { currentOrg } = useFlow();

  const sops: SOPRow[] = [
    { title: 'SOP-01: Zero-Downtime Multi-Region Database Failover', dept: 'Infrastructure', verified: 'Sep 24, 2026', status: 'verified' },
    { title: 'SOP-02: Enterprise Customer Security Incident Response Protocol', dept: 'Security & Legal', verified: 'Sep 15, 2026', status: 'verified' },
    { title: 'SOP-03: SOC-2 Continuous Evidence Ingestion & Review', dept: 'Compliance', verified: 'Sep 28, 2026', status: 'verified' },
    { title: 'SOP-04: High-Value Vendor Procurement & SLA Assessment', dept: 'Finance & Ops', verified: 'Aug 30, 2026', status: 'verified' },
  ];

  const columns: Column<SOPRow>[] = [
    {
      header: 'Standard Operating Procedure (SOP)',
      accessorKey: 'title',
      sortable: true,
      cell: (sop) => (
        <div>
          <span className="font-semibold text-[#EDF2F7] block">{sop.title}</span>
          <span className="text-[11px] text-[#9AA0A6]">Department: {sop.dept}</span>
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
      header: 'Last Audited',
      accessorKey: 'verified',
      sortable: true,
      cell: (sop) => <span className="font-mono text-xs text-[#9AA0A6]">{sop.verified}</span>,
    },
    {
      header: 'Compliance Status',
      accessorKey: 'status',
      sortable: true,
      cell: (sop) => <Badge variant="success">{sop.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Operations & Execution', href: '#' },
          { label: 'Operations Center' },
        ]}
        title="Operations & SOP Center"
        description="Standard operating procedures, vendor procurement, compliance audits, and internal operations."
        badge={<Badge variant="info">SOC-2 Type II Validated</Badge>}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New SOP Document
          </Button>
        }
      />

      <DataTable
        data={sops}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Filter SOPs..."
      />
    </div>
  );
}
