'use client'

import { BaseService } from './base.service'

export interface EmployeeFinanceDetails {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string | null
  email: string | null
  companyName: string | null
  financialYear: string
  taxRegime: 'old' | 'new'
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  totalDeductions: number
  submittedAt: string | null
  approvedAt: string | null
  createdAt: string
}

export interface TaxProof {
  id: string
  employeeId: string
  employeeName: string
  documentType: string
  fileName: string
  fileSize: number | null
  category: string | null
  status: 'pending' | 'verified' | 'rejected'
  verifiedAt: string | null
  createdAt: string
}

export interface FinanceStats {
  totalDeclarations: number
  pendingDeclarations: number
  approvedDeclarations: number
  oldRegimeCount: number
  newRegimeCount: number
  pendingProofs: number
  verifiedProofs: number
  totalDeductionsDeclared: number
}

export interface FinanceFilters {
  financialYear?: string
  status?: string
  taxRegime?: string
  companyId?: string
  page?: number
  limit?: number
}

export interface PaginatedFinanceResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class SuperAdminFinanceServiceClass extends BaseService {
  /**
   * Get all employee finance declarations
   */
  async getDeclarations(filters?: FinanceFilters): Promise<PaginatedFinanceResponse<EmployeeFinanceDetails>> {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 20
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('employee_investmentdeclaration')
      .select(`
        *,
        employee:employee_employee(
          id,
          full_name,
          employee_code,
          user:users_user(email),
          contracts:employee_employeecontract(
            company:company_company(display_name, legal_name)
          )
        )
      `, { count: 'exact' })

    if (filters?.financialYear) {
      query = query.eq('financial_year', filters.financialYear)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.taxRegime) {
      query = query.eq('tax_regime', filters.taxRegime)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) this.handleError(error)

    const declarations = (data || []).map(dec => this.mapDeclarationFromDb(dec))

    return {
      data: declarations,
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    }
  }

  /**
   * Get declaration by ID
   */
  async getDeclarationById(id: string): Promise<EmployeeFinanceDetails> {
    const { data, error } = await this.supabase
      .from('employee_investmentdeclaration')
      .select(`
        *,
        employee:employee_employee(
          id,
          full_name,
          employee_code,
          user:users_user(email),
          contracts:employee_employeecontract(
            company:company_company(display_name, legal_name)
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) this.handleError(error)

    return this.mapDeclarationFromDb(data)
  }

  /**
   * Update declaration status (approve/reject)
   */
  async updateDeclarationStatus(
    id: string,
    status: 'approved' | 'rejected',
    reason?: string
  ): Promise<void> {
    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'approved') {
      updates.approved_at = new Date().toISOString()
    }

    const { error } = await this.supabase
      .from('employee_investmentdeclaration')
      .update(updates)
      .eq('id', id)

    if (error) this.handleError(error)
  }

  /**
   * Get tax proofs for review
   */
  async getTaxProofs(filters?: { status?: string; page?: number; limit?: number }): Promise<PaginatedFinanceResponse<TaxProof>> {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 20
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('commons_document')
      .select(`
        *,
        employee:employee_employee(
          id,
          full_name,
          employee_code
        )
      `, { count: 'exact' })
      .eq('document_category', 'tax_proof')
      .eq('is_deleted', false)

    if (filters?.status) {
      query = query.eq('verification_status', filters.status)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) this.handleError(error)

    const proofs: TaxProof[] = (data || []).map(doc => ({
      id: doc.id,
      employeeId: doc.employee_id,
      employeeName: doc.employee?.full_name || 'Unknown',
      documentType: doc.document_type,
      fileName: doc.file_name,
      fileSize: doc.file_size,
      category: doc.document_category,
      status: doc.verification_status === 'verified' ? 'verified' : doc.verification_status === 'rejected' ? 'rejected' : 'pending',
      verifiedAt: doc.verified_at,
      createdAt: doc.created_at,
    }))

    return {
      data: proofs,
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    }
  }

  /**
   * Update tax proof verification status
   */
  async verifyTaxProof(documentId: string, status: 'verified' | 'rejected'): Promise<void> {
    const { error } = await this.supabase
      .from('commons_document')
      .update({
        verification_status: status,
        is_verified: status === 'verified',
        verified_at: status === 'verified' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (error) this.handleError(error)
  }

  /**
   * Get finance statistics
   */
  async getStats(financialYear?: string): Promise<FinanceStats> {
    const currentFY = financialYear || this.getCurrentFinancialYear()

    // Get declaration stats
    const { data: declarations, error: decError } = await this.supabase
      .from('employee_investmentdeclaration')
      .select('status, tax_regime, section_80c_lic, section_80c_ppf, section_80c_elss, section_80d_health_insurance')
      .eq('financial_year', currentFY)

    if (decError) this.handleError(decError)

    // Get tax proof stats
    const { data: proofs, error: proofError } = await this.supabase
      .from('commons_document')
      .select('verification_status')
      .eq('document_category', 'tax_proof')
      .eq('is_deleted', false)

    if (proofError) this.handleError(proofError)

    const decList = declarations || []
    const proofList = proofs || []

    // Calculate total deductions
    const totalDeductions = decList.reduce((sum, dec) => {
      return sum +
        Number(dec.section_80c_lic || 0) +
        Number(dec.section_80c_ppf || 0) +
        Number(dec.section_80c_elss || 0) +
        Number(dec.section_80d_health_insurance || 0)
    }, 0)

    return {
      totalDeclarations: decList.length,
      pendingDeclarations: decList.filter(d => d.status === 'submitted').length,
      approvedDeclarations: decList.filter(d => d.status === 'approved').length,
      oldRegimeCount: decList.filter(d => d.tax_regime === 'old').length,
      newRegimeCount: decList.filter(d => d.tax_regime === 'new').length,
      pendingProofs: proofList.filter(p => p.verification_status === 'unverified' || p.verification_status === 'pending').length,
      verifiedProofs: proofList.filter(p => p.verification_status === 'verified').length,
      totalDeductionsDeclared: totalDeductions,
    }
  }

  /**
   * Get current financial year string
   */
  private getCurrentFinancialYear(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    // Financial year in India runs from April to March
    if (month >= 4) {
      return `${year}-${year + 1}`
    } else {
      return `${year - 1}-${year}`
    }
  }

  /**
   * Map database row to declaration object
   */
  private mapDeclarationFromDb(data: Record<string, unknown>): EmployeeFinanceDetails {
    const employee = data.employee as Record<string, unknown> | null
    const user = employee?.user as Record<string, unknown> | null
    const contracts = employee?.contracts as Array<Record<string, unknown>> | null
    const company = contracts?.[0]?.company as Record<string, unknown> | null

    // Calculate total deductions
    const totalDeductions =
      Number(data.section_80c_lic || 0) +
      Number(data.section_80c_ppf || 0) +
      Number(data.section_80c_elss || 0) +
      Number(data.section_80c_nsc || 0) +
      Number(data.section_80c_home_loan_principal || 0) +
      Number(data.section_80c_tuition_fees || 0) +
      Number(data.section_80c_ulip || 0) +
      Number(data.section_80c_fd || 0) +
      Number(data.section_80d_health_insurance || 0) +
      Number(data.section_80e_education_loan || 0) +
      Number(data.section_80g_donations || 0) +
      Number(data.section_80tta_savings_interest || 0) +
      Number(data.section_24b_home_loan_interest || 0)

    return {
      id: String(data.id),
      employeeId: String(employee?.id || ''),
      employeeName: String(employee?.full_name || 'Unknown'),
      employeeCode: employee?.employee_code ? String(employee.employee_code) : null,
      email: user?.email ? String(user.email) : null,
      companyName: company?.display_name ? String(company.display_name) : company?.legal_name ? String(company.legal_name) : null,
      financialYear: String(data.financial_year),
      taxRegime: data.tax_regime as 'old' | 'new',
      status: data.status as 'draft' | 'submitted' | 'approved' | 'rejected',
      totalDeductions,
      submittedAt: data.submitted_at ? String(data.submitted_at) : null,
      approvedAt: data.approved_at ? String(data.approved_at) : null,
      createdAt: String(data.created_at),
    }
  }
}

export const superadminFinanceService = new SuperAdminFinanceServiceClass()
