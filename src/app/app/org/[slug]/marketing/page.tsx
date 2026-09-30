'use client';

import React, { useState, useEffect } from 'react';
import { useFlow } from '@/context/flow-context';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

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
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formChannel, setFormChannel] = useState('');
  const [formBudget, setFormBudget] = useState(5000);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_campaigns`);
      if (stored) {
        setCampaigns(JSON.parse(stored));
      } else {
        setCampaigns([]);
      }
    } catch {
      setCampaigns([]);
    }
  }, [currentOrg.id]);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newCamp: CampaignRow = {
      name: formName.trim(),
      channel: formChannel.trim() || 'Direct Inbound',
      budget: Number(formBudget) || 1000,
      spend: 0,
      leads: 0,
      cac: 0,
      roi: 0,
      status: 'active',
    };

    const updated = [newCamp, ...campaigns];
    setCampaigns(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_campaigns`, JSON.stringify(updated));
    } catch {}

    setFormName('');
    setFormChannel('');
    setIsModalOpen(false);
  };

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
      header: 'Customer Acquisition Cost',
      accessorKey: 'cac',
      sortable: true,
      cell: (c) => (
        <span className="font-mono text-xs text-[#EDF2F7]">
          {c.cac > 0 ? `$${c.cac}` : '—'}
        </span>
      ),
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
        title="Marketing Operations"
        description="Campaign telemetry, multi-channel acquisition tracking, and pipeline attribution."
        badge={
          <Badge variant={campaigns.length > 0 ? 'success' : 'neutral'} dot>
            {campaigns.length} Campaigns
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Campaign
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[#111622] border border-[#202637] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[#EDF2F7]">Launch New Acquisition Campaign</h3>
          <form onSubmit={handleCreateCampaign} className="space-y-3">
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Campaign Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Q4 Developer Outbound"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#9AA0A6] block mb-1">Channel</label>
                <input
                  type="text"
                  value={formChannel}
                  onChange={(e) => setFormChannel(e.target.value)}
                  placeholder="e.g. Google Search"
                  className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#9AA0A6] block mb-1">Budget ($)</label>
                <input
                  type="number"
                  value={formBudget}
                  onChange={(e) => setFormBudget(Number(e.target.value))}
                  className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Create Campaign
              </Button>
            </div>
          </form>
        </div>
      )}

      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Create your first marketing or acquisition campaign to track spend, leads, and CAC."
          actionLabel="New Campaign"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable
          data={campaigns}
          columns={columns}
          keyExtractor={(c) => c.name}
          searchableKey="name"
          searchPlaceholder="Filter campaigns by name..."
        />
      )}
    </div>
  );
}
