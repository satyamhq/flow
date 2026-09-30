# Flow Production Deployment & CI/CD Pipeline

## 1. Hosting Architecture
- **Web & Edge Runtimes**: Vercel Enterprise Deployment pipeline with automatic staging previews on pull requests.
- **Database & Storage**: Managed Supabase PostgreSQL with automated point-in-time recovery (PITR) and global CDN file storage.

## 2. Zero-Downtime Deployment Rules
1. **Additive Migrations Only**: New columns must be nullable or possess defaults.
2. **Phase 1**: Deploy non-breaking database schema.
3. **Phase 2**: Deploy updated application code to Vercel edge nodes.
4. **Phase 3**: Backfill records and remove deprecated code in subsequent iterations.
