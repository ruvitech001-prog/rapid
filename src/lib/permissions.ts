/**
 * Permission System for Super Admin Module
 *
 * Defines role-based access control for the super-admin module.
 * Roles are hierarchical: super_admin > admin > support > viewer
 */

// Role types
export type SuperAdminRole = 'super_admin' | 'admin' | 'support' | 'viewer'

// All available permissions
export type Permission =
  // Dashboard
  | 'dashboard.view'
  // Requests
  | 'requests.view'
  | 'requests.approve'
  | 'requests.reject'
  | 'requests.assign'
  // Access Control
  | 'access-control.view'
  | 'access-control.manage'
  | 'access-control.add-member'
  | 'access-control.remove-member'
  | 'access-control.assign-clients'
  // Audit Logs
  | 'audit-logs.view'
  | 'audit-logs.export'
  // Clients
  | 'clients.view'
  | 'clients.create'
  | 'clients.edit'
  | 'clients.deactivate'
  // Invoices
  | 'invoices.view'
  | 'invoices.generate'
  | 'invoices.mark-paid'
  | 'invoices.send-reminder'
  // Leaves
  | 'leaves.view'
  | 'leaves.approve'
  | 'leaves.reject'
  // Payroll
  | 'payroll.view'
  | 'payroll.run'
  | 'payroll.manage'
  // Settings
  | 'settings.view'
  | 'settings.manage'
  // Profile
  | 'profile.view'
  | 'profile.edit'

/**
 * Permission matrix defining which roles have access to which permissions.
 * Permissions are cumulative - higher roles inherit lower role permissions.
 */
export const PERMISSION_MATRIX: Record<Permission, SuperAdminRole[]> = {
  // Dashboard - everyone can view
  'dashboard.view': ['viewer', 'support', 'admin', 'super_admin'],

  // Requests
  'requests.view': ['viewer', 'support', 'admin', 'super_admin'],
  'requests.approve': ['support', 'admin', 'super_admin'],
  'requests.reject': ['support', 'admin', 'super_admin'],
  'requests.assign': ['admin', 'super_admin'],

  // Access Control
  'access-control.view': ['admin', 'super_admin'],
  'access-control.manage': ['super_admin'],
  'access-control.add-member': ['super_admin'],
  'access-control.remove-member': ['super_admin'],
  'access-control.assign-clients': ['admin', 'super_admin'],

  // Audit Logs
  'audit-logs.view': ['admin', 'super_admin'],
  'audit-logs.export': ['super_admin'],

  // Clients
  'clients.view': ['viewer', 'support', 'admin', 'super_admin'],
  'clients.create': ['admin', 'super_admin'],
  'clients.edit': ['admin', 'super_admin'],
  'clients.deactivate': ['super_admin'],

  // Invoices
  'invoices.view': ['viewer', 'support', 'admin', 'super_admin'],
  'invoices.generate': ['admin', 'super_admin'],
  'invoices.mark-paid': ['admin', 'super_admin'],
  'invoices.send-reminder': ['support', 'admin', 'super_admin'],

  // Leaves
  'leaves.view': ['viewer', 'support', 'admin', 'super_admin'],
  'leaves.approve': ['admin', 'super_admin'],
  'leaves.reject': ['admin', 'super_admin'],

  // Payroll
  'payroll.view': ['admin', 'super_admin'],
  'payroll.run': ['super_admin'],
  'payroll.manage': ['super_admin'],

  // Settings
  'settings.view': ['admin', 'super_admin'],
  'settings.manage': ['super_admin'],

  // Profile - everyone can view and edit their own
  'profile.view': ['viewer', 'support', 'admin', 'super_admin'],
  'profile.edit': ['viewer', 'support', 'admin', 'super_admin'],
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: SuperAdminRole | string | undefined, permission: Permission): boolean {
  if (!role) return false
  const normalizedRole = role as SuperAdminRole
  const allowedRoles = PERMISSION_MATRIX[permission]
  return allowedRoles?.includes(normalizedRole) ?? false
}

/**
 * Check if a role has ALL of the specified permissions
 */
export function hasAllPermissions(role: SuperAdminRole | string | undefined, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(role: SuperAdminRole | string | undefined, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

/**
 * Get all permissions for a specific role
 */
export function getPermissionsForRole(role: SuperAdminRole): Permission[] {
  return (Object.entries(PERMISSION_MATRIX) as [Permission, SuperAdminRole[]][])
    .filter(([, roles]) => roles.includes(role))
    .map(([permission]) => permission)
}

/**
 * Role hierarchy for comparison
 */
const ROLE_HIERARCHY: Record<SuperAdminRole, number> = {
  'viewer': 0,
  'support': 1,
  'admin': 2,
  'super_admin': 3,
}

/**
 * Check if one role is higher than another
 */
export function isRoleHigherOrEqual(role: SuperAdminRole, comparedTo: SuperAdminRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[comparedTo]
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: SuperAdminRole): string {
  const displayNames: Record<SuperAdminRole, string> = {
    'super_admin': 'Super Admin',
    'admin': 'Admin',
    'support': 'Support',
    'viewer': 'Viewer',
  }
  return displayNames[role] || role
}

/**
 * Get role description
 */
export function getRoleDescription(role: SuperAdminRole): string {
  const descriptions: Record<SuperAdminRole, string> = {
    'super_admin': 'Full access to all features including system settings and team management',
    'admin': 'Can manage clients, invoices, leaves, and view audit logs',
    'support': 'Can view and process requests, send invoice reminders',
    'viewer': 'Read-only access to dashboard, clients, and invoices',
  }
  return descriptions[role] || ''
}

/**
 * List of all available roles for dropdown selection
 */
export const AVAILABLE_ROLES: { value: SuperAdminRole; label: string; description: string }[] = [
  { value: 'viewer', label: 'Viewer', description: getRoleDescription('viewer') },
  { value: 'support', label: 'Support', description: getRoleDescription('support') },
  { value: 'admin', label: 'Admin', description: getRoleDescription('admin') },
  { value: 'super_admin', label: 'Super Admin', description: getRoleDescription('super_admin') },
]

/**
 * Page-level permission requirements
 * Maps page paths to required permissions for access
 */
export const PAGE_PERMISSIONS: Record<string, Permission> = {
  '/super-admin/dashboard': 'dashboard.view',
  '/super-admin/requests': 'requests.view',
  '/super-admin/access-control': 'access-control.view',
  '/super-admin/audit-logs': 'audit-logs.view',
  '/super-admin/clients': 'clients.view',
  '/super-admin/invoices': 'invoices.view',
  '/super-admin/leaves': 'leaves.view',
  '/super-admin/payroll': 'payroll.view',
  '/super-admin/settings': 'settings.view',
  '/super-admin/profile': 'profile.view',
  '/super-admin/team-members': 'access-control.view',
}

/**
 * Check if a role can access a specific page
 */
export function canAccessPage(role: SuperAdminRole | string | undefined, pagePath: string): boolean {
  // Find matching page permission
  const matchingPath = Object.keys(PAGE_PERMISSIONS).find(path =>
    pagePath === path || pagePath.startsWith(path + '/')
  )

  if (!matchingPath) {
    // If no specific permission is defined, allow access by default (for sub-pages)
    return true
  }

  const requiredPermission = PAGE_PERMISSIONS[matchingPath]
  if (!requiredPermission) {
    return true
  }
  return hasPermission(role, requiredPermission)
}
