'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Shield, Bell } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
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
            <label className="text-sm font-medium">Organization Name</label>
            <Input defaultValue="Rapid.one" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Admin Email</label>
            <Input defaultValue="admin@rapid.one" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Support Email</label>
            <Input defaultValue="support@rapid.one" className="mt-1" />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
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
            <label className="text-sm font-medium">Default Payroll Cycle</label>
            <select className="w-full border rounded-md p-2 mt-1">
              <option>Monthly</option>
              <option>Bi-weekly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Invoice Auto-Generation</label>
            <select className="w-full border rounded-md p-2 mt-1">
              <option>16th of every month</option>
              <option>1st of every month</option>
              <option>Last day of month</option>
              <option>Manual only</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Data Retention Period (months)</label>
            <Input type="number" defaultValue="36" className="mt-1" />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
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
          <div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">IP Whitelist</p>
                <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Auto-logout inactive sessions</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Session Timeout Duration (minutes)</label>
            <Input type="number" defaultValue="60" className="mt-1" />
          </div>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
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
          <div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Email Alerts for Failed Logins</p>
                <p className="text-sm text-muted-foreground">Notify admins of suspicious login attempts</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Payroll Completion Alerts</p>
                <p className="text-sm text-muted-foreground">Notify when payroll runs are completed</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Invoice Generation Alerts</p>
                <p className="text-sm text-muted-foreground">Notify when invoices are generated</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Weekly System Report</p>
                <p className="text-sm text-muted-foreground">Send weekly summary of system activities</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
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
            <span className="text-sm text-green-600">✓ Online</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm font-medium">API Status</span>
            <span className="text-sm text-green-600">✓ Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm font-medium">Last Backup</span>
            <span className="text-sm text-muted-foreground">2024-04-10 02:00 UTC</span>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
          <CardDescription className="text-red-800">Destructive operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 border border-red-200 rounded bg-white flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Clear Cache</p>
              <p className="text-sm text-red-700">Clear all system caches</p>
            </div>
            <Button variant="destructive" size="sm">Clear</Button>
          </div>
          <div className="p-3 border border-red-200 rounded bg-white flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Reset Statistics</p>
              <p className="text-sm text-red-700">Reset all system statistics and counters</p>
            </div>
            <Button variant="destructive" size="sm">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
