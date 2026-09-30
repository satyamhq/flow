'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types/flow';

export default function CustomersPage() {
  const { currentOrg, customers, setIsCreateOpen, setCreateType } = useFlow();

  const columns: Column<Customer>[] = [
    {
      header: 'Company & Domain',
      accessorKey: 'name',
      sortable: true,
      cell: (c) => (
        <div>
          <span className="font-semibold text-[var(--text-primary)]">{c.name}</span>
          <span className="block text-[11px] text-[var(--text-secondary)] font-mono">{c.domain}</span>
        </div>
      ),
    },
    {
      header: 'Tier',
      accessorKey: 'tier',
      sortable: true,
      cell: (c) => (
        <Badge variant={c.tier === 'strategic' ? 'info' : 'neutral'}>
          {c.tier}
        </Badge>
      ),
    },
    {
      header: 'Annual Recurring (ARR)',
      accessorKey: 'arr',
      sortable: true,
      cell: (c) => <span className="font-mono font-semibold text-[var(--text-primary)]">{formatCurrency(c.arr)}</span>,
    },
    {
      header: 'Health Score',
      accessorKey: 'healthScore',
      sortable: true,
      cell: (c) => (
        <div className="flex items-center space-x-2">
          <Badge variant={c.healthScore >= 90 ? 'success' : 'warning'} dot>
            {c.healthScore}/100
          </Badge>
        </div>
      ),
    },
    {
      header: 'Account Owner',
      accessorKey: 'accountOwner',
      sortable: true,
      cell: (c) => <span className="text-xs text-[var(--text-primary)]">{c.accountOwner}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Customers' },
        ]}
        title="Enterprise Customers"
        description="Contract tiers, ARR contribution, health scores, and account ownership."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setCreateType('customer');
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Customer</span>
          </Button>
        }
      />

      <DataTable
        data={customers}
        columns={columns}
        keyExtractor={(c) => c.id}
        searchableKey="name"
        searchPlaceholder="Search customers by company name..."
      />
    </div>
  );
}
