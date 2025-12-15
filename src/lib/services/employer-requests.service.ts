import { BaseService } from './base.service'

// Unified request type for employer requests view
export interface EmployerRequest {
  id: string
  company_id: string
  requester_id: string
  request_type: string
  title: string
  description: string
  request_data: Record<string, unknown>
  status: string
  assigned_to: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Enriched fields
  requester_name: string
}

export interface EmployerRequestFilters {
  status?: 'all' | 'pending' | 'approved' | 'rejected' | 'withdrawn'
  type?: string
  search?: string
  startDate?: string
  endDate?: string
}

export interface EmployerRequestCounts {
  total: number
  pending: number
  approved: number
  rejected: number
  withdrawn: number
}

export interface CreateSpecialRequestInput {
  companyId: string
  requesterId: string
  requesterName?: string
  requestType: string
  title: string
  description?: string
  requestData: Record<string, unknown>
  referenceType?: string
  referenceId?: string
  priority?: 'low' | 'normal' | 'high' | 'critical'
}

class EmployerRequestsServiceClass extends BaseService {
  /**
   * Get all requests for a company (leaves, expenses, and special requests)
   */
  async getRequests(
    companyId: string,
    filters?: EmployerRequestFilters
  ): Promise<EmployerRequest[]> {
    if (!companyId) return []

    // Get employee IDs for this company
    const { data: contracts } = await this.supabase
      .from('employee_employeecontract')
      .select('employee_id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    const employeeIds = (contracts?.map((c) => c.employee_id).filter((id): id is string => id !== null) || [])

    // Parallel fetch all request types
    const [leaveRequests, expenseRequests, specialRequests, employees] = await Promise.all([
      this.fetchLeaveRequests(employeeIds, filters),
      this.fetchExpenseRequests(employeeIds, filters),
      this.fetchSpecialRequests(companyId, filters),
      this.fetchEmployeeNames(employeeIds),
    ])

    // Combine all requests
    const allRequests: EmployerRequest[] = [
      ...leaveRequests.map((lr) => this.transformLeaveRequest(lr, employees, companyId)),
      ...expenseRequests.map((er) => this.transformExpenseRequest(er, employees, companyId)),
      ...specialRequests.map((sr) => this.transformSpecialRequest(sr, employees)),
    ]

    // Sort by created_at descending
    allRequests.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Apply search filter
    if (filters?.search) {
      const query = filters.search.toLowerCase()
      return allRequests.filter((req) =>
        req.id.toLowerCase().includes(query) ||
        req.title.toLowerCase().includes(query) ||
        req.requester_name.toLowerCase().includes(query)
      )
    }

    return allRequests
  }

  /**
   * Get request counts for a company
   */
  async getCounts(companyId: string): Promise<EmployerRequestCounts> {
    const requests = await this.getRequests(companyId)

    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === 'pending').length,
      approved: requests.filter((r) => ['approved', 'completed'].includes(r.status)).length,
      rejected: requests.filter((r) => r.status === 'rejected').length,
      withdrawn: requests.filter((r) => ['withdrawn', 'cancelled'].includes(r.status)).length,
    }
  }

  /**
   * Approve a request
   */
  async approveRequest(
    requestId: string,
    requestType: string,
    approverId: string,
    remarks?: string
  ): Promise<void> {
    const now = new Date().toISOString()

    switch (requestType) {
      case 'leave':
        await this.supabase
          .from('leave_leaverequest')
          .update({
            status: 'approved',
            approved_by_id: approverId,
            approved_at: now,
            rejection_reason: remarks || null,
          })
          .eq('id', requestId)
        break

      case 'expense':
      case 'expense_claim':
        await this.supabase
          .from('expense_expenseclaim')
          .update({
            status: 'approved',
            approved_by_id: approverId,
            approved_at: now,
          })
          .eq('id', requestId)
        break

      default:
        // Special requests go to request_request table
        await this.supabase
          .from('request_request')
          .update({
            status: 'approved',
            remarks: remarks || null,
            updated_at: now,
          })
          .eq('id', requestId)
    }
  }

  /**
   * Reject a request
   */
  async rejectRequest(
    requestId: string,
    requestType: string,
    approverId: string,
    remarks: string
  ): Promise<void> {
    const now = new Date().toISOString()

    switch (requestType) {
      case 'leave':
        await this.supabase
          .from('leave_leaverequest')
          .update({
            status: 'rejected',
            approved_by_id: approverId,
            approved_at: now,
            rejection_reason: remarks,
          })
          .eq('id', requestId)
        break

      case 'expense':
      case 'expense_claim':
        await this.supabase
          .from('expense_expenseclaim')
          .update({
            status: 'rejected',
            approved_by_id: approverId,
            approved_at: now,
            rejection_reason: remarks,
          })
          .eq('id', requestId)
        break

      default:
        // Special requests go to request_request table
        await this.supabase
          .from('request_request')
          .update({
            status: 'rejected',
            remarks,
            updated_at: now,
          })
          .eq('id', requestId)
    }
  }

  /**
   * Withdraw a request
   */
  async withdrawRequest(requestId: string, requestType: string): Promise<void> {
    const now = new Date().toISOString()

    switch (requestType) {
      case 'leave':
        await this.supabase
          .from('leave_leaverequest')
          .update({ status: 'withdrawn' })
          .eq('id', requestId)
        break

      case 'expense':
      case 'expense_claim':
        await this.supabase
          .from('expense_expenseclaim')
          .update({ status: 'withdrawn' })
          .eq('id', requestId)
        break

      default:
        await this.supabase
          .from('request_request')
          .update({ status: 'withdrawn', updated_at: now })
          .eq('id', requestId)
    }
  }

  /**
   * Create a new special request (equipment, gift, salary amendment, etc.)
   */
  async createSpecialRequest(input: CreateSpecialRequestInput): Promise<EmployerRequest> {
    const { data, error } = await this.supabase
      .from('request_request')
      .insert({
        requester_id: input.requesterId ?? null,
        request_type: input.requestType,
        remarks: input.title,
        reference_type: input.referenceType || 'general',
        reference_id: input.referenceId ?? null,
        priority: input.priority || 'medium',
        status: 'pending',
      })
      .select()
      .single()

    if (error) this.handleError(error)

    return {
      id: data.id,
      company_id: input.companyId,
      requester_id: input.requesterId,
      request_type: input.requestType,
      title: input.title,
      description: input.description || '',
      request_data: input.requestData,
      status: 'pending',
      assigned_to: null,
      notes: null,
      created_at: data.created_at ?? new Date().toISOString(),
      updated_at: data.updated_at ?? data.created_at ?? new Date().toISOString(),
      requester_name: input.requesterName || 'Unknown',
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async fetchLeaveRequests(
    employeeIds: string[],
    filters?: EmployerRequestFilters
  ) {
    if (employeeIds.length === 0) return []

    let query = this.supabase
      .from('leave_leaverequest')
      .select('*')
      .in('employee_id', employeeIds)
      .order('created_at', { ascending: false })

    // Apply status filter
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    // Apply date filter
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate)
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    const { data } = await query
    return data || []
  }

  private async fetchExpenseRequests(
    employeeIds: string[],
    filters?: EmployerRequestFilters
  ) {
    if (employeeIds.length === 0) return []

    let query = this.supabase
      .from('expense_expenseclaim')
      .select('*')
      .in('employee_id', employeeIds)
      .order('created_at', { ascending: false })

    // Apply status filter
    if (filters?.status && filters.status !== 'all') {
      const status = filters.status === 'approved' ? ['approved', 'completed'] : [filters.status]
      query = query.in('status', status)
    }

    // Apply date filter
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate)
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    const { data } = await query
    return data || []
  }

  private async fetchSpecialRequests(
    companyId: string,
    filters?: EmployerRequestFilters
  ) {
    // Get employer user IDs for this company
    const { data: employers } = await this.supabase
      .from('company_employer')
      .select('user_id')
      .eq('company_id', companyId)

    const employerIds = employers?.map((e) => e.user_id).filter(Boolean) || []
    if (employerIds.length === 0) return []

    let query = this.supabase
      .from('request_request')
      .select('*')
      .in('requester_id', employerIds)
      .order('created_at', { ascending: false })

    // Apply status filter
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    // Apply date filter
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate)
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    const { data } = await query
    return data || []
  }

  private async fetchEmployeeNames(
    employeeIds: string[]
  ): Promise<Record<string, string>> {
    if (employeeIds.length === 0) return {}

    const { data: employees } = await this.supabase
      .from('employee_employee')
      .select('id, full_name')
      .in('id', employeeIds)

    return (employees || []).reduce(
      (acc, e) => {
        acc[e.id] = e.full_name || 'Unknown'
        return acc
      },
      {} as Record<string, string>
    )
  }

  private transformLeaveRequest(
    lr: Record<string, unknown>,
    employees: Record<string, string>,
    companyId: string
  ): EmployerRequest {
    // Safe type coercion with validation
    const employeeId = typeof lr.employee_id === 'string' ? lr.employee_id : ''
    const id = typeof lr.id === 'string' ? lr.id : ''
    const status = typeof lr.status === 'string' ? lr.status : 'pending'
    const createdAt = typeof lr.created_at === 'string' ? lr.created_at : new Date().toISOString()
    const updatedAt = typeof lr.updated_at === 'string' ? lr.updated_at : createdAt

    return {
      id,
      company_id: companyId,
      requester_id: employeeId,
      request_type: 'leave',
      title: `${lr.leave_type || 'Leave'} Leave`,
      description: `${lr.total_days || 1} days - ${lr.reason || 'No reason provided'}`,
      request_data: {
        start_date: lr.start_date,
        end_date: lr.end_date,
        days_count: lr.total_days,
        leave_type: lr.leave_type,
        reason: lr.reason,
      },
      status,
      assigned_to: typeof lr.approved_by_id === 'string' ? lr.approved_by_id : null,
      notes: typeof lr.rejection_reason === 'string' ? lr.rejection_reason : null,
      created_at: createdAt,
      updated_at: updatedAt,
      requester_name: employees[employeeId] || 'Unknown Employee',
    }
  }

  private transformExpenseRequest(
    er: Record<string, unknown>,
    employees: Record<string, string>,
    companyId: string
  ): EmployerRequest {
    // Safe type coercion with validation
    const employeeId = typeof er.employee_id === 'string' ? er.employee_id : ''
    const id = typeof er.id === 'string' ? er.id : ''
    const rawAmount = er.amount
    const amount = typeof rawAmount === 'number' ? rawAmount : (typeof rawAmount === 'string' ? parseFloat(rawAmount) || 0 : 0)
    const category = typeof er.category === 'string' ? er.category : 'General'
    const status = typeof er.status === 'string' ? er.status : 'pending'
    const createdAt = typeof er.created_at === 'string' ? er.created_at : new Date().toISOString()
    const updatedAt = typeof er.updated_at === 'string' ? er.updated_at : createdAt

    return {
      id,
      company_id: companyId,
      requester_id: employeeId,
      request_type: 'expense',
      title: 'Expense Claim',
      description: `INR ${amount.toLocaleString('en-IN')} - ${category}`,
      request_data: {
        amount,
        category,
        description: er.description,
        receipt_url: er.receipt_url,
      },
      status: status === 'completed' ? 'approved' : status,
      assigned_to: typeof er.approved_by_id === 'string' ? er.approved_by_id : null,
      notes: typeof er.rejection_reason === 'string' ? er.rejection_reason : null,
      created_at: createdAt,
      updated_at: updatedAt,
      requester_name: employees[employeeId] || 'Unknown Employee',
    }
  }

  private transformSpecialRequest(
    sr: Record<string, unknown>,
    employees: Record<string, string>
  ): EmployerRequest {
    // Safe type coercion with validation
    const requesterId = typeof sr.requester_id === 'string' ? sr.requester_id : ''
    const id = typeof sr.id === 'string' ? sr.id : ''
    const requestType = typeof sr.request_type === 'string' ? sr.request_type : 'special'
    const remarks = typeof sr.remarks === 'string' ? sr.remarks : 'Special request'
    const status = typeof sr.status === 'string' ? sr.status : 'pending'
    const createdAt = typeof sr.created_at === 'string' ? sr.created_at : new Date().toISOString()
    const updatedAt = typeof sr.updated_at === 'string' ? sr.updated_at : createdAt

    return {
      id,
      company_id: '', // Company not stored directly in request_request
      requester_id: requesterId,
      request_type: requestType,
      title: this.formatRequestTitle(requestType),
      description: remarks,
      request_data: {
        reference_type: sr.reference_type,
        reference_id: sr.reference_id,
        priority: sr.priority,
      },
      status,
      assigned_to: typeof sr.assigned_to_id === 'string' ? sr.assigned_to_id : null,
      notes: remarks !== 'Special request' ? remarks : null,
      created_at: createdAt,
      updated_at: updatedAt,
      requester_name: employees[requesterId] || 'Unknown',
    }
  }

  private formatRequestTitle(requestType: string): string {
    const titles: Record<string, string> = {
      send_gifts: 'Send Gifts',
      gift: 'Send Gifts',
      purchase_equipment: 'Purchase Equipment',
      equipment: 'Purchase Equipment',
      collect_equipment: 'Collect Equipment',
      termination: 'Termination Request',
      cancellation_of_hiring: 'Cancellation of Hiring',
      extension_of_probation: 'Extension of Probation',
      probation_extension: 'Extension of Probation',
      confirmation_of_probation: 'Confirmation of Probation',
      incentive_payment: 'Incentive Payment',
      salary_amendment: 'Salary Amendment',
      contract_amendment: 'Contract Amendment',
      office_space: 'Office Space Request',
      resignation: 'Resignation',
    }
    return titles[requestType] || requestType?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Request'
  }
}

export const employerRequestsService = new EmployerRequestsServiceClass()
