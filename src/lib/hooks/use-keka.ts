'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  kekaService,
  type KekaEmployee,
  type KekaSalary,
  type KekaLeaveType,
  type KekaLeaveBalance,
  type KekaLeaveRequest,
  type KekaCreateLeaveRequestInput,
} from '@/lib/services/keka.service'
import { toast } from 'sonner'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

const kekaKeys = {
  all: ['keka'] as const,
  employees: () => [...kekaKeys.all, 'employees'] as const,
  employee: (id: string) => [...kekaKeys.all, 'employee', id] as const,
  salary: (employeeId: string) => [...kekaKeys.all, 'salary', employeeId] as const,
  leaveTypes: () => [...kekaKeys.all, 'leaveTypes'] as const,
  leaveBalance: (employeeId: string) => [...kekaKeys.all, 'leaveBalance', employeeId] as const,
  leaveRequests: (employeeId: string) => [...kekaKeys.all, 'leaveRequests', employeeId] as const,
  departments: () => [...kekaKeys.all, 'departments'] as const,
  jobTitles: () => [...kekaKeys.all, 'jobTitles'] as const,
  locations: () => [...kekaKeys.all, 'locations'] as const,
}

/**
 * Get all employees from Keka
 */
export function useKekaEmployees(params?: {
  page?: number
  pageSize?: number
  status?: 'Active' | 'Inactive' | 'All'
}) {
  return useQuery<{ data: KekaEmployee[]; totalCount: number }>({
    queryKey: [...kekaKeys.employees(), params],
    queryFn: () => kekaService.getEmployees(params),
    staleTime: 60000, // 1 minute
  })
}

/**
 * Get a single employee from Keka
 */
export function useKekaEmployee(kekaEmployeeId: string | undefined) {
  return useQuery<KekaEmployee | null>({
    queryKey: kekaKeys.employee(kekaEmployeeId!),
    queryFn: () => kekaService.getEmployee(kekaEmployeeId!),
    enabled: !!kekaEmployeeId,
    staleTime: 60000,
  })
}

/**
 * Sync employee to Keka
 */
export function useSyncEmployeeToKeka() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    string | null,
    Error,
    string
  >({
    mutationFn: async (employeeId) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return kekaService.syncEmployeeToKeka(employeeId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kekaKeys.employees() })
      toast.success('Employee synced to Keka successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sync employee to Keka')
    },
  })
}

/**
 * Get employee salary from Keka
 */
export function useKekaSalary(kekaEmployeeId: string | undefined) {
  return useQuery<KekaSalary | null>({
    queryKey: kekaKeys.salary(kekaEmployeeId!),
    queryFn: () => kekaService.getEmployeeSalary(kekaEmployeeId!),
    enabled: !!kekaEmployeeId,
    staleTime: 300000, // 5 minutes
  })
}

/**
 * Get leave types from Keka
 */
export function useKekaLeaveTypes() {
  return useQuery<KekaLeaveType[]>({
    queryKey: kekaKeys.leaveTypes(),
    queryFn: () => kekaService.getLeaveTypes(),
    staleTime: 600000, // 10 minutes - leave types don't change often
  })
}

/**
 * Get employee leave balance from Keka
 */
export function useKekaLeaveBalance(kekaEmployeeId: string | undefined) {
  return useQuery<KekaLeaveBalance[]>({
    queryKey: kekaKeys.leaveBalance(kekaEmployeeId!),
    queryFn: () => kekaService.getLeaveBalance(kekaEmployeeId!),
    enabled: !!kekaEmployeeId,
    staleTime: 60000,
  })
}

/**
 * Get employee leave requests from Keka
 */
export function useKekaLeaveRequests(
  kekaEmployeeId: string | undefined,
  params?: { status?: string; startDate?: string; endDate?: string }
) {
  return useQuery<KekaLeaveRequest[]>({
    queryKey: [...kekaKeys.leaveRequests(kekaEmployeeId!), params],
    queryFn: () => kekaService.getLeaveRequests(kekaEmployeeId!, params),
    enabled: !!kekaEmployeeId,
    staleTime: 60000,
  })
}

/**
 * Create leave request in Keka
 */
export function useCreateKekaLeaveRequest() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    KekaLeaveRequest | null,
    Error,
    KekaCreateLeaveRequestInput
  >({
    mutationFn: async (input) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return kekaService.createLeaveRequest(input)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: kekaKeys.leaveRequests(variables.employeeId),
      })
      queryClient.invalidateQueries({
        queryKey: kekaKeys.leaveBalance(variables.employeeId),
      })
      toast.success('Leave request created in Keka')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create leave request')
    },
  })
}

/**
 * Sync leave request to Keka
 */
export function useSyncLeaveToKeka() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    string | null,
    Error,
    { leaveRequestId: string; kekaEmployeeId: string }
  >({
    mutationFn: async ({ leaveRequestId }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return kekaService.syncLeaveToKeka(leaveRequestId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: kekaKeys.leaveRequests(variables.kekaEmployeeId),
      })
      toast.success('Leave request synced to Keka')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sync leave request')
    },
  })
}

/**
 * Get departments from Keka
 */
export function useKekaDepartments() {
  return useQuery<{ id: string; name: string }[]>({
    queryKey: kekaKeys.departments(),
    queryFn: () => kekaService.getDepartments(),
    staleTime: 600000, // 10 minutes
  })
}

/**
 * Get job titles from Keka
 */
export function useKekaJobTitles() {
  return useQuery<{ id: string; name: string }[]>({
    queryKey: kekaKeys.jobTitles(),
    queryFn: () => kekaService.getJobTitles(),
    staleTime: 600000,
  })
}

/**
 * Get locations from Keka
 */
export function useKekaLocations() {
  return useQuery<{ id: string; name: string }[]>({
    queryKey: kekaKeys.locations(),
    queryFn: () => kekaService.getLocations(),
    staleTime: 600000,
  })
}
