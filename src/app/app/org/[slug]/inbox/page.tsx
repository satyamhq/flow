'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Inbox, CheckCircle2, Clock, Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function InboxPage() {
  const { currentOrg } = useFlow();

  const items = [
    { title: 'Marcus Chen assigned you to: Verify RLS partition policies', time: '1h ago', read: false },
    { title: 'Vercel Deployment #452 passed all automated health checks', time: '3h ago', read: false },
    { title: 'Stripe webhook received: $620,000 enterprise subscription renewal', time: 'Yesterday', read: true },
    { title: 'Aria Vance mentioned you in Q3 Campaign Strategy Deck', time: '2 days ago', read: true },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Personal', href: '#' },
          { label: 'Inbox' },
        ]}
        title="Company Notifications & Inbox"
        description="Real-time activity feed, task assignments, mentions, and system notifications."
        badge={<Badge variant="info">2 Unread Items</Badge>}
        actions={
          <Button variant="secondary" size="sm">
            <Check className="w-4 h-4 mr-1.5" />
            Mark All as Read
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[#202637]">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 flex items-center justify-between text-xs hover:bg-[#161D2D]/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {!item.read ? (
                    <span className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-transparent" />
                  )}
                  <span className={`font-medium ${item.read ? 'text-[#9AA0A6]' : 'text-[#EDF2F7]'}`}>
                    {item.title}
                  </span>
                </div>
                <span className="text-[#9AA0A6] font-mono text-[11px]">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
