import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamsService, type Team, type TeamMember, type CreateTeamInput, type UpdateTeamInput, type AssignTeamMemberInput } from '@/lib/services/teams.service'
import { toast } from 'sonner'

const QUERY_KEYS = {
  teams: (companyId: string) => ['teams', companyId] as const,
  team: (teamId: string) => ['team', teamId] as const,
  teamMembers: (teamId: string) => ['teamMembers', teamId] as const,
  employeeTeam: (employeeId: string) => ['employeeTeam', employeeId] as const,
}

/**
 * Hook to fetch all teams for a company
 */
export function useCompanyTeams(companyId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.teams(companyId || ''),
    queryFn: () => teamsService.getCompanyTeams(companyId!),
    enabled: !!companyId,
    staleTime: 60000, // 1 minute
  })
}

/**
 * Hook to fetch a single team
 */
export function useTeam(teamId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.team(teamId || ''),
    queryFn: () => teamsService.getTeam(teamId!),
    enabled: !!teamId,
    staleTime: 60000,
  })
}

/**
 * Hook to fetch team members
 */
export function useTeamMembers(teamId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.teamMembers(teamId || ''),
    queryFn: () => teamsService.getTeamMembers(teamId!),
    enabled: !!teamId,
    staleTime: 60000,
  })
}

/**
 * Hook to fetch an employee's team assignment
 */
export function useEmployeeTeam(employeeId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.employeeTeam(employeeId || ''),
    queryFn: () => teamsService.getEmployeeTeam(employeeId!),
    enabled: !!employeeId,
    staleTime: 60000,
  })
}

/**
 * Hook to create a new team
 */
export function useCreateTeam(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Omit<CreateTeamInput, 'companyId'>) =>
      teamsService.createTeam({ ...input, companyId }),
    onSuccess: (newTeam) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams(companyId) })
      toast.success(`Team "${newTeam.name}" created successfully`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create team')
    },
  })
}

/**
 * Hook to update a team
 */
export function useUpdateTeam(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teamId, updates }: { teamId: string; updates: UpdateTeamInput }) =>
      teamsService.updateTeam(teamId, updates),
    onSuccess: (updatedTeam) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams(companyId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.team(updatedTeam.id) })
      toast.success(`Team "${updatedTeam.name}" updated successfully`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update team')
    },
  })
}

/**
 * Hook to delete a team
 */
export function useDeleteTeam(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (teamId: string) => teamsService.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams(companyId) })
      toast.success('Team deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete team')
    },
  })
}

/**
 * Hook to assign an employee to a team
 */
export function useAssignEmployeeToTeam(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AssignTeamMemberInput) => teamsService.assignEmployeeToTeam(input),
    onSuccess: (member, input) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams(companyId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teamMembers(input.teamId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employeeTeam(input.employeeId) })
      toast.success('Employee assigned to team successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign employee to team')
    },
  })
}

/**
 * Hook to remove an employee from their team
 */
export function useRemoveEmployeeFromTeam(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (employeeId: string) => teamsService.removeEmployeeFromTeam(employeeId),
    onSuccess: (_, employeeId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams(companyId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employeeTeam(employeeId) })
      toast.success('Employee removed from team successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove employee from team')
    },
  })
}

/**
 * Hook to update team membership
 */
export function useUpdateTeamMembership(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      employeeId,
      updates,
    }: {
      employeeId: string
      updates: { reportingManagerId?: string | null; role?: 'member' | 'lead' | 'manager' }
    }) => teamsService.updateTeamMembership(employeeId, updates),
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams(companyId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teamMembers(member.teamId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employeeTeam(member.employeeId) })
      toast.success('Team membership updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update team membership')
    },
  })
}
