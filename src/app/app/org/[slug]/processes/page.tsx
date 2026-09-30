'use client';

import React, { useState, useEffect } from 'react';
import { useFlow } from '@/context/flow-context';
import { Workflow, CheckCircle2, Shield, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface ProcessItem {
  id: string;
  name: string;
  owner: string;
  cadence: string;
  status: string;
}

export default function ProcessesPage() {
  const { currentOrg, currentUser } = useFlow();
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formOwner, setFormOwner] = useState(currentUser.department || 'Operations');
  const [formCadence, setFormCadence] = useState('Continuous');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_processes`);
      if (stored) {
        setProcesses(JSON.parse(stored));
      } else {
        setProcesses([]);
      }
    } catch {
      setProcesses([]);
    }
  }, [currentOrg.id]);

  const handleCreateProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newProc: ProcessItem = {
      id: `proc_${Date.now()}`,
      name: formName.trim(),
      owner: formOwner.trim() || 'Operations',
      cadence: formCadence.trim() || 'Weekly',
      status: 'active',
    };

    const updated = [newProc, ...processes];
    setProcesses(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_processes`, JSON.stringify(updated));
    } catch {}

    setFormName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Operations & Execution', href: '#' },
          { label: 'Processes' },
        ]}
        title="Operational Processes & Governance"
        description="Standard operating procedures, governance guardrails, and compliance workflows."
        badge={
          <Badge variant={processes.length > 0 ? 'info' : 'neutral'}>
            {processes.length} Process{processes.length === 1 ? '' : 'es'} Active
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Process
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">Define Operating Process</h3>
          <form onSubmit={handleCreateProcess} className="space-y-3">
            <div>
              <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Process Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Weekly Security Review"
                className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Owner / Department</label>
                <input
                  type="text"
                  value={formOwner}
                  onChange={(e) => setFormOwner(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Cadence / Schedule</label>
                <input
                  type="text"
                  value={formCadence}
                  onChange={(e) => setFormCadence(e.target.value)}
                  placeholder="e.g. Continuous / Monthly"
                  className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Process
              </Button>
            </div>
          </form>
        </div>
      )}

      {processes.length === 0 ? (
        <EmptyState
          icon={Workflow}
          title="No operational processes defined"
          description="Define standard operating procedures, compliance workflows, and governance guardrails for your organization."
          actionLabel="Add Process"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processes.map((proc) => (
            <Card key={proc.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">{proc.name}</CardTitle>
                <Badge variant="success">{proc.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]">
                  <span>Owner: {proc.owner}</span>
                  <span className="font-mono">{proc.cadence}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
