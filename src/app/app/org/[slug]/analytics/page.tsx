'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { BarChart3, TrendingUp, Filter, Download, ArrowUpRight, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';

export default function AnalyticsPage() {
  const { currentOrg, projects, tasks, customers, transactions, setIsCreateOpen, setCreateType } = useFlow();
  const [metricType, setMetricType] = useState('tasks');

  const tabs = [
    { id: 'tasks', label: 'Work Items (Status)' },
    { id: 'projects', label: 'Projects (Progress)' },
    { id: 'revenue', label: 'Customer ARR by Tier' },
  ];

  const hasData = tasks.length > 0 || projects.length > 0 || customers.length > 0;

  // Real aggregations
  const taskStatusCounts = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    blocked: tasks.filter((t) => t.status === 'blocked').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  const projectStatusCounts = {
    planned: projects.filter((p) => p.status === 'planned').length,
    in_progress: projects.filter((p) => p.status === 'in_progress').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  };

  const customerTierArr = {
    starter: customers.filter((c) => c.tier === 'starter').reduce((sum, c) => sum + (c.arr || 0), 0),
    growth: customers.filter((c) => c.tier === 'growth').reduce((sum, c) => sum + (c.arr || 0), 0),
    enterprise: customers.filter((c) => c.tier === 'enterprise').reduce((sum, c) => sum + (c.arr || 0), 0),
    strategic: customers.filter((c) => c.tier === 'strategic').reduce((sum, c) => sum + (c.arr || 0), 0),
  };

  const totalArr = customers.reduce((sum, c) => sum + (c.arr || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Intelligence & Telemetry', href: '#' },
          { label: 'Analytics' },
        ]}
        title="Analytics & Telemetry Explorer"
        description="Real database aggregation across tasks, strategic projects, and customer accounts."
        badge={
          <Badge variant={hasData ? 'success' : 'neutral'}>
            {hasData ? 'Aggregated Telemetry' : 'Zero Records'}
          </Badge>
        }
        tabs={
          <Tabs
            tabs={tabs}
            activeTab={metricType}
            onChange={setMetricType}
          />
        }
      />

      {/* Visualization Canvas */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
          <div>
            <CardTitle className="text-sm font-semibold">
              {metricType === 'tasks' && 'Work Items Distribution by Lifecycle State'}
              {metricType === 'projects' && 'Active Strategic Projects by Execution State'}
              {metricType === 'revenue' && 'Direct Customer ARR Allocation by Account Tier'}
            </CardTitle>
            <span className="text-[11px] text-[#9AA0A6] font-mono">Aggregated directly from verified organization records</span>
          </div>

          <Badge variant={hasData ? 'info' : 'neutral'}>
            {metricType === 'tasks' && `${tasks.length} Total Tasks`}
            {metricType === 'projects' && `${projects.length} Total Projects`}
            {metricType === 'revenue' && `${formatCurrency(totalArr)} Total ARR`}
          </Badge>
        </CardHeader>

        <CardContent>
          {!hasData ? (
            <EmptyState
              title="Not enough data yet"
              description="Create projects, tasks, or customer records in this organization to see real-time analytics."
              actionLabel="Create Task"
              onAction={() => {
                setCreateType('task');
                setIsCreateOpen(true);
              }}
            />
          ) : (
            <div className="h-64 flex items-end justify-around gap-6 pt-6 px-4">
              {metricType === 'tasks' && [
                { label: 'To Do', count: taskStatusCounts.todo, color: 'bg-[#5F6368]' },
                { label: 'In Progress', count: taskStatusCounts.in_progress, color: 'bg-[#1A73E8]' },
                { label: 'Blocked', count: taskStatusCounts.blocked, color: 'bg-[#EA4335]' },
                { label: 'Done', count: taskStatusCounts.done, color: 'bg-[#34A853]' },
              ].map((item, idx) => {
                const max = Math.max(tasks.length, 1);
                const heightPct = Math.round((item.count / max) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end max-w-[120px]">
                    <span className="text-[11px] font-mono text-[#EDF2F7] font-semibold">{item.count}</span>
                    <div
                      className={`w-full ${item.color} rounded-t transition-all duration-300 min-h-[4px]`}
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                    <span className="text-[11px] text-[#9AA0A6] font-medium text-center">{item.label}</span>
                  </div>
                );
              })}

              {metricType === 'projects' && [
                { label: 'Planned', count: projectStatusCounts.planned, color: 'bg-[#5F6368]' },
                { label: 'In Progress', count: projectStatusCounts.in_progress, color: 'bg-[#1A73E8]' },
                { label: 'Completed', count: projectStatusCounts.completed, color: 'bg-[#34A853]' },
              ].map((item, idx) => {
                const max = Math.max(projects.length, 1);
                const heightPct = Math.round((item.count / max) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end max-w-[140px]">
                    <span className="text-[11px] font-mono text-[#EDF2F7] font-semibold">{item.count}</span>
                    <div
                      className={`w-full ${item.color} rounded-t transition-all duration-300 min-h-[4px]`}
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                    <span className="text-[11px] text-[#9AA0A6] font-medium text-center">{item.label}</span>
                  </div>
                );
              })}

              {metricType === 'revenue' && [
                { label: 'Starter', val: customerTierArr.starter, color: 'bg-[#8AB4F8]' },
                { label: 'Growth', val: customerTierArr.growth, color: 'bg-[#1A73E8]' },
                { label: 'Enterprise', val: customerTierArr.enterprise, color: 'bg-[#185ABC]' },
                { label: 'Strategic', val: customerTierArr.strategic, color: 'bg-[#34A853]' },
              ].map((item, idx) => {
                const max = Math.max(totalArr, 1);
                const heightPct = Math.round((item.val / max) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end max-w-[120px]">
                    <span className="text-[10px] font-mono text-[#EDF2F7] font-semibold truncate">
                      {formatCurrency(item.val)}
                    </span>
                    <div
                      className={`w-full ${item.color} rounded-t transition-all duration-300 min-h-[4px]`}
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                    <span className="text-[11px] text-[#9AA0A6] font-medium text-center">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
