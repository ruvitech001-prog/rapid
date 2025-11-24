'use client'

import { useState } from 'react'
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  Briefcase,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  pendingLeaves: number
  pendingExpenses: number
  monthlyPayroll: number
  contractorsActive: number
}

interface RecentActivity {
  id: string
  type: 'leave' | 'expense' | 'employee'
  description: string
  timestamp: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function EmployerDashboard() {
  const [stats] = useState<DashboardStats>({
    totalEmployees: 45,
    activeEmployees: 42,
    pendingLeaves: 8,
    pendingExpenses: 12,
    monthlyPayroll: 2450000,
    contractorsActive: 7,
  })

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'leave',
      description: 'John Doe requested 3 days leave',
      timestamp: '2 hours ago',
      status: 'pending',
    },
    {
      id: '2',
      type: 'expense',
      description: 'Sarah Smith submitted expense claim for ₹15,000',
      timestamp: '4 hours ago',
      status: 'pending',
    },
    {
      id: '3',
      type: 'employee',
      description: 'New employee Mike Johnson onboarded',
      timestamp: '1 day ago',
      status: 'approved',
    },
    {
      id: '4',
      type: 'leave',
      description: 'Alice Brown leave request approved',
      timestamp: '1 day ago',
      status: 'approved',
    },
  ])

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
  }: {
    title: string
    value: string | number
    subtitle: string
    icon: React.ReactNode
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          </div>
          <div className="ml-4 p-3 rounded-lg bg-primary/10 text-primary">
            {Icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const statusColors = {
    pending: { badge: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
    approved: { badge: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
    rejected: { badge: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle={`${stats.activeEmployees} active`}
          icon={<Users className="h-8 w-8" />}
        />
        <StatCard
          title="Pending Leave Requests"
          value={stats.pendingLeaves}
          subtitle="Requires attention"
          icon={<Calendar className="h-8 w-8" />}
        />
        <StatCard
          title="Pending Expenses"
          value={stats.pendingExpenses}
          subtitle="Awaiting approval"
          icon={<FileText className="h-8 w-8" />}
        />
        <StatCard
          title="Monthly Payroll"
          value={`₹${stats.monthlyPayroll.toLocaleString('en-IN')}`}
          subtitle="Current month"
          icon={<DollarSign className="h-8 w-8" />}
        />
        <StatCard
          title="Active Contractors"
          value={stats.contractorsActive}
          subtitle="Currently engaged"
          icon={<Briefcase className="h-8 w-8" />}
        />
        <StatCard
          title="Revenue Growth"
          value="+12.5%"
          subtitle="Compared to last month"
          icon={<TrendingUp className="h-8 w-8" />}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link href="/employer/payroll/run">Run Payroll</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/employer/employees/new">Add Employee</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/employer/reports">View Reports</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                      statusColors[activity.status].dot
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[activity.status].badge}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
