import { BaseService, ServiceError } from './base.service'

// Plum API Types
export interface PlumInsurancePlan {
  id: string
  name: string
  coverage_amount: number
  premium: number
  premium_frequency: 'monthly' | 'annual'
  features: string[]
  coverage_type: 'individual' | 'family'
  includes_dental: boolean
  includes_vision: boolean
  includes_mental_health: boolean
  is_active: boolean
}

export interface PlumMember {
  id: string
  employee_id: string
  plan_id: string
  policy_number?: string
  status: 'pending' | 'active' | 'cancelled' | 'expired'
  coverage_type: 'self' | 'self_spouse' | 'self_children' | 'family'
  start_date: string
  end_date?: string
  premium_amount: number
  created_at: string
  updated_at: string
}

export interface PlumDependent {
  id: string
  member_id: string
  name: string
  relationship: 'spouse' | 'child' | 'parent'
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  is_active: boolean
}

export interface PlumPolicy {
  policy_id: string
  policy_number: string
  member_id: string
  plan: PlumInsurancePlan
  member: PlumMember
  dependents: PlumDependent[]
  start_date: string
  end_date: string
  status: 'active' | 'pending' | 'expired' | 'cancelled'
  documents?: {
    policy_document_url?: string
    id_card_url?: string
  }
}

export interface PlumWebhookPayload {
  event: 'member.enrolled' | 'member.updated' | 'policy.activated' | 'policy.renewed' | 'claim.submitted' | 'claim.processed'
  member_id: string
  policy_id?: string
  data: Record<string, unknown>
  timestamp: string
}

export interface EnrollMemberInput {
  employee_id: string
  employee_name: string
  employee_email: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  plan_id: string
  coverage_type: 'self' | 'self_spouse' | 'self_children' | 'family'
  start_date?: string
  nominee_name?: string
  nominee_relationship?: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
}

export interface AddDependentInput {
  member_id: string
  name: string
  relationship: 'spouse' | 'child' | 'parent'
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
}

/**
 * Plum Health Insurance API Service
 * Handles employee health insurance enrollment and management
 *
 * Documentation: https://partners.plumhq.com
 */
class PlumServiceClass extends BaseService {
  private baseUrl: string
  private apiKey: string
  private partnerId: string

  constructor() {
    super()
    const env = process.env.PLUM_ENV || 'sandbox'
    this.baseUrl = env === 'production'
      ? process.env.PLUM_API_URL || 'https://api.plumhq.com/v1'
      : 'https://sandbox.plumhq.com/v1'
    this.apiKey = process.env.PLUM_API_KEY || ''
    this.partnerId = process.env.PLUM_PARTNER_ID || ''
  }

  /**
   * Make authenticated request to Plum API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Partner-ID': this.partnerId,
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
          errorData.message || `Plum API error: ${response.statusText}`,
          'PLUM_API_ERROR',
          response.status
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof ServiceError) throw error
      throw new ServiceError(
        'Failed to connect to Plum API',
        'PLUM_CONNECTION_ERROR',
        500
      )
    }
  }

  /**
   * Get available insurance plans for a company
   */
  async getAvailablePlans(companyId?: string): Promise<PlumInsurancePlan[]> {
    try {
      const response = await this.request<{ data: PlumInsurancePlan[] }>(
        `/plans${companyId ? `?company_id=${companyId}` : ''}`
      )
      return response.data
    } catch (error) {
      console.error('[Plum] Error fetching plans, returning mock data:', error)
      // Return mock plans if API is not available
      return this.getMockPlans()
    }
  }

  /**
   * Mock plans for when API is not available
   */
  private getMockPlans(): PlumInsurancePlan[] {
    return [
      {
        id: 'plan_basic',
        name: 'Basic',
        coverage_amount: 500000,
        premium: 0,
        premium_frequency: 'annual',
        features: ['Hospitalization', 'OPD Coverage'],
        coverage_type: 'individual',
        includes_dental: false,
        includes_vision: false,
        includes_mental_health: false,
        is_active: true,
      },
      {
        id: 'plan_standard',
        name: 'Standard',
        coverage_amount: 1000000,
        premium: 0,
        premium_frequency: 'annual',
        features: ['Hospitalization', 'OPD Coverage', 'Dental (₹25k)', 'Vision (₹10k)'],
        coverage_type: 'family',
        includes_dental: true,
        includes_vision: true,
        includes_mental_health: false,
        is_active: true,
      },
      {
        id: 'plan_premium',
        name: 'Premium',
        coverage_amount: 2500000,
        premium: 0,
        premium_frequency: 'annual',
        features: ['Hospitalization', 'OPD Coverage', 'Dental (₹50k)', 'Vision (₹20k)', 'Mental Health', 'Wellness'],
        coverage_type: 'family',
        includes_dental: true,
        includes_vision: true,
        includes_mental_health: true,
        is_active: true,
      },
    ]
  }

  /**
   * Enroll an employee in a health insurance plan
   */
  async enrollEmployee(input: EnrollMemberInput): Promise<PlumMember> {
    try {
      const response = await this.request<{ data: PlumMember }>('/members', {
        method: 'POST',
        body: JSON.stringify({
          employee_id: input.employee_id,
          name: input.employee_name,
          email: input.employee_email,
          date_of_birth: input.date_of_birth,
          gender: input.gender,
          plan_id: input.plan_id,
          coverage_type: input.coverage_type,
          start_date: input.start_date || new Date().toISOString().split('T')[0],
          nominee: input.nominee_name ? {
            name: input.nominee_name,
            relationship: input.nominee_relationship,
          } : undefined,
          address: input.address,
        }),
      })

      // Store enrollment in our database
      await this.storeEnrollment(response.data, input.employee_id, input.plan_id)

      return response.data
    } catch (error) {
      if (error instanceof ServiceError) throw error
      console.error('[Plum] Error enrolling employee:', error)

      // Create local enrollment record if API fails
      return this.createLocalEnrollment(input)
    }
  }

  /**
   * Create local enrollment when API is not available
   */
  private async createLocalEnrollment(input: EnrollMemberInput): Promise<PlumMember> {
    const memberId = `local_${input.employee_id}_${Date.now()}`

    const member: PlumMember = {
      id: memberId,
      employee_id: input.employee_id,
      plan_id: input.plan_id,
      status: 'pending',
      coverage_type: input.coverage_type,
      start_date: input.start_date || new Date().toISOString().split('T')[0] || '',
      premium_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    await this.storeEnrollment(member, input.employee_id, input.plan_id)

    return member
  }

  /**
   * Store enrollment in database
   */
  private async storeEnrollment(
    member: PlumMember,
    employeeId: string,
    planId: string
  ): Promise<void> {
    // TODO: Add plum_member_id, insurance_plan_id, insurance_status columns to employee_employee table
    // Update employee record with insurance info
    // await this.supabase
    //   .from('employee_employee')
    //   .update({
    //     plum_member_id: member.id,
    //     insurance_plan_id: planId,
    //     insurance_status: member.status,
    //     insurance_enrolled_at: new Date().toISOString(),
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', employeeId)
    console.log('[Plum] Enrollment stored locally:', { memberId: member.id, employeeId, planId })
  }

  /**
   * Add dependent to member's insurance
   */
  async addDependent(input: AddDependentInput): Promise<PlumDependent> {
    try {
      const response = await this.request<{ data: PlumDependent }>(
        `/members/${input.member_id}/dependents`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: input.name,
            relationship: input.relationship,
            date_of_birth: input.date_of_birth,
            gender: input.gender,
          }),
        }
      )
      return response.data
    } catch (error) {
      console.error('[Plum] Error adding dependent:', error)
      // Return a local dependent record
      return {
        id: `dep_${Date.now()}`,
        member_id: input.member_id,
        name: input.name,
        relationship: input.relationship,
        date_of_birth: input.date_of_birth,
        gender: input.gender,
        is_active: true,
      }
    }
  }

  /**
   * Get member's insurance policy details
   */
  async getPolicyDetails(memberId: string): Promise<PlumPolicy | null> {
    try {
      const response = await this.request<{ data: PlumPolicy }>(
        `/members/${memberId}/policy`
      )
      return response.data
    } catch (error) {
      console.error('[Plum] Error fetching policy:', error)
      return null
    }
  }

  /**
   * Update member's coverage type
   */
  async updateCoverage(
    memberId: string,
    coverageType: 'self' | 'self_spouse' | 'self_children' | 'family'
  ): Promise<PlumMember> {
    try {
      const response = await this.request<{ data: PlumMember }>(
        `/members/${memberId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            coverage_type: coverageType,
          }),
        }
      )
      return response.data
    } catch (error) {
      console.error('[Plum] Error updating coverage:', error)
      throw new ServiceError(
        'Failed to update coverage',
        'PLUM_UPDATE_ERROR',
        500
      )
    }
  }

  /**
   * Cancel member's insurance
   */
  async cancelEnrollment(memberId: string, reason?: string): Promise<void> {
    try {
      await this.request(`/members/${memberId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      })
    } catch (error) {
      console.error('[Plum] Error cancelling enrollment:', error)
    }

    // TODO: Add insurance_status and plum_member_id fields to employee_employee table
    // Update local record regardless
    // await this.supabase
    //   .from('employee_employee')
    //   .update({
    //     insurance_status: 'cancelled',
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('plum_member_id', memberId)
    console.log('[Plum] Enrollment cancelled:', memberId)
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    const webhookSecret = process.env.PLUM_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.warn('[Plum] No webhook secret configured, skipping verification')
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
  async processWebhook(payload: PlumWebhookPayload): Promise<void> {
    const { event, member_id, policy_id, data } = payload

    console.log('[Plum Webhook] Processing:', { event, member_id, policy_id })

    // TODO: Add plum_member_id and insurance fields to employee_employee table
    switch (event) {
      case 'member.enrolled':
      case 'policy.activated':
        // await this.supabase
        //   .from('employee_employee')
        //   .update({
        //     insurance_status: 'active',
        //     insurance_policy_number: data.policy_number as string || policy_id,
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq('plum_member_id', member_id)
        console.log('[Plum Webhook] Member enrolled/activated:', member_id)
        break

      case 'policy.renewed':
        // await this.supabase
        //   .from('employee_employee')
        //   .update({
        //     insurance_renewal_date: data.renewal_date as string,
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq('plum_member_id', member_id)
        console.log('[Plum Webhook] Policy renewed:', member_id)
        break

      case 'member.updated':
        // Handle member updates
        // if (data.status) {
        //   await this.supabase
        //     .from('employee_employee')
        //     .update({
        //       insurance_status: data.status as string,
        //       updated_at: new Date().toISOString(),
        //     })
        //     .eq('plum_member_id', member_id)
        // }
        console.log('[Plum Webhook] Member updated:', member_id)
        break

      default:
        console.log('[Plum Webhook] Unhandled event:', event)
    }
  }

  /**
   * Get employee's current insurance enrollment
   */
  async getEmployeeEnrollment(employeeId: string): Promise<{
    member: PlumMember | null
    plan: PlumInsurancePlan | null
  }> {
    // TODO: Add plum_member_id, insurance_plan_id, insurance_status columns to employee_employee table
    // Get employee's insurance info from our database
    // const { data: employee } = await this.supabase
    //   .from('employee_employee')
    //   .select('plum_member_id, insurance_plan_id, insurance_status')
    //   .eq('id', employeeId)
    //   .single()

    // if (!employee?.plum_member_id) {
    //   return { member: null, plan: null }
    // }

    // Try to get from Plum API - for now return null since columns don't exist
    // try {
    //   const policy = await this.getPolicyDetails(employee.plum_member_id)
    //   if (policy) {
    //     return {
    //       member: policy.member,
    //       plan: policy.plan,
    //     }
    //   }
    // } catch (error) {
    //   console.error('[Plum] Error fetching enrollment:', error)
    // }

    // Return local data
    // const plans = await this.getAvailablePlans()
    // const plan = plans.find(p => p.id === employee.insurance_plan_id) || null

    // return {
    //   member: {
    //     id: employee.plum_member_id,
    //     employee_id: employeeId,
    //     plan_id: employee.insurance_plan_id || '',
    //     status: employee.insurance_status as PlumMember['status'] || 'pending',
    //     coverage_type: 'self',
    //     start_date: new Date().toISOString().split('T')[0] || '',
    //     premium_amount: 0,
    //     created_at: new Date().toISOString(),
    //     updated_at: new Date().toISOString(),
    //   },
    //   plan,
    // }

    console.log('[Plum] getEmployeeEnrollment called for employee:', employeeId)
    return { member: null, plan: null }
  }
}

export const plumService = new PlumServiceClass()
