'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Filter } from 'lucide-react'

export default function AuditLogsPage() {
  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-04-10 14:32:15',
      user: 'admin@techcorp.com',
      action: 'Created new employee',
      resource: 'Employee: John Doe',
      company: 'TechCorp Inc',
      status: 'Success',
      details: 'Employee profile created with ID EMP-2024-001',
    },
    {
      id: 2,
      timestamp: '2024-04-10 13:45:20',
      user: 'manager@global.com',
      action: 'Updated payroll run',
      resource: 'Payroll: March 2024',
      company: 'Global Solutions',
      status: 'Success',
      details: 'Payroll run marked as completed',
    },
    {
      id: 3,
      timestamp: '2024-04-10 12:15:50',
      user: 'admin@innovation.com',
      action: 'Modified access control',
      resource: 'Role: Manager',
      company: 'Innovation Labs',
      status: 'Success',
      details: 'Added "View Reports" permission',
    },
    {
      id: 4,
      timestamp: '2024-04-10 11:20:30',
      user: 'super_admin@rapid.one',
      action: 'Deactivated company',
      resource: 'Company: Old Corp',
      company: 'System-wide',
      status: 'Warning',
      details: 'Company deactivated due to license expiry',
    },
    {
      id: 5,
      timestamp: '2024-04-10 10:05:45',
      user: 'admin@digital.com',
      action: 'Generated invoice',
      resource: 'Invoice: INV-2024-005',
      company: 'Digital Services',
      status: 'Success',
      details: 'Payroll invoice generated for March 2024',
    },
    {
      id: 6,
      timestamp: '2024-04-09 16:30:12',
      user: 'manager@creative.com',
      action: 'Exported data',
      resource: 'Export: Employee List',
      company: 'Creative Agency',
      status: 'Success',
      details: 'Exported 50 employee records to CSV',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-700'
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700'
      case 'Error':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-2">System-wide activity logs and compliance tracking</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by user, action, or company..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">245</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">238</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Timestamp</th>
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                  <th className="text-left py-3 px-4 font-semibold">Resource</th>
                  <th className="text-left py-3 px-4 font-semibold">Company</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{log.timestamp}</td>
                    <td className="py-3 px-4 text-sm">{log.user}</td>
                    <td className="py-3 px-4">{log.action}</td>
                    <td className="py-3 px-4 text-muted-foreground">{log.resource}</td>
                    <td className="py-3 px-4 text-sm">{log.company}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            <CardDescription>Audit compliance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-sm font-medium">Data Retention Policy</span>
              <span className="text-sm text-green-600">✓ Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-sm font-medium">Access Control Logs</span>
              <span className="text-sm text-green-600">✓ Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-sm font-medium">Audit Trail Coverage</span>
              <span className="text-sm text-green-600">✓ 100%</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-sm font-medium">Last Audit Review</span>
              <span className="text-sm text-muted-foreground">2024-04-10</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Monitoring</CardTitle>
            <CardDescription>Real-time security alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded bg-green-50">
              <p className="text-sm font-medium text-green-900">✓ No critical alerts</p>
              <p className="text-xs text-green-700 mt-1">All systems operating normally</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm font-medium">Failed Login Attempts (24h)</p>
              <p className="text-lg font-bold">3</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm font-medium">Unusual Activities Detected</p>
              <p className="text-lg font-bold">0</p>
            </div>
            <Button variant="outline" className="w-full">View Security Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
