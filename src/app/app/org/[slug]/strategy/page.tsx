'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Compass, Target, Shield, Zap, Globe, ArrowRight, Flag } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function StrategyPage() {
  const { currentOrg, goals } = useFlow();

  const priorities = [
    {
      title: 'Enterprise Infrastructure Superiority',
      desc: 'Deliver institutional-grade reliability, sub-200ms global query latency, and zero-trust security architecture.',
      pillar: 'Product & Tech',
    },
    {
      title: 'High-Retention Customer Expansion',
      desc: 'Achieve >130% Net Revenue Retention by providing unified visibility across engineering, CRM, and finance.',
      pillar: 'Growth & GTM',
    },
    {
      title: 'Autonomous Company Operating Layer',
      desc: 'Pioneer multi-agent company intelligence that actively recommends optimizations and unblocks execution.',
      pillar: 'AI Innovation',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Strategy & Direction', href: '#' },
          { label: 'Company Strategy' },
        ]}
        title="Company Strategic Foundation"
        description={`Core mission, long-term vision, strategic pillars, and market positioning driving ${currentOrg.name}.`}
        badge={<Badge variant="info">Q1-Q4 2026 Mandate</Badge>}
        actions={
          <Button variant="secondary" size="sm">
            <Flag className="w-4 h-4 mr-1.5" />
            Update Strategic Pillars
          </Button>
        }
      />

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#1A73E8]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#8AB4F8] flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Core Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-[#EDF2F7] leading-relaxed">
              To provide modern enterprises with a unified, autonomous operating system that connects strategy to execution with absolute clarity.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#8AB4F8]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#8AB4F8] flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Long-Term Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-[#EDF2F7] leading-relaxed">
              A future where every organization operates at peak velocity—where telemetry, intelligence, and execution flow seamlessly without silos.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Priorities */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9AA0A6]">
          Multi-Year Strategic Priorities (2026-2027)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorities.map((p, idx) => (
            <Card key={idx} className="hover:border-[#8AB4F8]/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{p.pillar}</Badge>
                </div>
                <CardTitle className="text-sm font-semibold text-[#EDF2F7] mt-2">
                  {p.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#9AA0A6] leading-relaxed">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Strategic Goals Alignment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold">Active Strategic Goals</CardTitle>
          <span className="text-xs text-[#9AA0A6] font-mono">{goals.length} active initiatives</span>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-[#202637]">
            {goals.map((g) => (
              <div key={g.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#EDF2F7]">{g.title}</span>
                  <p className="text-[11px] text-[#9AA0A6]">{g.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-28 h-1.5 bg-[#161D2D] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: `${g.progress}%` }} />
                  </div>
                  <span className="font-semibold text-[#EDF2F7] w-10 text-right font-mono">{g.progress}%</span>
                  <Badge variant={g.status === 'on_track' ? 'success' : 'warning'}>
                    {g.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
