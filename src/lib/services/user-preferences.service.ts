'use client'

import { BaseService } from './base.service'
import type { Json } from '@/types/database.types'

// User preferences types
export interface UserPreferences {
  id: string
  userId: string
  language: string
  timezone: string
  theme: 'light' | 'dark' | 'system'
  currency: string
  dateFormat: string
  notificationPreferences: NotificationPreferences
  createdAt: string
  updatedAt: string
}

export interface NotificationPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  monthlyReport: boolean
  leaveApproval: boolean
  expenseApproval: boolean
  payrollAlerts: boolean
  invoiceAlerts: boolean
}

export interface UpdateUserPreferencesInput {
  language?: string
  timezone?: string
  theme?: 'light' | 'dark' | 'system'
  currency?: string
  dateFormat?: string
  notificationPreferences?: Partial<NotificationPreferences>
}

const DEFAULT_PREFERENCES: Omit<UserPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  language: 'English',
  timezone: 'Asia/Kolkata',
  theme: 'light',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  notificationPreferences: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    monthlyReport: true,
    leaveApproval: true,
    expenseApproval: true,
    payrollAlerts: true,
    invoiceAlerts: true,
  },
}

// Storage key for localStorage fallback
const PREFERENCES_STORAGE_KEY = 'user_preferences'

class UserPreferencesServiceClass extends BaseService {
  /**
   * Get user preferences from the database
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const { data, error } = await this.supabase
        .from('user_preference')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No preferences found, return defaults
          return this.getDefaultPreferences(userId)
        }
        console.warn('Database preferences error, using localStorage:', error.message)
        return this.getLocalPreferences(userId)
      }

      if (!data) {
        return this.getDefaultPreferences(userId)
      }

      return this.mapDbToPreferences(data)
    } catch (error) {
      console.warn('Error fetching preferences, using localStorage:', error)
      return this.getLocalPreferences(userId)
    }
  }

  /**
   * Save user preferences - creates or updates
   */
  async saveUserPreferences(userId: string, updates: UpdateUserPreferencesInput): Promise<UserPreferences> {
    const currentPreferences = await this.getUserPreferences(userId)

    // Merge notification preferences properly
    const mergedNotificationPreferences = {
      ...currentPreferences.notificationPreferences,
      ...(updates.notificationPreferences || {}),
    }

    const updatedPreferences: UserPreferences = {
      ...currentPreferences,
      ...updates,
      notificationPreferences: mergedNotificationPreferences,
      updatedAt: new Date().toISOString(),
    }

    // Always save to localStorage as fallback
    this.saveLocalPreferences(userId, updatedPreferences)

    try {
      const { data: existing } = await this.supabase
        .from('user_preference')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (existing) {
        // Update existing preferences
        const { data, error } = await this.supabase
          .from('user_preference')
          .update({
            language: updatedPreferences.language,
            timezone: updatedPreferences.timezone,
            theme: updatedPreferences.theme,
            currency: updatedPreferences.currency,
            date_format: updatedPreferences.dateFormat,
            notification_preferences: updatedPreferences.notificationPreferences as unknown as Json,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()
          .single()

        if (error) {
          console.warn('Error updating preferences:', error.message)
          return updatedPreferences
        }

        return this.mapDbToPreferences(data)
      } else {
        // Create new preferences
        const { data, error } = await this.supabase
          .from('user_preference')
          .insert({
            user_id: userId,
            language: updatedPreferences.language,
            timezone: updatedPreferences.timezone,
            theme: updatedPreferences.theme,
            currency: updatedPreferences.currency,
            date_format: updatedPreferences.dateFormat,
            notification_preferences: updatedPreferences.notificationPreferences as unknown as Json,
          })
          .select()
          .single()

        if (error) {
          console.warn('Error creating preferences:', error.message)
          return updatedPreferences
        }

        return this.mapDbToPreferences(data)
      }
    } catch (error) {
      console.warn('Error saving to database, saved to localStorage:', error)
      return updatedPreferences
    }
  }

  /**
   * Get default preferences for a user
   */
  private getDefaultPreferences(userId: string): UserPreferences {
    return {
      id: `default-${userId}`,
      userId,
      ...DEFAULT_PREFERENCES,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  /**
   * Get preferences from localStorage
   */
  private getLocalPreferences(userId: string): UserPreferences {
    if (typeof window === 'undefined') {
      return this.getDefaultPreferences(userId)
    }

    try {
      const stored = localStorage.getItem(`${PREFERENCES_STORAGE_KEY}_${userId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...this.getDefaultPreferences(userId),
          ...parsed,
        }
      }
    } catch (error) {
      console.warn('Error reading localStorage preferences:', error)
    }

    return this.getDefaultPreferences(userId)
  }

  /**
   * Save preferences to localStorage
   */
  private saveLocalPreferences(userId: string, preferences: UserPreferences): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(`${PREFERENCES_STORAGE_KEY}_${userId}`, JSON.stringify(preferences))
    } catch (error) {
      console.warn('Error saving to localStorage:', error)
    }
  }

  /**
   * Map database row to preferences object
   */
  private mapDbToPreferences(data: Record<string, unknown>): UserPreferences {
    const notificationPrefs = data.notification_preferences as NotificationPreferences | null

    return {
      id: String(data.id),
      userId: String(data.user_id),
      language: String(data.language || DEFAULT_PREFERENCES.language),
      timezone: String(data.timezone || DEFAULT_PREFERENCES.timezone),
      theme: (data.theme as 'light' | 'dark' | 'system') || DEFAULT_PREFERENCES.theme,
      currency: String(data.currency || DEFAULT_PREFERENCES.currency),
      dateFormat: String(data.date_format || DEFAULT_PREFERENCES.dateFormat),
      notificationPreferences: notificationPrefs || DEFAULT_PREFERENCES.notificationPreferences,
      createdAt: String(data.created_at || new Date().toISOString()),
      updatedAt: String(data.updated_at || new Date().toISOString()),
    }
  }
}

export const userPreferencesService = new UserPreferencesServiceClass()
