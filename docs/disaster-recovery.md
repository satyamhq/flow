# Flow Disaster Recovery, Backup & Continuity Plan

## 1. Targets & Objectives
- **RPO (Recovery Point Objective)**: < 5 minutes (Supabase Point-in-Time continuous WAL archiving).
- **RTO (Recovery Time Objective)**: < 15 minutes (Automated DNS failover to standby replica cluster).

## 2. Backup Retention & Integrity
- Daily full logical dumps + continuous WAL log streaming.
- Weekly automated restore tests into ephemeral staging instances to verify data integrity.
- Cross-region storage snapshots for documents, logos, and brand assets.
