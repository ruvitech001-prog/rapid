'use client'

import { BaseService, ServiceError } from './base.service'

export type VerificationType = 'pan' | 'aadhaar' | 'bank_account' | 'face_match' | 'liveness'
export type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'failed'

export interface VerificationResult {
  id: string
  verificationType: VerificationType
  status: VerificationStatus
  personId?: string
  verificationId?: string
  matchScore?: number
  extractedData?: Record<string, unknown>
  failedReason?: string
  verifiedAt?: string
}

export interface DocumentUploadResult {
  documentId: string
  fileName: string
  storageUrl: string
  documentType: string
}

export interface FaceMatchResult {
  matched: boolean
  score: number
  verificationId: string
}

export interface LivenessResult {
  passed: boolean
  verificationId: string
  confidence: number
}

class VerificationServiceClass extends BaseService {
  /**
   * Upload a verification document (ID, PAN, etc.)
   */
  async uploadDocument(
    file: File,
    documentType: string,
    entityType: 'employee' | 'contractor',
    entityId: string
  ): Promise<DocumentUploadResult> {
    // Generate a unique file path
    const timestamp = Date.now()
    const fileName = `${documentType}_${timestamp}_${file.name}`
    const storagePath = `verification/${entityType}/${entityId}/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await this.supabase.storage
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

    // Create document record in database
    const documentRecord = {
      [entityType === 'employee' ? 'employee_id' : 'contractor_id']: entityId,
      document_type: documentType,
      document_category: 'kyc',
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_bucket: 'documents',
      storage_path: storagePath,
      storage_url: publicUrl,
      verification_status: 'pending',
    }

    const { data: document, error: dbError } = await this.supabase
      .from('commons_document')
      .insert(documentRecord)
      .select()
      .single()

    if (dbError) this.handleError(dbError)

    return {
      documentId: document.id,
      fileName: file.name,
      storageUrl: publicUrl,
      documentType,
    }
  }

  /**
   * Submit document for verification
   */
  async submitForVerification(
    documentId: string,
    verificationType: VerificationType,
    entityType: 'employee' | 'contractor',
    entityId: string
  ): Promise<VerificationResult> {
    // Create verification record
    const verificationRecord = {
      [entityType === 'employee' ? 'employee_id' : 'contractor_id']: entityId,
      document_id: documentId,
      verification_type: verificationType,
      status: 'in_progress',
    }

    const { data: verification, error } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .insert(verificationRecord)
      .select()
      .single()

    if (error) this.handleError(error)

    // In production, this would call an external verification API (e.g., Hyperverge, DigiLocker)
    // For now, we simulate a verification process
    const simulatedResult = await this.simulateVerification(verificationType)

    // Update verification record with result
    const { data: updated, error: updateError } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .update({
        status: simulatedResult.success ? 'verified' : 'failed',
        match_score: simulatedResult.score,
        verification_data: simulatedResult.data,
        extracted_data: simulatedResult.extractedData,
        verified_at: simulatedResult.success ? new Date().toISOString() : null,
        failed_reason: simulatedResult.failedReason,
      })
      .eq('id', verification.id)
      .select()
      .single()

    if (updateError) this.handleError(updateError)

    return {
      id: updated.id,
      verificationType,
      status: updated.status,
      matchScore: updated.match_score,
      extractedData: updated.extracted_data,
      failedReason: updated.failed_reason,
      verifiedAt: updated.verified_at,
    }
  }

  /**
   * Capture and verify selfie for face match
   */
  async captureSelfie(
    imageData: string, // Base64 encoded image
    entityType: 'employee' | 'contractor',
    entityId: string
  ): Promise<DocumentUploadResult> {
    // Convert base64 to blob
    const response = await fetch(imageData)
    const blob = await response.blob()
    const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })

    return this.uploadDocument(file, 'selfie', entityType, entityId)
  }

  /**
   * Perform face match between ID document and selfie
   */
  async performFaceMatch(
    documentId: string,
    selfieDocumentId: string,
    entityType: 'employee' | 'contractor',
    entityId: string
  ): Promise<FaceMatchResult> {
    // In production, this would call a face matching API (e.g., AWS Rekognition, Azure Face API)
    // For now, we simulate the result
    const matchScore = Math.random() * 30 + 70 // Score between 70-100

    // Create verification record
    const verificationRecord = {
      [entityType === 'employee' ? 'employee_id' : 'contractor_id']: entityId,
      document_id: documentId,
      verification_type: 'face_match',
      status: matchScore >= 75 ? 'verified' : 'failed',
      match_score: matchScore,
      verification_data: {
        selfieDocumentId,
        idDocumentId: documentId,
      },
      verified_at: matchScore >= 75 ? new Date().toISOString() : null,
      failed_reason: matchScore < 75 ? 'Face match confidence below threshold' : null,
    }

    const { data: verification, error } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .insert(verificationRecord)
      .select()
      .single()

    if (error) this.handleError(error)

    // Update entity face_verified status
    if (matchScore >= 75) {
      const table = entityType === 'employee' ? 'employee_employee' : 'contractor_contractor'
      await this.supabase
        .from(table)
        .update({
          face_verified: true,
          kyc_status: 'verified',
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId)
    }

    return {
      matched: matchScore >= 75,
      score: matchScore,
      verificationId: verification.id,
    }
  }

  /**
   * Perform liveness check
   */
  async performLivenessCheck(
    videoFrames: string[], // Array of base64 encoded frames
    entityType: 'employee' | 'contractor',
    entityId: string
  ): Promise<LivenessResult> {
    // In production, this would analyze video frames for liveness detection
    // For now, we simulate the result
    const confidence = Math.random() * 20 + 80 // Score between 80-100
    const passed = confidence >= 85

    // Create verification record
    const verificationRecord = {
      [entityType === 'employee' ? 'employee_id' : 'contractor_id']: entityId,
      verification_type: 'liveness',
      status: passed ? 'verified' : 'failed',
      match_score: confidence,
      verification_data: {
        frameCount: videoFrames.length,
        analysisMethod: 'blink_detection',
      },
      verified_at: passed ? new Date().toISOString() : null,
      failed_reason: !passed ? 'Liveness check failed - no live presence detected' : null,
    }

    const { data: verification, error } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .insert(verificationRecord)
      .select()
      .single()

    if (error) this.handleError(error)

    return {
      passed,
      verificationId: verification.id,
      confidence,
    }
  }

  /**
   * Get verification status for an entity
   */
  async getVerificationStatus(
    entityType: 'employee' | 'contractor',
    entityId: string
  ): Promise<VerificationResult[]> {
    const { data, error } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .select('*')
      .eq(entityType === 'employee' ? 'employee_id' : 'contractor_id', entityId)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)

    return (data || []).map(v => ({
      id: v.id,
      verificationType: v.verification_type as VerificationType,
      status: v.status as VerificationStatus,
      personId: v.person_id,
      verificationId: v.verification_id,
      matchScore: v.match_score,
      extractedData: v.extracted_data,
      failedReason: v.failed_reason,
      verifiedAt: v.verified_at,
    }))
  }

  /**
   * Simulate verification process (for development)
   */
  private async simulateVerification(type: VerificationType): Promise<{
    success: boolean
    score: number
    data: Record<string, unknown>
    extractedData: Record<string, unknown>
    failedReason?: string
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const score = Math.random() * 30 + 70 // Score between 70-100
    const success = score >= 75

    const extractedDataMap: Record<VerificationType, Record<string, unknown>> = {
      pan: {
        panNumber: 'ABCDE1234F',
        name: 'Sample Name',
        dateOfBirth: '1990-01-01',
      },
      aadhaar: {
        aadhaarNumber: '****-****-1234',
        name: 'Sample Name',
        address: 'Sample Address, City',
      },
      bank_account: {
        accountNumber: '****1234',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India',
      },
      face_match: {
        matchPercentage: score,
      },
      liveness: {
        livenessScore: score,
        blinkDetected: true,
      },
    }

    return {
      success,
      score,
      data: {
        verificationProvider: 'simulated',
        timestamp: new Date().toISOString(),
      },
      extractedData: extractedDataMap[type],
      failedReason: success ? undefined : 'Verification confidence below threshold',
    }
  }
}

export const verificationService = new VerificationServiceClass()
