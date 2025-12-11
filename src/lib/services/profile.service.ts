import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'

export type Employee = Tables<'employee_employee'>
export type Contractor = Tables<'contractor_contractor'>
export type Address = Tables<'commons_address'>
export type BankAccount = Tables<'commons_bankaccount'>
export type EmergencyContact = Tables<'commons_emergencycontact'>

export interface EmployeeProfile extends Employee {
  currentAddress?: Address | null
  permanentAddress?: Address | null
  bankAccounts: BankAccount[]
  emergencyContacts: EmergencyContact[]
  contract?: {
    designation: string
    department: string | null
    employmentType: string | null
    startDate: string
    companyName: string
    workLocation: string | null
  } | null
}

export interface ContractorProfile extends Contractor {
  bankAccounts: BankAccount[]
  emergencyContacts: EmergencyContact[]
  contract?: {
    startDate: string
    endDate: string | null
    hourlyRate: number | null
    monthlyRate: number | null
    companyName: string
    scopeOfWork: string | null
  } | null
}

class ProfileServiceClass extends BaseService {
  // Get employee profile with all related data
  async getEmployeeProfile(employeeId: string): Promise<EmployeeProfile | null> {
    // Get employee basic info
    const { data: employee, error } = await this.supabase
      .from('employee_employee')
      .select('*')
      .eq('id', employeeId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    if (!employee) return null

    // Get addresses
    let currentAddress: Address | null = null
    let permanentAddress: Address | null = null

    if (employee.current_address_id) {
      const { data } = await this.supabase
        .from('commons_address')
        .select('*')
        .eq('id', employee.current_address_id)
        .single()
      currentAddress = data
    }

    if (employee.permanent_address_id) {
      const { data } = await this.supabase
        .from('commons_address')
        .select('*')
        .eq('id', employee.permanent_address_id)
        .single()
      permanentAddress = data
    }

    // Get bank accounts
    const { data: bankAccounts } = await this.supabase
      .from('commons_bankaccount')
      .select('*')
      .eq('employee_id', employeeId)

    // Get emergency contacts
    const { data: emergencyContacts } = await this.supabase
      .from('commons_emergencycontact')
      .select('*')
      .eq('employee_id', employeeId)

    // Get contract info
    const { data: contractData } = await this.supabase
      .from('employee_employeecontract')
      .select('*, company:company_company(legal_name)')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    // Safely extract company name with runtime validation
    const companyData = contractData?.company
    const companyName = companyData && typeof companyData === 'object' && 'legal_name' in companyData
      ? String((companyData as { legal_name: string }).legal_name || '')
      : ''

    const contract = contractData
      ? {
          designation: contractData.designation,
          department: contractData.department,
          employmentType: contractData.employment_type,
          startDate: contractData.start_date,
          companyName,
          workLocation: contractData.work_location,
        }
      : null

    return {
      ...employee,
      currentAddress,
      permanentAddress,
      bankAccounts: bankAccounts || [],
      emergencyContacts: emergencyContacts || [],
      contract,
    }
  }

  // Get contractor profile with all related data
  async getContractorProfile(
    contractorId: string
  ): Promise<ContractorProfile | null> {
    // Get contractor basic info
    const { data: contractor, error } = await this.supabase
      .from('contractor_contractor')
      .select('*')
      .eq('id', contractorId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    if (!contractor) return null

    // Get bank accounts
    const { data: bankAccounts } = await this.supabase
      .from('commons_bankaccount')
      .select('*')
      .eq('contractor_id', contractorId)

    // Get emergency contacts
    const { data: emergencyContacts } = await this.supabase
      .from('commons_emergencycontact')
      .select('*')
      .eq('contractor_id', contractorId)

    // Get contract info
    const { data: contractData } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*, company:company_company(legal_name)')
      .eq('contractor_id', contractorId)
      .eq('is_current', true)
      .single()

    // Safely extract company name with runtime validation
    const companyData = contractData?.company
    const companyName = companyData && typeof companyData === 'object' && 'legal_name' in companyData
      ? String((companyData as { legal_name: string }).legal_name || '')
      : ''

    const contract = contractData
      ? {
          startDate: contractData.start_date,
          endDate: contractData.end_date,
          hourlyRate: contractData.hourly_rate,
          monthlyRate: contractData.monthly_rate,
          companyName,
          scopeOfWork: contractData.scope_of_work,
        }
      : null

    return {
      ...contractor,
      bankAccounts: bankAccounts || [],
      emergencyContacts: emergencyContacts || [],
      contract,
    }
  }

  // Update employee basic info
  async updateEmployeeInfo(
    employeeId: string,
    data: Partial<Employee>
  ): Promise<Employee> {
    const { data: updated, error } = await this.supabase
      .from('employee_employee')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', employeeId)
      .select()
      .single()

    if (error) this.handleError(error)
    return updated
  }

  // Update contractor basic info
  async updateContractorInfo(
    contractorId: string,
    data: Partial<Contractor>
  ): Promise<Contractor> {
    const { data: updated, error } = await this.supabase
      .from('contractor_contractor')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contractorId)
      .select()
      .single()

    if (error) this.handleError(error)
    return updated
  }

  // Add or update address
  async saveAddress(
    address: Omit<Address, 'id' | 'created_at' | 'updated_at'> & { id?: string }
  ): Promise<Address> {
    if (address.id) {
      const { data, error } = await this.supabase
        .from('commons_address')
        .update({
          ...address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', address.id)
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    } else {
      const { data, error } = await this.supabase
        .from('commons_address')
        .insert({
          ...address,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    }
  }

  // Add bank account
  async addBankAccount(
    account: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>
  ): Promise<BankAccount> {
    const { data, error } = await this.supabase
      .from('commons_bankaccount')
      .insert({
        ...account,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // Update bank account
  async updateBankAccount(
    accountId: string,
    data: Partial<BankAccount>
  ): Promise<BankAccount> {
    const { data: updated, error } = await this.supabase
      .from('commons_bankaccount')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', accountId)
      .select()
      .single()

    if (error) this.handleError(error)
    return updated
  }

  // Add emergency contact
  async addEmergencyContact(
    contact: Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at'>
  ): Promise<EmergencyContact> {
    const { data, error } = await this.supabase
      .from('commons_emergencycontact')
      .insert({
        ...contact,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // Update emergency contact
  async updateEmergencyContact(
    contactId: string,
    data: Partial<EmergencyContact>
  ): Promise<EmergencyContact> {
    const { data: updated, error } = await this.supabase
      .from('commons_emergencycontact')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contactId)
      .select()
      .single()

    if (error) this.handleError(error)
    return updated
  }

  // Delete emergency contact
  async deleteEmergencyContact(contactId: string): Promise<void> {
    const { error } = await this.supabase
      .from('commons_emergencycontact')
      .delete()
      .eq('id', contactId)

    if (error) this.handleError(error)
  }
}

export const profileService = new ProfileServiceClass()
