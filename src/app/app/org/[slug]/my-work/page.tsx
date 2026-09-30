'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import {
  CheckSquare,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function MyWorkPage() {
  const { currentUser, tasks, projects, goals, updateTaskStatus } = useFlow();
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');

  const myTasks = tasks.filter((t) => t.assignee?.id === currentUser.id);
  const filteredTasks = myTasks.filter((t) => {
    if (filter === 'todo') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Personal Workspace', href: '#' },
          { label: 'My Work' },
        ]}
        title="My Work & Personal Execution"
        description="Unified personal workspace for assigned tasks, active projects, review queues, and AI-prioritized actions."
        badge={<Badge variant="info">Assigned to You</Badge>}
        actions={
          <div className="flex items-center space-x-2 bg-[#111622] border border-[#202637] rounded-md p-1">
            <Button
              size="sm"
              variant={filter === 'all' ? 'primary' : 'ghost'}
              onClick={() => setFilter('all')}
              className="text-xs h-7 px-3"
            >
              All ({myTasks.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'todo' ? 'primary' : 'ghost'}
              onClick={() => setFilter('todo')}
              className="text-xs h-7 px-3"
            >
              To Do
            </Button>
            <Button
              size="sm"
              variant={filter === 'done' ? 'primary' : 'ghost'}
              onClick={() => setFilter('done')}
              className="text-xs h-7 px-3"
            >
              Completed
            </Button>
          </div>
        }
      />

      {/* Grid: Tasks & AI Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-[#8AB4F8]" />
                <span>Assigned Tasks Queue</span>
              </CardTitle>
              <span className="text-xs text-[#9AA0A6] font-mono">
                {filteredTasks.length} items
              </span>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <EmptyState
                  title="No tasks match the filter"
                  description="All your assigned items are cleared or in another status tab."
                />
              ) : (
                <div className="divide-y divide-[#202637]">
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between hover:bg-[#161D2D]/40 px-2 rounded-md transition-colors"
                    >
                      <div className="flex items-start space-x-3.5">
                        <button
                          onClick={() => updateTaskStatus(t.id, t.status === 'done' ? 'todo' : 'done')}
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                            t.status === 'done'
                              ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                              : 'border-[#3C4043] hover:border-[#8AB4F8]'
                          }`}
                        >
                          {t.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <span
                            className={`text-xs font-medium block ${
                              t.status === 'done' ? 'line-through text-[#5F6368]' : 'text-[#EDF2F7]'
                            }`}
                          >
                            {t.title}
                          </span>
                          <div className="flex items-center space-x-2 mt-1 text-[11px] text-[#9AA0A6]">
                            <span className="text-[#8AB4F8]">{t.projectName}</span>
                            <span>•</span>
                            <span className="font-mono">Due {t.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            t.priority === 'urgent'
                              ? 'error'
                              : t.priority === 'high'
                              ? 'warning'
                              : 'neutral'
                          }
                        >
                          {t.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: AI Daily Recommendation & Today's Schedule */}
        <div className="space-y-6">
          <Card className="border-[#1A73E8]/40 bg-[#161D2D]/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#8AB4F8] flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Focus Recommendation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[#EDF2F7] leading-relaxed">
                You have 1 blocked critical item for the Fortune 100 enterprise proposal. Unblocking this will keep the $320k deal on track for Q3 close.
              </p>
              <div className="mt-3 pt-3 border-t border-[#202637] flex items-center justify-between">
                <span className="text-[11px] text-[#9AA0A6]">Impact Score: High</span>
                <Button size="sm" variant="ghost" className="text-xs text-[#8AB4F8] p-0 h-auto">
                  Resolve item →
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-[#EDF2F7] flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#8AB4F8]" />
                <span>Today&apos;s Schedule</span>
              </CardTitle>
              <span className="text-[11px] text-[#9AA0A6] font-mono">2 events</span>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="p-3 rounded bg-[#0E131F] border border-[#202637]">
                <div className="flex justify-between font-medium text-xs text-[#EDF2F7]">
                  <span>Executive Engineering Sync</span>
                  <span className="text-[#9AA0A6] font-mono text-[11px]">10:00 AM</span>
                </div>
                <p className="text-[11px] text-[#9AA0A6] mt-1">Review V2 Platform Architecture & P95 latency</p>
              </div>
              <div className="p-3 rounded bg-[#0E131F] border border-[#202637]">
                <div className="flex justify-between font-medium text-xs text-[#EDF2F7]">
                  <span>Fortune 100 Architecture Review</span>
                  <span className="text-[#9AA0A6] font-mono text-[11px]">2:30 PM</span>
                </div>
                <p className="text-[11px] text-[#9AA0A6] mt-1">Enterprise security and multi-tenant isolation demo</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
