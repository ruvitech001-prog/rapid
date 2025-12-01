import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'

export type LeaveRequest = Tables<'leave_leaverequest'>
export type LeaveBalance = Tables<'leave_leavebalance'>

export interface LeaveRequestWithEmployee extends LeaveRequest {
  employeeName: string
  employeeCode: string
}

export interface LeaveRequestFilters {
  status?: 'pending' | 'approved' | 'rejected'
  employeeId?: string
}

class LeavesServiceClass extends BaseService {
  async getRequests(
    companyId: string,
    filters?: LeaveRequestFilters
  ): Promise<LeaveRequestWithEmployee[]> {
    // First get employee IDs for this company
    const { data: contracts } = await this.supabase
      .from('employee_employeecontract')
      .select('employee_id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    const employeeIds = contracts?.map((c) => c.employee_id).filter(Boolean) || []

    if (employeeIds.length === 0) return []

    // Get leave requests
    let query = this.supabase
      .from('leave_leaverequest')
      .select('*')
      .in('employee_id', employeeIds)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.employeeId) {
      query = query.eq('employee_id', filters.employeeId)
    }

    const { data: requests, error } = await query

    if (error) this.handleError(error)

    // Get employee details
    const requestEmployeeIds =
      requests?.map((r) => r.employee_id).filter((id): id is string => id !== null) || []

    let employeesMap: Record<string, { name: string; code: string }> = {}
    if (requestEmployeeIds.length > 0) {
      const { data: employees } = await this.supabase
        .from('employee_employee')
        .select('id, full_name, employee_code')
        .in('id', requestEmployeeIds)

      employeesMap =
        employees?.reduce(
          (acc, e) => {
            acc[e.id] = { name: e.full_name, code: e.employee_code || '' }
            return acc
          },
          {} as Record<string, { name: string; code: string }>
        ) || {}
    }

    return (requests || []).map((request) => ({
      ...request,
      employeeName: request.employee_id
        ? employeesMap[request.employee_id]?.name || ''
        : '',
      employeeCode: request.employee_id
        ? employeesMap[request.employee_id]?.code || ''
        : '',
    }))
  }

  async approve(requestId: string, approverId: string): Promise<LeaveRequest> {
    const { data, error } = await this.supabase
      .from('leave_leaverequest')
      .update({
        status: 'approved',
        approved_by_id: approverId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  async reject(
    requestId: string,
    approverId: string,
    reason: string
  ): Promise<LeaveRequest> {
    const { data, error } = await this.supabase
      .from('leave_leaverequest')
      .update({
        status: 'rejected',
        approved_by_id: approverId,
        approved_at: new Date().toISOString(),
        rejection_reason: reason,
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  async getBalances(employeeId: string): Promise<LeaveBalance[]> {
    const currentYear = new Date().getFullYear()

    // Try multiple financial year formats to be flexible with data
    const financialYearFormats = [
      `${currentYear}`,                    // '2025'
      `${currentYear}-${currentYear + 1}`, // '2025-2026'
      `FY${currentYear}`,                  // 'FY2025'
    ]

    // First try to get current year balance
    const { data, error } = await this.supabase
      .from('leave_leavebalance')
      .select('*')
      .eq('employee_id', employeeId)
      .in('financial_year', financialYearFormats)

    if (error) this.handleError(error)
    return data || []
  }

  async getPendingCount(companyId: string): Promise<number> {
    // First get employee IDs for this company
    const { data: contracts } = await this.supabase
      .from('employee_employeecontract')
      .select('employee_id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    const employeeIds = contracts?.map((c) => c.employee_id).filter(Boolean) || []

    if (employeeIds.length === 0) return 0

    const { count, error } = await this.supabase
      .from('leave_leaverequest')
      .select('*', { count: 'exact', head: true })
      .in('employee_id', employeeIds)
      .eq('status', 'pending')

    if (error) this.handleError(error)
    return count || 0
  }

  // Employee-specific methods
  async getEmployeeLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
    const { data, error } = await this.supabase
      .from('leave_leaverequest')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  async createLeaveRequest(request: {
    employeeId: string
    leaveType: string
    startDate: string
    endDate: string
    reason: string
    isHalfDay?: boolean
    halfDayPeriod?: 'first_half' | 'second_half'
  }): Promise<LeaveRequest> {
    // Calculate total days
    const start = new Date(request.startDate)
    const end = new Date(request.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    const totalDays = request.isHalfDay ? 0.5 : diffDays

    const { data, error } = await this.supabase
      .from('leave_leaverequest')
      .insert({
        employee_id: request.employeeId,
        leave_type: request.leaveType,
        start_date: request.startDate,
        end_date: request.endDate,
        reason: request.reason,
        is_half_day: request.isHalfDay || false,
        total_days: totalDays,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }
}

export const leavesService = new LeavesServiceClass()
