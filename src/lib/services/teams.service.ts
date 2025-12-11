import { BaseService, ServiceError } from './base.service'

// Types
export interface Team {
  id: string
  companyId: string
  name: string
  description: string | null
  managerId: string | null
  managerName?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  memberCount?: number
}

export interface TeamMember {
  id: string
  teamId: string
  employeeId: string
  employeeName?: string
  employeeEmail?: string
  employeeCode?: string
  reportingManagerId: string | null
  reportingManagerName?: string | null
  role: 'member' | 'lead' | 'manager'
  assignedAt: string
  createdAt: string
  updatedAt: string
}

export interface CreateTeamInput {
  companyId: string
  name: string
  description?: string
  managerId?: string
  createdBy?: string
}

export interface UpdateTeamInput {
  name?: string
  description?: string
  managerId?: string | null
  isActive?: boolean
}

export interface AssignTeamMemberInput {
  teamId: string
  employeeId: string
  reportingManagerId?: string
  role?: 'member' | 'lead' | 'manager'
  assignedBy?: string
}

class TeamsServiceClass extends BaseService {
  /**
   * Get all teams for a company
   */
  async getCompanyTeams(companyId: string): Promise<Team[]> {
    try {
      const { data: teams, error } = await this.supabase
        .from('employer_team')
        .select(`
          id,
          company_id,
          name,
          description,
          manager_id,
          is_active,
          created_at,
          updated_at
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('name')

      if (error) {
        this.handleError(error)
      }

      if (!teams || teams.length === 0) {
        return []
      }

      // Get member counts for each team
      const teamIds = teams.map(t => t.id)
      const { data: memberCounts } = await this.supabase
        .from('employer_team_member')
        .select('team_id')
        .in('team_id', teamIds)

      const countMap = new Map<string, number>()
      memberCounts?.forEach(m => {
        countMap.set(m.team_id, (countMap.get(m.team_id) || 0) + 1)
      })

      // Get manager names
      const managerIds = teams.map(t => t.manager_id).filter(Boolean) as string[]
      let managerMap = new Map<string, string>()

      if (managerIds.length > 0) {
        const { data: managers } = await this.supabase
          .from('employee_employee')
          .select('id, full_name')
          .in('id', managerIds)

        managers?.forEach(m => {
          managerMap.set(m.id, m.full_name)
        })
      }

      return teams.map(team => ({
        id: team.id,
        companyId: team.company_id,
        name: team.name,
        description: team.description,
        managerId: team.manager_id,
        managerName: team.manager_id ? managerMap.get(team.manager_id) || null : null,
        isActive: team.is_active,
        createdAt: team.created_at,
        updatedAt: team.updated_at,
        memberCount: countMap.get(team.id) || 0,
      }))
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Get a single team by ID
   */
  async getTeam(teamId: string): Promise<Team | null> {
    try {
      const { data: team, error } = await this.supabase
        .from('employer_team')
        .select('*')
        .eq('id', teamId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        this.handleError(error)
      }

      if (!team) return null

      // Get member count
      const { count } = await this.supabase
        .from('employer_team_member')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', teamId)

      // Get manager name
      let managerName = null
      if (team.manager_id) {
        const { data: manager } = await this.supabase
          .from('employee_employee')
          .select('full_name')
          .eq('id', team.manager_id)
          .single()
        managerName = manager?.full_name || null
      }

      return {
        id: team.id,
        companyId: team.company_id,
        name: team.name,
        description: team.description,
        managerId: team.manager_id,
        managerName,
        isActive: team.is_active,
        createdAt: team.created_at,
        updatedAt: team.updated_at,
        memberCount: count || 0,
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Create a new team
   */
  async createTeam(input: CreateTeamInput): Promise<Team> {
    try {
      const { data: team, error } = await this.supabase
        .from('employer_team')
        .insert({
          company_id: input.companyId,
          name: input.name,
          description: input.description || null,
          manager_id: input.managerId || null,
          created_by: input.createdBy || null,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new ServiceError('A team with this name already exists', 'DUPLICATE_TEAM', 400)
        }
        this.handleError(error)
      }

      return {
        id: team.id,
        companyId: team.company_id,
        name: team.name,
        description: team.description,
        managerId: team.manager_id,
        isActive: team.is_active,
        createdAt: team.created_at,
        updatedAt: team.updated_at,
        memberCount: 0,
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Update a team
   */
  async updateTeam(teamId: string, input: UpdateTeamInput): Promise<Team> {
    try {
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (input.name !== undefined) updates.name = input.name
      if (input.description !== undefined) updates.description = input.description
      if (input.managerId !== undefined) updates.manager_id = input.managerId
      if (input.isActive !== undefined) updates.is_active = input.isActive

      const { data: team, error } = await this.supabase
        .from('employer_team')
        .update(updates)
        .eq('id', teamId)
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new ServiceError('A team with this name already exists', 'DUPLICATE_TEAM', 400)
        }
        this.handleError(error)
      }

      return {
        id: team.id,
        companyId: team.company_id,
        name: team.name,
        description: team.description,
        managerId: team.manager_id,
        isActive: team.is_active,
        createdAt: team.created_at,
        updatedAt: team.updated_at,
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Delete a team (soft delete)
   */
  async deleteTeam(teamId: string): Promise<void> {
    try {
      // First remove all team members
      await this.supabase
        .from('employer_team_member')
        .delete()
        .eq('team_id', teamId)

      // Then soft delete the team
      const { error } = await this.supabase
        .from('employer_team')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', teamId)

      if (error) {
        this.handleError(error)
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Get all members of a team
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const { data: members, error } = await this.supabase
        .from('employer_team_member')
        .select(`
          id,
          team_id,
          employee_id,
          reporting_manager_id,
          role,
          assigned_at,
          created_at,
          updated_at
        `)
        .eq('team_id', teamId)

      if (error) {
        this.handleError(error)
      }

      if (!members || members.length === 0) {
        return []
      }

      // Get employee details
      const employeeIds = members.map(m => m.employee_id)
      const managerIds = members.map(m => m.reporting_manager_id).filter(Boolean) as string[]
      const allIds = [...new Set([...employeeIds, ...managerIds])]

      const { data: employees } = await this.supabase
        .from('employee_employee')
        .select('id, full_name, employee_code, user_id')
        .in('id', allIds)

      // Get user emails
      const userIds = employees?.map(e => e.user_id).filter(Boolean) as string[]
      let userMap = new Map<string, string>()

      if (userIds.length > 0) {
        const { data: users } = await this.supabase
          .from('users_user')
          .select('id, email')
          .in('id', userIds)

        users?.forEach(u => {
          userMap.set(u.id, u.email)
        })
      }

      const employeeMap = new Map<string, { name: string; code: string | null; email: string | null }>()
      employees?.forEach(e => {
        employeeMap.set(e.id, {
          name: e.full_name,
          code: e.employee_code,
          email: e.user_id ? userMap.get(e.user_id) || null : null,
        })
      })

      return members.map(member => {
        const employee = employeeMap.get(member.employee_id)
        const manager = member.reporting_manager_id ? employeeMap.get(member.reporting_manager_id) : null

        return {
          id: member.id,
          teamId: member.team_id,
          employeeId: member.employee_id,
          employeeName: employee?.name || null,
          employeeEmail: employee?.email || null,
          employeeCode: employee?.code || null,
          reportingManagerId: member.reporting_manager_id,
          reportingManagerName: manager?.name || null,
          role: member.role as 'member' | 'lead' | 'manager',
          assignedAt: member.assigned_at,
          createdAt: member.created_at,
          updatedAt: member.updated_at,
        }
      })
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Get team assignment for an employee
   */
  async getEmployeeTeam(employeeId: string): Promise<{ team: Team; membership: TeamMember } | null> {
    try {
      const { data: membership, error } = await this.supabase
        .from('employer_team_member')
        .select('*')
        .eq('employee_id', employeeId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        this.handleError(error)
      }

      if (!membership) return null

      const team = await this.getTeam(membership.team_id)
      if (!team) return null

      return {
        team,
        membership: {
          id: membership.id,
          teamId: membership.team_id,
          employeeId: membership.employee_id,
          reportingManagerId: membership.reporting_manager_id,
          role: membership.role as 'member' | 'lead' | 'manager',
          assignedAt: membership.assigned_at,
          createdAt: membership.created_at,
          updatedAt: membership.updated_at,
        },
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Assign an employee to a team
   */
  async assignEmployeeToTeam(input: AssignTeamMemberInput): Promise<TeamMember> {
    try {
      // First check if employee is already in a team
      const { data: existing } = await this.supabase
        .from('employer_team_member')
        .select('id')
        .eq('employee_id', input.employeeId)
        .single()

      if (existing) {
        // Update existing assignment
        const { data: member, error } = await this.supabase
          .from('employer_team_member')
          .update({
            team_id: input.teamId,
            reporting_manager_id: input.reportingManagerId || null,
            role: input.role || 'member',
            assigned_at: new Date().toISOString(),
            assigned_by: input.assignedBy || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) {
          this.handleError(error)
        }

        return {
          id: member.id,
          teamId: member.team_id,
          employeeId: member.employee_id,
          reportingManagerId: member.reporting_manager_id,
          role: member.role as 'member' | 'lead' | 'manager',
          assignedAt: member.assigned_at,
          createdAt: member.created_at,
          updatedAt: member.updated_at,
        }
      }

      // Create new assignment
      const { data: member, error } = await this.supabase
        .from('employer_team_member')
        .insert({
          team_id: input.teamId,
          employee_id: input.employeeId,
          reporting_manager_id: input.reportingManagerId || null,
          role: input.role || 'member',
          assigned_at: new Date().toISOString(),
          assigned_by: input.assignedBy || null,
        })
        .select()
        .single()

      if (error) {
        this.handleError(error)
      }

      return {
        id: member.id,
        teamId: member.team_id,
        employeeId: member.employee_id,
        reportingManagerId: member.reporting_manager_id,
        role: member.role as 'member' | 'lead' | 'manager',
        assignedAt: member.assigned_at,
        createdAt: member.created_at,
        updatedAt: member.updated_at,
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Remove an employee from their team
   */
  async removeEmployeeFromTeam(employeeId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('employer_team_member')
        .delete()
        .eq('employee_id', employeeId)

      if (error) {
        this.handleError(error)
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }

  /**
   * Update team membership
   */
  async updateTeamMembership(
    employeeId: string,
    updates: { reportingManagerId?: string | null; role?: 'member' | 'lead' | 'manager' }
  ): Promise<TeamMember> {
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (updates.reportingManagerId !== undefined) {
        updateData.reporting_manager_id = updates.reportingManagerId
      }
      if (updates.role !== undefined) {
        updateData.role = updates.role
      }

      const { data: member, error } = await this.supabase
        .from('employer_team_member')
        .update(updateData)
        .eq('employee_id', employeeId)
        .select()
        .single()

      if (error) {
        this.handleError(error)
      }

      return {
        id: member.id,
        teamId: member.team_id,
        employeeId: member.employee_id,
        reportingManagerId: member.reporting_manager_id,
        role: member.role as 'member' | 'lead' | 'manager',
        assignedAt: member.assigned_at,
        createdAt: member.created_at,
        updatedAt: member.updated_at,
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error
      this.handleError(error)
    }
  }
}

export const teamsService = new TeamsServiceClass()
