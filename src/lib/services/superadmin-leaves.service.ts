import { BaseService } from './base.service'

export interface SuperAdminLeave {
  id: string
  employee: string
  employeeId: string
  company: string
  companyId: string
  type: string
  startDate: string
  endDate: string
  days: number
  status: 'Approved' | 'Pending' | 'Rejected'
  reason: string
}

export interface SuperAdminLeaveStats {
  total: number
  approved: number
  pending: number
  rejected: number
}

export interface SuperAdminLeaveFilters {
  search?: string
  status?: string
  companyId?: string
}

class SuperAdminLeavesServiceClass extends BaseService {
  async getLeaves(filters?: SuperAdminLeaveFilters): Promise<SuperAdminLeave[]> {
    let query = this.supabase
      .from('leave_leaverequest')
      .select(`
        id,
        leave_type,
        start_date,
        end_date,
        total_days,
        status,
        reason,
        employee:employee_employee(
          id,
          full_name,
          contract:employee_employeecontract(
            company:company_company(id, legal_name)
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    const { data: leaves, error } = await query

    if (error) this.handleError(error)

    const results: SuperAdminLeave[] = []

    leaves?.forEach((leave) => {
      const employee = leave.employee as {
        id: string
        full_name: string
        contract: Array<{ company: { id: string; legal_name: string } | null }>
      } | null

      const company = employee?.contract?.find(c => c.company)?.company

      const leaveItem: SuperAdminLeave = {
        id: leave.id,
        employee: employee?.full_name || 'Unknown',
        employeeId: employee?.id || '',
        company: company?.legal_name || 'Unknown Company',
        companyId: company?.id || '',
        type: this.formatLeaveType(leave.leave_type),
        startDate: leave.start_date,
        endDate: leave.end_date,
        days: Number(leave.total_days) || 1,
        status: this.formatStatus(leave.status),
        reason: leave.reason || '',
      }

      results.push(leaveItem)
    })

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      return results.filter(
        (leave) =>
          leave.employee.toLowerCase().includes(searchLower) ||
          leave.company.toLowerCase().includes(searchLower)
      )
    }

    // Apply company filter
    if (filters?.companyId) {
      return results.filter((leave) => leave.companyId === filters.companyId)
    }

    return results
  }

  async getStats(): Promise<SuperAdminLeaveStats> {
    const { data: leaves, error } = await this.supabase
      .from('leave_leaverequest')
      .select('status')

    if (error) this.handleError(error)

    let total = 0
    let approved = 0
    let pending = 0
    let rejected = 0

    leaves?.forEach((leave) => {
      total++
      switch (leave.status) {
        case 'approved':
          approved++
          break
        case 'pending':
          pending++
          break
        case 'rejected':
          rejected++
          break
      }
    })

    return { total, approved, pending, rejected }
  }

  private formatLeaveType(type: string | null): string {
    const typeMap: Record<string, string> = {
      annual: 'Annual Leave',
      sick: 'Sick Leave',
      casual: 'Casual Leave',
      maternity: 'Maternity Leave',
      paternity: 'Paternity Leave',
      unpaid: 'Unpaid Leave',
    }
    return typeMap[type || ''] || type || 'Leave'
  }

  private formatStatus(status: string | null): 'Approved' | 'Pending' | 'Rejected' {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending'
    }
  }
}

export const superadminLeavesService = new SuperAdminLeavesServiceClass()
