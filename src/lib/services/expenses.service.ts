import { BaseService, ServiceError } from './base.service'
import type { Tables } from '@/types/database.types'

export type ExpenseClaim = Tables<'expense_expenseclaim'>

export interface ExpenseClaimWithEmployee extends ExpenseClaim {
  employeeName: string
  employeeCode: string
}

export interface ExpenseRequestFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'paid'
  employeeId?: string
}

class ExpensesServiceClass extends BaseService {
  async getRequests(
    companyId: string,
    filters?: ExpenseRequestFilters
  ): Promise<ExpenseClaimWithEmployee[]> {
    // First get employee IDs for this company
    const { data: contracts } = await this.supabase
      .from('employee_employeecontract')
      .select('employee_id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    const employeeIds = contracts?.map((c) => c.employee_id).filter(Boolean) || []

    if (employeeIds.length === 0) return []

    // Get expense claims
    let query = this.supabase
      .from('expense_expenseclaim')
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

  async approve(requestId: string, approverId: string): Promise<ExpenseClaim> {
    // SECURITY: Get expense with employee's company for authorization
    const { data: expense, error: fetchError } = await this.supabase
      .from('expense_expenseclaim')
      .select('*, employee:employee_employee!inner(id, user_id, employee_employeecontract!inner(company_id))')
      .eq('id', requestId)
      .single()

    if (fetchError) this.handleError(fetchError)
    if (!expense) throw new Error('Expense claim not found')

    // SECURITY: Prevent self-approval
    const employeeRecord = expense.employee as { id: string; user_id: string | null; employee_employeecontract: Array<{ company_id: string | null }> | null } | null
    if (employeeRecord?.user_id === approverId) {
      throw new ServiceError(
        'Cannot approve your own expense claim',
        'SELF_APPROVAL',
        403
      )
    }

    // SECURITY: Verify approver is from same company
    const { data: approver } = await this.supabase
      .from('company_employer')
      .select('company_id, role')
      .eq('user_id', approverId)
      .single()

    const employeeCompanyId = employeeRecord?.employee_employeecontract?.[0]?.company_id
    if (!approver || !employeeCompanyId || approver.company_id !== employeeCompanyId) {
      throw new ServiceError(
        'Cannot approve expense claims from other companies',
        'CROSS_COMPANY_APPROVAL',
        403
      )
    }

    // Verify status is pending
    if (expense.status !== 'pending') {
      throw new ServiceError(
        `Cannot approve expense with status: ${expense.status}`,
        'INVALID_STATUS',
        400
      )
    }

    const { data, error } = await this.supabase
      .from('expense_expenseclaim')
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
  ): Promise<ExpenseClaim> {
    const { data, error } = await this.supabase
      .from('expense_expenseclaim')
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
      .from('expense_expenseclaim')
      .select('*', { count: 'exact', head: true })
      .in('employee_id', employeeIds)
      .eq('status', 'pending')

    if (error) this.handleError(error)
    return count || 0
  }

  // Employee-specific methods
  async getEmployeeExpenses(employeeId: string): Promise<ExpenseClaim[]> {
    const { data, error } = await this.supabase
      .from('expense_expenseclaim')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  async createExpenseClaim(claim: {
    employeeId: string
    category: string
    amount: number
    merchant: string
    expenseDate: string
    description?: string
  }): Promise<ExpenseClaim> {
    const { data, error } = await this.supabase
      .from('expense_expenseclaim')
      .insert({
        employee_id: claim.employeeId,
        expense_category: claim.category,
        amount: claim.amount,
        merchant_name: claim.merchant,
        expense_date: claim.expenseDate,
        description: claim.description || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }
}

export const expensesService = new ExpensesServiceClass()
