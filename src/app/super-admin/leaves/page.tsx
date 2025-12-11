'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Loader2, FileText } from 'lucide-react'
import { useSuperAdminLeaves, useSuperAdminLeaveStats } from '@/lib/hooks'

export default function LeavesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: leaves, isLoading: leavesLoading } = useSuperAdminLeaves({
    search: searchTerm,
    status: statusFilter,
  })
  const { data: stats, isLoading: statsLoading } = useSuperAdminLeaveStats()

  const isLoading = leavesLoading || statsLoading

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaves Management</h1>
        <p className="text-muted-foreground mt-2">Track and manage employee leaves across all companies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.total || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats?.approved || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats?.rejected || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Leaves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee or company..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Leaves Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
          <CardDescription>All leave requests across the system</CardDescription>
        </CardHeader>
        <CardContent>
          {!leaves || leaves.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-foreground">No leave requests found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Leave requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Employee</th>
                    <th className="text-left py-3 px-4 font-semibold">Company</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Start Date</th>
                    <th className="text-left py-3 px-4 font-semibold">End Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Days</th>
                    <th className="text-left py-3 px-4 font-semibold">Reason</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{leave.employee}</td>
                      <td className="py-3 px-4">{leave.company}</td>
                      <td className="py-3 px-4 text-sm">{leave.type}</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {new Date(leave.startDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {new Date(leave.endDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-medium">{leave.days}</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm max-w-[200px] truncate">
                        {leave.reason || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                          {leave.status}
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

      {/* Results Count */}
      {leaves && leaves.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {leaves.length} leave request{leaves.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
