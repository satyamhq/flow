'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { FileSpreadsheet, Download, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const { currentOrg } = useFlow();

  const reports = [
    { title: 'Monthly Executive Board Financial Operating Pack', period: 'September 2026', format: 'PDF & CSV' },
    { title: 'SOC-2 Continuous Audit Evidence Digest', period: 'Q3 2026', format: 'JSON Audit Log' },
    { title: 'Cohort Net Revenue Retention & Expansion Ledger', period: 'FY 2026', format: 'CSV' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Data & Reporting', href: '#' },
          { label: 'Generated Reports' },
        ]}
        title="Generated Board Reports & Audit Ledgers"
        description="Board packages, compliance audit snapshots, and financial export ledgers."
        badge={<Badge variant="info">Automated Cadence</Badge>}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Generate New Report
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[#202637]">
            {reports.map((r, idx) => (
              <div
                key={idx}
                className="p-4 flex items-center justify-between text-xs hover:bg-[#161D2D]/40 transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#EDF2F7] block">{r.title}</span>
                  <span className="block text-[11px] text-[#9AA0A6] mt-0.5 font-mono">
                    {r.period} • {r.format}
                  </span>
                </div>
                <Button variant="secondary" size="sm" className="h-8">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
