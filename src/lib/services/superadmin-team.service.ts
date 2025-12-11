import { BaseService } from './base.service'
import type {
  TeamMember,
  TeamMemberRole,
  TeamMemberFilters,
  PaginatedResponse,
} from '@/types/superadmin'

const DEFAULT_PAGE_SIZE = 20

// Valid team member roles
const VALID_ROLES: TeamMemberRole[] = ['super_admin', 'admin', 'support', 'viewer']

// Type guard for role validation
function isValidRole(role: unknown): role is TeamMemberRole {
  return typeof role === 'string' && VALID_ROLES.includes(role as TeamMemberRole)
}

// Safe company parser from Supabase relation
function parseCompanyRelation(company: unknown): { id: string; legal_name: string; display_name: string | null } | null {
  if (!company || typeof company !== 'object') return null
  const c = company as Record<string, unknown>
  if (typeof c.id !== 'string' || typeof c.legal_name !== 'string') return null
  return {
    id: c.id,
    legal_name: c.legal_name,
    display_name: typeof c.display_name === 'string' ? c.display_name : null,
  }
}

class SuperAdminTeamServiceClass extends BaseService {
  async getTeamMembers(
    filters?: TeamMemberFilters
  ): Promise<PaginatedResponse<TeamMember>> {
    const page = filters?.page || 1
    const limit = filters?.limit || DEFAULT_PAGE_SIZE
    const offset = (page - 1) * limit

    // Build query on superadmin_team table
    let query = this.supabase
      .from('superadmin_team')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply role filter
    if (filters?.role) {
      query = query.eq('role', filters.role)
    }

    // Apply active filter
    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: members, error, count } = await query
    if (error) this.handleError(error)

    if (!members || members.length === 0) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0, hasMore: false },
      }
    }

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
      const company = parseCompanyRelation(a.company)
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
    const data = filteredMembers.map((member) => {
      const user = usersMap[member.user_id]
      const role = isValidRole(member.role) ? member.role : 'viewer' // Default to most restrictive role
      return {
        id: member.id,
        userId: member.user_id,
        name: user?.name || 'Unknown',
        email: user?.email || '',
        role,
        isActive: member.is_active ?? true,
        assignedClients: assignmentsMap[member.id] || [],
        createdAt: member.created_at || new Date().toISOString(),
      }
    })

    const total = count || data.length
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  }

  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    if (!id) return null

    const { data: member, error } = await this.supabase
      .from('superadmin_team')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    // Return null if no data (safety check)
    if (!member) return null

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
      const company = parseCompanyRelation(a.company)
      if (company) {
        assignedClients.push({
          id: company.id,
          name: company.display_name || company.legal_name,
        })
      }
    })

    const role = isValidRole(member.role) ? member.role : 'viewer'

    return {
      id: member.id,
      userId: member.user_id,
      name: user
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
        : 'Unknown',
      email: user?.email || '',
      role,
      isActive: member.is_active ?? true,
      assignedClients,
      createdAt: member.created_at || new Date().toISOString(),
    }
  }

  private validateRole(role: unknown): role is TeamMemberRole {
    return isValidRole(role)
  }

  async createTeamMember(data: {
    userId: string
    role: TeamMemberRole
    clientIds?: string[]
  }): Promise<TeamMember> {
    // Validate inputs
    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('Invalid user ID')
    }
    if (!this.validateRole(data.role)) {
      throw new Error('Invalid role')
    }

    // Check if user already exists in team
    const { data: existing } = await this.supabase
      .from('superadmin_team')
      .select('id')
      .eq('user_id', data.userId)
      .single()

    if (existing) {
      throw new Error('User is already a team member')
    }

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
    // Validate inputs
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid team member ID')
    }
    if (data.role !== undefined && !this.validateRole(data.role)) {
      throw new Error('Invalid role')
    }

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

    // Update client assignments if provided using atomic RPC function
    if (data.clientIds !== undefined) {
      const validClientIds = data.clientIds.filter((cid) => typeof cid === 'string' && cid.trim())
      const { error: assignError } = await this.supabase.rpc('assign_team_clients', {
        p_team_member_id: id,
        p_client_ids: validClientIds,
      })

      if (assignError) this.handleError(assignError)
    }

    // Return updated team member
    const result = await this.getTeamMemberById(id)
    if (!result) throw new Error('Team member not found')
    return result
  }

  async deleteTeamMember(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid team member ID')
    }

    // Check if trying to delete last super_admin
    const { data: member } = await this.supabase
      .from('superadmin_team')
      .select('role')
      .eq('id', id)
      .single()

    if (member?.role === 'super_admin') {
      const { count } = await this.supabase
        .from('superadmin_team')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'super_admin')
        .eq('is_active', true)

      if (count && count <= 1) {
        throw new Error('Cannot delete the last super admin')
      }
    }

    const { error } = await this.supabase
      .from('superadmin_team')
      .delete()
      .eq('id', id)

    if (error) this.handleError(error)
  }

  async findUserByEmail(email: string): Promise<{ id: string; email: string; name: string } | null> {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email address')
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data: user, error } = await this.supabase
      .from('users_user')
      .select('id, email, first_name, last_name')
      .eq('email', normalizedEmail)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No user found
        return null
      }
      this.handleError(error)
    }

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
    }
  }

  async assignClients(
    teamMemberId: string,
    clientIds: string[]
  ): Promise<void> {
    // Validate inputs
    if (!teamMemberId || typeof teamMemberId !== 'string') {
      throw new Error('Invalid team member ID')
    }
    if (!Array.isArray(clientIds)) {
      throw new Error('Client IDs must be an array')
    }
    // Validate all client IDs are strings (filter out empty strings)
    const validClientIds = clientIds.filter((id) => typeof id === 'string' && id.trim())

    // Use the atomic RPC function to assign clients
    // This handles the delete + insert in a single transaction
    const { error } = await this.supabase.rpc('assign_team_clients', {
      p_team_member_id: teamMemberId,
      p_client_ids: validClientIds,
    })

    if (error) this.handleError(error)
  }
}

export const superadminTeamService = new SuperAdminTeamServiceClass()
