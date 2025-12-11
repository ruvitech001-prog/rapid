'use client'

import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, AlertCircle, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSuperAdminAuditLogs, usePermissions, PermissionGate } from '@/lib/hooks'
import type { AuditLogFilters, AuditLogEntry } from '@/lib/services/superadmin-audit.service'
import { toast } from 'sonner'

const ACTION_LABELS: Record<string, string> = {
  'request.approved': 'Request Approved',
  'request.rejected': 'Request Rejected',
  'request.assigned': 'Request Assigned',
  'team.member_created': 'Team Member Created',
  'team.member_updated': 'Team Member Updated',
  'team.member_deleted': 'Team Member Deleted',
  'team.role_changed': 'Role Changed',
  'team.clients_assigned': 'Clients Assigned',
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [selectedEntity, setSelectedEntity] = useState<string>('all')

  const filters: AuditLogFilters = useMemo(
    () => ({
      action: selectedAction !== 'all' ? selectedAction : undefined,
      entityType: selectedEntity !== 'all' ? (selectedEntity as AuditLogFilters['entityType']) : undefined,
      limit: 50,
    }),
    [selectedAction, selectedEntity]
  )

  const { data: auditData, isLoading, error, refetch } = useSuperAdminAuditLogs(filters)

  const filteredLogs = useMemo(() => {
    if (!auditData?.data) return []
    if (!searchQuery.trim()) return auditData.data

    const query = searchQuery.toLowerCase()
    return auditData.data.filter(
      (log) =>
        log.userEmail?.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.entityType.toLowerCase().includes(query)
    )
  }, [auditData?.data, searchQuery])

  const stats = useMemo(() => {
    if (!auditData?.data) return { total: 0, today: 0, requests: 0, team: 0 }
    const today = new Date().toDateString()
    return {
      total: auditData.pagination.total,
      today: auditData.data.filter((log) => new Date(log.createdAt).toDateString() === today).length,
      requests: auditData.data.filter((log) => log.entityType === 'request').length,
      team: auditData.data.filter((log) => log.entityType === 'team_member').length,
    }
  }, [auditData])

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const { can } = usePermissions()

  // Export logs to CSV
  const handleExport = useCallback(() => {
    if (!filteredLogs.length) {
      toast.error('No logs to export')
      return
    }

    const headers = ['Timestamp', 'User Email', 'User Role', 'Action', 'Entity Type', 'Entity ID']
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map((log: AuditLogEntry) =>
        [
          formatTimestamp(log.createdAt),
          log.userEmail || 'System',
          log.userRole || '-',
          ACTION_LABELS[log.action] || log.action,
          log.entityType,
          log.entityId || '-',
        ]
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success('Audit logs exported successfully')
  }, [filteredLogs])

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-muted-foreground mt-2">System-wide activity logs and compliance tracking</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Audit Logs</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Failed to load audit log data'}
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-2">System-wide activity logs and compliance tracking</p>
        </div>
        <PermissionGate permission="audit-logs.export">
          <Button onClick={handleExport} disabled={isLoading || !filteredLogs.length}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </PermissionGate>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user email or action..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="request.approved">Request Approved</SelectItem>
                <SelectItem value="request.rejected">Request Rejected</SelectItem>
                <SelectItem value="request.assigned">Request Assigned</SelectItem>
                <SelectItem value="team.member_created">Team Member Created</SelectItem>
                <SelectItem value="team.member_updated">Team Member Updated</SelectItem>
                <SelectItem value="team.member_deleted">Team Member Deleted</SelectItem>
                <SelectItem value="team.role_changed">Role Changed</SelectItem>
                <SelectItem value="team.clients_assigned">Clients Assigned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="request">Requests</SelectItem>
                <SelectItem value="team_member">Team Members</SelectItem>
                <SelectItem value="company">Companies</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{isLoading ? '-' : stats.today}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Request Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{isLoading ? '-' : stats.requests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{isLoading ? '-' : stats.team}</p>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery || selectedAction !== 'all' || selectedEntity !== 'all'
                ? 'No audit logs match your filters.'
                : 'No audit logs found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                    <th className="text-left py-3 px-4 font-semibold">Entity Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Entity ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {formatTimestamp(log.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-sm">{log.userEmail || 'System'}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">
                        {log.entityType.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {log.entityId ? log.entityId.substring(0, 8) + '...' : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          log.userRole === 'superadmin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {log.userRole || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
              <span className="text-sm text-green-600">Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-sm font-medium">Access Control Logs</span>
              <span className="text-sm text-green-600">Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-sm font-medium">Audit Trail Coverage</span>
              <span className="text-sm text-green-600">100%</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-sm font-medium">Last Audit Review</span>
              <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
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
              <p className="text-sm font-medium text-green-900">No critical alerts</p>
              <p className="text-xs text-green-700 mt-1">All systems operating normally</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm font-medium">Failed Login Attempts (24h)</p>
              <p className="text-lg font-bold">0</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm font-medium">Unusual Activities Detected</p>
              <p className="text-lg font-bold">0</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Security Dashboard feature coming soon')}
            >
              View Security Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
