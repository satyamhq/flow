'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const { currentOrg, tasks, setIsCreateOpen, setCreateType } = useFlow();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Plan & Align', href: '#' },
          { label: 'Operating Calendar' },
        ]}
        title="Company Operating Calendar"
        description="Scheduled milestones, release windows, customer renewals, and team deliverables."
        badge={<Badge variant="info">Synced with Google Workspace</Badge>}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setCreateType('task');
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Schedule Event
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-[#8AB4F8]" />
            <span>Upcoming Deadlines & Releases</span>
          </CardTitle>
          <span className="text-xs text-[var(--text-secondary)] font-mono">{tasks.length} items scheduled</span>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-[var(--border)]">
            {tasks.map((t) => (
              <div key={t.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs hover:bg-[var(--surface-elevated)]/40 px-2 rounded transition-colors">
                <div>
                  <span className="font-medium text-[var(--text-primary)]">{t.title}</span>
                  <span className="block text-[11px] text-[var(--text-secondary)]">{t.projectName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={t.priority === 'urgent' ? 'error' : t.priority === 'high' ? 'warning' : 'neutral'}>
                    {t.priority}
                  </Badge>
                  <span className="font-mono text-[#8AB4F8] text-[11px]">{t.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
