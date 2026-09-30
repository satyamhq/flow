'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { FileText, Search, Plus, BookOpen, Clock, Tag } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';

export default function DocumentsPage() {
  const { currentOrg, documents, createDocument, currentUser } = useFlow();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Architecture');
  const [docSnippet, setDocSnippet] = useState('');

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    createDocument({
      title: docTitle.trim(),
      category: docCategory,
      snippet: docSnippet.trim() || 'Internal technical documentation.',
      tags: [docCategory],
    });

    setDocTitle('');
    setDocSnippet('');
    setIsModalOpen(false);
  };

  const filtered = documents.filter(
    (d: any) =>
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.snippet?.toLowerCase().includes(search.toLowerCase()) ||
      d.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Knowledge & Documents', href: '#' },
          { label: 'Documents' },
        ]}
        title="Company Knowledge Base & RFCs"
        description="Internal technical specifications, strategic memos, and operational documentation."
        badge={
          <Badge variant={documents.length > 0 ? 'info' : 'neutral'}>
            {documents.length} Published Docs
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Document
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">Create RFC or Knowledge Document</h3>
          <form onSubmit={handleCreateDoc} className="space-y-3">
            <div>
              <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Document Title</label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. RFC-01: Multi-Region Architecture"
                className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Category</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
              >
                <option value="Architecture">Architecture</option>
                <option value="Strategy">Strategy</option>
                <option value="Product Spec">Product Spec</option>
                <option value="SOP">SOP</option>
                <option value="Wiki">Wiki</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Summary / Brief</label>
              <textarea
                value={docSnippet}
                onChange={(e) => setDocSnippet(e.target.value)}
                rows={3}
                placeholder="Overview of this document..."
                className="w-full text-xs px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Publish Document
              </Button>
            </div>
          </form>
        </div>
      )}

      {documents.length > 0 && (
        <div className="max-w-md">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter documents, RFCs, playbooks..."
          />
        </div>
      )}

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Create your organization's first technical specification, RFC, or product brief."
          actionLabel="New Document"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((d: any) => (
            <Card key={d.id} className="hover:border-[#8AB4F8]/40 transition-colors cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Badge variant="neutral">{d.category}</Badge>
                <span className="text-[11px] text-[var(--text-secondary)] font-mono">{d.updated}</span>
              </CardHeader>

              <CardContent className="space-y-3">
                <CardTitle className="text-sm font-semibold group-hover:text-[#8AB4F8] transition-colors">
                  {d.title}
                </CardTitle>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {d.snippet || 'No description provided.'}
                </p>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>Author: {d.author || currentUser.fullName}</span>
                  <div className="flex space-x-1.5">
                    {(d.tags || []).map((tag: string) => (
                      <span key={tag} className="font-mono text-[9px] bg-[var(--surface-elevated)] text-[#8AB4F8] px-1.5 py-0.5 rounded border border-[var(--border)]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
