'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { CreditCard, DollarSign, Activity, TrendingUp, ShieldCheck, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function FinancePage() {
  const { currentOrg, transactions, createTransaction, customers, integrations } = useFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formAccount, setFormAccount] = useState('');
  const [formAmount, setFormAmount] = useState(10000);
  const [formType, setFormType] = useState('Enterprise Subscription');

  const stripeIntegration = integrations.find((i) => i.id === 'stripe');
  const isStripeConnected = stripeIntegration?.status === 'connected';

  const totalArr = customers.reduce((sum, c) => sum + (c.arr || 0), 0);
  const mrr = Math.round(totalArr / 12);
  const totalNetRevenue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccount.trim()) return;

    createTransaction({
      customer: formAccount.trim(),
      amount: Number(formAmount),
      type: formType,
      date: 'Today',
      status: 'succeeded',
    });

    setFormAccount('');
    setIsModalOpen(false);
  };

  const columns: Column<any>[] = [
    {
      header: 'Account / Description',
      accessorKey: 'customer',
      sortable: true,
      cell: (t) => (
        <div>
          <span className="font-semibold text-[var(--text-primary)]">{t.customer || t.description}</span>
          <span className="block text-[11px] text-[var(--text-secondary)]">{t.type}</span>
        </div>
      ),
    },
    {
      header: 'Ledger Status',
      accessorKey: 'status',
      sortable: true,
      cell: (t) => (
        <Badge variant={t.status === 'succeeded' || t.status === 'cleared' ? 'success' : 'warning'} dot>
          {t.status}
        </Badge>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      sortable: true,
      cell: (t) => (
        <span
          className={`font-mono font-semibold text-xs ${
            t.amount > 0 ? 'text-[#34A853]' : 'text-[var(--text-primary)]'
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
      cell: (t) => <span className="font-mono text-xs text-[var(--text-secondary)]">{t.date}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Finance' },
        ]}
        title="Financial Operating Dashboard"
        description="Verified revenue telemetry, ledger transactions, and recurring subscription accounting."
        badge={
          <Badge variant={isStripeConnected ? 'success' : 'neutral'} dot>
            Stripe: {isStripeConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Record Transaction
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Customer ARR"
          value={formatCurrency(totalArr)}
          delta={`${customers.length} Accounts`}
          deltaType="positive"
          subText={`MRR: ${formatCurrency(mrr)}`}
          icon={DollarSign}
        />
        <MetricCard
          title="Ledger Volume"
          value={formatCurrency(totalNetRevenue)}
          subText={`${transactions.length} Total transactions`}
          icon={Activity}
        />
        <MetricCard
          title="Active Customers"
          value={customers.length}
          delta={customers.length > 0 ? 'Verified' : 'None'}
          deltaType="positive"
          subText="Enterprise contracts in database"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Billing Connector"
          value={isStripeConnected ? 'Active' : 'Offline'}
          subText={isStripeConnected ? 'Stripe webhook sync live' : 'No webhook connected'}
          icon={CreditCard}
        />
      </div>

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">Record General Ledger Transaction</h3>
          <form onSubmit={handleCreateTx} className="space-y-3">
            <div>
              <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Account or Customer Name</label>
              <input
                type="text"
                required
                value={formAccount}
                onChange={(e) => setFormAccount(e.target.value)}
                placeholder="e.g. Acme Enterprise Renewal"
                className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Category / Type</label>
                <input
                  type="text"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Add Transaction
              </Button>
            </div>
          </form>
        </div>
      )}

      {transactions.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No transactions recorded"
          description="Record a financial invoice, customer payment, or infrastructure expense to populate your ledger."
          actionLabel="Record Transaction"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable
          data={transactions}
          columns={columns}
          keyExtractor={(t: any, idx: number) => `tx_${t.id || idx}`}
          searchableKey="customer"
          searchPlaceholder="Filter transactions by account name..."
        />
      )}
    </div>
  );
}
