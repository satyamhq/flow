'use client';

import React from 'react';
import Link from 'next/link';
import { useFlow } from '@/context/flow-context';
import { Compass, Target, Shield, Zap, Globe, ArrowRight, Flag, Milestone, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function StrategyPage() {
  const { currentOrg, goals, setIsCreateOpen, setCreateType } = useFlow();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Strategy & Direction', href: '#' },
          { label: 'Company Strategy' },
        ]}
        title="Company Strategic Foundation"
        description={`Core mission, operating stage, and strategic pillars driving ${currentOrg.name}.`}
        badge={<Badge variant="info">{currentOrg.stage} Stage</Badge>}
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
            Add Strategic Goal
          </Button>
        }
      />

      {/* Mission & Positioning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#1A73E8]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#8AB4F8] flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Core Mandate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
              {currentOrg.description || `${currentOrg.name} operates with autonomous clarity across product, engineering, and customer operations.`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#34A853]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#34A853] flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Market Segment & Stage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Industry:</span>
              <span className="font-semibold text-[var(--text-primary)]">{currentOrg.industry}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Operating Tier:</span>
              <span className="font-semibold text-[var(--text-primary)] uppercase">{currentOrg.plan}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Strategic Objectives */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Active Strategic Objectives ({goals.length})
          </h3>
          <Link href={`/app/org/${currentOrg.slug}/okrs`} className="text-xs text-[#8AB4F8] hover:underline">
            View OKR Hierarchy →
          </Link>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            icon={Milestone}
            title="No strategic goals yet"
            description="Create your first strategic milestone or company objective to guide execution."
            actionLabel="Add Strategic Goal"
            onAction={() => {
              setCreateType('goal');
              setIsCreateOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g) => (
              <Card key={g.id} className="space-y-2 p-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-semibold text-[var(--text-primary)]">{g.title}</h4>
                  <Badge variant={g.status === 'on_track' ? 'success' : 'warning'}>
                    {g.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{g.description || 'Strategic objective.'}</p>
                <div className="pt-2 flex justify-between items-center text-[10px] text-[var(--text-secondary)] border-t border-[var(--border)]">
                  <span>Progress: {g.progress}%</span>
                  <span className="font-mono">Target: {g.targetDate || '2026'}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
