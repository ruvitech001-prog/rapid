/**
 * Employee Assets Service
 *
 * Handles tracking of company devices, gifts, and welcome kits assigned to employees.
 * Uses localStorage as fallback when database table is not available.
 */

import { BaseService } from './base.service'

// =============================================
// TYPES
// =============================================

export type AssetType = 'device' | 'gift' | 'welcome_kit'
export type AssetStatus = 'ordered' | 'shipped' | 'delivered' | 'received'

export interface EmployeeAsset {
  id: string
  employeeId: string
  companyId: string
  type: AssetType
  name: string
  description?: string
  serialNumber?: string
  status: AssetStatus
  orderedAt: string
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

const STORAGE_KEY = 'aether_employee_assets'

class EmployeeAssetsService extends BaseService {
  /**
   * Get all assets assigned to an employee
   * Note: Database table may not exist yet, falls back to localStorage
   */
  async getEmployeeAssets(employeeId: string): Promise<EmployeeAsset[]> {
    // For now, use localStorage fallback since employee_asset table may not exist
    // When the table is created, uncomment the database query below
    /*
    const { data, error } = await this.supabase
      .from('employee_asset')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return this.mapDatabaseAssets(data)
    }
    */

    // Use localStorage for demo
    return this.getLocalAssets(employeeId)
  }

  /**
   * Get assets that are delivered but not yet confirmed as received
   */
  async getPendingConfirmations(employeeId: string): Promise<PendingAssetSummary> {
    const assets = await this.getEmployeeAssets(employeeId)

    const pendingAssets = assets.filter(
      asset => asset.status === 'delivered'
    )

    return {
      count: pendingAssets.length,
      items: pendingAssets.map(asset => ({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        deliveredAt: asset.deliveredAt,
      })),
    }
  }

  /**
   * Confirm receipt of an asset
   * Note: Database table may not exist yet, uses localStorage
   */
  async confirmReceipt(input: AssetConfirmationInput): Promise<EmployeeAsset> {
    const { assetId, notes } = input

    // For now, use localStorage since employee_asset table may not exist
    // When the table is created, uncomment the database query below
    /*
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

    if (!error && data) {
      return this.mapDatabaseAsset(data)
    }
    */

    // Use localStorage for demo
    return this.confirmLocalReceipt(assetId, notes)
  }

  /**
   * Get a single asset by ID
   * Note: Database table may not exist yet, uses localStorage
   */
  async getAssetById(assetId: string): Promise<EmployeeAsset | null> {
    // For now, use localStorage since employee_asset table may not exist
    // When the table is created, uncomment the database query below
    /*
    const { data, error } = await this.supabase
      .from('employee_asset')
      .select('*')
      .eq('id', assetId)
      .single()

    if (!error && data) {
      return this.mapDatabaseAsset(data)
    }
    */

    // Use localStorage for demo
    const allAssets = this.getAllLocalAssets()
    return allAssets.find(a => a.id === assetId) || null
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
      orderedAt: row.ordered_at as string,
      shippedAt: row.shipped_at as string | undefined,
      deliveredAt: row.delivered_at as string | undefined,
      receivedAt: row.received_at as string | undefined,
      trackingNumber: row.tracking_number as string | undefined,
      receiptNotes: row.receipt_notes as string | undefined,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }
  }

  private getLocalAssets(employeeId: string): EmployeeAsset[] {
    const allAssets = this.getAllLocalAssets()
    return allAssets.filter(a => a.employeeId === employeeId)
  }

  private getAllLocalAssets(): EmployeeAsset[] {
    if (typeof window === 'undefined') return this.getMockAssets()

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as EmployeeAsset[]
      }
    } catch {
      // Ignore parse errors
    }

    // Initialize with mock data for demo
    const mockAssets = this.getMockAssets()
    this.saveLocalAssets(mockAssets)
    return mockAssets
  }

  private saveLocalAssets(assets: EmployeeAsset[]): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
    } catch {
      // Ignore storage errors
    }
  }

  private confirmLocalReceipt(assetId: string, notes?: string): EmployeeAsset {
    const assets = this.getAllLocalAssets()
    const existingAsset = assets.find(a => a.id === assetId)

    if (!existingAsset) {
      throw new Error('Asset not found')
    }

    const now = new Date().toISOString()
    const updatedAsset: EmployeeAsset = {
      ...existingAsset,
      status: 'received',
      receivedAt: now,
      receiptNotes: notes,
      updatedAt: now,
    }

    // Update the assets array
    const updatedAssets = assets.map(a => a.id === assetId ? updatedAsset : a)
    this.saveLocalAssets(updatedAssets)

    return updatedAsset
  }

  private getMockAssets(): EmployeeAsset[] {
    // Demo mock data - represents assets that have been delivered but not confirmed
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)

    return [
      {
        id: 'asset-001',
        employeeId: 'demo-employee-id',
        companyId: 'demo-company-id',
        type: 'device',
        name: 'MacBook Pro 14"',
        description: 'Apple MacBook Pro 14-inch M3 Pro',
        serialNumber: 'C02XM0XXJGH5',
        status: 'delivered',
        orderedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        shippedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        deliveredAt: oneWeekAgo.toISOString(),
        trackingNumber: 'IW12345678IN',
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: oneWeekAgo.toISOString(),
      },
      {
        id: 'asset-002',
        employeeId: 'demo-employee-id',
        companyId: 'demo-company-id',
        type: 'welcome_kit',
        name: 'Welcome Kit',
        description: 'Company branded merchandise and onboarding materials',
        status: 'delivered',
        orderedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        shippedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        deliveredAt: twoDaysAgo.toISOString(),
        trackingNumber: 'DL98765432IN',
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: twoDaysAgo.toISOString(),
      },
      {
        id: 'asset-003',
        employeeId: 'demo-employee-id',
        companyId: 'demo-company-id',
        type: 'device',
        name: 'Magic Mouse',
        description: 'Apple Magic Mouse - White',
        status: 'received',
        orderedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        shippedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        deliveredAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        receivedAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000).toISOString(),
        receiptNotes: 'Received in good condition',
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }
}

export const employeeAssetsService = new EmployeeAssetsService()
