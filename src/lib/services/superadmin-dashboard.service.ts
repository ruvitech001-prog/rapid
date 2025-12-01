import { BaseService } from './base.service'
import { superadminRequestsService } from './superadmin-requests.service'
import type { SuperAdminDashboardStats } from '@/types/superadmin'

class SuperAdminDashboardServiceClass extends BaseService {
  async getStats(): Promise<SuperAdminDashboardStats> {
    // Fetch counts and data in parallel
    const [requestCounts, clientStats, upcomingHolidays, recentUpdates] =
      await Promise.all([
        superadminRequestsService.getCounts(),
        this.getClientStats(),
        this.getUpcomingHolidays(),
        this.getRecentUpdates(),
      ])

    return {
      totalClients: clientStats.total,
      clientsByCountry: clientStats.byCountry,
      pendingRequests: requestCounts,
      revenueOverview: this.getRevenueOverview(),
      invoiceOverview: this.getInvoiceOverview(),
      recentUpdates,
      upcomingHolidays,
    }
  }

  private async getClientStats(): Promise<{
    total: number
    byCountry: { country: string; count: number; color: string }[]
  }> {
    // Get active companies count
    const { count: total, error } = await this.supabase
      .from('company_company')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (error) this.handleError(error)

    // For now, return a simplified distribution
    // In production, this would come from company addresses
    const byCountry = [
      { country: 'India', count: total || 0, color: '#10b981' },
    ]

    return { total: total || 0, byCountry }
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

  // Mock data for revenue - in production, integrate with billing system
  private getRevenueOverview(): { month: string; amount: number }[] {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map((month) => ({
      month,
      amount: Math.floor(Math.random() * 50000) + 100000,
    }))
  }

  // Mock data for invoices - in production, integrate with billing system
  private getInvoiceOverview(): {
    month: string
    raised: number
    received: number
  }[] {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map((month) => {
      const raised = Math.floor(Math.random() * 30) + 20
      return {
        month,
        raised,
        received: Math.floor(raised * 0.85),
      }
    })
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
