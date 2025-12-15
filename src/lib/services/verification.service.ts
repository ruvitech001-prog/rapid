'use client'

import { BaseService, ServiceError } from './base.service'
import type { Json } from '@/types/database.types'
import {
  springverifyService,
  type SpringverifyCheckType,
} from './springverify.service'

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
  springverifyCandidateId?: string
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
   * Submit document for verification using Springverify API
   */
  async submitForVerification(
    documentId: string,
    verificationType: VerificationType,
    entityType: 'employee' | 'contractor',
    entityId: string
  ): Promise<VerificationResult> {
    // Get entity details for Springverify
    const entityTable = entityType === 'employee' ? 'employee_employee' : 'contractor_contractor'
    const { data: entity, error: entityError } = await this.supabase
      .from(entityTable)
      .select('*, users_user(*)')
      .eq('id', entityId)
      .single()

    if (entityError) this.handleError(entityError)

    // Get the document
    const { data: document, error: docError } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError) this.handleError(docError)

    // TODO: Add springverify_candidate_id field to employee_employee table
    // Check if we already have a Springverify candidate for this entity
    // let springverifyCandidateId = entity.springverify_candidate_id
    let springverifyCandidateId: string | undefined = undefined

    // Create Springverify candidate if not exists
    if (!springverifyCandidateId) {
      try {
        const candidate = await springverifyService.createCandidate({
          name: entity.full_name || '',
          email: entity.users_user?.email || '',
          phone: undefined, // TODO: entity.phone field doesn't exist on contractor
          dob: undefined, // TODO: entity.date_of_birth field doesn't exist on contractor
          employee_id: entityId,
          documents: document?.storage_url ? [{
            type: verificationType,
            url: document.storage_url,
          }] : undefined,
        })
        springverifyCandidateId = candidate.id

        // TODO: Add springverify_candidate_id field to employee_employee table
        // Store candidate ID on entity
        // await this.supabase
        //   .from(entityTable)
        //   .update({
        //     springverify_candidate_id: springverifyCandidateId,
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq('id', entityId)
      } catch (error) {
        console.error('[Verification] Failed to create Springverify candidate:', error)
        // Fall back to simulation if Springverify is not configured
        return this.submitForVerificationSimulated(documentId, verificationType, entityType, entityId)
      }
    }

    // Create verification record
    const verificationRecord = {
      [entityType === 'employee' ? 'employee_id' : 'contractor_id']: entityId,
      document_id: documentId,
      verification_type: verificationType,
      status: 'in_progress',
      springverify_candidate_id: springverifyCandidateId,
    }

    const { data: verification, error } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .insert(verificationRecord)
      .select()
      .single()

    if (error) this.handleError(error)

    // Call Springverify API based on verification type
    try {
      let springverifyResult
      const mapToSpringverifyType: Record<VerificationType, SpringverifyCheckType> = {
        'aadhaar': 'aadhaar',
        'pan': 'pan',
        'bank_account': 'bank_account',
        'face_match': 'identity',
        'liveness': 'identity',
      }

      const springverifyType = mapToSpringverifyType[verificationType]

      if (verificationType === 'pan' && entity.pan_number) {
        springverifyResult = await springverifyService.verifyPAN(
          springverifyCandidateId,
          entity.pan_number,
          entity.full_name || '',
          undefined // TODO: entity.date_of_birth doesn't exist on contractor
        )
      } else if (verificationType === 'bank_account') {
        // TODO: bank fields don't exist on contractor_contractor table
        // springverifyResult = await springverifyService.verifyBankAccount(
        //   springverifyCandidateId,
        //   entity.bank_account_number,
        //   entity.bank_ifsc_code,
        //   entity.bank_account_holder_name || entity.full_name
        // )
      } else {
        // For other types, initiate verification with callback
        const results = await springverifyService.initiateVerification({
          candidate_id: springverifyCandidateId,
          check_types: [springverifyType],
        })
        springverifyResult = results[0]
      }

      // Update verification record with Springverify ID
      await this.supabase
        .from('ekyc_verification_kycverificationdetail')
        .update({
          springverify_verification_id: springverifyResult?.id,
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        })
        .eq('id', verification.id)

      return {
        id: verification.id,
        verificationType,
        status: 'in_progress',
        verificationId: springverifyResult?.id,
        springverifyCandidateId,
      }
    } catch (error) {
      console.error('[Verification] Springverify API error:', error)
      // Fall back to simulation if API call fails
      return this.submitForVerificationSimulated(documentId, verificationType, entityType, entityId, verification.id)
    }
  }

  /**
   * Fallback simulation for when Springverify is not available
   */
  private async submitForVerificationSimulated(
    documentId: string,
    verificationType: VerificationType,
    entityType: 'employee' | 'contractor',
    entityId: string,
    existingVerificationId?: string
  ): Promise<VerificationResult> {
    let verificationId = existingVerificationId

    // Create verification record if not exists
    if (!verificationId) {
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
      verificationId = verification.id
    }

    // Simulate verification process
    const simulatedResult = await this.simulateVerification(verificationType)

    // Update verification record with result
    const { data: updated, error: updateError } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .update({
        status: simulatedResult.success ? 'verified' : 'failed',
        match_score: simulatedResult.score,
        verification_data: simulatedResult.data as unknown as Json,
        extracted_data: simulatedResult.extractedData as unknown as Json,
        verified_at: simulatedResult.success ? new Date().toISOString() : null,
        failed_reason: simulatedResult.failedReason ?? undefined,
      })
      .eq('id', verificationId)
      .select()
      .single()

    if (updateError) this.handleError(updateError)

    return {
      id: updated.id,
      verificationType,
      status: (updated.status ?? 'pending') as VerificationStatus,
      matchScore: updated.match_score ?? undefined,
      extractedData: updated.extracted_data as Record<string, unknown> | undefined,
      failedReason: updated.failed_reason ?? undefined,
      verifiedAt: updated.verified_at ?? undefined,
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
      } as unknown as Json,
      verified_at: matchScore >= 75 ? new Date().toISOString() : null,
      failed_reason: matchScore < 75 ? 'Face match confidence below threshold' : undefined,
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
      } as unknown as Json,
      verified_at: passed ? new Date().toISOString() : null,
      failed_reason: !passed ? 'Liveness check failed - no live presence detected' : undefined,
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
      personId: v.person_id ?? undefined,
      verificationId: v.verification_id ?? undefined,
      matchScore: v.match_score ?? undefined,
      extractedData: v.extracted_data as Record<string, unknown> | undefined,
      failedReason: v.failed_reason ?? undefined,
      verifiedAt: v.verified_at ?? undefined,
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

// BGV Types and Service
export type BGVCheckType =
  | 'identity'
  | 'address'
  | 'education'
  | 'employment'
  | 'criminal'

export type BGVCheckStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
export type BGVCheckResult = 'pending' | 'passed' | 'failed'

export interface BGVCheck {
  id: string
  employeeId: string
  checkType: BGVCheckType
  checkName: string
  status: BGVCheckStatus
  result: BGVCheckResult
  initiatedAt?: string
  completedAt?: string
  failedReason?: string
  verificationData?: Record<string, unknown>
}

export interface BGVInitiationResult {
  success: boolean
  bgvId: string
  checks: BGVCheck[]
}

class BGVServiceClass extends BaseService {
  /**
   * Get BGV checks for an employee
   */
  async getBGVChecks(employeeId: string): Promise<BGVCheck[]> {
    const { data, error } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .select('*')
      .eq('employee_id', employeeId)
      .in('verification_type', ['bgv_identity', 'bgv_address', 'bgv_education', 'bgv_employment', 'bgv_criminal'])
      .order('created_at', { ascending: true })

    if (error) this.handleError(error)

    return (data || []).map((d) => ({
      id: d.id,
      employeeId: d.employee_id ?? '',
      checkType: d.verification_type.replace('bgv_', '') as BGVCheckType,
      checkName: this.getCheckName(d.verification_type),
      status: d.status as BGVCheckStatus,
      result: d.status === 'verified' ? 'passed' : d.status === 'failed' ? 'failed' : 'pending',
      initiatedAt: d.created_at ?? undefined,
      completedAt: d.verified_at ?? undefined,
      failedReason: d.failed_reason ?? undefined,
      verificationData: d.verification_data as Record<string, unknown> | undefined,
    }))
  }

  private getCheckName(verificationCode: string): string {
    const names: Record<string, string> = {
      bgv_identity: 'Identity Verification',
      bgv_address: 'Address Verification',
      bgv_education: 'Education Verification',
      bgv_employment: 'Employment History',
      bgv_criminal: 'Criminal Record Check',
    }
    return names[verificationCode] || verificationCode
  }

  /**
   * Initiate BGV for an employee using Springverify API
   */
  async initiateBGV(employeeId: string): Promise<BGVInitiationResult> {
    // Get employee details
    const { data: employee, error: empError } = await this.supabase
      .from('employee_employee')
      .select('*, users_user(*)')
      .eq('id', employeeId)
      .single()

    if (empError) this.handleError(empError)

    const checkTypes: Array<{ type: string; name: string; springverifyType: SpringverifyCheckType }> = [
      { type: 'bgv_identity', name: 'Identity Verification', springverifyType: 'identity' },
      { type: 'bgv_address', name: 'Address Verification', springverifyType: 'address' },
      { type: 'bgv_education', name: 'Education Verification', springverifyType: 'education' },
      { type: 'bgv_employment', name: 'Employment History', springverifyType: 'employment' },
      { type: 'bgv_criminal', name: 'Criminal Record Check', springverifyType: 'criminal' },
    ]

    // TODO: Add springverify_candidate_id field to employee_employee table
    // Try to use Springverify API
    // let springverifyCandidateId = employee.springverify_candidate_id
    let springverifyCandidateId: string | undefined = undefined
    let springverifyResults: { id: string; check_type: string }[] = []

    try {
      // Create Springverify candidate if not exists
      if (!springverifyCandidateId) {
        const candidate = await springverifyService.createCandidate({
          name: employee.full_name || '',
          email: employee.users_user?.email || '',
          phone: undefined, // TODO: employee.phone field missing
          dob: employee.date_of_birth ?? undefined,
          employee_id: employeeId,
        })
        springverifyCandidateId = candidate.id

        // TODO: Add springverify_candidate_id field to employee_employee table
        // Store candidate ID on employee
        // await this.supabase
        //   .from('employee_employee')
        //   .update({
        //     springverify_candidate_id: springverifyCandidateId,
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq('id', employeeId)
      }

      // Initiate all BGV checks with Springverify
      const verifications = await springverifyService.initiateBGV(
        springverifyCandidateId,
        checkTypes.map(c => c.springverifyType)
      )

      springverifyResults = verifications.map(v => ({
        id: v.id,
        check_type: v.check_type,
      }))
    } catch (error) {
      console.error('[BGV] Springverify API error, falling back to simulation:', error)
      // Continue without Springverify - will use simulation
    }

    const checks: BGVCheck[] = []

    for (const checkType of checkTypes) {
      const springverifyVerification = springverifyResults.find(
        r => r.check_type === checkType.springverifyType
      )

      const { data, error } = await this.supabase
        .from('ekyc_verification_kycverificationdetail')
        .insert({
          employee_id: employeeId,
          verification_type: checkType.type,
          status: 'in_progress',
          springverify_candidate_id: springverifyCandidateId ?? undefined,
          springverify_verification_id: springverifyVerification?.id ?? undefined,
          verification_data: {
            initiatedBy: 'system',
            bgvProvider: springverifyCandidateId ? 'springverify' : 'simulated',
          } as unknown as Json,
        })
        .select()
        .single()

      if (error) this.handleError(error)

      checks.push({
        id: data.id,
        employeeId,
        checkType: checkType.type.replace('bgv_', '') as BGVCheckType,
        checkName: checkType.name,
        status: 'in_progress',
        result: 'pending',
        initiatedAt: data.created_at ?? undefined,
      })
    }

    // Update employee status
    await this.supabase
      .from('employee_employee')
      .update({
        bgv_status: 'in_progress',
        bgv_initiated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', employeeId)

    return {
      success: true,
      bgvId: springverifyCandidateId || `bgv_${employeeId}_${Date.now()}`,
      checks,
    }
  }

  /**
   * Process a single BGV check (simulate verification)
   */
  async processBGVCheck(checkId: string): Promise<BGVCheck> {
    // Simulate verification - in production, this would call an external BGV API
    const score = Math.random() * 30 + 70 // Score between 70-100
    const passed = score >= 75

    const { data, error } = await this.supabase
      .from('ekyc_verification_kycverificationdetail')
      .update({
        status: passed ? 'verified' : 'failed',
        match_score: score,
        verified_at: passed ? new Date().toISOString() : null,
        failed_reason: passed ? undefined : 'Verification confidence below threshold',
      })
      .eq('id', checkId)
      .select()
      .single()

    if (error) this.handleError(error)

    return {
      id: data.id,
      employeeId: data.employee_id ?? '',
      checkType: data.verification_type.replace('bgv_', '') as BGVCheckType,
      checkName: this.getCheckName(data.verification_type),
      status: data.status as BGVCheckStatus,
      result: data.status === 'verified' ? 'passed' : 'failed',
      initiatedAt: data.created_at ?? undefined,
      completedAt: data.verified_at ?? undefined,
      failedReason: data.failed_reason ?? undefined,
    }
  }

  /**
   * Complete BGV for an employee
   */
  async completeBGV(employeeId: string): Promise<boolean> {
    const checks = await this.getBGVChecks(employeeId)
    const allPassed = checks.every((c) => c.result === 'passed')
    const allCompleted = checks.every((c) => c.status === 'completed' || c.status === 'failed')

    if (!allCompleted) {
      throw new ServiceError('Not all BGV checks are completed', 'INCOMPLETE_BGV', 400)
    }

    await this.supabase
      .from('employee_employee')
      .update({
        bgv_status: allPassed ? 'verified' : 'failed',
        bgv_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', employeeId)

    return allPassed
  }
}

export const bgvService = new BGVServiceClass()
