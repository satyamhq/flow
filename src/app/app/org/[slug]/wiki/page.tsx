'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { BookOpen, FileText, Plus, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function WikiPage() {
  const { currentOrg } = useFlow();

  const wikiSections = [
    { title: 'Engineering Handbook', articles: 18, desc: 'Standards for TypeScript, Postgres RLS, and Next.js Turbopack compilation.', updated: '2 days ago' },
    { title: 'Company Culture & Principles', articles: 6, desc: 'Values, asynchronous communication norms, and high-agency operational expectations.', updated: '1 week ago' },
    { title: 'Security & Access Playbook', articles: 12, desc: 'Zero-trust RBAC model, credential hygiene, and incident reporting.', updated: '3 days ago' },
    { title: 'GTM & Enterprise Pitch Kit', articles: 9, desc: 'Customer case studies, ROI calculators, and competitive battlecards.', updated: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Knowledge Base', href: '#' },
          { label: 'Wiki' },
        ]}
        title="Company Wiki & Engineering Handbook"
        description="Collaborative engineering handbook, culture guide, and architectural decision records."
        badge={<Badge variant="info">4 Core Handbooks</Badge>}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Wiki Page
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wikiSections.map((sec, idx) => (
          <Card key={idx} className="hover:border-[#8AB4F8]/40 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">{sec.title}</CardTitle>
              <Badge variant="neutral">{sec.articles} articles</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-[#9AA0A6] leading-relaxed">{sec.desc}</p>
              <div className="pt-2 border-t border-[#202637] flex items-center justify-between text-[11px] text-[#9AA0A6]">
                <span>Last updated {sec.updated}</span>
                <span className="text-[#8AB4F8] hover:underline flex items-center">
                  Read Handbook <ExternalLink className="w-3 h-3 ml-1" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
