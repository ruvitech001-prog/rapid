import { BaseService } from './base.service'
import { employeesService } from './employees.service'
import { contractorsService } from './contractors.service'
import { leavesService } from './leaves.service'
import { expensesService } from './expenses.service'

// New interfaces for employer dashboard widgets
export interface TeamHeadcount {
  team: string
  employees: number
  contractors: number
  total: number
}

export interface ProbationEmployee {
  id: string
  name: string
  designation: string
  department: string
  probationEndDate: string
  daysRemaining: number
}

export interface Celebration {
  id: string
  name: string
  type: 'birthday' | 'anniversary'
  date: string
  years?: number
}

export interface JoiningEmployee {
  id: string
  name: string
  designation: string
  type: 'employee' | 'contractor'
  startDate: string
}

export interface SetupStatus {
  hasEmployees: boolean
  hasLeavePolicy: boolean
  hasHolidayCalendar: boolean
  hasExpensePolicy: boolean
  completedCount: number
  totalCount: number
}

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

    const { count: recentHires, error: recentHiresError } = await this.supabase
      .from('employee_employeecontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_current', true)
      .gte('start_date', thirtyDaysAgo.toISOString().split('T')[0])

    if (recentHiresError) this.handleError(recentHiresError)

    // Get total payroll cost
    const { data: contracts, error: contractsError } = await this.supabase
      .from('employee_employeecontract')
      .select('ctc')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    if (contractsError) this.handleError(contractsError)

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
    const { data: balances, error: balancesError } = await this.supabase
      .from('leave_leavebalance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('financial_year', financialYear)

    if (balancesError) this.handleError(balancesError)

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
    const { count: pendingLeaves, error: pendingLeavesError } = await this.supabase
      .from('leave_leaverequest')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .eq('status', 'pending')

    if (pendingLeavesError) this.handleError(pendingLeavesError)

    // Get pending expense requests count
    const { count: pendingExpenses, error: pendingExpensesError } = await this.supabase
      .from('expense_expenseclaim')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .eq('status', 'pending')

    if (pendingExpensesError) this.handleError(pendingExpensesError)

    // Get upcoming holidays (next 30 days)
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

    // Get employee's company
    const { data: contract, error: contractError } = await this.supabase
      .from('employee_employeecontract')
      .select('company_id')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    // Contract might not exist for new employees, so don't treat as error
    if (contractError && contractError.code !== 'PGRST116') {
      this.handleError(contractError)
    }

    let upcomingHolidays: { name: string; date: string }[] = []
    if (contract?.company_id) {
      const { data: holidays, error: holidaysError } = await this.supabase
        .from('holiday_holiday')
        .select('name, date')
        .eq('company_id', contract.company_id)
        .gte('date', today)
        .lte('date', thirtyDaysLater.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(5)

      if (holidaysError) this.handleError(holidaysError)

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

  async getCompanyHolidays(companyId: string): Promise<{ name: string; date: string }[]> {
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

    const { data: holidays, error } = await this.supabase
      .from('holiday_holiday')
      .select('name, date')
      .eq('company_id', companyId)
      .gte('date', today)
      .lte('date', thirtyDaysLater.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(5)

    if (error) this.handleError(error)

    return holidays?.map((h) => ({ name: h.name, date: h.date })) || []
  }

  /**
   * Get team headcount breakdown by department
   */
  async getTeamHeadcount(companyId: string): Promise<TeamHeadcount[]> {
    // Get employee contracts grouped by department
    const { data: employeeContracts, error: empError } = await this.supabase
      .from('employee_employeecontract')
      .select('department')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    if (empError) this.handleError(empError)

    // Get contractor contracts grouped by department
    // Note: contractor_contractorcontract may not have a department column
    // Fetch contractor count only for now
    const { data: contractorContracts, error: conError } = await this.supabase
      .from('contractor_contractorcontract')
      .select('id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    if (conError && conError.code !== 'PGRST204') this.handleError(conError)

    // Aggregate by department
    const teamMap: Record<string, { employees: number; contractors: number }> = {}

    employeeContracts?.forEach((c) => {
      const dept = c.department || 'General'
      if (!teamMap[dept]) teamMap[dept] = { employees: 0, contractors: 0 }
      teamMap[dept].employees++
    })

    // Contractors are counted in 'General' since they don't have department
    const contractorCount = contractorContracts?.length || 0
    if (contractorCount > 0) {
      if (!teamMap['General']) teamMap['General'] = { employees: 0, contractors: 0 }
      teamMap['General'].contractors = contractorCount
    }

    return Object.entries(teamMap)
      .map(([team, counts]) => ({
        team,
        employees: counts.employees,
        contractors: counts.contractors,
        total: counts.employees + counts.contractors,
      }))
      .sort((a, b) => b.total - a.total)
  }

  /**
   * Get employees with probation ending soon
   */
  async getProbationEndingSoon(companyId: string, daysAhead: number = 7): Promise<ProbationEmployee[]> {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + daysAhead)

    // Get employee contracts with probation info
    const { data: contracts, error } = await this.supabase
      .from('employee_employeecontract')
      .select(`
        employee_id,
        designation,
        department,
        start_date,
        probation_period_months,
        employee_employee!employee_employeecontract_employee_id_fkey (
          id,
          full_name
        )
      `)
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)
      .not('probation_period_months', 'is', null)

    if (error) this.handleError(error)

    const results: ProbationEmployee[] = []

    contracts?.forEach((c) => {
      if (!c.start_date || !c.probation_period_months) return

      const startDate = new Date(c.start_date)
      const probationEnd = new Date(startDate)
      probationEnd.setMonth(probationEnd.getMonth() + c.probation_period_months)

      // Check if probation ends within the specified days
      if (probationEnd >= today && probationEnd <= futureDate) {
        const daysRemaining = Math.ceil((probationEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const employee = c.employee_employee as { id: string; full_name: string } | null

        results.push({
          id: employee?.id || c.employee_id || '',
          name: employee?.full_name || 'Unknown',
          designation: c.designation || 'Employee',
          department: c.department || 'General',
          probationEndDate: probationEnd.toISOString().split('T')[0] || '',
          daysRemaining,
        })
      }
    })

    return results.sort((a, b) => a.daysRemaining - b.daysRemaining)
  }

  /**
   * Get upcoming birthdays and work anniversaries
   */
  async getUpcomingCelebrations(companyId: string, daysAhead: number = 30): Promise<Celebration[]> {
    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentDay = today.getDate()

    // Get employee IDs for this company
    const { data: contracts, error: contractsError } = await this.supabase
      .from('employee_employeecontract')
      .select('employee_id, start_date')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    if (contractsError) this.handleError(contractsError)

    const employeeIds = contracts?.map(c => c.employee_id).filter((id): id is string => !!id) || []
    if (employeeIds.length === 0) return []

    // Get employees with birthdates
    const { data: employees, error: empError } = await this.supabase
      .from('employee_employee')
      .select('id, full_name, date_of_birth')
      .in('id', employeeIds)
      .not('date_of_birth', 'is', null)

    if (empError) this.handleError(empError)

    const celebrations: Celebration[] = []

    // Process birthdays
    employees?.forEach((e) => {
      if (!e.date_of_birth) return

      const dob = new Date(e.date_of_birth)
      const birthMonth = dob.getMonth() + 1
      const birthDay = dob.getDate()

      // Check if birthday is within the next N days
      const thisYearBirthday = new Date(today.getFullYear(), birthMonth - 1, birthDay)
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1)
      }

      const daysUntil = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntil <= daysAhead) {
        celebrations.push({
          id: e.id,
          name: e.full_name || 'Unknown',
          type: 'birthday',
          date: thisYearBirthday.toISOString().split('T')[0] || '',
        })
      }
    })

    // Process work anniversaries
    contracts?.forEach((c) => {
      if (!c.start_date || !c.employee_id) return

      const startDate = new Date(c.start_date)
      const startMonth = startDate.getMonth() + 1
      const startDay = startDate.getDate()

      // Check if anniversary is within the next N days
      const thisYearAnniversary = new Date(today.getFullYear(), startMonth - 1, startDay)
      if (thisYearAnniversary < today) {
        thisYearAnniversary.setFullYear(today.getFullYear() + 1)
      }

      const daysUntil = Math.ceil((thisYearAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntil <= daysAhead && daysUntil > 0) {
        const years = thisYearAnniversary.getFullYear() - startDate.getFullYear()
        if (years > 0) {
          const employee = employees?.find(e => e.id === c.employee_id)
          celebrations.push({
            id: c.employee_id,
            name: employee?.full_name || 'Unknown',
            type: 'anniversary',
            date: thisYearAnniversary.toISOString().split('T')[0] || '',
            years,
          })
        }
      }
    })

    return celebrations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  /**
   * Get employees joining this month with details
   */
  async getJoiningThisMonth(companyId: string): Promise<JoiningEmployee[]> {
    const today = new Date()
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Get employees joining this month
    const { data: employeeContracts, error: empError } = await this.supabase
      .from('employee_employeecontract')
      .select(`
        employee_id,
        designation,
        start_date,
        employee_employee!employee_employeecontract_employee_id_fkey (
          full_name
        )
      `)
      .eq('company_id', companyId)
      .eq('is_current', true)
      .gte('start_date', firstOfMonth.toISOString().split('T')[0])
      .lte('start_date', lastOfMonth.toISOString().split('T')[0])

    if (empError) this.handleError(empError)

    // Get contractors joining this month - with contractor name
    const { data: contractorContracts, error: conError } = await this.supabase
      .from('contractor_contractorcontract')
      .select(`
        contractor_id,
        start_date,
        contractor_contractor (
          full_name,
          business_name
        )
      `)
      .eq('company_id', companyId)
      .eq('is_current', true)
      .gte('start_date', firstOfMonth.toISOString().split('T')[0] || '')
      .lte('start_date', lastOfMonth.toISOString().split('T')[0] || '')

    if (conError && conError.code !== 'PGRST204') this.handleError(conError)

    const results: JoiningEmployee[] = []

    employeeContracts?.forEach((c) => {
      const employee = c.employee_employee as { full_name: string } | null
      results.push({
        id: c.employee_id || '',
        name: employee?.full_name || 'Unknown',
        designation: c.designation || 'Employee',
        type: 'employee',
        startDate: c.start_date || '',
      })
    })

    contractorContracts?.forEach((c) => {
      const contractor = (c as { contractor_contractor?: { full_name?: string; business_name?: string } | null }).contractor_contractor
      results.push({
        id: c.contractor_id || '',
        name: contractor?.full_name || contractor?.business_name || 'Contractor',
        designation: 'Contractor',
        type: 'contractor',
        startDate: c.start_date || '',
      })
    })

    return results.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }

  /**
   * Get company setup status for first-time experience
   */
  async getCompanySetupStatus(companyId: string): Promise<SetupStatus> {
    // Check if company has any employees or contractors
    const [employeeCount, contractorCount] = await Promise.all([
      employeesService.getCount(companyId),
      contractorsService.getCount(companyId),
    ])

    // Check if company has holiday calendar
    const { count: holidayCount, error: holidayError } = await this.supabase
      .from('holiday_holiday')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    if (holidayError) this.handleError(holidayError)

    // Check if company has leave policy (using leave_leavebalance as proxy)
    const { count: leaveBalanceCount, error: leaveError } = await this.supabase
      .from('leave_leavebalance')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    if (leaveError && leaveError.code !== 'PGRST116') this.handleError(leaveError)

    const hasEmployees = (employeeCount + contractorCount) > 0
    const hasLeavePolicy = (leaveBalanceCount || 0) > 0
    const hasHolidayCalendar = (holidayCount || 0) > 0
    const hasExpensePolicy = true // Default to true for now

    // Count only the policy/setup items (not hasEmployees which controls visibility)
    const setupItems = [hasLeavePolicy, hasHolidayCalendar]
    const completedCount = setupItems.filter(Boolean).length

    return {
      hasEmployees,
      hasLeavePolicy,
      hasHolidayCalendar,
      hasExpensePolicy,
      completedCount,
      totalCount: 6, // Total setup items in the UI
    }
  }

  /**
   * Get cost overview with configurable period
   */
  async getCostOverviewByPeriod(
    companyId: string,
    months: 3 | 6 | 12 = 6
  ): Promise<{ month: string; cost: number }[]> {
    const results: { month: string; cost: number }[] = []
    const today = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' })

      // Get total CTC for active contracts in that month
      const { data: contracts, error } = await this.supabase
        .from('employee_employeecontract')
        .select('ctc')
        .eq('company_id', companyId)
        .eq('is_current', true)
        .eq('is_active', true)

      if (error) this.handleError(error)

      const totalCost = contracts?.reduce((sum, c) => sum + (c.ctc || 0), 0) || 0

      results.push({
        month: monthName,
        cost: totalCost / 12, // Monthly cost from annual CTC
      })
    }

    return results
  }
}

export const dashboardService = new DashboardServiceClass()
