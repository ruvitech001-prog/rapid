'use client'

import Link from 'next/link'
import {
  Clock,
  FileText,
  User,
  DollarSign,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function ContractorDashboard() {
  const stats = [
    { name: 'Hours This Week', value: '40', subtitle: 'Logged', icon: Clock },
    { name: 'Pending Approval', value: '8', subtitle: 'Hours', icon: AlertCircle },
    { name: 'Total Invoiced', value: '₹2.4L', subtitle: 'This Month', icon: DollarSign },
    { name: 'Pending Payment', value: '₹80K', subtitle: '2 Invoices', icon: FileText },
  ]

  const recentTimesheets = [
    { week: 'Jan 22-28, 2024', hours: 40, status: 'Approved', amount: '₹20,000' },
    { week: 'Jan 15-21, 2024', hours: 38, status: 'Approved', amount: '₹19,000' },
    { week: 'Jan 8-14, 2024', hours: 35, status: 'Pending', amount: '₹17,500' },
  ]

  const recentInvoices = [
    { id: 'INV-2024-003', date: 'Jan 28, 2024', amount: '₹40,000', status: 'Paid' },
    { id: 'INV-2024-002', date: 'Jan 14, 2024', amount: '₹40,000', status: 'Pending' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="border border-border rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, Mike!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your timesheets and invoices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Timesheets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Timesheets</CardTitle>
            <Link href="/contractor/timesheets/submit">
              <Button variant="ghost" size="sm" className="text-primary">
                Submit New <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTimesheets.map((timesheet) => (
                <div key={timesheet.week} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{timesheet.week}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timesheet.hours} hours • {timesheet.amount}
                    </p>
                  </div>
                  <Badge
                    variant={timesheet.status === 'Approved' ? 'default' : 'secondary'}
                  >
                    {timesheet.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Link href="/contractor/timesheets/submit" className="text-xs text-primary hover:underline mt-4 block">
              View All Timesheets
            </Link>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Link href="/contractor/invoices">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{invoice.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">{invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{invoice.amount}</p>
                    <Badge
                      variant={invoice.status === 'Paid' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href="/contractor/timesheets/submit">
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-4 gap-2"
              >
                <Clock className="h-5 w-5" />
                <span className="text-xs font-medium">Submit Timesheet</span>
              </Button>
            </Link>

            <Link href="/contractor/invoices">
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-4 gap-2"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs font-medium">View Invoices</span>
              </Button>
            </Link>

            <Link href="/contractor/profile">
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-4 gap-2"
              >
                <User className="h-5 w-5" />
                <span className="text-xs font-medium">Update Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
