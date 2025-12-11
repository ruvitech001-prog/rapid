'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  taxService,
  type InvestmentDeclaration,
  type TaxSummary,
  type Form16Data,
  type TaxDeclarationDeadline,
  type Form16Availability,
  type TaxProof,
} from '@/lib/services'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

const taxKeys = {
  all: ['tax'] as const,
  declaration: (employeeId: string, fy?: string) => [...taxKeys.all, 'declaration', employeeId, fy] as const,
  declarations: (employeeId: string) => [...taxKeys.all, 'declarations', employeeId] as const,
  summary: (employeeId: string, fy?: string) => [...taxKeys.all, 'summary', employeeId, fy] as const,
  form16: (employeeId: string, fy?: string) => [...taxKeys.all, 'form16', employeeId, fy] as const,
  form16Availability: (employeeId: string) => [...taxKeys.all, 'form16-availability', employeeId] as const,
  deadline: (employeeId: string, fy?: string) => [...taxKeys.all, 'deadline', employeeId, fy] as const,
  proofs: (employeeId: string, fy?: string) => [...taxKeys.all, 'proofs', employeeId, fy] as const,
}

export function useInvestmentDeclaration(
  employeeId: string | undefined,
  financialYear?: string
) {
  return useQuery<InvestmentDeclaration | null>({
    queryKey: taxKeys.declaration(employeeId!, financialYear),
    queryFn: () => taxService.getDeclaration(employeeId!, financialYear),
    enabled: !!employeeId,
    staleTime: 30000,
  })
}

export function useDeclarationHistory(employeeId: string | undefined) {
  return useQuery<InvestmentDeclaration[]>({
    queryKey: taxKeys.declarations(employeeId!),
    queryFn: () => taxService.getDeclarationHistory(employeeId!),
    enabled: !!employeeId,
    staleTime: 60000,
  })
}

export function useForm16(
  employeeId: string | undefined,
  financialYear?: string
) {
  return useQuery<Form16Data | null>({
    queryKey: taxKeys.form16(employeeId!, financialYear),
    queryFn: () => taxService.getForm16(employeeId!, financialYear),
    enabled: !!employeeId,
    staleTime: 60000,
  })
}

export function useTaxSummary(
  employeeId: string | undefined,
  financialYear?: string
) {
  return useQuery<TaxSummary | null>({
    queryKey: taxKeys.summary(employeeId!, financialYear),
    queryFn: () => taxService.getTaxSummary(employeeId!, financialYear),
    enabled: !!employeeId,
    staleTime: 30000,
  })
}

export function useSaveDeclaration() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    InvestmentDeclaration,
    Error,
    { employeeId: string; declaration: Partial<InvestmentDeclaration> }
  >({
    mutationFn: async ({ employeeId, declaration }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return taxService.saveDeclaration(employeeId, declaration)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.all })
    },
    onError: (error) => {
      console.error('[Save Declaration] Failed:', error)
    },
  })
}

export function useSubmitDeclaration() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<InvestmentDeclaration, Error, string>({
    mutationFn: async (declarationId) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return taxService.submitDeclaration(declarationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.all })
    },
    onError: (error) => {
      console.error('[Submit Declaration] Failed:', error)
    },
  })
}

/**
 * Get tax declaration deadline and window status
 */
export function useTaxDeclarationStatus(
  employeeId: string | undefined,
  financialYear?: string
) {
  return useQuery<TaxDeclarationDeadline>({
    queryKey: taxKeys.deadline(employeeId!, financialYear),
    queryFn: () => taxService.getTaxDeclarationDeadline(employeeId!, financialYear),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get Form16 availability for employee
 */
export function useForm16Availability(employeeId: string | undefined) {
  return useQuery<Form16Availability>({
    queryKey: taxKeys.form16Availability(employeeId!),
    queryFn: () => taxService.getForm16Availability(employeeId!),
    enabled: !!employeeId,
    staleTime: 30 * 60 * 1000, // 30 minutes - doesn't change often
  })
}

/**
 * Get tax proofs for an employee
 */
export function useTaxProofs(
  employeeId: string | undefined,
  financialYear?: string
) {
  return useQuery<TaxProof[]>({
    queryKey: taxKeys.proofs(employeeId!, financialYear),
    queryFn: () => taxService.getTaxProofs(employeeId!, financialYear),
    enabled: !!employeeId,
    staleTime: 30000,
  })
}

/**
 * Upload a tax proof
 */
export function useUploadTaxProof() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    TaxProof,
    Error,
    {
      employeeId: string
      file: File
      category: string
      subCategory: string
      financialYear?: string
    }
  >({
    mutationFn: async ({ employeeId, file, category, subCategory, financialYear }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return taxService.uploadTaxProof(employeeId, file, category, subCategory, financialYear)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taxKeys.proofs(variables.employeeId, variables.financialYear),
      })
    },
    onError: (error) => {
      console.error('[Upload Tax Proof] Failed:', error)
    },
  })
}

/**
 * Delete a tax proof
 */
export function useDeleteTaxProof() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    void,
    Error,
    { proofId: string; employeeId: string; financialYear?: string }
  >({
    mutationFn: async ({ proofId }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return taxService.deleteTaxProof(proofId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taxKeys.proofs(variables.employeeId, variables.financialYear),
      })
    },
    onError: (error) => {
      console.error('[Delete Tax Proof] Failed:', error)
    },
  })
}

/**
 * Download Form16 PDF
 */
export function useDownloadForm16() {
  const lastCallRef = useRef<number>(0)

  return useMutation<
    string,
    Error,
    { employeeId: string; financialYear?: string }
  >({
    mutationFn: async ({ employeeId, financialYear }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return taxService.downloadForm16(employeeId, financialYear)
    },
    onError: (error) => {
      console.error('[Download Form16] Failed:', error)
    },
  })
}
