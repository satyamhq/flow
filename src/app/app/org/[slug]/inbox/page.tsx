'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Inbox, CheckCircle2, Clock, Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function InboxPage() {
  const { currentOrg, notifications, markNotificationRead, markAllNotificationsRead } = useFlow();

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Personal', href: '#' },
          { label: 'Inbox' },
        ]}
        title="Notifications & Inbox"
        description="Real-time audit alerts, task assignments, mentions, and system events."
        badge={
          <Badge variant={unreadCount > 0 ? 'info' : 'neutral'}>
            {unreadCount > 0 ? `${unreadCount} Unread Item${unreadCount > 1 ? 's' : ''}` : "All Caught Up"}
          </Badge>
        }
        actions={
          notifications.length > 0 && unreadCount > 0 ? (
            <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
              <Check className="w-4 h-4 mr-1.5" />
              Mark All as Read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="You're all caught up."
          description="No pending alerts or notifications in this workspace. Activity from projects and tasks will appear here in real time."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {notifications.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => markNotificationRead(item.id)}
                  className={`p-4 flex items-center justify-between text-xs hover:bg-[var(--surface-elevated)]/40 transition-colors cursor-pointer ${
                    !item.read ? 'bg-[#1A73E8]/5' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {!item.read ? (
                      <span className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-transparent" />
                    )}
                    <span className={`font-medium ${item.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[var(--text-secondary)] font-mono text-[11px]">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
