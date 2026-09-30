'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Target, Plus, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function GoalsPage() {
  const { currentOrg, goals, setIsCreateOpen, setCreateType } = useFlow();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Plan & Align', href: '#' },
          { label: 'Company Goals' },
        ]}
        title="Company Goals & Objectives"
        description="Measurable company-wide outcomes tracked across quarterly and annual cadences."
        badge={<Badge variant="info">Active Cadence</Badge>}
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
            Create Goal
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4">
        {goals.map((g) => (
          <Card key={g.id}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#8AB4F8]" />
                <CardTitle className="text-sm font-semibold">{g.title}</CardTitle>
                <Badge variant="neutral">{g.timeframe}</Badge>
              </div>
              <span className="text-xs text-[#9AA0A6] font-mono">Target Date: {g.targetDate}</span>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-xs text-[#9AA0A6]">{g.description}</p>

              {/* Key Results */}
              <div className="space-y-2 pt-3 border-t border-[#202637]">
                <span className="text-[11px] font-semibold text-[#9AA0A6] uppercase tracking-wider block">
                  Key Results & Metrics
                </span>
                {g.keyResults.map((kr) => (
                  <div
                    key={kr.id}
                    className="p-3 rounded bg-[#0E131F] border border-[#202637] flex items-center justify-between text-xs"
                  >
                    <span className="text-[#EDF2F7] font-medium">{kr.title}</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-[#8AB4F8] font-semibold">
                        {kr.currentValue} / {kr.targetValue} {kr.unit}
                      </span>
                      <Badge variant={kr.status === 'on_track' ? 'success' : 'warning'}>
                        {kr.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
