'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export default function RequestsPage() {
  const requests = [
    {
      id: 1,
      title: 'Leave Approval',
      company: 'TechCorp Inc',
      from: 'John Doe',
      reason: 'Annual leave - 5 days',
      status: 'pending',
      date: '2024-04-10',
    },
    {
      id: 2,
      title: 'Contract Amendment',
      company: 'Global Solutions',
      from: 'Sarah Smith',
      reason: 'Salary revision request',
      status: 'pending',
      date: '2024-04-09',
    },
    {
      id: 3,
      title: 'Access Request',
      company: 'Innovation Labs',
      from: 'Mike Johnson',
      reason: 'Admin access for payroll module',
      status: 'pending',
      date: '2024-04-08',
    },
    {
      id: 4,
      title: 'Equipment Approval',
      company: 'Digital Services',
      from: 'Emma Wilson',
      reason: 'Laptop replacement',
      status: 'approved',
      date: '2024-04-07',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Requests</h1>
          <p className="text-muted-foreground mt-2">Manage approval requests and pending actions</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by title, company, or user..." className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>Complete list of all requests and approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Request Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Company</th>
                  <th className="text-left py-3 px-4 font-semibold">From</th>
                  <th className="text-left py-3 px-4 font-semibold">Reason</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{request.title}</td>
                    <td className="py-3 px-4">{request.company}</td>
                    <td className="py-3 px-4">{request.from}</td>
                    <td className="py-3 px-4 text-muted-foreground">{request.reason}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{request.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {request.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="default">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <span className="text-xs text-green-600">Approved</span>
                      )}
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
