'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Milestone, ChevronRight, CheckCircle2, TrendingUp, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function OKRsPage() {
  const { currentOrg, goals, setIsCreateOpen, setCreateType } = useFlow();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Strategy & Execution', href: '#' },
          { label: 'OKRs & Objectives' },
        ]}
        title="Objectives & Key Results (OKRs)"
        description="Hierarchical strategic objectives, department key results, and goal alignment."
        badge={
          <Badge variant={goals.length > 0 ? 'info' : 'neutral'}>
            {goals.length} Active Objective{goals.length === 1 ? '' : 's'}
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setCreateType('goal');
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Objective
          </Button>
        }
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Milestone}
          title="No strategic OKRs defined"
          description="Create company-level objectives and measurable key results to track organizational execution."
          actionLabel="Add Objective"
          onAction={() => {
            setCreateType('goal');
            setIsCreateOpen(true);
          }}
        />
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-sm font-semibold">{goal.title}</CardTitle>
                    <Badge variant={goal.status === 'on_track' ? 'success' : goal.status === 'at_risk' ? 'warning' : 'neutral'}>
                      {goal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">{goal.description || 'Company strategic objective.'}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">{goal.progress}%</span>
                    <div className="w-24 h-1.5 bg-[var(--surface-elevated)] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {goal.keyResults && goal.keyResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {goal.keyResults.map((kr) => (
                    <div key={kr.id} className="p-3 rounded bg-[var(--surface-elevated)] border border-[var(--border)] space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[var(--text-primary)]">{kr.title}</span>
                        <Badge variant="neutral">{kr.status.replace('_', ' ')}</Badge>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                        {kr.currentValue} / {kr.targetValue} {kr.unit}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[var(--text-secondary)] italic">No key results linked yet.</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
