'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { Sliders, CheckCircle2, RefreshCw, ExternalLink, ShieldCheck, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function IntegrationsPage() {
  const { currentOrg } = useFlow();

  const [integrationsList, setIntegrationsList] = useState([
    {
      id: 'github',
      name: 'GitHub Enterprise',
      category: 'Engineering & CI/CD',
      desc: 'Synchronize pull requests, commits, and deployment status with Flow projects.',
      status: 'connected',
      lastSync: '12m ago',
      permissions: ['repo', 'read:org', 'workflow'],
    },
    {
      id: 'stripe',
      name: 'Stripe Billing & Payments',
      category: 'Finance',
      desc: 'Real-time ledger events, invoice generation, customer ARR, and subscription webhooks.',
      status: 'connected',
      lastSync: '2m ago',
      permissions: ['read:charges', 'read:customers', 'read:subscriptions'],
    },
    {
      id: 'slack',
      name: 'Slack Enterprise Grid',
      category: 'Collaboration',
      desc: 'Instant alert dispatching, customer milestone announcements, and interactive commands.',
      status: 'connected',
      lastSync: '1h ago',
      permissions: ['chat:write', 'channels:read', 'commands'],
    },
    {
      id: 'google',
      name: 'Google Workspace & Calendar',
      category: 'Operations',
      desc: 'Synchronize executive calendars, meeting schedules, and single sign-on access.',
      status: 'connected',
      lastSync: '30m ago',
      permissions: ['calendar.events.readonly', 'userinfo.email'],
    },
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      category: 'Sales',
      desc: 'Bidirectional lead qualification and enterprise contact synchronization.',
      status: 'disconnected',
      lastSync: 'Never',
      permissions: ['crm.objects.contacts.read'],
    },
    {
      id: 'notion',
      name: 'Notion Knowledge Base',
      category: 'Knowledge',
      desc: 'Import legacy documentation and sync public wiki pages into Flow Documents.',
      status: 'disconnected',
      lastSync: 'Never',
      permissions: ['read_content'],
    },
  ]);

  const toggleConnect = (id: string) => {
    setIntegrationsList((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newStatus = i.status === 'connected' ? 'disconnected' : 'connected';
          return {
            ...i,
            status: newStatus,
            lastSync: newStatus === 'connected' ? 'Just now' : 'Never',
          };
        }
        return i;
      })
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Connectors', href: '#' },
          { label: 'Integrations' },
        ]}
        title="Enterprise Connectors & Marketplace"
        description="Connect third-party developer, financial, and collaboration systems with Flow's unified graph."
        badge={<Badge variant="info">4 of 6 Connected</Badge>}
        actions={
          <Button variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Build Custom Connector
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrationsList.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-semibold">{item.name}</CardTitle>
                <span className="block text-[10px] text-[#9AA0A6] uppercase tracking-wider font-mono mt-0.5">
                  {item.category}
                </span>
              </div>
              <Badge variant={item.status === 'connected' ? 'success' : 'neutral'}>
                {item.status}
              </Badge>
            </CardHeader>

            <CardContent>
              <p className="text-xs text-[#9AA0A6] leading-relaxed">{item.desc}</p>
            </CardContent>

            <CardFooter className="pt-3 border-t border-[#202637] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#9AA0A6] font-mono">Last sync: {item.lastSync}</span>
              <Button
                variant={item.status === 'connected' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => toggleConnect(item.id)}
                className="h-7 text-xs"
              >
                {item.status === 'connected' ? 'Configure' : 'Connect'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
