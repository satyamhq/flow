'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { CreditCard, DollarSign, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FinanceTransaction {
  customer: string;
  amount: number;
  type: string;
  status: 'succeeded' | 'pending' | 'failed';
  date: string;
}

export default function FinancePage() {
  const { currentOrg } = useFlow();

  const transactions: FinanceTransaction[] = [
    { customer: 'Stripe Payments', amount: 620000, type: 'Annual Enterprise Subscription', status: 'succeeded', date: 'Yesterday' },
    { customer: 'Vercel Inc.', amount: 480000, type: 'Annual Strategic Renewal', status: 'succeeded', date: '3 days ago' },
    { customer: 'Supabase Pte. Ltd.', amount: 350000, type: 'Multi-Region Enterprise Tier', status: 'succeeded', date: '1 week ago' },
    { customer: 'AWS / Cloudflare Edge Network', amount: -28400, type: 'Global Edge Transit Infrastructure', status: 'succeeded', date: '2 weeks ago' },
  ];

  const columns: Column<FinanceTransaction>[] = [
    {
      header: 'Account / Description',
      accessorKey: 'customer',
      sortable: true,
      cell: (t) => (
        <div>
          <span className="font-semibold text-[#EDF2F7]">{t.customer}</span>
          <span className="block text-[11px] text-[#9AA0A6]">{t.type}</span>
        </div>
      ),
    },
    {
      header: 'Ledger Status',
      accessorKey: 'status',
      sortable: true,
      cell: (t) => (
        <Badge variant={t.status === 'succeeded' ? 'success' : 'warning'} dot>
          {t.status}
        </Badge>
      ),
    },
    {
      header: 'Net Amount',
      accessorKey: 'amount',
      sortable: true,
      cell: (t) => (
        <span
          className={`font-mono font-semibold text-xs ${
            t.amount > 0 ? 'text-[#34A853]' : 'text-[#EDF2F7]'
          }`}
        >
          {t.amount > 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
        </span>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'date',
      sortable: true,
      cell: (t) => <span className="font-mono text-xs text-[#9AA0A6]">{t.date}</span>,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Finance' },
        ]}
        title="Financial Operating Dashboard"
        description="Stripe billing synchronization, GAAP recurring revenue, cash burn, and unit margins."
        badge={
          <Badge variant="info" dot>
            Stripe Synchronized
          </Badge>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Annual Recurring Revenue"
          value="$15.70M"
          delta="+18.4% YoY"
          deltaType="positive"
          subText="MRR: $1.31M • NRR: 134%"
          icon={DollarSign}
        />
        <MetricCard
          title="Net Monthly Burn"
          value="$210,000"
          subText="36 Months Total Runway"
          icon={Activity}
        />
        <MetricCard
          title="Gross Margin"
          value="84.5%"
          delta="Top Quartile"
          deltaType="positive"
          subText="Infrastructure Optimized"
          icon={TrendingUp}
        />
        <MetricCard
          title="Net Retention (NRR)"
          value="134%"
          delta="Expansion Accel"
          deltaType="positive"
          subText="142 Active Enterprise Accounts"
          icon={ShieldCheck}
        />
      </div>

      <DataTable
        data={transactions}
        columns={columns}
        keyExtractor={(t: any, idx: number) => `tx_${t.customer}_${t.date}_${idx}`}
        searchableKey="customer"
        searchPlaceholder="Filter transactions by account name..."
      />
    </div>
  );
}
