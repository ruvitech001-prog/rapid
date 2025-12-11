'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  documentsService,
  type Document,
  type DocumentWithDetails,
  type DocumentUploadInput,
  type ESignatureResult,
} from '@/lib/services'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

const documentKeys = {
  all: ['documents'] as const,
  employee: (employeeId: string) => [...documentKeys.all, 'employee', employeeId] as const,
  contractor: (contractorId: string) => [...documentKeys.all, 'contractor', contractorId] as const,
  company: (companyId: string) => [...documentKeys.all, 'company', companyId] as const,
  document: (documentId: string) => [...documentKeys.all, 'detail', documentId] as const,
  category: (employeeId: string, category: string) => [...documentKeys.all, 'category', employeeId, category] as const,
  type: (employeeId: string, type: string) => [...documentKeys.all, 'type', employeeId, type] as const,
  count: (employeeId: string) => [...documentKeys.all, 'count', employeeId] as const,
  pendingSignature: (employeeId: string) => [...documentKeys.all, 'pending-signature', employeeId] as const,
  signed: (employeeId: string) => [...documentKeys.all, 'signed', employeeId] as const,
}

export function useEmployeeDocuments(employeeId: string | undefined) {
  return useQuery<DocumentWithDetails[]>({
    queryKey: ['documents', 'employee', employeeId],
    queryFn: () => documentsService.getEmployeeDocuments(employeeId!),
    enabled: !!employeeId,
  })
}

export function useContractorDocuments(contractorId: string | undefined) {
  return useQuery<DocumentWithDetails[]>({
    queryKey: ['documents', 'contractor', contractorId],
    queryFn: () => documentsService.getContractorDocuments(contractorId!),
    enabled: !!contractorId,
  })
}

export function useCompanyDocuments(companyId: string | undefined) {
  return useQuery<DocumentWithDetails[]>({
    queryKey: ['documents', 'company', companyId],
    queryFn: () => documentsService.getCompanyDocuments(companyId!),
    enabled: !!companyId,
  })
}

export function useDocumentsByCategory(
  employeeId: string | undefined,
  category: string
) {
  return useQuery<DocumentWithDetails[]>({
    queryKey: ['documents', 'category', employeeId, category],
    queryFn: () => documentsService.getDocumentsByCategory(employeeId!, category),
    enabled: !!employeeId && !!category,
  })
}

export function useDocumentsByType(
  employeeId: string | undefined,
  documentType: string
) {
  return useQuery<DocumentWithDetails[]>({
    queryKey: ['documents', 'type', employeeId, documentType],
    queryFn: () => documentsService.getDocumentsByType(employeeId!, documentType),
    enabled: !!employeeId && !!documentType,
  })
}

export function useVerifiedDocumentsCount(employeeId: string | undefined) {
  return useQuery<{
    total: number
    verified: number
    pending: number
  }>({
    queryKey: documentKeys.count(employeeId!),
    queryFn: () => documentsService.getVerifiedDocumentsCount(employeeId!),
    enabled: !!employeeId,
    staleTime: 30000,
  })
}

/**
 * Get a single document by ID
 */
export function useDocument(documentId: string | undefined) {
  return useQuery<Document | null>({
    queryKey: documentKeys.document(documentId!),
    queryFn: () => documentsService.getDocument(documentId!),
    enabled: !!documentId,
    staleTime: 30000,
  })
}

/**
 * Get documents pending signature
 */
export function usePendingSignatureDocuments(employeeId: string | undefined) {
  return useQuery<DocumentWithDetails[]>({
    queryKey: documentKeys.pendingSignature(employeeId!),
    queryFn: () => documentsService.getPendingSignatureDocuments(employeeId!),
    enabled: !!employeeId,
    staleTime: 30000,
  })
}

/**
 * Get signed documents
 */
export function useSignedDocuments(employeeId: string | undefined) {
  return useQuery<DocumentWithDetails[]>({
    queryKey: documentKeys.signed(employeeId!),
    queryFn: () => documentsService.getSignedDocuments(employeeId!),
    enabled: !!employeeId,
    staleTime: 30000,
  })
}

/**
 * Upload an employee document
 */
export function useUploadEmployeeDocument() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    Document,
    Error,
    { employeeId: string; input: DocumentUploadInput }
  >({
    mutationFn: async ({ employeeId, input }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return documentsService.uploadEmployeeDocument(employeeId, input)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.employee(variables.employeeId),
      })
      queryClient.invalidateQueries({
        queryKey: documentKeys.count(variables.employeeId),
      })
    },
    onError: (error) => {
      console.error('[Upload Employee Document] Failed:', error)
    },
  })
}

/**
 * Upload a contractor document
 */
export function useUploadContractorDocument() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    Document,
    Error,
    { contractorId: string; input: DocumentUploadInput }
  >({
    mutationFn: async ({ contractorId, input }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return documentsService.uploadContractorDocument(contractorId, input)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.contractor(variables.contractorId),
      })
    },
    onError: (error) => {
      console.error('[Upload Contractor Document] Failed:', error)
    },
  })
}

/**
 * Delete a document
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    void,
    Error,
    { documentId: string; entityType: 'employee' | 'contractor'; entityId: string }
  >({
    mutationFn: async ({ documentId }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return documentsService.deleteDocument(documentId)
    },
    onSuccess: (_, variables) => {
      if (variables.entityType === 'employee') {
        queryClient.invalidateQueries({
          queryKey: documentKeys.employee(variables.entityId),
        })
        queryClient.invalidateQueries({
          queryKey: documentKeys.count(variables.entityId),
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: documentKeys.contractor(variables.entityId),
        })
      }
    },
    onError: (error) => {
      console.error('[Delete Document] Failed:', error)
    },
  })
}

/**
 * Sign a document
 */
export function useSignDocument() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    ESignatureResult,
    Error,
    {
      documentId: string
      signerId: string
      signerName: string
      signerEmail: string
      employeeId: string
    }
  >({
    mutationFn: async ({ documentId, signerId, signerName, signerEmail }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return documentsService.signDocument(documentId, signerId, signerName, signerEmail)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.document(variables.documentId),
      })
      queryClient.invalidateQueries({
        queryKey: documentKeys.pendingSignature(variables.employeeId),
      })
      queryClient.invalidateQueries({
        queryKey: documentKeys.signed(variables.employeeId),
      })
      queryClient.invalidateQueries({
        queryKey: documentKeys.employee(variables.employeeId),
      })
    },
    onError: (error) => {
      console.error('[Sign Document] Failed:', error)
    },
  })
}
