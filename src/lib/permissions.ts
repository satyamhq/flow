import { MemberRole } from '@/types/flow';

export type FlowPermission =
  | 'project.create'
  | 'project.update'
  | 'project.delete'
  | 'task.create'
  | 'task.update'
  | 'task.delete'
  | 'organization.manage_members'
  | 'organization.settings'
  | 'billing.manage'
  | 'security.manage'
  | 'integrations.manage'
  | 'finance.view'
  | 'ai.prompt';

const ROLE_PERMISSIONS: Record<MemberRole, FlowPermission[]> = {
  owner: [
    'project.create',
    'project.update',
    'project.delete',
    'task.create',
    'task.update',
    'task.delete',
    'organization.manage_members',
    'organization.settings',
    'billing.manage',
    'security.manage',
    'integrations.manage',
    'finance.view',
    'ai.prompt',
  ],
  admin: [
    'project.create',
    'project.update',
    'project.delete',
    'task.create',
    'task.update',
    'task.delete',
    'organization.manage_members',
    'organization.settings',
    'security.manage',
    'integrations.manage',
    'finance.view',
    'ai.prompt',
  ],
  manager: [
    'project.create',
    'project.update',
    'task.create',
    'task.update',
    'integrations.manage',
    'finance.view',
    'ai.prompt',
  ],
  member: [
    'task.create',
    'task.update',
    'ai.prompt',
  ],
  viewer: [],
};

export function can(role: MemberRole, permission: FlowPermission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}
