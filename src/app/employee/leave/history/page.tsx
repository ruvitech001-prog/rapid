'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

export default function LeaveHistoryPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const leaveApplications = [
    { id: 1, type: 'Earned Leave', startDate: '2024-02-15', endDate: '2024-02-17', days: 3, reason: 'Family vacation', status: 'approved', appliedOn: '2024-02-01' },
    { id: 2, type: 'Sick Leave', startDate: '2024-01-20', endDate: '2024-01-21', days: 2, reason: 'Fever and cold', status: 'approved', appliedOn: '2024-01-20' },
    { id: 3, type: 'Casual Leave', startDate: '2024-02-28', endDate: '2024-02-28', days: 0.5, reason: 'Personal work', status: 'pending', appliedOn: '2024-02-25' },
    { id: 4, type: 'Earned Leave', startDate: '2024-01-05', endDate: '2024-01-08', days: 4, reason: 'Wedding in family', status: 'approved', appliedOn: '2023-12-20' },
    { id: 5, type: 'Comp Off', startDate: '2024-01-15', endDate: '2024-01-15', days: 1, reason: 'Comp off for weekend work', status: 'rejected', appliedOn: '2024-01-10', rejectionReason: 'Already used comp off' },
  ]

  const filteredApplications = leaveApplications.filter(leave => {
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter
    const matchesType = typeFilter === 'all' || leave.type.toLowerCase().includes(typeFilter.toLowerCase())
    return matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return (
      <Badge variant="outline" className={styles[status as keyof typeof styles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave History</h1>
          <p className="mt-2 text-muted-foreground">
            View all your leave applications
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/employee/leave/apply">
            <Plus className="h-4 w-4" />
            Apply for Leave
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{leaveApplications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              {leaveApplications.filter(l => l.status === 'approved').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-orange-600">
              {leaveApplications.filter(l => l.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-destructive">
              {leaveApplications.filter(l => l.status === 'rejected').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Leave Type</Label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="earned">Earned Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="comp">Comp Off</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Leave Applications ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length > 0 ? (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Days
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Applied On
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredApplications.map((leave) => (
                    <tr key={leave.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {leave.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(leave.startDate).toLocaleDateString('en-IN')} - {new Date(leave.endDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {leave.days} {leave.days === 1 ? 'day' : 'days'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(leave.appliedOn).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="px-6 py-4 text-sm max-w-xs truncate">
                        {leave.reason}
                        {leave.status === 'rejected' && leave.rejectionReason && (
                          <p className="text-xs text-destructive mt-1">
                            Rejection: {leave.rejectionReason}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No leave applications found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
