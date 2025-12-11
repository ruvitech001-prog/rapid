/**
 * Employee Assets Hooks
 *
 * React Query hooks for managing employee assets (devices, gifts, welcome kits).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  employeeAssetsService,
  type EmployeeAsset,
  type AssetConfirmationInput,
  type PendingAssetSummary,
} from '../services/employee-assets.service'

// =============================================
// QUERY KEYS
// =============================================

export const assetKeys = {
  all: ['employee-assets'] as const,
  byEmployee: (employeeId: string) => [...assetKeys.all, 'employee', employeeId] as const,
  pending: (employeeId: string) => [...assetKeys.all, 'pending', employeeId] as const,
  detail: (assetId: string) => [...assetKeys.all, 'detail', assetId] as const,
}

// =============================================
// HOOKS
// =============================================

/**
 * Get all assets for an employee
 */
export function useEmployeeAssets(employeeId: string | undefined) {
  return useQuery<EmployeeAsset[], Error>({
    queryKey: assetKeys.byEmployee(employeeId || ''),
    queryFn: () => {
      if (!employeeId) throw new Error('Employee ID is required')
      return employeeAssetsService.getEmployeeAssets(employeeId)
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get pending asset confirmations for an employee
 */
export function usePendingAssetConfirmations(employeeId: string | undefined) {
  return useQuery<PendingAssetSummary, Error>({
    queryKey: assetKeys.pending(employeeId || ''),
    queryFn: () => {
      if (!employeeId) throw new Error('Employee ID is required')
      return employeeAssetsService.getPendingConfirmations(employeeId)
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get a single asset by ID
 */
export function useAssetDetail(assetId: string | undefined) {
  return useQuery<EmployeeAsset | null, Error>({
    queryKey: assetKeys.detail(assetId || ''),
    queryFn: () => {
      if (!assetId) throw new Error('Asset ID is required')
      return employeeAssetsService.getAssetById(assetId)
    },
    enabled: !!assetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Confirm receipt of an asset
 */
export function useConfirmAssetReceipt() {
  const queryClient = useQueryClient()

  return useMutation<EmployeeAsset, Error, AssetConfirmationInput>({
    mutationFn: (input) => employeeAssetsService.confirmReceipt(input),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: assetKeys.byEmployee(data.employeeId) })
      queryClient.invalidateQueries({ queryKey: assetKeys.pending(data.employeeId) })
      queryClient.invalidateQueries({ queryKey: assetKeys.detail(data.id) })
    },
  })
}
