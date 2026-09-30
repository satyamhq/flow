'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { GitBranch, Plus, ArrowRight, Zap, CheckCircle2, Play } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AutomationsPage() {
  const { currentOrg } = useFlow();

  const workflows = [
    {
      name: 'High-Value Customer Onboarding Pipeline',
      trigger: 'When Customer ARR > $100,000 is marked Won',
      condition: 'Tier == "enterprise" OR Tier == "strategic"',
      action: 'Create Dedicated Customer Project + Notify CEO + Provision Slack Connect Channel',
      runs: 42,
      lastRun: '2 hours ago',
      active: true,
    },
    {
      name: 'Automated Security Incident Pager Escalation',
      trigger: 'When Sentry P0 Error OR Penetration Test Alert fires',
      condition: 'Severity == "Critical"',
      action: 'Escalate to VP of Eng on Call + Lock Affected API Session Tokens',
      runs: 7,
      lastRun: '5 days ago',
      active: true,
    },
    {
      name: 'AI Weekly Strategic Executive Digest',
      trigger: 'Every Friday at 5:00 PM EST',
      condition: 'All Telemetry Ingestion Complete',
      action: 'Synthesize Cross-Department Metrics & Dispatch Flow AI Executive Briefing',
      runs: 38,
      lastRun: 'Sep 26, 2026',
      active: true,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Platform & Automations', href: '#' },
          { label: 'Workflows' },
        ]}
        title="Autonomous Event-Driven Workflows"
        description="Event-driven triggers, conditional logic gates, and cross-platform actions connecting company systems."
        badge={<Badge variant="success">3 Workflows Active</Badge>}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Workflow
          </Button>
        }
      />

      {/* Visual Workflow Cards */}
      <div className="space-y-4">
        {workflows.map((w, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0D904F]" />
                <CardTitle className="text-sm font-semibold">{w.name}</CardTitle>
              </div>
              <span className="text-xs font-mono text-[#9AA0A6]">
                {w.runs} executions • Last run {w.lastRun}
              </span>
            </CardHeader>

            <CardContent>
              {/* Visual Pipeline Nodes: TRIGGER -> CONDITION -> ACTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded bg-[#0E131F] border border-[#202637] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8AB4F8] font-semibold tracking-wider block">
                    Trigger
                  </span>
                  <p className="text-xs text-[#EDF2F7]">{w.trigger}</p>
                </div>

                <div className="p-3 rounded bg-[#0E131F] border border-[#202637] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#FDD663] font-semibold tracking-wider block">
                    Condition Filter
                  </span>
                  <p className="text-xs text-[#EDF2F7]">{w.condition}</p>
                </div>

                <div className="p-3 rounded bg-[#0E131F] border border-[#202637] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#81C995] font-semibold tracking-wider block">
                    Automated Action
                  </span>
                  <p className="text-xs text-[#EDF2F7]">{w.action}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
