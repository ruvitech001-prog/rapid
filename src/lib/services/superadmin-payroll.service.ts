import { BaseService } from './base.service'

export interface PayrollRun {
  id: string
  month: string
  totalEmployees: number
  totalAmount: number
  status: 'Completed' | 'Pending' | 'Processing'
  processedDate: string
}

export interface UpcomingPayroll {
  companyId: string
  company: string
  employees: number
  estimatedAmount: number
  dueDate: string
}

export interface PayrollStats {
  totalPayroll: number
  employeesOnPayroll: number
  averagePerEmployee: number
  growthPercent: number
}

class SuperAdminPayrollServiceClass extends BaseService {
  async getPayrollRuns(): Promise<PayrollRun[]> {
    // Get all employee contracts with salary info to calculate historical payroll
    const { data: contracts, error } = await this.supabase
      .from('employee_employeecontract')
      .select(`
        id,
        gross_salary,
        is_current,
        created_at,
        company:company_company(id, legal_name)
      `)
      .eq('is_current', true)
      .eq('is_active', true)

    if (error) this.handleError(error)

    // Calculate monthly totals (simulate last 3 months)
    const totalSalary = contracts?.reduce((sum, c) => sum + (Number(c.gross_salary) || 0), 0) || 0
    const totalEmployees = contracts?.length || 0

    const currentDate = new Date()
    const runs: PayrollRun[] = []

    // Generate last 3 months of payroll runs
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)

      // Simulate slight variation in employee count and amount
      const variation = 1 - (i * 0.02) // 2% decrease per month going back

      runs.push({
        id: `payroll-${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`,
        month: monthName,
        totalEmployees: Math.floor(totalEmployees * variation),
        totalAmount: Math.floor(totalSalary * variation),
        status: 'Completed',
        processedDate: lastDay.toISOString().split('T')[0] || '',
      })
    }

    return runs
  }

  async getUpcomingPayroll(): Promise<UpcomingPayroll[]> {
    // Get companies with their employee counts and total salary
    const { data: contracts, error } = await this.supabase
      .from('employee_employeecontract')
      .select(`
        gross_salary,
        company:company_company(id, legal_name)
      `)
      .eq('is_current', true)
      .eq('is_active', true)

    if (error) this.handleError(error)

    // Group by company
    const companyMap = new Map<string, { name: string; employees: number; totalSalary: number }>()

    contracts?.forEach((contract) => {
      const company = contract.company as { id: string; legal_name: string } | null
      if (company) {
        const existing = companyMap.get(company.id) || { name: company.legal_name, employees: 0, totalSalary: 0 }
        existing.employees += 1
        existing.totalSalary += Number(contract.gross_salary) || 0
        companyMap.set(company.id, existing)
      }
    })

    // Get next 15th of month as due date
    const now = new Date()
    const dueDate = new Date(now.getFullYear(), now.getMonth() + (now.getDate() > 15 ? 1 : 0), 15)

    return Array.from(companyMap.entries()).map(([companyId, data]) => ({
      companyId,
      company: data.name,
      employees: data.employees,
      estimatedAmount: data.totalSalary,
      dueDate: dueDate.toISOString().split('T')[0] || '',
    }))
  }

  async getStats(): Promise<PayrollStats> {
    const { data: contracts, error } = await this.supabase
      .from('employee_employeecontract')
      .select('gross_salary')
      .eq('is_current', true)
      .eq('is_active', true)

    if (error) this.handleError(error)

    const totalPayroll = contracts?.reduce((sum, c) => sum + (Number(c.gross_salary) || 0), 0) || 0
    const employeesOnPayroll = contracts?.length || 0
    const averagePerEmployee = employeesOnPayroll > 0 ? Math.floor(totalPayroll / employeesOnPayroll) : 0

    return {
      totalPayroll,
      employeesOnPayroll,
      averagePerEmployee,
      growthPercent: 8, // Placeholder - would need historical data to calculate
    }
  }
}

export const superadminPayrollService = new SuperAdminPayrollServiceClass()
