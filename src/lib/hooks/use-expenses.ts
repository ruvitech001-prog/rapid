'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import {
  expensesService,
  type ExpenseClaim,
  type ExpenseClaimWithEmployee,
  type ExpenseRequestFilters,
} from '@/lib/services'

export function useExpenseRequests(
  companyId: string | undefined,
  filters?: ExpenseRequestFilters
) {
  return useQuery<ExpenseClaimWithEmployee[]>({
    queryKey: queryKeys.expenses.requests(companyId!, filters),
    queryFn: () => expensesService.getRequests(companyId!, filters),
    enabled: !!companyId,
  })
}

export function usePendingExpenseCount(companyId: string | undefined) {
  return useQuery<number>({
    queryKey: queryKeys.expenses.pendingCount(companyId!),
    queryFn: () => expensesService.getPendingCount(companyId!),
    enabled: !!companyId,
  })
}

export function useApproveExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      approverId,
    }: {
      requestId: string
      approverId: string
    }) => expensesService.approve(requestId, approverId),
    onSuccess: () => {
      // Invalidate all expense-related queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useRejectExpense() {
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
    }) => expensesService.reject(requestId, approverId, reason),
    onSuccess: () => {
      // Invalidate all expense-related queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Employee-specific hooks
export function useEmployeeExpenses(employeeId: string | undefined) {
  return useQuery<ExpenseClaim[]>({
    queryKey: ['expenses', 'employee', employeeId],
    queryFn: () => expensesService.getEmployeeExpenses(employeeId!),
    enabled: !!employeeId,
  })
}

export function useCreateExpenseClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (claim: {
      employeeId: string
      category: string
      amount: number
      merchant: string
      expenseDate: string
      description?: string
    }) => expensesService.createExpenseClaim(claim),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
