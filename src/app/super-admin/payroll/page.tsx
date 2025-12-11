'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign, TrendingUp, Clock, MoreHorizontal, Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useSuperAdminPayrollRuns,
  useSuperAdminUpcomingPayroll,
  useSuperAdminPayrollStats,
} from '@/lib/hooks'

export default function PayrollPage() {
  const { data: payrollRuns, isLoading: runsLoading } = useSuperAdminPayrollRuns()
  const { data: upcomingPayroll, isLoading: upcomingLoading } = useSuperAdminUpcomingPayroll()
  const { data: stats, isLoading: statsLoading } = useSuperAdminPayrollStats()

  const isLoading = runsLoading || upcomingLoading || statsLoading

  const formatAmount = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString('en-IN')}`
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-2">Manage and track payroll across all companies</p>
        </div>
        <Button onClick={() => toast.info('Payroll run wizard coming soon')}>
          <Plus className="h-4 w-4 mr-2" />
          Run Payroll
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
            <p className="text-2xl font-bold">{formatAmount(stats?.totalPayroll || 0)}</p>
            <p className="text-xs text-green-600 mt-1">+{stats?.growthPercent || 0}% from last month</p>
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
            <p className="text-2xl font-bold">{stats?.employeesOnPayroll?.toLocaleString('en-IN') || 0}</p>
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
            <p className="text-2xl font-bold">{formatAmount(stats?.averagePerEmployee || 0)}</p>
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
              {!payrollRuns || payrollRuns.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No payroll runs found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payrollRuns.map((run) => (
                    <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div>
                        <h3 className="font-semibold">{run.month}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {run.totalEmployees} employees · Processed on {new Date(run.processedDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatAmount(run.totalAmount)}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">
                          {run.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          {!upcomingPayroll || upcomingPayroll.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No upcoming payroll scheduled</p>
            </div>
          ) : (
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
                  {upcomingPayroll.map((item) => (
                    <tr key={item.companyId} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{item.company}</td>
                      <td className="py-3 px-4">{item.employees}</td>
                      <td className="py-3 px-4 text-right font-semibold">{formatAmount(item.estimatedAmount)}</td>
                      <td className="py-3 px-4">{new Date(item.dueDate).toLocaleDateString('en-IN')}</td>
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
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      {upcomingPayroll && upcomingPayroll.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {upcomingPayroll.length} compan{upcomingPayroll.length !== 1 ? 'ies' : 'y'} with upcoming payroll
        </p>
      )}
    </div>
  )
}
