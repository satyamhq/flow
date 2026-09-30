'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  DollarSign,
  User,
  Calendar,
  Layers,
  FileText,
  Activity,
  Plus,
  ArrowLeft,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';

export default function ProjectDetailPage() {
  const params = useParams();
  const { currentOrg, projects, tasks, updateTaskStatus, setIsCreateOpen, setCreateType } = useFlow();
  const [activeTab, setActiveTab] = useState('overview');

  const projectId = (params?.id as string) || projects[0]?.id;
  const project = projects.find((p) => p.id === projectId) || projects[0];
  const projectTasks = tasks.filter((t) => t.projectId === project?.id);

  if (!project) {
    return (
      <div className="space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Flow Console', href: '/app/org/acme' },
            { label: 'Projects', href: `/app/org/${currentOrg.slug}/projects` },
            { label: 'Not Found' },
          ]}
          title="Project Not Found"
          description="The requested project resource does not exist or has been archived."
        />
        <EmptyState
          title="Project Not Found"
          description="Could not locate project details for this ID."
          action={{
            label: 'Back to Projects',
            onClick: () => window.history.back(),
          }}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks', count: projectTasks.length },
    { id: 'timeline', label: 'Timeline' },
    { id: 'documents', label: 'Documents' },
    { id: 'activity', label: 'Audit Trail' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Projects', href: `/app/org/${currentOrg.slug}/projects` },
          { label: project.name },
        ]}
        title={project.name}
        description={project.description}
        badge={
          <div className="flex items-center space-x-2">
            <Badge variant={project.status === 'in_progress' ? 'info' : project.status === 'completed' ? 'success' : 'neutral'}>
              {project.status.replace('_', ' ')}
            </Badge>
            <Badge variant={project.priority === 'urgent' ? 'error' : project.priority === 'high' ? 'warning' : 'neutral'}>
              {project.priority} priority
            </Badge>
          </div>
        }
        actions={
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateType('task');
                setIsCreateOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Task
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCreateType('project');
                setIsCreateOpen(true);
              }}
            >
              Edit Project
            </Button>
          </div>
        }
        tabs={
          <Tabs
            tabs={tabs.map((t) => ({ id: t.id, label: t.label, badge: t.count }))}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        }
      />

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Execution Progress"
          value={`${project.progress}%`}
          subText={`${projectTasks.filter((t) => t.status === 'done').length}/${projectTasks.length} tasks complete`}
          icon={<TrendingUp className="w-4 h-4 text-[#8AB4F8]" />}
        />
        <MetricCard
          title="Target Deadline"
          value={project.dueDate}
          delta={{ value: 'On schedule', isPositive: true }}
          icon={<Calendar className="w-4 h-4 text-[#81C995]" />}
        />
        <MetricCard
          title="Resource Lead"
          value={project.ownerName}
          subText={project.team}
          icon={<User className="w-4 h-4 text-[#FDD663]" />}
        />
        <MetricCard
          title="Budget Spent"
          value={formatCurrency(project.budgetSpent)}
          subText={`Allocated: ${formatCurrency(project.budgetAllocated)}`}
          icon={<DollarSign className="w-4 h-4 text-[#8AB4F8]" />}
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-[#8AB4F8]" />
                  <span>Project Specification & Scope</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                  This project represents a mission-critical infrastructure milestone for Flow. It unifies high-density navigation, multi-tenant Postgres RLS policies, sub-100ms client caching, and universal command palette integration.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[var(--border)] text-xs">
                  <div>
                    <span className="text-[var(--text-secondary)] block text-[11px]">Start Date</span>
                    <span className="text-[var(--text-primary)] font-mono">{project.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block text-[11px]">Department</span>
                    <span className="text-[var(--text-primary)] font-medium">{project.team}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block text-[11px]">Priority Tier</span>
                    <span className="text-[var(--text-primary)] uppercase font-mono">{project.priority}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8AB4F8]" />
                  <span>Work Items Snapshot</span>
                </CardTitle>
                <span className="text-xs text-[var(--text-secondary)] font-mono">{projectTasks.length} items</span>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-[var(--border)]">
                  {projectTasks.map((t) => (
                    <div key={t.id} className="py-3 flex items-center justify-between hover:bg-[var(--surface-elevated)]/40 px-2 rounded transition-colors">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateTaskStatus(t.id, t.status === 'done' ? 'todo' : 'done')}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                            t.status === 'done' ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : 'border-[#3C4043] hover:border-[#8AB4F8]'
                          }`}
                        >
                          {t.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <span className={`text-xs font-medium ${t.status === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                          {t.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={t.priority === 'urgent' ? 'error' : t.priority === 'high' ? 'warning' : 'neutral'}>
                          {t.priority}
                        </Badge>
                        <span className="text-[11px] text-[var(--text-secondary)] font-mono">{t.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Strategic Goal Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-[var(--text-primary)]">
                  Connected to <span className="text-[#8AB4F8] font-medium">Reach $20M ARR with 85% Gross Margin</span>.
                </p>
                <div className="pt-2">
                  <Badge variant="success">OKRs Aligned (100%)</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Audit History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                  <div className="p-2.5 rounded bg-[var(--surface-header)] border border-[var(--border)]">
                    <span className="text-[var(--text-primary)] font-medium">Satyam</span> updated project progress to {project.progress}%
                    <span className="block text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">14 minutes ago</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--surface-header)] border border-[var(--border)]">
                    <span className="text-[var(--text-primary)] font-medium">Marcus Chen</span> approved deployment #452
                    <span className="block text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">Yesterday at 4:18 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">All Project Tasks</CardTitle>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setCreateType('task');
                setIsCreateOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Task
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-[var(--border)]">
              {projectTasks.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between hover:bg-[var(--surface-elevated)]/40 px-2 rounded transition-colors">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateTaskStatus(t.id, t.status === 'done' ? 'todo' : 'done')}
                      className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                        t.status === 'done' ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : 'border-[#3C4043]'
                      }`}
                    >
                      {t.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`text-xs font-medium ${t.status === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <Badge variant={t.priority === 'urgent' ? 'error' : t.priority === 'high' ? 'warning' : 'neutral'}>
                      {t.priority}
                    </Badge>
                    <span className="text-[var(--text-secondary)] font-mono text-[11px]">{t.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'timeline' && (
        <Card>
          <CardContent className="p-8 text-center text-xs text-[var(--text-secondary)] space-y-3">
            <Calendar className="w-8 h-8 text-[#8AB4F8] mx-auto" />
            <p className="font-semibold text-sm text-[var(--text-primary)]">Gantt & Execution Timeline</p>
            <p className="max-w-md mx-auto">Phase 1 (Complete) → Phase 2: RLS Testing (Active) → Phase 3: GA Rollout (Oct 15)</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card>
          <CardContent className="p-8 text-center text-xs text-[var(--text-secondary)] space-y-3">
            <FileText className="w-8 h-8 text-[#8AB4F8] mx-auto" />
            <p className="font-semibold text-sm text-[var(--text-primary)]">Linked Documentation</p>
            <p className="max-w-md mx-auto">Architecture RFC 042: Multi-tenant partitioning & Vercel edge caching rules.</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Immutable Audit Trail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded bg-[var(--surface-header)] border border-[var(--border)] text-xs">
              <span className="text-[var(--text-primary)] font-medium">Task Completed</span> by Marcus Chen
              <span className="block text-[11px] text-[var(--text-secondary)] mt-0.5 font-mono">Yesterday at 4:18 PM</span>
            </div>
            <div className="p-3 rounded bg-[var(--surface-header)] border border-[var(--border)] text-xs">
              <span className="text-[var(--text-primary)] font-medium">Budget Updated</span> by Satyam
              <span className="block text-[11px] text-[var(--text-secondary)] mt-0.5 font-mono">3 days ago</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
