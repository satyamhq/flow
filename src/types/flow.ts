export type MemberRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  defaultOrgId: string;
  title?: string;
  department?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  industry: string;
  stage: 'Idea' | 'Pre-launch' | 'Startup' | 'Growth' | 'Scale-up' | 'Enterprise';
  teamSize: string;
  description: string;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  timezone: string;
  currency: string;
  metrics?: {
    mrr: number;
    arr: number;
    revenueGrowth: number;
    burnRate: number;
    runwayMonths: number;
    grossMargin: number;
    totalCustomers: number;
    netRetentionRate: number;
    healthScore: number;
  };
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: MemberRole;
  title: string;
  department: string;
  user: UserProfile;
  joinedAt: string;
}

export interface StrategicGoal {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  ownerId?: string;
  ownerName?: string;
  teamId?: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed' | 'cancelled';
  progress: number;
  targetDate: string;
  timeframe: string;
  keyResults: KeyResult[];
  relatedProjectIds: string[];
}

export interface KeyResult {
  id: string;
  goalId: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  status: 'planned' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  ownerId: string;
  ownerName: string;
  team: string;
  goalId?: string;
  startDate: string;
  dueDate: string;
  progress: number;
  tasksCount: {
    total: number;
    done: number;
  };
  budgetAllocated: number;
  budgetSpent: number;
}

export interface Task {
  id: string;
  organizationId: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate?: string;
  tags: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  stage: 'concept' | 'alpha' | 'beta' | 'ga' | 'sunset';
  activeUsers: number;
  nps: number;
  featuresCount: number;
}

export interface ProductFeature {
  id: string;
  title: string;
  productId: string;
  productName: string;
  status: 'idea' | 'planned' | 'in_development' | 'testing' | 'shipped';
  impact: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  targetRelease: string;
  votes: number;
}

export interface Deployment {
  id: string;
  environment: 'production' | 'staging' | 'preview';
  commitSha: string;
  commitMessage: string;
  branch: string;
  status: 'queued' | 'building' | 'success' | 'failed';
  deployedBy: string;
  durationSeconds: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  domain: string;
  tier: 'starter' | 'growth' | 'enterprise' | 'strategic';
  arr: number;
  healthScore: number;
  status: 'prospect' | 'active' | 'churn_risk' | 'churned';
  accountOwner: string;
  contractStart: string;
  contractEnd: string;
  npsScore?: number;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  stage: 'lead' | 'qualified' | 'demo' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability: number;
  source: string;
  owner: string;
  nextAction: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  leadsCount: number;
  customersCount: number;
  cac: number;
  roi: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
}

export interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'usage' | 'one_off' | 'refund' | 'expense';
  status: 'pending' | 'succeeded' | 'failed';
  description: string;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  manager: string;
  avatar: string;
  startDate: string;
  email: string;
  workload: number; // percentage
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Wiki' | 'Architecture' | 'SOP' | 'Strategy' | 'Product Spec';
  author: string;
  lastModified: string;
  snippet: string;
  tags: string[];
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
  runCount: number;
  lastRun: string;
}

export interface AIInsight {
  id: string;
  category: 'Revenue' | 'Engineering' | 'Product' | 'Growth' | 'Attention' | 'Strategy';
  title: string;
  summary: string;
  supportingData: string;
  confidenceScore: number;
  recommendedAction: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'alert';
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'needs_auth';
  lastSync?: string;
  syncStatus?: 'synced' | 'syncing' | 'failed';
  permissions: string[];
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}
