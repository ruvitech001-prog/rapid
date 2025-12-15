import { BaseService, ServiceError } from './base.service'
import { zohoSignService } from './zoho-sign.service'
import type { Tables } from '@/types/database.types'

export type Document = Tables<'commons_document'>

export interface DocumentWithDetails extends Document {
  uploadedByName?: string
}

export interface DocumentUploadInput {
  file: File
  category: string
  documentType?: string
  description?: string
}

export interface ESignatureResult {
  documentId: string
  signedAt: string
  signedBy: string
  signatureHash: string
}

class DocumentsServiceClass extends BaseService {
  // Get documents for an employee
  async getEmployeeDocuments(employeeId: string): Promise<DocumentWithDetails[]> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  // Get documents for a contractor
  async getContractorDocuments(contractorId: string): Promise<DocumentWithDetails[]> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('contractor_id', contractorId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  // Get documents for a company
  async getCompanyDocuments(companyId: string): Promise<DocumentWithDetails[]> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  // Get document by ID
  async getDocument(documentId: string): Promise<Document | null> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('id', documentId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }
    return data
  }

  // Get documents by category
  async getDocumentsByCategory(
    employeeId: string,
    category: string
  ): Promise<DocumentWithDetails[]> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('document_category', category)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  // Get documents by type (e.g., 'pan_card', 'aadhaar', 'offer_letter')
  async getDocumentsByType(
    employeeId: string,
    documentType: string
  ): Promise<DocumentWithDetails[]> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('document_type', documentType)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  // Get verified documents count
  async getVerifiedDocumentsCount(employeeId: string): Promise<{
    total: number
    verified: number
    pending: number
  }> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('is_verified, verification_status')
      .eq('employee_id', employeeId)
      .eq('is_deleted', false)

    if (error) this.handleError(error)

    const docs = data || []
    const verified = docs.filter((d) => d.is_verified).length
    const pending = docs.filter(
      (d) => !d.is_verified && d.verification_status === 'pending'
    ).length

    return {
      total: docs.length,
      verified,
      pending,
    }
  }

  /**
   * Upload a document for an employee
   */
  async uploadEmployeeDocument(
    employeeId: string,
    input: DocumentUploadInput
  ): Promise<Document> {
    const { file, category, documentType, description } = input

    // SECURITY: Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new ServiceError('File size must be less than 10MB', 'FILE_TOO_LARGE', 400)
    }

    // SECURITY: Validate file type
    const ALLOWED_MIME_TYPES = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new ServiceError(
        'Invalid file type. Allowed: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX',
        'INVALID_FILE_TYPE',
        400
      )
    }

    // SECURITY: Validate file extension
    const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      throw new ServiceError(
        'Invalid file extension',
        'INVALID_EXTENSION',
        400
      )
    }

    // Generate storage path
    const timestamp = Date.now()
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${safeFileName}`
    const storagePath = `employee-documents/${employeeId}/${category.replace(/\s+/g, '_')}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await this.supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new ServiceError(`Failed to upload document: ${uploadError.message}`, 'UPLOAD_ERROR', 500)
    }

    // Get public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from('documents')
      .getPublicUrl(storagePath)

    // Create document record
    const { data, error } = await this.supabase
      .from('commons_document')
      .insert({
        employee_id: employeeId,
        document_type: documentType || category,
        document_category: category,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_bucket: 'documents',
        storage_path: storagePath,
        storage_url: publicUrl,
        description,
        verification_status: 'pending',
        is_verified: false,
        is_deleted: false,
      })
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  /**
   * Upload a document for a contractor
   */
  async uploadContractorDocument(
    contractorId: string,
    input: DocumentUploadInput
  ): Promise<Document> {
    const { file, category, documentType, description } = input

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new ServiceError('File size must be less than 10MB', 'FILE_TOO_LARGE', 400)
    }

    const timestamp = Date.now()
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${safeFileName}`
    const storagePath = `contractor-documents/${contractorId}/${category.replace(/\s+/g, '_')}/${fileName}`

    const { error: uploadError } = await this.supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new ServiceError(`Failed to upload document: ${uploadError.message}`, 'UPLOAD_ERROR', 500)
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from('documents')
      .getPublicUrl(storagePath)

    const { data, error } = await this.supabase
      .from('commons_document')
      .insert({
        contractor_id: contractorId,
        document_type: documentType || category,
        document_category: category,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_bucket: 'documents',
        storage_path: storagePath,
        storage_url: publicUrl,
        description,
        verification_status: 'pending',
        is_verified: false,
        is_deleted: false,
      })
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  /**
   * Delete a document (soft delete)
   */
  async deleteDocument(documentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('commons_document')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (error) this.handleError(error)
  }

  /**
   * E-sign a document using Zoho Sign
   * This is called when the employee clicks "Sign Now" after receiving the email
   * In email-based flow, this marks the document as signed based on webhook callback
   * For immediate signing (fallback), it uses local signature
   */
  async signDocument(
    documentId: string,
    signerId: string,
    signerName: string,
    signerEmail: string
  ): Promise<ESignatureResult> {
    // Get the document
    const document = await this.getDocument(documentId)
    if (!document) {
      throw new ServiceError('Document not found', 'NOT_FOUND', 404)
    }

    // Check if this document has a Zoho Sign request
    if (document.zoho_request_id) {
      // Check status from Zoho
      try {
        const zohoStatus = await zohoSignService.getRequestStatus(document.zoho_request_id)

        if (zohoStatus.request_status === 'completed' || zohoStatus.request_status === 'signed') {
          // Already signed via Zoho - update our record
          const signedAction = zohoStatus.actions?.find(a => a.action_status === 'signed' || a.action_status === 'completed')

          await this.supabase
            .from('commons_document')
            .update({
              is_signed: true,
              signed_at: signedAction?.signed_time || new Date().toISOString(),
              signed_by: signerId,
              signer_name: signerName,
              signer_email: signerEmail,
              signature_status: 'signed',
              signature_provider: 'zoho_sign',
              updated_at: new Date().toISOString(),
            })
            .eq('id', documentId)

          return {
            documentId,
            signedAt: signedAction?.signed_time || new Date().toISOString(),
            signedBy: signerName,
            signatureHash: document.zoho_request_id,
          }
        } else if (zohoStatus.request_status === 'sent' || zohoStatus.request_status === 'viewed') {
          // Still pending - tell user to check email
          throw new ServiceError(
            'Please check your email to sign this document via Zoho Sign',
            'SIGN_VIA_EMAIL',
            400
          )
        }
      } catch (error) {
        if (error instanceof ServiceError) throw error
        console.error('[Documents] Error checking Zoho status:', error)
        // Fall through to local signing
      }
    }

    // Fallback: Local signature (when Zoho Sign is not configured or failed)
    const signatureData = {
      documentId,
      signerId,
      signerName,
      signerEmail,
      timestamp: new Date().toISOString(),
      documentHash: document.storage_path,
      provider: 'local',
    }
    const signatureHash = btoa(JSON.stringify(signatureData))

    // Update document with signature
    const { error } = await this.supabase
      .from('commons_document')
      .update({
        is_signed: true,
        signed_at: new Date().toISOString(),
        signed_by: signerId,
        signer_name: signerName,
        signer_email: signerEmail,
        signature_hash: signatureHash,
        signature_status: 'signed',
        signature_provider: 'local',
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (error) this.handleError(error)

    return {
      documentId,
      signedAt: new Date().toISOString(),
      signedBy: signerName,
      signatureHash,
    }
  }

  /**
   * Get documents pending signature for an employee
   */
  async getPendingSignatureDocuments(employeeId: string): Promise<DocumentWithDetails[]> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('is_deleted', false)
      .eq('requires_signature', true)
      .is('signed_at', null)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  /**
   * Get signed documents for an employee
   */
  async getSignedDocuments(employeeId: string): Promise<DocumentWithDetails[]> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('is_deleted', false)
      .eq('is_signed', true)
      .order('signed_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  /**
   * Get onboarding documents for an employee
   * These are documents that need to be signed during onboarding
   */
  async getOnboardingDocuments(employeeId: string): Promise<DocumentWithDetails[]> {
    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('is_deleted', false)
      .in('document_type', [
        'employment_agreement',
        'confidentiality',
        'ip_assignment',
        'non_compete',
        'offer_letter',
        'appointment_letter',
      ])
      .order('created_at', { ascending: true })

    if (error) this.handleError(error)
    return data || []
  }

  /**
   * Create or get onboarding document placeholders for an employee
   * This creates entries for standard onboarding documents if they don't exist
   */
  async ensureOnboardingDocuments(
    employeeId: string,
    companyId: string
  ): Promise<DocumentWithDetails[]> {
    const onboardingDocTypes = [
      { type: 'employment_agreement', name: 'Employment Agreement', pages: 8 },
      { type: 'confidentiality', name: 'Confidentiality Agreement', pages: 4 },
      { type: 'ip_assignment', name: 'Intellectual Property Assignment', pages: 3 },
      { type: 'non_compete', name: 'Non-Compete Agreement', pages: 2 },
    ]

    const existing = await this.getOnboardingDocuments(employeeId)
    const existingTypes = new Set(existing.map((d) => d.document_type))

    const newDocs = []
    for (const docType of onboardingDocTypes) {
      if (!existingTypes.has(docType.type)) {
        const { data, error } = await this.supabase
          .from('commons_document')
          .insert({
            employee_id: employeeId,
            company_id: companyId,
            document_type: docType.type,
            document_category: 'onboarding',
            file_name: docType.name,
            file_type: 'application/pdf',
            storage_bucket: 'documents',
            storage_path: `onboarding/${employeeId}/${docType.type}`,
            requires_signature: true,
            signature_status: 'pending',
            is_signed: false,
            is_deleted: false,
            is_verified: true,
            verification_status: 'verified',
          })
          .select()
          .single()

        if (error) this.handleError(error)
        if (data) newDocs.push(data)
      }
    }

    return [...existing, ...newDocs]
  }

  /**
   * Send document for signature via Zoho Sign
   * Creates a signature request and sends email to employee
   */
  async sendForSignature(
    documentId: string,
    employeeEmail: string,
    employeeId?: string
  ): Promise<{ success: boolean; sentAt: string; zohoRequestId?: string }> {
    // Get the document
    const document = await this.getDocument(documentId)
    if (!document) {
      throw new ServiceError('Document not found', 'NOT_FOUND', 404)
    }

    // Get employee details for recipient name
    let recipientName = employeeEmail.split('@')[0] // Default to email prefix
    if (employeeId) {
      const { data: employee } = await this.supabase
        .from('employee_employee')
        .select('full_name, first_name, last_name')
        .eq('id', employeeId)
        .single()

      if (employee) {
        recipientName = employee.full_name || `${employee.first_name} ${employee.last_name}`
      }
    }

    // Try to send via Zoho Sign
    try {
      // Get the actual file from storage
      let documentFile: Buffer | null = null
      if (document.storage_path) {
        const { data: fileData } = await this.supabase.storage
          .from(document.storage_bucket || 'documents')
          .download(document.storage_path)

        if (fileData) {
          const arrayBuffer = await fileData.arrayBuffer()
          documentFile = Buffer.from(arrayBuffer)
        }
      }

      if (documentFile) {
        // Create Zoho Sign request
        const zohoRequest = await zohoSignService.createSignatureRequest({
          documentFile,
          documentName: document.file_name ?? document.document_type ?? 'Document',
          recipientEmail: employeeEmail,
          recipientName: recipientName || 'Employee',
          employeeId,
          documentId,
        })

        // Update document with Zoho request ID
        await this.supabase
          .from('commons_document')
          .update({
            zoho_request_id: zohoRequest.request_id,
            signature_status: 'sent',
            signature_sent_at: new Date().toISOString(),
            signature_recipient_email: employeeEmail,
            signature_provider: 'zoho_sign',
            updated_at: new Date().toISOString(),
          })
          .eq('id', documentId)

        return {
          success: true,
          sentAt: new Date().toISOString(),
          zohoRequestId: zohoRequest.request_id,
        }
      }
    } catch (error) {
      console.error('[Documents] Zoho Sign error, falling back to local:', error)
      // Fall through to local handling
    }

    // Fallback: Just update status locally (no actual email sent)
    const { error } = await this.supabase
      .from('commons_document')
      .update({
        signature_status: 'sent',
        signature_sent_at: new Date().toISOString(),
        signature_recipient_email: employeeEmail,
        signature_provider: 'local',
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (error) this.handleError(error)

    return {
      success: true,
      sentAt: new Date().toISOString(),
    }
  }

  /**
   * Complete all onboarding documents signing
   */
  async completeOnboardingDocuments(employeeId: string): Promise<boolean> {
    const docs = await this.getOnboardingDocuments(employeeId)
    const unsignedDocs = docs.filter((d) => !d.is_signed)

    if (unsignedDocs.length > 0) {
      throw new ServiceError(
        `${unsignedDocs.length} documents still need to be signed`,
        'INCOMPLETE_SIGNING',
        400
      )
    }

    // Update employee onboarding status
    const { error } = await this.supabase
      .from('employee_employee')
      .update({
        documents_signed: true,
        onboarding_documents_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', employeeId)

    if (error) this.handleError(error)

    return true
  }
}

export const documentsService = new DocumentsServiceClass()
