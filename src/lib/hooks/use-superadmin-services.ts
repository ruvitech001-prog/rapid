'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import {
  superadminServicesService,
  type SuperAdminService,
  type ServiceStats,
  type ServiceEnrollment,
  type CreateServiceInput,
  type UpdateServiceInput,
} from '@/lib/services/superadmin-services.service'
import { superadminAuditService } from '@/lib/services/superadmin-audit.service'
import { useAuth } from '@/lib/auth/auth-context'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

export function useSuperAdminServices() {
  return useQuery<SuperAdminService[]>({
    queryKey: queryKeys.superadmin.services.list(),
    queryFn: () => superadminServicesService.getServices(),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useSuperAdminService(id: string | undefined) {
  return useQuery<SuperAdminService>({
    queryKey: queryKeys.superadmin.services.detail(id!),
    queryFn: () => superadminServicesService.getServiceById(id!),
    enabled: !!id,
    staleTime: 60000,
  })
}

export function useSuperAdminServiceStats() {
  return useQuery<ServiceStats>({
    queryKey: queryKeys.superadmin.services.stats(),
    queryFn: () => superadminServicesService.getStats(),
    staleTime: 60000,
  })
}

export function useServiceEnrollments(serviceId: string | undefined) {
  return useQuery<ServiceEnrollment[]>({
    queryKey: queryKeys.superadmin.services.enrollments(serviceId!),
    queryFn: () => superadminServicesService.getServiceEnrollments(serviceId!),
    enabled: !!serviceId,
    staleTime: 60000,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async (input: CreateServiceInput) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      const result = await superadminServicesService.createService(input)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'services.service_created',
            entityType: 'service',
            entityId: result.id,
            newData: input,
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log service creation:', auditError)
        }
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.services.all,
      })
    },
    onError: (error) => {
      console.error('[Service Creation] Failed:', error)
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateServiceInput }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      const result = await superadminServicesService.updateService(id, input)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'services.service_updated',
            entityType: 'service',
            entityId: id,
            newData: input,
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log service update:', auditError)
        }
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.services.all,
      })
    },
    onError: (error) => {
      console.error('[Service Update] Failed:', error)
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async (id: string) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      await superadminServicesService.deleteService(id)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'services.service_deleted',
            entityType: 'service',
            entityId: id,
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log service deletion:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.services.all,
      })
    },
    onError: (error) => {
      console.error('[Service Deletion] Failed:', error)
    },
  })
}

export function useEnrollCompany() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      serviceId,
      companyId,
      configuration,
    }: {
      serviceId: string
      companyId: string
      configuration?: Record<string, unknown>
    }) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      const result = await superadminServicesService.enrollCompany(
        serviceId,
        companyId,
        configuration
      )

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'services.company_enrolled',
            entityType: 'service_enrollment',
            entityId: result.id,
            newData: { serviceId, companyId, configuration },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log company enrollment:', auditError)
        }
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.services.all,
      })
    },
    onError: (error) => {
      console.error('[Company Enrollment] Failed:', error)
    },
  })
}

export function useUnenrollCompany() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async (enrollmentId: string) => {
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      await superadminServicesService.unenrollCompany(enrollmentId)

      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'services.company_unenrolled',
            entityType: 'service_enrollment',
            entityId: enrollmentId,
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log company unenrollment:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.services.all,
      })
    },
    onError: (error) => {
      console.error('[Company Unenrollment] Failed:', error)
    },
  })
}
