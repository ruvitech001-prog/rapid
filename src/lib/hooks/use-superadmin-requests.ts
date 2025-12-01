'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { superadminRequestsService } from '@/lib/services/superadmin-requests.service'
import type { SuperAdminRequestFilters } from '@/types/superadmin'

export function useSuperAdminRequests(filters?: SuperAdminRequestFilters) {
  return useQuery({
    queryKey: queryKeys.superadmin.requests.list(filters as Record<string, unknown>),
    queryFn: () => superadminRequestsService.getRequests(filters),
    refetchInterval: 30000, // Poll every 30s
  })
}

export function useSuperAdminRequest(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.superadmin.requests.detail(id!),
    queryFn: () => superadminRequestsService.getRequestById(id!),
    enabled: !!id,
  })
}

export function useSuperAdminRequestCounts() {
  return useQuery({
    queryKey: queryKeys.superadmin.requests.counts(),
    queryFn: () => superadminRequestsService.getCounts(),
    refetchInterval: 30000,
  })
}

export function useApproveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      remarks,
    }: {
      requestId: string
      remarks?: string
    }) => superadminRequestsService.approve(requestId, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.requests.all,
      })
    },
  })
}

export function useRejectRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      remarks,
    }: {
      requestId: string
      remarks: string
    }) => superadminRequestsService.reject(requestId, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.requests.all,
      })
    },
  })
}

export function useAssignRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      assigneeId,
    }: {
      requestId: string
      assigneeId: string
    }) => superadminRequestsService.assignTo(requestId, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.requests.all,
      })
    },
  })
}
