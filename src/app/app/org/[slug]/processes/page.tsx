'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Workflow, CheckCircle2, Shield, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProcessesPage() {
  const { currentOrg } = useFlow();

  const processes = [
    { name: 'Zero-Downtime Deployments', owner: 'DevOps & SRE', cadence: 'Continuous', status: 'enforced' },
    { name: 'Security Vulnerability Remediation SLA', owner: 'SecOps', cadence: '24h SLA for P0', status: 'enforced' },
    { name: 'Quarterly Vendor & Spend Audit', owner: 'Finance', cadence: 'Every 90 days', status: 'active' },
    { name: 'Customer Data Export / GDPR Compliance', owner: 'Legal & Privacy', cadence: 'On Demand', status: 'enforced' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Operations & Execution', href: '#' },
          { label: 'Processes' },
        ]}
        title="Operational Processes & Governance"
        description="Standard operating procedures, governance guardrails, and compliance workflows."
        badge={<Badge variant="info">SOC-2 Audited</Badge>}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Process
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processes.map((proc, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">{proc.name}</CardTitle>
              <Badge variant="success">{proc.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-[#9AA0A6] pt-2 border-t border-[#202637]">
                <span>Owner: {proc.owner}</span>
                <span className="font-mono">{proc.cadence}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
