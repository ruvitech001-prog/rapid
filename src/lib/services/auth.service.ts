import { createClient } from '@/lib/supabase/client'

class AuthServiceClass {
  private supabase = createClient()

  /**
   * Change user password
   * Note: This only works if the user is authenticated via Supabase Auth
   * In demo mode (localStorage auth), password changes won't persist
   */
  async changePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        console.error('[Auth Service] Password change error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('[Auth Service] Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Verify current password by attempting to re-authenticate
   * This is a safety check before allowing password change
   */
  async verifyCurrentPassword(email: string, currentPassword: string): Promise<boolean> {
    try {
      // Attempt to sign in with current credentials
      const { error } = await this.supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })

      return !error
    } catch {
      return false
    }
  }

  /**
   * Combined password change with current password verification
   */
  async changePasswordWithVerification(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    // First verify the current password
    const isValid = await this.verifyCurrentPassword(email, currentPassword)
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Then change the password
    return this.changePassword(newPassword)
  }
}

export const authService = new AuthServiceClass()
