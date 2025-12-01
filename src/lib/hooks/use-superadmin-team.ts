'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { superadminTeamService } from '@/lib/services/superadmin-team.service'
import type { TeamMemberFilters, TeamMemberRole } from '@/types/superadmin'

export function useSuperAdminTeam(filters?: TeamMemberFilters) {
  return useQuery({
    queryKey: queryKeys.superadmin.team.list(),
    queryFn: () => superadminTeamService.getTeamMembers(filters),
  })
}

export function useSuperAdminTeamMember(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.superadmin.team.detail(id!),
    queryFn: () => superadminTeamService.getTeamMemberById(id!),
    enabled: !!id,
  })
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      userId: string
      role: TeamMemberRole
      clientIds?: string[]
    }) => superadminTeamService.createTeamMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.team.all,
      })
    },
  })
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: {
        role?: TeamMemberRole
        isActive?: boolean
        clientIds?: string[]
      }
    }) => superadminTeamService.updateTeamMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.team.all,
      })
    },
  })
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => superadminTeamService.deleteTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.team.all,
      })
    },
  })
}

export function useAssignClients() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      teamMemberId,
      clientIds,
    }: {
      teamMemberId: string
      clientIds: string[]
    }) => superadminTeamService.assignClients(teamMemberId, clientIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superadmin.team.all,
      })
    },
  })
}
