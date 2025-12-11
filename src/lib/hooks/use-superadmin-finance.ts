'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  superadminFinanceService,
  type FinanceFilters,
  type FinanceStats,
  type EmployeeFinanceDetails,
  type TaxProof,
  type PaginatedFinanceResponse,
} from '@/lib/services/superadmin-finance.service'
import { superadminAuditService } from '@/lib/services/superadmin-audit.service'
import { useAuth } from '@/lib/auth/auth-context'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

const financeKeys = {
  all: ['superadmin', 'finance'] as const,
  declarations: (filters?: FinanceFilters) => [...financeKeys.all, 'declarations', filters] as const,
  declaration: (id: string) => [...financeKeys.all, 'declaration', id] as const,
  proofs: (filters?: { status?: string; page?: number; limit?: number }) => [...financeKeys.all, 'proofs', filters] as const,
  stats: (financialYear?: string) => [...financeKeys.all, 'stats', financialYear] as const,
}

export function useSuperAdminFinanceDeclarations(filters?: FinanceFilters) {
  return useQuery<PaginatedFinanceResponse<EmployeeFinanceDetails>>({
    queryKey: financeKeys.declarations(filters),
    queryFn: () => superadminFinanceService.getDeclarations(filters),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useSuperAdminFinanceDeclaration(id: string | undefined) {
  return useQuery<EmployeeFinanceDetails>({
    queryKey: financeKeys.declaration(id!),
    queryFn: () => superadminFinanceService.getDeclarationById(id!),
    enabled: !!id,
    staleTime: 60000,
  })
}

export function useSuperAdminTaxProofs(filters?: { status?: string; page?: number; limit?: number }) {
  return useQuery<PaginatedFinanceResponse<TaxProof>>({
    queryKey: financeKeys.proofs(filters),
    queryFn: () => superadminFinanceService.getTaxProofs(filters),
    staleTime: 60000,
  })
}

export function useSuperAdminFinanceStats(financialYear?: string) {
  return useQuery<FinanceStats>({
    queryKey: financeKeys.stats(financialYear),
    queryFn: () => superadminFinanceService.getStats(financialYear),
    staleTime: 60000,
  })
}

export function useUpdateDeclarationStatus() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      id,
      status,
      reason,
    }: {
      id: string
      status: 'approved' | 'rejected'
      reason?: string
    }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      await superadminFinanceService.updateDeclarationStatus(id, status, reason)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: `finance.declaration_${status}`,
            entityType: 'investment_declaration',
            entityId: id,
            newData: { status, reason },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log declaration status update:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financeKeys.all,
      })
    },
    onError: (error) => {
      console.error('[Declaration Status Update] Failed:', error)
    },
  })
}

export function useVerifyTaxProof() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      documentId,
      status,
    }: {
      documentId: string
      status: 'verified' | 'rejected'
    }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      await superadminFinanceService.verifyTaxProof(documentId, status)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: `finance.tax_proof_${status}`,
            entityType: 'tax_proof',
            entityId: documentId,
            newData: { status },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log tax proof verification:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financeKeys.all,
      })
    },
    onError: (error) => {
      console.error('[Tax Proof Verification] Failed:', error)
    },
  })
}
