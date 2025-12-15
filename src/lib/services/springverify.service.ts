import { BaseService, ServiceError } from './base.service'
import type { Json } from '@/types/database.types'

// Springverify API Types
export type SpringverifyCheckType =
  | 'identity'
  | 'address'
  | 'education'
  | 'employment'
  | 'criminal'
  | 'aadhaar'
  | 'pan'
  | 'bank_account'

export type SpringverifyStatus =
  | 'pending'
  | 'in_progress'
  | 'verified'
  | 'failed'
  | 'rejected'

export interface SpringverifyCandidate {
  id: string
  name: string
  email: string
  phone?: string
  status: SpringverifyStatus
  created_at: string
  updated_at: string
}

export interface SpringverifyVerification {
  id: string
  candidate_id: string
  check_type: SpringverifyCheckType
  status: SpringverifyStatus
  result?: 'pass' | 'fail' | 'pending'
  data?: Record<string, unknown>
  completed_at?: string
  failed_reason?: string
}

export interface SpringverifyWebhookPayload {
  event: 'verification.completed' | 'verification.failed' | 'candidate.updated'
  candidate_id: string
  verification_id?: string
  check_type?: SpringverifyCheckType
  status: SpringverifyStatus
  result?: 'pass' | 'fail'
  data?: Record<string, unknown>
  timestamp: string
}

export interface CreateCandidateInput {
  name: string
  email: string
  phone?: string
  dob?: string
  employee_id?: string
  documents?: {
    type: string
    url: string
  }[]
}

export interface InitiateVerificationInput {
  candidate_id: string
  check_types: SpringverifyCheckType[]
  callback_url?: string
}

/**
 * Springverify API Service
 * Handles eKYC verification (Aadhaar, PAN, Bank) and Background Verification (BGV)
 *
 * Documentation: https://documenter.getpostman.com/view/3927563/2s8YswRX6z
 */
class SpringverifyServiceClass extends BaseService {
  private baseUrl: string
  private apiKey: string
  private secretKey: string

  constructor() {
    super()
    const env = process.env.SPRINGVERIFY_ENV || 'sandbox'
    this.baseUrl = env === 'production'
      ? process.env.SPRINGVERIFY_API_URL || 'https://api.springverify.com/v1'
      : process.env.SPRINGVERIFY_SANDBOX_URL || 'https://sandbox.springverify.com/v1'
    this.apiKey = process.env.SPRINGVERIFY_API_KEY || ''
    this.secretKey = process.env.SPRINGVERIFY_SECRET_KEY || ''
  }

  /**
   * Make authenticated request to Springverify API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-API-Key': this.apiKey,
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
          errorData.message || `Springverify API error: ${response.statusText}`,
          'SPRINGVERIFY_API_ERROR',
          response.status
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof ServiceError) throw error
      throw new ServiceError(
        'Failed to connect to Springverify API',
        'SPRINGVERIFY_CONNECTION_ERROR',
        500
      )
    }
  }

  /**
   * Create a candidate for verification
   */
  async createCandidate(input: CreateCandidateInput): Promise<SpringverifyCandidate> {
    const response = await this.request<{ data: SpringverifyCandidate }>('/candidates', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone,
        date_of_birth: input.dob,
        metadata: {
          employee_id: input.employee_id,
        },
        documents: input.documents,
      }),
    })

    return response.data
  }

  /**
   * Initiate verification checks for a candidate
   */
  async initiateVerification(
    input: InitiateVerificationInput
  ): Promise<SpringverifyVerification[]> {
    const webhookUrl = input.callback_url ||
      `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/springverify`

    const response = await this.request<{ data: SpringverifyVerification[] }>(
      `/candidates/${input.candidate_id}/verify`,
      {
        method: 'POST',
        body: JSON.stringify({
          checks: input.check_types,
          callback_url: webhookUrl,
        }),
      }
    )

    return response.data
  }

  /**
   * Get candidate details with verification status
   */
  async getCandidate(candidateId: string): Promise<SpringverifyCandidate> {
    const response = await this.request<{ data: SpringverifyCandidate }>(
      `/candidates/${candidateId}`
    )
    return response.data
  }

  /**
   * Get verification status for a specific check
   */
  async getVerificationStatus(
    candidateId: string,
    verificationId: string
  ): Promise<SpringverifyVerification> {
    const response = await this.request<{ data: SpringverifyVerification }>(
      `/candidates/${candidateId}/verifications/${verificationId}`
    )
    return response.data
  }

  /**
   * Get all verifications for a candidate
   */
  async getCandidateVerifications(
    candidateId: string
  ): Promise<SpringverifyVerification[]> {
    const response = await this.request<{ data: SpringverifyVerification[] }>(
      `/candidates/${candidateId}/verifications`
    )
    return response.data
  }

  /**
   * Verify Aadhaar using OTP
   */
  async initiateAadhaarVerification(
    candidateId: string,
    aadhaarNumber: string
  ): Promise<{ request_id: string; message: string }> {
    const response = await this.request<{ data: { request_id: string; message: string } }>(
      `/candidates/${candidateId}/verify/aadhaar/initiate`,
      {
        method: 'POST',
        body: JSON.stringify({
          aadhaar_number: aadhaarNumber,
        }),
      }
    )
    return response.data
  }

  /**
   * Complete Aadhaar verification with OTP
   */
  async completeAadhaarVerification(
    candidateId: string,
    requestId: string,
    otp: string
  ): Promise<SpringverifyVerification> {
    const response = await this.request<{ data: SpringverifyVerification }>(
      `/candidates/${candidateId}/verify/aadhaar/complete`,
      {
        method: 'POST',
        body: JSON.stringify({
          request_id: requestId,
          otp,
        }),
      }
    )
    return response.data
  }

  /**
   * Verify PAN card
   */
  async verifyPAN(
    candidateId: string,
    panNumber: string,
    name: string,
    dob?: string
  ): Promise<SpringverifyVerification> {
    const response = await this.request<{ data: SpringverifyVerification }>(
      `/candidates/${candidateId}/verify/pan`,
      {
        method: 'POST',
        body: JSON.stringify({
          pan_number: panNumber,
          name,
          date_of_birth: dob,
        }),
      }
    )
    return response.data
  }

  /**
   * Verify bank account
   */
  async verifyBankAccount(
    candidateId: string,
    accountNumber: string,
    ifscCode: string,
    accountHolderName: string
  ): Promise<SpringverifyVerification> {
    const response = await this.request<{ data: SpringverifyVerification }>(
      `/candidates/${candidateId}/verify/bank`,
      {
        method: 'POST',
        body: JSON.stringify({
          account_number: accountNumber,
          ifsc_code: ifscCode,
          account_holder_name: accountHolderName,
        }),
      }
    )
    return response.data
  }

  /**
   * Initiate BGV (Background Verification) checks
   * Includes: identity, address, education, employment, criminal
   */
  async initiateBGV(
    candidateId: string,
    checkTypes: SpringverifyCheckType[] = ['identity', 'address', 'education', 'employment', 'criminal']
  ): Promise<SpringverifyVerification[]> {
    return this.initiateVerification({
      candidate_id: candidateId,
      check_types: checkTypes,
    })
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    if (!this.secretKey) {
      console.warn('[Springverify] No webhook secret configured, skipping signature verification')
      return true
    }

    // Implement HMAC signature verification
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', process.env.SPRINGVERIFY_WEBHOOK_SECRET || '')
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }

  /**
   * Process webhook payload and update database
   */
  async processWebhook(payload: SpringverifyWebhookPayload): Promise<void> {
    const { event, candidate_id, verification_id, check_type, status, result, data } = payload

    // Find the employee associated with this candidate
    const { data: verification, error: findError } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .select('*, employee_employee(*)')
      .eq('springverify_candidate_id', candidate_id)
      .single()

    if (findError && findError.code !== 'PGRST116') {
      console.error('[Springverify Webhook] Error finding verification:', findError)
      return
    }

    if (!verification) {
      console.warn('[Springverify Webhook] No verification found for candidate:', candidate_id)
      return
    }

    // Map Springverify status to our status
    const mappedStatus = this.mapStatus(status, result)

    // Update verification record
    const { error: updateError } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .update({
        status: mappedStatus,
        springverify_verification_id: verification_id,
        verification_data: (data as unknown as Json) ?? undefined,
        match_score: data?.match_score as number || null,
        extracted_data: (data?.extracted_data as unknown as Json) ?? undefined,
        verified_at: status === 'verified' ? new Date().toISOString() : null,
        failed_reason: status === 'failed' || status === 'rejected'
          ? (data?.reason as string) || 'Verification failed'
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', verification.id)

    if (updateError) {
      console.error('[Springverify Webhook] Error updating verification:', updateError)
      return
    }

    // If BGV check, update employee BGV status
    if (check_type && ['identity', 'address', 'education', 'employment', 'criminal'].includes(check_type)) {
      await this.updateEmployeeBGVStatus(verification.employee_id ?? '')
    }

    // If eKYC check, update employee KYC status
    if (check_type && ['aadhaar', 'pan', 'bank_account'].includes(check_type)) {
      await this.updateEmployeeKYCStatus(verification.employee_id ?? '')
    }
  }

  /**
   * Map Springverify status to our internal status
   */
  private mapStatus(
    status: SpringverifyStatus,
    result?: 'pass' | 'fail' | 'pending'
  ): 'pending' | 'in_progress' | 'verified' | 'failed' {
    if (status === 'verified' && result === 'pass') return 'verified'
    if (status === 'failed' || status === 'rejected' || result === 'fail') return 'failed'
    if (status === 'in_progress') return 'in_progress'
    return 'pending'
  }

  /**
   * Update employee's overall BGV status based on all BGV checks
   */
  private async updateEmployeeBGVStatus(employeeId: string): Promise<void> {
    // Get all BGV verifications for this employee
    const { data: verifications } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .select('status, verification_type')
      .eq('employee_id', employeeId)
      .in('verification_type', ['bgv_identity', 'bgv_address', 'bgv_education', 'bgv_employment', 'bgv_criminal'])

    if (!verifications || verifications.length === 0) return

    const allVerified = verifications.every(v => v.status === 'verified')
    const anyFailed = verifications.some(v => v.status === 'failed')
    const allCompleted = verifications.every(v => v.status === 'verified' || v.status === 'failed')

    let bgvStatus: string = 'in_progress'
    if (allVerified) bgvStatus = 'verified'
    else if (anyFailed && allCompleted) bgvStatus = 'failed'

    await this.supabase
      .from('employee_employee')
      .update({
        bgv_status: bgvStatus,
        bgv_completed_at: allCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', employeeId)
  }

  /**
   * Update employee's overall KYC status based on all KYC checks
   */
  private async updateEmployeeKYCStatus(employeeId: string): Promise<void> {
    // Get all KYC verifications for this employee
    const { data: verifications } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .select('status, verification_type')
      .eq('employee_id', employeeId)
      .in('verification_type', ['aadhaar', 'pan', 'bank_account'])

    if (!verifications || verifications.length === 0) return

    const allVerified = verifications.every(v => v.status === 'verified')
    const anyFailed = verifications.some(v => v.status === 'failed')

    let kycStatus: string = 'in_progress'
    if (allVerified) kycStatus = 'verified'
    else if (anyFailed) kycStatus = 'failed'

    await this.supabase
      .from('employee_employee')
      .update({
        kyc_status: kycStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', employeeId)
  }
}

export const springverifyService = new SpringverifyServiceClass()
