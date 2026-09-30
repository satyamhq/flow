'use client';

import React from 'react';
import { useFlow } from '@/context/flow-context';
import { Palette, Download, Sparkles, BookOpen, Type, Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function BrandPage() {
  const { currentOrg } = useFlow();

  const colors = [
    { name: 'Console Void Base', hex: '#0B0E14', role: 'Global Viewport Canvas' },
    { name: 'Surface Base Card', hex: '#111622', role: 'Cards & Structural Modules' },
    { name: 'Surface Elevated', hex: '#161D2D', role: 'Interactive Elements & Modals' },
    { name: 'Enterprise Blue', hex: '#1A73E8', role: 'Primary CTAs & Active States' },
    { name: 'Telemetry Emerald', hex: '#0D904F', role: 'Health & Completed Status' },
    { name: 'Attention Amber', hex: '#E37400', role: 'Needs Attention Warnings' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Brand & Marketing', href: '#' },
          { label: 'Brand Center' },
        ]}
        title="Brand System & Design Guidelines"
        description="Central repository for design tokens, voice, tone, positioning pillars, and production assets."
        badge={<Badge variant="info">Enterprise v2.0</Badge>}
        actions={
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Download Brand Kit (.zip)
          </Button>
        }
      />

      {/* Voice, Tone & Messaging */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#8AB4F8]">
              Brand Personality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[var(--text-primary)] leading-relaxed">
              Intelligent, calm, precise, technical, trustworthy, and enterprise-grade. We avoid generic hype, excessive decorative animations, and gimmicks in favor of clean infrastructure aesthetics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#8AB4F8]">
              Primary Tagline & Positioning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
              &ldquo;Flow — The operating system for modern companies. Everything your company needs to move forward.&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Color System Tokens */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Color System Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {colors.map((c, idx) => (
              <div key={idx} className="p-3 rounded bg-[var(--surface-header)] border border-[var(--border)] space-y-2">
                <div
                  className="w-full h-12 rounded border border-[var(--border)] shadow-inner"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] block truncate">{c.name}</span>
                  <span className="block font-mono text-[10px] text-[#8AB4F8] mt-0.5">{c.hex}</span>
                  <span className="block text-[10px] text-[var(--text-secondary)] mt-0.5 truncate">{c.role}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography Tokens */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Typography Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Primary Interface: <span className="font-semibold text-[var(--text-primary)]">Inter / System Sans-Serif</span> with tabular numeric feature flags (<code className="font-mono text-[11px] text-[#8AB4F8]">tnum</code>) for enterprise metrics. Monospace: <span className="font-semibold text-[var(--text-primary)]">JetBrains Mono / Geist Mono</span> for code and financial figures.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
