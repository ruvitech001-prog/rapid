'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queries/keys'
import {
  leavesService,
  type LeaveRequest,
  type LeaveRequestWithEmployee,
  type LeaveBalance,
  type LeaveRequestFilters,
} from '@/lib/services'

export function useLeaveRequests(
  companyId: string | undefined,
  filters?: LeaveRequestFilters
) {
  return useQuery<LeaveRequestWithEmployee[]>({
    queryKey: queryKeys.leaves.requests(companyId!, filters),
    queryFn: () => leavesService.getRequests(companyId!, filters),
    enabled: !!companyId,
    staleTime: 60000, // 1 minute
  })
}

export function useLeaveBalances(employeeId: string | undefined) {
  return useQuery<LeaveBalance[]>({
    queryKey: queryKeys.leaves.balances(employeeId!),
    queryFn: () => leavesService.getBalances(employeeId!),
    enabled: !!employeeId,
    staleTime: 60000, // 1 minute
  })
}

export function usePendingLeaveCount(companyId: string | undefined) {
  return useQuery<number>({
    queryKey: queryKeys.leaves.pendingCount(companyId!),
    queryFn: () => leavesService.getPendingCount(companyId!),
    enabled: !!companyId,
    staleTime: 30000, // 30 seconds
  })
}

export function useApproveLeave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      approverId,
    }: {
      requestId: string
      approverId: string
    }) => leavesService.approve(requestId, approverId),
    onSuccess: () => {
      // Invalidate all leave-related queries
      queryClient.invalidateQueries({ queryKey: ['leaves'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Leave request approved successfully')
    },
    onError: (error) => {
      console.error('[Leave Approval] Failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to approve leave request')
    },
  })
}

export function useRejectLeave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      approverId,
      reason,
    }: {
      requestId: string
      approverId: string
      reason: string
    }) => leavesService.reject(requestId, approverId, reason),
    onSuccess: () => {
      // Invalidate all leave-related queries
      queryClient.invalidateQueries({ queryKey: ['leaves'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Leave request rejected')
    },
    onError: (error) => {
      console.error('[Leave Rejection] Failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to reject leave request')
    },
  })
}

// Employee-specific hooks
export function useEmployeeLeaveRequests(employeeId: string | undefined) {
  return useQuery<LeaveRequest[]>({
    queryKey: ['leaves', 'employee', employeeId],
    queryFn: () => leavesService.getEmployeeLeaveRequests(employeeId!),
    enabled: !!employeeId,
    staleTime: 60000, // 1 minute
  })
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: {
      employeeId: string
      leaveType: string
      startDate: string
      endDate: string
      reason: string
      isHalfDay?: boolean
      halfDayPeriod?: 'first_half' | 'second_half'
    }) => leavesService.createLeaveRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Leave request submitted successfully')
    },
    onError: (error) => {
      console.error('[Leave Request Creation] Failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit leave request')
    },
  })
}
