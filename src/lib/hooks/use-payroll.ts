'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  payrollService,
  type PayslipData,
  type PayrollSummary,
  type EmployeePayrollHistory,
  type EmployeePayrollData,
  type PayrollRun,
} from '@/lib/services'

export function useEmployeePayrollHistory(
  employeeId: string | undefined,
  months: number = 6
) {
  return useQuery<EmployeePayrollHistory[]>({
    queryKey: ['payroll', 'history', employeeId, months],
    queryFn: () => payrollService.getEmployeePayrollHistory(employeeId!, months),
    enabled: !!employeeId,
  })
}

export function useCurrentPayslip(employeeId: string | undefined) {
  return useQuery<PayslipData | null>({
    queryKey: ['payroll', 'payslip', employeeId],
    queryFn: () => payrollService.getCurrentPayslip(employeeId!),
    enabled: !!employeeId,
  })
}

export function useCompanyPayrollSummary(
  companyId: string | undefined,
  months: number = 6
) {
  return useQuery<PayrollSummary[]>({
    queryKey: ['payroll', 'company', companyId, months],
    queryFn: () => payrollService.getCompanyPayrollSummary(companyId!, months),
    enabled: !!companyId,
  })
}

export function useTotalPayrollCost(companyId: string | undefined) {
  return useQuery<{
    monthly: number
    annual: number
    employeeCount: number
  }>({
    queryKey: ['payroll', 'total', companyId],
    queryFn: () => payrollService.getTotalPayrollCost(companyId!),
    enabled: !!companyId,
  })
}

/**
 * Hook to fetch employees for payroll processing
 */
export function useEmployeesForPayroll(
  companyId: string | undefined | null,
  month: number,
  year: number
) {
  return useQuery<EmployeePayrollData[]>({
    queryKey: ['payroll', 'employees', companyId, month, year],
    queryFn: () => payrollService.getEmployeesForPayroll(companyId!, month, year),
    enabled: !!companyId,
  })
}

/**
 * Hook to process payroll
 */
export function useProcessPayroll() {
  const queryClient = useQueryClient()

  return useMutation<
    PayrollRun,
    Error,
    { companyId: string; month: number; year: number; employeeData: EmployeePayrollData[] }
  >({
    mutationFn: ({ companyId, month, year, employeeData }) =>
      payrollService.processPayroll(companyId, month, year, employeeData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['payroll', 'runs', variables.companyId],
      })
      queryClient.invalidateQueries({
        queryKey: ['payroll', 'company', variables.companyId],
      })
    },
  })
}

/**
 * Hook to fetch payroll run history
 */
export function usePayrollRuns(companyId: string | undefined | null) {
  return useQuery<PayrollRun[]>({
    queryKey: ['payroll', 'runs', companyId],
    queryFn: () => payrollService.getPayrollRuns(companyId!),
    enabled: !!companyId,
  })
}

// Re-export types for convenience
export type { EmployeePayrollData, PayrollRun }
