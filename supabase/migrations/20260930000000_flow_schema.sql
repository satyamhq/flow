-- ==============================================================================
-- FLOW: THE OPERATING SYSTEM FOR MODERN COMPANIES
-- PRODUCTION SCHEMA MIGRATION: MULTI-TENANT ARCHITECTURE & RLS POLICIES
-- Target RDBMS: PostgreSQL 15+ (Supabase)
-- ==============================================================================

-- Enable UUID extension & pg_trgm for fuzzy search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 1. USERS & PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    theme TEXT DEFAULT 'dark',
    default_org_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. ORGANIZATIONS (TENANTS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    website TEXT,
    industry TEXT,
    stage TEXT,
    team_size TEXT,
    description TEXT,
    timezone TEXT DEFAULT 'UTC',
    currency TEXT DEFAULT 'USD',
    plan TEXT DEFAULT 'pro',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);

-- ------------------------------------------------------------------------------
-- 3. MEMBERSHIPS & ROLES (RBAC)
-- ------------------------------------------------------------------------------
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'manager', 'member', 'viewer');

CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'member',
    title TEXT,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);

-- ------------------------------------------------------------------------------
-- 4. TEAMS & DEPARTMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(organization_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_teams_org ON public.teams(organization_id);

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (team_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 5. STRATEGY, GOALS & OKRs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strategic_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    pillar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    parent_goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'behind', 'completed', 'cancelled')),
    progress NUMERIC(5,2) DEFAULT 0.0 CHECK (progress >= 0.0 AND progress <= 100.0),
    target_date DATE,
    timeframe TEXT DEFAULT 'Q3 2026',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_goals_org_status ON public.goals(organization_id, status);

CREATE TABLE IF NOT EXISTS public.key_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    current_value NUMERIC NOT NULL DEFAULT 0,
    target_value NUMERIC NOT NULL,
    unit TEXT DEFAULT '%',
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'on_track',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_key_results_goal ON public.key_results(goal_id);

-- ------------------------------------------------------------------------------
-- 6. PROJECTS & TASKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('planned', 'in_progress', 'paused', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'high' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    start_date DATE,
    due_date DATE,
    progress NUMERIC(5,2) DEFAULT 0.0,
    budget_allocated NUMERIC(14,2) DEFAULT 0,
    budget_spent NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_projects_org_status ON public.projects(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(organization_id, owner_id);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'blocked', 'done')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tasks_org_status ON public.tasks(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(organization_id, assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(organization_id, due_date);

-- ------------------------------------------------------------------------------
-- 7. PRODUCT & ENGINEERING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    stage TEXT DEFAULT 'ga' CHECK (stage IN ('concept', 'alpha', 'beta', 'ga', 'sunset')),
    active_users INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'in_development' CHECK (status IN ('idea', 'planned', 'in_development', 'testing', 'shipped')),
    impact TEXT DEFAULT 'high',
    owner_id UUID REFERENCES public.profiles(id),
    target_release TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    title TEXT NOT NULL,
    release_date DATE,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'released', 'rolled_back')),
    release_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    environment TEXT NOT NULL DEFAULT 'production',
    commit_sha TEXT NOT NULL,
    commit_message TEXT,
    branch TEXT DEFAULT 'main',
    status TEXT DEFAULT 'success' CHECK (status IN ('queued', 'building', 'success', 'failed')),
    deployed_by UUID REFERENCES public.profiles(id),
    duration_seconds INT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_deployments_org ON public.deployments(organization_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 8. CUSTOMERS, CRM & SALES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT,
    tier TEXT DEFAULT 'growth' CHECK (tier IN ('starter', 'growth', 'enterprise', 'strategic')),
    arr NUMERIC(14,2) DEFAULT 0,
    health_score INT DEFAULT 95 CHECK (health_score >= 0 AND health_score <= 100),
    status TEXT DEFAULT 'active' CHECK (status IN ('prospect', 'active', 'churn_risk', 'churned')),
    account_owner_id UUID REFERENCES public.profiles(id),
    contract_start DATE,
    contract_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_org ON public.customers(organization_id, status);

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    value NUMERIC(14,2) DEFAULT 0,
    stage TEXT DEFAULT 'qualified' CHECK (stage IN ('lead', 'qualified', 'demo', 'proposal', 'negotiation', 'won', 'lost')),
    probability INT DEFAULT 50,
    source TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    next_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_org_stage ON public.leads(organization_id, stage);

-- ------------------------------------------------------------------------------
-- 9. MARKETING & CAMPAIGNS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    channel TEXT NOT NULL,
    budget NUMERIC(12,2) DEFAULT 0,
    spend NUMERIC(12,2) DEFAULT 0,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    leads_count INT DEFAULT 0,
    customers_count INT DEFAULT 0,
    cac NUMERIC(10,2) DEFAULT 0,
    roi NUMERIC(6,2) DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaigns_org ON public.campaigns(organization_id, status);

-- ------------------------------------------------------------------------------
-- 10. FINANCE & TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    amount NUMERIC(14,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    type TEXT NOT NULL CHECK (type IN ('subscription', 'usage', 'one_off', 'refund', 'expense')),
    status TEXT DEFAULT 'succeeded' CHECK (status IN ('pending', 'succeeded', 'failed')),
    description TEXT,
    stripe_charge_id TEXT,
    idempotency_key TEXT UNIQUE,
    occurred_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_org ON public.transactions(organization_id, occurred_at DESC);

-- ------------------------------------------------------------------------------
-- 11. DOCUMENTS & KNOWLEDGE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'wiki',
    author_id UUID REFERENCES public.profiles(id),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    is_public_to_org BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_org ON public.documents(organization_id);

-- ------------------------------------------------------------------------------
-- 12. AUTOMATIONS & WORKFLOWS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL,
    conditions JSONB DEFAULT '[]'::jsonb,
    actions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    run_count INT DEFAULT 0,
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.automation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    trigger_event JSONB,
    status TEXT DEFAULT 'succeeded' CHECK (status IN ('running', 'succeeded', 'failed')),
    error_message TEXT,
    execution_time_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 13. FLOW AI INSIGHTS & SESSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    supporting_data JSONB,
    confidence_score NUMERIC(4,2) DEFAULT 0.95,
    recommended_action TEXT,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'actioned', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_org ON public.ai_insights(organization_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 14. AUDIT LOGS (IMMUTABLE FOR SECURITY)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.audit_logs(organization_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 15. RATE LIMITS & IDEMPOTENCY (PRODUCTION RESILIENCE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
    key TEXT PRIMARY KEY,
    tokens INT NOT NULL,
    last_refill TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public.idempotency_keys (
    key TEXT PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    response_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR TRUE MULTI-TENANT ISOLATION
-- ==============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check org membership
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = org_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations policy: users see orgs they belong to
CREATE POLICY org_members_can_view_org ON public.organizations
    FOR SELECT USING (public.is_org_member(id));

-- Members policy
CREATE POLICY org_members_can_view_memberships ON public.organization_members
    FOR SELECT USING (public.is_org_member(organization_id));

-- Projects policy
CREATE POLICY org_members_projects ON public.projects
    FOR ALL USING (public.is_org_member(organization_id));

-- Tasks policy
CREATE POLICY org_members_tasks ON public.tasks
    FOR ALL USING (public.is_org_member(organization_id));

-- Goals policy
CREATE POLICY org_members_goals ON public.goals
    FOR ALL USING (public.is_org_member(organization_id));

-- Customers policy
CREATE POLICY org_members_customers ON public.customers
    FOR ALL USING (public.is_org_member(organization_id));

-- Leads policy
CREATE POLICY org_members_leads ON public.leads
    FOR ALL USING (public.is_org_member(organization_id));

-- Finance policy
CREATE POLICY org_members_transactions ON public.transactions
    FOR ALL USING (public.is_org_member(organization_id));

-- Documents policy
CREATE POLICY org_members_documents ON public.documents
    FOR ALL USING (public.is_org_member(organization_id));

-- Automations policy
CREATE POLICY org_members_automations ON public.automations
    FOR ALL USING (public.is_org_member(organization_id));

-- AI Insights policy
CREATE POLICY org_members_ai_insights ON public.ai_insights
    FOR ALL USING (public.is_org_member(organization_id));

-- Audit logs policy (read-only for members, insert for audit engine)
CREATE POLICY org_members_audit_logs_read ON public.audit_logs
    FOR SELECT USING (public.is_org_member(organization_id));

CREATE POLICY org_members_audit_logs_insert ON public.audit_logs
    FOR INSERT WITH CHECK (public.is_org_member(organization_id));
