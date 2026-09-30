'use client';

import React, { useState, useEffect } from 'react';
import { useFlow } from '@/context/flow-context';
import { FileSpreadsheet, Download, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface ReportItem {
  id: string;
  title: string;
  period: string;
  format: string;
}

export default function ReportsPage() {
  const { currentOrg, projects, tasks, customers } = useFlow();
  const [reports, setReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_reports`);
      if (stored) {
        setReports(JSON.parse(stored));
      } else {
        setReports([]);
      }
    } catch {
      setReports([]);
    }
  }, [currentOrg.id]);

  const handleGenerateReport = () => {
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      title: `${currentOrg.name} Telemetry Snapshot (${projects.length} Projects, ${customers.length} Accounts)`,
      period: 'Trailing 30 Days',
      format: 'CSV Export',
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_reports`, JSON.stringify(updated));
    } catch {}
  };

  const handleDownload = (report: ReportItem) => {
    const content = `Organization: ${currentOrg.name}\nReport: ${report.title}\nPeriod: ${report.period}\nExport Timestamp: ${new Date().toISOString()}\nTotal Projects: ${projects.length}\nTotal Tasks: ${tasks.length}\nTotal Customers: ${customers.length}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Data & Reporting', href: '#' },
          { label: 'Generated Reports' },
        ]}
        title="Generated Board Reports & Audit Ledgers"
        description="Board packages, compliance audit snapshots, and export ledgers generated from verified data."
        badge={
          <Badge variant={reports.length > 0 ? 'info' : 'neutral'}>
            {reports.length} Generated
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={handleGenerateReport}>
            <Plus className="w-4 h-4 mr-1.5" />
            Generate Telemetry Report
          </Button>
        }
      />

      {reports.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No reports generated yet"
          description="Generate an executive report or telemetry snapshot export based on your current organization records."
          actionLabel="Generate Telemetry Report"
          onAction={handleGenerateReport}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-[#202637]">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 flex items-center justify-between text-xs hover:bg-[#161D2D]/40 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-[#EDF2F7] block">{r.title}</span>
                    <span className="block text-[11px] text-[#9AA0A6] mt-0.5 font-mono">
                      {r.period} • {r.format}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" className="h-8" onClick={() => handleDownload(r)}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
