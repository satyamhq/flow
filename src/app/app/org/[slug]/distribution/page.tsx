'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Network, TrendingUp, Users, DollarSign, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

interface ChannelRow {
  channel: string;
  count: number;
  share: number;
  totalValue: number;
}

export default function DistributionPage() {
  const { currentOrg, leads, customers, setIsCreateOpen, setCreateType } = useFlow();

  // Aggregate channels from real leads and customers
  const channelMap: Record<string, { count: number; totalValue: number }> = {};

  leads.forEach((l) => {
    const src = l.source || 'Direct Outreach';
    if (!channelMap[src]) channelMap[src] = { count: 0, totalValue: 0 };
    channelMap[src].count += 1;
    channelMap[src].totalValue += l.value || 0;
  });

  customers.forEach((c) => {
    const src = 'Direct / Enterprise';
    if (!channelMap[src]) channelMap[src] = { count: 0, totalValue: 0 };
    channelMap[src].count += 1;
    channelMap[src].totalValue += c.arr || 0;
  });

  const totalItems = (leads.length + customers.length) || 1;
  const channels: ChannelRow[] = Object.entries(channelMap).map(([channel, data]) => ({
    channel,
    count: data.count,
    share: Math.round((data.count / totalItems) * 100),
    totalValue: data.totalValue,
  }));

  const hasData = channels.length > 0;

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
      header: 'Attributed Pipeline / ARR',
      accessorKey: 'totalValue',
      sortable: true,
      cell: (c) => <span className="font-mono font-medium text-[#EDF2F7]">{formatCurrency(c.totalValue)}</span>,
    },
    {
      header: 'Records',
      accessorKey: 'count',
      sortable: true,
      cell: (c) => <span className="font-mono text-[#9AA0A6]">{c.count}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Growth & Distribution', href: '#' },
          { label: 'Customer Channels' },
        ]}
        title="Customer Acquisition & Distribution"
        description="Distribution channel attribution computed from real sales pipeline and customer telemetry."
        badge={
          <Badge variant={hasData ? 'info' : 'neutral'}>
            {channels.length} Active Channels
          </Badge>
        }
      />

      {!hasData ? (
        <EmptyState
          title="No customer channels yet"
          description="Record sales leads or customer accounts to view acquisition channel attribution."
          actionLabel="Create Lead"
          onAction={() => {
            setCreateType('lead');
            setIsCreateOpen(true);
          }}
        />
      ) : (
        <DataTable
          data={channels}
          columns={columns}
          searchKey="channel"
          searchPlaceholder="Filter channels..."
        />
      )}
    </div>
  );
}
