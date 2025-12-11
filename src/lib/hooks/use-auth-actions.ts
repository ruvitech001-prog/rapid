'use client'

import { useMutation } from '@tanstack/react-query'
import { authService } from '@/lib/services/auth.service'

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({
      email,
      currentPassword,
      newPassword,
    }: {
      email: string
      currentPassword: string
      newPassword: string
    }) => {
      const result = await authService.changePasswordWithVerification(
        email,
        currentPassword,
        newPassword
      )
      if (!result.success) {
        throw new Error(result.error || 'Failed to change password')
      }
      return result
    },
  })
}
