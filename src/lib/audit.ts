import { AuditLog } from '@/types/flow';

export function createAuditLog(
  orgId: string,
  user: string,
  action: string,
  resource: string,
  details?: Record<string, unknown>
): AuditLog {
  const entry: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user,
    action,
    resource,
    ip: '10.0.4.12',
    timestamp: new Date().toISOString(),
    status: 'success',
  };

  if (process.env.NODE_ENV !== 'production') {
    console.info(`[AUDIT] [Org: ${orgId}] User ${user} executed ${action} on ${resource}`, details || '');
  }

  return entry;
}
