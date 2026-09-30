'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Milestone, ArrowDown, ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function OKRsPage() {
  const { currentOrg } = useFlow();

  const okrHierarchy = [
    {
      companyObjective: 'Accelerate Enterprise Scale to $20M ARR with 85% Gross Margin',
      progress: 78,
      departments: [
        {
          name: 'Engineering & Platform Infrastructure',
          objective: 'Sub-200ms global query latency and SOC-2 Type II audit readiness',
          progress: 88,
          teams: [
            {
              team: 'Core Platform Engineering',
              keyResult: 'Verify RLS partition policies & achieve <185ms P95 latency (Currently 185ms)',
              owner: 'Marcus Chen',
              status: 'on_track',
            },
            {
              team: 'Security & Compliance',
              keyResult: 'Complete automated audit continuous monitoring for 110 controls (108/110 complete)',
              owner: 'Elena Rostova',
              status: 'on_track',
            },
          ],
        },
        {
          name: 'Enterprise GTM & Sales',
          objective: 'Close 12 net-new Fortune 500 contracts with >$150k ACV',
          progress: 72,
          teams: [
            {
              team: 'Enterprise Sales',
              keyResult: 'Expand active qualified pipeline to $4.2M (Currently $3.8M)',
              owner: 'Satyam',
              status: 'on_track',
            },
            {
              team: 'Customer Success',
              keyResult: 'Maintain >130% Net Revenue Retention (Currently 134%)',
              owner: 'Aria Vance',
              status: 'on_track',
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Strategy & Direction', href: '#' },
          { label: 'Hierarchical OKRs' },
        ]}
        title="Hierarchical OKR Alignment"
        description="Cascading objectives: Company Objective → Department Objective → Team Objective → Key Results."
        badge={<Badge variant="info">Cascading Framework</Badge>}
        actions={
          <Button variant="secondary" size="sm">
            <TrendingUp className="w-4 h-4 mr-1.5" />
            Recalibrate All OKRs
          </Button>
        }
      />

      <div className="space-y-6">
        {okrHierarchy.map((co, idx) => (
          <Card key={idx}>
            <CardHeader className="p-4 bg-[#161D2D]/70 border-b border-[#202637]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-[#1A73E8]/20 border border-[#1A73E8]/30 flex items-center justify-center text-[#8AB4F8]">
                    <Milestone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8AB4F8] font-semibold tracking-wider block">
                      Company Level Objective
                    </span>
                    <CardTitle className="text-sm font-semibold">{co.companyObjective}</CardTitle>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-32 h-2 bg-[#0E131F] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: `${co.progress}%` }} />
                  </div>
                  <span className="font-semibold text-[#EDF2F7] font-mono">{co.progress}%</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Department Cascade */}
              <div className="pl-4 sm:pl-6 space-y-4 border-l-2 border-[#1A73E8]/40">
                {co.departments.map((dept, dIdx) => (
                  <div key={dIdx} className="bg-[#0E131F] border border-[#202637] rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-[#8AB4F8] tracking-wider">
                          {dept.name}
                        </span>
                        <h4 className="text-xs font-semibold text-[#EDF2F7] mt-0.5">{dept.objective}</h4>
                      </div>
                      <span className="text-xs font-semibold text-[#9AA0A6] font-mono">{dept.progress}%</span>
                    </div>

                    {/* Team Key Results */}
                    <div className="space-y-2 pt-2 border-t border-[#202637]">
                      {dept.teams.map((tm, tIdx) => (
                        <div
                          key={tIdx}
                          className="p-2.5 rounded bg-[#111622] border border-[#202637] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-[#9AA0A6] uppercase">{tm.team}</span>
                            <p className="text-[#EDF2F7] font-medium">{tm.keyResult}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-[11px] text-[#9AA0A6]">Owner: {tm.owner}</span>
                            <Badge variant="success">{tm.status.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      ))}
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
