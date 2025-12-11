import { BaseService, ServiceError } from './base.service'
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

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new ServiceError('File size must be less than 10MB', 'FILE_TOO_LARGE', 400)
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
   * E-sign a document
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

    // Generate signature hash (in production, use a proper cryptographic signature)
    const signatureData = {
      documentId,
      signerId,
      signerName,
      signerEmail,
      timestamp: new Date().toISOString(),
      documentHash: document.storage_path, // In production, use actual file hash
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
}

export const documentsService = new DocumentsServiceClass()
