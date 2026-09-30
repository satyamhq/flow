'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import {
  Search,
  Plus,
  Bot,
  FolderKanban,
  CheckCircle2,
  Users,
  FileText,
  Building,
  Settings,
  ArrowRight,
} from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const {
    isSearchOpen,
    setIsSearchOpen,
    currentOrg,
    organizations,
    switchOrganization,
    projects,
    tasks,
    customers,
    setIsCreateOpen,
    setCreateType,
  } = useFlow();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const commands = [
    {
      id: 'cmd-task',
      category: 'Actions',
      title: 'Create new task',
      icon: Plus,
      action: () => {
        setIsSearchOpen(false);
        setCreateType('task');
        setIsCreateOpen(true);
      },
    },
    {
      id: 'cmd-proj',
      category: 'Actions',
      title: 'Create new project',
      icon: FolderKanban,
      action: () => {
        setIsSearchOpen(false);
        setCreateType('project');
        setIsCreateOpen(true);
      },
    },
    {
      id: 'cmd-ai',
      category: 'Flow AI',
      title: 'Ask Flow AI a question...',
      icon: Bot,
      action: () => {
        setIsSearchOpen(false);
        router.push(`/app/org/${currentOrg.slug}/flow-ai`);
      },
    },
    {
      id: 'cmd-settings',
      category: 'Navigation',
      title: 'Open Organization Settings',
      icon: Settings,
      action: () => {
        setIsSearchOpen(false);
        router.push(`/app/org/${currentOrg.slug}/settings`);
      },
    },
  ];

  const projectItems = projects.map((p) => ({
    id: `proj-${p.id}`,
    category: 'Projects',
    title: p.name,
    icon: FolderKanban,
    action: () => {
      setIsSearchOpen(false);
      router.push(`/app/org/${currentOrg.slug}/projects/${p.id}`);
    },
  }));

  const taskItems = tasks.slice(0, 10).map((t) => ({
    id: `task-${t.id}`,
    category: 'Tasks',
    title: t.title,
    icon: CheckCircle2,
    action: () => {
      setIsSearchOpen(false);
      router.push(`/app/org/${currentOrg.slug}/tasks`);
    },
  }));

  const customerItems = customers.slice(0, 10).map((c) => ({
    id: `cust-${c.id}`,
    category: 'Customers',
    title: c.name,
    icon: Users,
    action: () => {
      setIsSearchOpen(false);
      router.push(`/app/org/${currentOrg.slug}/customers`);
    },
  }));

  const orgItems = organizations.map((org) => ({
    id: `org-${org.id}`,
    category: 'Switch Organization',
    title: org.name,
    icon: Building,
    action: () => {
      setIsSearchOpen(false);
      switchOrganization(org.slug);
      router.push(`/app/org/${org.slug}/overview`);
    },
  }));

  const allItems = [...commands, ...projectItems, ...taskItems, ...customerItems, ...orgItems];

  const filteredItems = query
    ? allItems.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredItems[selectedIndex];
      if (target) target.action();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[var(--surface-base)] border border-[var(--border)] rounded-lg shadow-2xl overflow-hidden animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-header)]">
          <Search className="w-4 h-4 text-[var(--text-secondary)] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search across all resources... (esc to close)"
            className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--border)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)] text-xs">
              No matching resources found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--primary-subtle)] text-[#1A73E8] border border-[rgba(26,115,232,0.3)] font-semibold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1A73E8]' : 'text-[var(--text-secondary)]'}`} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                      {item.category}
                    </span>
                    <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-[#1A73E8]' : 'text-transparent'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--surface-header)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <div className="flex items-center space-x-3">
            <span>
              Navigate <kbd className="font-mono bg-[var(--surface-elevated)] px-1 py-0.5 rounded text-[10px]">↑↓</kbd>
            </span>
            <span>
              Select <kbd className="font-mono bg-[var(--surface-elevated)] px-1 py-0.5 rounded text-[10px]">↵</kbd>
            </span>
            <span>
              Close <kbd className="font-mono bg-[var(--surface-elevated)] px-1 py-0.5 rounded text-[10px]">esc</kbd>
            </span>
          </div>
          <span className="font-mono text-[10px]">Flow Universal Search</span>
        </div>
      </div>
    </div>
  );
}
