# Flow Enterprise Security, IAM & Compliance Specification

## 1. Zero-Trust Access Model
- **Authentication**: Handled via Supabase Auth with support for Email/Password, TOTP Multi-Factor Authentication (MFA), and SAML 2.0 / Okta SCIM SSO.
- **Role-Based Access Control (RBAC)**:
  - `owner`: Full organizational governance, billing, key rotation, and destruction policies.
  - `admin`: User provisioning, team configuration, integration management, and security audits.
  - `manager`: Project creation, budget assignments, and workflow execution.
  - `member`: Task creation, work item status progression, and AI prompting.
  - `viewer`: Read-only access to authorized resources.

## 2. API Security & Rate Limiting
- **Token Bucket Sliding Window**: Implemented at edge endpoints to prevent abuse.
  - Authentication: 10 requests / min
  - AI Completions: 20 requests / min
  - Normal APIs: 120 requests / min
  - Read-Only Telemetry: 300 requests / min
- **Idempotency**: All transactional financial writes and webhook receipts require `Idempotency-Key` headers with 24-hour replay caching.

## 3. Compliance & Auditability
- Append-only `audit_logs` records every identity change, permission update, export action, and data deletion.
- SOC-2 Type II and ISO 27001 readiness embedded into infrastructure primitives.
