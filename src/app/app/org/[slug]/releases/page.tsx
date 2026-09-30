'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Rocket, CheckCircle2, Clock, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ReleasesPage() {
  const { currentOrg } = useFlow();

  const releases = [
    { version: 'v2.4.0', title: 'Row Level Security Partitioning & Sub-200ms Latency', date: 'Sep 28, 2026', status: 'shipped' },
    { version: 'v2.3.8', title: 'Stripe Autonomous Ledger Reconciler', date: 'Sep 14, 2026', status: 'shipped' },
    { version: 'v2.5.0-rc1', title: 'Flow Agent Natural Language Query Engine', date: 'Oct 15, 2026', status: 'scheduled' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Product & Engineering', href: '#' },
          { label: 'Releases' },
        ]}
        title="Production Releases & Changelogs"
        description="Versioned release changelogs, staging rollouts, and production deployments."
        badge={<Badge variant="success">Current: v2.4.0 (Healthy)</Badge>}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Release Tag
          </Button>
        }
      />

      <div className="space-y-4">
        {releases.map((r, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded bg-[#1A73E8]/20 border border-[#1A73E8]/40 flex items-center justify-center text-[#8AB4F8]">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#EDF2F7] text-sm">{r.version}</span>
                    <span className="font-medium text-[#EDF2F7]">{r.title}</span>
                  </div>
                  <span className="text-[11px] text-[#9AA0A6] font-mono">Released: {r.date}</span>
                </div>
              </div>
              <Badge variant={r.status === 'shipped' ? 'success' : 'info'}>
                {r.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
