import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'

export type Contractor = Tables<'contractor_contractor'>
export type ContractorContract = Tables<'contractor_contractorcontract'>

export interface ContractorWithContract extends Contractor {
  contract: ContractorContract | null
  email?: string
}

export interface ContractorListItem {
  id: string
  contractorCode: string
  fullName: string
  email: string
  phone: string
  businessName: string | null
  paymentTerms: string | null
  rate: number | null
  status: string
  startDate: string | null
  endDate: string | null
}

class ContractorsServiceClass extends BaseService {
  async getByCompany(companyId: string): Promise<ContractorListItem[]> {
    // Get contracts with contractors
    const { data: contracts, error: contractsError } = await this.supabase
      .from('contractor_contractorcontract')
      .select(
        `
        *,
        contractor:contractor_contractor(*)
      `
      )
      .eq('company_id', companyId)
      .eq('is_current', true)

    if (contractsError) this.handleError(contractsError)

    // Get users for emails
    const contractorIds =
      contracts
        ?.map((c) => c.contractor?.user_id)
        .filter((id): id is string => !!id) || []

    let usersMap: Record<string, string> = {}
    if (contractorIds.length > 0) {
      const { data: users } = await this.supabase
        .from('users_user')
        .select('id, email')
        .in('id', contractorIds)

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
      id: contract.contractor?.id || '',
      contractorCode: contract.contractor?.contractor_code || '',
      fullName: contract.contractor?.full_name || '',
      email: contract.contractor?.user_id
        ? usersMap[contract.contractor.user_id] || ''
        : '',
      phone: contract.contractor?.phone_number || '',
      businessName: contract.contractor?.business_name || null,
      paymentTerms: contract.payment_terms,
      rate: contract.hourly_rate || contract.monthly_rate,
      status: contract.contractor?.status || 'active',
      startDate: contract.start_date,
      endDate: contract.end_date,
    }))
  }

  async getById(id: string): Promise<ContractorWithContract | null> {
    const { data: contractor, error } = await this.supabase
      .from('contractor_contractor')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    // Get current contract
    const { data: contract } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*')
      .eq('contractor_id', id)
      .eq('is_current', true)
      .single()

    // Get email if user exists
    let email = ''
    if (contractor?.user_id) {
      const { data: user } = await this.supabase
        .from('users_user')
        .select('email')
        .eq('id', contractor.user_id)
        .single()
      email = user?.email || ''
    }

    return {
      ...contractor,
      contract: contract || null,
      email,
    } as ContractorWithContract
  }

  async getCount(companyId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('contractor_contractorcontract')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    if (error) this.handleError(error)
    return count || 0
  }

  /**
   * Update contractor details
   */
  async updateContractor(
    contractorId: string,
    updates: {
      fullName?: string
      phoneNumber?: string
      businessName?: string
      status?: string
    }
  ): Promise<Contractor> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (updates.fullName !== undefined) updateData.full_name = updates.fullName
    if (updates.phoneNumber !== undefined) updateData.phone_number = updates.phoneNumber
    if (updates.businessName !== undefined) updateData.business_name = updates.businessName
    if (updates.status !== undefined) updateData.status = updates.status

    const { data, error } = await this.supabase
      .from('contractor_contractor')
      .update(updateData)
      .eq('id', contractorId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data as Contractor
  }

  /**
   * Deactivate a contractor (soft delete)
   */
  async deactivateContractor(contractorId: string): Promise<void> {
    // Update contractor status
    const { error: contractorError } = await this.supabase
      .from('contractor_contractor')
      .update({
        status: 'terminated',
        updated_at: new Date().toISOString()
      })
      .eq('id', contractorId)

    if (contractorError) this.handleError(contractorError)

    // Deactivate their current contract
    const { error: contractError } = await this.supabase
      .from('contractor_contractorcontract')
      .update({
        is_current: false,
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('contractor_id', contractorId)
      .eq('is_current', true)

    if (contractError) this.handleError(contractError)
  }
}

export const contractorsService = new ContractorsServiceClass()
