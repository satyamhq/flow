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
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

export default function OverviewPage() {
  const {
    currentOrg,
    currentUser,
    dateRange,
    setDateRange,
    projects,
    tasks,
    customers,
    insights,
    setIsCreateOpen,
    setCreateType,
  } = useFlow();

  const totalArr = customers.reduce((sum, c) => sum + (c.arr || 0), 0);
  const mrr = Math.round(totalArr / 12);
  const activeProjects = projects.filter((p) => p.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'done');
  const blockedTasks = tasks.filter((t) => t.status === 'blocked');
  const hasData = projects.length > 0 || tasks.length > 0 || customers.length > 0;

  const ranges = ['Today', '7 days', '30 days', 'Quarter', 'Year'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Company Overview' },
        ]}
        title={`Good morning, ${currentUser.fullName}.`}
        description={
          hasData
            ? `${currentOrg.name} telemetry active with ${projects.length} project(s), ${tasks.length} task(s), and ${customers.length} customer account(s).`
            : `${currentOrg.name} is ready for initialization. Add real projects or connect integrations to populate telemetry.`
        }
        badge={
          <Badge variant={hasData ? 'success' : 'neutral'} dot>
            {hasData ? 'Telemetry Live' : 'Ready for Ingestion'}
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

      {/* Empty State when no business data exists yet */}
      {!hasData ? (
        <Card className="p-8 text-center space-y-6 max-w-3xl mx-auto border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-[#161D2D] border border-[#202637] flex items-center justify-center mx-auto text-[#8AB4F8]">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#EDF2F7]">Welcome to Flow</h2>
            <p className="text-xs text-[#9AA0A6] max-w-md mx-auto leading-relaxed">
              Your organization doesn&apos;t have any data yet. Create your first project, invite your team, or record a customer to initialize your company operating system.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCreateType('project');
                setIsCreateOpen(true);
              }}
            >
              <FolderKanban className="w-4 h-4 mr-1.5" />
              Create Project
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateType('task');
                setIsCreateOpen(true);
              }}
            >
              <Zap className="w-4 h-4 mr-1.5" />
              Add Task
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateType('customer');
                setIsCreateOpen(true);
              }}
            >
              <DollarSign className="w-4 h-4 mr-1.5" />
              Record Customer
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Primary KPI Strip from Real Database Records */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Run-Rate ARR"
              value={formatCurrency(totalArr)}
              delta={totalArr > 0 ? 'Verified' : 'Zero ARR'}
              deltaType="positive"
              subText={`MRR: ${formatCurrency(mrr)} • ${customers.length} Accounts`}
              icon={DollarSign}
            />
            <MetricCard
              title="Active Customers"
              value={customers.length}
              delta={customers.length > 0 ? `${customers.length} Active` : 'None'}
              deltaType="positive"
              subText="Directly queried from tenant store"
              icon={Users}
            />
            <MetricCard
              title="Active Projects"
              value={projects.length}
              delta={`${activeProjects.length} In Progress`}
              deltaType="positive"
              subText="Scoped to current organization"
              icon={FolderKanban}
            />
            <MetricCard
              title="Work Items"
              value={tasks.length}
              delta={`${completedTasks.length} Completed`}
              deltaType="positive"
              subText={`${blockedTasks.length} Blocked item(s)`}
              icon={Activity}
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

              {projects.length === 0 ? (
                <EmptyState
                  title="No projects yet"
                  description="Create your first strategic project to track progress and team workload."
                  actionLabel="Create Project"
                  onAction={() => {
                    setCreateType('project');
                    setIsCreateOpen(true);
                  }}
                />
              ) : (
                <div className="divide-y divide-[#181E2E]">
                  {projects.slice(0, 5).map((p) => (
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
                        <p className="text-[11px] text-[#9AA0A6] line-clamp-1">{p.description || 'No description provided.'}</p>
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
              )}
            </Card>

            {/* Right: Needs Attention */}
            <Card className="space-y-3">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-[#FBBC04]" />
                  <CardTitle>Needs Attention</CardTitle>
                </div>
                <Badge variant={blockedTasks.length > 0 ? 'warning' : 'success'}>
                  {blockedTasks.length} Blocked
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                {blockedTasks.length === 0 ? (
                  <div className="p-6 text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-[#34A853] mx-auto" />
                    <p className="text-xs font-medium text-[#EDF2F7]">All systems nominal</p>
                    <p className="text-[11px] text-[#9AA0A6]">
                      0 blocked tasks or critical impediments detected in this organization.
                    </p>
                  </div>
                ) : (
                  blockedTasks.map((t) => (
                    <div key={t.id} className="p-3 rounded bg-[#161D2D] border border-[#202637] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#EA4335]">Blocked Work Item</span>
                        <span className="text-[10px] text-[#9AA0A6] font-mono">{t.projectName}</span>
                      </div>
                      <p className="text-[11px] text-[#EDF2F7] line-clamp-2">{t.title}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-[#9AA0A6]">
                        <span>Assigned: {t.assignee?.name || 'Unassigned'}</span>
                        <Link href={`/app/org/${currentOrg.slug}/tasks`} className="text-[#8AB4F8] hover:underline">
                          Review item →
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
