import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'

export type Timesheet = Tables<'contractor_timesheet'>

export interface TimesheetWithDetails extends Timesheet {
  contractorName?: string
  contractorCode?: string
  totalHours: number
}

export interface TimesheetFilters {
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
  contractorId?: string
  weekStartDate?: string
  weekEndDate?: string
}

class TimesheetsServiceClass extends BaseService {
  // Get timesheets for a contractor
  async getContractorTimesheets(
    contractorId: string,
    filters?: TimesheetFilters
  ): Promise<TimesheetWithDetails[]> {
    let query = this.supabase
      .from('contractor_timesheet')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('week_start_date', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) this.handleError(error)

    return (data || []).map((ts) => ({
      ...ts,
      totalHours: this.calculateTotalHours(ts),
    }))
  }

  // Get timesheets for a company (all contractors)
  async getCompanyTimesheets(
    companyId: string,
    filters?: TimesheetFilters
  ): Promise<TimesheetWithDetails[]> {
    // Get contractor IDs for this company
    const { data: contracts } = await this.supabase
      .from('contractor_contractorcontract')
      .select('contractor_id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    const contractorIds =
      contracts?.map((c) => c.contractor_id).filter((id): id is string => !!id) || []

    if (contractorIds.length === 0) return []

    let query = this.supabase
      .from('contractor_timesheet')
      .select('*')
      .in('contractor_id', contractorIds)
      .order('week_start_date', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) this.handleError(error)

    // Get contractor names
    const { data: contractors } = await this.supabase
      .from('contractor_contractor')
      .select('id, full_name, contractor_code')
      .in('id', contractorIds)

    const contractorMap =
      contractors?.reduce(
        (acc, c) => {
          acc[c.id] = { name: c.full_name, code: c.contractor_code || '' }
          return acc
        },
        {} as Record<string, { name: string; code: string }>
      ) || {}

    return (data || []).map((ts) => ({
      ...ts,
      totalHours: this.calculateTotalHours(ts),
      contractorName: ts.contractor_id
        ? contractorMap[ts.contractor_id]?.name
        : undefined,
      contractorCode: ts.contractor_id
        ? contractorMap[ts.contractor_id]?.code
        : undefined,
    }))
  }

  // Get timesheet by ID
  async getTimesheet(timesheetId: string): Promise<TimesheetWithDetails | null> {
    const { data, error } = await this.supabase
      .from('contractor_timesheet')
      .select('*')
      .eq('id', timesheetId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    if (!data) return null

    // Get contractor name
    let contractorName: string | undefined
    let contractorCode: string | undefined
    if (data.contractor_id) {
      const { data: contractor } = await this.supabase
        .from('contractor_contractor')
        .select('full_name, contractor_code')
        .eq('id', data.contractor_id)
        .single()

      contractorName = contractor?.full_name
      contractorCode = contractor?.contractor_code || undefined
    }

    return {
      ...data,
      totalHours: this.calculateTotalHours(data),
      contractorName,
      contractorCode,
    }
  }

  // Submit timesheet
  async submitTimesheet(timesheetId: string): Promise<Timesheet> {
    const { data, error } = await this.supabase
      .from('contractor_timesheet')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', timesheetId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // Approve timesheet
  async approveTimesheet(
    timesheetId: string,
    approverId: string
  ): Promise<Timesheet> {
    const { data, error } = await this.supabase
      .from('contractor_timesheet')
      .update({
        status: 'approved',
        approved_by_id: approverId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', timesheetId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // Reject timesheet
  async rejectTimesheet(timesheetId: string): Promise<Timesheet> {
    const { data, error } = await this.supabase
      .from('contractor_timesheet')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', timesheetId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // Create or update timesheet
  async saveTimesheet(timesheet: {
    contractorId: string
    contractId: string
    weekStartDate: string
    weekEndDate: string
    mondayHours?: number
    tuesdayHours?: number
    wednesdayHours?: number
    thursdayHours?: number
    fridayHours?: number
    saturdayHours?: number
    sundayHours?: number
    taskDescription?: string
  }): Promise<Timesheet> {
    // Check if timesheet exists for this week
    const { data: existing } = await this.supabase
      .from('contractor_timesheet')
      .select('id')
      .eq('contractor_id', timesheet.contractorId)
      .eq('week_start_date', timesheet.weekStartDate)
      .single()

    if (existing) {
      // Update
      const { data, error } = await this.supabase
        .from('contractor_timesheet')
        .update({
          monday_hours: timesheet.mondayHours || 0,
          tuesday_hours: timesheet.tuesdayHours || 0,
          wednesday_hours: timesheet.wednesdayHours || 0,
          thursday_hours: timesheet.thursdayHours || 0,
          friday_hours: timesheet.fridayHours || 0,
          saturday_hours: timesheet.saturdayHours || 0,
          sunday_hours: timesheet.sundayHours || 0,
          task_description: timesheet.taskDescription,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    } else {
      // Create
      const { data, error } = await this.supabase
        .from('contractor_timesheet')
        .insert({
          contractor_id: timesheet.contractorId,
          contract_id: timesheet.contractId,
          week_start_date: timesheet.weekStartDate,
          week_end_date: timesheet.weekEndDate,
          monday_hours: timesheet.mondayHours || 0,
          tuesday_hours: timesheet.tuesdayHours || 0,
          wednesday_hours: timesheet.wednesdayHours || 0,
          thursday_hours: timesheet.thursdayHours || 0,
          friday_hours: timesheet.fridayHours || 0,
          saturday_hours: timesheet.saturdayHours || 0,
          sunday_hours: timesheet.sundayHours || 0,
          task_description: timesheet.taskDescription,
          status: 'draft',
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    }
  }

  // Get pending timesheets count for employer
  async getPendingCount(companyId: string): Promise<number> {
    // Get contractor IDs for this company
    const { data: contracts } = await this.supabase
      .from('contractor_contractorcontract')
      .select('contractor_id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    const contractorIds =
      contracts?.map((c) => c.contractor_id).filter((id): id is string => !!id) || []

    if (contractorIds.length === 0) return 0

    const { count, error } = await this.supabase
      .from('contractor_timesheet')
      .select('*', { count: 'exact', head: true })
      .in('contractor_id', contractorIds)
      .eq('status', 'submitted')

    if (error) this.handleError(error)
    return count || 0
  }

  // Calculate total hours for a timesheet
  private calculateTotalHours(ts: Timesheet): number {
    return (
      (ts.monday_hours || 0) +
      (ts.tuesday_hours || 0) +
      (ts.wednesday_hours || 0) +
      (ts.thursday_hours || 0) +
      (ts.friday_hours || 0) +
      (ts.saturday_hours || 0) +
      (ts.sunday_hours || 0)
    )
  }
}

export const timesheetsService = new TimesheetsServiceClass()
