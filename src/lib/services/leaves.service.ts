import { BaseService, ServiceError } from './base.service'
import type { Tables } from '@/types/database.types'
// Validation schemas available for future use
// import { createLeaveRequestSchema, validateSafe } from '@/lib/validation/schemas'

export type LeaveRequest = Tables<'leave_leaverequest'>
export type LeaveBalance = Tables<'leave_leavebalance'>

// Max retries for optimistic locking conflicts
const MAX_BALANCE_RETRIES = 3
const RETRY_DELAY_MS = 100

export interface LeaveRequestWithEmployee extends LeaveRequest {
  employeeName: string
  employeeCode: string
}

export interface LeaveRequestFilters {
  status?: 'pending' | 'approved' | 'rejected'
  employeeId?: string
}

class LeavesServiceClass extends BaseService {
  /**
   * Generate all possible financial year format strings
   * Indian financial year runs from April to March
   */
  private getFinancialYearFormats(): string[] {
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1
    const prevYear = currentYear - 1

    return [
      // Current calendar year formats
      `${currentYear}`,                      // '2025'
      `${currentYear}-${nextYear}`,          // '2025-2026'
      `${currentYear}-${String(nextYear).slice(2)}`, // '2025-26'
      `FY${currentYear}`,                    // 'FY2025'
      `FY${currentYear}-${nextYear}`,        // 'FY2025-2026'
      `FY${currentYear}-${String(nextYear).slice(2)}`, // 'FY2025-26'
      `FY ${currentYear}-${String(nextYear).slice(2)}`, // 'FY 2025-26'
      // Previous financial year (for Jan-Mar period)
      `${prevYear}-${currentYear}`,          // '2024-2025'
      `${prevYear}-${String(currentYear).slice(2)}`, // '2024-25'
      `FY${prevYear}-${currentYear}`,        // 'FY2024-2025'
      `FY${prevYear}-${String(currentYear).slice(2)}`, // 'FY2024-25'
    ]
  }

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
    // First get the leave request details
    const { data: request, error: fetchError } = await this.supabase
      .from('leave_leaverequest')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError) this.handleError(fetchError)
    if (!request) throw new Error('Leave request not found')

    // Verify request is still pending
    if (request.status !== 'pending') {
      throw new ServiceError(
        `Cannot approve request with status: ${request.status}`,
        'INVALID_STATUS',
        400
      )
    }

    // STEP 1: Deduct from leave balance FIRST (so we can rollback if approval fails)
    let balanceDeducted = false
    let originalTaken: number | null = null
    let originalPending: number | null = null
    let balanceId: string | null = null

    if (request.employee_id && request.leave_type && request.total_days) {
      // Get current balance for potential rollback
      const { data: balances } = await this.supabase
        .from('leave_leavebalance')
        .select('*')
        .eq('employee_id', request.employee_id)
        .eq('leave_type', request.leave_type)
        .in('financial_year', this.getFinancialYearFormats())
        .limit(1)

      if (balances?.[0]) {
        originalTaken = balances[0].taken
        originalPending = balances[0].pending
        balanceId = balances[0].id
      }

      const balanceResult = await this.deductLeaveBalance(
        request.employee_id,
        request.leave_type,
        request.total_days
      )

      if (!balanceResult.success) {
        throw new ServiceError(
          `Failed to update leave balance: ${balanceResult.error}`,
          'BALANCE_UPDATE_FAILED',
          500
        )
      }
      balanceDeducted = true
    }

    // STEP 2: Update the leave request status
    const { data, error } = await this.supabase
      .from('leave_leaverequest')
      .update({
        status: 'approved',
        approved_by_id: approverId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('status', 'pending') // Ensure still pending (prevent double approval)
      .select()
      .single()

    if (error) {
      // ROLLBACK: Restore the balance if approval failed
      if (balanceDeducted && balanceId !== null && originalTaken !== null && originalPending !== null) {
        console.error('[Leave Approval] Approval failed, rolling back balance deduction')
        await this.supabase
          .from('leave_leavebalance')
          .update({
            taken: originalTaken,
            pending: originalPending,
            updated_at: new Date().toISOString(),
          })
          .eq('id', balanceId)
      }
      this.handleError(error)
    }

    return data
  }

  /**
   * Deduct leave balance with retry logic for optimistic locking conflicts
   * Uses exponential backoff for retries
   */
  private async deductLeaveBalance(
    employeeId: string,
    leaveType: string,
    days: number
  ): Promise<{ success: boolean; finalBalance?: LeaveBalance; error?: string }> {
    const financialYearFormats = this.getFinancialYearFormats()

    for (let attempt = 0; attempt < MAX_BALANCE_RETRIES; attempt++) {
      // Find the balance record (re-fetch on each retry)
      const { data: balances, error: fetchError } = await this.supabase
        .from('leave_leavebalance')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('leave_type', leaveType)
        .in('financial_year', financialYearFormats)
        .limit(1)

      if (fetchError) {
        console.error('[Leave Balance] Error fetching balance:', fetchError)
        return { success: false, error: `Failed to fetch balance: ${fetchError.message}` }
      }

      const balance = balances?.[0]
      if (!balance) {
        console.warn('[Leave Balance] No balance record found for employee:', employeeId)
        return { success: true } // No balance to deduct from - not an error
      }

      // Calculate new values
      const currentTaken = balance.taken || 0
      const currentPending = balance.pending || 0
      const currentVersion = (balance as LeaveBalance & { version?: number }).version || 1
      const newTaken = currentTaken + days
      const newPending = Math.max(0, currentPending - days)

      // Attempt atomic update with optimistic lock
      const { data: updatedBalance, error: updateError } = await this.supabase
        .from('leave_leavebalance')
        .update({
          taken: newTaken,
          pending: newPending,
          version: currentVersion + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', balance.id)
        .eq('taken', currentTaken) // Optimistic lock on taken
        .eq('pending', currentPending) // Optimistic lock on pending
        .select()
        .single()

      if (updateError) {
        // Check if this is a conflict (no rows updated)
        if (updateError.code === 'PGRST116' || updateError.message.includes('0 rows')) {
          console.warn(`[Leave Balance] Optimistic lock conflict, attempt ${attempt + 1}/${MAX_BALANCE_RETRIES}`)
          // Exponential backoff before retry
          await this.delay(RETRY_DELAY_MS * Math.pow(2, attempt))
          continue
        }
        console.error('[Leave Balance] Error updating balance:', updateError)
        return { success: false, error: `Failed to update balance: ${updateError.message}` }
      }

      // Success!
      return { success: true, finalBalance: updatedBalance }
    }

    // All retries exhausted
    return {
      success: false,
      error: `Failed to update balance after ${MAX_BALANCE_RETRIES} retries due to concurrent modifications`
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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
    const financialYearFormats = this.getFinancialYearFormats()

    // First try to get current year balance with known formats
    const { data, error } = await this.supabase
      .from('leave_leavebalance')
      .select('*')
      .eq('employee_id', employeeId)
      .in('financial_year', financialYearFormats)

    if (error) this.handleError(error)

    // If we found data, return it
    if (data && data.length > 0) {
      return data
    }

    // Fallback: If no data with specific formats, try to get the most recent balances
    // This handles cases where the format doesn't match any of our expected patterns
    const { data: fallbackData, error: fallbackError } = await this.supabase
      .from('leave_leavebalance')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(10) // Get recent records across all leave types

    if (fallbackError) {
      console.error('[Leave Balance] Fallback query error:', fallbackError)
      return []
    }

    // Return unique balances by leave_type (most recent for each type)
    const uniqueByType = new Map<string, LeaveBalance>()
    for (const balance of fallbackData || []) {
      if (balance.leave_type && !uniqueByType.has(balance.leave_type)) {
        uniqueByType.set(balance.leave_type, balance)
      }
    }

    return Array.from(uniqueByType.values())
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

    // Reserve pending balance
    try {
      await this.reservePendingBalance(request.employeeId, request.leaveType, totalDays)
    } catch (balanceError) {
      // If balance reservation fails, we should still return the created request
      // but log the error for manual investigation
      console.error('[Leave Request] Failed to reserve pending balance:', balanceError)
    }

    return data
  }

  private async reservePendingBalance(
    employeeId: string,
    leaveType: string,
    days: number
  ): Promise<void> {
    const financialYearFormats = this.getFinancialYearFormats()

    const { data: balances, error: fetchError } = await this.supabase
      .from('leave_leavebalance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('leave_type', leaveType)
      .in('financial_year', financialYearFormats)
      .limit(1)

    if (fetchError) {
      console.error('[Leave Balance] Error fetching balance for reserve:', fetchError)
      throw fetchError
    }

    const balance = balances?.[0]
    if (balance) {
      const newPending = (balance.pending || 0) + days

      const { error: updateError } = await this.supabase
        .from('leave_leavebalance')
        .update({
          pending: newPending,
          updated_at: new Date().toISOString(),
        })
        .eq('id', balance.id)
        .eq('pending', balance.pending || 0) // Optimistic lock

      if (updateError) {
        console.error('[Leave Balance] Error reserving pending balance:', updateError)
        throw updateError
      }
    }
  }

  async cancelLeaveRequest(requestId: string): Promise<LeaveRequest> {
    // Get the request first
    const { data: request, error: fetchError } = await this.supabase
      .from('leave_leaverequest')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError) this.handleError(fetchError)
    if (!request) throw new Error('Leave request not found')

    // Only pending requests can be cancelled
    if (request.status !== 'pending') {
      throw new Error('Only pending requests can be cancelled')
    }

    // Update status to cancelled
    const { data, error } = await this.supabase
      .from('leave_leaverequest')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) this.handleError(error)

    // Release pending balance
    if (request.employee_id && request.leave_type && request.total_days) {
      try {
        await this.releasePendingBalance(
          request.employee_id,
          request.leave_type,
          request.total_days
        )
      } catch (balanceError) {
        // Log the error but don't fail the cancellation
        console.error('[Leave Cancel] Failed to release pending balance:', balanceError)
      }
    }

    return data
  }

  private async releasePendingBalance(
    employeeId: string,
    leaveType: string,
    days: number
  ): Promise<void> {
    const financialYearFormats = this.getFinancialYearFormats()

    const { data: balances, error: fetchError } = await this.supabase
      .from('leave_leavebalance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('leave_type', leaveType)
      .in('financial_year', financialYearFormats)
      .limit(1)

    if (fetchError) {
      console.error('[Leave Balance] Error fetching balance for release:', fetchError)
      throw fetchError
    }

    const balance = balances?.[0]
    if (balance) {
      const newPending = Math.max(0, (balance.pending || 0) - days)

      const { error: updateError } = await this.supabase
        .from('leave_leavebalance')
        .update({
          pending: newPending,
          updated_at: new Date().toISOString(),
        })
        .eq('id', balance.id)
        .eq('pending', balance.pending || 0) // Optimistic lock

      if (updateError) {
        console.error('[Leave Balance] Error releasing pending balance:', updateError)
        throw updateError
      }
    }
  }
}

export const leavesService = new LeavesServiceClass()
