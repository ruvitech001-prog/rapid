'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  employerRequestsService,
  type EmployerRequest,
  type EmployerRequestFilters,
  type EmployerRequestCounts,
} from '@/lib/services/employer-requests.service'

/**
 * Hook to fetch all employer requests (leaves, expenses, special)
 */
export function useEmployerRequests(
  companyId: string | undefined | null,
  filters?: EmployerRequestFilters
) {
  return useQuery<EmployerRequest[]>({
    queryKey: ['employer-requests', companyId, filters],
    queryFn: () => employerRequestsService.getRequests(companyId!, filters),
    enabled: !!companyId,
  })
}

/**
 * Hook to fetch request counts for status badges
 */
export function useEmployerRequestCounts(companyId: string | undefined | null) {
  return useQuery<EmployerRequestCounts>({
    queryKey: ['employer-requests', 'counts', companyId],
    queryFn: () => employerRequestsService.getCounts(companyId!),
    enabled: !!companyId,
  })
}

/**
 * Hook to approve a request
 */
export function useApproveEmployerRequest() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    Error,
    { requestId: string; requestType: string; approverId: string; remarks?: string }
  >({
    mutationFn: ({ requestId, requestType, approverId, remarks }) =>
      employerRequestsService.approveRequest(requestId, requestType, approverId, remarks),
    onSuccess: () => {
      // Invalidate all employer requests queries
      queryClient.invalidateQueries({ queryKey: ['employer-requests'] })
      // Also invalidate leave and expense specific queries
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['expense-requests'] })
    },
  })
}

/**
 * Hook to reject a request
 */
export function useRejectEmployerRequest() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    Error,
    { requestId: string; requestType: string; approverId: string; remarks: string }
  >({
    mutationFn: ({ requestId, requestType, approverId, remarks }) =>
      employerRequestsService.rejectRequest(requestId, requestType, approverId, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-requests'] })
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['expense-requests'] })
    },
  })
}

/**
 * Hook to withdraw a request
 */
export function useWithdrawEmployerRequest() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { requestId: string; requestType: string }>({
    mutationFn: ({ requestId, requestType }) =>
      employerRequestsService.withdrawRequest(requestId, requestType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-requests'] })
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['expense-requests'] })
    },
  })
}

// Re-export types for convenience
export type { EmployerRequest, EmployerRequestFilters, EmployerRequestCounts }
