import { BaseService } from './base.service'
import { employeesService } from './employees.service'
import { contractorsService } from './contractors.service'
import { leavesService } from './leaves.service'
import { expensesService } from './expenses.service'

export interface EmployerDashboardStats {
  employeeCount: number
  contractorCount: number
  pendingLeaveRequests: number
  pendingExpenseRequests: number
  totalPayrollCost: number
  recentHires: number
}

export interface EmployeeDashboardStats {
  leaveBalances: {
    type: string
    total: number
    taken: number
    available: number
  }[]
  pendingLeaveRequests: number
  pendingExpenseRequests: number
  upcomingHolidays: {
    name: string
    date: string
  }[]
}

class DashboardServiceClass extends BaseService {
  async getEmployerStats(companyId: string): Promise<EmployerDashboardStats> {
    // Fetch all stats in parallel
    const [employeeCount, contractorCount, pendingLeaves, pendingExpenses] =
      await Promise.all([
        employeesService.getCount(companyId),
        contractorsService.getCount(companyId),
        leavesService.getPendingCount(companyId),
        expensesService.getPendingCount(companyId),
      ])

    // Get recent hires (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: recentHires } = await this.supabase
      .from('employee_employeecontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_current', true)
      .gte('start_date', thirtyDaysAgo.toISOString().split('T')[0])

    // Get total payroll cost
    const { data: contracts } = await this.supabase
      .from('employee_employeecontract')
      .select('ctc')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    const totalPayrollCost =
      contracts?.reduce((sum, c) => sum + (c.ctc || 0), 0) || 0

    return {
      employeeCount,
      contractorCount,
      pendingLeaveRequests: pendingLeaves,
      pendingExpenseRequests: pendingExpenses,
      totalPayrollCost,
      recentHires: recentHires || 0,
    }
  }

  async getEmployeeStats(employeeId: string): Promise<EmployeeDashboardStats> {
    const currentYear = new Date().getFullYear()
    const financialYear = `${currentYear}-${currentYear + 1}`

    // Get leave balances
    const { data: balances } = await this.supabase
      .from('leave_leavebalance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('financial_year', financialYear)

    const leaveBalances = (balances || []).map((b) => ({
      type: b.leave_type,
      total: (b.opening_balance || 0) + (b.accrued || 0),
      taken: b.taken || 0,
      available:
        (b.opening_balance || 0) +
        (b.accrued || 0) -
        (b.taken || 0) -
        (b.pending || 0),
    }))

    // Get pending leave requests count
    const { count: pendingLeaves } = await this.supabase
      .from('leave_leaverequest')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .eq('status', 'pending')

    // Get pending expense requests count
    const { count: pendingExpenses } = await this.supabase
      .from('expense_expenseclaim')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .eq('status', 'pending')

    // Get upcoming holidays (next 30 days)
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

    // Get employee's company
    const { data: contract } = await this.supabase
      .from('employee_employeecontract')
      .select('company_id')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    let upcomingHolidays: { name: string; date: string }[] = []
    if (contract?.company_id) {
      const { data: holidays } = await this.supabase
        .from('holiday_holiday')
        .select('name, date')
        .eq('company_id', contract.company_id)
        .gte('date', today)
        .lte('date', thirtyDaysLater.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(5)

      upcomingHolidays =
        holidays?.map((h) => ({ name: h.name, date: h.date })) || []
    }

    return {
      leaveBalances,
      pendingLeaveRequests: pendingLeaves || 0,
      pendingExpenseRequests: pendingExpenses || 0,
      upcomingHolidays,
    }
  }
}

export const dashboardService = new DashboardServiceClass()
