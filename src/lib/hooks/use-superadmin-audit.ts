'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import {
  superadminAuditService,
  type AuditLogFilters,
  type PaginatedAuditLogs,
} from '@/lib/services/superadmin-audit.service'

export function useSuperAdminAuditLogs(filters?: AuditLogFilters) {
  return useQuery<PaginatedAuditLogs>({
    queryKey: [...queryKeys.superadmin.all, 'audit', filters],
    queryFn: () => superadminAuditService.getLogs(filters),
    staleTime: 30000, // Data considered fresh for 30 seconds
  })
}

export function useEntityAuditHistory(
  entityType: 'request' | 'team_member' | 'company' | 'settings',
  entityId: string | undefined
) {
  return useQuery({
    queryKey: [...queryKeys.superadmin.all, 'audit', entityType, entityId],
    queryFn: () =>
      superadminAuditService.getEntityHistory(entityType, entityId!),
    enabled: !!entityId,
    staleTime: 30000, // Data considered fresh for 30 seconds
  })
}
