import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type EmployeeContract = Tables<'employee_employeecontract'>

// Type definitions for payroll tables (not yet in generated types)
// These will be available after running migrations and regenerating types
// Kept as reference for the expected table structure:
// - payroll_run: id, company_id, pay_period_month, pay_period_year, status, totals, timestamps
// - payroll_run_detail: id, payroll_run_id, employee_id, salary components, deductions, status

export interface PayslipData {
  month: string
  year: number
  employeeId: string
  employeeName: string
  employeeCode: string
  designation: string
  department: string
  // Earnings
  basicSalary: number
  hra: number
  lta: number
  medicalAllowance: number
  specialAllowance: number
  telephoneAllowance: number
  performanceBonus: number
  // Deductions
  epfEmployee: number
  esicEmployee: number
  professionalTax: number
  incomeTax: number
  // Totals
  grossEarnings: number
  totalDeductions: number
  netPay: number
}

export interface PayrollSummary {
  month: string
  amount: number
  employeeCount: number
}

export interface EmployeePayrollHistory {
  month: string
  year: number
  netPay: number
  grossPay: number
  deductions: number
}

export interface EmployeePayrollData {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string
  basicSalary: number
  hra: number
  lta: number
  allowances: number
  grossSalary: number
  epfEmployee: number
  esicEmployee: number
  professionalTax: number
  incomeTax: number
  deductions: number
  netSalary: number
  status: 'pending' | 'processed' | 'failed'
}

export interface PayrollRun {
  id: string
  companyId: string
  month: string
  year: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  totalGross: number
  totalDeductions: number
  totalNet: number
  employeeCount: number
  createdAt: string
  processedAt?: string
}

class PayrollServiceClass extends BaseService {
  // Get payroll history for last N months for an employee
  async getEmployeePayrollHistory(
    employeeId: string,
    months: number = 6
  ): Promise<EmployeePayrollHistory[]> {
    // Get employee's current contract for salary info
    const { data: contract, error } = await this.supabase
      .from('employee_employeecontract')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    if (error && error.code !== 'PGRST116') this.handleError(error)

    if (!contract) return []

    // Generate payroll history based on contract data
    const history: EmployeePayrollHistory[] = []
    const now = new Date()

    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthlyGross = contract.gross_salary
      const deductions =
        (contract.epf_employee || 0) +
        (contract.esic_employee || 0) +
        (contract.professional_tax || 0)
      const netPay = monthlyGross - deductions

      // Only include months after contract start date
      const contractStart = new Date(contract.start_date)
      if (date >= contractStart) {
        history.push({
          month: date.toLocaleString('default', { month: 'short' }),
          year: date.getFullYear(),
          netPay,
          grossPay: monthlyGross,
          deductions,
        })
      }
    }

    return history.reverse()
  }

  // Get current payslip for an employee
  async getCurrentPayslip(employeeId: string): Promise<PayslipData | null> {
    // Get employee details
    const { data: employee, error: empError } = await this.supabase
      .from('employee_employee')
      .select('id, full_name, employee_code')
      .eq('id', employeeId)
      .single()

    if (empError && empError.code !== 'PGRST116') this.handleError(empError)
    if (!employee) return null

    // Get current contract
    const { data: contract, error: contractError } = await this.supabase
      .from('employee_employeecontract')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    if (contractError && contractError.code !== 'PGRST116')
      this.handleError(contractError)
    if (!contract) return null

    const now = new Date()
    const grossEarnings =
      contract.basic_salary +
      (contract.hra || 0) +
      (contract.lta || 0) +
      (contract.medical_allowance || 0) +
      (contract.special_allowance || 0) +
      (contract.telephone_allowance || 0)

    const totalDeductions =
      (contract.epf_employee || 0) +
      (contract.esic_employee || 0) +
      (contract.professional_tax || 0)

    // Estimate income tax (simplified - actual would be based on tax regime)
    const annualTaxableIncome = contract.ctc - (contract.epf_employee || 0) * 12
    const estimatedAnnualTax = this.calculateIncomeTax(annualTaxableIncome)
    const monthlyIncomeTax = Math.round(estimatedAnnualTax / 12)

    return {
      month: now.toLocaleString('default', { month: 'long' }),
      year: now.getFullYear(),
      employeeId: employee.id,
      employeeName: employee.full_name,
      employeeCode: employee.employee_code || '',
      designation: contract.designation,
      department: contract.department || '',
      basicSalary: contract.basic_salary,
      hra: contract.hra || 0,
      lta: contract.lta || 0,
      medicalAllowance: contract.medical_allowance || 0,
      specialAllowance: contract.special_allowance || 0,
      telephoneAllowance: contract.telephone_allowance || 0,
      performanceBonus: contract.performance_bonus || 0,
      epfEmployee: contract.epf_employee || 0,
      esicEmployee: contract.esic_employee || 0,
      professionalTax: contract.professional_tax || 0,
      incomeTax: monthlyIncomeTax,
      grossEarnings,
      totalDeductions: totalDeductions + monthlyIncomeTax,
      netPay: grossEarnings - totalDeductions - monthlyIncomeTax,
    }
  }

  // Simple tax calculation (old regime approximation)
  private calculateIncomeTax(annualIncome: number): number {
    if (annualIncome <= 250000) return 0
    if (annualIncome <= 500000) return (annualIncome - 250000) * 0.05
    if (annualIncome <= 1000000)
      return 12500 + (annualIncome - 500000) * 0.2
    return 12500 + 100000 + (annualIncome - 1000000) * 0.3
  }

  // Get company payroll summary for last N months
  async getCompanyPayrollSummary(
    companyId: string,
    months: number = 6
  ): Promise<PayrollSummary[]> {
    // Get all active employee contracts for this company
    const { data: contracts, error } = await this.supabase
      .from('employee_employeecontract')
      .select('gross_salary, start_date')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    if (error) this.handleError(error)

    const summary: PayrollSummary[] = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = date.toLocaleString('default', { month: 'short' })

      // Count active employees for that month
      let totalAmount = 0
      let employeeCount = 0

      contracts?.forEach((contract) => {
        const startDate = new Date(contract.start_date)
        if (startDate <= date) {
          totalAmount += contract.gross_salary
          employeeCount++
        }
      })

      summary.push({
        month: monthStr,
        amount: totalAmount,
        employeeCount,
      })
    }

    return summary
  }

  // Get total payroll cost for a company
  async getTotalPayrollCost(companyId: string): Promise<{
    monthly: number
    annual: number
    employeeCount: number
  }> {
    const { data: contracts, error } = await this.supabase
      .from('employee_employeecontract')
      .select('ctc, gross_salary')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    if (error) this.handleError(error)

    const monthly =
      contracts?.reduce((sum, c) => sum + c.gross_salary, 0) || 0
    const annual = contracts?.reduce((sum, c) => sum + c.ctc, 0) || 0

    return {
      monthly,
      annual,
      employeeCount: contracts?.length || 0,
    }
  }

  // Get all employees for payroll processing
  async getEmployeesForPayroll(
    companyId: string,
    _month?: number,
    _year?: number
  ): Promise<EmployeePayrollData[]> {
    // Get all active employee contracts for this company
    const { data: contracts, error } = await this.supabase
      .from('employee_employeecontract')
      .select(`
        id,
        employee_id,
        basic_salary,
        hra,
        lta,
        medical_allowance,
        special_allowance,
        telephone_allowance,
        epf_employee,
        esic_employee,
        professional_tax,
        ctc,
        gross_salary,
        employee:employee_employee!employee_employeecontract_employee_id_fkey (
          id,
          full_name,
          employee_code
        )
      `)
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    if (error) this.handleError(error)
    if (!contracts || contracts.length === 0) return []

    return contracts.map((contract) => {
      // Type assertion for the nested employee object
      const employee = contract.employee as unknown as { id: string; full_name: string; employee_code: string | null }

      const allowances =
        (contract.hra || 0) +
        (contract.lta || 0) +
        (contract.medical_allowance || 0) +
        (contract.special_allowance || 0) +
        (contract.telephone_allowance || 0)

      const deductions =
        (contract.epf_employee || 0) +
        (contract.esic_employee || 0) +
        (contract.professional_tax || 0)

      // Estimate income tax
      const annualTaxableIncome = (contract.ctc || 0) - (contract.epf_employee || 0) * 12
      const estimatedAnnualTax = this.calculateIncomeTax(annualTaxableIncome)
      const monthlyIncomeTax = Math.round(estimatedAnnualTax / 12)

      const totalDeductions = deductions + monthlyIncomeTax
      const grossSalary = contract.gross_salary || (contract.basic_salary + allowances)
      const netSalary = grossSalary - totalDeductions

      return {
        id: contract.id,
        employeeId: contract.employee_id ?? '',
        employeeName: employee?.full_name || 'Unknown',
        employeeCode: employee?.employee_code || '',
        basicSalary: contract.basic_salary,
        hra: contract.hra || 0,
        lta: contract.lta || 0,
        allowances,
        grossSalary,
        epfEmployee: contract.epf_employee || 0,
        esicEmployee: contract.esic_employee || 0,
        professionalTax: contract.professional_tax || 0,
        incomeTax: monthlyIncomeTax,
        deductions: totalDeductions,
        netSalary,
        status: 'pending' as const,
      }
    })
  }

  // Process payroll for a company - stores in database
  async processPayroll(
    companyId: string,
    month: number,
    year: number,
    employeeData: EmployeePayrollData[]
  ): Promise<PayrollRun> {
    const totalGross = employeeData.reduce((sum, e) => sum + e.grossSalary, 0)
    const totalDeductions = employeeData.reduce((sum, e) => sum + e.deductions, 0)
    const totalNet = employeeData.reduce((sum, e) => sum + e.netSalary, 0)
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' })

    // Check if payroll already exists for this month
    // Note: Using type assertion as payroll_run table may not be in generated types yet
    const { data: existingRun } = await (this.supabase as unknown as SupabaseClient)
      .from('payroll_run')
      .select('id')
      .eq('company_id', companyId)
      .eq('pay_period_month', month + 1) // DB uses 1-indexed months
      .eq('pay_period_year', year)
      .single()

    if (existingRun) {
      throw new Error(`Payroll already processed for ${monthName} ${year}`)
    }

    // Create payroll run record in database
    const { data: payrollRun, error: runError } = await (this.supabase as unknown as SupabaseClient)
      .from('payroll_run')
      .insert({
        company_id: companyId,
        pay_period_month: month + 1, // DB uses 1-indexed months
        pay_period_year: year,
        pay_period_start: new Date(year, month, 1).toISOString().split('T')[0],
        pay_period_end: new Date(year, month + 1, 0).toISOString().split('T')[0],
        status: 'processing',
        total_employees: employeeData.length,
        total_gross_amount: totalGross,
        total_deductions: totalDeductions,
        total_net_amount: totalNet,
      })
      .select()
      .single()

    if (runError) {
      console.error('Failed to create payroll run:', runError)
      throw new Error('Failed to create payroll run')
    }

    // Insert payroll details for each employee
    const detailsToInsert = employeeData.map((emp) => ({
      payroll_run_id: payrollRun.id,
      employee_id: emp.employeeId,
      basic_salary: emp.basicSalary,
      hra: emp.hra,
      lta: emp.lta,
      special_allowance: emp.allowances - emp.hra - emp.lta,
      gross_salary: emp.grossSalary,
      epf_employee: emp.epfEmployee,
      esic_employee: emp.esicEmployee,
      professional_tax: emp.professionalTax,
      income_tax: emp.incomeTax,
      total_deductions: emp.deductions,
      net_salary: emp.netSalary,
      status: 'processed',
    }))

    const { error: detailsError } = await (this.supabase as unknown as SupabaseClient)
      .from('payroll_run_detail')
      .insert(detailsToInsert)

    if (detailsError) {
      console.error('Failed to insert payroll details:', detailsError)
      // Mark the run as failed
      await (this.supabase as unknown as SupabaseClient)
        .from('payroll_run')
        .update({ status: 'failed' })
        .eq('id', payrollRun.id)
      throw new Error('Failed to process employee payroll details')
    }

    // Mark payroll run as completed
    const { data: completedRun, error: updateError } = await (this.supabase as unknown as SupabaseClient)
      .from('payroll_run')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .eq('id', payrollRun.id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to mark payroll as completed:', updateError)
    }

    const finalRun = completedRun || payrollRun

    return {
      id: finalRun.id,
      companyId: finalRun.company_id,
      month: monthName,
      year: finalRun.pay_period_year,
      status: finalRun.status as PayrollRun['status'],
      totalGross: Number(finalRun.total_gross_amount),
      totalDeductions: Number(finalRun.total_deductions),
      totalNet: Number(finalRun.total_net_amount),
      employeeCount: finalRun.total_employees,
      createdAt: finalRun.created_at,
      processedAt: finalRun.processed_at || undefined,
    }
  }

  // Get payroll runs for a company from database
  async getPayrollRuns(companyId: string): Promise<PayrollRun[]> {
    const { data: runs, error } = await (this.supabase as unknown as SupabaseClient)
      .from('payroll_run')
      .select('*')
      .eq('company_id', companyId)
      .order('pay_period_year', { ascending: false })
      .order('pay_period_month', { ascending: false })

    if (error) {
      console.error('Failed to fetch payroll runs:', error)
      return []
    }

    return (runs || []).map((run) => ({
      id: run.id,
      companyId: run.company_id,
      month: new Date(run.pay_period_year, run.pay_period_month - 1).toLocaleString('default', { month: 'long' }),
      year: run.pay_period_year,
      status: run.status as PayrollRun['status'],
      totalGross: Number(run.total_gross_amount),
      totalDeductions: Number(run.total_deductions),
      totalNet: Number(run.total_net_amount),
      employeeCount: run.total_employees,
      createdAt: run.created_at,
      processedAt: run.processed_at || undefined,
    }))
  }

  // Get payroll run details for a specific run
  async getPayrollRunDetails(runId: string): Promise<EmployeePayrollData[]> {
    const { data: details, error } = await (this.supabase as unknown as SupabaseClient)
      .from('payroll_run_detail')
      .select(`
        *,
        employee:employee_employee!payroll_run_detail_employee_id_fkey (
          id,
          full_name,
          employee_code
        )
      `)
      .eq('payroll_run_id', runId)

    if (error) {
      console.error('Failed to fetch payroll details:', error)
      return []
    }

    return (details || []).map((detail) => {
      const employee = detail.employee as unknown as { id: string; full_name: string; employee_code: string | null }
      return {
        id: detail.id,
        employeeId: detail.employee_id,
        employeeName: employee?.full_name || 'Unknown',
        employeeCode: employee?.employee_code || '',
        basicSalary: Number(detail.basic_salary),
        hra: Number(detail.hra),
        lta: Number(detail.lta),
        allowances: Number(detail.hra) + Number(detail.lta) + Number(detail.special_allowance || 0),
        grossSalary: Number(detail.gross_salary),
        epfEmployee: Number(detail.epf_employee),
        esicEmployee: Number(detail.esic_employee),
        professionalTax: Number(detail.professional_tax),
        incomeTax: Number(detail.income_tax),
        deductions: Number(detail.total_deductions),
        netSalary: Number(detail.net_salary),
        status: detail.status as EmployeePayrollData['status'],
      }
    })
  }
}

export const payrollService = new PayrollServiceClass()
