'use client';

import React, { useState } from 'react';
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
  Compass,
  CheckCircle2,
  DollarSign,
  Users,
  Box,
  Workflow,
  FolderKanban,
  BarChart3,
  GitBranch,
  Terminal,
  FileText,
  Key,
  Menu,
  X,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const { theme, setTheme } = useFlow();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Documentation', href: '#docs' },
  ];

  const sections = [
    {
      id: 'platform',
      title: 'One platform',
      subtitle: 'Manage the entire company from one connected system.',
      description: 'Break down departmental silos. Flow aggregates real-time company telemetry across engineering, customer success, finance, and leadership into one authoritative database.',
      icon: Layers,
      color: '#1A73E8',
      features: ['Unified organizational database', 'Cross-functional context sharing', 'Real-time telemetry event bus'],
    },
    {
      id: 'engineering',
      title: 'Product & Engineering',
      subtitle: 'Projects, tasks, product planning, and engineering workflows.',
      description: 'Track roadmap milestones, manage task backlogs with kanban boards, and monitor deployment health with continuous integration verification.',
      icon: Cpu,
      color: '#34A853',
      features: ['Strategic project delivery', 'Granular task lifecycle states', 'GitHub release telemetry'],
    },
    {
      id: 'sales',
      title: 'Marketing & Sales',
      subtitle: 'Campaigns, leads, opportunities, and customer relationships.',
      description: 'Track inbound customer acquisition channels, monitor conversion stages, and manage sales deals through an intuitive pipeline view.',
      icon: TrendingUp,
      color: '#FBBC04',
      features: ['Lead qualification pipeline', 'Acquisition channel attribution', 'Conversion probability tracking'],
    },
    {
      id: 'customers',
      title: 'Customers',
      subtitle: 'Customer records, interactions, and lifecycle information.',
      description: 'Maintain verified enterprise client rosters, calculate ARR contribution, and monitor health scores to reduce churn proactively.',
      icon: Users,
      color: '#1A73E8',
      features: ['Contract value tracking', 'Client health scores', 'Lifecycle status monitoring'],
    },
    {
      id: 'operations',
      title: 'Operations & SOPs',
      subtitle: 'Processes, workflows, documents, and company operations.',
      description: 'Standardize operations with formal operating runbooks, compliance protocols, and verifiable execution standards.',
      icon: Workflow,
      color: '#EA4335',
      features: ['Operating runbook repository', 'Cadence enforcement', 'Compliance audit records'],
    },
    {
      id: 'finance',
      title: 'Finance & Ledger',
      subtitle: 'Financial records, budgets, expenses, and business visibility.',
      description: 'Maintain transparency with real customer revenue accounting, budget allocation versus actual spend, and general ledger tracking.',
      icon: DollarSign,
      color: '#34A853',
      features: ['Customer ARR aggregation', 'Ledger transaction tracking', 'Budget vs. spend analytics'],
    },
    {
      id: 'people',
      title: 'People & Teams',
      subtitle: 'Teams, roles, permissions, and organization management.',
      description: 'Organize your team hierarchy, assign role-based permissions, and manage organization membership backed by Supabase Auth.',
      icon: Users,
      color: '#8AB4F8',
      features: ['Role-based access control (RBAC)', 'Team directory and reporting lines', 'Secure teammate invitations'],
    },
    {
      id: 'analytics',
      title: 'Real-Time Analytics',
      subtitle: 'Turn real company data into useful insights.',
      description: 'Zero fake numbers. Every metric card, progress bar, and distribution chart is computed directly from verified database records.',
      icon: BarChart3,
      color: '#1A73E8',
      features: ['Aggregated work distributions', 'Customer tier breakdowns', 'Historical milestone velocity'],
    },
    {
      id: 'ai',
      title: 'Autonomous Flow AI',
      subtitle: 'Use AI across the company using authorized organizational data.',
      description: 'Powered by Google Gemini with strict zero-hallucination guardrails. Flow AI answers questions strictly from verified tenant telemetry.',
      icon: Sparkles,
      color: '#8AB4F8',
      features: ['Contextual organizational intelligence', 'Strict zero-hallucination constraints', 'Cross-departmental insight generation'],
    },
    {
      id: 'integrations',
      title: 'Connectors & Integrations',
      subtitle: 'Connect the tools the company already uses.',
      description: 'Synchronize seamlessly with developer tools, payment processors, communication apps, and calendar platforms.',
      icon: GitBranch,
      color: '#FBBC04',
      features: ['GitHub Enterprise CI/CD', 'Stripe Billing webhooks', 'Slack event dispatching'],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[#1A73E8] selection:text-white flex flex-col justify-between transition-colors">
      {/* 1. Header (Google Cloud-inspired clean navigation) */}
      <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between w-full transition-colors">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5 font-bold text-base tracking-tight">
            <div className="w-8 h-8 rounded bg-[#1A73E8] flex items-center justify-center text-white shadow-sm font-bold text-base">
              F
            </div>
            <span className="font-semibold tracking-wider text-base text-[var(--color-text)]">FLOW</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium text-[var(--color-text-secondary)]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[var(--color-text)] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
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
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded bg-[#1A73E8] hover:bg-[#185ABC] text-white font-medium shadow-sm transition-colors flex items-center space-x-1"
          >
            <span>Get started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 space-y-3 z-40 transition-colors">
          <nav className="flex flex-col space-y-2 text-xs font-medium text-[var(--color-text-secondary)]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[var(--color-text)]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#1A73E8] font-semibold py-1"
              >
                Sign in to Console
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* 2. Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-mono text-[#1A73E8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-pulse" />
            <span>Flow Console • Enterprise Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[var(--color-text)] leading-[1.1] max-w-4xl mx-auto">
            Run your entire company from one place.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--color-text-secondary)] font-normal leading-relaxed">
            Flow brings projects, people, customers, operations, finance, analytics, AI, and integrations into one connected company operating system.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#1A73E8] hover:bg-[#185ABC] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/app/org/acme/overview"
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Flow</span>
            </Link>
          </div>
        </section>

        {/* 3. Product Visual (Realistic Google Cloud-inspired console preview) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
            {/* Console Window Header */}
            <div className="h-10 bg-[var(--color-bg)] px-4 flex items-center justify-between border-b border-[var(--color-border)] text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34A853]/70" />
                </div>
                <span className="font-mono text-[var(--color-text-secondary)] text-[11px]">
                  console.flow.com/app/org/overview
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[#1A73E8] bg-[var(--color-surface)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                <span>Supabase PostgreSQL • RLS Active</span>
              </div>
            </div>

            {/* Embedded Console UI Preview */}
            <div className="p-4 sm:p-6 space-y-4 bg-[var(--color-bg)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    Flow Operating System — Enterprise Console
                  </h3>
                  <span className="text-[11px] text-[var(--color-text-secondary)]">
                    Observe → Understand → Decide → Execute → Measure
                  </span>
                </div>
                <Badge variant="success" dot>
                  Authoritative Telemetry Online
                </Badge>
              </div>

              {/* Three Pillars Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-text-secondary)]">
                    Data Integrity
                  </span>
                  <div className="text-sm font-bold text-[var(--color-text)] font-mono">
                    Supabase PostgreSQL
                  </div>
                  <span className="text-[10px] text-[#34A853] font-semibold">
                    Zero Fake Metrics • Real Persistence
                  </span>
                </div>

                <div className="p-3.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-text-secondary)]">
                    Multi-Tenancy
                  </span>
                  <div className="text-sm font-bold text-[var(--color-text)] font-mono">
                    Row Level Security
                  </div>
                  <span className="text-[10px] text-[#1A73E8] font-semibold">
                    Strict Organization Partitioning
                  </span>
                </div>

                <div className="p-3.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-text-secondary)]">
                    Autonomous Intelligence
                  </span>
                  <div className="text-sm font-bold text-[var(--color-text)] font-mono">
                    Gemini 1.5 Flash
                  </div>
                  <span className="text-[10px] text-[#1A73E8] font-semibold">
                    Verified Grounded AI Responses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Product Sections (Structured sections inspired by Google Cloud) */}
        <section id="product" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--color-border)] space-y-12">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
              An integrated operating system for every company function
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Replace fragmented point solutions with one coherent data model and unified permission boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <Card
                  key={sec.id}
                  className="bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[#1A73E8]/50 transition-all flex flex-col justify-between"
                >
                  <CardHeader className="space-y-2 pb-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#1A73E8]" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-[var(--color-text)]">
                        {sec.title}
                      </CardTitle>
                      <span className="text-[11px] font-medium text-[#1A73E8] block mt-0.5">
                        {sec.subtitle}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {sec.description}
                    </p>

                    <ul className="space-y-1.5 pt-2 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)]">
                      {sec.features.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853] flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 5. Trust & Architecture Section */}
        <section id="architecture" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--color-border)] space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Enterprise Security & Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Architected for enterprise security, compliance audits, and data sovereignty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <Lock className="w-5 h-5 text-[#1A73E8]" />
              <h3 className="text-xs font-semibold text-[var(--color-text)]">Row Level Security</h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Tenant isolation is enforced directly in PostgreSQL via database policies, preventing cross-tenant leakage.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#34A853]" />
              <h3 className="text-xs font-semibold text-[var(--color-text)]">SOC-2 Audit Readiness</h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Immutable audit logging records administrative changes, role delegations, and security policies.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <Database className="w-5 h-5 text-[#FBBC04]" />
              <h3 className="text-xs font-semibold text-[var(--color-text)]">Supabase PostgreSQL</h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                All business records, projects, customers, and transactions are stored persistently in PostgreSQL.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <Cpu className="w-5 h-5 text-[#1A73E8]" />
              <h3 className="text-xs font-semibold text-[var(--color-text)]">Zero Hallucinations</h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Flow AI answers from verified telemetry with strict anti-fabrication constraints.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Call To Action Banner */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="p-8 sm:p-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center space-y-4 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
              Ready to unify your company operations?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-xl mx-auto">
              Initialize your organization workspace in minutes. Connect your tools, invite your team, and start running on real telemetry.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="px-6 py-2.5 rounded bg-[#1A73E8] hover:bg-[#185ABC] text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-2"
              >
                <span>Create your organization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded bg-[var(--color-bg)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-semibold transition-all"
              >
                Sign in to existing account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Enterprise Footer (Google Cloud-inspired) */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-xs py-12 px-4 sm:px-6 transition-colors">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-[#1A73E8] flex items-center justify-center text-white font-bold text-xs">
                F
              </div>
              <span className="font-semibold text-sm text-[var(--color-text)]">FLOW</span>
            </div>
            <p className="text-xs max-w-sm leading-relaxed">
              Flow is the operating system for modern companies. Strategy, product, growth, operations, finance, and AI unified in one console.
            </p>
            <div className="text-[11px] font-mono text-[var(--color-text-secondary)]">
              Architecture: Supabase PostgreSQL • Gemini 1.5 Flash • Vercel Edge
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-[var(--color-text)] block text-xs uppercase tracking-wider">
              Product
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/app/org/acme/projects" className="hover:text-[var(--color-text)]">Projects</Link></li>
              <li><Link href="/app/org/acme/tasks" className="hover:text-[var(--color-text)]">Tasks</Link></li>
              <li><Link href="/app/org/acme/finance" className="hover:text-[var(--color-text)]">Finance</Link></li>
              <li><Link href="/app/org/acme/flow-ai" className="hover:text-[var(--color-text)]">Flow AI</Link></li>
              <li><Link href="/app/org/acme/integrations" className="hover:text-[var(--color-text)]">Integrations</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-[var(--color-text)] block text-xs uppercase tracking-wider">
              Solutions
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/app/org/acme/strategy" className="hover:text-[var(--color-text)]">Strategy & OKRs</Link></li>
              <li><Link href="/app/org/acme/engineering" className="hover:text-[var(--color-text)]">Engineering</Link></li>
              <li><Link href="/app/org/acme/marketing" className="hover:text-[var(--color-text)]">Marketing & Growth</Link></li>
              <li><Link href="/app/org/acme/customers" className="hover:text-[var(--color-text)]">Customer Success</Link></li>
              <li><Link href="/app/org/acme/operations" className="hover:text-[var(--color-text)]">Operations SOPs</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-[var(--color-text)] block text-xs uppercase tracking-wider">
              Access
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/login" className="hover:text-[var(--color-text)]">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-[var(--color-text)]">Create Account</Link></li>
              <li><Link href="/onboarding" className="hover:text-[var(--color-text)]">Setup Workspace</Link></li>
              <li><Link href="/app/org/acme/settings" className="hover:text-[var(--color-text)]">Security & IAM</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
          <div>
            &copy; {new Date().getFullYear()} Flow Systems Inc. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#privacy" className="hover:text-[var(--color-text)]">Privacy Policy</a>
            <a href="#terms" className="hover:text-[var(--color-text)]">Terms of Service</a>
            <a href="#security" className="hover:text-[var(--color-text)]">Security Overview</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
