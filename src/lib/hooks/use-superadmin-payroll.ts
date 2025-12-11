'use client'

import { useQuery } from '@tanstack/react-query'
import { superadminPayrollService } from '@/lib/services/superadmin-payroll.service'

export function useSuperAdminPayrollRuns() {
  return useQuery({
    queryKey: ['superadmin', 'payroll', 'runs'],
    queryFn: () => superadminPayrollService.getPayrollRuns(),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useSuperAdminUpcomingPayroll() {
  return useQuery({
    queryKey: ['superadmin', 'payroll', 'upcoming'],
    queryFn: () => superadminPayrollService.getUpcomingPayroll(),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useSuperAdminPayrollStats() {
  return useQuery({
    queryKey: ['superadmin', 'payroll', 'stats'],
    queryFn: () => superadminPayrollService.getStats(),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}
