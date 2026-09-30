-- ==============================================================================
-- FLOW DEMO SEED DATA: ACME AI (PRODUCTION GRADE)
-- ==============================================================================

-- 1. Create Demo Organization
INSERT INTO public.organizations (id, name, slug, logo_url, website, industry, stage, team_size, description, plan)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Acme AI',
    'acme',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
    'https://acme.ai',
    'Artificial Intelligence & Enterprise SaaS',
    'Scale-up',
    '75-100',
    'Unified company operations and autonomous agent infrastructure for modern enterprises.',
    'enterprise'
) ON CONFLICT (id) DO NOTHING;

-- 2. Create Profile for Satyam
INSERT INTO public.profiles (id, email, full_name, avatar_url, timezone, theme, default_org_id)
VALUES (
    'u0000000-0000-0000-0000-000000000001',
    'satyam@acme.ai',
    'Satyam',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80',
    'America/New_York',
    'dark',
    'a0000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- 3. Membership
INSERT INTO public.organization_members (organization_id, user_id, role, title, department)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'u0000000-0000-0000-0000-000000000001',
    'owner',
    'Founder & CEO',
    'Executive'
) ON CONFLICT DO NOTHING;

-- 4. Teams
INSERT INTO public.teams (id, organization_id, name, slug, description)
VALUES 
    ('t0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Core Engineering', 'eng', 'Platform and distributed systems engineering'),
    ('t0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Product & Design', 'product', 'Product vision, UX, and roadmap execution'),
    ('t0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Growth & Marketing', 'growth', 'Go-to-market, brand, and customer acquisition'),
    ('t0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Enterprise Sales', 'sales', 'Enterprise customer expansion and pipeline conversion')
ON CONFLICT DO NOTHING;

-- 5. Strategic Goals & OKRs
INSERT INTO public.goals (id, organization_id, title, description, status, progress, target_date, timeframe)
VALUES 
    ('g0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Reach $20M ARR with 85% Gross Margin', 'Scale enterprise subscriptions and reduce infra unit costs', 'on_track', 78.5, '2026-12-31', 'FY 2026'),
    ('g0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Ship Flow 2.0 Autonomous Engine', 'Next-generation AI agents with sub-200ms latency', 'on_track', 64.0, '2026-10-15', 'Q3 2026'),
    ('g0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'SOC-2 Type II & FedRAMP Readiness', 'Enterprise compliance and institutional trust foundations', 'on_track', 92.0, '2026-11-01', 'Q3 2026')
ON CONFLICT DO NOTHING;

-- 6. Key Results
INSERT INTO public.key_results (goal_id, organization_id, title, current_value, target_value, unit, status)
VALUES
    ('g0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Current Run-Rate ARR', 15.7, 20.0, '$M', 'on_track'),
    ('g0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Net Revenue Retention', 134, 130, '%', 'on_track'),
    ('g0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Agent P95 Latency', 185, 200, 'ms', 'on_track')
ON CONFLICT DO NOTHING;

-- 7. Projects
INSERT INTO public.projects (id, organization_id, name, slug, description, status, priority, progress, start_date, due_date, budget_allocated, budget_spent)
VALUES
    ('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Flow Core Platform Redesign', 'Complete infrastructure overhaul for 100k concurrent users', 'in_progress', 'urgent', 82.0, '2026-08-01', '2026-10-15', 250000, 195000),
    ('p0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Enterprise SSO & IAM Overhaul', 'SAML 2.0, Okta, SCIM directory synchronization', 'in_progress', 'high', 90.0, '2026-08-15', '2026-10-01', 120000, 108000),
    ('p0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Global Latency Optimization (Edge CDN)', 'Multi-region routing and edge caching layer', 'in_progress', 'medium', 55.0, '2026-09-01', '2026-11-15', 80000, 32000)
ON CONFLICT DO NOTHING;

-- 8. Tasks
INSERT INTO public.tasks (organization_id, project_id, title, description, status, priority, due_date)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Verify RLS partition policies across Postgres cluster', 'Audit row level security policies under 50k QPS simulation', 'in_progress', 'urgent', NOW() + INTERVAL '2 days'),
    ('a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Deploy Vercel Edge middleware rate limiter', 'Implement distributed sliding window token bucket', 'done', 'high', NOW() - INTERVAL '1 day'),
    ('a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 'Finalize SCIM 2.0 User Provisioning spec', 'Verify automated user offboarding flow with Okta', 'in_progress', 'high', NOW() + INTERVAL '4 days'),
    ('a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 'Setup Cloudflare Argo Smart Routing integration', 'Benchmarking TTFB across Tokyo, Frankfurt and US-East', 'todo', 'medium', NOW() + INTERVAL '10 days')
ON CONFLICT DO NOTHING;

-- 9. Customers
INSERT INTO public.customers (organization_id, name, domain, tier, arr, health_score, status)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Vercel Inc.', 'vercel.com', 'strategic', 480000, 98, 'active'),
    ('a0000000-0000-0000-0000-000000000001', 'Stripe Payments', 'stripe.com', 'strategic', 620000, 96, 'active'),
    ('a0000000-0000-0000-0000-000000000001', 'Linear Orbit Inc.', 'linear.app', 'enterprise', 240000, 92, 'active'),
    ('a0000000-0000-0000-0000-000000000001', 'Retool Inc.', 'retool.com', 'enterprise', 180000, 89, 'active'),
    ('a0000000-0000-0000-0000-000000000001', 'Supabase Pte. Ltd.', 'supabase.com', 'strategic', 350000, 99, 'active')
ON CONFLICT DO NOTHING;

-- 10. AI Insights
INSERT INTO public.ai_insights (organization_id, category, title, summary, supporting_data, confidence_score, recommended_action)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Revenue', 'Enterprise Expansion Accelerated (+18.4%)', 'Enterprise customer ACV grew from $185k to $242k following the SOC-2 audit release.', '{"cohort": "enterprise", "growth_rate": "18.4%", "new_arr": "$1,450,000"}'::jsonb, 0.98, 'Allocate 2 additional enterprise Solution Architects to close pipeline.'),
    ('a0000000-0000-0000-0000-000000000001', 'Engineering', 'API P95 Response Latency Improved 34%', 'Migration to Next.js 15 Server Components and edge caching reduced average TTFB from 320ms to 210ms.', '{"metric": "p95_latency", "before": "320ms", "after": "210ms"}'::jsonb, 0.94, 'Promote edge caching rules to remaining analytics routes.'),
    ('a0000000-0000-0000-0000-000000000001', 'Attention', 'CAC increased 11.2% in LinkedIn Ads Channel', 'Paid social acquisition costs elevated over 14-day rolling average due to high bidding density.', '{"channel": "linkedin_ads", "cac_delta": "+11.2%", "cpa": "$680"}'::jsonb, 0.91, 'Reallocate $15,000 monthly budget to Organic Developer Relations and High-intent Search.')
ON CONFLICT DO NOTHING;
