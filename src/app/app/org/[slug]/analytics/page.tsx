'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { BarChart3, TrendingUp, Filter, Download, ArrowUpRight, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';

export default function AnalyticsPage() {
  const { currentOrg } = useFlow();
  const [metricType, setMetricType] = useState('revenue');

  const tabs = [
    { id: 'revenue', label: 'Recurring Revenue (ARR)' },
    { id: 'retention', label: 'Cohort Retention (NRR)' },
    { id: 'latency', label: 'Platform Query Latency' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Intelligence & Telemetry', href: '#' },
          { label: 'Analytics' },
        ]}
        title="Analytics & Telemetry Explorer"
        description="Real-time telemetry ingestion, cohort retention, custom metric dimensions, and scheduled reporting."
        badge={<Badge variant="info">Live Stream Active</Badge>}
        actions={
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        }
        tabs={
          <Tabs
            tabs={tabs}
            activeTab={metricType}
            onChange={setMetricType}
          />
        }
      />

      {/* Visualization Canvas */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
          <div>
            <CardTitle className="text-sm font-semibold">
              {metricType === 'revenue' && 'Run-Rate ARR Growth Curve (Trailing 12 Months)'}
              {metricType === 'retention' && 'Enterprise Retention Cohort by Expansion Rate'}
              {metricType === 'latency' && 'Edge Serverless Query Latency Distribution (P50 / P95 / P99)'}
            </CardTitle>
            <span className="text-[11px] text-[#9AA0A6] font-mono">Aggregated from Supabase Postgres telemetry</span>
          </div>

          <Badge variant="success">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" />
            +18.4% Outperformance
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4">
            {[
              { label: 'Q1', val: 55, num: '$9.2M' },
              { label: 'Q2', val: 68, num: '$11.4M' },
              { label: 'Q3', val: 82, num: '$13.8M' },
              { label: 'Q4 (Current)', val: 94, num: '$15.7M' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-mono text-[#EDF2F7] font-semibold">{bar.num}</span>
                <div
                  className="w-full bg-[#1A73E8] hover:bg-[#8AB4F8] rounded-t transition-colors duration-200"
                  style={{ height: `${bar.val}%` }}
                />
                <span className="text-[11px] text-[#9AA0A6] font-medium">{bar.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
