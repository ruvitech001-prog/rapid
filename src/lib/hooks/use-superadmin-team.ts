'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { superadminTeamService } from '@/lib/services/superadmin-team.service'
import { superadminAuditService } from '@/lib/services/superadmin-audit.service'
import { useAuth } from '@/lib/auth/auth-context'
import type { TeamMemberFilters, TeamMemberRole, PaginatedResponse, TeamMember } from '@/types/superadmin'

// Rate limit configuration: 1 request per 2 seconds
const RATE_LIMIT_MS = 2000

export function useSuperAdminTeam(filters?: TeamMemberFilters) {
  return useQuery<PaginatedResponse<TeamMember>>({
    queryKey: [...queryKeys.superadmin.team.list(), filters],
    queryFn: () => superadminTeamService.getTeamMembers(filters),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useSuperAdminTeamMember(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.superadmin.team.detail(id!),
    queryFn: () => superadminTeamService.getTeamMemberById(id!),
    enabled: !!id,
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async (data: {
      userId: string
      role: TeamMemberRole
      clientIds?: string[]
    }) => {
      // Rate limiting check - set time BEFORE call
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      // Execute the main operation first
      const result = await superadminTeamService.createTeamMember(data)

      // Only log audit event after successful operation
      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'team.member_created',
            entityType: 'team_member',
            entityId: result.id,
            newData: { userId: data.userId, role: data.role, clientIds: data.clientIds },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log team member creation:', auditError)
        }
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.team.all,
      })
    },
    onError: (error) => {
      console.error('[Team Member Creation] Failed:', error)
    },
  })
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        role?: TeamMemberRole
        isActive?: boolean
        clientIds?: string[]
      }
    }) => {
      // Rate limiting check - set time BEFORE call
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      // Execute the main operation first
      const result = await superadminTeamService.updateTeamMember(id, data)

      // Only log audit event after successful operation
      if (user) {
        try {
          const action = data.role !== undefined ? 'team.role_changed' : 'team.member_updated'
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action,
            entityType: 'team_member',
            entityId: id,
            newData: data,
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log team member update:', auditError)
        }
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.team.all,
      })
    },
    onError: (error) => {
      console.error('[Team Member Update] Failed:', error)
    },
  })
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async (id: string) => {
      // Rate limiting check - set time BEFORE call
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      // Execute the main operation first
      await superadminTeamService.deleteTeamMember(id)

      // Only log audit event after successful operation
      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'team.member_deleted',
            entityType: 'team_member',
            entityId: id,
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log team member deletion:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.team.all,
      })
    },
    onError: (error) => {
      console.error('[Team Member Deletion] Failed:', error)
    },
  })
}

export function useAssignClients() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const lastCallRef = useRef<number>(0)

  return useMutation({
    mutationFn: async ({
      teamMemberId,
      clientIds,
    }: {
      teamMemberId: string
      clientIds: string[]
    }) => {
      // Rate limiting check - set time BEFORE call
      const now = Date.now()
      if (now - lastCallRef.current < RATE_LIMIT_MS) {
        throw new Error('Please wait before trying again')
      }
      lastCallRef.current = now

      // Execute the main operation first
      await superadminTeamService.assignClients(teamMemberId, clientIds)

      // Only log audit event after successful operation
      if (user) {
        try {
          await superadminAuditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'team.clients_assigned',
            entityType: 'team_member',
            entityId: teamMemberId,
            newData: { clientIds },
          })
        } catch (auditError) {
          console.error('[Audit] Failed to log client assignment:', auditError)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.team.all,
      })
    },
    onError: (error) => {
      console.error('[Client Assignment] Failed:', error)
    },
  })
}
