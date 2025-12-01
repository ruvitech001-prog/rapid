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
    // Get employees with their contracts
    const { data: contracts, error: contractsError } = await this.supabase
      .from('employee_employeecontract')
      .select(
        `
        *,
        employee:employee_employee(*)
      `
      )
      .eq('company_id', companyId)
      .eq('is_current', true)

    if (contractsError) this.handleError(contractsError)

    // Get users for emails
    const employeeIds =
      contracts
        ?.map((c) => c.employee?.user_id)
        .filter((id): id is string => !!id) || []

    let usersMap: Record<string, string> = {}
    if (employeeIds.length > 0) {
      const { data: users } = await this.supabase
        .from('users_user')
        .select('id, email')
        .in('id', employeeIds)

      usersMap =
        users?.reduce(
          (acc, u) => {
            acc[u.id] = u.email
            return acc
          },
          {} as Record<string, string>
        ) || {}
    }

    return (contracts || []).map((contract) => ({
      id: contract.employee?.id || '',
      employeeCode: contract.employee?.employee_code || '',
      fullName: contract.employee?.full_name || '',
      email: contract.employee?.user_id
        ? usersMap[contract.employee.user_id] || ''
        : '',
      phone: contract.employee?.phone_number || '',
      designation: contract.designation,
      department: contract.department || '',
      status: contract.employee?.status || 'active',
      startDate: contract.start_date,
      ctc: contract.ctc,
    }))
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
}

export const employeesService = new EmployeesServiceClass()
