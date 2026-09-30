'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PeoplePage() {
  const { currentOrg } = useFlow();

  const team = [
    { name: 'Satyam', role: 'Founder & CEO', dept: 'Executive', email: 'satyam@acme.ai', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80', manager: 'Board' },
    { name: 'Marcus Chen', role: 'VP of Platform Engineering', dept: 'Engineering', email: 'marcus@acme.ai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80', manager: 'Satyam' },
    { name: 'Elena Rostova', role: 'Head of Security & IAM', dept: 'Security', email: 'elena@acme.ai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80', manager: 'Marcus Chen' },
    { name: 'Aria Vance', role: 'Director of Growth Marketing', dept: 'Marketing', email: 'aria@acme.ai', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&q=80', manager: 'Satyam' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'People & HR' },
        ]}
        title="People & Organization Directory"
        description="Team directory, reporting lines, departments, and headcount allocation."
        badge={<Badge variant="info">{currentOrg.teamSize}</Badge>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map((m, idx) => (
          <Card key={idx} className="space-y-3">
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-[#202637]" />
                <div>
                  <span className="text-xs font-semibold text-[#EDF2F7] block">{m.name}</span>
                  <span className="text-[11px] text-[#8AB4F8] block">{m.role}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#181E2E] space-y-1.5 text-[11px] text-[#9AA0A6]">
                <div className="flex justify-between">
                  <span>Department:</span>
                  <span className="text-[#EDF2F7] font-medium">{m.dept}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reports To:</span>
                  <span className="text-[#EDF2F7] font-medium">{m.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-[#EDF2F7] font-mono text-[10px] truncate max-w-[130px]">{m.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
