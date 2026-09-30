'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Plus, DollarSign, Target, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/flow';

export default function SalesPage() {
  const { currentOrg, leads, setIsCreateOpen, setCreateType } = useFlow();

  const stages: Lead['stage'][] = ['lead', 'qualified', 'demo', 'proposal', 'negotiation', 'won'];

  const totalPipeline = leads
    .filter((l) => l.stage !== 'won' && l.stage !== 'lost')
    .reduce((sum, l) => sum + l.value, 0);

  const weightedPipeline = leads
    .filter((l) => l.stage !== 'won' && l.stage !== 'lost')
    .reduce((sum, l) => sum + (l.value * l.probability) / 100, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Sales CRM' },
        ]}
        title="Enterprise Sales Pipeline"
        description="Stage progression, deal values, probability forecasting, and next actionable steps."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setCreateType('lead');
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </Button>
        }
      />

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Pipeline Value"
          value={formatCurrency(totalPipeline)}
          subText={`${leads.length} active enterprise deals`}
          icon={DollarSign}
        />
        <MetricCard
          title="Weighted Forecast"
          value={formatCurrency(weightedPipeline)}
          delta="+18% QoQ"
          deltaType="positive"
          subText="Weighted by stage close probabilities"
          icon={TrendingUp}
        />
        <MetricCard
          title="Average Deal Size (ACV)"
          value={formatCurrency(totalPipeline / (leads.length || 1))}
          subText="Enterprise Expansion Focus"
          icon={Target}
        />
      </div>

      {/* CRM Pipeline Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          const stageValue = stageLeads.reduce((sum, l) => sum + l.value, 0);

          return (
            <div key={stage} className="bg-[#111622] border border-[#202637] rounded-lg p-3 min-w-[210px] space-y-3">
              <div className="pb-2 border-b border-[#181E2E] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#EDF2F7] uppercase tracking-wider capitalize">
                    {stage}
                  </span>
                  <span className="block text-[10px] font-mono text-[#9AA0A6]">
                    {formatCurrency(stageValue)}
                  </span>
                </div>
                <Badge variant="neutral">{stageLeads.length}</Badge>
              </div>

              <div className="space-y-2">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 rounded bg-[#161D2D] border border-[#202637] hover:border-[#1A73E8]/40 transition-colors space-y-2"
                  >
                    <div>
                      <span className="text-xs font-semibold text-[#EDF2F7]">{lead.company}</span>
                      <span className="block text-[11px] text-[#9AA0A6]">{lead.name}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#8AB4F8]">{formatCurrency(lead.value)}</span>
                      <span className="text-[10px] text-[#9AA0A6]">{lead.probability}% prob</span>
                    </div>

                    <div className="pt-1.5 border-t border-[#181E2E] text-[10px] text-[#9AA0A6]">
                      <span className="text-[#5F6368] font-medium">Next:</span> {lead.nextAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
