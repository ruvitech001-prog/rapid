'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button as _Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function LeavesPage() {
  const leaves = [
    {
      id: 1,
      employee: 'John Doe',
      company: 'TechCorp Inc',
      type: 'Annual Leave',
      startDate: '2024-04-15',
      endDate: '2024-04-19',
      days: 5,
      status: 'Approved',
      reason: 'Vacation',
    },
    {
      id: 2,
      employee: 'Sarah Smith',
      company: 'Global Solutions',
      type: 'Sick Leave',
      startDate: '2024-04-10',
      endDate: '2024-04-12',
      days: 3,
      status: 'Pending',
      reason: 'Medical appointment',
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      company: 'Innovation Labs',
      type: 'Maternity Leave',
      startDate: '2024-05-01',
      endDate: '2024-07-31',
      days: 92,
      status: 'Approved',
      reason: 'Maternity',
    },
    {
      id: 4,
      employee: 'Emma Wilson',
      company: 'Digital Services',
      type: 'Casual Leave',
      startDate: '2024-04-18',
      endDate: '2024-04-18',
      days: 1,
      status: 'Rejected',
      reason: 'Personal work',
    },
  ]

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
            <p className="text-2xl font-bold">142</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">98</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">32</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Leaves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by employee or company..." className="pl-10" />
            </div>
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
                    <td className="py-3 px-4 text-muted-foreground text-sm">{leave.startDate}</td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">{leave.endDate}</td>
                    <td className="py-3 px-4 font-medium">{leave.days}</td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">{leave.reason}</td>
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
        </CardContent>
      </Card>
    </div>
  )
}
