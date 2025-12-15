/**
 * Employee Assets Service
 *
 * Handles tracking of company devices, gifts, and welcome kits assigned to employees.
 */

import { BaseService } from './base.service'

// =============================================
// TYPES
// =============================================

export type AssetType = 'device' | 'gift' | 'welcome_kit' | 'accessory' | 'other'
export type AssetStatus = 'ordered' | 'shipped' | 'delivered' | 'received' | 'returned' | 'lost'

export interface EmployeeAsset {
  id: string
  employeeId: string
  companyId: string
  type: AssetType
  name: string
  description?: string
  serialNumber?: string
  status: AssetStatus
  orderedAt?: string
  shippedAt?: string
  deliveredAt?: string
  receivedAt?: string
  trackingNumber?: string
  receiptNotes?: string
  createdAt: string
  updatedAt: string
}

export interface AssetConfirmationInput {
  assetId: string
  notes?: string
}

export interface PendingAssetSummary {
  count: number
  items: {
    id: string
    name: string
    type: AssetType
    deliveredAt?: string
  }[]
}

// =============================================
// SERVICE
// =============================================

class EmployeeAssetsService extends BaseService {
  /**
   * Get all assets assigned to an employee
   */
  async getEmployeeAssets(employeeId: string): Promise<EmployeeAsset[]> {
    const { data, error } = await this.supabase
      .from('employee_asset')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })

    if (error) {
      this.handleError(error)
    }

    return this.mapDatabaseAssets(data || [])
  }

  /**
   * Get assets that are delivered but not yet confirmed as received
   */
  async getPendingConfirmations(employeeId: string): Promise<PendingAssetSummary> {
    const { data, error } = await this.supabase
      .from('employee_asset')
      .select('id, name, type, delivered_at')
      .eq('employee_id', employeeId)
      .eq('status', 'delivered')

    if (error) {
      this.handleError(error)
    }

    const pendingAssets = data || []

    return {
      count: pendingAssets.length,
      items: pendingAssets.map(asset => ({
        id: asset.id,
        name: asset.name,
        type: asset.type as AssetType,
        deliveredAt: asset.delivered_at ?? undefined,
      })),
    }
  }

  /**
   * Confirm receipt of an asset
   */
  async confirmReceipt(input: AssetConfirmationInput): Promise<EmployeeAsset> {
    const { assetId, notes } = input
    const now = new Date().toISOString()

    const { data, error } = await this.supabase
      .from('employee_asset')
      .update({
        status: 'received',
        received_at: now,
        receipt_notes: notes,
        updated_at: now,
      })
      .eq('id', assetId)
      .select()
      .single()

    if (error) {
      this.handleError(error)
    }

    if (!data) {
      throw new Error('Asset not found')
    }

    return this.mapDatabaseAsset(data)
  }

  /**
   * Get a single asset by ID
   */
  async getAssetById(assetId: string): Promise<EmployeeAsset | null> {
    const { data, error } = await this.supabase
      .from('employee_asset')
      .select('*')
      .eq('id', assetId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      this.handleError(error)
    }

    return data ? this.mapDatabaseAsset(data) : null
  }

  // =============================================
  // PRIVATE HELPER METHODS
  // =============================================

  private mapDatabaseAssets(data: Record<string, unknown>[]): EmployeeAsset[] {
    return data.map(row => this.mapDatabaseAsset(row))
  }

  private mapDatabaseAsset(row: Record<string, unknown>): EmployeeAsset {
    return {
      id: row.id as string,
      employeeId: row.employee_id as string,
      companyId: row.company_id as string,
      type: row.type as AssetType,
      name: row.name as string,
      description: row.description as string | undefined,
      serialNumber: row.serial_number as string | undefined,
      status: row.status as AssetStatus,
      orderedAt: row.ordered_at as string | undefined,
      shippedAt: row.shipped_at as string | undefined,
      deliveredAt: row.delivered_at as string | undefined,
      receivedAt: row.received_at as string | undefined,
      trackingNumber: row.tracking_number as string | undefined,
      receiptNotes: row.receipt_notes as string | undefined,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }
  }
}

export const employeeAssetsService = new EmployeeAssetsService()
