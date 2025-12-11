'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService, type SystemSettings } from '@/lib/services'

export function useSettings() {
  return useQuery<SystemSettings>({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useSaveSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: Partial<SystemSettings>) =>
      settingsService.saveSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (error) => {
      console.error('[Settings Save] Failed:', error)
    },
  })
}
