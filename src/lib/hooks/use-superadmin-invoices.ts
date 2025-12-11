'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  superadminInvoicesService,
  type SuperAdminInvoiceFilters,
} from '@/lib/services/superadmin-invoices.service'
import { superadminAuditService } from '@/lib/services/superadmin-audit.service'
import { useAuth } from '@/lib/auth/auth-context'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

const invoiceKeys = {
  all: ['superadmin', 'invoices'] as const,
  list: (filters?: SuperAdminInvoiceFilters) => [...invoiceKeys.all, filters] as const,
  stats: () => [...invoiceKeys.all, 'stats'] as const,
}

export function useSuperAdminInvoices(filters?: SuperAdminInvoiceFilters) {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: () => superadminInvoicesService.getInvoices(filters),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useSuperAdminInvoiceStats() {
  return useQuery({
    queryKey: invoiceKeys.stats(),
    queryFn: () => superadminInvoicesService.getStats(),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useMarkInvoiceAsPaid() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      invoiceId,
      paymentReference,
    }: {
      invoiceId: string
      paymentReference?: string
    }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      await superadminInvoicesService.markInvoiceAsPaid(invoiceId, paymentReference)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'invoice.marked_paid',
            entityType: 'invoice',
            entityId: invoiceId,
            newData: { paymentReference },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log invoice payment:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
    },
    onError: (error) => {
      console.error('[Mark Invoice Paid] Failed:', error)
    },
  })
}

export function useSendPaymentReminder() {
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      const result = await superadminInvoicesService.sendPaymentReminder(invoiceId)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'invoice.reminder_sent',
            entityType: 'invoice',
            entityId: invoiceId,
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log payment reminder:', auditError)
        }
      }

      return result
    },
    onError: (error) => {
      console.error('[Send Payment Reminder] Failed:', error)
    },
  })
}

export function useGenerateInvoice() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async (data: {
      contractorId: string
      contractId: string
      billingPeriodStart: string
      billingPeriodEnd: string
      hours?: number
      rate?: number
      subtotal: number
    }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      const result = await superadminInvoicesService.generateInvoice(data)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'invoice.generated',
            entityType: 'invoice',
            entityId: result.id,
            newData: data,
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log invoice generation:', auditError)
        }
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
    },
    onError: (error) => {
      console.error('[Generate Invoice] Failed:', error)
    },
  })
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      invoiceId,
      status,
    }: {
      invoiceId: string
      status: 'draft' | 'sent' | 'approved' | 'paid' | 'overdue' | 'cancelled'
    }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      await superadminInvoicesService.updateInvoiceStatus(invoiceId, status)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: `invoice.status_${status}`,
            entityType: 'invoice',
            entityId: invoiceId,
            newData: { status },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log invoice status update:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
    },
    onError: (error) => {
      console.error('[Update Invoice Status] Failed:', error)
    },
  })
}
