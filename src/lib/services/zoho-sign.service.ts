import { BaseService, ServiceError } from './base.service'

// Zoho Sign API Types
export type ZohoSignatureStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'signed'
  | 'completed'
  | 'declined'
  | 'expired'
  | 'recalled'

export interface ZohoSignRequest {
  request_id: string
  request_name: string
  request_status: ZohoSignatureStatus
  owner_email: string
  created_time: string
  modified_time: string
  expiration_days: number
  is_sequential: boolean
  actions: ZohoSignAction[]
  document_ids: string[]
}

export interface ZohoSignAction {
  action_id: string
  action_type: 'SIGN' | 'VIEW' | 'APPROVE' | 'INPERSONSIGN'
  action_status: ZohoSignatureStatus
  recipient_email: string
  recipient_name: string
  signing_order: number
  verify_recipient: boolean
  signed_time?: string
}

export interface ZohoSignDocument {
  document_id: string
  document_name: string
  document_order: number
  pages: number
}

export interface ZohoWebhookPayload {
  requests: {
    request_status: ZohoSignatureStatus
    request_id: string
    request_name: string
    actions: {
      action_id: string
      action_status: string
      recipient_email: string
      signing_time?: string
    }[]
  }
  notifications: {
    operation_type: string
    performed_by_email: string
    performed_at: string
  }
}

export interface CreateSignatureRequestInput {
  documentFile: File | Buffer
  documentName: string
  recipientEmail: string
  recipientName: string
  isSequential?: boolean
  expirationDays?: number
  message?: string
  employeeId?: string
  documentId?: string
}

/**
 * Zoho Sign API Service
 * Handles document signing with OAuth authentication
 *
 * Documentation: https://www.zoho.com/sign/api/
 */
class ZohoSignServiceClass extends BaseService {
  private baseUrl: string
  private accountsUrl: string
  private clientId: string
  private clientSecret: string
  private refreshToken: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    super()
    this.baseUrl = process.env.ZOHO_SIGN_API_URL || 'https://sign.zoho.com/api/v1'
    this.accountsUrl = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com'
    this.clientId = process.env.ZOHO_CLIENT_ID || ''
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET || ''
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN || ''
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    // Refresh the token
    const tokenUrl = `${this.accountsUrl}/oauth/v2/token`
    const params = new URLSearchParams({
      refresh_token: this.refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
    })

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ServiceError(
          errorData.error || 'Failed to refresh Zoho token',
          'ZOHO_AUTH_ERROR',
          401
        )
      }

      const data = await response.json()
      this.accessToken = data.access_token
      // Token expires in 1 hour, refresh 5 minutes early
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000

      return this.accessToken || ''
    } catch (error) {
      if (error instanceof ServiceError) throw error
      throw new ServiceError(
        'Failed to authenticate with Zoho Sign',
        'ZOHO_AUTH_ERROR',
        500
      )
    }
  }

  /**
   * Make authenticated request to Zoho Sign API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
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
          errorData.message || `Zoho Sign API error: ${response.statusText}`,
          'ZOHO_API_ERROR',
          response.status
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof ServiceError) throw error
      throw new ServiceError(
        'Failed to connect to Zoho Sign API',
        'ZOHO_CONNECTION_ERROR',
        500
      )
    }
  }

  /**
   * Create a signature request and send for signing
   */
  async createSignatureRequest(
    input: CreateSignatureRequestInput
  ): Promise<ZohoSignRequest> {
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/zoho-sign`

    // Prepare form data
    const formData = new FormData()

    // Add the file
    if (input.documentFile instanceof File) {
      formData.append('file', input.documentFile)
    } else {
      // Buffer - convert to Blob (cast to BlobPart)
      const bufferData = input.documentFile as unknown as BlobPart
      const blob = new Blob([bufferData], { type: 'application/pdf' })
      formData.append('file', blob, input.documentName)
    }

    // Add the request data
    const requestData = {
      request_name: input.documentName,
      is_sequential: input.isSequential ?? true,
      expiration_days: input.expirationDays ?? 30,
      email_reminders: true,
      reminder_period: 3, // Days between reminders
      notes: input.message || 'Please sign this document',
      actions: [
        {
          action_type: 'SIGN',
          recipient_email: input.recipientEmail,
          recipient_name: input.recipientName,
          verify_recipient: true,
          signing_order: 1,
        },
      ],
      // Webhook configuration
      notification_settings: {
        send_email_to_all: true,
        webhook_url: webhookUrl,
      },
    }

    formData.append('data', JSON.stringify(requestData))

    const response = await this.request<{ requests: ZohoSignRequest }>('/requests', {
      method: 'POST',
      body: formData,
    })

    // Store the request in our database
    if (input.employeeId && input.documentId) {
      await this.storeSignatureRequest(
        response.requests,
        input.employeeId,
        input.documentId
      )
    }

    return response.requests
  }

  /**
   * Store signature request details in database
   */
  private async storeSignatureRequest(
    request: ZohoSignRequest,
    employeeId: string,
    documentId: string
  ): Promise<void> {
    // Update the document record with Zoho Sign details
    await this.supabase
      .from('commons_document')
      .update({
        zoho_request_id: request.request_id,
        signature_status: 'sent',
        signature_sent_at: new Date().toISOString(),
        signature_provider: 'zoho_sign',
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    // Also create/update e-signature record if table exists
    const { error } = await this.supabase
      .from('e_signature_employmentagreement')
      .upsert({
        employee_id: employeeId,
        document_id: documentId,
        provider: 'zoho',
        external_id: request.request_id,
        status: 'sent',
        sent_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + (request.expiration_days || 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
      })

    if (error && error.code !== '42P01') {
      // Ignore table not exists error
      console.error('[Zoho Sign] Error storing signature request:', error)
    }
  }

  /**
   * Get signature request status
   */
  async getRequestStatus(requestId: string): Promise<ZohoSignRequest> {
    const response = await this.request<{ requests: ZohoSignRequest }>(
      `/requests/${requestId}`
    )
    return response.requests
  }

  /**
   * Download signed document
   */
  async downloadSignedDocument(requestId: string): Promise<Buffer> {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/requests/${requestId}/pdf`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new ServiceError(
        'Failed to download signed document',
        'ZOHO_DOWNLOAD_ERROR',
        response.status
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  /**
   * Recall (cancel) a signature request
   */
  async recallRequest(requestId: string): Promise<void> {
    await this.request(`/requests/${requestId}/recall`, {
      method: 'POST',
    })
  }

  /**
   * Send reminder for pending signature
   */
  async sendReminder(requestId: string): Promise<void> {
    await this.request(`/requests/${requestId}/remind`, {
      method: 'POST',
    })
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    const webhookSecret = process.env.ZOHO_SIGN_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.warn('[Zoho Sign] No webhook secret configured, skipping verification')
      return true
    }

    // Implement HMAC signature verification
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
   * Process webhook payload and update database
   */
  async processWebhook(payload: ZohoWebhookPayload): Promise<void> {
    const { requests, notifications } = payload
    const requestId = requests.request_id
    const status = requests.request_status

    console.log('[Zoho Sign Webhook] Processing:', {
      requestId,
      status,
      operation: notifications?.operation_type,
    })

    // Find the document by Zoho request ID
    const { data: document, error: findError } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('zoho_request_id', requestId)
      .single()

    if (findError && findError.code !== 'PGRST116') {
      console.error('[Zoho Sign Webhook] Error finding document:', findError)
      return
    }

    if (!document) {
      console.warn('[Zoho Sign Webhook] No document found for request:', requestId)
      return
    }

    // Map Zoho status to our status
    const mappedStatus = this.mapStatus(status)
    const signedAction = requests.actions?.find(a => a.action_status === 'SIGNED')

    // Update document record
    const updateData: Record<string, unknown> = {
      signature_status: mappedStatus,
      updated_at: new Date().toISOString(),
    }

    if (status === 'completed' || status === 'signed') {
      updateData.is_signed = true
      updateData.signed_at = signedAction?.signing_time || new Date().toISOString()

      // Download and store signed document
      try {
        const signedPdf = await this.downloadSignedDocument(requestId)
        const signedPath = `signed-documents/${document.employee_id}/${document.id}_signed.pdf`

        const { error: uploadError } = await this.supabase.storage
          .from('documents')
          .upload(signedPath, signedPdf, {
            contentType: 'application/pdf',
            upsert: true,
          })

        if (!uploadError) {
          const { data: { publicUrl } } = this.supabase.storage
            .from('documents')
            .getPublicUrl(signedPath)
          updateData.signed_document_url = publicUrl
        }
      } catch (error) {
        console.error('[Zoho Sign Webhook] Error downloading signed document:', error)
      }
    }

    if (status === 'declined') {
      updateData.signature_declined_at = new Date().toISOString()
    }

    if (status === 'expired') {
      updateData.signature_expired_at = new Date().toISOString()
    }

    // Update document
    await this.supabase
      .from('commons_document')
      .update(updateData)
      .eq('id', document.id)

    // Update e-signature record
    await this.supabase
      .from('e_signature_employmentagreement')
      .update({
        status: mappedStatus,
        signed_at: status === 'completed' || status === 'signed'
          ? signedAction?.signing_time || new Date().toISOString()
          : null,
      })
      .eq('external_id', requestId)

    // If all documents signed, update employee onboarding status
    if (status === 'completed' || status === 'signed') {
      await this.checkAndUpdateOnboardingStatus(document.employee_id ?? '')
    }
  }

  /**
   * Map Zoho status to our internal status
   */
  private mapStatus(zohoStatus: ZohoSignatureStatus): string {
    const statusMap: Record<ZohoSignatureStatus, string> = {
      draft: 'draft',
      sent: 'sent',
      viewed: 'viewed',
      signed: 'signed',
      completed: 'signed',
      declined: 'declined',
      expired: 'expired',
      recalled: 'cancelled',
    }
    return statusMap[zohoStatus] || zohoStatus
  }

  /**
   * Check if all onboarding documents are signed and update employee status
   */
  private async checkAndUpdateOnboardingStatus(employeeId: string): Promise<void> {
    if (!employeeId) return

    // Get all onboarding documents
    const { data: documents } = await this.supabase
      .from('commons_document')
      .select('is_signed, document_type')
      .eq('employee_id', employeeId)
      .eq('document_category', 'onboarding')
      .eq('is_deleted', false)

    if (!documents || documents.length === 0) return

    const allSigned = documents.every(d => d.is_signed)

    if (allSigned) {
      await this.supabase
        .from('employee_employee')
        .update({
          documents_signed: true,
          onboarding_documents_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', employeeId)
    }
  }

  /**
   * Get list of available templates
   */
  async getTemplates(): Promise<{ templates: { template_id: string; template_name: string }[] }> {
    return this.request('/templates')
  }

  /**
   * Create document from template
   */
  async createFromTemplate(
    templateId: string,
    recipientEmail: string,
    recipientName: string,
    prefillData?: Record<string, string>
  ): Promise<ZohoSignRequest> {
    const requestData = {
      templates: {
        field_data: {
          field_text_data: prefillData || {},
        },
        actions: [
          {
            action_type: 'SIGN',
            recipient_email: recipientEmail,
            recipient_name: recipientName,
            verify_recipient: true,
          },
        ],
      },
    }

    const response = await this.request<{ requests: ZohoSignRequest }>(
      `/templates/${templateId}/createdocument`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }
    )

    return response.requests
  }
}

export const zohoSignService = new ZohoSignServiceClass()
