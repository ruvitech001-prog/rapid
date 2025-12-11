import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'

export type EmployeeContract = Tables<'employee_employeecontract'>
export type ContractorContract = Tables<'contractor_contractorcontract'>

export interface EmployeeContractWithDetails extends EmployeeContract {
  employeeName: string
  employeeCode: string
  employeeEmail: string
  designation: string
}

export interface ContractorContractWithDetails extends ContractorContract {
  contractorName: string
  contractorCode: string
  contractorEmail: string
}

export interface ContractorOwnContract extends ContractorContract {
  companyName: string
  designation: string
  department: string
  contract_type: string
}

class ContractsServiceClass extends BaseService {
  async getEmployeeContracts(companyId: string): Promise<EmployeeContractWithDetails[]> {
    // Get contracts for this company
    const { data: contracts, error } = await this.supabase
      .from('employee_employeecontract')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .order('start_date', { ascending: false })

    if (error) this.handleError(error)

    if (!contracts || contracts.length === 0) return []

    // Get employee details
    const employeeIds = contracts.map((c) => c.employee_id).filter((id): id is string => id !== null)

    const { data: employees } = await this.supabase
      .from('employee_employee')
      .select('id, full_name, employee_code, personal_email')
      .in('id', employeeIds)

    const employeesMap =
      employees?.reduce(
        (acc, e) => {
          acc[e.id] = {
            name: e.full_name,
            code: e.employee_code || '',
            email: e.personal_email || '',
          }
          return acc
        },
        {} as Record<string, { name: string; code: string; email: string }>
      ) || {}

    return contracts.map((contract) => ({
      ...contract,
      employeeName: contract.employee_id
        ? employeesMap[contract.employee_id]?.name || ''
        : '',
      employeeCode: contract.employee_id
        ? employeesMap[contract.employee_id]?.code || ''
        : '',
      employeeEmail: contract.employee_id
        ? employeesMap[contract.employee_id]?.email || ''
        : '',
      designation: contract.designation || '',
    }))
  }

  async getContractorContracts(companyId: string): Promise<ContractorContractWithDetails[]> {
    // Get contracts for this company
    const { data: contracts, error } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .order('start_date', { ascending: false })

    if (error) this.handleError(error)

    if (!contracts || contracts.length === 0) return []

    // Get contractor details
    const contractorIds = contracts.map((c) => c.contractor_id).filter((id): id is string => id !== null)

    const { data: contractors } = await this.supabase
      .from('contractor_contractor')
      .select('id, full_name, contractor_code')
      .in('id', contractorIds)

    const contractorsMap =
      contractors?.reduce(
        (acc, c) => {
          acc[c.id] = {
            name: c.full_name,
            code: c.contractor_code || '',
            email: '', // Contractor table doesn't have email field
          }
          return acc
        },
        {} as Record<string, { name: string; code: string; email: string }>
      ) || {}

    return contracts.map((contract) => ({
      ...contract,
      contractorName: contract.contractor_id
        ? contractorsMap[contract.contractor_id]?.name || ''
        : '',
      contractorCode: contract.contractor_id
        ? contractorsMap[contract.contractor_id]?.code || ''
        : '',
      contractorEmail: contract.contractor_id
        ? contractorsMap[contract.contractor_id]?.email || ''
        : '',
    }))
  }

  async getEmployeeContractById(contractId: string): Promise<EmployeeContractWithDetails | null> {
    const { data: contract, error } = await this.supabase
      .from('employee_employeecontract')
      .select('*')
      .eq('id', contractId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    if (!contract || !contract.employee_id) return null

    // Get employee details
    const { data: employee } = await this.supabase
      .from('employee_employee')
      .select('id, full_name, employee_code, personal_email')
      .eq('id', contract.employee_id)
      .single()

    return {
      ...contract,
      employeeName: employee?.full_name || '',
      employeeCode: employee?.employee_code || '',
      employeeEmail: employee?.personal_email || '',
      designation: contract.designation || '',
    }
  }

  async getContractorContractById(contractId: string): Promise<ContractorContractWithDetails | null> {
    const { data: contract, error } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*')
      .eq('id', contractId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    if (!contract || !contract.contractor_id) return null

    // Get contractor details
    const { data: contractor } = await this.supabase
      .from('contractor_contractor')
      .select('id, full_name, contractor_code')
      .eq('id', contract.contractor_id)
      .single()

    return {
      ...contract,
      contractorName: contractor?.full_name || '',
      contractorCode: contractor?.contractor_code || '',
      contractorEmail: '', // Contractor table doesn't have email field
    }
  }

  async getContractStats(companyId: string): Promise<{
    totalEmployeeContracts: number
    totalContractorContracts: number
    activeEmployeeContracts: number
    activeContractorContracts: number
    expiringThisMonth: number
  }> {
    const today = new Date()
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Get employee contract counts
    const { count: totalEmployee } = await this.supabase
      .from('employee_employeecontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    const { count: activeEmployee } = await this.supabase
      .from('employee_employeecontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    // Get contractor contract counts
    const { count: totalContractor } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    const { count: activeContractor } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    // Get contracts expiring this month (from both tables)
    const { count: expiringEmployee } = await this.supabase
      .from('employee_employeecontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_current', true)
      .lte('end_date', endOfMonth.toISOString().split('T')[0])
      .gte('end_date', today.toISOString().split('T')[0])

    const { count: expiringContractor } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_current', true)
      .lte('end_date', endOfMonth.toISOString().split('T')[0])
      .gte('end_date', today.toISOString().split('T')[0])

    return {
      totalEmployeeContracts: totalEmployee || 0,
      totalContractorContracts: totalContractor || 0,
      activeEmployeeContracts: activeEmployee || 0,
      activeContractorContracts: activeContractor || 0,
      expiringThisMonth: (expiringEmployee || 0) + (expiringContractor || 0),
    }
  }

  // Get contracts for a specific contractor (contractor's own view)
  async getContractsForContractor(contractorId: string): Promise<ContractorOwnContract[]> {
    const { data: contracts, error } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*')
      .eq('contractor_id', contractorId)
      .eq('is_current', true)
      .order('start_date', { ascending: false })

    if (error) this.handleError(error)

    if (!contracts || contracts.length === 0) return []

    // Get company details
    const companyIds = contracts.map((c) => c.company_id).filter((id): id is string => id !== null)

    const { data: companies } = await this.supabase
      .from('company_company')
      .select('id, legal_name')
      .in('id', companyIds)

    const companiesMap =
      companies?.reduce(
        (acc, c) => {
          acc[c.id] = c.legal_name
          return acc
        },
        {} as Record<string, string>
      ) || {}

    return contracts.map((contract) => ({
      ...contract,
      companyName: contract.company_id
        ? companiesMap[contract.company_id] || 'Unknown Company'
        : 'Unknown Company',
      designation: 'Consultant', // Default since contractor contracts don't have designation
      department: 'External', // Default since contractor contracts don't have department
      contract_type: contract.hourly_rate ? 'Hourly' : contract.monthly_rate ? 'Monthly' : 'Fixed',
    }))
  }
}

export const contractsService = new ContractsServiceClass()
