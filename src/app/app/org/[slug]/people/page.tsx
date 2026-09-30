'use client';

import React, { useState, useEffect } from 'react';
import { useFlow } from '@/context/flow-context';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, Mail, Shield, User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  email: string;
  manager: string;
  isCurrentUser?: boolean;
}

export default function PeoplePage() {
  const { currentOrg, currentUser } = useFlow();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff Engineer');
  const [inviteDept, setInviteDept] = useState('Engineering');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_members`);
      if (stored) {
        setMembers(JSON.parse(stored));
      } else {
        setMembers([]);
      }
    } catch {
      setMembers([]);
    }
  }, [currentOrg.id]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `mem_${Date.now()}`,
      name: inviteName.trim() || inviteEmail.split('@')[0],
      role: inviteRole,
      dept: inviteDept,
      email: inviteEmail.trim(),
      manager: currentUser.fullName,
    };

    const updated = [...members, newMember];
    setMembers(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_members`, JSON.stringify(updated));
    } catch {}

    setInviteEmail('');
    setInviteName('');
    setIsModalOpen(false);
  };

  // The primary member is always the real authenticated user
  const allTeam = [
    {
      id: currentUser.id || 'owner',
      name: currentUser.fullName || 'Workspace Owner',
      role: currentUser.title || 'Owner / Administrator',
      dept: currentUser.department || 'Executive',
      email: currentUser.email || 'user@flow.com',
      manager: 'Executive Board',
      isCurrentUser: true,
    },
    ...members,
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'People & HR' },
        ]}
        title="People & Organization Directory"
        description="Team members, roles, reporting hierarchy, and department allocation."
        badge={<Badge variant="info">{allTeam.length} Member{allTeam.length > 1 ? 's' : ''}</Badge>}
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-1.5" />
            Invite Member
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[#111622] border border-[#202637] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[#EDF2F7]">Invite Team Member to {currentOrg.name}</h3>
          <form onSubmit={handleInvite} className="space-y-3">
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Work Email</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Full Name (Optional)</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#9AA0A6] block mb-1">Role / Title</label>
                <input
                  type="text"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#9AA0A6] block mb-1">Department</label>
                <input
                  type="text"
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Send Invitation
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTeam.map((m) => (
          <Card key={m.id} className="space-y-3">
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#161D2D] border border-[#202637] flex items-center justify-center text-[#8AB4F8]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-[#EDF2F7] block">{m.name}</span>
                    {m.isCurrentUser && (
                      <Badge variant="info">You</Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8AB4F8] block">{m.role}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#181E2E] space-y-1.5 text-[11px] text-[#9AA0A6]">
                <div className="flex justify-between">
                  <span>Department:</span>
                  <span className="text-[#EDF2F7] font-medium">{m.dept}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reporting:</span>
                  <span className="text-[#EDF2F7] font-medium">{m.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-[#EDF2F7] font-mono text-[10px] truncate max-w-[150px]">{m.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
