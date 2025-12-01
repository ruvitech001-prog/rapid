'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { superadminDashboardService } from '@/lib/services/superadmin-dashboard.service'

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.superadmin.dashboard(),
    queryFn: () => superadminDashboardService.getStats(),
    refetchInterval: 60000, // Refresh every minute
  })
}

export function useSuperAdminCompanies() {
  return useQuery({
    queryKey: queryKeys.superadmin.companies.list(),
    queryFn: () => superadminDashboardService.getCompanies(),
  })
}
