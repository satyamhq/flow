# Flow — The Operating System for Modern Companies

Flow is a unified company operating system connecting strategy, product, engineering, growth, CRM, customers, finance, people, documents, automations, and autonomous AI into a single relational graph.

---

## Architecture Stack
- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Modern Enterprise Design Tokens
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth
- **Hosting**: Vercel Edge / Serverless
- **Icons**: Lucide Icons

---

## Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` (preconfigured with your Supabase project):
```env
NEXT_PUBLIC_SUPABASE_URL=https://dlhhzkaotlzchamrsysh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_RkYxm_uPDNvSOh93WnfLMA_juHsX6R_
SUPABASE_JWKS_URL=https://dlhhzkaotlzchamrsysh.supabase.co/auth/v1/.well-known/jwks.json
```

### 3. Database Migration
Deploy schema and seed data to Supabase:
```bash
# Migration schema located at:
supabase/migrations/20260930000000_flow_schema.sql

# Acme AI demo seed located at:
supabase/seed.sql
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Navigation & Keyboard Shortcuts
- `⌘ K` or `Ctrl K`: Universal Command Palette & Resource Search
- `C`: Global Create Resource (Task, Project, Customer, Lead)
- `G then D`: Go to Company Overview Dashboard
- `G then P`: Go to Projects Center
- `G then T`: Go to Universal Task Engine
- `G then S`: Go to Organization Settings
- `?`: Open Keyboard Shortcuts Cheat Sheet
- `Esc`: Close any active modal

---

## API Endpoints (v1)
- `GET /api/v1/health`: Observability and system status
- `GET /api/v1/projects`: Paginated and tenant-isolated project query
- `POST /api/v1/projects`: Validated creation with audit logging
- `POST /api/v1/ai/chat`: Company-aware AI completion with token accounting
- `POST /api/v1/webhooks`: Secure asynchronous webhook receiver with idempotency

---

## Documentation
- [Architecture System Design](file:///d:/flow/docs/architecture.md)
- [Database & Multi-Tenant RLS](file:///d:/flow/docs/database.md)
- [Security & IAM Specification](file:///d:/flow/docs/security.md)
- [Horizontal Scaling Roadmap](file:///d:/flow/docs/scaling.md)
- [Deployment Guidelines](file:///d:/flow/docs/deployment.md)
- [Disaster Recovery Plan](file:///d:/flow/docs/disaster-recovery.md)
