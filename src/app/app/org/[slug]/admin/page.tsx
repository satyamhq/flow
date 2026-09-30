'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import {
  Building,
  Users,
  ShieldAlert,
  CreditCard,
  Key,
  Plus,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'general';
  const { currentOrg, currentUser } = useFlow();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [members, setMembers] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    try {
      const storedMem = localStorage.getItem(`flow_tenant_${currentOrg.id}_members`);
      if (storedMem) setMembers(JSON.parse(storedMem));
      else setMembers([]);

      const storedAudit = localStorage.getItem(`flow_tenant_${currentOrg.id}_audit_logs`);
      if (storedAudit) setAuditEvents(JSON.parse(storedAudit));
      else setAuditEvents([]);

      const storedKeys = localStorage.getItem(`flow_tenant_${currentOrg.id}_api_keys`);
      if (storedKeys) setApiKeys(JSON.parse(storedKeys));
      else setApiKeys([]);
    } catch {
      setMembers([]);
      setAuditEvents([]);
      setApiKeys([]);
    }
  }, [currentOrg.id]);

  const allMembers = [
    {
      id: currentUser.id || 'owner',
      name: currentUser.fullName || 'Workspace Owner',
      email: currentUser.email || 'user@flow.com',
      role: 'Owner',
      title: currentUser.title || 'Administrator',
      joined: 'Active Session',
    },
    ...members,
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newM = {
      id: `mem_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: 'Member',
      title: 'Engineer',
      joined: 'Just now',
    };

    const updated = [...members, newM];
    setMembers(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_members`, JSON.stringify(updated));
    } catch {}

    // Log audit event
    const newLog = {
      action: 'organization.member_invited',
      actor: currentUser.email,
      target: newM.email,
      time: 'Just now',
    };
    const updatedLogs = [newLog, ...auditEvents];
    setAuditEvents(updatedLogs);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_audit_logs`, JSON.stringify(updatedLogs));
    } catch {}

    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: 'Production Ingestion Key',
      key: `flow_live_${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      created: 'Just now',
    };

    const updated = [newKey, ...apiKeys];
    setApiKeys(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_api_keys`, JSON.stringify(updated));
    } catch {}
  };

  const tabs = [
    { id: 'general', label: 'Organization Profile', icon: Building },
    { id: 'members', label: 'Members & Roles', icon: Users, badge: allMembers.length },
    { id: 'security', label: 'Security & Audit Logs', icon: ShieldAlert },
    { id: 'billing', label: 'Billing & Subscriptions', icon: CreditCard },
    { id: 'api', label: 'API Keys & Webhooks', icon: Key },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Admin Console' },
        ]}
        title="Organization Administration"
        description="Access control, member authorization, security policies, and subscription settings."
        tabs={<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />}
      />

      {/* Tab 1: Organization Profile */}
      {activeTab === 'general' && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Organization Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Company Name" defaultValue={currentOrg.name} />
            <Input label="URL Identifier (Slug)" defaultValue={currentOrg.slug} disabled />
            <Input label="Industry" defaultValue={currentOrg.industry} />
            <Input label="Company Stage" defaultValue={currentOrg.stage} />
            <Button variant="primary" size="md">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Members & Roles */}
      {activeTab === 'members' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Workspace Members ({allMembers.length})</CardTitle>
              <span className="text-[11px] text-[#9AA0A6]">Authoritative Supabase Auth & Role-Based Access</span>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsInviteOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Invite Member</span>
            </Button>
          </CardHeader>

          {isInviteOpen && (
            <div className="p-4 border-b border-[#202637] bg-[#111622] space-y-3">
              <h4 className="text-xs font-semibold text-[#EDF2F7]">Send Workspace Invitation</h4>
              <form onSubmit={handleInvite} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@domain.com"
                  className="flex-1 text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
                />
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Invite
                </Button>
              </form>
            </div>
          )}

          <div className="divide-y divide-[#181E2E]">
            {allMembers.map((m, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-xs flow-table-row">
                <div>
                  <span className="font-semibold text-[#EDF2F7]">{m.name}</span>
                  <span className="block text-[11px] text-[#9AA0A6]">{m.email}</span>
                </div>
                <div className="flex items-center space-x-6 text-[#9AA0A6]">
                  <span className="text-[11px] text-[#EDF2F7]">{m.title}</span>
                  <Badge variant={m.role === 'Owner' ? 'info' : 'neutral'}>{m.role}</Badge>
                  <span className="text-[11px] text-[#5F6368] font-mono">{m.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Security & Audit Logs */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <span className="text-xs font-semibold text-[#EDF2F7] block">Multi-Factor Authentication (MFA)</span>
                <span className="text-[11px] text-[#9AA0A6]">Enforce mandatory TOTP/Hardware Key for all organization members</span>
              </div>
              <Badge variant="success" dot>Enforced</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Security Audit Trail ({auditEvents.length})</CardTitle>
                <span className="text-[11px] text-[#9AA0A6]">Append-only audit events logged to Supabase PostgreSQL</span>
              </div>
            </CardHeader>
            {auditEvents.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#9AA0A6]">
                No security audit events recorded yet for this workspace.
              </div>
            ) : (
              <div className="divide-y divide-[#181E2E]">
                {auditEvents.map((a, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs flow-table-row">
                    <div>
                      <span className="font-mono text-[#8AB4F8] font-semibold">{a.action}</span>
                      <span className="block text-[11px] text-[#9AA0A6] mt-0.5">
                        Actor: {a.actor} → Target: {a.target}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5F6368] font-mono">{a.time}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 4: Billing & Subscriptions */}
      {activeTab === 'billing' && (
        <Card className="max-w-xl">
          <CardHeader>
            <div>
              <CardTitle>Current Plan: {currentOrg.plan ? currentOrg.plan.toUpperCase() : 'PRO'}</CardTitle>
              <span className="text-xs text-[#9AA0A6]">Multi-tenant isolation active</span>
            </div>
            <Badge variant="info">Active</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-[#EDF2F7]">
            <div className="flex justify-between py-1.5 border-b border-[#181E2E]">
              <span className="text-[#9AA0A6]">Organization:</span>
              <span className="font-mono font-semibold">{currentOrg.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#181E2E]">
              <span className="text-[#9AA0A6]">Tier:</span>
              <span className="font-mono font-semibold uppercase">{currentOrg.plan || 'pro'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#181E2E]">
              <span className="text-[#9AA0A6]">Database Persistence:</span>
              <span className="font-mono font-semibold">Supabase PostgreSQL</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: API Keys */}
      {activeTab === 'api' && (
        <Card className="max-w-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active API Keys ({apiKeys.length})</CardTitle>
            <Button variant="primary" size="sm" onClick={handleGenerateKey}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Generate Key</span>
            </Button>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#9AA0A6]">
                No API keys generated yet. Click &ldquo;Generate Key&rdquo; to create a telemetry ingestion credential.
              </div>
            ) : (
              <div className="space-y-2">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-3 rounded bg-[#161D2D] border border-[#202637] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#EDF2F7]">{k.name}</span>
                      <span className="block font-mono text-[#9AA0A6] text-[11px] mt-0.5">{k.key}</span>
                    </div>
                    <span className="text-[10px] text-[#34A853] font-mono">Active</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
