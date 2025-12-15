'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  invoicesService,
  type ContractorInvoiceWithCompany,
  type InvoiceWithContractor,
  type InvoiceFilters,
  type InvoiceSummary,
} from '@/lib/services'

// Employer hooks
export function useCompanyInvoices(
  companyId: string | undefined,
  filters?: InvoiceFilters
) {
  return useQuery<InvoiceWithContractor[]>({
    queryKey: ['invoices', 'company', companyId, filters],
    queryFn: () => invoicesService.getCompanyInvoices(companyId!, filters),
    enabled: !!companyId,
  })
}

export function usePendingInvoices(
  companyId: string | undefined,
  limit: number = 5
) {
  return useQuery<InvoiceWithContractor[]>({
    queryKey: ['invoices', 'pending', companyId, limit],
    queryFn: () => invoicesService.getPendingInvoices(companyId!, limit),
    enabled: !!companyId,
  })
}

export function useRecentlyPaidInvoices(
  companyId: string | undefined,
  limit: number = 5
) {
  return useQuery<InvoiceWithContractor[]>({
    queryKey: ['invoices', 'paid', companyId, limit],
    queryFn: () => invoicesService.getRecentlyPaidInvoices(companyId!, limit),
    enabled: !!companyId,
  })
}

export function useInvoiceSummary(companyId: string | undefined) {
  return useQuery<InvoiceSummary>({
    queryKey: ['invoices', 'summary', companyId],
    queryFn: () => invoicesService.getInvoiceSummary(companyId!),
    enabled: !!companyId,
  })
}

export function useCostOverview(
  companyId: string | undefined,
  months: number = 6
) {
  return useQuery<{ month: string; cost: number }[]>({
    queryKey: ['invoices', 'costOverview', companyId, months],
    queryFn: () => invoicesService.getCostOverview(companyId!, months),
    enabled: !!companyId,
  })
}

export function usePayInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      invoiceId,
      companyId,
      paymentReference,
    }: {
      invoiceId: string
      companyId: string
      paymentReference: string
    }) => invoicesService.payInvoice(invoiceId, companyId, paymentReference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}

export function useApproveInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ invoiceId, companyId }: { invoiceId: string; companyId: string }) =>
      invoicesService.approveInvoice(invoiceId, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}

export function useRejectInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ invoiceId, reason }: { invoiceId: string; reason: string }) =>
      invoicesService.rejectInvoice(invoiceId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}

// Contractor hooks
export function useContractorInvoices(contractorId: string | undefined) {
  return useQuery<ContractorInvoiceWithCompany[]>({
    queryKey: ['invoices', 'contractor', contractorId],
    queryFn: () => invoicesService.getContractorInvoices(contractorId!),
    enabled: !!contractorId,
  })
}

// Get single invoice by ID with full details
export function useInvoiceDetail(invoiceId: string | undefined) {
  return useQuery({
    queryKey: ['invoices', 'detail', invoiceId],
    queryFn: () => invoicesService.getInvoiceById(invoiceId!),
    enabled: !!invoiceId,
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invoice: {
      contractorId: string
      contractId: string
      invoiceNumber: string
      invoiceDate: string
      dueDate: string
      billingPeriodStart: string
      billingPeriodEnd: string
      hours?: number
      rate?: number
      subtotal: number
      cgstPercent?: number
      cgstAmount?: number
      sgstPercent?: number
      sgstAmount?: number
      igstPercent?: number
      igstAmount?: number
      totalAmount: number
    }) => invoicesService.createInvoice(invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}
