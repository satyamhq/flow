'use client';

import React, { useState, useEffect } from 'react';
import { useFlow } from '@/context/flow-context';
import { GitBranch, Plus, ArrowRight, Zap, CheckCircle2, Play } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface WorkflowItem {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  active: boolean;
}

export default function AutomationsPage() {
  const { currentOrg } = useFlow();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formTrigger, setFormTrigger] = useState('Task completed');
  const [formAction, setFormAction] = useState('Dispatch notification');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_workflows`);
      if (stored) {
        setWorkflows(JSON.parse(stored));
      } else {
        setWorkflows([]);
      }
    } catch {
      setWorkflows([]);
    }
  }, [currentOrg.id]);

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newWf: WorkflowItem = {
      id: `wf_${Date.now()}`,
      name: formName.trim(),
      trigger: formTrigger,
      condition: 'Tenant Scoped == True',
      action: formAction,
      active: true,
    };

    const updated = [newWf, ...workflows];
    setWorkflows(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_workflows`, JSON.stringify(updated));
    } catch {}

    setFormName('');
    setIsModalOpen(false);
  };

  const toggleWorkflow = (id: string) => {
    const updated = workflows.map((w) => (w.id === id ? { ...w, active: !w.active } : w));
    setWorkflows(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_workflows`, JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Platform & Automations', href: '#' },
          { label: 'Workflows' },
        ]}
        title="Autonomous Event-Driven Workflows"
        description="Event triggers, conditional logic gates, and cross-platform automated actions."
        badge={
          <Badge variant={workflows.length > 0 ? 'success' : 'neutral'}>
            {workflows.length} Workflow{workflows.length === 1 ? '' : 's'} Active
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Workflow
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[#111622] border border-[#202637] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[#EDF2F7]">Create Autonomous Workflow</h3>
          <form onSubmit={handleCreateWorkflow} className="space-y-3">
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Workflow Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Notify on High-Priority Task Blocked"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Trigger Event</label>
              <input
                type="text"
                value={formTrigger}
                onChange={(e) => setFormTrigger(e.target.value)}
                placeholder="e.g. When a work item status changes to Blocked"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Automated Action</label>
              <input
                type="text"
                value={formAction}
                onChange={(e) => setFormAction(e.target.value)}
                placeholder="e.g. Add notification and alert project owner"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Automation
              </Button>
            </div>
          </form>
        </div>
      )}

      {workflows.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No automations configured"
          description="Create event-driven workflows that trigger on task completion, customer milestones, or webhook events."
          actionLabel="New Workflow"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((wf) => (
            <Card key={wf.id} className="space-y-3">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">{wf.name}</CardTitle>
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className="cursor-pointer"
                >
                  <Badge variant={wf.active ? 'success' : 'neutral'} dot>
                    {wf.active ? 'Active' : 'Paused'}
                  </Badge>
                </button>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-[#161D2D] border border-[#202637] space-y-1">
                  <span className="text-[10px] text-[#8AB4F8] font-mono block">TRIGGER: {wf.trigger}</span>
                  <span className="text-[10px] text-[#34A853] font-mono block">ACTION: {wf.action}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
