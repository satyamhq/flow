'use client';

import React from 'react';
import Link from 'next/link';
import { useFlow } from '@/context/flow-context';
import {
  DollarSign,
  Users,
  Activity,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  FolderKanban,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function OverviewPage() {
  const { currentOrg, currentUser, dateRange, setDateRange, projects, insights, setIsCreateOpen, setCreateType } = useFlow();

  const metrics = currentOrg.metrics || {
    arr: 15700000,
    mrr: 1308333,
    revenueGrowth: 18.4,
    burnRate: 210000,
    runwayMonths: 36,
    grossMargin: 84.5,
    totalCustomers: 142,
    netRetentionRate: 134,
    healthScore: 94,
  };

  const ranges = ['Today', '7 days', '30 days', 'Quarter', 'Year'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Company Overview' },
        ]}
        title={`Good morning, ${currentUser.fullName}.`}
        description={`${currentOrg.name} is operating at ${metrics.healthScore}% health index. Multi-tenant telemetry and autonomous intelligence online.`}
        badge={
          <Badge variant="success" dot>
            {metrics.healthScore}% Health Index
          </Badge>
        }
        actions={
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-[#111622] border border-[#202637] rounded-md p-0.5 text-xs">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    dateRange === r
                      ? 'bg-[#1A73E8] text-white font-medium shadow-sm'
                      : 'text-[#9AA0A6] hover:text-[#EDF2F7]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateType('task');
                setIsCreateOpen(true);
              }}
            >
              <Zap className="w-3.5 h-3.5 text-[#8AB4F8]" />
              <span>Quick Action</span>
            </Button>
          </div>
        }
      />

      {/* Primary KPI Strip using MetricCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Run-Rate ARR"
          value={formatCurrency(metrics.arr)}
          delta={`+${metrics.revenueGrowth}%`}
          deltaType="positive"
          subText={`MRR: ${formatCurrency(metrics.mrr)} • NRR: ${metrics.netRetentionRate}%`}
          icon={DollarSign}
        />
        <MetricCard
          title="Active Customers"
          value={metrics.totalCustomers}
          delta="+14% QoQ"
          deltaType="positive"
          subText="Enterprise: 42 • ACV: $110,500"
          icon={Users}
        />
        <MetricCard
          title="Cash Runway"
          value={`${metrics.runwayMonths} Mo`}
          delta="Top Quartile"
          deltaType="positive"
          subText={`Burn: $210k/mo • Margin: ${metrics.grossMargin}%`}
          icon={Activity}
        />
        <MetricCard
          title="Platform Reliability"
          value="99.98%"
          delta="P95: 185ms"
          deltaType="positive"
          subText="Deployments: 452 • 0 P0 Incidents"
          icon={ShieldCheck}
        />
      </div>

      {/* Flow AI Contextual Intelligence Insight Card */}
      {insights.length > 0 && (
        <div className="bg-[rgba(26,115,232,0.06)] border border-[rgba(26,115,232,0.25)] rounded-lg p-4 shadow-sm space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded bg-[rgba(26,115,232,0.14)] text-[#8AB4F8]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="info">Flow AI • {insights[0].category}</Badge>
                  <span className="text-[11px] text-[#9AA0A6]">{insights[0].timestamp}</span>
                </div>
                <h3 className="text-xs font-semibold text-[#EDF2F7] mt-1">{insights[0].title}</h3>
              </div>
            </div>

            <Link
              href={`/app/org/${currentOrg.slug}/flow-ai`}
              className="text-xs text-[#8AB4F8] hover:underline font-medium flex items-center space-x-1"
            >
              <span>Explore Intelligence</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-xs text-[#9AA0A6] pl-8 leading-relaxed">
            {insights[0].summary}
          </p>

          <div className="pl-8 pt-2 border-t border-[#181E2E] flex flex-wrap items-center gap-4 text-[11px] text-[#9AA0A6]">
            <div>
              <span className="font-medium text-[#EDF2F7]">Evidence: </span>
              <span>{insights[0].supportingData}</span>
            </div>
            <div>
              <span className="font-medium text-[#EDF2F7]">Action: </span>
              <span className="text-[#34A853] font-medium">{insights[0].recommendedAction}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Layout: Active Projects & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-4 h-4 text-[#8AB4F8]" />
              <CardTitle>Active Strategic Projects</CardTitle>
            </div>
            <Link
              href={`/app/org/${currentOrg.slug}/projects`}
              className="text-xs text-[#8AB4F8] hover:underline flex items-center space-x-1"
            >
              <span>View all ({projects.length})</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-[#181E2E]">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flow-table-row transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/app/org/${currentOrg.slug}/projects/${p.id}`}
                      className="text-xs font-semibold text-[#EDF2F7] hover:text-[#8AB4F8] transition-colors"
                    >
                      {p.name}
                    </Link>
                    <Badge variant={p.priority === 'urgent' ? 'error' : p.priority === 'high' ? 'warning' : 'neutral'}>
                      {p.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#9AA0A6] line-clamp-1">{p.description}</p>
                </div>

                <div className="flex items-center space-x-4 text-xs flex-shrink-0">
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-[#EDF2F7]">{p.progress}%</span>
                    <div className="w-20 h-1.5 bg-[#161D2D] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-[#9AA0A6]">
                    <span className="font-mono text-[#EDF2F7]">Due {p.dueDate}</span>
                    <span className="block text-[10px] text-[#5F6368]">{p.team}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Needs Attention */}
        <Card className="space-y-3">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#FBBC04]" />
              <CardTitle>Needs Attention</CardTitle>
            </div>
            <Badge variant="warning">3 Items</Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="p-3 rounded bg-[#161D2D] border border-[#202637] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#FBBC04]">Blocked Critical Task</span>
                <span className="text-[10px] text-[#9AA0A6] font-mono">P0 Impact</span>
              </div>
              <p className="text-[11px] text-[#EDF2F7]">
                Executive ROI deck with Fortune 100 prospect requires pricing signoff.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-[#9AA0A6]">
                <span>Owner: Satyam</span>
                <Link href={`/app/org/${currentOrg.slug}/tasks`} className="text-[#8AB4F8] hover:underline">
                  Unblock →
                </Link>
              </div>
            </div>

            <div className="p-3 rounded bg-[#161D2D] border border-[#202637] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#EA4335]">CAC Acceleration Alert</span>
                <span className="text-[10px] text-[#9AA0A6] font-mono">+11.2% CAC</span>
              </div>
              <p className="text-[11px] text-[#EDF2F7]">
                LinkedIn Ads cost per lead reached $685 against $550 benchmark.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-[#9AA0A6]">
                <span>Channel: LinkedIn Ads</span>
                <Link href={`/app/org/${currentOrg.slug}/marketing`} className="text-[#8AB4F8] hover:underline">
                  Adjust budget →
                </Link>
              </div>
            </div>

            <div className="p-3 rounded bg-[#161D2D] border border-[#202637] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#8AB4F8]">Compliance Audit Signoff</span>
                <span className="text-[10px] text-[#9AA0A6] font-mono">Due in 4 days</span>
              </div>
              <p className="text-[11px] text-[#EDF2F7]">
                SOC-2 auditor requires confirmation of automated backup encryption.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-[#9AA0A6]">
                <span>Auditor: A-LIGN</span>
                <Link href={`/app/org/${currentOrg.slug}/admin?tab=security`} className="text-[#8AB4F8] hover:underline">
                  Review audit →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
