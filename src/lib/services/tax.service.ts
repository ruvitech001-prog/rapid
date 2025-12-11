import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'

export type InvestmentDeclaration = Tables<'employee_investmentdeclaration'>

export interface TaxSummary {
  financialYear: string
  taxRegime: string
  grossSalary: number
  totalDeductions: number
  taxableIncome: number
  totalTax: number
  tdsDeducted: number
  taxPayable: number
}

export interface TaxDeclarationDeadline {
  financialYear: string
  deadline: Date
  isWindowOpen: boolean
  daysRemaining: number
  windowStartDate: Date
  windowEndDate: Date
  declarationStatus: 'not_started' | 'draft' | 'submitted' | 'verified'
}

export interface Form16Availability {
  available: boolean
  financialYears: string[]
  latestYear?: string
}

export interface TaxProof {
  id: string
  employeeId: string
  financialYear: string
  category: string
  subCategory: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
  verifiedAt?: string
  verifiedBy?: string
  rejectionReason?: string
}

export interface Form16Data {
  employeeName: string
  employeeCode: string
  pan: string
  employerName: string
  employerTan: string
  financialYear: string
  assessmentYear: string
  grossSalary: number
  allowances: {
    hra: number
    lta: number
    special: number
    medical: number
  }
  deductions: {
    section80C: number
    section80D: number
    section80E: number
    section80G: number
    section24b: number
    standardDeduction: number
  }
  taxableIncome: number
  taxPayable: number
  tdsDeducted: number
  netTaxPayable: number
}

class TaxServiceClass extends BaseService {
  // Get investment declaration for an employee
  async getDeclaration(
    employeeId: string,
    financialYear?: string
  ): Promise<InvestmentDeclaration | null> {
    const year = financialYear || this.getCurrentFinancialYear()

    const { data, error } = await this.supabase
      .from('employee_investmentdeclaration')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('financial_year', year)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }
    return data
  }

  // Get all declarations for an employee (history)
  async getDeclarationHistory(
    employeeId: string
  ): Promise<InvestmentDeclaration[]> {
    const { data, error } = await this.supabase
      .from('employee_investmentdeclaration')
      .select('*')
      .eq('employee_id', employeeId)
      .order('financial_year', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  // Get Form 16 data
  async getForm16(
    employeeId: string,
    financialYear?: string
  ): Promise<Form16Data | null> {
    const year = financialYear || this.getPreviousFinancialYear()

    // Get employee details
    const { data: employee } = await this.supabase
      .from('employee_employee')
      .select('full_name, employee_code, pan_number')
      .eq('id', employeeId)
      .single()

    if (!employee) return null

    // Get contract details
    const { data: contract } = await this.supabase
      .from('employee_employeecontract')
      .select('*, company:company_company(legal_name, pan)')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    if (!contract) return null

    // Get declaration
    const { data: declaration } = await this.supabase
      .from('employee_investmentdeclaration')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('financial_year', year)
      .single()

    // Calculate values from contract
    const grossSalary = (contract.gross_salary || 0) * 12
    const hra = (contract.hra || 0) * 12
    const lta = (contract.lta || 0) * 12
    const special = (contract.special_allowance || 0) * 12
    const medical = (contract.medical_allowance || 0) * 12

    // Section 80C deductions
    const section80C = declaration
      ? (declaration.section_80c_ppf || 0) +
        (declaration.section_80c_elss || 0) +
        (declaration.section_80c_lic || 0) +
        (declaration.section_80c_tuition_fees || 0) +
        (declaration.section_80c_home_loan_principal || 0) +
        (declaration.section_80c_nsc || 0) +
        (declaration.section_80c_fd || 0) +
        (declaration.section_80c_ulip || 0)
      : 0

    const section80D = declaration?.section_80d_health_insurance || 0
    const section80E = declaration?.section_80e_education_loan || 0
    const section80G = declaration?.section_80g_donations || 0
    const section24b = declaration?.section_24b_home_loan_interest || 0
    const standardDeduction = 50000 // Standard deduction

    const totalDeductions =
      Math.min(section80C, 150000) + // 80C capped at 1.5L
      Math.min(section80D, 25000) + // 80D capped at 25K
      section80E +
      section80G +
      Math.min(section24b, 200000) + // Home loan interest capped at 2L
      standardDeduction

    const taxableIncome = Math.max(0, grossSalary - totalDeductions)

    // Calculate tax based on old regime (simplified)
    const taxPayable = this.calculateTax(taxableIncome)

    // TDS is spread across 12 months
    const tdsDeducted = taxPayable

    const companyData = contract.company as { legal_name: string; pan: string | null } | null

    return {
      employeeName: employee.full_name,
      employeeCode: employee.employee_code || '',
      pan: employee.pan_number || '',
      employerName: companyData?.legal_name || '',
      employerTan: companyData?.pan || '', // Using PAN as placeholder
      financialYear: year,
      assessmentYear: this.getAssessmentYear(year),
      grossSalary,
      allowances: {
        hra,
        lta,
        special,
        medical,
      },
      deductions: {
        section80C: Math.min(section80C, 150000),
        section80D: Math.min(section80D, 25000),
        section80E,
        section80G,
        section24b: Math.min(section24b, 200000),
        standardDeduction,
      },
      taxableIncome,
      taxPayable,
      tdsDeducted,
      netTaxPayable: taxPayable - tdsDeducted,
    }
  }

  // Get tax summary
  async getTaxSummary(
    employeeId: string,
    financialYear?: string
  ): Promise<TaxSummary | null> {
    const year = financialYear || this.getCurrentFinancialYear()

    // Get contract
    const { data: contract } = await this.supabase
      .from('employee_employeecontract')
      .select('gross_salary')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    if (!contract) return null

    // Get declaration
    const declaration = await this.getDeclaration(employeeId, year)

    const grossSalary = (contract.gross_salary || 0) * 12
    const totalDeductions = declaration
      ? this.calculateTotalDeductions(declaration)
      : 50000 // Standard deduction only
    const taxableIncome = Math.max(0, grossSalary - totalDeductions)
    const totalTax = this.calculateTax(taxableIncome)

    // Calculate TDS deducted so far (based on months passed)
    const monthsPassed = this.getMonthsInCurrentFY()
    const monthlyTds = totalTax / 12
    const tdsDeducted = Math.round(monthlyTds * monthsPassed)

    return {
      financialYear: year,
      taxRegime: declaration?.tax_regime || 'old',
      grossSalary,
      totalDeductions,
      taxableIncome,
      totalTax,
      tdsDeducted,
      taxPayable: totalTax - tdsDeducted,
    }
  }

  // Save/update investment declaration
  async saveDeclaration(
    employeeId: string,
    declaration: Partial<InvestmentDeclaration>
  ): Promise<InvestmentDeclaration> {
    const year = declaration.financial_year || this.getCurrentFinancialYear()

    // Check if exists
    const existing = await this.getDeclaration(employeeId, year)

    if (existing) {
      const { data, error } = await this.supabase
        .from('employee_investmentdeclaration')
        .update({
          ...declaration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    } else {
      const { data, error } = await this.supabase
        .from('employee_investmentdeclaration')
        .insert({
          employee_id: employeeId,
          financial_year: year,
          tax_regime: 'old',
          status: 'draft',
          ...declaration,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    }
  }

  // Submit declaration
  async submitDeclaration(declarationId: string): Promise<InvestmentDeclaration> {
    const { data, error } = await this.supabase
      .from('employee_investmentdeclaration')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', declarationId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  /**
   * Get tax declaration deadline and window status
   *
   * Indian Tax Declaration Windows:
   * - Initial declaration: April to February (typically mid-February deadline)
   * - Proof submission: December (usually December 31st)
   * - Financial Year runs April 1 to March 31
   */
  async getTaxDeclarationDeadline(
    employeeId: string,
    financialYear?: string
  ): Promise<TaxDeclarationDeadline> {
    const year = financialYear || this.getCurrentFinancialYear()
    const parts = year.split('-')
    const startYear = parseInt(parts[0]!, 10)

    // Declaration window: April 1 to February 28
    const windowStartDate = new Date(startYear, 3, 1) // April 1
    const windowEndDate = new Date(startYear + 1, 1, 28) // February 28

    // Standard deadline: Last week of February (28th)
    const deadline = new Date(startYear + 1, 1, 28)

    const now = new Date()
    const isWindowOpen = now >= windowStartDate && now <= windowEndDate

    // Calculate days remaining
    const timeDiff = deadline.getTime() - now.getTime()
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)))

    // Get declaration status
    const declaration = await this.getDeclaration(employeeId, year)
    let declarationStatus: TaxDeclarationDeadline['declarationStatus'] = 'not_started'
    if (declaration) {
      declarationStatus = declaration.status as TaxDeclarationDeadline['declarationStatus']
    }

    return {
      financialYear: year,
      deadline,
      isWindowOpen,
      daysRemaining,
      windowStartDate,
      windowEndDate,
      declarationStatus,
    }
  }

  /**
   * Check Form16 availability
   * Form16 is typically available after June 15 for the previous financial year
   */
  async getForm16Availability(employeeId: string): Promise<Form16Availability> {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const availableYears: string[] = []

    // Form16 for previous FY is available after June 15
    // Check for past 3 financial years
    for (let i = 1; i <= 3; i++) {
      let fyStartYear: number

      if (currentMonth >= 5) {
        // After June, previous FY's Form16 should be available
        fyStartYear = currentYear - i
      } else if (currentMonth >= 3) {
        // April-May: Previous FY Form16 may not be ready yet
        fyStartYear = currentYear - i - 1
      } else {
        // Jan-March: Still in previous calendar year's FY
        fyStartYear = currentYear - i - 1
      }

      if (fyStartYear >= 2020) {
        availableYears.push(`${fyStartYear}-${fyStartYear + 1}`)
      }
    }

    // Verify actual availability by checking if declaration exists
    const { data: declarations } = await this.supabase
      .from('employee_investmentdeclaration')
      .select('financial_year')
      .eq('employee_id', employeeId)
      .eq('status', 'verified')
      .in('financial_year', availableYears)

    const verifiedYears = declarations?.map(d => d.financial_year) || []

    // For demo, assume Form16 is available for previous years
    const financialYears = availableYears.filter(fy => {
      const fyStartYear = parseInt(fy.split('-')[0]!, 10)
      const form16AvailableDate = new Date(fyStartYear + 1, 5, 15) // June 15
      return now >= form16AvailableDate || verifiedYears.includes(fy)
    })

    return {
      available: financialYears.length > 0,
      financialYears,
      latestYear: financialYears[0],
    }
  }

  // Helper methods
  private getCurrentFinancialYear(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    // FY starts in April
    if (month >= 3) {
      return `${year}-${year + 1}`
    }
    return `${year - 1}-${year}`
  }

  private getPreviousFinancialYear(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    if (month >= 3) {
      return `${year - 1}-${year}`
    }
    return `${year - 2}-${year - 1}`
  }

  private getAssessmentYear(fy: string): string {
    const parts = fy.split('-')
    const endYear = parts.length > 1 ? parseInt(parts[1]!, 10) : 0
    // Handle NaN case - default to current year + 1
    const safeEndYear = isNaN(endYear) ? new Date().getFullYear() + 1 : endYear
    return `${safeEndYear}-${safeEndYear + 1}`
  }

  private getMonthsInCurrentFY(): number {
    const now = new Date()
    const month = now.getMonth()
    // April = 0 months, May = 1 month, etc.
    if (month >= 3) {
      return month - 2
    }
    return month + 10
  }

  private calculateTotalDeductions(declaration: InvestmentDeclaration): number {
    const section80C =
      (declaration.section_80c_ppf || 0) +
      (declaration.section_80c_elss || 0) +
      (declaration.section_80c_lic || 0) +
      (declaration.section_80c_tuition_fees || 0) +
      (declaration.section_80c_home_loan_principal || 0) +
      (declaration.section_80c_nsc || 0) +
      (declaration.section_80c_fd || 0) +
      (declaration.section_80c_ulip || 0)

    return (
      50000 + // Standard deduction
      Math.min(section80C, 150000) +
      Math.min(declaration.section_80d_health_insurance || 0, 25000) +
      (declaration.section_80e_education_loan || 0) +
      (declaration.section_80g_donations || 0) +
      Math.min(declaration.section_24b_home_loan_interest || 0, 200000) +
      (declaration.hra_exemption || 0)
    )
  }

  private calculateTax(taxableIncome: number): number {
    // Old regime tax slabs for FY 2024-25
    if (taxableIncome <= 250000) return 0
    if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05
    if (taxableIncome <= 1000000)
      return 12500 + (taxableIncome - 500000) * 0.2
    return 12500 + 100000 + (taxableIncome - 1000000) * 0.3
  }

  /**
   * Upload a tax proof document
   */
  async uploadTaxProof(
    employeeId: string,
    file: File,
    category: string,
    subCategory: string,
    financialYear?: string
  ): Promise<TaxProof> {
    const year = financialYear || this.getCurrentFinancialYear()
    const timestamp = Date.now()
    const fileName = `${category}_${subCategory}_${timestamp}_${file.name}`.replace(/\s+/g, '_')
    const storagePath = `tax-proofs/${employeeId}/${year}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await this.supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Failed to upload tax proof: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from('documents')
      .getPublicUrl(storagePath)

    // Create record in database
    const { data, error } = await this.supabase
      .from('commons_document')
      .insert({
        employee_id: employeeId,
        document_type: 'tax_proof',
        document_category: category,
        document_subcategory: subCategory,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_bucket: 'documents',
        storage_path: storagePath,
        storage_url: publicUrl,
        financial_year: year,
        verification_status: 'pending',
      })
      .select()
      .single()

    if (error) this.handleError(error)

    return {
      id: data.id,
      employeeId,
      financialYear: year,
      category,
      subCategory,
      fileName: file.name,
      fileUrl: publicUrl,
      uploadedAt: data.created_at,
      status: 'pending',
    }
  }

  /**
   * Get all tax proofs for an employee
   */
  async getTaxProofs(
    employeeId: string,
    financialYear?: string
  ): Promise<TaxProof[]> {
    const year = financialYear || this.getCurrentFinancialYear()

    const { data, error } = await this.supabase
      .from('commons_document')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('document_type', 'tax_proof')
      .eq('financial_year', year)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)

    return (data || []).map(doc => ({
      id: doc.id,
      employeeId: doc.employee_id,
      financialYear: doc.financial_year || year,
      category: doc.document_category || '',
      subCategory: doc.document_subcategory || '',
      fileName: doc.file_name,
      fileUrl: doc.storage_url,
      uploadedAt: doc.created_at,
      status: (doc.verification_status || 'pending') as 'pending' | 'approved' | 'rejected',
      verifiedAt: doc.verified_at,
      verifiedBy: doc.verified_by,
      rejectionReason: doc.rejection_reason,
    }))
  }

  /**
   * Delete a tax proof
   */
  async deleteTaxProof(proofId: string): Promise<void> {
    // Get document to find storage path
    const { data: doc, error: fetchError } = await this.supabase
      .from('commons_document')
      .select('storage_path')
      .eq('id', proofId)
      .single()

    if (fetchError) this.handleError(fetchError)

    // Delete from storage
    if (doc?.storage_path) {
      await this.supabase.storage
        .from('documents')
        .remove([doc.storage_path])
    }

    // Delete from database
    const { error } = await this.supabase
      .from('commons_document')
      .delete()
      .eq('id', proofId)

    if (error) this.handleError(error)
  }

  /**
   * Download Form16 as PDF
   * Returns the URL to download from
   */
  async downloadForm16(
    employeeId: string,
    financialYear?: string
  ): Promise<string> {
    const year = financialYear || this.getPreviousFinancialYear()

    // Check if Form16 PDF exists in storage
    const storagePath = `form16/${employeeId}/${year}/form16.pdf`

    const { data: existingFile } = await this.supabase.storage
      .from('documents')
      .list(`form16/${employeeId}/${year}`)

    if (existingFile && existingFile.length > 0) {
      // Generate signed URL for download
      const { data, error } = await this.supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600) // 1 hour expiry

      if (error) {
        throw new Error(`Failed to generate download URL: ${error.message}`)
      }
      return data.signedUrl
    }

    // If no pre-generated PDF, generate one dynamically
    // In production, this would call a PDF generation service
    // For now, get the form16 data and return a data URL or trigger generation
    const form16Data = await this.getForm16(employeeId, year)

    if (!form16Data) {
      throw new Error(`Form 16 not available for FY ${year}`)
    }

    // Return a placeholder - in production this would generate/fetch actual PDF
    // For now, we'll throw an error indicating PDF generation is needed
    throw new Error('Form 16 PDF generation service not yet configured. Please contact HR.')
  }
}

export const taxService = new TaxServiceClass()
