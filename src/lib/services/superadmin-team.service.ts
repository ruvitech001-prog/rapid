import { BaseService } from './base.service'
import type {
  TeamMember,
  TeamMemberRole,
  TeamMemberFilters,
} from '@/types/superadmin'

class SuperAdminTeamServiceClass extends BaseService {
  async getTeamMembers(filters?: TeamMemberFilters): Promise<TeamMember[]> {
    // Build query on superadmin_team table
    let query = this.supabase
      .from('superadmin_team')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply role filter
    if (filters?.role) {
      query = query.eq('role', filters.role)
    }

    // Apply active filter
    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    const { data: members, error } = await query
    if (error) this.handleError(error)

    if (!members || members.length === 0) return []

    // Get unique user IDs
    const userIds = members.map((m) => m.user_id)

    // Batch fetch user info
    const { data: users } = await this.supabase
      .from('users_user')
      .select('id, email, first_name, last_name')
      .in('id', userIds)

    const usersMap: Record<
      string,
      { name: string; email: string }
    > = {}
    users?.forEach((u) => {
      usersMap[u.id] = {
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        email: u.email,
      }
    })

    // Fetch client assignments
    const memberIds = members.map((m) => m.id)
    const { data: assignments } = await this.supabase
      .from('superadmin_team_client')
      .select('team_member_id, company_id, company:company_company(id, legal_name, display_name)')
      .in('team_member_id', memberIds)

    const assignmentsMap: Record<string, { id: string; name: string }[]> = {}
    assignments?.forEach((a) => {
      const memberId = a.team_member_id
      if (!assignmentsMap[memberId]) {
        assignmentsMap[memberId] = []
      }
      const company = a.company as unknown as { id: string; legal_name: string; display_name: string | null } | null
      if (company) {
        assignmentsMap[memberId]!.push({
          id: company.id,
          name: company.display_name || company.legal_name,
        })
      }
    })

    // Filter by company if specified
    let filteredMembers = members
    if (filters?.companyId) {
      const memberIdsWithCompany = new Set(
        assignments
          ?.filter((a) => a.company_id === filters.companyId)
          .map((a) => a.team_member_id) || []
      )
      filteredMembers = members.filter((m) => memberIdsWithCompany.has(m.id))
    }

    // Transform results
    return filteredMembers.map((member) => {
      const user = usersMap[member.user_id]
      return {
        id: member.id,
        userId: member.user_id,
        name: user?.name || 'Unknown',
        email: user?.email || '',
        role: member.role as TeamMemberRole,
        isActive: member.is_active ?? true,
        assignedClients: assignmentsMap[member.id] || [],
        createdAt: member.created_at || new Date().toISOString(),
      }
    })
  }

  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    const { data: member, error } = await this.supabase
      .from('superadmin_team')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    // Fetch user info
    const { data: user } = await this.supabase
      .from('users_user')
      .select('id, email, first_name, last_name')
      .eq('id', member.user_id)
      .single()

    // Fetch client assignments
    const { data: assignments } = await this.supabase
      .from('superadmin_team_client')
      .select('company_id, company:company_company(id, legal_name, display_name)')
      .eq('team_member_id', id)

    const assignedClients: { id: string; name: string }[] = []
    assignments?.forEach((a) => {
      const company = a.company as unknown as { id: string; legal_name: string; display_name: string | null } | null
      if (company) {
        assignedClients.push({
          id: company.id,
          name: company.display_name || company.legal_name,
        })
      }
    })

    return {
      id: member.id,
      userId: member.user_id,
      name: user
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
        : 'Unknown',
      email: user?.email || '',
      role: member.role as TeamMemberRole,
      isActive: member.is_active ?? true,
      assignedClients,
      createdAt: member.created_at || new Date().toISOString(),
    }
  }

  async createTeamMember(data: {
    userId: string
    role: TeamMemberRole
    clientIds?: string[]
  }): Promise<TeamMember> {
    // Create team member
    const { data: member, error } = await this.supabase
      .from('superadmin_team')
      .insert({
        user_id: data.userId,
        role: data.role,
        is_active: true,
      })
      .select()
      .single()

    if (error) this.handleError(error)

    // Add client assignments if provided
    if (data.clientIds && data.clientIds.length > 0) {
      const assignments = data.clientIds.map((companyId) => ({
        team_member_id: member.id,
        company_id: companyId,
      }))

      const { error: assignError } = await this.supabase
        .from('superadmin_team_client')
        .insert(assignments)

      if (assignError) this.handleError(assignError)
    }

    // Return full team member data
    const result = await this.getTeamMemberById(member.id)
    if (!result) throw new Error('Failed to create team member')
    return result
  }

  async updateTeamMember(
    id: string,
    data: {
      role?: TeamMemberRole
      isActive?: boolean
      clientIds?: string[]
    }
  ): Promise<TeamMember> {
    // Update team member
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (data.role !== undefined) updates.role = data.role
    if (data.isActive !== undefined) updates.is_active = data.isActive

    const { error } = await this.supabase
      .from('superadmin_team')
      .update(updates)
      .eq('id', id)

    if (error) this.handleError(error)

    // Update client assignments if provided
    if (data.clientIds !== undefined) {
      // Remove existing assignments
      await this.supabase
        .from('superadmin_team_client')
        .delete()
        .eq('team_member_id', id)

      // Add new assignments
      if (data.clientIds.length > 0) {
        const assignments = data.clientIds.map((companyId) => ({
          team_member_id: id,
          company_id: companyId,
        }))

        const { error: assignError } = await this.supabase
          .from('superadmin_team_client')
          .insert(assignments)

        if (assignError) this.handleError(assignError)
      }
    }

    // Return updated team member
    const result = await this.getTeamMemberById(id)
    if (!result) throw new Error('Team member not found')
    return result
  }

  async deleteTeamMember(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('superadmin_team')
      .delete()
      .eq('id', id)

    if (error) this.handleError(error)
  }

  async assignClients(
    teamMemberId: string,
    clientIds: string[]
  ): Promise<void> {
    // Remove existing assignments
    await this.supabase
      .from('superadmin_team_client')
      .delete()
      .eq('team_member_id', teamMemberId)

    // Add new assignments
    if (clientIds.length > 0) {
      const assignments = clientIds.map((companyId) => ({
        team_member_id: teamMemberId,
        company_id: companyId,
      }))

      const { error } = await this.supabase
        .from('superadmin_team_client')
        .insert(assignments)

      if (error) this.handleError(error)
    }
  }
}

export const superadminTeamService = new SuperAdminTeamServiceClass()
