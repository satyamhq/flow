'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { Box, Plus, Rocket, Sparkles, ThumbsUp, Layers, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProductPage() {
  const { currentOrg, setIsCreateOpen, setCreateType } = useFlow();

  const products = [
    {
      name: 'Flow Core OS',
      stage: 'General Availability',
      users: 14200,
      nps: 94,
      features: 38,
      desc: 'The central enterprise operating dashboard and resource graph.',
    },
    {
      name: 'Flow Autonomous Agents (v2.0)',
      stage: 'Beta',
      users: 2800,
      nps: 91,
      features: 14,
      desc: 'Company-aware intelligence layer executing background workflows and insights.',
    },
    {
      name: 'Flow Extensibility Marketplace',
      stage: 'Concept',
      users: 0,
      nps: 0,
      features: 6,
      desc: 'Third-party developer SDKs, OAuth applications, and custom webhook connectors.',
    },
  ];

  const features = [
    { title: 'Sub-200ms Distributed Read Caching', product: 'Flow Core OS', status: 'shipped', votes: 142, impact: 'Critical' },
    { title: 'Natural Language Strategic Querying', product: 'Flow Autonomous Agents', status: 'in_development', votes: 98, impact: 'High' },
    { title: 'SCIM 2.0 Directory Sync Engine', product: 'Flow Core OS', status: 'testing', votes: 84, impact: 'High' },
    { title: 'Automated Financial Reconciliation Hooks', product: 'Flow Core OS', status: 'planned', votes: 56, impact: 'Medium' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Product & Engineering', href: '#' },
          { label: 'Product Workspace' },
        ]}
        title="Product Portfolio & Feature Pipeline"
        description="Portfolio management, feature specifications, customer feedback, and release tracking."
        badge={<Badge variant="info">3 Products Active</Badge>}
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
            New Feature Spec
          </Button>
        }
      />

      {/* Product Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">{p.name}</CardTitle>
              <Badge variant={p.stage === 'General Availability' ? 'success' : p.stage === 'Beta' ? 'info' : 'neutral'}>
                {p.stage}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-[#9AA0A6] leading-relaxed">{p.desc}</p>
              <div className="pt-2 border-t border-[#202637] flex items-center justify-between text-[11px] text-[#9AA0A6] font-mono">
                <span>{p.users > 0 ? `${p.users.toLocaleString()} WAU` : 'Unreleased'}</span>
                <span>{p.nps > 0 ? `NPS ${p.nps}` : ''}</span>
                <span>{p.features} Features</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Backlog & Roadmap */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold">Feature Roadmap & Feedback Impact</CardTitle>
          <span className="text-xs text-[#9AA0A6] font-mono">{features.length} priority features</span>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-[#202637]">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#161D2D]/40 px-2 rounded transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#EDF2F7]">{f.title}</span>
                  <span className="block text-[11px] text-[#9AA0A6]">{f.product}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1.5 text-[#9AA0A6] font-mono text-[11px]">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#8AB4F8]" />
                    <span>{f.votes}</span>
                  </span>
                  <Badge variant={f.impact === 'Critical' ? 'error' : 'neutral'}>
                    {f.impact}
                  </Badge>
                  <Badge variant={f.status === 'shipped' ? 'success' : f.status === 'in_development' ? 'info' : 'warning'}>
                    {f.status.replace('_', ' ')}
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
