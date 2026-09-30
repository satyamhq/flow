'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Settings, Save, Sliders, Globe, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { currentOrg } = useFlow();

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Organization', href: '#' },
          { label: 'Platform Settings' },
        ]}
        title="Organization & Platform Settings"
        description="Configure regional localization, financial calendar parameters, and entity custom fields."
        badge={<Badge variant="info">Organization ID: {currentOrg.id}</Badge>}
        actions={
          <Button variant="primary" size="sm">
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Localization & Financial Currency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Timezone"
              defaultValue={currentOrg.timezone}
              helperText="Used for timestamp formatting across audit logs and telemetry."
            />
            <Input
              label="Reporting Currency"
              defaultValue={currentOrg.currency}
              helperText="Base currency for financial charts and billing."
            />
            <Input
              label="Fiscal Year End"
              defaultValue="December 31"
              helperText="Determines quarterly cadence boundaries."
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Fields Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Custom Entity Schema Fields
            </CardTitle>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Extend Customers, Projects, Leads, and Tasks with custom attributes (Text, Number, Select, URL, Relation).
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Field
          </Button>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-[var(--border)] text-xs">
            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)] block">Customer Security Score</span>
                <span className="text-[11px] text-[var(--text-secondary)] font-mono">Type: Number • Target: Customers</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)] block">Project Risk Category</span>
                <span className="text-[11px] text-[var(--text-secondary)] font-mono">Type: Single Select • Target: Projects</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
