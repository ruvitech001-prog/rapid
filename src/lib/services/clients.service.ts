'use client'

import { BaseService } from './base.service'
import { superadminAuditService } from './superadmin-audit.service'

export interface ClientDetails {
  id: string
  legalName: string
  displayName: string | null
  isActive: boolean
  employeeCount: number
  contractorCount: number
  createdAt: string
  registeredAddress?: {
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    state: string | null
    country: string | null
    pinCode: string | null
  }
  adminEmail?: string | null
  phone?: string | null
  website?: string | null
}

export interface ClientFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
  page?: number
  limit?: number
}

export interface UpdateClientInput {
  legalName?: string
  displayName?: string | null
  isActive?: boolean
}

export interface CreateClientInput {
  legalName: string
  displayName?: string | null
  adminEmail: string
}

class ClientsServiceClass extends BaseService {
  async getClients(filters?: ClientFilters): Promise<{
    data: ClientDetails[]
    total: number
    page: number
    limit: number
  }> {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('company_company')
      .select(`
        id,
        legal_name,
        display_name,
        is_active,
        created_at,
        registered_address:commons_address!company_company_registered_address_id_fkey(
          address_line_1,
          address_line_2,
          city,
          state,
          country,
          pin_code
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply status filter
    if (filters?.status === 'active') {
      query = query.eq('is_active', true)
    } else if (filters?.status === 'inactive') {
      query = query.eq('is_active', false)
    }

    // Apply search filter
    if (filters?.search) {
      query = query.or(`legal_name.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%`)
    }

    const { data: companies, error, count } = await query.range(offset, offset + limit - 1)

    if (error) this.handleError(error)

    if (!companies || companies.length === 0) {
      return { data: [], total: 0, page, limit }
    }

    // Get employee/contractor counts per company
    const companyIds = companies.map(c => c.id)

    const [employeeCounts, contractorCounts] = await Promise.all([
      this.getEmployeeCounts(companyIds),
      this.getContractorCounts(companyIds),
    ])

    const data: ClientDetails[] = companies.map(c => {
      const addr = c.registered_address as {
        address_line_1: string | null
        address_line_2: string | null
        city: string | null
        state: string | null
        country: string | null
        pin_code: string | null
      } | null

      return {
        id: c.id,
        legalName: c.legal_name,
        displayName: c.display_name,
        isActive: c.is_active ?? true,
        createdAt: c.created_at || new Date().toISOString(),
        employeeCount: employeeCounts[c.id] || 0,
        contractorCount: contractorCounts[c.id] || 0,
        registeredAddress: addr ? {
          addressLine1: addr.address_line_1,
          addressLine2: addr.address_line_2,
          city: addr.city,
          state: addr.state,
          country: addr.country,
          pinCode: addr.pin_code,
        } : undefined,
      }
    })

    return { data, total: count || data.length, page, limit }
  }

  private async getEmployeeCounts(companyIds: string[]): Promise<Record<string, number>> {
    const { data } = await this.supabase
      .from('employee_employeecontract')
      .select('company_id')
      .in('company_id', companyIds)
      .eq('is_current', true)

    const counts: Record<string, number> = {}
    data?.forEach(row => {
      if (row.company_id) {
        counts[row.company_id] = (counts[row.company_id] || 0) + 1
      }
    })
    return counts
  }

  private async getContractorCounts(companyIds: string[]): Promise<Record<string, number>> {
    const { data } = await this.supabase
      .from('contractor_contractorcontract')
      .select('company_id')
      .in('company_id', companyIds)
      .eq('is_current', true)

    const counts: Record<string, number> = {}
    data?.forEach(row => {
      if (row.company_id) {
        counts[row.company_id] = (counts[row.company_id] || 0) + 1
      }
    })
    return counts
  }

  async getClientById(id: string): Promise<ClientDetails | null> {
    const { data: company, error } = await this.supabase
      .from('company_company')
      .select(`
        id,
        legal_name,
        display_name,
        is_active,
        created_at,
        registered_address:commons_address!company_company_registered_address_id_fkey(
          address_line_1,
          address_line_2,
          city,
          state,
          country,
          pin_code
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }

    if (!company) return null

    const [employeeCounts, contractorCounts] = await Promise.all([
      this.getEmployeeCounts([id]),
      this.getContractorCounts([id]),
    ])

    const addr = company.registered_address as {
      address_line_1: string | null
      address_line_2: string | null
      city: string | null
      state: string | null
      country: string | null
      pin_code: string | null
    } | null

    return {
      id: company.id,
      legalName: company.legal_name,
      displayName: company.display_name,
      isActive: company.is_active ?? true,
      createdAt: company.created_at || new Date().toISOString(),
      employeeCount: employeeCounts[id] || 0,
      contractorCount: contractorCounts[id] || 0,
      registeredAddress: addr ? {
        addressLine1: addr.address_line_1,
        addressLine2: addr.address_line_2,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        pinCode: addr.pin_code,
      } : undefined,
    }
  }

  async updateClient(
    id: string,
    data: UpdateClientInput,
    auditUser: { id: string; email: string; role: string }
  ): Promise<ClientDetails> {
    // Get current data for audit log
    const currentClient = await this.getClientById(id)
    if (!currentClient) {
      throw new Error('Client not found')
    }

    const updateData: Record<string, unknown> = {}
    if (data.legalName !== undefined) updateData.legal_name = data.legalName
    if (data.displayName !== undefined) updateData.display_name = data.displayName
    if (data.isActive !== undefined) updateData.is_active = data.isActive

    const { error } = await this.supabase
      .from('company_company')
      .update(updateData)
      .eq('id', id)

    if (error) this.handleError(error)

    // Log audit
    await superadminAuditService.log({
      userId: auditUser.id,
      userEmail: auditUser.email,
      userRole: auditUser.role,
      action: 'company.viewed', // Reuse existing action type
      entityType: 'company',
      entityId: id,
      oldData: {
        legalName: currentClient.legalName,
        displayName: currentClient.displayName,
        isActive: currentClient.isActive,
      },
      newData: data as Record<string, unknown>,
      metadata: { action: 'update' },
    })

    const updatedClient = await this.getClientById(id)
    if (!updatedClient) {
      throw new Error('Failed to retrieve updated client')
    }

    return updatedClient
  }

  async deactivateClient(
    id: string,
    auditUser: { id: string; email: string; role: string }
  ): Promise<void> {
    const currentClient = await this.getClientById(id)
    if (!currentClient) {
      throw new Error('Client not found')
    }

    const { error } = await this.supabase
      .from('company_company')
      .update({ is_active: false })
      .eq('id', id)

    if (error) this.handleError(error)

    // Log audit
    await superadminAuditService.log({
      userId: auditUser.id,
      userEmail: auditUser.email,
      userRole: auditUser.role,
      action: 'company.viewed', // Reuse existing action type
      entityType: 'company',
      entityId: id,
      oldData: { isActive: true },
      newData: { isActive: false },
      metadata: { action: 'deactivate' },
    })
  }

  async reactivateClient(
    id: string,
    auditUser: { id: string; email: string; role: string }
  ): Promise<void> {
    const currentClient = await this.getClientById(id)
    if (!currentClient) {
      throw new Error('Client not found')
    }

    const { error } = await this.supabase
      .from('company_company')
      .update({ is_active: true })
      .eq('id', id)

    if (error) this.handleError(error)

    // Log audit
    await superadminAuditService.log({
      userId: auditUser.id,
      userEmail: auditUser.email,
      userRole: auditUser.role,
      action: 'company.viewed', // Reuse existing action type
      entityType: 'company',
      entityId: id,
      oldData: { isActive: false },
      newData: { isActive: true },
      metadata: { action: 'reactivate' },
    })
  }

  /**
   * Create a new client/company
   */
  async createClient(
    data: CreateClientInput,
    auditUser: { id: string; email: string; role: string }
  ): Promise<ClientDetails> {
    // First, check if a company with this name already exists
    const { data: existing } = await this.supabase
      .from('company_company')
      .select('id')
      .eq('legal_name', data.legalName)
      .single()

    if (existing) {
      throw new Error('A company with this name already exists')
    }

    // Create the company
    const { data: company, error } = await this.supabase
      .from('company_company')
      .insert({
        legal_name: data.legalName,
        display_name: data.displayName || null,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) this.handleError(error)

    // Log audit
    await superadminAuditService.log({
      userId: auditUser.id,
      userEmail: auditUser.email,
      userRole: auditUser.role,
      action: 'company.viewed', // Reuse existing action type
      entityType: 'company',
      entityId: company.id,
      newData: {
        legalName: data.legalName,
        displayName: data.displayName,
        adminEmail: data.adminEmail,
      },
      metadata: { action: 'create' },
    })

    return {
      id: company.id,
      legalName: company.legal_name,
      displayName: company.display_name,
      isActive: company.is_active ?? true,
      createdAt: company.created_at,
      employeeCount: 0,
      contractorCount: 0,
    }
  }
}

export const clientsService = new ClientsServiceClass()
