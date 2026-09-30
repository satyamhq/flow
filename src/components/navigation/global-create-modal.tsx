'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { X, CheckCircle2, FolderKanban, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

export function GlobalCreateModal() {
  const {
    isCreateOpen,
    setIsCreateOpen,
    createType,
    setCreateType,
    createTask,
    createProject,
    createCustomer,
    createLead,
    projects,
  } = useFlow();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState(150000);

  if (!isCreateOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (createType === 'task') {
      createTask({
        title,
        description,
        priority,
        projectId: selectedProjectId,
      });
    } else if (createType === 'project') {
      createProject({
        name: title,
        description,
        priority,
      });
    } else if (createType === 'customer') {
      createCustomer({
        name: title,
        tier: 'growth',
        arr: value,
      });
    } else if (createType === 'lead') {
      createLead({
        name: title,
        company: company || 'Enterprise Client',
        value,
      });
    }

    setTitle('');
    setDescription('');
    setIsCreateOpen(false);
  };

  const types = [
    { id: 'task', label: 'Task', icon: CheckCircle2 },
    { id: 'project', label: 'Project', icon: FolderKanban },
    { id: 'lead', label: 'Sales Lead', icon: Briefcase },
    { id: 'customer', label: 'Customer', icon: Users },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsCreateOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-[var(--surface-base)] border border-[var(--border)] rounded-lg shadow-2xl overflow-hidden animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-header)]">
          <span className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Create Resource
          </span>
          <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Type Tabs */}
        <div className="flex border-b border-[var(--border-subtle)] bg-[var(--surface-header)] px-5 pt-2.5 space-x-4">
          {types.map((t) => {
            const Icon = t.icon;
            const isActive = createType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setCreateType(t.id)}
                className={`flex items-center space-x-2 pb-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#1A73E8] text-[#1A73E8] font-semibold'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input
            label={createType === 'project' ? 'Project Name' : createType === 'customer' ? 'Customer Account' : createType === 'lead' ? 'Contact Name' : 'Task Title'}
            placeholder={createType === 'project' ? 'e.g. Q4 SOC2 Type II Certification' : createType === 'customer' ? 'e.g. Stripe Inc.' : 'e.g. Implement OIDC token exchange'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          {createType === 'lead' && (
            <Input
              label="Company / Organization"
              placeholder="e.g. Microsoft Azure"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          )}

          {(createType === 'customer' || createType === 'lead') && (
            <Input
              label={createType === 'customer' ? 'Annual Recurring Revenue (ARR)' : 'Estimated Deal Size ($)'}
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          )}

          {createType === 'task' && projects.length > 0 && (
            <div className="space-y-1 text-left w-full">
              <label className="block text-xs font-medium text-[var(--text-primary)]">
                Associated Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-[var(--surface-base)] border border-[var(--border)] rounded-md px-3 py-1.5 text-xs text-[var(--text-primary)] transition-colors focus:outline-none focus:border-[#1A73E8]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[var(--surface-base)] text-[var(--text-primary)]">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(createType === 'task' || createType === 'project') && (
            <div className="space-y-1 text-left w-full">
              <label className="block text-xs font-medium text-[var(--text-primary)]">
                Priority Tier
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 text-xs font-mono capitalize rounded border transition-colors cursor-pointer ${
                      priority === p
                        ? 'bg-[var(--primary-subtle)] border-[#1A73E8] text-[#1A73E8] font-bold'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Textarea
            label="Description & Context"
            placeholder="Add scope details, blockers, or acceptance criteria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Create Resource
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
