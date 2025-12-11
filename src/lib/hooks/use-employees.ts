'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { employeesService, type EmployeeListItem, type EmployeeWithContract, type Employee } from '@/lib/services'
import { toast } from 'sonner'

export function useEmployees(companyId: string | undefined) {
  return useQuery<EmployeeListItem[]>({
    queryKey: queryKeys.employees.byCompany(companyId!),
    queryFn: () => employeesService.getByCompany(companyId!),
    enabled: !!companyId,
    staleTime: 60000, // 1 minute
  })
}

export function useEmployee(employeeId: string | undefined) {
  return useQuery<EmployeeWithContract | null>({
    queryKey: queryKeys.employees.detail(employeeId!),
    queryFn: () => employeesService.getById(employeeId!),
    enabled: !!employeeId,
    staleTime: 60000,
  })
}

export function useEmployeeCount(companyId: string | undefined) {
  return useQuery<number>({
    queryKey: queryKeys.employees.count(companyId!),
    queryFn: () => employeesService.getCount(companyId!),
    enabled: !!companyId,
    staleTime: 60000,
  })
}

/**
 * Hook to update an employee
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation<Employee, Error, { employeeId: string; updates: { fullName?: string; phoneNumber?: string; status?: string } }>({
    mutationFn: ({ employeeId, updates }) => employeesService.updateEmployee(employeeId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['workforce'] })
      toast.success(`${data.full_name} updated successfully`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update employee')
    },
  })
}

/**
 * Hook to deactivate an employee
 */
export function useDeactivateEmployee() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { employeeId: string; employeeName: string }>({
    mutationFn: ({ employeeId }) => employeesService.deactivateEmployee(employeeId),
    onSuccess: (_, { employeeName }) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['workforce'] })
      toast.success(`${employeeName} has been deactivated`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deactivate employee')
    },
  })
}
