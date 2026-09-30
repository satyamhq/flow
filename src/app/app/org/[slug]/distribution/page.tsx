'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Network, TrendingUp, Users, DollarSign, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ChannelRow {
  channel: string;
  share: number;
  newArr: number;
  cac: number;
  trend: string;
}

export default function DistributionPage() {
  const { currentOrg } = useFlow();

  const channels: ChannelRow[] = [
    { channel: 'Product-Led Growth (PLG)', share: 38, newArr: 5966000, cac: 180, trend: '+24%' },
    { channel: 'Enterprise Sales-Led (SLG)', share: 34, newArr: 5338000, cac: 1450, trend: '+18%' },
    { channel: 'High-Intent Developer Search', share: 14, newArr: 2198000, cac: 520, trend: '+12%' },
    { channel: 'Executive Strategic Referrals', share: 9, newArr: 1413000, cac: 120, trend: '+35%' },
    { channel: 'Open Source Community', share: 5, newArr: 785000, cac: 95, trend: '+40%' },
  ];

  const columns: Column<ChannelRow>[] = [
    {
      header: 'Acquisition Channel',
      accessorKey: 'channel',
      sortable: true,
      cell: (c) => <span className="font-semibold text-[#EDF2F7]">{c.channel}</span>,
    },
    {
      header: 'Volume Share',
      accessorKey: 'share',
      sortable: true,
      cell: (c) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[#EDF2F7] text-xs">{c.share}%</span>
          <div className="w-16 h-1.5 bg-[#161D2D] rounded-full overflow-hidden">
            <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: `${c.share}%` }} />
          </div>
        </div>
      ),
    },
    {
      header: 'Attributed ARR',
      accessorKey: 'newArr',
      sortable: true,
      cell: (c) => <span className="font-mono font-medium text-[#EDF2F7]">{formatCurrency(c.newArr)}</span>,
    },
    {
      header: 'Channel CAC',
      accessorKey: 'cac',
      sortable: true,
      cell: (c) => <span className="font-mono text-[#9AA0A6]">${c.cac}</span>,
    },
    {
      header: 'Growth Trend',
      accessorKey: 'trend',
      sortable: true,
      cell: (c) => <Badge variant="success">{c.trend}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Growth & Distribution', href: '#' },
          { label: 'Customer Channels' },
        ]}
        title="Customer Acquisition & Distribution"
        description="Distribution engine attribution, cohort unit economics, and blended channel efficiency."
        badge={<Badge variant="info">5 Active Channels</Badge>}
      />

      <DataTable
        data={channels}
        columns={columns}
        searchKey="channel"
        searchPlaceholder="Filter channels..."
      />
    </div>
  );
}
