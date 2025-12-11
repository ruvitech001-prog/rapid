'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  profileService,
  type EmployeeProfile,
  type ContractorProfile,
  type Address,
  type BankAccount,
  type EmergencyContact,
} from '@/lib/services'
import type { Employee, Contractor } from '@/lib/services/profile.service'

export function useEmployeeProfile(employeeId: string | undefined) {
  return useQuery<EmployeeProfile | null>({
    queryKey: ['profile', 'employee', employeeId],
    queryFn: () => profileService.getEmployeeProfile(employeeId!),
    enabled: !!employeeId,
  })
}

export function useContractorProfile(contractorId: string | undefined) {
  return useQuery<ContractorProfile | null>({
    queryKey: ['profile', 'contractor', contractorId],
    queryFn: () => profileService.getContractorProfile(contractorId!),
    enabled: !!contractorId,
  })
}

export function useUpdateEmployeeInfo() {
  const queryClient = useQueryClient()

  return useMutation<
    Employee,
    Error,
    { employeeId: string; data: Partial<Employee> }
  >({
    mutationFn: ({ employeeId, data }) =>
      profileService.updateEmployeeInfo(employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateContractorInfo() {
  const queryClient = useQueryClient()

  return useMutation<
    Contractor,
    Error,
    { contractorId: string; data: Partial<Contractor> }
  >({
    mutationFn: ({ contractorId, data }) =>
      profileService.updateContractorInfo(contractorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useSaveAddress() {
  const queryClient = useQueryClient()

  return useMutation<
    Address,
    Error,
    Omit<Address, 'id' | 'created_at' | 'updated_at'> & { id?: string }
  >({
    mutationFn: (address) => profileService.saveAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useAddBankAccount() {
  const queryClient = useQueryClient()

  return useMutation<
    BankAccount,
    Error,
    Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>
  >({
    mutationFn: (account) => profileService.addBankAccount(account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateBankAccount() {
  const queryClient = useQueryClient()

  return useMutation<
    BankAccount,
    Error,
    { accountId: string; data: Partial<BankAccount> }
  >({
    mutationFn: ({ accountId, data }) =>
      profileService.updateBankAccount(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useAddEmergencyContact() {
  const queryClient = useQueryClient()

  return useMutation<
    EmergencyContact,
    Error,
    Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at'>
  >({
    mutationFn: (contact) => profileService.addEmergencyContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateEmergencyContact() {
  const queryClient = useQueryClient()

  return useMutation<
    EmergencyContact,
    Error,
    { contactId: string; data: Partial<EmergencyContact> }
  >({
    mutationFn: ({ contactId, data }) =>
      profileService.updateEmergencyContact(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteEmergencyContact() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (contactId) => profileService.deleteEmergencyContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
