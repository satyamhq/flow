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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const { currentOrg } = useFlow();
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
        { name: 'Marketing', href: `${prefix}/marketing`, icon: Megaphone },
        { name: 'Brand', href: `${prefix}/brand`, icon: Palette },
        { name: 'Sales CRM', href: `${prefix}/sales`, icon: Briefcase },
        { name: 'Customers', href: `${prefix}/customers`, icon: Users },
        { name: 'Distribution', href: `${prefix}/distribution`, icon: Network },
      ],
    },
    {
      title: 'OPERATE',
      items: [
        { name: 'Operations', href: `${prefix}/operations`, icon: Cpu },
        { name: 'Finance', href: `${prefix}/finance`, icon: DollarSign },
        { name: 'People & HR', href: `${prefix}/people`, icon: UserCheck },
        { name: 'Processes', href: `${prefix}/processes`, icon: Workflow },
      ],
    },
    {
      title: 'KNOWLEDGE',
      items: [
        { name: 'Documents', href: `${prefix}/documents`, icon: FileText },
        { name: 'Wiki', href: `${prefix}/wiki`, icon: BookOpen },
      ],
    },
    {
      title: 'DATA',
      items: [
        { name: 'Analytics', href: `${prefix}/analytics`, icon: BarChart3 },
        { name: 'Reports', href: `${prefix}/reports`, icon: FileSpreadsheet },
      ],
    },
    {
      title: 'AUTOMATE',
      items: [
        { name: 'Workflows', href: `${prefix}/automations`, icon: GitBranch },
        { name: 'Integrations', href: `${prefix}/integrations`, icon: Sliders },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { name: 'Flow AI', href: `${prefix}/flow-ai`, icon: Bot, badge: 'Agent' },
        { name: 'Insights', href: `${prefix}/insights`, icon: Sparkles },
      ],
    },
    {
      title: 'ADMIN',
      items: [
        { name: 'Organization', href: `${prefix}/admin`, icon: Building },
        { name: 'Security & IAM', href: `${prefix}/admin?tab=security`, icon: ShieldAlert },
        { name: 'Billing', href: `${prefix}/admin?tab=billing`, icon: CreditCard },
        { name: 'Settings', href: `${prefix}/settings`, icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-56 h-[calc(100vh-3rem)] bg-[#0E131F] border-r border-[#202637] flex flex-col justify-between overflow-y-auto select-none text-[#EDF2F7] text-xs custom-scrollbar">
      <div className="py-2.5 px-2 space-y-3">
        {navSections.map((section) => {
          const isCollapsed = collapsedSections[section.title];
          return (
            <div key={section.title} className="space-y-0.5">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-semibold text-[#9AA0A6] hover:text-[#EDF2F7] tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>{section.title}</span>
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3 text-[#5F6368]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#5F6368]" />
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
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded font-medium transition-all ${
                          isActive
                            ? 'bg-[rgba(26,115,232,0.12)] text-[#8AB4F8] border border-[rgba(26,115,232,0.3)] font-semibold'
                            : 'text-[#9AA0A6] hover:text-[#EDF2F7] hover:bg-[#161D2D]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8AB4F8]' : 'text-[#9AA0A6]'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                              item.badge === 'Agent'
                                ? 'bg-[rgba(26,115,232,0.2)] text-[#8AB4F8] border border-[rgba(26,115,232,0.35)]'
                                : 'bg-[#181E2E] text-[#9AA0A6] border border-[#252D40]'
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
      <div className="p-3 border-t border-[#202637] bg-[#0B0E14] text-[11px] text-[#9AA0A6] flex items-center justify-between font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
          <span className="text-[10px]">US-East (185ms)</span>
        </div>
        <span className="text-[10px] text-[#5F6368]">Flow v2.4</span>
      </div>
    </aside>
  );
}
