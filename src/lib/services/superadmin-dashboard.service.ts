import { BaseService } from './base.service'
import { superadminRequestsService } from './superadmin-requests.service'
import type { SuperAdminDashboardStats, WorkforceStats, WorkforceTrend, PendingAction, SearchResult } from '@/types/superadmin'

class SuperAdminDashboardServiceClass extends BaseService {
  async getStats(): Promise<SuperAdminDashboardStats> {
    // Fetch counts and data in parallel
    const [
      requestCounts,
      clientStats,
      upcomingHolidays,
      recentUpdates,
      revenueOverview,
      invoiceOverview,
      workforceStats,
      workforceTrend,
      pendingActions,
    ] = await Promise.all([
      superadminRequestsService.getCounts(),
      this.getClientStats(),
      this.getUpcomingHolidays(),
      this.getRecentUpdates(),
      this.getRevenueOverview(),
      this.getInvoiceOverview(),
      this.getWorkforceStats(),
      this.getWorkforceTrend(),
      this.getPendingActions(),
    ])

    // Calculate total and monthly revenue
    const totalRevenue = revenueOverview.reduce((sum, r) => sum + r.amount, 0)
    const monthlyRevenue = revenueOverview[revenueOverview.length - 1]?.amount || 0

    return {
      totalClients: clientStats.total,
      clientsByCountry: clientStats.byCountry,
      pendingRequests: requestCounts,
      revenueOverview,
      invoiceOverview,
      recentUpdates,
      upcomingHolidays,
      workforceStats,
      workforceTrend,
      pendingActions,
      totalRevenue,
      monthlyRevenue,
    }
  }

  // Get workforce statistics
  private async getWorkforceStats(): Promise<WorkforceStats> {
    const today = new Date().toISOString().split('T')[0]

    // Get employee contracts
    const { data: employeeContracts, error: empError } = await this.supabase
      .from('employee_employeecontract')
      .select('id, is_active, start_date, end_date, is_current')

    if (empError) {
      console.error('Error fetching employee contracts:', empError)
    }

    // Get contractor contracts
    const { data: contractorContracts, error: contError } = await this.supabase
      .from('contractor_contractorcontract')
      .select('id, is_active, start_date, end_date, is_current')

    if (contError) {
      console.error('Error fetching contractor contracts:', contError)
    }

    const employees = employeeContracts || []
    const contractors = contractorContracts || []

    // Calculate stats
    const totalEmployees = employees.filter(e => e.is_current).length
    const totalContractors = contractors.filter(c => c.is_current).length
    const activeEmployees = employees.filter(e => e.is_current && e.is_active).length
    const activeContractors = contractors.filter(c => c.is_current && c.is_active).length

    // Onboarding: started within last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const onboardingEmployees = employees.filter(e => {
      if (!e.start_date || !e.is_current) return false
      const startDate = new Date(e.start_date)
      return startDate >= thirtyDaysAgo && startDate <= new Date()
    }).length

    // Exiting: end_date is within next 30 days
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const exitingEmployees = employees.filter(e => {
      if (!e.end_date || !e.is_current) return false
      const endDate = new Date(e.end_date)
      return endDate >= new Date() && endDate <= thirtyDaysFromNow
    }).length

    return {
      totalEmployees,
      totalContractors,
      activeEmployees,
      activeContractors,
      onboardingEmployees,
      exitingEmployees,
    }
  }

  // Get workforce trend over last 6 months
  private async getWorkforceTrend(): Promise<WorkforceTrend[]> {
    const months = this.getLastSixMonthNames()
    const trend: WorkforceTrend[] = []

    // Get all contracts with start dates
    const { data: employeeContracts } = await this.supabase
      .from('employee_employeecontract')
      .select('start_date, is_current')
      .eq('is_current', true)

    const { data: contractorContracts } = await this.supabase
      .from('contractor_contractorcontract')
      .select('start_date, is_current')
      .eq('is_current', true)

    // Calculate cumulative count per month
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthKey = monthDate.toLocaleString('en-US', { month: 'short' })

      // Count employees active by end of that month
      const employeeCount = (employeeContracts || []).filter(e => {
        if (!e.start_date) return false
        const startDate = new Date(e.start_date)
        return startDate <= monthEnd
      }).length

      const contractorCount = (contractorContracts || []).filter(c => {
        if (!c.start_date) return false
        const startDate = new Date(c.start_date)
        return startDate <= monthEnd
      }).length

      trend.push({
        month: monthKey,
        employees: employeeCount,
        contractors: contractorCount,
      })
    }

    return trend
  }

  // Get pending actions requiring Super Admin attention
  private async getPendingActions(): Promise<PendingAction[]> {
    const actions: PendingAction[] = []

    // Get pending leave requests
    const { data: leaves } = await this.supabase
      .from('leave_leaverequest')
      .select(`
        id, created_at, start_date, end_date, total_days,
        employee:employee_employee(full_name, user:users_user(email)),
        company:company_company(legal_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5)

    leaves?.forEach(leave => {
      const emp = leave.employee as unknown as { full_name: string; user: { email: string } } | null
      const comp = leave.company as unknown as { legal_name: string } | null
      actions.push({
        id: leave.id,
        type: 'leave',
        title: `Leave request (${leave.total_days || 1} days)`,
        requester: emp?.full_name || emp?.user?.email || 'Unknown',
        company: comp?.legal_name || 'Unknown',
        priority: (leave.total_days || 0) > 5 ? 'high' : 'medium',
        dueDate: leave.start_date || undefined,
        createdAt: leave.created_at || new Date().toISOString(),
      })
    })

    // Get pending expense claims
    const { data: expenses } = await this.supabase
      .from('expense_expenseclaim')
      .select(`
        id, created_at, amount, expense_category,
        employee:employee_employee(full_name, user:users_user(email))
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5)

    expenses?.forEach(expense => {
      const emp = expense.employee as unknown as { full_name: string; user: { email: string } } | null
      actions.push({
        id: expense.id,
        type: 'expense',
        title: `Expense claim ₹${(expense.amount || 0).toLocaleString()}`,
        requester: emp?.full_name || emp?.user?.email || 'Unknown',
        company: expense.expense_category || 'Expense',
        priority: (expense.amount || 0) > 50000 ? 'high' : (expense.amount || 0) > 10000 ? 'medium' : 'low',
        createdAt: expense.created_at || new Date().toISOString(),
      })
    })

    // Get pending invoices
    const { data: invoices } = await this.supabase
      .from('contractor_invoice')
      .select(`
        id, created_at, total_amount, invoice_number,
        contractor:contractor_contractor(full_name, user:users_user(email)),
        company:company_company(legal_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5)

    invoices?.forEach(invoice => {
      const cont = invoice.contractor as unknown as { full_name: string; user: { email: string } } | null
      const comp = invoice.company as unknown as { legal_name: string } | null
      actions.push({
        id: invoice.id,
        type: 'invoice',
        title: `Invoice #${invoice.invoice_number || 'N/A'}`,
        requester: cont?.full_name || cont?.user?.email || 'Unknown',
        company: comp?.legal_name || 'Unknown',
        priority: (invoice.total_amount || 0) > 100000 ? 'high' : 'medium',
        createdAt: invoice.created_at || new Date().toISOString(),
      })
    })

    // Sort by created date (most recent first) and take top 10
    return actions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  }

  // Global search functionality
  async globalSearch(query: string, filters?: {
    type?: 'employee' | 'contractor' | 'company' | 'invoice' | 'request'
  }): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const results: SearchResult[] = []
    const searchTerm = `%${query.toLowerCase()}%`

    // Search employees
    if (!filters?.type || filters.type === 'employee') {
      const { data: employees } = await this.supabase
        .from('employee_employee')
        .select(`
          id, full_name, employee_code,
          user:users_user(email),
          company:company_companyemployee(company:company_company(legal_name))
        `)
        .or(`full_name.ilike.${searchTerm},employee_code.ilike.${searchTerm}`)
        .limit(5)

      employees?.forEach(emp => {
        const user = emp.user as unknown as { email: string } | null
        const companyRel = emp.company as unknown as { company: { legal_name: string } }[] | null
        results.push({
          id: emp.id,
          type: 'employee',
          title: emp.full_name || user?.email || 'Unknown',
          subtitle: companyRel?.[0]?.company?.legal_name || 'No company',
          link: `/super-admin/clients?employee=${emp.id}`,
        })
      })
    }

    // Search contractors
    if (!filters?.type || filters.type === 'contractor') {
      const { data: contractors } = await this.supabase
        .from('contractor_contractor')
        .select(`
          id, full_name,
          user:users_user(email)
        `)
        .or(`full_name.ilike.${searchTerm}`)
        .limit(5)

      contractors?.forEach(cont => {
        const user = cont.user as unknown as { email: string } | null
        results.push({
          id: cont.id,
          type: 'contractor',
          title: cont.full_name || user?.email || 'Unknown',
          subtitle: 'Contractor',
          link: `/super-admin/clients?contractor=${cont.id}`,
        })
      })
    }

    // Search companies
    if (!filters?.type || filters.type === 'company') {
      const { data: companies } = await this.supabase
        .from('company_company')
        .select('id, legal_name, display_name')
        .or(`legal_name.ilike.${searchTerm},display_name.ilike.${searchTerm}`)
        .limit(5)

      companies?.forEach(comp => {
        results.push({
          id: comp.id,
          type: 'company',
          title: comp.legal_name,
          subtitle: comp.display_name || 'Client',
          link: `/super-admin/clients?company=${comp.id}`,
        })
      })
    }

    return results.slice(0, 10)
  }

  private async getClientStats(): Promise<{
    total: number
    byCountry: { country: string; count: number; color: string }[]
  }> {
    // Get active companies with their registered addresses
    const { data: companies, error } = await this.supabase
      .from('company_company')
      .select(`
        id,
        registered_address:commons_address!company_company_registered_address_id_fkey(country)
      `)
      .eq('is_active', true)

    if (error) this.handleError(error)

    const total = companies?.length || 0

    // Group by country from registered addresses
    const countryCounts: Record<string, number> = {}
    companies?.forEach((company) => {
      const address = company.registered_address as { country: string | null } | null
      const country = address?.country || 'Unknown'
      countryCounts[country] = (countryCounts[country] || 0) + 1
    })

    // Color palette for countries
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

    // Convert to array and sort by count (descending)
    const byCountry = Object.entries(countryCounts)
      .map(([country, count], index) => ({
        country,
        count,
        color: colors[index % colors.length] || '#6b7280',
      }))
      .sort((a, b) => b.count - a.count)

    // If no data, default to showing the count as India (backward compatibility)
    if (byCountry.length === 0 && total > 0) {
      return {
        total,
        byCountry: [{ country: 'India', count: total, color: '#10b981' }],
      }
    }

    return { total, byCountry }
  }

  private async getUpcomingHolidays(): Promise<
    { date: string; name: string }[]
  > {
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

    const { data: holidays, error } = await this.supabase
      .from('holiday_holiday')
      .select('name, date')
      .gte('date', today)
      .lte('date', thirtyDaysLater.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(5)

    if (error) this.handleError(error)

    return holidays?.map((h) => ({ name: h.name, date: h.date })) || []
  }

  private async getRecentUpdates(): Promise<
    { id: string; message: string; createdAt: string }[]
  > {
    // Get recent requests as updates
    const { data: requests, error } = await this.supabase
      .from('request_request')
      .select('id, request_type, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) this.handleError(error)

    return (requests || []).map((r) => ({
      id: r.id,
      message: `${this.formatRequestType(r.request_type)} - ${r.status}`,
      createdAt: r.created_at || new Date().toISOString(),
    }))
  }

  private formatRequestType(type: string | null): string {
    const typeMap: Record<string, string> = {
      leave: 'Leave Request',
      expense: 'Expense Claim',
      payroll_query: 'Payroll Query',
      employment_letter: 'Employment Letter',
      travel_letter: 'Travel Letter',
      resignation: 'Resignation',
      equipment_purchase: 'Equipment Purchase',
      equipment_collect: 'Equipment Collection',
      termination: 'Termination',
      send_gifts: 'Gift Request',
    }
    return typeMap[type || ''] || 'Request'
  }

  // Fetch real revenue data from invoices
  private async getRevenueOverview(): Promise<{ month: string; amount: number }[]> {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    // Get paid invoices from the last 6 months
    const { data: invoices, error } = await this.supabase
      .from('contractor_invoice')
      .select('total_amount, paid_date, invoice_date')
      .eq('status', 'paid')
      .gte('paid_date', sixMonthsAgo.toISOString())
      .order('paid_date', { ascending: true })

    if (error) {
      console.error('Error fetching revenue data:', error)
      // Return empty data structure with last 6 months
      return this.getLastSixMonthsEmpty()
    }

    // Group by month
    const monthlyRevenue: Record<string, number> = {}
    const months = this.getLastSixMonthNames()

    // Initialize all months with 0
    months.forEach(month => {
      monthlyRevenue[month] = 0
    })

    // Sum up invoices by month
    invoices?.forEach((inv) => {
      const paidDate = new Date(inv.paid_date || inv.invoice_date)
      const monthKey = paidDate.toLocaleString('en-US', { month: 'short' })
      if (monthlyRevenue[monthKey] !== undefined) {
        monthlyRevenue[monthKey] += Number(inv.total_amount) || 0
      }
    })

    return months.map(month => ({
      month,
      amount: Math.round(monthlyRevenue[month] || 0),
    }))
  }

  // Fetch real invoice counts
  private async getInvoiceOverview(): Promise<{
    month: string
    raised: number
    received: number
  }[]> {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    // Get all invoices from the last 6 months
    const { data: invoices, error } = await this.supabase
      .from('contractor_invoice')
      .select('status, invoice_date, created_at')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching invoice data:', error)
      return this.getLastSixMonthsEmpty().map(m => ({ ...m, raised: 0, received: 0 }))
    }

    // Group by month
    const months = this.getLastSixMonthNames()
    const monthlyData: Record<string, { raised: number; received: number }> = {}

    // Initialize all months
    months.forEach(month => {
      monthlyData[month] = { raised: 0, received: 0 }
    })

    // Count invoices by month
    invoices?.forEach((inv) => {
      const createdDate = new Date(inv.created_at || inv.invoice_date)
      const monthKey = createdDate.toLocaleString('en-US', { month: 'short' })
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].raised++
        if (inv.status === 'paid') {
          monthlyData[monthKey].received++
        }
      }
    })

    return months.map(month => ({
      month,
      raised: monthlyData[month]?.raised || 0,
      received: monthlyData[month]?.received || 0,
    }))
  }

  // Helper: Get last 6 month names
  private getLastSixMonthNames(): string[] {
    const months: string[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(d.toLocaleString('en-US', { month: 'short' }))
    }
    return months
  }

  // Helper: Get empty data for last 6 months
  private getLastSixMonthsEmpty(): { month: string; amount: number }[] {
    return this.getLastSixMonthNames().map(month => ({ month, amount: 0 }))
  }

  // Get all workforce members across all companies
  async getWorkforce(filters?: {
    search?: string
    companyId?: string
    type?: 'employee' | 'contractor' | 'all'
  }): Promise<
    {
      id: string
      name: string
      email: string
      company: string
      companyId: string
      role: 'Employee' | 'Contractor'
      joinDate: string
    }[]
  > {
    const results: {
      id: string
      name: string
      email: string
      company: string
      companyId: string
      role: 'Employee' | 'Contractor'
      joinDate: string
    }[] = []

    // Fetch employees with their contracts and company info
    if (!filters?.type || filters.type === 'all' || filters.type === 'employee') {
      let employeeQuery = this.supabase
        .from('employee_employeecontract')
        .select(`
          id,
          start_date,
          company:company_company(id, legal_name),
          employee:employee_employee(id, user:users_user(email, first_name, last_name))
        `)
        .eq('is_current', true)

      if (filters?.companyId) {
        employeeQuery = employeeQuery.eq('company_id', filters.companyId)
      }

      const { data: employeeContracts, error: empError } = await employeeQuery

      if (empError) this.handleError(empError)

      employeeContracts?.forEach((contract) => {
        // Runtime validation for nested objects
        const emp = contract.employee
        const comp = contract.company

        // Validate employee structure
        const isValidEmployee = emp &&
          typeof emp === 'object' &&
          'id' in emp &&
          'user' in emp &&
          emp.user &&
          typeof emp.user === 'object' &&
          'email' in emp.user

        // Validate company structure
        const isValidCompany = comp &&
          typeof comp === 'object' &&
          'id' in comp &&
          'legal_name' in comp

        if (isValidEmployee && isValidCompany) {
          const empTyped = emp as { id: string; user: { email: string; first_name: string | null; last_name: string | null } }
          const compTyped = comp as { id: string; legal_name: string }
          const name = [empTyped.user.first_name, empTyped.user.last_name].filter(Boolean).join(' ') || empTyped.user.email
          results.push({
            id: empTyped.id,
            name,
            email: empTyped.user.email,
            company: compTyped.legal_name,
            companyId: compTyped.id,
            role: 'Employee',
            joinDate: contract.start_date || '',
          })
        }
      })
    }

    // Fetch contractors with their contracts and company info
    if (!filters?.type || filters.type === 'all' || filters.type === 'contractor') {
      let contractorQuery = this.supabase
        .from('contractor_contractorcontract')
        .select(`
          id,
          start_date,
          company:company_company(id, legal_name),
          contractor:contractor_contractor(id, user:users_user(email, first_name, last_name))
        `)
        .eq('is_current', true)

      if (filters?.companyId) {
        contractorQuery = contractorQuery.eq('company_id', filters.companyId)
      }

      const { data: contractorContracts, error: contError } = await contractorQuery

      if (contError) this.handleError(contError)

      contractorContracts?.forEach((contract) => {
        // Runtime validation for nested objects
        const cont = contract.contractor
        const comp = contract.company

        // Validate contractor structure
        const isValidContractor = cont &&
          typeof cont === 'object' &&
          'id' in cont &&
          'user' in cont &&
          cont.user &&
          typeof cont.user === 'object' &&
          'email' in cont.user

        // Validate company structure
        const isValidCompany = comp &&
          typeof comp === 'object' &&
          'id' in comp &&
          'legal_name' in comp

        if (isValidContractor && isValidCompany) {
          const contTyped = cont as { id: string; user: { email: string; first_name: string | null; last_name: string | null } }
          const compTyped = comp as { id: string; legal_name: string }
          const name = [contTyped.user.first_name, contTyped.user.last_name].filter(Boolean).join(' ') || contTyped.user.email
          results.push({
            id: contTyped.id,
            name,
            email: contTyped.user.email,
            company: compTyped.legal_name,
            companyId: compTyped.id,
            role: 'Contractor',
            joinDate: contract.start_date || '',
          })
        }
      })
    }

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      return results.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.email.toLowerCase().includes(searchLower) ||
          r.company.toLowerCase().includes(searchLower)
      )
    }

    // Sort by join date (most recent first)
    return results.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
  }

  // Get companies list for SuperAdmin
  async getCompanies(): Promise<
    {
      id: string
      legalName: string
      displayName: string | null
      isActive: boolean
      employeeCount: number
      contractorCount: number
      createdAt: string
    }[]
  > {
    const { data: companies, error } = await this.supabase
      .from('company_company')
      .select('id, legal_name, display_name, is_active, created_at')
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)

    if (!companies || companies.length === 0) return []

    // Get employee counts per company
    const companyIds = companies.map((c) => c.id)
    const { data: employeeContracts } = await this.supabase
      .from('employee_employeecontract')
      .select('company_id')
      .in('company_id', companyIds)
      .eq('is_current', true)

    const { data: contractorContracts } = await this.supabase
      .from('contractor_contractorcontract')
      .select('company_id')
      .in('company_id', companyIds)
      .eq('is_current', true)

    // Count by company
    const employeeCounts: Record<string, number> = {}
    const contractorCounts: Record<string, number> = {}

    employeeContracts?.forEach((c) => {
      if (c.company_id) {
        employeeCounts[c.company_id] = (employeeCounts[c.company_id] || 0) + 1
      }
    })

    contractorContracts?.forEach((c) => {
      if (c.company_id) {
        contractorCounts[c.company_id] =
          (contractorCounts[c.company_id] || 0) + 1
      }
    })

    return companies.map((c) => ({
      id: c.id,
      legalName: c.legal_name,
      displayName: c.display_name,
      isActive: c.is_active ?? true,
      employeeCount: employeeCounts[c.id] || 0,
      contractorCount: contractorCounts[c.id] || 0,
      createdAt: c.created_at || new Date().toISOString(),
    }))
  }
}

export const superadminDashboardService =
  new SuperAdminDashboardServiceClass()
