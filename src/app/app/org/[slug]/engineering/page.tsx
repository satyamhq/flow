'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Server, Activity, ShieldCheck, Zap, Code2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface EngineeringDeployment {
  sha: string;
  msg: string;
  env: string;
  status: 'success' | 'failed' | 'building';
  author: string;
  duration: string;
  time: string;
}

export default function EngineeringPage() {
  const { currentOrg } = useFlow();

  const deployments: EngineeringDeployment[] = [
    {
      sha: 'a4f910e',
      msg: 'feat(rls): optimize multi-tenant query plan with partial index',
      env: 'production',
      status: 'success',
      author: 'Marcus Chen',
      duration: '42s',
      time: '18m ago',
    },
    {
      sha: 'e92bc04',
      msg: 'perf(edge): configure stale-while-revalidate headers on telemetry',
      env: 'production',
      status: 'success',
      author: 'Satyam',
      duration: '38s',
      time: '2h ago',
    },
    {
      sha: '71d9a22',
      msg: 'test(iam): add SCIM de-provisioning unit test suite',
      env: 'preview',
      status: 'success',
      author: 'Elena Rostova',
      duration: '1m 12s',
      time: '5h ago',
    },
  ];

  const columns: Column<EngineeringDeployment>[] = [
    {
      header: 'Deployment Commit',
      accessorKey: 'msg',
      sortable: true,
      cell: (d) => (
        <div className="flex items-center space-x-2.5">
          <Badge variant="info" dot>
            {d.sha}
          </Badge>
          <div>
            <span className="font-semibold text-[#EDF2F7]">{d.msg}</span>
            <span className="block text-[11px] text-[#9AA0A6]">by {d.author}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Environment',
      accessorKey: 'env',
      sortable: true,
      cell: (d) => <span className="font-mono text-xs text-[#9AA0A6] uppercase">{d.env}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (d) => (
        <Badge variant={d.status === 'success' ? 'success' : 'error'} dot>
          {d.status}
        </Badge>
      ),
    },
    {
      header: 'Build Duration',
      accessorKey: 'duration',
      sortable: true,
      cell: (d) => <span className="font-mono text-xs text-[#9AA0A6]">{d.duration}</span>,
    },
    {
      header: 'Time',
      accessorKey: 'time',
      sortable: true,
      cell: (d) => <span className="font-mono text-xs text-[#9AA0A6]">{d.time}</span>,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Engineering' },
        ]}
        title="Engineering Operations"
        description="GitHub continuous integration, deployment verification, P95 telemetry, and reliability metrics."
        badge={
          <Badge variant="success" dot>
            GitHub: satyamhq/flow
          </Badge>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="P95 Response Latency"
          value="185ms"
          delta="<200ms Target"
          deltaType="positive"
          subText="Measured across 4.8M API requests"
          icon={Activity}
        />
        <MetricCard
          title="Deployment Success Rate"
          value="99.4%"
          delta="452 Ships"
          deltaType="positive"
          subText="Vercel production edge cluster"
          icon={Server}
        />
        <MetricCard
          title="Mean Time to Resolve"
          value="14 mins"
          delta="Automated Rollbacks"
          deltaType="positive"
          subText="Instant zero-downtime failover"
          icon={Zap}
        />
        <MetricCard
          title="Active P0 Incidents"
          value="0 P0"
          delta="100% Retained"
          deltaType="positive"
          subText="99.98% Service Level Agreement"
          icon={ShieldCheck}
        />
      </div>

      <DataTable
        data={deployments}
        columns={columns}
        keyExtractor={(d) => d.sha}
        searchableKey="msg"
        searchPlaceholder="Filter deployments by commit message..."
      />
    </div>
  );
}
