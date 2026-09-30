# Flow Database Architecture & Multi-Tenant Partitioning

## 1. Schema Design Standards
- **Primary Keys**: UUID v4 (`gen_random_uuid()`) across all entities.
- **Tenant Isolation**: Mandatory `organization_id` column with foreign key constraints `ON DELETE CASCADE`.
- **Composite Indexes**: Query patterns are indexed on `(organization_id, status)`, `(organization_id, created_at DESC)`, and `(organization_id, owner_id)`.
- **Soft Deletes**: Critical business resources (projects, tasks, documents) utilize `deleted_at TIMESTAMPTZ` with partial indexing (`WHERE deleted_at IS NULL`).

## 2. Row Level Security (RLS)
Every table has RLS explicitly enabled:
```sql
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_members_projects ON public.projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = projects.organization_id 
              AND user_id = auth.uid()
        )
    );
```
Frontend filtering is never trusted for security; isolation is enforced directly by PostgreSQL.

## 3. High-Scale Migration Roadmap
- **Partitioning Strategy**: Time-based range partitioning on `audit_logs` and `automation_runs` by quarter.
- **Connection Pooling**: Supavisor pooler mode on port 6543 to sustain 10,000+ serverless connections without connection starvation.
