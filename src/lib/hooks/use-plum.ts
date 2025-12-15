'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  plumService,
  type PlumInsurancePlan,
  type PlumMember,
  type PlumDependent,
  type EnrollMemberInput,
  type AddDependentInput,
} from '@/lib/services/plum.service'
import { toast } from 'sonner'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

const plumKeys = {
  all: ['plum'] as const,
  plans: (companyId?: string) => [...plumKeys.all, 'plans', companyId] as const,
  enrollment: (employeeId: string) => [...plumKeys.all, 'enrollment', employeeId] as const,
  policy: (memberId: string) => [...plumKeys.all, 'policy', memberId] as const,
}

/**
 * Get available insurance plans
 */
export function useInsurancePlans(companyId?: string) {
  return useQuery<PlumInsurancePlan[]>({
    queryKey: plumKeys.plans(companyId),
    queryFn: () => plumService.getAvailablePlans(companyId),
    staleTime: 300000, // 5 minutes - plans don't change often
  })
}

/**
 * Get employee's current insurance enrollment
 */
export function useEmployeeEnrollment(employeeId: string | undefined) {
  return useQuery<{
    member: PlumMember | null
    plan: PlumInsurancePlan | null
  }>({
    queryKey: plumKeys.enrollment(employeeId!),
    queryFn: () => plumService.getEmployeeEnrollment(employeeId!),
    enabled: !!employeeId,
    staleTime: 60000,
  })
}

/**
 * Enroll employee in insurance plan
 */
export function useEnrollInInsurance() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    PlumMember,
    Error,
    EnrollMemberInput
  >({
    mutationFn: async (input) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return plumService.enrollEmployee(input)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: plumKeys.enrollment(variables.employee_id),
      })
      toast.success('Successfully enrolled in insurance plan')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to enroll in insurance')
    },
  })
}

/**
 * Add dependent to insurance
 */
export function useAddDependent() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    PlumDependent,
    Error,
    AddDependentInput & { employeeId: string }
  >({
    mutationFn: async ({ employeeId, ...input }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return plumService.addDependent(input)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: plumKeys.enrollment(variables.employeeId),
      })
      toast.success('Dependent added successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add dependent')
    },
  })
}

/**
 * Update insurance coverage type
 */
export function useUpdateCoverage() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    PlumMember,
    Error,
    { memberId: string; employeeId: string; coverageType: 'self' | 'self_spouse' | 'self_children' | 'family' }
  >({
    mutationFn: async ({ memberId, coverageType }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return plumService.updateCoverage(memberId, coverageType)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: plumKeys.enrollment(variables.employeeId),
      })
      toast.success('Coverage updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update coverage')
    },
  })
}

/**
 * Cancel insurance enrollment
 */
export function useCancelEnrollment() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    void,
    Error,
    { memberId: string; employeeId: string; reason?: string }
  >({
    mutationFn: async ({ memberId, reason }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return plumService.cancelEnrollment(memberId, reason)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: plumKeys.enrollment(variables.employeeId),
      })
      toast.success('Insurance enrollment cancelled')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel enrollment')
    },
  })
}
