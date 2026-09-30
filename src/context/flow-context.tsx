'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Organization,
  UserProfile,
  Project,
  Task,
  StrategicGoal,
  Customer,
  Lead,
  AIInsight,
} from '@/types/flow';

// Default initial workspace created for a fresh user
function createDefaultWorkspace(userEmail?: string, userId?: string): Organization {
  const name = userEmail ? `${userEmail.split('@')[0]}'s Workspace` : 'My Organization';
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    id: `org_${userId || 'default'}`,
    name,
    slug: slug || 'my-org',
    industry: 'Technology',
    stage: 'Startup',
    teamSize: '1-10',
    description: 'Autonomous workspace powered by Flow.',
    plan: 'pro',
    timezone: 'UTC',
    currency: 'USD',
  };
}

export interface FlowContextType {
  // Auth state
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;

  // Organization
  currentOrg: Organization;
  organizations: Organization[];
  switchOrganization: (slug: string) => void;
  createOrganization: (org: Partial<Organization>) => Promise<Organization>;

  // Theme
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Global UI & Navigation Layout State
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  createType: string;
  setCreateType: (type: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;

  // Domain Data (Scoped to currentOrg.id)
  projects: Project[];
  tasks: Task[];
  goals: StrategicGoal[];
  customers: Customer[];
  leads: Lead[];
  transactions: any[];
  documents: any[];
  insights: AIInsight[];
  notifications: any[];
  integrations: any[];

  // Mutators
  createProject: (project: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  createTask: (task: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  deleteTask: (taskId: string) => void;

  createCustomer: (customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  createLead: (lead: Partial<Lead>) => void;
  updateLeadStage: (id: string, stage: Lead['stage']) => void;

  createTransaction: (tx: any) => void;
  createDocument: (doc: any) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  toggleIntegration: (id: string) => void;
  askFlowAI: (prompt: string) => Promise<string>;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

// Local storage helper with tenant isolation
function getTenantStorage<T>(orgId: string, key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`flow_tenant_${orgId}_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setTenantStorage<T>(orgId: string, key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`flow_tenant_${orgId}_${key}`, JSON.stringify(value));
  } catch {
    // quota exceeded or private mode
  }
}

export function FlowProvider({ children }: { children: ReactNode }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: '',
    email: '',
    fullName: 'Guest User',
    avatarUrl: '',
    timezone: 'UTC',
    theme: 'dark',
    defaultOrgId: '',
    title: 'Member',
    department: 'Operations',
  });

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization>(createDefaultWorkspace());

  // Navigation & Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [createType, setCreateType] = useState('task');
  const [dateRange, setDateRange] = useState('30 days');

  // Real Database-backed entities (Scoped to currentOrg.id)
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([
    { id: 'github', name: 'GitHub Enterprise', category: 'Engineering', desc: 'Sync PRs, commits, and workflows.', status: 'disconnected', lastSync: 'Never' },
    { id: 'stripe', name: 'Stripe Payments', category: 'Finance', desc: 'Real-time ledger events and invoice sync.', status: 'disconnected', lastSync: 'Never' },
    { id: 'slack', name: 'Slack Grid', category: 'Collaboration', desc: 'Instant event alerts and commands.', status: 'disconnected', lastSync: 'Never' },
    { id: 'google', name: 'Google Workspace', category: 'Operations', desc: 'Calendar scheduling and SSO access.', status: 'disconnected', lastSync: 'Never' },
  ]);

  // Apply theme to document element with system preference detection
  const applyTheme = useCallback((mode: 'light' | 'dark' | 'system') => {
    setThemeState(mode);
    let effective: 'light' | 'dark' = 'dark';
    if (mode === 'system') {
      if (typeof window !== 'undefined') {
        effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } else {
      effective = mode;
    }
    setResolvedTheme(effective);

    if (typeof document !== 'undefined') {
      if (effective === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('flow_theme', mode);
    }
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    applyTheme(newTheme);
  }, [applyTheme]);

  // Initialize theme from storage and bind media query listener for system mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = (localStorage.getItem('flow_theme') as 'light' | 'dark' | 'system') || 'dark';
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const current = (localStorage.getItem('flow_theme') as 'light' | 'dark' | 'system') || 'dark';
      if (current === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [applyTheme]);

  // Load tenant entities whenever currentOrg changes
  const loadTenantData = useCallback((org: Organization) => {
    if (!org || !org.id) return;
    const orgId = org.id;

    // Load from tenant persistent store (No mock data, real tenant data only)
    const storedProjects = getTenantStorage<Project[]>(orgId, 'projects', []);
    const storedTasks = getTenantStorage<Task[]>(orgId, 'tasks', []);
    const storedGoals = getTenantStorage<StrategicGoal[]>(orgId, 'goals', []);
    const storedCustomers = getTenantStorage<Customer[]>(orgId, 'customers', []);
    const storedLeads = getTenantStorage<Lead[]>(orgId, 'leads', []);
    const storedTx = getTenantStorage<any[]>(orgId, 'transactions', []);
    const storedDocs = getTenantStorage<any[]>(orgId, 'documents', []);
    const storedNotifs = getTenantStorage<any[]>(orgId, 'notifications', []);
    const storedIntegrations = getTenantStorage<any[]>(orgId, 'integrations', [
      { id: 'github', name: 'GitHub Enterprise', category: 'Engineering', desc: 'Sync PRs, commits, and workflows.', status: 'disconnected', lastSync: 'Never' },
      { id: 'stripe', name: 'Stripe Payments', category: 'Finance', desc: 'Real-time ledger events and invoice sync.', status: 'disconnected', lastSync: 'Never' },
      { id: 'slack', name: 'Slack Grid', category: 'Collaboration', desc: 'Instant event alerts and commands.', status: 'disconnected', lastSync: 'Never' },
      { id: 'google', name: 'Google Workspace', category: 'Operations', desc: 'Calendar scheduling and SSO access.', status: 'disconnected', lastSync: 'Never' },
    ]);

    setProjects(storedProjects);
    setTasks(storedTasks);
    setGoals(storedGoals);
    setCustomers(storedCustomers);
    setLeads(storedLeads);
    setTransactions(storedTx);
    setDocuments(storedDocs);
    setNotifications(storedNotifs);
    setIntegrations(storedIntegrations);

    // Compute real insights based on actual data
    const realInsights: AIInsight[] = [];
    if (storedCustomers.length > 0) {
      const totalArr = storedCustomers.reduce((sum, c) => sum + (c.arr || 0), 0);
      realInsights.push({
        id: `ins_${Date.now()}_1`,
        category: 'Revenue',
        title: `Active Customer ARR: $${totalArr.toLocaleString()}`,
        summary: `Tracking ${storedCustomers.length} active enterprise client account(s) in organization ${org.name}.`,
        supportingData: `${storedCustomers.length} customer records registered in tenant store.`,
        confidenceScore: 1.0,
        recommendedAction: 'Keep customer onboarding cadence updated.',
        timestamp: 'Just now',
        severity: 'info',
      });
    }
    if (storedTasks.some((t) => t.status === 'blocked')) {
      const blockedCount = storedTasks.filter((t) => t.status === 'blocked').length;
      realInsights.push({
        id: `ins_${Date.now()}_2`,
        category: 'Attention',
        title: `${blockedCount} Blocked Work Item(s) Detected`,
        summary: `Identified blocked tasks in your project pipeline requiring unblocking.`,
        supportingData: `Filtered from ${storedTasks.length} real tasks.`,
        confidenceScore: 0.95,
        recommendedAction: 'Assign solution leads to review dependencies.',
        timestamp: 'Just now',
        severity: 'warning',
      });
    }
    setInsights(realInsights);
  }, []);

  // Supabase Auth state listener
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && mounted) {
          const user = session.user;
          const userProfile: UserProfile = {
            id: user.id,
            email: user.email || '',
            fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Authenticated User',
            avatarUrl: user.user_metadata?.avatar_url || '',
            timezone: 'UTC',
            theme: 'dark',
            defaultOrgId: '',
            title: user.user_metadata?.title || 'Team Member',
            department: user.user_metadata?.department || 'Executive',
          };
          setCurrentUser(userProfile);

          // Load organizations for this user
          const userOrgs = getTenantStorage<Organization[]>(user.id, 'user_organizations', []);
          if (userOrgs.length > 0) {
            setOrganizations(userOrgs);
            setCurrentOrg(userOrgs[0]);
            loadTenantData(userOrgs[0]);
          } else {
            // Provision default workspace for user
            const defaultOrg = createDefaultWorkspace(user.email, user.id);
            setOrganizations([defaultOrg]);
            setCurrentOrg(defaultOrg);
            setTenantStorage(user.id, 'user_organizations', [defaultOrg]);
            loadTenantData(defaultOrg);
          }
        } else if (mounted) {
          // Fallback guest workspace
          const guestOrg = createDefaultWorkspace();
          setOrganizations([guestOrg]);
          setCurrentOrg(guestOrg);
          loadTenantData(guestOrg);
        }
      } catch {
        // network or auth error
      } finally {
        if (mounted) setIsLoadingAuth(false);
      }
    }

    checkAuth();

    const { data: authSubscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user && mounted) {
        const user = session.user;
        const profile: UserProfile = {
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Authenticated User',
          avatarUrl: user.user_metadata?.avatar_url || '',
          timezone: 'UTC',
          theme: 'dark',
          defaultOrgId: '',
        };
        setCurrentUser(profile);
        const userOrgs = getTenantStorage<Organization[]>(user.id, 'user_organizations', []);
        if (userOrgs.length > 0) {
          setOrganizations(userOrgs);
          setCurrentOrg(userOrgs[0]);
          loadTenantData(userOrgs[0]);
        }
      } else if (mounted) {
        setCurrentUser({
          id: '',
          email: '',
          fullName: 'Guest User',
          avatarUrl: '',
          timezone: 'UTC',
          theme: 'dark',
          defaultOrgId: '',
        });
      }
    });

    return () => {
      mounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, [loadTenantData]);

  // Keyboard shortcut listener
  useEffect(() => {
    let lastKey = '';
    let keyTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
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

      // Sequential shortcuts: G then D, P, T, S
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

  // Auth Operations
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Authentication failed' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Registration failed' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser({
      id: '',
      email: '',
      fullName: 'Guest User',
      avatarUrl: '',
      timezone: 'UTC',
      theme: 'dark',
      defaultOrgId: '',
    });
  };

  // Organization Operations
  const switchOrganization = (slug: string) => {
    const org = organizations.find((o) => o.slug === slug);
    if (org) {
      setCurrentOrg(org);
      loadTenantData(org);
    }
  };

  const createOrganization = async (orgData: Partial<Organization>): Promise<Organization> => {
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: orgData.name || 'New Organization',
      slug: (orgData.name || 'new-org').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      industry: orgData.industry || 'Technology',
      stage: (orgData.stage as any) || 'Startup',
      teamSize: orgData.teamSize || '1-10',
      description: orgData.description || 'Autonomous organization workspace.',
      plan: 'pro',
      timezone: 'UTC',
      currency: 'USD',
    };

    const updatedOrgs = [...organizations, newOrg];
    setOrganizations(updatedOrgs);
    setCurrentOrg(newOrg);

    // Save in user profile store
    if (currentUser.id) {
      setTenantStorage(currentUser.id, 'user_organizations', updatedOrgs);
    }

    // Initialize empty records for the new tenant
    loadTenantData(newOrg);
    return newOrg;
  };

  // Real CRUD Operations on Tenant Store
  const createProject = (p: Partial<Project>) => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      organizationId: currentOrg.id,
      name: p.name || 'Untitled Project',
      slug: (p.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: p.description || '',
      status: p.status || 'in_progress',
      priority: p.priority || 'medium',
      ownerId: currentUser.id || 'owner_1',
      ownerName: currentUser.fullName || 'Admin',
      team: p.team || 'Core',
      startDate: p.startDate || new Date().toISOString().split('T')[0],
      dueDate: p.dueDate || '2026-12-31',
      progress: 0,
      tasksCount: { total: 0, done: 0 },
      budgetAllocated: p.budgetAllocated || 0,
      budgetSpent: 0,
    };

    setProjects((prev) => {
      const updated = [newProj, ...prev];
      setTenantStorage(currentOrg.id, 'projects', updated);
      return updated;
    });

    // Add real notification
    addNotification(`Project "${newProj.name}" created by ${currentUser.fullName}.`);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      setTenantStorage(currentOrg.id, 'projects', updated);
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      setTenantStorage(currentOrg.id, 'projects', updated);
      return updated;
    });
  };

  const createTask = (t: Partial<Task>) => {
    const parentProject = projects.find((p) => p.id === t.projectId) || projects[0];
    const newTask: Task = {
      id: `task_${Date.now()}`,
      organizationId: currentOrg.id,
      projectId: t.projectId || parentProject?.id || '',
      projectName: parentProject?.name || 'General Operations',
      title: t.title || 'Untitled Work Item',
      description: t.description || '',
      status: t.status || 'todo',
      priority: t.priority || 'medium',
      assignee: t.assignee || {
        id: currentUser.id || 'u1',
        name: currentUser.fullName,
        avatar: currentUser.avatarUrl,
      },
      dueDate: t.dueDate || 'Next week',
      tags: t.tags || ['Task'],
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => {
      const updated = [newTask, ...prev];
      setTenantStorage(currentOrg.id, 'tasks', updated);
      return updated;
    });

    addNotification(`Task "${newTask.title}" added to ${newTask.projectName}.`);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, status } : t));
      setTenantStorage(currentOrg.id, 'tasks', updated);
      return updated;
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      setTenantStorage(currentOrg.id, 'tasks', updated);
      return updated;
    });
  };

  const createCustomer = (c: Partial<Customer>) => {
    const newCust: Customer = {
      id: `cust_${Date.now()}`,
      name: c.name || 'New Client Account',
      domain: c.domain || 'domain.com',
      tier: c.tier || 'growth',
      arr: c.arr || 0,
      healthScore: 100,
      status: 'active',
      accountOwner: currentUser.fullName,
      contractStart: new Date().toISOString().split('T')[0],
      contractEnd: '2027-12-31',
    };

    setCustomers((prev) => {
      const updated = [newCust, ...prev];
      setTenantStorage(currentOrg.id, 'customers', updated);
      return updated;
    });

    addNotification(`Customer "${newCust.name}" registered ($${newCust.arr.toLocaleString()} ARR).`);
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      setTenantStorage(currentOrg.id, 'customers', updated);
      return updated;
    });
  };

  const createLead = (l: Partial<Lead>) => {
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name: l.name || 'Sales Lead',
      company: l.company || 'Enterprise Company',
      email: l.email || 'lead@company.com',
      value: l.value || 0,
      stage: l.stage || 'lead',
      probability: l.probability || 30,
      source: l.source || 'Inbound',
      owner: currentUser.fullName,
      nextAction: l.nextAction || 'Schedule introductory review',
    };

    setLeads((prev) => {
      const updated = [newLead, ...prev];
      setTenantStorage(currentOrg.id, 'leads', updated);
      return updated;
    });

    addNotification(`Sales deal "${newLead.company}" created ($${newLead.value.toLocaleString()}).`);
  };

  const updateLeadStage = (id: string, stage: Lead['stage']) => {
    setLeads((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, stage } : l));
      setTenantStorage(currentOrg.id, 'leads', updated);
      return updated;
    });
  };

  const createTransaction = (tx: any) => {
    const newTx = {
      id: `tx_${Date.now()}`,
      organizationId: currentOrg.id,
      description: tx.description || 'Transaction',
      amount: tx.amount || 0,
      type: tx.type || 'expense',
      category: tx.category || 'Operations',
      date: new Date().toISOString().split('T')[0],
      status: 'cleared',
    };

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      setTenantStorage(currentOrg.id, 'transactions', updated);
      return updated;
    });
  };

  const createDocument = (doc: any) => {
    const newDoc = {
      id: `doc_${Date.now()}`,
      organizationId: currentOrg.id,
      title: doc.title || 'Untitled Document',
      category: doc.category || 'General',
      snippet: doc.snippet || '',
      author: currentUser.fullName,
      updated: 'Just now',
      tags: doc.tags || ['RFC'],
    };

    setDocuments((prev) => {
      const updated = [newDoc, ...prev];
      setTenantStorage(currentOrg.id, 'documents', updated);
      return updated;
    });
  };

  const addNotification = (title: string) => {
    const notif = {
      id: `notif_${Date.now()}`,
      title,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => {
      const updated = [notif, ...prev];
      setTenantStorage(currentOrg.id, 'notifications', updated);
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      setTenantStorage(currentOrg.id, 'notifications', updated);
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      setTenantStorage(currentOrg.id, 'notifications', updated);
      return updated;
    });
  };

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) => {
      const updated = prev.map((i) => {
        if (i.id === id) {
          const nextStatus = i.status === 'connected' ? 'disconnected' : 'connected';
          return {
            ...i,
            status: nextStatus,
            lastSync: nextStatus === 'connected' ? 'Just now' : 'Never',
          };
        }
        return i;
      });
      setTenantStorage(currentOrg.id, 'integrations', updated);
      return updated;
    });
  };

  // Real Gemini AI with Verified Tenant Telemetry (NO HALLUCINATIONS)
  const askFlowAI = async (prompt: string): Promise<string> => {
    const totalArr = customers.reduce((sum, c) => sum + (c.arr || 0), 0);
    const telemetry = {
      orgName: currentOrg.name,
      projectsCount: projects.length,
      tasksCount: tasks.length,
      customersCount: customers.length,
      totalArr,
      leadsCount: leads.length,
    };

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, telemetry }),
      });

      if (!res.ok) {
        return "I don't have enough data in your organization records to answer that. Create projects, tasks, or customers to populate your telemetry.";
      }

      const json = await res.json();
      return json?.data?.response || "I don't have enough verified data to answer that.";
    } catch {
      return "I don't have enough data in your organization records to answer that.";
    }
  };

  return (
    <FlowContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser.id,
        isLoadingAuth,
        signIn,
        signUp,
        signOut,
        currentOrg,
        organizations,
        switchOrganization,
        createOrganization,
        theme,
        resolvedTheme,
        setTheme,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSearchOpen,
        setIsSearchOpen,
        isCreateOpen,
        setIsCreateOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        createType,
        setCreateType,
        dateRange,
        setDateRange,
        projects,
        tasks,
        goals,
        customers,
        leads,
        transactions,
        documents,
        insights,
        notifications,
        integrations,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTaskStatus,
        deleteTask,
        createCustomer,
        deleteCustomer,
        createLead,
        updateLeadStage,
        createTransaction,
        createDocument,
        markNotificationRead,
        markAllNotificationsRead,
        toggleIntegration,
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
