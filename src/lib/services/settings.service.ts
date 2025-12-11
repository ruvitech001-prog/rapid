'use client'

import { BaseService } from './base.service'

// Settings types
export interface SystemSettings {
  id: string
  organizationName: string
  adminEmail: string
  supportEmail: string
  payrollCycle: string
  invoiceGeneration: string
  dataRetentionMonths: number
  twoFactorAuth: boolean
  ipWhitelist: boolean
  sessionTimeout: boolean
  sessionTimeoutMinutes: number
  failedLoginAlerts: boolean
  payrollCompletionAlerts: boolean
  invoiceGenerationAlerts: boolean
  weeklySystemReport: boolean
  updatedAt: string
}

const DEFAULT_SETTINGS: SystemSettings = {
  id: 'main',
  organizationName: 'Rapid.one',
  adminEmail: 'admin@rapid.one',
  supportEmail: 'support@rapid.one',
  payrollCycle: 'Monthly',
  invoiceGeneration: '16th of every month',
  dataRetentionMonths: 36,
  twoFactorAuth: true,
  ipWhitelist: false,
  sessionTimeout: true,
  sessionTimeoutMinutes: 60,
  failedLoginAlerts: true,
  payrollCompletionAlerts: true,
  invoiceGenerationAlerts: true,
  weeklySystemReport: true,
  updatedAt: new Date().toISOString(),
}

// Storage key for localStorage fallback
const SETTINGS_STORAGE_KEY = 'superadmin_settings'

class SettingsServiceClass extends BaseService {
  // Get settings from superadmin_settings table (key-value storage)
  async getSettings(): Promise<SystemSettings> {
    try {
      // Try to get from database using key-value pattern
      const { data, error } = await this.supabase
        .from('superadmin_settings')
        .select('key, value')

      if (error) {
        console.warn('Database settings error, using localStorage:', error.message)
        return this.getLocalSettings()
      }

      if (data && data.length > 0) {
        // Convert key-value pairs to settings object
        const settingsMap: Record<string, unknown> = {}
        data.forEach(row => {
          settingsMap[row.key] = row.value
        })
        return this.mapDbToSettings(settingsMap)
      }

      // No data in database, use localStorage
      return this.getLocalSettings()
    } catch (error) {
      console.warn('Error fetching settings, using localStorage:', error)
      return this.getLocalSettings()
    }
  }

  // Save settings - try database first, always save to localStorage as fallback
  async saveSettings(settings: Partial<SystemSettings>): Promise<void> {
    const currentSettings = await this.getSettings()
    const updatedSettings: SystemSettings = {
      ...currentSettings,
      ...settings,
      updatedAt: new Date().toISOString(),
    }

    // Always save to localStorage as fallback
    this.saveLocalSettings(updatedSettings)

    try {
      // Save each setting as a key-value pair in the database
      // Map settings to key-value format for the superadmin_settings table
      const settingsToSave = [
        { key: 'organization_name', value: updatedSettings.organizationName },
        { key: 'admin_email', value: updatedSettings.adminEmail },
        { key: 'support_email', value: updatedSettings.supportEmail },
        { key: 'payroll_cycle', value: updatedSettings.payrollCycle },
        { key: 'invoice_generation', value: updatedSettings.invoiceGeneration },
        { key: 'data_retention_months', value: updatedSettings.dataRetentionMonths },
        { key: 'two_factor_auth', value: updatedSettings.twoFactorAuth },
        { key: 'ip_whitelist', value: updatedSettings.ipWhitelist },
        { key: 'session_timeout', value: updatedSettings.sessionTimeout },
        { key: 'session_timeout_minutes', value: updatedSettings.sessionTimeoutMinutes },
        { key: 'failed_login_alerts', value: updatedSettings.failedLoginAlerts },
        { key: 'payroll_completion_alerts', value: updatedSettings.payrollCompletionAlerts },
        { key: 'invoice_generation_alerts', value: updatedSettings.invoiceGenerationAlerts },
        { key: 'weekly_system_report', value: updatedSettings.weeklySystemReport },
      ]

      // Upsert each setting
      for (const setting of settingsToSave) {
        const { error } = await this.supabase
          .from('superadmin_settings')
          .upsert(
            { key: setting.key, value: setting.value, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          )

        if (error) {
          console.warn(`Could not save setting ${setting.key}:`, error.message)
        }
      }
    } catch (error) {
      console.warn('Error saving to database, saved to localStorage:', error)
    }
  }

  // Get settings from localStorage
  private getLocalSettings(): SystemSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS

    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.warn('Error reading localStorage settings:', error)
    }

    return DEFAULT_SETTINGS
  }

  // Save settings to localStorage
  private saveLocalSettings(settings: SystemSettings): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.warn('Error saving to localStorage:', error)
    }
  }

  // Map database row to settings object
  private mapDbToSettings(data: Record<string, unknown>): SystemSettings {
    return {
      id: String(data.id || 'main'),
      organizationName: String(data.organization_name || DEFAULT_SETTINGS.organizationName),
      adminEmail: String(data.admin_email || DEFAULT_SETTINGS.adminEmail),
      supportEmail: String(data.support_email || DEFAULT_SETTINGS.supportEmail),
      payrollCycle: String(data.payroll_cycle || DEFAULT_SETTINGS.payrollCycle),
      invoiceGeneration: String(data.invoice_generation || DEFAULT_SETTINGS.invoiceGeneration),
      dataRetentionMonths: Number(data.data_retention_months) || DEFAULT_SETTINGS.dataRetentionMonths,
      twoFactorAuth: Boolean(data.two_factor_auth ?? DEFAULT_SETTINGS.twoFactorAuth),
      ipWhitelist: Boolean(data.ip_whitelist ?? DEFAULT_SETTINGS.ipWhitelist),
      sessionTimeout: Boolean(data.session_timeout ?? DEFAULT_SETTINGS.sessionTimeout),
      sessionTimeoutMinutes: Number(data.session_timeout_minutes) || DEFAULT_SETTINGS.sessionTimeoutMinutes,
      failedLoginAlerts: Boolean(data.failed_login_alerts ?? DEFAULT_SETTINGS.failedLoginAlerts),
      payrollCompletionAlerts: Boolean(data.payroll_completion_alerts ?? DEFAULT_SETTINGS.payrollCompletionAlerts),
      invoiceGenerationAlerts: Boolean(data.invoice_generation_alerts ?? DEFAULT_SETTINGS.invoiceGenerationAlerts),
      weeklySystemReport: Boolean(data.weekly_system_report ?? DEFAULT_SETTINGS.weeklySystemReport),
      updatedAt: String(data.updated_at || new Date().toISOString()),
    }
  }
}

export const settingsService = new SettingsServiceClass()
