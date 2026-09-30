'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { FileText, Search, Plus, BookOpen, Clock, Tag } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DocumentsPage() {
  const { currentOrg } = useFlow();
  const [search, setSearch] = useState('');

  const docs = [
    {
      title: 'RFC-042: Multi-Tenant Row Level Security Architecture',
      category: 'Architecture',
      author: 'Marcus Chen',
      updated: 'Yesterday',
      snippet: 'Technical specification for Supabase PostgreSQL isolation using organization_id partition indices and RLS policies.',
      tags: ['Security', 'PostgreSQL', 'Infra'],
    },
    {
      title: '2026 Strategy Memo: The Autonomous Operating System',
      category: 'Strategy',
      author: 'Satyam',
      updated: '3 days ago',
      snippet: 'Core thesis on why unified company operations with contextual AI agents outperform fragmented point solutions.',
      tags: ['Executive', 'Vision'],
    },
    {
      title: 'Enterprise Single Sign-On (SAML/SCIM) Implementation Spec',
      category: 'Product Spec',
      author: 'Elena Rostova',
      updated: '1 week ago',
      snippet: 'Integration requirements for Okta, Azure AD, and PingIdentity directory synchronization.',
      tags: ['IAM', 'Enterprise'],
    },
    {
      title: 'Production Incident Response Playbook & Runbooks',
      category: 'SOP',
      author: 'Marcus Chen',
      updated: '2 weeks ago',
      snippet: 'Procedures for zero-downtime database failover, rollback execution, and customer SLA communication.',
      tags: ['Operations', 'Reliability'],
    },
  ];

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.snippet.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Knowledge & Documents', href: '#' },
          { label: 'Documents' },
        ]}
        title="Company Knowledge Base & RFCs"
        description="Internal technical specifications, strategic memos, operational runbooks, and product briefs."
        badge={<Badge variant="info">4 Core Docs</Badge>}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Document
          </Button>
        }
      />

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter documents, RFCs, playbooks..."
        />
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((d, idx) => (
          <Card key={idx} className="hover:border-[#8AB4F8]/40 transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Badge variant="neutral">{d.category}</Badge>
              <span className="text-[11px] text-[#9AA0A6] font-mono">{d.updated}</span>
            </CardHeader>

            <CardContent className="space-y-3">
              <CardTitle className="text-sm font-semibold group-hover:text-[#8AB4F8] transition-colors">
                {d.title}
              </CardTitle>

              <p className="text-xs text-[#9AA0A6] line-clamp-2 leading-relaxed">{d.snippet}</p>

              <div className="pt-3 border-t border-[#202637] flex items-center justify-between text-[11px] text-[#9AA0A6]">
                <span>Author: {d.author}</span>
                <div className="flex space-x-1.5">
                  {d.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[9px] bg-[#161D2D] text-[#8AB4F8] px-1.5 py-0.5 rounded border border-[#202637]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
