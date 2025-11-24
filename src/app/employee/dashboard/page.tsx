'use client'

import Link from 'next/link'
import {
  Calendar,
  Clock,
  CreditCard,
  User,
  AlertCircle,
  DollarSign,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function EmployeeDashboard() {
  // Mock data
  const leaveBalance = [
    { type: 'Earned Leave', balance: 12, total: 18 },
    { type: 'Casual Leave', balance: 5, total: 12 },
    { type: 'Sick Leave', balance: 7, total: 12 },
  ]

  const upcomingLeaves = [
    { dates: 'Feb 15-16, 2024', type: 'Casual Leave', status: 'Approved', days: 2 },
  ]

  const recentPayslips = [
    { month: 'January 2024', netPay: '₹44,400', status: 'Paid', date: '1st Feb' },
    { month: 'December 2023', netPay: '₹44,400', status: 'Paid', date: '1st Jan' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="border border-border rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, John!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's your overview for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attendance This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-semibold">22/24</p>
                <p className="text-xs text-primary mt-1">91.6%</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-semibold">2</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Last Payslip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-semibold">₹44.4K</p>
                <p className="text-xs text-muted-foreground mt-1">January 2024</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Leave Balance</CardTitle>
          </div>
          <Link href="/employee/leave/apply">
            <Button variant="ghost" size="sm" className="text-primary">
              Apply Leave <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaveBalance.map((leave) => (
              <div key={leave.type} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">{leave.type}</p>
                  <span className="text-xs text-muted-foreground">
                    {leave.balance}/{leave.total}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(leave.balance / leave.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm font-semibold">{leave.balance} days left</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Leaves */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingLeaves.length > 0 ? (
              <div className="space-y-4">
                {upcomingLeaves.map((leave, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{leave.dates}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {leave.type} • {leave.days} days
                      </p>
                    </div>
                    <Badge variant="default">{leave.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming leaves</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Payslips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Payslips</CardTitle>
            <Link href="/employee/payslips">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayslips.map((payslip) => (
                <div key={payslip.month} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{payslip.month}</p>
                    <p className="text-xs text-muted-foreground mt-1">Paid on {payslip.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{payslip.netPay}</p>
                    <Link
                      href={`/employee/payslips/${payslip.month.replace(' ', '-').toLowerCase()}`}
                      className="text-xs text-primary hover:underline mt-1 block"
                    >
                      Download
                    </Link>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/employee/attendance/clockin">
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-4 gap-2"
              >
                <Clock className="h-5 w-5" />
                <span className="text-xs font-medium">Clock In</span>
              </Button>
            </Link>

            <Link href="/employee/leave/apply">
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-4 gap-2"
              >
                <Calendar className="h-5 w-5" />
                <span className="text-xs font-medium">Apply Leave</span>
              </Button>
            </Link>

            <Link href="/employee/expenses/submit">
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-4 gap-2"
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs font-medium">Submit Expense</span>
              </Button>
            </Link>

            <Link href="/employee/profile">
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-4 gap-2"
              >
                <User className="h-5 w-5" />
                <span className="text-xs font-medium">My Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
