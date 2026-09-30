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
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsCreateOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-[#111622] border border-[#202637] rounded-lg shadow-2xl overflow-hidden animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#202637] bg-[#0E131F]">
          <span className="text-xs font-semibold text-[#EDF2F7] uppercase tracking-wider">
            Create Resource
          </span>
          <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Type Tabs */}
        <div className="flex border-b border-[#181E2E] bg-[#0B0E14] px-5 pt-2.5 space-x-4">
          {types.map((t) => {
            const Icon = t.icon;
            const isActive = createType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setCreateType(t.id)}
                className={`flex items-center space-x-1.5 pb-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#1A73E8] text-[#8AB4F8] font-semibold'
                    : 'border-transparent text-[#9AA0A6] hover:text-[#EDF2F7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <Input
            label={createType === 'lead' ? 'Contact Name' : `${createType.charAt(0).toUpperCase() + createType.slice(1)} Title`}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g. ${createType === 'task' ? 'Implement OAuth2 PKCE callback' : createType === 'project' ? 'V2 Platform Migration' : 'Acme Corporation'}`}
          />

          {createType === 'lead' && (
            <Input
              label="Company Name"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enterprise prospect organization"
            />
          )}

          {(createType === 'customer' || createType === 'lead') && (
            <Input
              label="Contract Value (ARR $)"
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          )}

          {createType === 'task' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#EDF2F7]">Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-[#111622] border border-[#202637] rounded-md px-3 py-1.5 text-xs text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#EDF2F7]">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-[#111622] border border-[#202637] rounded-md px-3 py-1.5 text-xs text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          )}

          <Textarea
            label="Description (optional)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Operational context, deliverables, or specifications..."
          />

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#181E2E]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create {createType}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
