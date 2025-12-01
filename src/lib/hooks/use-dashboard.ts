'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import {
  dashboardService,
  type EmployerDashboardStats,
  type EmployeeDashboardStats,
} from '@/lib/services'

export function useEmployerDashboard(companyId: string | undefined) {
  return useQuery<EmployerDashboardStats>({
    queryKey: queryKeys.dashboard.employer(companyId!),
    queryFn: () => dashboardService.getEmployerStats(companyId!),
    enabled: !!companyId,
  })
}

export function useEmployeeDashboard(employeeId: string | undefined) {
  return useQuery<EmployeeDashboardStats>({
    queryKey: queryKeys.dashboard.employee(employeeId!),
    queryFn: () => dashboardService.getEmployeeStats(employeeId!),
    enabled: !!employeeId,
  })
}
