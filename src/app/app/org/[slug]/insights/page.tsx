'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function InsightsPage() {
  const { currentOrg, insights } = useFlow();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Intelligence & AI', href: '#' },
          { label: 'Autonomous Insights' },
        ]}
        title="Autonomous Company Insights"
        description="Continuous AI observation synthesizing cross-department telemetry into actionable recommendations."
        badge={<Badge variant="info">Observation Engine Active</Badge>}
        actions={
          <Button variant="secondary" size="sm">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Synthesize Real-Time Insights
          </Button>
        }
      />

      <div className="space-y-4">
        {insights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="neutral">{insight.category}</Badge>
                <span className="text-xs text-[#9AA0A6] font-mono">{insight.timestamp}</span>
              </div>
              <Badge variant="success">
                Confidence: {Math.round(insight.confidenceScore * 100)}%
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <CardTitle className="text-sm font-semibold">{insight.title}</CardTitle>
              <p className="text-xs text-[#9AA0A6] leading-relaxed">{insight.summary}</p>

              <div className="pt-3 border-t border-[#202637] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#0E131F] border border-[#202637]">
                  <span className="text-[10px] font-semibold text-[#9AA0A6] uppercase tracking-wider block mb-1">
                    Supporting Telemetry
                  </span>
                  <span className="text-[#EDF2F7]">{insight.supportingData}</span>
                </div>

                <div className="p-3 rounded bg-[#0E131F] border border-[#202637]">
                  <span className="text-[10px] font-semibold text-[#81C995] uppercase tracking-wider block mb-1">
                    Recommended Action
                  </span>
                  <span className="text-[#81C995] font-medium">{insight.recommendedAction}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
