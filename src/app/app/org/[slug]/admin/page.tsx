'use client';

import React, { useState } from 'react';
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

export default function AdminPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'general';
  const { currentOrg } = useFlow();

  const [activeTab, setActiveTab] = useState(initialTab);

  const members = [
    { name: 'Satyam', email: 'satyam@acme.ai', role: 'Owner', title: 'Founder & CEO', joined: 'Jan 2024' },
    { name: 'Marcus Chen', email: 'marcus@acme.ai', role: 'Admin', title: 'VP of Platform Engineering', joined: 'Mar 2024' },
    { name: 'Elena Rostova', email: 'elena@acme.ai', role: 'Admin', title: 'Head of Security & IAM', joined: 'Jul 2024' },
    { name: 'Aria Vance', email: 'aria@acme.ai', role: 'Member', title: 'Director of Growth Marketing', joined: 'Nov 2024' },
  ];

  const auditEvents = [
    { action: 'organization.member_role_updated', actor: 'satyam@acme.ai', target: 'elena@acme.ai (Admin)', time: '2 hours ago' },
    { action: 'security.mfa_enforced_company_wide', actor: 'elena@acme.ai', target: 'Policy Rule #42', time: '1 day ago' },
    { action: 'billing.subscription_tier_upgraded', actor: 'satyam@acme.ai', target: 'Enterprise Custom', time: '1 week ago' },
  ];

  const tabs = [
    { id: 'general', label: 'Organization Profile', icon: Building },
    { id: 'members', label: 'Members & Roles', icon: Users, badge: members.length },
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
        description="Enterprise access control, member management, security policies, and subscription billing."
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
          <CardHeader>
            <div>
              <CardTitle>Active Workspace Members</CardTitle>
              <span className="text-[11px] text-[#9AA0A6]">Strict Row Level Security applied</span>
            </div>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </Button>
          </CardHeader>

          <div className="divide-y divide-[#181E2E]">
            {members.map((m, idx) => (
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
                <CardTitle>Immutable Security Audit Trail</CardTitle>
                <span className="text-[11px] text-[#9AA0A6]">Append-only audit events logged to Supabase PostgreSQL cluster</span>
              </div>
            </CardHeader>
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
          </Card>
        </div>
      )}

      {/* Tab 4: Billing & Subscriptions */}
      {activeTab === 'billing' && (
        <Card className="max-w-xl">
          <CardHeader>
            <div>
              <CardTitle>Current Plan: Enterprise Custom</CardTitle>
              <span className="text-xs text-[#9AA0A6]">Billed annually through Stripe</span>
            </div>
            <Badge variant="info">Active</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-[#EDF2F7]">
            <div className="flex justify-between py-1.5 border-b border-[#181E2E]">
              <span className="text-[#9AA0A6]">Included Seats:</span>
              <span className="font-mono font-semibold">Unlimited (85 active)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#181E2E]">
              <span className="text-[#9AA0A6]">Database Cluster:</span>
              <span className="font-mono font-semibold">Dedicated Supabase Cluster (500GB)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#181E2E]">
              <span className="text-[#9AA0A6]">AI Executions:</span>
              <span className="font-mono font-semibold">100,000 requests/mo</span>
            </div>
            <div className="pt-2">
              <Button variant="secondary" size="md">
                Manage Billing in Stripe Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: API Keys */}
      {activeTab === 'api' && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Active API Keys</CardTitle>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Key</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded bg-[#161D2D] border border-[#202637] flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[#EDF2F7]">Production Ingestion Key</span>
                <span className="block font-mono text-[#9AA0A6] text-[11px] mt-0.5">flow_live_98ab42c...84f</span>
              </div>
              <span className="text-[10px] text-[#34A853] font-mono">Active (used 5m ago)</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
