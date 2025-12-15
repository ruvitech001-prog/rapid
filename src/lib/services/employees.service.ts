import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'

export type Employee = Tables<'employee_employee'>
export type EmployeeContract = Tables<'employee_employeecontract'>

export interface EmployeeWithContract extends Employee {
  contract: EmployeeContract | null
  email?: string
}

export interface EmployeeListItem {
  id: string
  employeeCode: string
  fullName: string
  email: string
  phone: string
  designation: string
  department: string
  status: string
  startDate: string | null
  ctc: number
}

class EmployeesServiceClass extends BaseService {
  async getByCompany(companyId: string): Promise<EmployeeListItem[]> {
    // Get contracts first
    const { data: contracts, error: contractsError } = await this.supabase
      .from('employee_employeecontract')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_current', true)

    if (contractsError) {
      console.error('Contracts error:', contractsError)
      this.handleError(contractsError)
    }

    if (!contracts || contracts.length === 0) {
      return []
    }

    // Get employee IDs from contracts
    const employeeIds = contracts.map((c) => c.employee_id).filter((id): id is string => !!id)

    // Get employees
    const { data: employees, error: employeesError } = await this.supabase
      .from('employee_employee')
      .select('*')
      .in('id', employeeIds)

    if (employeesError) {
      console.error('Employees error:', employeesError)
      this.handleError(employeesError)
    }

    // Create employee map
    const employeeMap = new Map(employees?.map((e) => [e.id, e]) || [])

    // Get user IDs for emails
    const userIds = employees
      ?.map((e) => e.user_id)
      .filter((id): id is string => !!id) || []

    let usersMap: Record<string, string> = {}
    if (userIds.length > 0) {
      const { data: users } = await this.supabase
        .from('users_user')
        .select('id, email')
        .in('id', userIds)

      usersMap =
        users?.reduce(
          (acc, u) => {
            acc[u.id] = u.email
            return acc
          },
          {} as Record<string, string>
        ) || {}
    }

    return contracts.map((contract) => {
      const employee = contract.employee_id ? employeeMap.get(contract.employee_id) : undefined
      return {
        id: employee?.id || contract.employee_id || '',
        employeeCode: employee?.employee_code || '',
        fullName: employee?.full_name || '',
        email: employee?.user_id ? usersMap[employee.user_id] || '' : '',
        phone: employee?.phone_number || '',
        designation: contract.designation,
        department: contract.department || '',
        status: employee?.status || 'active',
        startDate: contract.start_date,
        ctc: contract.ctc,
      }
    })
  }

  async getById(id: string): Promise<EmployeeWithContract | null> {
    const { data: employee, error } = await this.supabase
      .from('employee_employee')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    // Get current contract
    const { data: contract } = await this.supabase
      .from('employee_employeecontract')
      .select('*')
      .eq('employee_id', id)
      .eq('is_current', true)
      .single()

    // Get email if user exists
    let email = ''
    if (employee?.user_id) {
      const { data: user } = await this.supabase
        .from('users_user')
        .select('email')
        .eq('id', employee.user_id)
        .single()
      email = user?.email || ''
    }

    return {
      ...employee,
      contract: contract || null,
      email,
    } as EmployeeWithContract
  }

  async getCount(companyId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('employee_employeecontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    if (error) this.handleError(error)
    return count || 0
  }

  /**
   * Update employee details
   */
  async updateEmployee(
    employeeId: string,
    updates: {
      fullName?: string
      phoneNumber?: string
      status?: string
    }
  ): Promise<Employee> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (updates.fullName !== undefined) updateData.full_name = updates.fullName
    if (updates.phoneNumber !== undefined) updateData.phone_number = updates.phoneNumber
    if (updates.status !== undefined) updateData.status = updates.status

    const { data, error } = await this.supabase
      .from('employee_employee')
      .update(updateData)
      .eq('id', employeeId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data as Employee
  }

  /**
   * Deactivate an employee (soft delete)
   */
  async deactivateEmployee(employeeId: string): Promise<void> {
    // Update employee status
    const { error: employeeError } = await this.supabase
      .from('employee_employee')
      .update({
        status: 'exited',
        updated_at: new Date().toISOString()
      })
      .eq('id', employeeId)

    if (employeeError) this.handleError(employeeError)

    // Deactivate their current contract
    const { error: contractError } = await this.supabase
      .from('employee_employeecontract')
      .update({
        is_current: false,
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('employee_id', employeeId)
      .eq('is_current', true)

    if (contractError) this.handleError(contractError)
  }
}

export const employeesService = new EmployeesServiceClass()
