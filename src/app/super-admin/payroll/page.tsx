'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign, TrendingUp, Clock, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function PayrollPage() {
  const payrollRuns = [
    {
      id: 1,
      month: 'March 2024',
      totalEmployees: 2543,
      totalAmount: '₹45,50,000',
      status: 'Completed',
      processedDate: '2024-03-28',
    },
    {
      id: 2,
      month: 'February 2024',
      totalEmployees: 2480,
      totalAmount: '₹43,20,000',
      status: 'Completed',
      processedDate: '2024-02-28',
    },
    {
      id: 3,
      month: 'January 2024',
      totalEmployees: 2400,
      totalAmount: '₹41,80,000',
      status: 'Completed',
      processedDate: '2024-01-31',
    },
  ]

  const upcomingPayroll = [
    { company: 'TechCorp Inc', employees: 456, estimatedAmount: '₹12,50,000', dueDate: '2024-04-15' },
    { company: 'Global Solutions', employees: 234, estimatedAmount: '₹8,20,000', dueDate: '2024-04-15' },
    { company: 'Innovation Labs', employees: 567, estimatedAmount: '₹15,30,000', dueDate: '2024-04-15' },
    { company: 'Digital Services', employees: 123, estimatedAmount: '₹5,80,000', dueDate: '2024-04-15' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-2">Manage and track payroll across all companies</p>
        </div>
        <Button asChild>
          <Link href="#run-payroll">
            <Plus className="h-4 w-4 mr-2" />
            Run Payroll
          </Link>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Payroll (Current Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹45.5L</p>
            <p className="text-xs text-green-600 mt-1">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Employees on Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2,543</p>
            <p className="text-xs text-muted-foreground mt-1">Across all companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Average Per Employee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹17,880</p>
            <p className="text-xs text-muted-foreground mt-1">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Run History</CardTitle>
              <CardDescription>Recent payroll processing records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div>
                      <h3 className="font-semibold">{run.month}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {run.totalEmployees} employees · Processed on {run.processedDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{run.totalAmount}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">
                        {run.status}
                      </span>
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
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              New Payroll Run
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Salary Structures
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Download Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Payroll Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payroll */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payroll</CardTitle>
          <CardDescription>Scheduled payroll by company for next processing cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Company</th>
                  <th className="text-left py-3 px-4 font-semibold">Employees</th>
                  <th className="text-right py-3 px-4 font-semibold">Estimated Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Due Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingPayroll.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{item.company}</td>
                    <td className="py-3 px-4">{item.employees}</td>
                    <td className="py-3 px-4 text-right font-semibold">{item.estimatedAmount}</td>
                    <td className="py-3 px-4">{item.dueDate}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Run Payroll Now</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
