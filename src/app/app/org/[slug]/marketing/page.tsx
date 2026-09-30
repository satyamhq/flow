'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface CampaignRow {
  name: string;
  channel: string;
  budget: number;
  spend: number;
  leads: number;
  cac: number;
  roi: number;
  status: 'active' | 'completed' | 'draft';
}

export default function MarketingPage() {
  const { currentOrg } = useFlow();

  const campaigns: CampaignRow[] = [
    {
      name: 'High-Intent Developer Search',
      channel: 'Google Search',
      budget: 50000,
      spend: 42100,
      leads: 320,
      cac: 520,
      roi: 3.8,
      status: 'active',
    },
    {
      name: 'Executive Technical Whitepapers',
      channel: 'LinkedIn Ads',
      budget: 45000,
      spend: 38400,
      leads: 56,
      cac: 685,
      roi: 2.4,
      status: 'active',
    },
    {
      name: 'Open Source Postgres Community Sponsorship',
      channel: 'Developer Community',
      budget: 25000,
      spend: 25000,
      leads: 580,
      cac: 210,
      roi: 5.6,
      status: 'completed',
    },
  ];

  const columns: Column<CampaignRow>[] = [
    {
      header: 'Campaign & Channel',
      accessorKey: 'name',
      sortable: true,
      cell: (c) => (
        <div>
          <span className="font-semibold text-[#EDF2F7]">{c.name}</span>
          <span className="block text-[11px] text-[#9AA0A6]">{c.channel}</span>
        </div>
      ),
    },
    {
      header: 'Spend / Budget',
      cell: (c) => (
        <div className="font-mono text-xs">
          <span className="font-semibold text-[#EDF2F7]">{formatCurrency(c.spend)}</span>
          <span className="text-[#9AA0A6] text-[11px]"> / {formatCurrency(c.budget)}</span>
        </div>
      ),
    },
    {
      header: 'Leads Generated',
      accessorKey: 'leads',
      sortable: true,
      cell: (c) => <span className="font-mono font-medium text-xs text-[#EDF2F7]">{c.leads}</span>,
    },
    {
      header: 'Customer Acquisition Cost (CAC)',
      accessorKey: 'cac',
      sortable: true,
      cell: (c) => (
        <div className="font-mono text-xs">
          <span className={c.cac > 600 ? 'text-[#FBBC04] font-bold' : 'text-[#EDF2F7]'}>
            ${c.cac}
          </span>
          {c.cac > 600 && <span className="block text-[9px] text-[#FBBC04] uppercase font-bold">Above Target</span>}
        </div>
      ),
    },
    {
      header: 'ROI Multiplier',
      accessorKey: 'roi',
      sortable: true,
      cell: (c) => <span className="font-mono font-bold text-xs text-[#34A853]">{c.roi}x</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (c) => (
        <Badge variant={c.status === 'active' ? 'success' : 'neutral'} dot>
          {c.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Marketing' },
        ]}
        title="Marketing Operating System"
        description="Campaign telemetry, multi-channel customer acquisition cost (CAC), and pipeline attribution."
      />

      <DataTable
        data={campaigns}
        columns={columns}
        keyExtractor={(c) => c.name}
        searchableKey="name"
        searchPlaceholder="Filter campaigns by name..."
      />
    </div>
  );
}
