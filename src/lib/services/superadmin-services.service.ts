'use client'

import { BaseService, ServiceError } from './base.service'
import type { Json } from '@/types/database.types'

export type ServiceCategory = 'health_insurance' | 'bgv' | 'equipment' | 'gifts' | 'office_space' | 'other'

export interface SuperAdminService {
  id: string
  name: string
  description: string | null
  category: ServiceCategory | null
  isActive: boolean
  configuration: Record<string, unknown>
  createdAt: string
  updatedAt: string
  // Computed fields from enrollments
  activeClients?: number
  totalBeneficiaries?: number
}

export interface ServiceEnrollment {
  id: string
  serviceId: string
  companyId: string
  status: 'active' | 'inactive' | 'pending'
  enrolledAt: string
  configuration: Record<string, unknown>
  // Joined fields
  companyName?: string
  beneficiaryCount?: number
}

export interface CreateServiceInput {
  name: string
  description?: string
  category?: ServiceCategory
  configuration?: Record<string, unknown>
}

export interface UpdateServiceInput {
  name?: string
  description?: string
  category?: ServiceCategory
  isActive?: boolean
  configuration?: Record<string, unknown>
}

export interface ServiceStats {
  totalServices: number
  activeServices: number
  totalClientsUsingServices: number
  totalBeneficiaries: number
}

class SuperAdminServicesServiceClass extends BaseService {
  /**
   * Get all services with enrollment stats
   */
  async getServices(): Promise<SuperAdminService[]> {
    const { data, error } = await this.supabase
      .from('superadmin_service')
      .select(`
        *,
        enrollments:superadmin_service_enrollment(
          id,
          company_id,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)

    return (data || []).map(service => this.mapServiceFromDb(service))
  }

  /**
   * Get a single service by ID
   */
  async getServiceById(id: string): Promise<SuperAdminService> {
    const { data, error } = await this.supabase
      .from('superadmin_service')
      .select(`
        *,
        enrollments:superadmin_service_enrollment(
          id,
          company_id,
          status
        )
      `)
      .eq('id', id)
      .single()

    if (error) this.handleError(error)
    if (!data) throw new ServiceError('Service not found', 'NOT_FOUND', 404)

    return this.mapServiceFromDb(data)
  }

  /**
   * Get service statistics
   */
  async getStats(): Promise<ServiceStats> {
    // Get all services
    const { data: services, error: servicesError } = await this.supabase
      .from('superadmin_service')
      .select('id, is_active')

    if (servicesError) this.handleError(servicesError)

    // Get all active enrollments
    const { data: enrollments, error: enrollmentsError } = await this.supabase
      .from('superadmin_service_enrollment')
      .select('id, company_id, status')
      .eq('status', 'active')

    if (enrollmentsError) this.handleError(enrollmentsError)

    // Get unique companies using services
    const uniqueCompanies = new Set((enrollments || []).map(e => e.company_id))

    // Get beneficiary count (employees in companies with services)
    const { count: beneficiaryCount } = await this.supabase
      .from('employee_employeecontract')
      .select('id', { count: 'exact', head: true })
      .in('company_id', Array.from(uniqueCompanies))
      .eq('is_active', true)

    return {
      totalServices: services?.length || 0,
      activeServices: services?.filter(s => s.is_active).length || 0,
      totalClientsUsingServices: uniqueCompanies.size,
      totalBeneficiaries: beneficiaryCount || 0,
    }
  }

  /**
   * Create a new service
   */
  async createService(input: CreateServiceInput): Promise<SuperAdminService> {
    const { data, error } = await this.supabase
      .from('superadmin_service')
      .insert({
        name: input.name,
        description: input.description || null,
        category: input.category || null,
        configuration: (input.configuration || {}) as unknown as Json,
        is_active: true,
      })
      .select()
      .single()

    if (error) this.handleError(error)

    return this.mapServiceFromDb(data)
  }

  /**
   * Update an existing service
   */
  async updateService(id: string, input: UpdateServiceInput): Promise<SuperAdminService> {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.name !== undefined) updates.name = input.name
    if (input.description !== undefined) updates.description = input.description
    if (input.category !== undefined) updates.category = input.category
    if (input.isActive !== undefined) updates.is_active = input.isActive
    if (input.configuration !== undefined) updates.configuration = input.configuration

    const { data, error } = await this.supabase
      .from('superadmin_service')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) this.handleError(error)

    return this.mapServiceFromDb(data)
  }

  /**
   * Delete a service (soft delete by setting inactive)
   */
  async deleteService(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('superadmin_service')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) this.handleError(error)
  }

  /**
   * Get enrollments for a service
   */
  async getServiceEnrollments(serviceId: string): Promise<ServiceEnrollment[]> {
    const { data, error } = await this.supabase
      .from('superadmin_service_enrollment')
      .select(`
        *,
        company:company_company(
          id,
          display_name,
          legal_name
        )
      `)
      .eq('service_id', serviceId)
      .order('enrolled_at', { ascending: false })

    if (error) this.handleError(error)

    return (data || []).map(enrollment => ({
      id: enrollment.id,
      serviceId: enrollment.service_id,
      companyId: enrollment.company_id,
      status: (enrollment.status ?? 'pending') as 'pending' | 'active' | 'inactive',
      enrolledAt: enrollment.enrolled_at ?? '',
      configuration: (enrollment.configuration as Record<string, unknown>) || {},
      companyName: enrollment.company?.display_name || enrollment.company?.legal_name,
    }))
  }

  /**
   * Enroll a company in a service
   */
  async enrollCompany(
    serviceId: string,
    companyId: string,
    configuration?: Record<string, unknown>
  ): Promise<ServiceEnrollment> {
    const { data, error } = await this.supabase
      .from('superadmin_service_enrollment')
      .insert({
        service_id: serviceId,
        company_id: companyId,
        status: 'active',
        configuration: (configuration || {}) as unknown as Json,
      })
      .select()
      .single()

    if (error) this.handleError(error)

    return {
      id: data.id,
      serviceId: data.service_id,
      companyId: data.company_id,
      status: (data.status ?? 'pending') as 'pending' | 'active' | 'inactive',
      enrolledAt: data.enrolled_at ?? '',
      configuration: (data.configuration as Record<string, unknown>) || {},
    }
  }

  /**
   * Update enrollment status
   */
  async updateEnrollmentStatus(
    enrollmentId: string,
    status: 'active' | 'inactive' | 'pending'
  ): Promise<void> {
    const { error } = await this.supabase
      .from('superadmin_service_enrollment')
      .update({ status })
      .eq('id', enrollmentId)

    if (error) this.handleError(error)
  }

  /**
   * Remove a company from a service
   */
  async unenrollCompany(enrollmentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('superadmin_service_enrollment')
      .delete()
      .eq('id', enrollmentId)

    if (error) this.handleError(error)
  }

  /**
   * Map database row to service object
   */
  private mapServiceFromDb(data: Record<string, unknown>): SuperAdminService {
    const enrollments = (data.enrollments as Array<{ status: string }>) || []
    const activeEnrollments = enrollments.filter(e => e.status === 'active')

    return {
      id: String(data.id),
      name: String(data.name),
      description: data.description ? String(data.description) : null,
      category: data.category as ServiceCategory | null,
      isActive: Boolean(data.is_active),
      configuration: (data.configuration as Record<string, unknown>) || {},
      createdAt: String(data.created_at),
      updatedAt: String(data.updated_at),
      activeClients: activeEnrollments.length,
    }
  }
}

export const superadminServicesService = new SuperAdminServicesServiceClass()
