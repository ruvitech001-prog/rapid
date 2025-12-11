'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  userPreferencesService,
  type UserPreferences,
  type UpdateUserPreferencesInput,
} from '@/lib/services/user-preferences.service'
import { useAuth } from '@/lib/auth/auth-context'
import { toast } from 'sonner'

const QUERY_KEY = 'user-preferences'

/**
 * Hook to fetch user preferences
 */
export function useUserPreferences() {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery<UserPreferences>({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => userPreferencesService.getUserPreferences(userId!),
    enabled: !!userId,
    staleTime: 300000, // 5 minutes - preferences don't change often
  })
}

/**
 * Hook to update user preferences
 */
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (updates: UpdateUserPreferencesInput) => {
      if (!user?.id) throw new Error('Not authenticated')
      return userPreferencesService.saveUserPreferences(user.id, updates)
    },
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData([QUERY_KEY, user?.id], updatedPreferences)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Preferences saved successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save preferences')
    },
  })
}

// Re-export types
export type { UserPreferences, UpdateUserPreferencesInput }
