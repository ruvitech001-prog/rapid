'use client'

import { useQuery } from '@tanstack/react-query'
import {
  superadminLeavesService,
  type SuperAdminLeaveFilters,
} from '@/lib/services/superadmin-leaves.service'

export function useSuperAdminLeaves(filters?: SuperAdminLeaveFilters) {
  return useQuery({
    queryKey: ['superadmin', 'leaves', filters],
    queryFn: () => superadminLeavesService.getLeaves(filters),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useSuperAdminLeaveStats() {
  return useQuery({
    queryKey: ['superadmin', 'leaves', 'stats'],
    queryFn: () => superadminLeavesService.getStats(),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}
