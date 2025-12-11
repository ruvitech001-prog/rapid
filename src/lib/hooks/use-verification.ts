'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  verificationService,
  type VerificationType,
  type VerificationResult,
  type DocumentUploadResult,
  type FaceMatchResult,
  type LivenessResult,
} from '@/lib/services/verification.service'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

const verificationKeys = {
  all: ['verification'] as const,
  status: (entityType: 'employee' | 'contractor', entityId: string) =>
    [...verificationKeys.all, 'status', entityType, entityId] as const,
}

export function useVerificationStatus(
  entityType: 'employee' | 'contractor',
  entityId: string | undefined
) {
  return useQuery<VerificationResult[]>({
    queryKey: verificationKeys.status(entityType, entityId!),
    queryFn: () => verificationService.getVerificationStatus(entityType, entityId!),
    enabled: !!entityId,
    staleTime: 30000,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    DocumentUploadResult,
    Error,
    {
      file: File
      documentType: string
      entityType: 'employee' | 'contractor'
      entityId: string
    }
  >({
    mutationFn: async ({ file, documentType, entityType, entityId }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return verificationService.uploadDocument(file, documentType, entityType, entityId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: verificationKeys.status(variables.entityType, variables.entityId),
      })
    },
    onError: (error) => {
      console.error('[Document Upload] Failed:', error)
    },
  })
}

export function useSubmitForVerification() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    VerificationResult,
    Error,
    {
      documentId: string
      verificationType: VerificationType
      entityType: 'employee' | 'contractor'
      entityId: string
    }
  >({
    mutationFn: async ({ documentId, verificationType, entityType, entityId }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return verificationService.submitForVerification(
        documentId,
        verificationType,
        entityType,
        entityId
      )
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: verificationKeys.status(variables.entityType, variables.entityId),
      })
    },
    onError: (error) => {
      console.error('[Verification Submission] Failed:', error)
    },
  })
}

export function useCaptureSelfie() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    DocumentUploadResult,
    Error,
    {
      imageData: string
      entityType: 'employee' | 'contractor'
      entityId: string
    }
  >({
    mutationFn: async ({ imageData, entityType, entityId }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return verificationService.captureSelfie(imageData, entityType, entityId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: verificationKeys.status(variables.entityType, variables.entityId),
      })
    },
    onError: (error) => {
      console.error('[Selfie Capture] Failed:', error)
    },
  })
}

export function usePerformFaceMatch() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    FaceMatchResult,
    Error,
    {
      documentId: string
      selfieDocumentId: string
      entityType: 'employee' | 'contractor'
      entityId: string
    }
  >({
    mutationFn: async ({ documentId, selfieDocumentId, entityType, entityId }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return verificationService.performFaceMatch(
        documentId,
        selfieDocumentId,
        entityType,
        entityId
      )
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: verificationKeys.status(variables.entityType, variables.entityId),
      })
    },
    onError: (error) => {
      console.error('[Face Match] Failed:', error)
    },
  })
}

export function usePerformLivenessCheck() {
  const queryClient = useQueryClient()
  const lastCallRef = useRef<number>(0)

  return useMutation<
    LivenessResult,
    Error,
    {
      videoFrames: string[]
      entityType: 'employee' | 'contractor'
      entityId: string
    }
  >({
    mutationFn: async ({ videoFrames, entityType, entityId }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      return verificationService.performLivenessCheck(videoFrames, entityType, entityId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: verificationKeys.status(variables.entityType, variables.entityId),
      })
    },
    onError: (error) => {
      console.error('[Liveness Check] Failed:', error)
    },
  })
}
