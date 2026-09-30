'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { Sliders, CheckCircle2, RefreshCw, ExternalLink, ShieldCheck, Plus, Key } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function IntegrationsPage() {
  const { currentOrg, integrations, toggleIntegration } = useFlow();
  const [selectedIntegration, setSelectedIntegration] = useState<any | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const connectedCount = integrations.filter((i: any) => i.status === 'connected').length;

  const handleOpenConfig = (item: any) => {
    setSelectedIntegration(item);
    setApiKeyInput('');
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      toggleIntegration(selectedIntegration.id);
      setSelectedIntegration(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Connectors', href: '#' },
          { label: 'Integrations' },
        ]}
        title="Enterprise Connectors & Marketplace"
        description="Connect third-party developer, financial, and collaboration systems with Flow's unified data graph."
        badge={
          <Badge variant={connectedCount > 0 ? 'success' : 'neutral'}>
            {connectedCount} of {integrations.length} Connected
          </Badge>
        }
      />

      {selectedIntegration && (
        <div className="p-4 rounded-lg bg-[#111622] border border-[#202637] space-y-3 max-w-lg">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-[#8AB4F8]" />
            <h3 className="text-xs font-semibold text-[#EDF2F7]">Configure {selectedIntegration.name}</h3>
          </div>
          <p className="text-[11px] text-[#9AA0A6]">
            Enter your API credentials or authorization token to establish secure synchronization with {selectedIntegration.name}.
          </p>
          <div className="space-y-2">
            <label className="text-[11px] text-[#9AA0A6] block">Access Token / Webhook Secret</label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk_live_... / ghp_..."
              className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setSelectedIntegration(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveConfig}>
              {selectedIntegration.status === 'connected' ? 'Disconnect' : 'Connect & Authorize'}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item: any) => (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-semibold">{item.name}</CardTitle>
                <span className="block text-[10px] text-[#9AA0A6] uppercase tracking-wider font-mono mt-0.5">
                  {item.category}
                </span>
              </div>
              <Badge variant={item.status === 'connected' ? 'success' : 'neutral'}>
                {item.status}
              </Badge>
            </CardHeader>

            <CardContent>
              <p className="text-xs text-[#9AA0A6] leading-relaxed">{item.desc}</p>
            </CardContent>

            <CardFooter className="pt-3 border-t border-[#202637] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#9AA0A6] font-mono">Last sync: {item.lastSync}</span>
              <Button
                variant={item.status === 'connected' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => handleOpenConfig(item)}
                className="h-7 text-xs"
              >
                {item.status === 'connected' ? 'Disconnect' : 'Connect'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
