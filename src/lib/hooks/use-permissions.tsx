'use client'

import { useMemo } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import {
  Permission,
  SuperAdminRole,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  canAccessPage,
  getPermissionsForRole,
} from '@/lib/permissions'

/**
 * Hook to check permissions for the current user
 *
 * @example
 * ```tsx
 * const { can, canAll, canAny, role } = usePermissions()
 *
 * // Check single permission
 * if (can('requests.approve')) {
 *   // Show approve button
 * }
 *
 * // Check multiple permissions (all required)
 * if (canAll(['clients.edit', 'clients.create'])) {
 *   // Show full client management
 * }
 *
 * // Check multiple permissions (any required)
 * if (canAny(['requests.approve', 'requests.reject'])) {
 *   // Show request action buttons
 * }
 * ```
 */
export function usePermissions() {
  const { user } = useAuth()

  // Get the user's superadmin role from their profile
  // Uses superAdminRole from auth context if available (from superadmin_team table)
  // Falls back to mapping the general role for backward compatibility
  const role = useMemo(() => {
    if (!user) return undefined

    // If user has a specific superAdminRole from the superadmin_team table, use it
    if (user.superAdminRole) {
      return user.superAdminRole
    }

    // Fallback: Map the auth context role to SuperAdminRole
    // The auth context uses 'superadmin' but our permission system uses 'super_admin'
    if (user.role === 'superadmin') return 'super_admin' as SuperAdminRole

    return undefined // Non-superadmin users don't have superadmin permissions
  }, [user])

  /**
   * Check if user has a specific permission
   */
  const can = useMemo(() => {
    return (permission: Permission): boolean => {
      return hasPermission(role, permission)
    }
  }, [role])

  /**
   * Check if user has all specified permissions
   */
  const canAll = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      return hasAllPermissions(role, permissions)
    }
  }, [role])

  /**
   * Check if user has any of the specified permissions
   */
  const canAny = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      return hasAnyPermission(role, permissions)
    }
  }, [role])

  /**
   * Check if user can access a specific page
   */
  const canAccess = useMemo(() => {
    return (pagePath: string): boolean => {
      return canAccessPage(role, pagePath)
    }
  }, [role])

  /**
   * Get all permissions for the current user
   */
  const permissions = useMemo(() => {
    if (!role) return []
    return getPermissionsForRole(role as SuperAdminRole)
  }, [role])

  return {
    role,
    can,
    canAll,
    canAny,
    canAccess,
    permissions,
    isAuthenticated: !!user,
    isSuperAdmin: role === 'super_admin',
    isAdmin: role === 'admin' || role === 'super_admin',
  }
}

/**
 * Component that conditionally renders children based on permissions
 *
 * @example
 * ```tsx
 * <PermissionGate permission="requests.approve">
 *   <ApproveButton />
 * </PermissionGate>
 *
 * <PermissionGate permissions={['clients.edit', 'clients.create']} requireAll>
 *   <ClientManagement />
 * </PermissionGate>
 *
 * <PermissionGate permissions={['requests.approve', 'requests.reject']} fallback={<ViewOnly />}>
 *   <ActionButtons />
 * </PermissionGate>
 * ```
 */
interface PermissionGateProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

export function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { can, canAll, canAny } = usePermissions()

  let hasAccess = false

  if (permission) {
    hasAccess = can(permission)
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions)
  } else {
    // No permission specified, allow access
    hasAccess = true
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

export default usePermissions
