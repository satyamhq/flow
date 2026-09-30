'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFlow } from '@/context/flow-context';
import { Server, Activity, ShieldCheck, Zap, Code2, Plus, GitBranch } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

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
  const { currentOrg, integrations, currentUser } = useFlow();
  const [deployments, setDeployments] = useState<EngineeringDeployment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [formEnv, setFormEnv] = useState('production');

  const githubIntegration = integrations.find((i) => i.id === 'github');
  const isConnected = githubIntegration?.status === 'connected';

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_deployments`);
      if (stored) {
        setDeployments(JSON.parse(stored));
      } else {
        setDeployments([]);
      }
    } catch {
      setDeployments([]);
    }
  }, [currentOrg.id]);

  const handleRecordDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMsg.trim()) return;

    const newDep: EngineeringDeployment = {
      sha: Math.random().toString(16).substring(2, 9),
      msg: formMsg.trim(),
      env: formEnv,
      status: 'success',
      author: currentUser.fullName,
      duration: '34s',
      time: 'Just now',
    };

    const updated = [newDep, ...deployments];
    setDeployments(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_deployments`, JSON.stringify(updated));
    } catch {}

    setFormMsg('');
    setIsModalOpen(false);
  };

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
        description="Deployment verification, commit streams, CI/CD telemetry, and reliability metrics."
        badge={
          <Badge variant={isConnected ? 'success' : 'neutral'} dot>
            GitHub: {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        }
        actions={
          <div className="flex items-center space-x-2">
            {!isConnected ? (
              <Link href={`/app/org/${currentOrg.slug}/integrations`}>
                <Button variant="secondary" size="sm">
                  <GitBranch className="w-4 h-4 mr-1.5" />
                  Connect GitHub
                </Button>
              </Link>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Record Deployment
              </Button>
            )}
          </div>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[#111622] border border-[#202637] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[#EDF2F7]">Record Build Deployment</h3>
          <form onSubmit={handleRecordDeployment} className="space-y-3">
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Commit Message</label>
              <input
                type="text"
                required
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
                placeholder="e.g. feat(auth): add Supabase session persistence"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Environment</label>
              <select
                value={formEnv}
                onChange={(e) => setFormEnv(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="preview">Preview</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Log Deployment
              </Button>
            </div>
          </form>
        </div>
      )}

      {!isConnected && deployments.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="GitHub Integration Disconnected"
          description="Connect your GitHub Enterprise or repository account in Integrations to track live deployments and commits."
          actionLabel="Go to Integrations"
          onAction={() => {
            window.location.href = `/app/org/${currentOrg.slug}/integrations`;
          }}
        />
      ) : deployments.length === 0 ? (
        <EmptyState
          icon={Server}
          title="No deployments recorded"
          description="Record a production or preview deployment to start tracking engineering telemetry."
          actionLabel="Record Deployment"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable
          data={deployments}
          columns={columns}
          keyExtractor={(d) => d.sha}
          searchableKey="msg"
          searchPlaceholder="Filter deployments by commit message..."
        />
      )}
    </div>
  );
}
