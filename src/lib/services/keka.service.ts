import { BaseService, ServiceError } from './base.service'

// Keka API Types
export interface KekaEmployee {
  id: string
  employeeNumber: string
  firstName: string
  middleName?: string
  lastName: string
  displayName: string
  email: string
  mobileNumber?: string
  gender?: 'Male' | 'Female' | 'Other'
  dateOfBirth?: string
  dateOfJoining?: string
  department?: {
    id: string
    name: string
  }
  jobTitle?: {
    id: string
    name: string
  }
  location?: {
    id: string
    name: string
  }
  manager?: {
    id: string
    name: string
    email: string
  }
  employmentStatus: 'Active' | 'Inactive' | 'OnNotice' | 'Terminated'
  employmentType?: 'FullTime' | 'PartTime' | 'Contract' | 'Intern'
}

export interface KekaCreateEmployeeInput {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  mobileNumber?: string
  gender?: 'Male' | 'Female' | 'Other'
  dateOfBirth?: string
  dateOfJoining: string
  departmentId?: string
  jobTitleId?: string
  locationId?: string
  managerId?: string
  employmentType?: 'FullTime' | 'PartTime' | 'Contract' | 'Intern'
}

export interface KekaSalaryComponent {
  id: string
  name: string
  type: 'Earning' | 'Deduction' | 'Reimbursement'
  isTaxable: boolean
  isActive: boolean
}

export interface KekaSalary {
  employeeId: string
  effectiveFrom: string
  annualCtc: number
  monthlyGross: number
  components: {
    componentId: string
    componentName: string
    monthlyAmount: number
    annualAmount: number
  }[]
}

export interface KekaLeaveType {
  id: string
  name: string
  code: string
  description?: string
  isPaidLeave: boolean
  isActive: boolean
}

export interface KekaLeaveBalance {
  leaveTypeId: string
  leaveTypeName: string
  available: number
  taken: number
  carryForward: number
  credited: number
}

export interface KekaLeaveRequest {
  id: string
  employeeId: string
  leaveTypeId: string
  leaveTypeName: string
  startDate: string
  endDate: string
  numberOfDays: number
  reason?: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
  appliedOn: string
  approvedBy?: string
  approvedOn?: string
}

export interface KekaCreateLeaveRequestInput {
  employeeId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  reason?: string
  isHalfDay?: boolean
  halfDayType?: 'FirstHalf' | 'SecondHalf'
}

export interface KekaWebhookPayload {
  event: string
  timestamp: string
  data: {
    employeeId?: string
    employee?: KekaEmployee
    leaveRequest?: KekaLeaveRequest
    [key: string]: unknown
  }
}

/**
 * Keka HRMS/Payroll API Service
 * Handles employee sync, payroll data, and leave management
 *
 * Documentation: https://developers.keka.com
 */
class KekaServiceClass extends BaseService {
  private baseUrl: string
  private clientId: string
  private clientSecret: string
  private apiKey: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    super()
    this.baseUrl = process.env.KEKA_API_URL || 'https://api.keka.com/api/v1'
    this.clientId = process.env.KEKA_CLIENT_ID || ''
    this.clientSecret = process.env.KEKA_CLIENT_SECRET || ''
    this.apiKey = process.env.KEKA_API_KEY || ''
  }

  /**
   * Get OAuth access token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if valid
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken
    }

    // If we have an API key, use that instead
    if (this.apiKey) {
      this.accessToken = this.apiKey
      this.tokenExpiry = Date.now() + 3600000 // 1 hour
      return this.apiKey
    }

    if (!this.clientId || !this.clientSecret) {
      throw new ServiceError(
        'Keka credentials not configured',
        'KEKA_AUTH_ERROR',
        401
      )
    }

    try {
      const response = await fetch(`${this.baseUrl}/connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'user-agent': 'Mozilla/5.0',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: 'kekaapi',
        }),
      })

      if (!response.ok) {
        throw new ServiceError(
          'Failed to authenticate with Keka',
          'KEKA_AUTH_ERROR',
          response.status
        )
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000)

      return this.accessToken!
    } catch (error) {
      if (error instanceof ServiceError) throw error
      throw new ServiceError(
        'Failed to authenticate with Keka',
        'KEKA_AUTH_ERROR',
        500
      )
    }
  }

  /**
   * Make authenticated request to Keka API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken()
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'user-agent': 'Mozilla/5.0',
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ServiceError(
          errorData.message || `Keka API error: ${response.statusText}`,
          'KEKA_API_ERROR',
          response.status
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof ServiceError) throw error
      throw new ServiceError(
        'Failed to connect to Keka API',
        'KEKA_CONNECTION_ERROR',
        500
      )
    }
  }

  /**
   * Get all employees from Keka
   */
  async getEmployees(params?: {
    page?: number
    pageSize?: number
    status?: 'Active' | 'Inactive' | 'All'
  }): Promise<{ data: KekaEmployee[]; totalCount: number }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString())
      if (params?.status) queryParams.set('employmentStatus', params.status)

      const query = queryParams.toString()
      const response = await this.request<{
        succeeded: boolean
        data: KekaEmployee[]
        totalCount: number
      }>(`/hris/employees${query ? `?${query}` : ''}`)

      return { data: response.data || [], totalCount: response.totalCount || 0 }
    } catch (error) {
      console.error('[Keka] Error fetching employees:', error)
      return { data: [], totalCount: 0 }
    }
  }

  /**
   * Get a single employee from Keka
   */
  async getEmployee(kekaEmployeeId: string): Promise<KekaEmployee | null> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: KekaEmployee
      }>(`/hris/employees/${kekaEmployeeId}`)

      return response.data || null
    } catch (error) {
      console.error('[Keka] Error fetching employee:', error)
      return null
    }
  }

  /**
   * Create an employee in Keka
   */
  async createEmployee(input: KekaCreateEmployeeInput): Promise<KekaEmployee | null> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: KekaEmployee
      }>('/hris/employees', {
        method: 'POST',
        body: JSON.stringify(input),
      })

      return response.data || null
    } catch (error) {
      console.error('[Keka] Error creating employee:', error)
      throw error
    }
  }

  /**
   * Update an employee in Keka
   */
  async updateEmployee(
    kekaEmployeeId: string,
    input: Partial<KekaCreateEmployeeInput>
  ): Promise<KekaEmployee | null> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: KekaEmployee
      }>(`/hris/employees/${kekaEmployeeId}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      })

      return response.data || null
    } catch (error) {
      console.error('[Keka] Error updating employee:', error)
      throw error
    }
  }

  /**
   * Sync local employee to Keka
   * NOTE: Requires keka_employee_id, keka_employee_number fields in employee_employee table
   * and user email/phone join
   */
  async syncEmployeeToKeka(employeeId: string): Promise<string | null> {
    // Get local employee data with user join for email
    const { data: employee } = await this.supabase
      .from('employee_employee')
      .select('*, users_user!employee_employee_user_id_fkey(email), employee_employeecontract!employee_employeecontract_employee_id_fkey(start_date)')
      .eq('id', employeeId)
      .single()

    if (!employee) {
      throw new ServiceError(
        'Employee not found',
        'EMPLOYEE_NOT_FOUND',
        404
      )
    }

    // Extract joined data
    const userRecord = employee.users_user as { email: string } | null
    const contractRecords = employee.employee_employeecontract as Array<{ start_date: string }> | null
    const contractRecord = Array.isArray(contractRecords) ? contractRecords[0] : contractRecords

    // Keka integration requires additional fields - skipping for now
    // TODO: Add keka_employee_id, keka_employee_number to employee_employee table
    // TODO: Add phone to employee or users_user table
    console.warn('Keka sync not fully implemented - missing required database fields')
    return null
  }

  /**
   * Map gender values
   */
  private mapGender(gender: string): 'Male' | 'Female' | 'Other' {
    const map: Record<string, 'Male' | 'Female' | 'Other'> = {
      male: 'Male',
      female: 'Female',
      other: 'Other',
    }
    return map[gender.toLowerCase()] || 'Other'
  }

  /**
   * Get salary components
   */
  async getSalaryComponents(): Promise<KekaSalaryComponent[]> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: KekaSalaryComponent[]
      }>('/payroll/salarycomponents')

      return response.data || []
    } catch (error) {
      console.error('[Keka] Error fetching salary components:', error)
      return []
    }
  }

  /**
   * Get employee salary information
   */
  async getEmployeeSalary(kekaEmployeeId: string): Promise<KekaSalary | null> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: KekaSalary
      }>(`/payroll/salaries/${kekaEmployeeId}`)

      return response.data || null
    } catch (error) {
      console.error('[Keka] Error fetching salary:', error)
      return null
    }
  }

  /**
   * Get leave types
   */
  async getLeaveTypes(): Promise<KekaLeaveType[]> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: KekaLeaveType[]
      }>('/time/leavetypes')

      return response.data || []
    } catch (error) {
      console.error('[Keka] Error fetching leave types:', error)
      return []
    }
  }

  /**
   * Get employee leave balance
   */
  async getLeaveBalance(kekaEmployeeId: string): Promise<KekaLeaveBalance[]> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: KekaLeaveBalance[]
      }>(`/time/leavebalance?employeeId=${kekaEmployeeId}`)

      return response.data || []
    } catch (error) {
      console.error('[Keka] Error fetching leave balance:', error)
      return []
    }
  }

  /**
   * Get employee leave requests
   */
  async getLeaveRequests(
    kekaEmployeeId: string,
    params?: { status?: string; startDate?: string; endDate?: string }
  ): Promise<KekaLeaveRequest[]> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.set('employeeId', kekaEmployeeId)
      if (params?.status) queryParams.set('status', params.status)
      if (params?.startDate) queryParams.set('startDate', params.startDate)
      if (params?.endDate) queryParams.set('endDate', params.endDate)

      const response = await this.request<{
        succeeded: boolean
        data: KekaLeaveRequest[]
      }>(`/time/leaverequests?${queryParams.toString()}`)

      return response.data || []
    } catch (error) {
      console.error('[Keka] Error fetching leave requests:', error)
      return []
    }
  }

  /**
   * Create a leave request
   */
  async createLeaveRequest(input: KekaCreateLeaveRequestInput): Promise<KekaLeaveRequest | null> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: KekaLeaveRequest
      }>('/time/leaverequests', {
        method: 'POST',
        body: JSON.stringify(input),
      })

      return response.data || null
    } catch (error) {
      console.error('[Keka] Error creating leave request:', error)
      throw error
    }
  }

  /**
   * Sync leave request to Keka
   * NOTE: Requires keka_leave_request_id field in leave_leaverequest table
   */
  async syncLeaveToKeka(leaveRequestId: string): Promise<string | null> {
    // Keka leave sync not fully implemented
    // TODO: Add keka_leave_request_id to leave_leaverequest table
    // TODO: Add keka_employee_id to employee_employee table
    console.warn('Keka leave sync not fully implemented - missing required database fields')
    return null
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    const webhookSecret = process.env.KEKA_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.warn('[Keka] No webhook secret configured, skipping verification')
      return true
    }

    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }

  /**
   * Process webhook payload
   */
  async processWebhook(payload: KekaWebhookPayload): Promise<void> {
    const { event, data } = payload

    console.log('[Keka Webhook] Processing:', { event })

    switch (event) {
      case 'employee.created':
      case 'employee.updated':
        if (data.employee) {
          // Sync Keka employee data back to our database
          await this.supabase
            .from('employee_employee')
            .update({
              keka_employee_number: data.employee.employeeNumber,
              keka_sync_status: 'synced',
              updated_at: new Date().toISOString(),
            })
            .eq('keka_employee_id', data.employee.id)
        }
        break

      case 'employee.terminated':
        if (data.employeeId) {
          await this.supabase
            .from('employee_employee')
            .update({
              employment_status: 'terminated',
              keka_sync_status: 'synced',
              updated_at: new Date().toISOString(),
            })
            .eq('keka_employee_id', data.employeeId)
        }
        break

      case 'leave.approved':
      case 'leave.rejected':
        if (data.leaveRequest) {
          // TODO: Add keka_leave_request_id field to leave_leaverequest table
          console.log('[Keka Webhook] Leave status updated:', event)
        }
        break

      case 'payroll.processed':
        // Handle payroll processing notification
        console.log('[Keka Webhook] Payroll processed:', data)
        break

      default:
        console.log('[Keka Webhook] Unhandled event:', event)
    }
  }

  /**
   * Get departments from Keka
   */
  async getDepartments(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: { id: string; name: string }[]
      }>('/hris/departments')

      return response.data || []
    } catch (error) {
      console.error('[Keka] Error fetching departments:', error)
      return []
    }
  }

  /**
   * Get job titles from Keka
   */
  async getJobTitles(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: { id: string; name: string }[]
      }>('/hris/jobtitles')

      return response.data || []
    } catch (error) {
      console.error('[Keka] Error fetching job titles:', error)
      return []
    }
  }

  /**
   * Get locations from Keka
   */
  async getLocations(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await this.request<{
        succeeded: boolean
        data: { id: string; name: string }[]
      }>('/hris/locations')

      return response.data || []
    } catch (error) {
      console.error('[Keka] Error fetching locations:', error)
      return []
    }
  }
}

export const kekaService = new KekaServiceClass()
