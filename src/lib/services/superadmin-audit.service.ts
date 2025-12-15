import { BaseService } from './base.service'
import type { Json } from '@/types/database.types'

export type AuditAction =
  | 'request.approved'
  | 'request.rejected'
  | 'request.assigned'
  | 'team.member_created'
  | 'team.member_updated'
  | 'team.member_deleted'
  | 'team.role_changed'
  | 'team.clients_assigned'
  | 'company.viewed'
  | 'settings.updated'
  // Finance actions
  | 'finance.declaration_approved'
  | 'finance.declaration_rejected'
  | 'finance.tax_proof_verified'
  | 'finance.tax_proof_rejected'
  // Invoice actions
  | 'invoice.marked_paid'
  | 'invoice.reminder_sent'
  | 'invoice.generated'
  | 'invoice.status_draft'
  | 'invoice.status_sent'
  | 'invoice.status_approved'
  | 'invoice.status_paid'
  | 'invoice.status_overdue'
  | 'invoice.status_cancelled'
  // Services actions
  | 'services.service_created'
  | 'services.service_updated'
  | 'services.service_deleted'
  | 'services.company_enrolled'
  | 'services.company_unenrolled'

export type EntityType =
  | 'request'
  | 'team_member'
  | 'company'
  | 'settings'
  | 'investment_declaration'
  | 'tax_proof'
  | 'invoice'
  | 'service'
  | 'service_enrollment'

export interface AuditLogEntry {
  id: string
  userId: string
  userEmail: string
  userRole: string
  action: AuditAction
  entityType: EntityType
  entityId: string | null
  oldData: Record<string, unknown> | null
  newData: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export interface AuditLogFilters {
  action?: string
  entityType?: EntityType
  entityId?: string
  userId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface PaginatedAuditLogs {
  data: AuditLogEntry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

const DEFAULT_PAGE_SIZE = 50

class SuperAdminAuditServiceClass extends BaseService {
  /**
   * Log an audit event
   */
  async log(params: {
    userId: string
    userEmail: string
    userRole: string
    action: AuditAction
    entityType: EntityType
    entityId?: string | null
    oldData?: Record<string, unknown> | null
    newData?: Record<string, unknown> | null
    metadata?: Record<string, unknown> | null
  }): Promise<void> {
    // Validate required parameters
    if (!params.userId || typeof params.userId !== 'string') {
      console.error('[Audit Log Error] Invalid userId')
      return
    }
    if (!params.userEmail || typeof params.userEmail !== 'string') {
      console.error('[Audit Log Error] Invalid userEmail')
      return
    }
    if (!params.action || typeof params.action !== 'string') {
      console.error('[Audit Log Error] Invalid action')
      return
    }
    if (!params.entityType || typeof params.entityType !== 'string') {
      console.error('[Audit Log Error] Invalid entityType')
      return
    }

    const { error } = await this.supabase
      .from('superadmin_audit_log')
      .insert({
        user_id: params.userId,
        user_email: params.userEmail,
        user_role: params.userRole || 'unknown',
        action: params.action,
        entity_type: params.entityType,
        entity_id: params.entityId || null,
        old_data: (params.oldData || null) as Json,
        new_data: (params.newData || null) as Json,
        metadata: (params.metadata || null) as Json,
      })

    if (error) {
      // Log error but don't throw - audit logging should not break main operations
      console.error('[Audit Log Error]', error)
    }
  }

  /**
   * Get audit logs with filtering and pagination
   */
  async getLogs(filters?: AuditLogFilters): Promise<PaginatedAuditLogs> {
    const page = filters?.page || 1
    const limit = filters?.limit || DEFAULT_PAGE_SIZE
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('superadmin_audit_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.action) {
      query = query.eq('action', filters.action)
    }
    if (filters?.entityType) {
      query = query.eq('entity_type', filters.entityType)
    }
    if (filters?.entityId) {
      query = query.eq('entity_id', filters.entityId)
    }
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate)
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    const { data: logs, error, count } = await query.range(offset, offset + limit - 1)

    if (error) this.handleError(error)

    if (!logs || logs.length === 0) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0, hasMore: false },
      }
    }

    const total = count || logs.length
    const totalPages = Math.ceil(total / limit)

    return {
      data: logs.map((log) => ({
        id: log.id,
        userId: log.user_id,
        userEmail: log.user_email,
        userRole: log.user_role,
        action: log.action as AuditAction,
        entityType: log.entity_type as EntityType,
        entityId: log.entity_id,
        oldData: log.old_data as Record<string, unknown> | null,
        newData: log.new_data as Record<string, unknown> | null,
        metadata: log.metadata as Record<string, unknown> | null,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        createdAt: log.created_at || new Date().toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityHistory(
    entityType: EntityType,
    entityId: string
  ): Promise<AuditLogEntry[]> {
    // Validate inputs
    if (!entityType || typeof entityType !== 'string') {
      throw new Error('Invalid entity type')
    }
    if (!entityId || typeof entityId !== 'string') {
      throw new Error('Invalid entity ID')
    }

    const { data: logs, error } = await this.supabase
      .from('superadmin_audit_log')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) this.handleError(error)

    return (logs || []).map((log) => ({
      id: log.id,
      userId: log.user_id,
      userEmail: log.user_email,
      userRole: log.user_role,
      action: log.action as AuditAction,
      entityType: log.entity_type as EntityType,
      entityId: log.entity_id,
      oldData: log.old_data as Record<string, unknown> | null,
      newData: log.new_data as Record<string, unknown> | null,
      metadata: log.metadata as Record<string, unknown> | null,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      createdAt: log.created_at || new Date().toISOString(),
    }))
  }
}

export const superadminAuditService = new SuperAdminAuditServiceClass()
