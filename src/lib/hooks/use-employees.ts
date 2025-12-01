'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { employeesService, type EmployeeListItem, type EmployeeWithContract } from '@/lib/services'

export function useEmployees(companyId: string | undefined) {
  return useQuery<EmployeeListItem[]>({
    queryKey: queryKeys.employees.byCompany(companyId!),
    queryFn: () => employeesService.getByCompany(companyId!),
    enabled: !!companyId,
  })
}

export function useEmployee(employeeId: string | undefined) {
  return useQuery<EmployeeWithContract | null>({
    queryKey: queryKeys.employees.detail(employeeId!),
    queryFn: () => employeesService.getById(employeeId!),
    enabled: !!employeeId,
  })
}

export function useEmployeeCount(companyId: string | undefined) {
  return useQuery<number>({
    queryKey: queryKeys.employees.count(companyId!),
    queryFn: () => employeesService.getCount(companyId!),
    enabled: !!companyId,
  })
}
