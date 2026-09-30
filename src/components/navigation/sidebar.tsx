'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import {
  LayoutDashboard,
  CheckSquare,
  Inbox,
  Compass,
  Target,
  Milestone,
  Calendar,
  Box,
  Code2,
  FolderKanban,
  CheckCircle2,
  Rocket,
  Megaphone,
  Palette,
  Briefcase,
  Users,
  Network,
  Cpu,
  DollarSign,
  UserCheck,
  Workflow,
  FileText,
  BookOpen,
  BarChart3,
  FileSpreadsheet,
  GitBranch,
  Bot,
  Sparkles,
  Building,
  ShieldAlert,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  Sliders,
  X,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentOrg, isMobileMenuOpen, setIsMobileMenuOpen } = useFlow();
  const prefix = `/app/org/${currentOrg.slug}`;

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const navSections: NavSection[] = [
    {
      title: 'HOME',
      items: [
        { name: 'Overview', href: `${prefix}/overview`, icon: LayoutDashboard },
        { name: 'My Work', href: `${prefix}/my-work`, icon: CheckSquare, badge: '5' },
        { name: 'Inbox', href: `${prefix}/inbox`, icon: Inbox },
      ],
    },
    {
      title: 'PLAN',
      items: [
        { name: 'Strategy', href: `${prefix}/strategy`, icon: Compass },
        { name: 'Goals', href: `${prefix}/goals`, icon: Target },
        { name: 'OKRs', href: `${prefix}/okrs`, icon: Milestone },
        { name: 'Roadmap', href: `${prefix}/roadmap`, icon: Milestone },
        { name: 'Calendar', href: `${prefix}/calendar`, icon: Calendar },
      ],
    },
    {
      title: 'BUILD',
      items: [
        { name: 'Product', href: `${prefix}/product`, icon: Box },
        { name: 'Engineering', href: `${prefix}/engineering`, icon: Code2 },
        { name: 'Projects', href: `${prefix}/projects`, icon: FolderKanban, badge: '4' },
        { name: 'Tasks', href: `${prefix}/tasks`, icon: CheckCircle2 },
        { name: 'Releases', href: `${prefix}/releases`, icon: Rocket },
      ],
    },
    {
      title: 'GROW',
      items: [
        { name: 'Sales Pipeline', href: `${prefix}/sales`, icon: Briefcase },
        { name: 'Customers & CRM', href: `${prefix}/customers`, icon: Users },
        { name: 'Marketing', href: `${prefix}/marketing`, icon: Megaphone },
        { name: 'Brand Assets', href: `${prefix}/brand`, icon: Palette },
        { name: 'Distribution', href: `${prefix}/distribution`, icon: Network },
      ],
    },
    {
      title: 'OPERATE',
      items: [
        { name: 'Finance & Ledger', href: `${prefix}/finance`, icon: DollarSign },
        { name: 'People & HR', href: `${prefix}/people`, icon: UserCheck },
        { name: 'Operations', href: `${prefix}/operations`, icon: Cpu },
        { name: 'Processes & SOPs', href: `${prefix}/processes`, icon: Workflow },
      ],
    },
    {
      title: 'KNOWLEDGE',
      items: [
        { name: 'Documents', href: `${prefix}/documents`, icon: FileText },
        { name: 'Company Wiki', href: `${prefix}/wiki`, icon: BookOpen },
      ],
    },
    {
      title: 'INTELLIGENCE & DATA',
      items: [
        { name: 'Analytics', href: `${prefix}/analytics`, icon: BarChart3 },
        { name: 'Reports', href: `${prefix}/reports`, icon: FileSpreadsheet },
        { name: 'Flow AI', href: `${prefix}/flow-ai`, icon: Bot, badge: 'Agent' },
        { name: 'Insights', href: `${prefix}/insights`, icon: Sparkles },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Automations', href: `${prefix}/automations`, icon: GitBranch },
        { name: 'Integrations', href: `${prefix}/integrations`, icon: Sliders },
        { name: 'Organization', href: `${prefix}/admin`, icon: Building },
        { name: 'Security & IAM', href: `${prefix}/admin?tab=security`, icon: ShieldAlert },
        { name: 'Billing', href: `${prefix}/admin?tab=billing`, icon: CreditCard },
        { name: 'Settings', href: `${prefix}/settings`, icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header on mobile drawer */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b border-[var(--border)] bg-[var(--surface-header)]">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-[#1A73E8] flex items-center justify-center text-white font-bold text-[10px]">
            F
          </div>
          <span className="font-bold text-xs tracking-wider text-[var(--text-primary)]">NAVIGATION</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List */}
      <div className="py-3 px-2 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {navSections.map((section) => {
          const isCollapsed = collapsedSections[section.title];
          return (
            <div key={section.title} className="space-y-0.5">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>{section.title}</span>
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium text-xs transition-all ${
                          isActive
                            ? 'bg-[var(--primary-subtle)] text-[#1A73E8] border border-[rgba(26,115,232,0.25)] font-semibold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#1A73E8]' : 'text-[var(--text-secondary)]'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                              item.badge === 'Agent'
                                ? 'bg-[rgba(26,115,232,0.18)] text-[#1A73E8] border border-[rgba(26,115,232,0.3)]'
                                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border border-[var(--border)]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer System Telemetry */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-header)] text-[11px] text-[var(--text-secondary)] flex items-center justify-between font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
          <span className="text-[10px]">US-East (185ms)</span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">Flow v2.4</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[var(--surface-header)] border-r border-[var(--border)] shadow-2xl transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 h-[calc(100vh-3rem)] bg-[var(--surface-header)] border-r border-[var(--border)] flex-col justify-between select-none text-[var(--text-primary)] text-xs transition-colors">
        {sidebarContent}
      </aside>
    </>
  );
}
