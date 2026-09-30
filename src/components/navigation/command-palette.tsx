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

  const taskItems = tasks.map((t) => ({
    id: `task-${t.id}`,
    category: 'Tasks',
    title: t.title,
    icon: CheckCircle2,
    action: () => {
      setIsSearchOpen(false);
      router.push(`/app/org/${currentOrg.slug}/tasks`);
    },
  }));

  const customerItems = customers.map((c) => ({
    id: `cust-${c.id}`,
    category: 'Customers',
    title: `${c.name} (${c.tier})`,
    icon: Users,
    action: () => {
      setIsSearchOpen(false);
      router.push(`/app/org/${currentOrg.slug}/customers`);
    },
  }));

  const orgItems = organizations.map((o) => ({
    id: `org-${o.id}`,
    category: 'Switch Organization',
    title: `Switch to ${o.name}`,
    icon: Building,
    action: () => {
      switchOrganization(o.slug);
      setIsSearchOpen(false);
      router.push(`/app/org/${o.slug}/overview`);
    },
  }));

  const allItems = [...commands, ...projectItems, ...taskItems, ...customerItems, ...orgItems];

  const filteredItems = query
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 10);

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
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#111622] border border-[#202637] rounded-lg shadow-2xl overflow-hidden animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[#202637] bg-[#0E131F]">
          <Search className="w-4 h-4 text-[#9AA0A6] mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search across all resources... (esc to close)"
            className="w-full bg-transparent text-[#EDF2F7] placeholder-[#5F6368] text-xs focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-[#9AA0A6] bg-[#161D2D] px-1.5 py-0.5 rounded border border-[#202637]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-[#5F6368] text-xs">
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
                    isSelected ? 'bg-[rgba(26,115,232,0.14)] text-white border border-[rgba(26,115,232,0.3)]' : 'text-[#EDF2F7] hover:bg-[#161D2D]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#8AB4F8]' : 'text-[#9AA0A6]'}`} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[#9AA0A6] uppercase tracking-wider font-mono">{item.category}</span>
                    <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-[#8AB4F8]' : 'text-transparent'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#181E2E] bg-[#0B0E14] flex items-center justify-between text-[11px] text-[#9AA0A6]">
          <div className="flex items-center space-x-3">
            <span>
              Navigate <kbd className="font-mono bg-[#161D2D] px-1 py-0.5 rounded text-[10px]">↑↓</kbd>
            </span>
            <span>
              Select <kbd className="font-mono bg-[#161D2D] px-1 py-0.5 rounded text-[10px]">↵</kbd>
            </span>
            <span>
              Close <kbd className="font-mono bg-[#161D2D] px-1 py-0.5 rounded text-[10px]">esc</kbd>
            </span>
          </div>
          <span className="font-mono text-[10px]">Flow Universal Search</span>
        </div>
      </div>
    </div>
  );
}
