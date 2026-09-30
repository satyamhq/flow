'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Organization,
  UserProfile,
  Project,
  Task,
  StrategicGoal,
  ProductItem,
  ProductFeature,
  Deployment,
  Customer,
  Lead,
  MarketingCampaign,
  Transaction,
  Employee,
  DocumentItem,
  AutomationWorkflow,
  AIInsight,
  Integration,
  AuditLog,
} from '@/types/flow';

const DEMO_ORGS: Organization[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Acme AI',
    slug: 'acme',
    industry: 'Artificial Intelligence & Enterprise SaaS',
    stage: 'Scale-up',
    teamSize: '85 employees',
    description: 'Unified company operations and autonomous agent infrastructure for modern enterprises.',
    plan: 'enterprise',
    timezone: 'America/New_York (EST)',
    currency: 'USD',
    metrics: {
      mrr: 1308333,
      arr: 15700000,
      revenueGrowth: 18.4,
      burnRate: 210000,
      runwayMonths: 36,
      grossMargin: 84.5,
      totalCustomers: 142,
      netRetentionRate: 134,
      healthScore: 94,
    },
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'TravelTree',
    slug: 'traveltree',
    industry: 'Travel Tech & Booking Logistics',
    stage: 'Growth',
    teamSize: '32 employees',
    description: 'Autonomous corporate travel booking and carbon offset management.',
    plan: 'business',
    timezone: 'America/Chicago (CST)',
    currency: 'USD',
    metrics: {
      mrr: 266666,
      arr: 3200000,
      revenueGrowth: 12.1,
      burnRate: 95000,
      runwayMonths: 24,
      grossMargin: 78.0,
      totalCustomers: 58,
      netRetentionRate: 118,
      healthScore: 89,
    },
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    name: 'Pipal Tech',
    slug: 'pipal',
    industry: 'FinTech Infrastructure',
    stage: 'Startup',
    teamSize: '14 employees',
    description: 'Cross-border clearing rails and real-time ledger settlement APIs.',
    plan: 'pro',
    timezone: 'Europe/London (GMT)',
    currency: 'USD',
    metrics: {
      mrr: 70833,
      arr: 850000,
      revenueGrowth: 28.5,
      burnRate: 42000,
      runwayMonths: 18,
      grossMargin: 88.2,
      totalCustomers: 19,
      netRetentionRate: 142,
      healthScore: 92,
    },
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    name: 'Personal Workspace',
    slug: 'personal',
    industry: 'Individual Projects',
    stage: 'Idea',
    teamSize: '1 member',
    description: 'Personal strategic scratchpad and experimental development playground.',
    plan: 'free',
    timezone: 'UTC',
    currency: 'USD',
  },
];

const INITIAL_USER: UserProfile = {
  id: 'u0000000-0000-0000-0000-000000000001',
  email: 'satyam@acme.ai',
  fullName: 'Satyam',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80',
  timezone: 'America/New_York',
  theme: 'dark',
  defaultOrgId: 'a0000000-0000-0000-0000-000000000001',
  title: 'Founder & CEO',
  department: 'Executive',
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    name: 'Flow Core Platform Redesign',
    slug: 'core-redesign',
    description: 'Unified high-density operating system interface with sub-100ms navigation and Google Cloud scale architecture.',
    status: 'in_progress',
    priority: 'urgent',
    ownerId: 'u1',
    ownerName: 'Satyam',
    team: 'Core Engineering',
    goalId: 'g2',
    startDate: '2026-08-01',
    dueDate: '2026-10-15',
    progress: 84,
    tasksCount: { total: 24, done: 19 },
    budgetAllocated: 250000,
    budgetSpent: 195000,
  },
  {
    id: 'p2',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    name: 'Enterprise SSO & IAM Directory Sync',
    slug: 'sso-iam',
    description: 'SAML 2.0, Okta, SCIM directory synchronization and audit vault for Fortune 500 security compliance.',
    status: 'in_progress',
    priority: 'high',
    ownerId: 'u2',
    ownerName: 'Elena Rostova',
    team: 'Security & Infra',
    goalId: 'g3',
    startDate: '2026-08-15',
    dueDate: '2026-10-01',
    progress: 92,
    tasksCount: { total: 16, done: 14 },
    budgetAllocated: 120000,
    budgetSpent: 108000,
  },
  {
    id: 'p3',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    name: 'Edge Latency & Distributed Read Replicas',
    slug: 'edge-latency',
    description: 'Global multi-region read replicas with Supabase Postgres and Vercel edge caching rules.',
    status: 'in_progress',
    priority: 'medium',
    ownerId: 'u3',
    ownerName: 'Marcus Chen',
    team: 'Core Engineering',
    goalId: 'g2',
    startDate: '2026-09-01',
    dueDate: '2026-11-15',
    progress: 58,
    tasksCount: { total: 18, done: 10 },
    budgetAllocated: 80000,
    budgetSpent: 42000,
  },
  {
    id: 'p4',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    name: 'Q3 Enterprise Expansion Campaign',
    slug: 'q3-campaign',
    description: 'Targeted account-based marketing and technical whitepapers for CTOs and VPs of Engineering.',
    status: 'in_progress',
    priority: 'high',
    ownerId: 'u4',
    ownerName: 'Aria Vance',
    team: 'Growth & Marketing',
    goalId: 'g1',
    startDate: '2026-07-01',
    dueDate: '2026-09-30',
    progress: 95,
    tasksCount: { total: 30, done: 28 },
    budgetAllocated: 180000,
    budgetSpent: 165000,
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    projectId: 'p1',
    projectName: 'Flow Core Platform Redesign',
    title: 'Verify RLS partition policies across Postgres cluster',
    description: 'Ensure all tenant tables enforce organization_id security boundaries with index-backed query plans.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: { id: 'u1', name: 'Satyam', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80' },
    dueDate: 'Tomorrow',
    tags: ['Security', 'Database', 'P0'],
    createdAt: '2026-09-28',
  },
  {
    id: 't2',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    projectId: 'p1',
    projectName: 'Flow Core Platform Redesign',
    title: 'Deploy Vercel Edge middleware rate limiter',
    description: 'Sliding window token bucket for strict authentication and API endpoints.',
    status: 'done',
    priority: 'high',
    assignee: { id: 'u3', name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80' },
    dueDate: 'Yesterday',
    tags: ['Infra', 'Edge'],
    createdAt: '2026-09-27',
  },
  {
    id: 't3',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    projectId: 'p2',
    projectName: 'Enterprise SSO & IAM Directory Sync',
    title: 'Finalize SCIM 2.0 User Provisioning spec with Okta',
    description: 'Automated de-provisioning and team group assignment synchronization.',
    status: 'in_progress',
    priority: 'high',
    assignee: { id: 'u2', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80' },
    dueDate: 'In 3 days',
    tags: ['IAM', 'Compliance'],
    createdAt: '2026-09-29',
  },
  {
    id: 't4',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    projectId: 'p3',
    projectName: 'Edge Latency & Distributed Read Replicas',
    title: 'Benchmarking TTFB across Tokyo, Frankfurt and US-East',
    description: 'Simulate 10k concurrent simulated requests to assess tail latency under load.',
    status: 'todo',
    priority: 'medium',
    assignee: { id: 'u3', name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80' },
    dueDate: 'Oct 8',
    tags: ['Performance'],
    createdAt: '2026-09-29',
  },
  {
    id: 't5',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    projectId: 'p4',
    projectName: 'Q3 Enterprise Expansion Campaign',
    title: 'Review executive ROI deck with Fortune 100 prospect',
    description: 'Coordinate with Sales Engineering on customized multi-tenant deployment architecture.',
    status: 'blocked',
    priority: 'urgent',
    assignee: { id: 'u1', name: 'Satyam', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80' },
    dueDate: 'Today',
    tags: ['Sales', 'Executive'],
    createdAt: '2026-09-29',
  },
];

const INITIAL_GOALS: StrategicGoal[] = [
  {
    id: 'g1',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    title: 'Reach $20M ARR with 85% Gross Margin',
    description: 'Accelerate enterprise expansion while maintaining exceptional capital efficiency.',
    status: 'on_track',
    progress: 78.5,
    targetDate: '2026-12-31',
    timeframe: 'FY 2026',
    keyResults: [
      { id: 'kr1', goalId: 'g1', title: 'Current Run-Rate ARR', currentValue: 15.7, targetValue: 20.0, unit: '$M', status: 'on_track' },
      { id: 'kr2', goalId: 'g1', title: 'Net Revenue Retention', currentValue: 134, targetValue: 130, unit: '%', status: 'on_track' },
      { id: 'kr3', goalId: 'g1', title: 'Gross Margin', currentValue: 84.5, targetValue: 85.0, unit: '%', status: 'on_track' },
    ],
    relatedProjectIds: ['p4'],
  },
  {
    id: 'g2',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    title: 'Ship Flow 2.0 Autonomous Operating Engine',
    description: 'Next-generation company-aware AI agents with sub-200ms latency and contextual reasoning.',
    status: 'on_track',
    progress: 68.0,
    targetDate: '2026-10-31',
    timeframe: 'Q3 2026',
    keyResults: [
      { id: 'kr4', goalId: 'g2', title: 'P95 Query Latency', currentValue: 185, targetValue: 200, unit: 'ms', status: 'on_track' },
      { id: 'kr5', goalId: 'g2', title: 'Agent Autonomous Resolution Rate', currentValue: 64, targetValue: 75, unit: '%', status: 'on_track' },
    ],
    relatedProjectIds: ['p1', 'p3'],
  },
  {
    id: 'g3',
    organizationId: 'a0000000-0000-0000-0000-000000000001',
    title: 'SOC-2 Type II & FedRAMP Readiness Certification',
    description: 'Zero-trust enterprise security compliance and continuous audit capabilities.',
    status: 'on_track',
    progress: 92.0,
    targetDate: '2026-11-15',
    timeframe: 'Q3 2026',
    keyResults: [
      { id: 'kr6', goalId: 'g3', title: 'Audit Controls Passed', currentValue: 108, targetValue: 110, unit: 'controls', status: 'on_track' },
      { id: 'kr7', goalId: 'g3', title: 'Automated Penetration Test Remediation', currentValue: 100, targetValue: 100, unit: '%', status: 'on_track' },
    ],
    relatedProjectIds: ['p2'],
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Vercel Inc.', domain: 'vercel.com', tier: 'strategic', arr: 480000, healthScore: 98, status: 'active', accountOwner: 'Satyam', contractStart: '2025-01-01', contractEnd: '2027-01-01', npsScore: 92 },
  { id: 'c2', name: 'Stripe Payments', domain: 'stripe.com', tier: 'strategic', arr: 620000, healthScore: 96, status: 'active', accountOwner: 'Satyam', contractStart: '2024-06-01', contractEnd: '2026-06-01', npsScore: 95 },
  { id: 'c3', name: 'Linear Orbit Inc.', domain: 'linear.app', tier: 'enterprise', arr: 240000, healthScore: 94, status: 'active', accountOwner: 'Elena Rostova', contractStart: '2025-03-15', contractEnd: '2026-03-15', npsScore: 90 },
  { id: 'c4', name: 'Retool Inc.', domain: 'retool.com', tier: 'enterprise', arr: 180000, healthScore: 88, status: 'active', accountOwner: 'Elena Rostova', contractStart: '2025-05-01', contractEnd: '2026-05-01', npsScore: 84 },
  { id: 'c5', name: 'Supabase Pte. Ltd.', domain: 'supabase.com', tier: 'strategic', arr: 350000, healthScore: 99, status: 'active', accountOwner: 'Satyam', contractStart: '2024-11-01', contractEnd: '2026-11-01', npsScore: 98 },
];

const INITIAL_LEADS: Lead[] = [
  { id: 'l1', name: 'David Sacks', company: 'Craft Ventures Portfolio Co', email: 'david@craft.com', value: 320000, stage: 'negotiation', probability: 85, source: 'Executive Referral', owner: 'Satyam', nextAction: 'Send revised Master Service Agreement' },
  { id: 'l2', name: 'Sarah Guo', company: 'Conviction AI Systems', email: 'sarah@conviction.com', value: 250000, stage: 'proposal', probability: 70, source: 'Inbound Demo', owner: 'Aria Vance', nextAction: 'Technical architecture review call' },
  { id: 'l3', name: 'Guillermo Rauch', company: 'Next-Gen Edge Infra Corp', email: 'ceo@edgeinfra.io', value: 500000, stage: 'demo', probability: 50, source: 'Conference Keynote', owner: 'Satyam', nextAction: 'Live Flow Agent platform walkthrough' },
  { id: 'l4', name: 'Amjad Masad', company: 'Global Cloud IDEs', email: 'amjad@cloudide.com', value: 180000, stage: 'qualified', probability: 40, source: 'Product Hunt', owner: 'Elena Rostova', nextAction: 'Security questionnaire review' },
];

const INITIAL_INSIGHTS: AIInsight[] = [
  {
    id: 'ai1',
    category: 'Revenue',
    title: 'Enterprise Expansion Accelerated (+18.4%)',
    summary: 'Enterprise customer average ACV expanded from $185k to $242k following the SOC-2 compliance rollout, adding $1.45M in new pipeline value.',
    supportingData: 'Analysis across 42 active enterprise accounts. Net Revenue Retention reached 134%.',
    confidenceScore: 0.98,
    recommendedAction: 'Allocate 2 additional dedicated Solution Architects to assist Enterprise Sales pipeline conversion.',
    timestamp: '2 hours ago',
    severity: 'info',
  },
  {
    id: 'ai2',
    category: 'Attention',
    title: 'CAC increased 11.2% in LinkedIn Ads Channel',
    summary: 'Paid acquisition costs elevated over 14-day rolling window due to rising auction CPMs in enterprise developer categories.',
    supportingData: 'Spend: $38,400 | Generated Leads: 56 | CAC: $685 (Target: $550).',
    confidenceScore: 0.92,
    recommendedAction: 'Reallocate $15,000 monthly ad budget into Organic Developer Relations and High-Intent Search.',
    timestamp: '5 hours ago',
    severity: 'warning',
  },
  {
    id: 'ai3',
    category: 'Engineering',
    title: 'API P95 Response Latency Improved 34%',
    summary: 'Migration to Next.js Server Components and distributed Supabase connection caching reduced average TTFB from 320ms to 210ms.',
    supportingData: '99.98% uptime observed across 4.8M API requests in the past 7 days.',
    confidenceScore: 0.96,
    recommendedAction: 'Promote edge caching rules to remaining analytics telemetry endpoints.',
    timestamp: '1 day ago',
    severity: 'info',
  },
];

interface FlowContextType {
  currentOrg: Organization;
  organizations: Organization[];
  currentUser: UserProfile;
  dateRange: string;
  setDateRange: (range: string) => void;
  switchOrganization: (slug: string) => void;
  createOrganization: (org: Partial<Organization>) => void;
  
  // Modals & UI State
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  createType: string;
  setCreateType: (type: string) => void;

  // Domain data
  projects: Project[];
  tasks: Task[];
  goals: StrategicGoal[];
  customers: Customer[];
  leads: Lead[];
  insights: AIInsight[];

  // Mutators
  createProject: (project: Partial<Project>) => void;
  createTask: (task: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  deleteTask: (taskId: string) => void;
  createCustomer: (customer: Partial<Customer>) => void;
  createLead: (lead: Partial<Lead>) => void;
  askFlowAI: (prompt: string) => Promise<string>;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>(DEMO_ORGS);
  const [currentOrg, setCurrentOrg] = useState<Organization>(DEMO_ORGS[0]);
  const [currentUser] = useState<UserProfile>(INITIAL_USER);
  const [dateRange, setDateRange] = useState<string>('30 days');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [createType, setCreateType] = useState('task');

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [goals, setGoals] = useState<StrategicGoal[]>(INITIAL_GOALS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [insights, setInsights] = useState<AIInsight[]>(INITIAL_INSIGHTS);

  // Keyboard shortcut listener
  useEffect(() => {
    let lastKey = '';
    let keyTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts inside text inputs or textareas
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      // ⌘K or Ctrl+K -> Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // C -> Create
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setCreateType('task');
        setIsCreateOpen(true);
        return;
      }

      // ? -> Shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Sequential shortcuts: G then D (Dashboard), G then P (Projects), G then T (Tasks), G then S (Settings)
      if (lastKey === 'g') {
        if (e.key === 'd') {
          e.preventDefault();
          window.location.href = `/app/org/${currentOrg.slug}/overview`;
        } else if (e.key === 'p') {
          e.preventDefault();
          window.location.href = `/app/org/${currentOrg.slug}/projects`;
        } else if (e.key === 't') {
          e.preventDefault();
          window.location.href = `/app/org/${currentOrg.slug}/tasks`;
        } else if (e.key === 's') {
          e.preventDefault();
          window.location.href = `/app/org/${currentOrg.slug}/settings`;
        }
        lastKey = '';
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        lastKey = 'g';
        clearTimeout(keyTimeout);
        keyTimeout = setTimeout(() => {
          lastKey = '';
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(keyTimeout);
    };
  }, [currentOrg.slug]);

  const switchOrganization = (slug: string) => {
    const org = organizations.find((o) => o.slug === slug);
    if (org) {
      setCurrentOrg(org);
    }
  };

  const createOrganization = (orgData: Partial<Organization>) => {
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: orgData.name || 'New Organization',
      slug: (orgData.name || 'new-org').toLowerCase().replace(/\s+/g, '-'),
      industry: orgData.industry || 'Technology',
      stage: (orgData.stage as any) || 'Startup',
      teamSize: orgData.teamSize || '1-10',
      description: orgData.description || 'Modern company operating with Flow',
      plan: 'pro',
      timezone: 'UTC',
      currency: 'USD',
      metrics: {
        mrr: 10000,
        arr: 120000,
        revenueGrowth: 15.0,
        burnRate: 15000,
        runwayMonths: 24,
        grossMargin: 80.0,
        totalCustomers: 5,
        netRetentionRate: 110,
        healthScore: 90,
      },
    };
    setOrganizations((prev) => [...prev, newOrg]);
    setCurrentOrg(newOrg);
  };

  const createProject = (p: Partial<Project>) => {
    const newProj: Project = {
      id: `p_${Date.now()}`,
      organizationId: currentOrg.id,
      name: p.name || 'Untitled Project',
      slug: (p.name || 'project').toLowerCase().replace(/\s+/g, '-'),
      description: p.description || '',
      status: p.status || 'in_progress',
      priority: p.priority || 'medium',
      ownerId: currentUser.id,
      ownerName: currentUser.fullName,
      team: p.team || 'General',
      startDate: p.startDate || new Date().toISOString().split('T')[0],
      dueDate: p.dueDate || '2026-12-31',
      progress: 0,
      tasksCount: { total: 0, done: 0 },
      budgetAllocated: p.budgetAllocated || 50000,
      budgetSpent: 0,
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const createTask = (t: Partial<Task>) => {
    const newTask: Task = {
      id: `t_${Date.now()}`,
      organizationId: currentOrg.id,
      projectId: t.projectId || projects[0]?.id,
      projectName: projects.find((p) => p.id === t.projectId)?.name || 'General Operations',
      title: t.title || 'Untitled Task',
      description: t.description || '',
      status: t.status || 'todo',
      priority: t.priority || 'medium',
      assignee: t.assignee || {
        id: currentUser.id,
        name: currentUser.fullName,
        avatar: currentUser.avatarUrl,
      },
      dueDate: t.dueDate || 'Next week',
      tags: t.tags || ['General'],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const createCustomer = (c: Partial<Customer>) => {
    const newCust: Customer = {
      id: `c_${Date.now()}`,
      name: c.name || 'New Enterprise Client',
      domain: c.domain || 'example.com',
      tier: c.tier || 'growth',
      arr: c.arr || 120000,
      healthScore: 95,
      status: 'active',
      accountOwner: currentUser.fullName,
      contractStart: new Date().toISOString().split('T')[0],
      contractEnd: '2027-12-31',
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const createLead = (l: Partial<Lead>) => {
    const newLead: Lead = {
      id: `l_${Date.now()}`,
      name: l.name || 'New Prospect',
      company: l.company || 'Enterprise Prospect Inc.',
      email: l.email || 'lead@example.com',
      value: l.value || 150000,
      stage: l.stage || 'qualified',
      probability: l.probability || 60,
      source: l.source || 'Direct Outreach',
      owner: currentUser.fullName,
      nextAction: l.nextAction || 'Schedule introductory architecture call',
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const askFlowAI = async (prompt: string): Promise<string> => {
    // Simulated company-aware intelligent agent synthesis
    await new Promise((res) => setTimeout(res, 800));
    const lower = prompt.toLowerCase();

    if (lower.includes('revenue') || lower.includes('arr') || lower.includes('financial')) {
      return `### Financial Operating Status — ${currentOrg.name}
- **Run-Rate ARR:** $15.7M (up +18.4% MoM)
- **Net Revenue Retention (NRR):** 134% across 142 enterprise accounts
- **Gross Margin:** 84.5% with unit hosting costs declining by 6% post-edge deployment
- **Cash Runway:** 36 months ($210k net monthly burn)
- **Key Driver:** Enterprise expansion deals closed in Q2 with SOC-2 Type II attestation.`;
    }

    if (lower.includes('risk') || lower.includes('attention') || lower.includes('overdue')) {
      return `### Critical Items Requiring Attention:
1. **Marketing Paid CAC Spike:** LinkedIn Ads acquisition costs rose 11.2% ($685 vs $550 benchmark). Recommend reallocating $15k to High-Intent Search.
2. **Blocked Task:** "Review executive ROI deck with Fortune 100 prospect" requires CEO input today.
3. **Deployment Velocity:** 2 pull requests pending security signoff for SCIM 2.0 provisioning.`;
    }

    if (lower.includes('project') || lower.includes('engineering') || lower.includes('launch')) {
      return `### Engineering & Product Milestone Summary:
- **Flow Core Platform Redesign:** 84% completed, tracking for Oct 15 delivery.
- **Enterprise SSO & IAM:** 92% completed, Okta directory sync testing passed.
- **Edge Latency Optimization:** 58% completed, multi-region database read replicas online.
- **Current P95 Latency:** 185ms (well within the <200ms target).`;
    }

    return `Based on live telemetry for **${currentOrg.name}**, your company is operating in top-quartile SaaS metrics with $15.7M ARR, 134% NRR, and 84.5% gross margin. 4 active projects are tracking across 85 team members. What specific area (Finance, Engineering, Sales, or Strategy) would you like me to analyze deeper?`;
  };

  return (
    <FlowContext.Provider
      value={{
        currentOrg,
        organizations,
        currentUser,
        dateRange,
        setDateRange,
        switchOrganization,
        createOrganization,
        isSearchOpen,
        setIsSearchOpen,
        isCreateOpen,
        setIsCreateOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        createType,
        setCreateType,
        projects,
        tasks,
        goals,
        customers,
        leads,
        insights,
        createProject,
        createTask,
        updateTaskStatus,
        deleteTask,
        createCustomer,
        createLead,
        askFlowAI,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}
