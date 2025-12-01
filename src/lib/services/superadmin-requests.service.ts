import { BaseService } from './base.service'
import type {
  RequestWithDetails,
  RequestCounts,
  SuperAdminRequestFilters,
  RequestCategory,
  RequestType,
  RequestStatus,
} from '@/types/superadmin'

// Map request_type to category
const REQUEST_TYPE_CATEGORY: Record<string, RequestCategory> = {
  leave: 'employee',
  expense: 'employee',
  payroll_query: 'employee',
  employment_letter: 'employee',
  travel_letter: 'employee',
  resignation: 'employee',
  equipment_purchase: 'special',
  equipment_collect: 'special',
  termination: 'special',
  send_gifts: 'special',
}

class SuperAdminRequestsServiceClass extends BaseService {
  async getRequests(
    filters?: SuperAdminRequestFilters
  ): Promise<RequestWithDetails[]> {
    // Build query on request_request table
    let query = this.supabase
      .from('request_request')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    // Apply type filter
    if (filters?.requestType) {
      query = query.eq('request_type', filters.requestType)
    }

    const { data: requests, error } = await query
    if (error) this.handleError(error)

    if (!requests || requests.length === 0) return []

    // Get unique requester IDs
    const requesterIds = [
      ...new Set(requests.map((r) => r.requester_id).filter(Boolean)),
    ] as string[]

    // Batch fetch requesters
    let usersMap: Record<string, { name: string; email: string }> = {}
    if (requesterIds.length > 0) {
      const { data: users } = await this.supabase
        .from('users_user')
        .select('id, email, first_name, last_name')
        .in('id', requesterIds)

      usersMap = (users || []).reduce(
        (acc, u) => {
          acc[u.id] = {
            name:
              `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
            email: u.email,
          }
          return acc
        },
        {} as Record<string, { name: string; email: string }>
      )
    }

    // Get company info from employers
    const { data: employers } = await this.supabase
      .from('company_employer')
      .select(
        'user_id, company_id, company:company_company(legal_name, display_name)'
      )
      .in('user_id', requesterIds)

    const companyMap: Record<string, { id: string; name: string }> = {}
    employers?.forEach((e) => {
      if (e.user_id && e.company_id && e.company) {
        const company = e.company as unknown as { legal_name: string; display_name: string | null }
        companyMap[e.user_id] = {
          id: e.company_id,
          name: company.display_name || company.legal_name,
        }
      }
    })

    // Transform results
    let results: RequestWithDetails[] = requests.map((req) => {
      const requestType = (req.request_type || 'leave') as RequestType
      const category = REQUEST_TYPE_CATEGORY[requestType] || 'special'
      const user = req.requester_id ? usersMap[req.requester_id] : null
      const company = req.requester_id ? companyMap[req.requester_id] : null

      return {
        id: req.id,
        requestType,
        category,
        status: (req.status || 'pending') as RequestStatus,
        requesterId: req.requester_id || '',
        requesterName: user?.name || 'Unknown',
        requesterEmail: user?.email || '',
        companyId: company?.id || '',
        companyName: company?.name || 'Unknown Company',
        details: this.formatRequestDetails(req),
        assignedToId: req.assigned_to_id || undefined,
        assignedToName: undefined,
        createdAt: req.created_at || new Date().toISOString(),
        updatedAt: req.updated_at || new Date().toISOString(),
        remarks: req.remarks || undefined,
      }
    })

    // Filter by category if specified
    if (filters?.category) {
      results = results.filter((r) => r.category === filters.category)
    }

    // Filter by search if specified
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      results = results.filter(
        (r) =>
          r.requesterName.toLowerCase().includes(search) ||
          r.companyName.toLowerCase().includes(search) ||
          r.id.toLowerCase().includes(search)
      )
    }

    return results
  }

  async getRequestById(id: string): Promise<RequestWithDetails | null> {
    const { data: req, error } = await this.supabase
      .from('request_request')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    // Fetch requester info
    let user: { id: string; email: string; first_name: string | null; last_name: string | null } | null = null
    if (req.requester_id) {
      const { data } = await this.supabase
        .from('users_user')
        .select('id, email, first_name, last_name')
        .eq('id', req.requester_id)
        .single()
      user = data
    }

    // Fetch company info
    let companyId = ''
    let companyName = 'Unknown'
    if (req.requester_id) {
      const { data } = await this.supabase
        .from('company_employer')
        .select('company_id, company:company_company(legal_name, display_name)')
        .eq('user_id', req.requester_id)
        .single()
      if (data?.company_id) {
        companyId = data.company_id
        const companyData = data.company as unknown as { legal_name: string; display_name: string | null } | null
        companyName = companyData?.display_name || companyData?.legal_name || 'Unknown'
      }
    }

    const requestType = (req.request_type || 'leave') as RequestType
    const category = REQUEST_TYPE_CATEGORY[requestType] || 'special'

    return {
      id: req.id,
      requestType,
      category,
      status: (req.status || 'pending') as RequestStatus,
      requesterId: req.requester_id || '',
      requesterName: user
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
          user.email
        : 'Unknown',
      requesterEmail: user?.email || '',
      companyId,
      companyName,
      details: this.formatRequestDetails(req),
      assignedToId: req.assigned_to_id || undefined,
      createdAt: req.created_at || new Date().toISOString(),
      updatedAt: req.updated_at || new Date().toISOString(),
      remarks: req.remarks || undefined,
    }
  }

  async getCounts(): Promise<RequestCounts> {
    // Get status counts
    const { data: requests, error } = await this.supabase
      .from('request_request')
      .select('status, request_type')

    if (error) this.handleError(error)

    const counts: RequestCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      withdrawn: 0,
      byCategory: { employer: 0, employee: 0, special: 0 },
    }

    requests?.forEach((req) => {
      // Count by status
      if (req.status === 'pending') counts.pending++
      else if (req.status === 'approved') counts.approved++
      else if (req.status === 'rejected') counts.rejected++
      else if (req.status === 'withdrawn') counts.withdrawn++

      // Count by category (pending only)
      if (req.status === 'pending') {
        const category =
          REQUEST_TYPE_CATEGORY[req.request_type || ''] || 'special'
        counts.byCategory[category]++
      }
    })

    return counts
  }

  async approve(requestId: string, remarks?: string): Promise<void> {
    const { error } = await this.supabase
      .from('request_request')
      .update({
        status: 'approved',
        remarks: remarks || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) this.handleError(error)
  }

  async reject(requestId: string, remarks: string): Promise<void> {
    const { error } = await this.supabase
      .from('request_request')
      .update({
        status: 'rejected',
        remarks,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) this.handleError(error)
  }

  async assignTo(requestId: string, assigneeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('request_request')
      .update({
        assigned_to_id: assigneeId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) this.handleError(error)
  }

  private formatRequestDetails(req: {
    request_type: string | null
    reference_type: string | null
    reference_id: string | null
  }): string {
    // Format details based on request type
    switch (req.request_type) {
      case 'leave':
        return req.reference_id || 'Leave request'
      case 'expense':
        return 'Expense claim'
      case 'equipment_purchase':
        return 'Equipment purchase request'
      case 'equipment_collect':
        return 'Equipment collection request'
      case 'termination':
        return 'Termination request'
      case 'send_gifts':
        return 'Gift request'
      case 'resignation':
        return 'Resignation request'
      case 'payroll_query':
        return 'Payroll query'
      case 'employment_letter':
        return 'Employment letter request'
      case 'travel_letter':
        return 'Travel letter request'
      default:
        return req.reference_type || req.request_type || 'Request'
    }
  }
}

export const superadminRequestsService = new SuperAdminRequestsServiceClass()
