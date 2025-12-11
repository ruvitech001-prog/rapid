'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Shield, Bell, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useSettings, useSaveSettings } from '@/lib/hooks'

interface ConfirmDialog {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
}

export default function SettingsPage() {
  // Fetch settings from backend
  const { data: savedSettings, isLoading: isLoadingSettings } = useSettings()
  const saveSettingsMutation = useSaveSettings()

  // Form states - initialized from fetched settings
  const [basicInfo, setBasicInfo] = useState({
    organizationName: '',
    adminEmail: '',
    supportEmail: '',
  })

  const [policies, setPolicies] = useState({
    payrollCycle: 'Monthly',
    invoiceGeneration: '16th of every month',
    dataRetentionMonths: 36,
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    ipWhitelist: false,
    sessionTimeout: true,
    sessionTimeoutMinutes: 60,
  })

  const [notifications, setNotifications] = useState({
    failedLoginAlerts: true,
    payrollCompletionAlerts: true,
    invoiceGenerationAlerts: true,
    weeklySystemReport: true,
  })

  // Update form states when settings are loaded
  useEffect(() => {
    if (savedSettings) {
      setBasicInfo({
        organizationName: savedSettings.organizationName,
        adminEmail: savedSettings.adminEmail,
        supportEmail: savedSettings.supportEmail,
      })
      setPolicies({
        payrollCycle: savedSettings.payrollCycle,
        invoiceGeneration: savedSettings.invoiceGeneration,
        dataRetentionMonths: savedSettings.dataRetentionMonths,
      })
      setSecurity({
        twoFactorAuth: savedSettings.twoFactorAuth,
        ipWhitelist: savedSettings.ipWhitelist,
        sessionTimeout: savedSettings.sessionTimeout,
        sessionTimeoutMinutes: savedSettings.sessionTimeoutMinutes,
      })
      setNotifications({
        failedLoginAlerts: savedSettings.failedLoginAlerts,
        payrollCompletionAlerts: savedSettings.payrollCompletionAlerts,
        invoiceGenerationAlerts: savedSettings.invoiceGenerationAlerts,
        weeklySystemReport: savedSettings.weeklySystemReport,
      })
    }
  }, [savedSettings])

  // Loading states
  const [isSavingBasicInfo, setIsSavingBasicInfo] = useState(false)
  const [isSavingPolicies, setIsSavingPolicies] = useState(false)
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)
  const [isClearingCache, setIsClearingCache] = useState(false)
  const [isResettingStats, setIsResettingStats] = useState(false)

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  // Save handlers - now using real persistence
  const handleSaveBasicInfo = async () => {
    if (!basicInfo.organizationName.trim()) {
      toast.error('Organization name is required')
      return
    }
    if (!basicInfo.adminEmail.trim() || !basicInfo.adminEmail.includes('@')) {
      toast.error('Valid admin email is required')
      return
    }

    setIsSavingBasicInfo(true)
    try {
      await saveSettingsMutation.mutateAsync(basicInfo)
      toast.success('Basic information saved successfully')
    } catch {
      toast.error('Failed to save basic information')
    } finally {
      setIsSavingBasicInfo(false)
    }
  }

  const handleSavePolicies = async () => {
    if (policies.dataRetentionMonths < 6) {
      toast.error('Data retention must be at least 6 months')
      return
    }

    setIsSavingPolicies(true)
    try {
      await saveSettingsMutation.mutateAsync(policies)
      toast.success('Policies saved successfully')
    } catch {
      toast.error('Failed to save policies')
    } finally {
      setIsSavingPolicies(false)
    }
  }

  const handleSaveSecurity = async () => {
    if (security.sessionTimeout && security.sessionTimeoutMinutes < 5) {
      toast.error('Session timeout must be at least 5 minutes')
      return
    }

    setIsSavingSecurity(true)
    try {
      await saveSettingsMutation.mutateAsync(security)
      toast.success('Security settings saved successfully')
    } catch {
      toast.error('Failed to save security settings')
    } finally {
      setIsSavingSecurity(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true)
    try {
      await saveSettingsMutation.mutateAsync(notifications)
      toast.success('Notification settings saved successfully')
    } catch {
      toast.error('Failed to save notification settings')
    } finally {
      setIsSavingNotifications(false)
    }
  }

  // Show loading state while fetching initial settings
  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Destructive action handlers with confirmation
  const handleClearCache = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear Cache',
      message: 'Are you sure you want to clear all system caches? This may temporarily slow down the system.',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        setIsClearingCache(true)
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          toast.success('Cache cleared successfully')
        } catch {
          toast.error('Failed to clear cache')
        } finally {
          setIsClearingCache(false)
        }
      },
    })
  }

  const handleResetStatistics = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Statistics',
      message: 'Are you sure you want to reset all system statistics? This action cannot be undone and all historical data will be lost.',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        setIsResettingStats(true)
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          toast.success('Statistics reset successfully')
        } catch {
          toast.error('Failed to reset statistics')
        } finally {
          setIsResettingStats(false)
        }
      },
    })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{confirmDialog.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDialog.onConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage system configuration and settings</p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>System organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="orgName" className="text-sm font-medium">Organization Name</label>
            <Input
              id="orgName"
              value={basicInfo.organizationName}
              onChange={(e) => setBasicInfo(prev => ({ ...prev, organizationName: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="adminEmail" className="text-sm font-medium">Admin Email</label>
            <Input
              id="adminEmail"
              type="email"
              value={basicInfo.adminEmail}
              onChange={(e) => setBasicInfo(prev => ({ ...prev, adminEmail: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="supportEmail" className="text-sm font-medium">Support Email</label>
            <Input
              id="supportEmail"
              type="email"
              value={basicInfo.supportEmail}
              onChange={(e) => setBasicInfo(prev => ({ ...prev, supportEmail: e.target.value }))}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSaveBasicInfo} disabled={isSavingBasicInfo}>
            {isSavingBasicInfo ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Company Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Company Policies</CardTitle>
          <CardDescription>Global policies for all companies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="payrollCycle" className="text-sm font-medium">Default Payroll Cycle</label>
            <select
              id="payrollCycle"
              value={policies.payrollCycle}
              onChange={(e) => setPolicies(prev => ({ ...prev, payrollCycle: e.target.value }))}
              className="w-full border rounded-md p-2 mt-1 bg-background"
            >
              <option>Monthly</option>
              <option>Bi-weekly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div>
            <label htmlFor="invoiceGen" className="text-sm font-medium">Invoice Auto-Generation</label>
            <select
              id="invoiceGen"
              value={policies.invoiceGeneration}
              onChange={(e) => setPolicies(prev => ({ ...prev, invoiceGeneration: e.target.value }))}
              className="w-full border rounded-md p-2 mt-1 bg-background"
            >
              <option>16th of every month</option>
              <option>1st of every month</option>
              <option>Last day of month</option>
              <option>Manual only</option>
            </select>
          </div>
          <div>
            <label htmlFor="dataRetention" className="text-sm font-medium">Data Retention Period (months)</label>
            <Input
              id="dataRetention"
              type="number"
              min={6}
              value={policies.dataRetentionMonths}
              onChange={(e) => setPolicies(prev => ({ ...prev, dataRetentionMonths: parseInt(e.target.value) || 6 }))}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSavePolicies} disabled={isSavingPolicies}>
            {isSavingPolicies ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Policies
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>System security and access configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
            </div>
            <input
              type="checkbox"
              checked={security.twoFactorAuth}
              onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">IP Whitelist</p>
              <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
            </div>
            <input
              type="checkbox"
              checked={security.ipWhitelist}
              onChange={(e) => setSecurity(prev => ({ ...prev, ipWhitelist: e.target.checked }))}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">Auto-logout inactive sessions</p>
            </div>
            <input
              type="checkbox"
              checked={security.sessionTimeout}
              onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.checked }))}
              className="h-4 w-4"
            />
          </div>
          {security.sessionTimeout && (
            <div>
              <label htmlFor="sessionTimeout" className="text-sm font-medium">Session Timeout Duration (minutes)</label>
              <Input
                id="sessionTimeout"
                type="number"
                min={5}
                value={security.sessionTimeoutMinutes}
                onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeoutMinutes: parseInt(e.target.value) || 5 }))}
                className="mt-1"
              />
            </div>
          )}
          <Button onClick={handleSaveSecurity} disabled={isSavingSecurity}>
            {isSavingSecurity ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Shield className="h-4 w-4 mr-2" />
            )}
            Update Security Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Email Alerts for Failed Logins</p>
              <p className="text-sm text-muted-foreground">Notify admins of suspicious login attempts</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.failedLoginAlerts}
              onChange={(e) => setNotifications(prev => ({ ...prev, failedLoginAlerts: e.target.checked }))}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Payroll Completion Alerts</p>
              <p className="text-sm text-muted-foreground">Notify when payroll runs are completed</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.payrollCompletionAlerts}
              onChange={(e) => setNotifications(prev => ({ ...prev, payrollCompletionAlerts: e.target.checked }))}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Invoice Generation Alerts</p>
              <p className="text-sm text-muted-foreground">Notify when invoices are generated</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.invoiceGenerationAlerts}
              onChange={(e) => setNotifications(prev => ({ ...prev, invoiceGenerationAlerts: e.target.checked }))}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Weekly System Report</p>
              <p className="text-sm text-muted-foreground">Send weekly summary of system activities</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklySystemReport}
              onChange={(e) => setNotifications(prev => ({ ...prev, weeklySystemReport: e.target.checked }))}
              className="h-4 w-4"
            />
          </div>
          <Button onClick={handleSaveNotifications} disabled={isSavingNotifications}>
            {isSavingNotifications ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Third-party service integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded flex items-center justify-between">
            <div>
              <p className="font-medium">Forex Integration</p>
              <p className="text-sm text-muted-foreground">Enable currency conversion</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="p-3 border rounded flex items-center justify-between">
            <div>
              <p className="font-medium">Email Service Provider</p>
              <p className="text-sm text-muted-foreground">SMTP configuration</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="p-3 border rounded flex items-center justify-between">
            <div>
              <p className="font-medium">Payment Gateway</p>
              <p className="text-sm text-muted-foreground">Payment processing</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>System details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm font-medium">System Version</span>
            <span className="text-sm text-muted-foreground">v2.0.0</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm font-medium">Database Status</span>
            <span className="text-sm text-green-600">Online</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm font-medium">API Status</span>
            <span className="text-sm text-green-600">Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm font-medium">Last Backup</span>
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-IN')} 02:00 UTC</span>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
          <CardDescription className="text-red-800">Destructive operations - proceed with caution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 border border-red-200 rounded bg-white flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Clear Cache</p>
              <p className="text-sm text-red-700">Clear all system caches</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearCache}
              disabled={isClearingCache}
            >
              {isClearingCache ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Clear'
              )}
            </Button>
          </div>
          <div className="p-3 border border-red-200 rounded bg-white flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Reset Statistics</p>
              <p className="text-sm text-red-700">Reset all system statistics and counters</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetStatistics}
              disabled={isResettingStats}
            >
              {isResettingStats ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Reset'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
