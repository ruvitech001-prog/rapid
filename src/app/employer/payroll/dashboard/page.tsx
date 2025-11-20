'use client'

import { useState } from 'react'
import { DollarSign, Users, TrendingUp, FileText, Plus, Download, BarChart3, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

interface PayrollSummary {
  id: string
  month: string
  totalEmployees: number
  totalPayroll: number
  status: 'pending' | 'processed' | 'completed'
}

export default function PayrollDashboardPage() {
  const [payrollSummary] = useState<PayrollSummary[]>([
    {
      id: '1',
      month: 'March 2024',
      totalEmployees: 45,
      totalPayroll: 2450000,
      status: 'pending',
    },
    {
      id: '2',
      month: 'February 2024',
      totalEmployees: 44,
      totalPayroll: 2380000,
      status: 'completed',
    },
    {
      id: '3',
      month: 'January 2024',
      totalEmployees: 43,
      totalPayroll: 2320000,
      status: 'completed',
    },
  ])

  const columns: ColumnDef<PayrollSummary>[] = [
    {
      accessorKey: 'month',
      header: 'Month',
      cell: ({ row }) => <span className="font-medium">{row.getValue('month')}</span>,
    },
    {
      accessorKey: 'totalEmployees',
      header: 'Employees',
    },
    {
      accessorKey: 'totalPayroll',
      header: 'Total Payroll',
      cell: ({ row }) => {
        const amount = row.getValue('totalPayroll') as number
        return <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const statusConfig = {
          pending: { label: 'Pending', class: 'bg-orange-100 text-orange-800' },
          processed: { label: 'Processed', class: 'bg-blue-100 text-blue-800' },
          completed: { label: 'Completed', class: 'bg-green-100 text-green-800' },
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Badge variant="outline" className={config.class}>{config.label}</Badge>
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-primary">
            View
          </Button>
          {row.getValue('status') === 'completed' && (
            <Button variant="ghost" size="sm" className="text-primary">
              Download
            </Button>
          )}
        </div>
      ),
    },
  ]

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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            {Icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground mt-2">Manage and process employee payroll</p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Run Payroll
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Current Month Payroll"
          value="₹24.5L"
          subtitle="Pending Processing"
          icon={<DollarSign className="h-8 w-8" />}
        />
        <StatCard
          title="Total Employees"
          value="45"
          subtitle="Active this month"
          icon={<Users className="h-8 w-8" />}
        />
        <StatCard
          title="Average Salary"
          value="₹54,444"
          subtitle="Per employee"
          icon={<TrendingUp className="h-8 w-8" />}
        />
        <StatCard
          title="Total Deductions"
          value="₹4.2L"
          subtitle="Tax + EPF + ESI"
          icon={<FileText className="h-8 w-8" />}
        />
      </div>

      {/* Current Month Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Month Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Alert */}
          <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-orange-900">Payroll Processing Due</p>
              <p className="text-sm text-orange-700">March 2024 payroll is pending processing</p>
            </div>
            <Button variant="default" className="gap-2">
              Process Now
            </Button>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Attendance Verified</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-2xl font-bold text-primary">45/45</p>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Leave Applications</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-2xl font-bold">12</p>
                <Badge variant="secondary">Approved</Badge>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Expense Claims</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-2xl font-bold">8</p>
                <Badge variant="outline">To process</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={payrollSummary} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start gap-3"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-medium">Configure Salary Structure</p>
                <p className="text-xs text-muted-foreground">Set up salary components</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start gap-3"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-medium">View Compliance Reports</p>
                <p className="text-xs text-muted-foreground">EPF, ESI, TDS reports</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start gap-3"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Download className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-medium">Download Payslips</p>
                <p className="text-xs text-muted-foreground">Bulk download options</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
