'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Milestone, Calendar, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RoadmapPage() {
  const { currentOrg, projects, setIsCreateOpen, setCreateType } = useFlow();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Plan & Align', href: '#' },
          { label: 'Roadmap' },
        ]}
        title="Cross-Company Milestone Roadmap"
        description="Quarterly milestone trajectories across Engineering, Product, and GTM."
        badge={<Badge variant="info">Q3-Q4 2026 Commitments</Badge>}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setCreateType('project');
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Milestone
          </Button>
        }
      />

      <div className="space-y-4">
        {projects.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[var(--text-primary)]">{p.name}</span>
                  <Badge variant={p.priority === 'urgent' ? 'error' : p.priority === 'high' ? 'warning' : 'neutral'}>
                    {p.priority}
                  </Badge>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{p.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[var(--text-secondary)] font-mono text-[11px]">
                  {p.startDate} → {p.dueDate}
                </span>
                <Badge variant={p.progress > 70 ? 'success' : 'info'}>
                  {p.progress}% Complete
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
