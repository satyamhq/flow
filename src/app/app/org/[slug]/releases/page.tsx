'use client';

import React, { useState, useEffect } from 'react';
import { useFlow } from '@/context/flow-context';
import { Rocket, CheckCircle2, Clock, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface ReleaseItem {
  id: string;
  version: string;
  title: string;
  date: string;
  status: 'shipped' | 'scheduled';
}

export default function ReleasesPage() {
  const { currentOrg } = useFlow();
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formVersion, setFormVersion] = useState('v1.0.0');
  const [formTitle, setFormTitle] = useState('');
  const [formStatus, setFormStatus] = useState<'shipped' | 'scheduled'>('shipped');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_releases`);
      if (stored) {
        setReleases(JSON.parse(stored));
      } else {
        setReleases([]);
      }
    } catch {
      setReleases([]);
    }
  }, [currentOrg.id]);

  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newRel: ReleaseItem = {
      id: `rel_${Date.now()}`,
      version: formVersion.trim() || 'v1.0.0',
      title: formTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      status: formStatus,
    };

    const updated = [newRel, ...releases];
    setReleases(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_releases`, JSON.stringify(updated));
    } catch {}

    setFormTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Product & Engineering', href: '#' },
          { label: 'Releases' },
        ]}
        title="Production Releases & Changelogs"
        description="Versioned release changelogs, staging rollouts, and production deployments."
        badge={
          <Badge variant={releases.length > 0 ? 'success' : 'neutral'}>
            {releases.length > 0 ? `${releases.length} Release${releases.length === 1 ? '' : 's'}` : 'Zero Releases'}
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create Release Tag
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">Publish Release Version</h3>
          <form onSubmit={handleCreateRelease} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Version Tag</label>
                <input
                  type="text"
                  required
                  value={formVersion}
                  onChange={(e) => setFormVersion(e.target.value)}
                  placeholder="v1.0.0"
                  className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
                >
                  <option value="shipped">Shipped</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Release Highlights / Changelog</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Production launch of enterprise API v1"
                className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Release
              </Button>
            </div>
          </form>
        </div>
      )}

      {releases.length === 0 ? (
        <EmptyState
          icon={Rocket}
          title="No release tags published"
          description="Tag and publish production version releases, feature changelogs, and rollout milestones."
          actionLabel="Create Release"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {releases.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded bg-[#1A73E8]/20 border border-[#1A73E8]/40 flex items-center justify-center text-[#8AB4F8]">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[var(--text-primary)] text-sm">{r.version}</span>
                      <span className="font-medium text-[var(--text-primary)]">{r.title}</span>
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono">Released: {r.date}</span>
                  </div>
                </div>
                <Badge variant={r.status === 'shipped' ? 'success' : 'info'}>
                  {r.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
