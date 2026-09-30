'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useFlow } from '@/context/flow-context';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  Lock,
  CheckCircle2,
  DollarSign,
  Users,
  Workflow,
  FolderKanban,
  BarChart3,
  GitBranch,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Globe,
  BookOpen,
  Play,
  Activity,
  Building2,
  Target,
  FileText,
  Bot,
  Rocket,
  Briefcase,
  PieChart,
  Settings,
  Search,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   FLOW LANDING PAGE
   Inspired by Google Cloud's enterprise design language.
   Original identity — no copied logos, assets, or exact text.
   ───────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const { theme, setTheme } = useFlow();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  /* ── Navigation structure ───────────────────────────────────────── */
  const megaMenus: Record<string, { title: string; items: { label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] }[]> = {
    Product: [
      {
        title: 'Core Platform',
        items: [
          { label: 'Projects', desc: 'Plan and track project milestones', icon: FolderKanban },
          { label: 'Tasks', desc: 'Manage work items across teams', icon: CheckCircle2 },
          { label: 'Analytics', desc: 'Real-time company data insights', icon: BarChart3 },
          { label: 'Flow AI', desc: 'AI powered by organizational data', icon: Sparkles },
        ],
      },
      {
        title: 'Business Operations',
        items: [
          { label: 'Customers', desc: 'Customer records and lifecycle', icon: Users },
          { label: 'Finance', desc: 'Revenue, budgets, and expenses', icon: DollarSign },
          { label: 'Operations', desc: 'Processes and workflows', icon: Workflow },
          { label: 'People', desc: 'Teams, roles, and permissions', icon: Building2 },
        ],
      },
    ],
    Solutions: [
      {
        title: 'By Function',
        items: [
          { label: 'Product & Engineering', desc: 'Build and ship faster', icon: Cpu },
          { label: 'Marketing & Sales', desc: 'Grow revenue pipelines', icon: TrendingUp },
          { label: 'Finance & Operations', desc: 'Run efficient operations', icon: Briefcase },
          { label: 'People & Teams', desc: 'Organize your workforce', icon: Users },
        ],
      },
      {
        title: 'By Capability',
        items: [
          { label: 'AI Intelligence', desc: 'Company-wide AI assistant', icon: Bot },
          { label: 'Integrations', desc: 'Connect existing tools', icon: GitBranch },
          { label: 'Security & Compliance', desc: 'Enterprise-grade controls', icon: ShieldCheck },
          { label: 'Real-time Analytics', desc: 'Live business dashboards', icon: PieChart },
        ],
      },
    ],
  };

  /* ── Section data ───────────────────────────────────────────────── */
  const sections = [
    {
      id: 'platform',
      title: 'One platform. Every function.',
      subtitle: 'Manage the entire company from one connected system.',
      description: 'Break down departmental silos. Flow aggregates real-time company data across engineering, customer success, finance, and leadership into one unified database.',
      icon: Layers,
      color: '#1A73E8',
      features: ['Unified organizational database', 'Cross-functional context sharing', 'Real-time event telemetry'],
    },
    {
      id: 'engineering',
      title: 'Product & Engineering',
      subtitle: 'Projects, tasks, product planning and engineering workflows.',
      description: 'Track roadmap milestones, manage task backlogs with structured workflows, and monitor project health across distributed teams.',
      icon: Cpu,
      color: '#34A853',
      features: ['Strategic project delivery', 'Task lifecycle management', 'Team workload visibility'],
    },
    {
      id: 'sales',
      title: 'Marketing & Sales',
      subtitle: 'Campaigns, leads, opportunities and customer relationships.',
      description: 'Track inbound customer acquisition channels, monitor conversion stages, and manage sales deals through an intuitive pipeline.',
      icon: TrendingUp,
      color: '#FBBC04',
      features: ['Lead qualification pipeline', 'Channel attribution', 'Conversion tracking'],
    },
    {
      id: 'customers',
      title: 'Customers',
      subtitle: 'Customer records, interactions and lifecycle information.',
      description: 'Maintain enterprise client rosters, calculate revenue contribution, and monitor health scores to reduce churn.',
      icon: Users,
      color: '#1A73E8',
      features: ['Contract value tracking', 'Client health scores', 'Lifecycle monitoring'],
    },
    {
      id: 'operations',
      title: 'Operations',
      subtitle: 'Processes, workflows, documents and company operations.',
      description: 'Standardize operations with formal runbooks, compliance protocols, and verifiable execution standards.',
      icon: Workflow,
      color: '#EA4335',
      features: ['Operating runbooks', 'Process automation', 'Compliance records'],
    },
    {
      id: 'finance',
      title: 'Finance',
      subtitle: 'Financial records, budgets, expenses and business visibility.',
      description: 'Maintain transparency with real revenue accounting, budget allocation versus actual spend, and ledger tracking.',
      icon: DollarSign,
      color: '#34A853',
      features: ['Revenue aggregation', 'Ledger tracking', 'Budget analytics'],
    },
    {
      id: 'people',
      title: 'People',
      subtitle: 'Teams, roles, permissions and organization management.',
      description: 'Organize your team hierarchy, assign role-based permissions, and manage organization membership.',
      icon: Users,
      color: '#8AB4F8',
      features: ['Role-based access control', 'Team directory', 'Secure invitations'],
    },
    {
      id: 'analytics',
      title: 'Analytics',
      subtitle: 'Turn real company data into useful insights.',
      description: 'Every metric, chart, and indicator is computed directly from verified database records. No synthetic data.',
      icon: BarChart3,
      color: '#1A73E8',
      features: ['Work distribution analysis', 'Customer breakdowns', 'Milestone velocity'],
    },
    {
      id: 'ai',
      title: 'AI',
      subtitle: 'Use AI across the company using authorized organizational data.',
      description: 'Flow AI answers questions strictly from verified tenant data with grounded, contextual intelligence.',
      icon: Sparkles,
      color: '#8AB4F8',
      features: ['Contextual intelligence', 'Grounded AI responses', 'Cross-department insights'],
    },
    {
      id: 'integrations',
      title: 'Integrations',
      subtitle: 'Connect the tools the company already uses.',
      description: 'Synchronize with developer tools, payment processors, communication apps, and calendar platforms.',
      icon: GitBranch,
      color: '#FBBC04',
      features: ['GitHub CI/CD', 'Stripe billing', 'Slack notifications'],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[#1A73E8]/20 selection:text-[#1A73E8] flex flex-col transition-colors">
      {/* ──────────────── HEADER ──────────────── */}
      <header
        className={`h-16 bg-[var(--color-surface)]/98 backdrop-blur-xl sticky top-0 z-50 transition-all duration-200 ${
          headerScrolled ? 'border-b border-[var(--color-border)] shadow-sm' : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo + Nav */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white shadow-sm font-bold text-base transition-transform group-hover:scale-105">
                F
              </div>
              <span className="font-semibold tracking-wider text-[15px] text-[var(--color-text)]">Flow</span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1 text-[13px] font-medium text-[var(--color-text-secondary)]">
              {/* Mega menu dropdowns */}
              {Object.entries(megaMenus).map(([key, columns]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(key)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
                    <span>{key}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                  </button>

                  {activeDropdown === key && (
                    <div className="absolute left-0 top-full pt-2 z-50">
                      <div className="w-[560px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl p-6 grid grid-cols-2 gap-6">
                        {columns.map((col) => (
                          <div key={col.title}>
                            <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                              {col.title}
                            </p>
                            <div className="space-y-1">
                              {col.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.label}
                                    href="#product"
                                    className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors group/item"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <Icon className="w-4 h-4 text-[#1A73E8]" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-semibold text-[var(--color-text)] group-hover/item:text-[#1A73E8] transition-colors">{item.label}</span>
                                      <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug">{item.desc}</p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Simple nav links */}
              <Link href="#product" className="px-3 py-2 rounded-md hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors">
                Resources
              </Link>
              <Link href="#pricing" className="px-3 py-2 rounded-md hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors">
                Pricing
              </Link>
              <Link href="#docs" className="px-3 py-2 rounded-md hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors">
                Documentation
              </Link>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 text-[13px]">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              aria-label="Toggle light/dark theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FBBC04]" />
              ) : (
                <Moon className="w-4 h-4 text-[#5F6368]" />
              )}
            </button>

            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] font-medium transition-colors"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="px-4 py-2 rounded-md bg-[#1A73E8] hover:bg-[#185ABC] text-white font-medium shadow-sm transition-all flex items-center space-x-1.5 text-sm"
            >
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ──────────────── MOBILE MENU ──────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-[var(--color-bg)] overflow-y-auto">
          <nav className="max-w-md mx-auto px-6 py-8 space-y-6">
            {Object.entries(megaMenus).map(([key, columns]) => (
              <div key={key} className="space-y-3">
                <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{key}</h3>
                {columns.map((col) => (
                  <div key={col.title} className="space-y-1 pl-2">
                    {col.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href="#product"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 p-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                        >
                          <Icon className="w-4 h-4 text-[#1A73E8]" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
            <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#1A73E8] py-2">
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2.5 rounded-md bg-[#1A73E8] text-white font-medium text-sm"
              >
                Get started free
              </Link>
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1">
        {/* ──────────────── HERO SECTION ──────────────── */}
        <section className="relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-[0.035] bg-gradient-to-b from-[#1A73E8] to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              {/* Announcement pill */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-medium text-[#1A73E8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-pulse" />
                <span>The operating system for modern companies</span>
              </div>

              {/* Main headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-bold tracking-tight text-[var(--color-text)] leading-[1.08]">
                Run your entire company{' '}
                <br className="hidden sm:block" />
                from one place.
              </h1>

              {/* Supporting copy */}
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--color-text-secondary)] font-normal leading-relaxed">
                Flow brings projects, people, customers, operations, finance, analytics, AI, and integrations into one connected company operating system.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-3 rounded-md bg-[#1A73E8] hover:bg-[#185ABC] text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center space-x-2"
                >
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="#product"
                  className="w-full sm:w-auto px-8 py-3 rounded-md bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore Flow</span>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-xs text-[var(--color-text-secondary)]">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
                  <span>Row Level Security</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-[#1A73E8]" />
                  <span>PostgreSQL Database</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FBBC04]" />
                  <span>Enterprise Auth</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8AB4F8]" />
                  <span>AI-Powered</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────── PRODUCT PREVIEW ──────────────── */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-20">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="h-10 bg-[var(--color-bg)] px-4 flex items-center justify-between border-b border-[var(--color-border)] text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EA4335]/60" />
                  <div className="w-3 h-3 rounded-full bg-[#FBBC04]/60" />
                  <div className="w-3 h-3 rounded-full bg-[#34A853]/60" />
                </div>
                <div className="hidden sm:flex items-center bg-[var(--color-surface)] px-3 py-1 rounded-md border border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] font-mono min-w-[200px]">
                  <Lock className="w-3 h-3 text-[#34A853] mr-1.5" />
                  console.flow.app/org/overview
                </div>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[#34A853]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                <span className="hidden sm:inline">PostgreSQL • RLS Active</span>
              </div>
            </div>

            {/* Console UI */}
            <div className="bg-[var(--color-bg)]">
              {/* Console topbar */}
              <div className="h-10 px-4 flex items-center justify-between border-b border-[var(--color-border)]">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded bg-[#1A73E8] flex items-center justify-center text-white text-[9px] font-bold">F</div>
                  <span className="text-[11px] font-semibold text-[var(--color-text)]">Flow Console</span>
                  <span className="text-[var(--color-border)]">/</span>
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Acme Inc.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center bg-[var(--color-surface)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[10px] text-[var(--color-text-secondary)]">
                    <Search className="w-3 h-3 mr-1.5" />
                    <span>Search</span>
                    <kbd className="ml-4 px-1 text-[9px] bg-[var(--color-bg)] rounded border border-[var(--color-border)]">⌘K</kbd>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#1A73E8] flex items-center justify-center text-white text-[8px] font-bold">S</div>
                </div>
              </div>

              <div className="flex min-h-[320px] sm:min-h-[400px]">
                {/* Sidebar preview */}
                <div className="hidden sm:block w-44 border-r border-[var(--color-border)] py-3 px-2 space-y-3">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider px-2 pb-1">Home</p>
                    <div className="flex items-center space-x-2 px-2 py-1.5 rounded bg-[rgba(26,115,232,0.12)] text-[10px] font-semibold text-[#1A73E8]">
                      <Activity className="w-3 h-3" />
                      <span>Overview</span>
                    </div>
                    <div className="flex items-center space-x-2 px-2 py-1.5 text-[10px] text-[var(--color-text-secondary)]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>My Work</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider px-2 pb-1">Build</p>
                    {[
                      { icon: FolderKanban, label: 'Projects' },
                      { icon: CheckCircle2, label: 'Tasks' },
                      { icon: Rocket, label: 'Releases' },
                    ].map(({ icon: I, label }) => (
                      <div key={label} className="flex items-center space-x-2 px-2 py-1.5 text-[10px] text-[var(--color-text-secondary)]">
                        <I className="w-3 h-3" />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider px-2 pb-1">Grow</p>
                    {[
                      { icon: Users, label: 'Customers' },
                      { icon: Briefcase, label: 'Sales CRM' },
                    ].map(({ icon: I, label }) => (
                      <div key={label} className="flex items-center space-x-2 px-2 py-1.5 text-[10px] text-[var(--color-text-secondary)]">
                        <I className="w-3 h-3" />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider px-2 pb-1">Intelligence</p>
                    <div className="flex items-center space-x-2 px-2 py-1.5 text-[10px] text-[var(--color-text-secondary)]">
                      <Sparkles className="w-3 h-3" />
                      <span>Flow AI</span>
                    </div>
                    <div className="flex items-center space-x-2 px-2 py-1.5 text-[10px] text-[var(--color-text-secondary)]">
                      <BarChart3 className="w-3 h-3" />
                      <span>Analytics</span>
                    </div>
                  </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 p-4 sm:p-6 space-y-4">
                  {/* Welcome header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--color-text)]">Good morning, Sarah.</h3>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">Acme Inc. • 3 projects active, 12 tasks in progress</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[9px]">
                      {['Today', '7d', '30d', 'Q'].map((r, i) => (
                        <button
                          key={r}
                          className={`px-2 py-0.5 rounded ${i === 2 ? 'bg-[#1A73E8] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* KPI cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Run-Rate ARR', value: '$1.2M', delta: '+18%', deltaColor: 'text-[#34A853]' },
                      { label: 'Active Customers', value: '47', delta: '3 Enterprise', deltaColor: 'text-[#1A73E8]' },
                      { label: 'Active Projects', value: '12', delta: '8 In Progress', deltaColor: 'text-[#34A853]' },
                      { label: 'Work Items', value: '156', delta: '94 Complete', deltaColor: 'text-[#34A853]' },
                    ].map((kpi) => (
                      <div key={kpi.label} className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1">
                        <span className="text-[9px] text-[var(--color-text-secondary)] uppercase tracking-wide">{kpi.label}</span>
                        <div className="text-base font-bold text-[var(--color-text)] font-mono">{kpi.value}</div>
                        <span className={`text-[9px] font-medium ${kpi.deltaColor}`}>{kpi.delta}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI insight bar */}
                  <div className="p-3 rounded-lg bg-[rgba(26,115,232,0.06)] border border-[rgba(26,115,232,0.2)] flex items-start space-x-2.5">
                    <div className="p-1 rounded bg-[rgba(26,115,232,0.14)]">
                      <Sparkles className="w-3.5 h-3.5 text-[#8AB4F8]" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold text-[var(--color-text)]">Flow AI Insight</span>
                      <p className="text-[10px] text-[var(--color-text-secondary)] leading-snug">
                        Customer revenue concentration: Top 3 accounts represent 62% of total ARR. Consider diversification strategy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────── PRODUCT SECTIONS ──────────────── */}
        <section id="product" className="border-t border-[var(--color-border)]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 space-y-16">
            {/* Section header */}
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text)]">
                An operating system for every company function
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Replace fragmented point solutions with one coherent data model and unified permission boundaries.
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.id}
                    className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[#1A73E8]/40 transition-all flex flex-col"
                  >
                    <div className="flex items-start space-x-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${sec.color}14` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: sec.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text)]">{sec.title}</h3>
                        <p className="text-[11px] text-[#1A73E8] font-medium mt-0.5">{sec.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4 flex-1">
                      {sec.description}
                    </p>

                    <ul className="space-y-1.5 pt-3 border-t border-[var(--color-border)]">
                      {sec.features.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-2 text-[11px] text-[var(--color-text-secondary)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853] flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──────────────── SECURITY & ARCHITECTURE ──────────────── */}
        <section id="architecture" className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
                Enterprise security & infrastructure
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Built for enterprise security, compliance, and data sovereignty from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Lock,
                  color: '#1A73E8',
                  title: 'Row Level Security',
                  desc: 'Tenant isolation enforced directly in PostgreSQL, preventing cross-tenant data access.',
                },
                {
                  icon: ShieldCheck,
                  color: '#34A853',
                  title: 'Audit Logging',
                  desc: 'Immutable audit records track administrative changes, role delegations, and security policies.',
                },
                {
                  icon: Database,
                  color: '#FBBC04',
                  title: 'PostgreSQL Database',
                  desc: 'All business records stored persistently in PostgreSQL with automatic backups.',
                },
                {
                  icon: Sparkles,
                  color: '#8AB4F8',
                  title: 'Grounded AI',
                  desc: 'Flow AI answers from verified tenant data with strict anti-fabrication constraints.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}14` }}>
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">{item.title}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──────────────── CTA SECTION ──────────────── */}
        <section className="border-t border-[var(--color-border)]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20">
            <div className="relative p-10 sm:p-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center overflow-hidden">
              {/* Background treatment */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.04] bg-[#1A73E8] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-[0.03] bg-[#34A853] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative space-y-5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-text)]">
                  Ready to unify your company operations?
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl mx-auto">
                  Set up your organization workspace in minutes. Connect your tools, invite your team, and start running with real data.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/signup"
                    className="px-8 py-3 rounded-md bg-[#1A73E8] hover:bg-[#185ABC] text-white text-sm font-semibold shadow-sm transition-all flex items-center space-x-2"
                  >
                    <span>Get started free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3 rounded-md bg-[var(--color-bg)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-semibold transition-all"
                  >
                    Sign in to existing account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ──────────────── FOOTER ──────────────── */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-xs transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white font-bold text-xs">
                  F
                </div>
                <span className="font-semibold text-sm text-[var(--color-text)]">Flow</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs">
                The operating system for modern companies. Strategy, product, growth, operations, finance, and AI unified in one platform.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <span className="font-semibold text-[var(--color-text)] block text-xs">Product</span>
              <ul className="space-y-2 text-xs">
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Projects</Link></li>
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Tasks</Link></li>
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Finance</Link></li>
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Flow AI</Link></li>
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Integrations</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="space-y-3">
              <span className="font-semibold text-[var(--color-text)] block text-xs">Solutions</span>
              <ul className="space-y-2 text-xs">
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Engineering</Link></li>
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Marketing & Growth</Link></li>
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Customer Success</Link></li>
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Operations</Link></li>
                <li><Link href="#product" className="hover:text-[var(--color-text)] transition-colors">Analytics</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <span className="font-semibold text-[var(--color-text)] block text-xs">Company</span>
              <ul className="space-y-2 text-xs">
                <li><Link href="/login" className="hover:text-[var(--color-text)] transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-[var(--color-text)] transition-colors">Create Account</Link></li>
                <li><Link href="/onboarding" className="hover:text-[var(--color-text)] transition-colors">Setup Workspace</Link></li>
                <li><Link href="#docs" className="hover:text-[var(--color-text)] transition-colors">Documentation</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 mt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
            <div>&copy; {new Date().getFullYear()} Flow Systems Inc. All rights reserved.</div>
            <div className="flex items-center space-x-4">
              <span>Supabase PostgreSQL</span>
              <span className="text-[var(--color-border)]">•</span>
              <span>Vercel Edge</span>
              <span className="text-[var(--color-border)]">•</span>
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
