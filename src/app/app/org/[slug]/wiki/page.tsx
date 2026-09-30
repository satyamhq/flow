'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { BookOpen, FileText, Plus, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function WikiPage() {
  const { currentOrg, documents, createDocument, currentUser } = useFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const wikiDocs = documents.filter((d: any) => d.category === 'Wiki' || d.category === 'General');

  const handleCreateWiki = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    createDocument({
      title: formTitle.trim(),
      category: 'Wiki',
      snippet: formDesc.trim() || 'Internal wiki documentation.',
      tags: ['Handbook', 'Wiki'],
    });

    setFormTitle('');
    setFormDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Knowledge Base', href: '#' },
          { label: 'Wiki' },
        ]}
        title="Company Wiki & Engineering Handbook"
        description="Collaborative engineering handbook, culture guides, and architectural decision records."
        badge={
          <Badge variant={wikiDocs.length > 0 ? 'info' : 'neutral'}>
            {wikiDocs.length} Wiki Page{wikiDocs.length === 1 ? '' : 's'}
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Wiki Page
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[#111622] border border-[#202637] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[#EDF2F7]">Publish Wiki Article</h3>
          <form onSubmit={handleCreateWiki} className="space-y-3">
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Article Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Engineering Handbook: Development Standards"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Article Body / Content</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                placeholder="Summary or content of the handbook page..."
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Page
              </Button>
            </div>
          </form>
        </div>
      )}

      {wikiDocs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No wiki handbooks published yet"
          description="Create your company's first engineering handbook, culture guide, or operational wiki page."
          actionLabel="New Wiki Page"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wikiDocs.map((sec: any) => (
            <Card key={sec.id} className="hover:border-[#8AB4F8]/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">{sec.title}</CardTitle>
                <Badge variant="neutral">{sec.category}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-[#9AA0A6] leading-relaxed">{sec.snippet}</p>
                <div className="pt-2 border-t border-[#202637] flex items-center justify-between text-[11px] text-[#9AA0A6]">
                  <span>Author: {sec.author || currentUser.fullName}</span>
                  <span className="font-mono">{sec.updated}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
