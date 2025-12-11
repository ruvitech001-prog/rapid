'use client'

import { useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { superadminRequestsService } from '@/lib/services/superadmin-requests.service'
import { superadminAuditService } from '@/lib/services/superadmin-audit.service'
import { useAuth } from '@/lib/auth/auth-context'
import type { SuperAdminRequestFilters, PaginatedResponse, RequestWithDetails } from '@/types/superadmin'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

export function useSuperAdminRequests(filters?: SuperAdminRequestFilters) {
  return useQuery<PaginatedResponse<RequestWithDetails>>({
    queryKey: queryKeys.superadmin.requests.list(filters as Record<string, unknown>),
    queryFn: () => superadminRequestsService.getRequests(filters),
    staleTime: 30000, // Data considered fresh for 30 seconds
    refetchInterval: 30000, // Poll every 30s
  })
}

export function useSuperAdminRequest(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.superadmin.requests.detail(id!),
    queryFn: () => superadminRequestsService.getRequestById(id!),
    enabled: !!id,
    staleTime: 30000, // Data considered fresh for 30 seconds
  })
}

export function useSuperAdminRequestCounts() {
  return useQuery({
    queryKey: queryKeys.superadmin.requests.counts(),
    queryFn: () => superadminRequestsService.getCounts(),
    staleTime: 30000, // Data considered fresh for 30 seconds
    refetchInterval: 30000,
  })
}

export function useApproveRequest() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      requestId,
      remarks,
    }: {
      requestId: string
      remarks?: string
    }) => {
      // Rate limiting check - set time BEFORE call
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      // Execute the main operation first
      await superadminRequestsService.approve(requestId, remarks)

      // Only log audit event after successful operation
      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'request.approved',
            entityType: 'request',
            entityId: requestId,
            newData: { status: 'approved', remarks },
          })
        } catch (auditError) {
          // Don't fail the mutation if audit logging fails
          console.error('[Audit] Failed to log approval:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.requests.all,
      })
    },
    onError: (error) => {
      console.error('[Request Approval] Failed:', error)
    },
  })
}

export function useRejectRequest() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      requestId,
      remarks,
    }: {
      requestId: string
      remarks: string
    }) => {
      // Rate limiting check - set time BEFORE call
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      // Execute the main operation first
      await superadminRequestsService.reject(requestId, remarks)

      // Only log audit event after successful operation
      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'request.rejected',
            entityType: 'request',
            entityId: requestId,
            newData: { status: 'rejected', remarks },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log rejection:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.requests.all,
      })
    },
    onError: (error) => {
      console.error('[Request Rejection] Failed:', error)
    },
  })
}

export function useAssignRequest() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      requestId,
      assigneeId,
    }: {
      requestId: string
      assigneeId: string
    }) => {
      // Rate limiting check - set time BEFORE call
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      // Execute the main operation first
      await superadminRequestsService.assignTo(requestId, assigneeId)

      // Only log audit event after successful operation
      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'request.assigned',
            entityType: 'request',
            entityId: requestId,
            newData: { assignedToId: assigneeId },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log assignment:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.requests.all,
      })
    },
    onError: (error) => {
      console.error('[Request Assignment] Failed:', error)
    },
  })
}
