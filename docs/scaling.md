# Flow Horizontal Scaling & Reliability Strategy

## 1. Concurrency Milestones
Flow is engineered to scale across four progressive tiers:
1. **Tier 1 (1,000 Users)**: Single Supabase Compute Instance (4 vCPU, 16GB RAM) + Vercel Edge Serverless functions.
2. **Tier 2 (10,000 Users)**: Primary-Replica Supabase configuration with read-only replicas serving overview telemetry and analytics.
3. **Tier 3 (100,000 Users)**: Distributed multi-region read replicas (US-East, Frankfurt, Tokyo) with stale-while-revalidate edge caching and asynchronous BullMQ/Redis worker queues.
4. **Tier 4 (1,000,000+ Users)**: PostgreSQL Citus / Sharded tenant clusters partitioned by `organization_id`.

## 2. Preventing Bottlenecks
- **No N+1 Queries**: Relational joins use optimized composite select statements.
- **Cursor Pagination**: Large collections (tasks, customers, audit logs) strictly utilize cursor pagination (`limit + cursor`) instead of high-offset queries.
- **Circuit Breakers**: External integrations (GitHub, Slack, Stripe) execute through timeout guards with exponential backoff so external downtime never impacts core Flow responsiveness.
