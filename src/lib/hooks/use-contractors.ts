'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { contractorsService, type ContractorListItem, type ContractorWithContract, type Contractor } from '@/lib/services'
import { toast } from 'sonner'

export function useContractors(companyId: string | undefined) {
  return useQuery<ContractorListItem[]>({
    queryKey: queryKeys.contractors.byCompany(companyId!),
    queryFn: () => contractorsService.getByCompany(companyId!),
    enabled: !!companyId,
    staleTime: 60000, // 1 minute
  })
}

export function useContractor(contractorId: string | undefined) {
  return useQuery<ContractorWithContract | null>({
    queryKey: queryKeys.contractors.detail(contractorId!),
    queryFn: () => contractorsService.getById(contractorId!),
    enabled: !!contractorId,
    staleTime: 60000,
  })
}

export function useContractorCount(companyId: string | undefined) {
  return useQuery<number>({
    queryKey: queryKeys.contractors.count(companyId!),
    queryFn: () => contractorsService.getCount(companyId!),
    enabled: !!companyId,
    staleTime: 60000,
  })
}

/**
 * Hook to update a contractor
 */
export function useUpdateContractor() {
  const queryClient = useQueryClient()

  return useMutation<Contractor, Error, { contractorId: string; updates: { fullName?: string; phoneNumber?: string; businessName?: string; status?: string } }>({
    mutationFn: ({ contractorId, updates }) => contractorsService.updateContractor(contractorId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] })
      queryClient.invalidateQueries({ queryKey: ['workforce'] })
      toast.success(`${data.full_name} updated successfully`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update contractor')
    },
  })
}

/**
 * Hook to deactivate a contractor
 */
export function useDeactivateContractor() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { contractorId: string; contractorName: string }>({
    mutationFn: ({ contractorId }) => contractorsService.deactivateContractor(contractorId),
    onSuccess: (_, { contractorName }) => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] })
      queryClient.invalidateQueries({ queryKey: ['workforce'] })
      toast.success(`${contractorName} has been deactivated`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deactivate contractor')
    },
  })
}
