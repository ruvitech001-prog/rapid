'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { contractorsService, type ContractorListItem, type ContractorWithContract } from '@/lib/services'

export function useContractors(companyId: string | undefined) {
  return useQuery<ContractorListItem[]>({
    queryKey: queryKeys.contractors.byCompany(companyId!),
    queryFn: () => contractorsService.getByCompany(companyId!),
    enabled: !!companyId,
  })
}

export function useContractor(contractorId: string | undefined) {
  return useQuery<ContractorWithContract | null>({
    queryKey: queryKeys.contractors.detail(contractorId!),
    queryFn: () => contractorsService.getById(contractorId!),
    enabled: !!contractorId,
  })
}

export function useContractorCount(companyId: string | undefined) {
  return useQuery<number>({
    queryKey: queryKeys.contractors.count(companyId!),
    queryFn: () => contractorsService.getCount(companyId!),
    enabled: !!companyId,
  })
}
