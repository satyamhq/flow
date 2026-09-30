'use client';

import React, { useState, useEffect } from 'react';
import { useFlow } from '@/context/flow-context';
import { Box, Plus, Rocket, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface ProductEntry {
  id: string;
  name: string;
  stage: string;
  desc: string;
}

export default function ProductPage() {
  const { currentOrg } = useFlow();
  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formStage, setFormStage] = useState('Beta');
  const [formDesc, setFormDesc] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`flow_tenant_${currentOrg.id}_products`);
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    }
  }, [currentOrg.id]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newProd: ProductEntry = {
      id: `prod_${Date.now()}`,
      name: formName.trim(),
      stage: formStage,
      desc: formDesc.trim() || 'Product offering under active development.',
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    try {
      localStorage.setItem(`flow_tenant_${currentOrg.id}_products`, JSON.stringify(updated));
    } catch {}

    setFormName('');
    setFormDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: currentOrg.name, href: `/app/org/${currentOrg.slug}/overview` },
          { label: 'Product & Engineering', href: '#' },
          { label: 'Product Workspace' },
        ]}
        title="Product Portfolio & Feature Pipeline"
        description="Portfolio management, product specifications, customer feedback, and release tracking."
        badge={
          <Badge variant={products.length > 0 ? 'info' : 'neutral'}>
            {products.length} Product{products.length === 1 ? '' : 's'} Active
          </Badge>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Product
          </Button>
        }
      />

      {isModalOpen && (
        <div className="p-4 rounded-lg bg-[#111622] border border-[#202637] space-y-3 max-w-lg">
          <h3 className="text-xs font-semibold text-[#EDF2F7]">Register New Product</h3>
          <form onSubmit={handleCreateProduct} className="space-y-3">
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Nexus Core Engine"
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Lifecycle Stage</label>
              <select
                value={formStage}
                onChange={(e) => setFormStage(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              >
                <option value="Concept">Concept</option>
                <option value="Alpha">Alpha</option>
                <option value="Beta">Beta</option>
                <option value="General Availability">General Availability</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[#9AA0A6] block mb-1">Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={2}
                placeholder="Brief description of product capabilities..."
                className="w-full text-xs px-3 py-1.5 bg-[#0B0E14] border border-[#202637] rounded text-[#EDF2F7] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Product
              </Button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <EmptyState
          icon={Box}
          title="No products in portfolio"
          description="Register your company's core software products, APIs, or service offerings to manage features and releases."
          actionLabel="New Product"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id} className="hover:border-[#8AB4F8]/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">{p.name}</CardTitle>
                <Badge variant={p.stage === 'General Availability' ? 'success' : 'info'}>
                  {p.stage}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-[#9AA0A6] leading-relaxed">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
