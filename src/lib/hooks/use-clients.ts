'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsService, type ClientFilters, type UpdateClientInput, type ClientDetails, type CreateClientInput } from '@/lib/services/clients.service'
import { useAuth } from '@/lib/auth/auth-context'
import { toast } from 'sonner'

const QUERY_KEY = 'superadmin-clients'

export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => clientsService.getClients(filters),
    staleTime: 60000, // 1 minute
  })
}

export function useClient(id: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: () => (id ? clientsService.getClientById(id) : null),
    enabled: !!id,
    staleTime: 30000,
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClientInput }) => {
      if (!user) throw new Error('Not authenticated')
      return clientsService.updateClient(id, data, {
        id: user.id,
        email: user.email,
        role: user.superAdminRole || user.role,
      })
    },
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(`${updatedClient.legalName} has been updated`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update client')
    },
  })
}

export function useDeactivateClient() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated')
      return clientsService.deactivateClient(id, {
        id: user.id,
        email: user.email,
        role: user.superAdminRole || user.role,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Client has been deactivated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deactivate client')
    },
  })
}

export function useReactivateClient() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated')
      return clientsService.reactivateClient(id, {
        id: user.id,
        email: user.email,
        role: user.superAdminRole || user.role,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Client has been reactivated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reactivate client')
    },
  })
}

/**
 * Hook to create a new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (data: CreateClientInput) => {
      if (!user) throw new Error('Not authenticated')
      return clientsService.createClient(data, {
        id: user.id,
        email: user.email,
        role: user.superAdminRole || user.role,
      })
    },
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(`${newClient.legalName} has been created`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create client')
    },
  })
}

// Re-export types for convenience
export type { ClientDetails, ClientFilters, UpdateClientInput, CreateClientInput }
