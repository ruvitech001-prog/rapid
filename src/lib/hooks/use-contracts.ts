'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import {
  contractsService,
  type EmployeeContractWithDetails,
  type ContractorContractWithDetails,
  type ContractorOwnContract,
} from '@/lib/services/contracts.service'

export function useEmployeeContracts(companyId: string | undefined) {
  return useQuery<EmployeeContractWithDetails[]>({
    queryKey: queryKeys.contracts.employees(companyId!),
    queryFn: () => contractsService.getEmployeeContracts(companyId!),
    enabled: !!companyId,
  })
}

export function useContractorContracts(companyId: string | undefined) {
  return useQuery<ContractorContractWithDetails[]>({
    queryKey: queryKeys.contracts.contractors(companyId!),
    queryFn: () => contractsService.getContractorContracts(companyId!),
    enabled: !!companyId,
  })
}

export function useEmployeeContract(contractId: string | undefined) {
  return useQuery<EmployeeContractWithDetails | null>({
    queryKey: queryKeys.contracts.employeeDetail(contractId!),
    queryFn: () => contractsService.getEmployeeContractById(contractId!),
    enabled: !!contractId,
  })
}

export function useContractorContract(contractId: string | undefined) {
  return useQuery<ContractorContractWithDetails | null>({
    queryKey: queryKeys.contracts.contractorDetail(contractId!),
    queryFn: () => contractsService.getContractorContractById(contractId!),
    enabled: !!contractId,
  })
}

export function useContractStats(companyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.contracts.stats(companyId!),
    queryFn: () => contractsService.getContractStats(companyId!),
    enabled: !!companyId,
  })
}

// Hook for contractors to view their own contracts
export function useContractorOwnContracts(contractorId: string | undefined) {
  return useQuery<ContractorOwnContract[]>({
    queryKey: ['contracts', 'contractor-own', contractorId],
    queryFn: () => contractsService.getContractsForContractor(contractorId!),
    enabled: !!contractorId,
  })
}
