'use client'

import { useState } from 'react'
import { DollarSign, Users, TrendingUp, FileText, Plus, Download, BarChart3, CheckCircle, ChevronRight, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import {
  useTotalPayrollCost,
  useCompanyPayrollSummary,
  useCompanyAttendanceStats,
  usePendingLeaveCount,
  usePendingExpenseCount,
  useEmployeesForPayroll,
  useProcessPayroll,
} from '@/lib/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PayrollSummaryRow {
  id: string
  month: string
  totalEmployees: number
  totalPayroll: number
  status: 'pending' | 'processed' | 'completed'
}

export default function PayrollDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const companyId = user?.companyId ?? undefined
  const { data: payrollCost, isLoading: costLoading } = useTotalPayrollCost(companyId)
  const { data: payrollSummary, isLoading: summaryLoading } = useCompanyPayrollSummary(companyId, 6)
  const { data: attendanceStats, isLoading: attendanceLoading } = useCompanyAttendanceStats(companyId)
  const { data: pendingLeaves, isLoading: leavesLoading } = usePendingLeaveCount(companyId)
  const { data: pendingExpenses, isLoading: expensesLoading } = usePendingExpenseCount(companyId)

  // Current month/year for payroll
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const { data: employeesForPayroll } = useEmployeesForPayroll(companyId, currentMonth, currentYear)
  const processPayroll = useProcessPayroll()

  const [isRunPayrollModalOpen, setIsRunPayrollModalOpen] = useState(false)

  const isLoading = costLoading || summaryLoading || attendanceLoading || leavesLoading || expensesLoading
  const isProcessing = processPayroll.isPending

  // Handler: Run Payroll
  const handleRunPayroll = () => {
    setIsRunPayrollModalOpen(true)
  }

  // Handler: Process Payroll (confirmation)
  const handleProcessPayroll = async () => {
    if (!companyId || !employeesForPayroll || employeesForPayroll.length === 0) {
      toast.error('No employees to process payroll for')
      return
    }

    try {
      await processPayroll.mutateAsync({
        companyId,
        month: currentMonth,
        year: currentYear,
        employeeData: employeesForPayroll,
      })
      toast.success('Payroll processed successfully!')
      setIsRunPayrollModalOpen(false)
      router.push('/employer/payroll/run')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process payroll')
      console.error('Payroll processing error:', error)
    }
  }

  // Handler: View Payroll Details
  const handleViewPayroll = (month: string) => {
    toast.info(`Viewing payroll details for ${month}`)
    // In production: router.push(`/employer/payroll/details/${month}`)
  }

  // Handler: Download Payroll Report
  const handleDownloadPayroll = (month: string) => {
    toast.info(`Downloading payroll report for ${month}...`)
    // In production: trigger PDF download
    setTimeout(() => {
      toast.success(`Payroll report for ${month} downloaded`)
    }, 1000)
  }

  // Transform payroll summary to table format
  const payrollData: PayrollSummaryRow[] = (payrollSummary || []).map((item, idx) => ({
    id: String(idx + 1),
    month: `${item.month} ${new Date().getFullYear()}`,
    totalEmployees: item.employeeCount,
    totalPayroll: item.amount,
    status: (idx === 0 ? 'pending' : 'completed') as 'pending' | 'completed' | 'processed',
  })).slice(0, 3)

  const columns: ColumnDef<PayrollSummaryRow>[] = [
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
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => handleViewPayroll(row.getValue('month') as string)}
          >
            View
          </Button>
          {row.getValue('status') === 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => handleDownloadPayroll(row.getValue('month') as string)}
            >
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
    featured = false,
    color = '#586AF5',
  }: {
    title: string
    value: string | number
    subtitle: string
    icon: React.ReactNode
    featured?: boolean
    color?: string
  }) => (
    <Card className={`rounded-2xl border border-[#DEE4EB] shadow-none ${featured ? 'bg-[#EBF5FF]' : 'bg-white'}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider uppercase">{title}</p>
            <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
            <p className="text-sm text-[#8593A3] mt-1">{subtitle}</p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: featured ? 'rgba(255,255,255,0.6)' : `${color}10` }}
          >
            <div style={{ color }}>{Icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const monthlyPayroll = payrollCost?.monthly || 0
  const employeeCount = payrollCost?.employeeCount || 0
  const averageSalary = employeeCount > 0 ? Math.round(monthlyPayroll / employeeCount) : 0
  const totalDeductions = Math.round(monthlyPayroll * 0.17) // ~17% typical deductions

  const formatAmount = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const currentMonthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-[#8593A3] mt-1">Manage and process employee payroll</p>
        </div>
        <Button size="lg" className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]" onClick={handleRunPayroll}>
          <Plus className="h-4 w-4" />
          Run Payroll
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Current Month Payroll"
          value={formatAmount(monthlyPayroll)}
          subtitle="Pending Processing"
          icon={<DollarSign className="h-6 w-6" />}
          featured={true}
          color="#586AF5"
        />
        <StatCard
          title="Total Employees"
          value={employeeCount}
          subtitle="Active this month"
          icon={<Users className="h-6 w-6" />}
          color="#2DD4BF"
        />
        <StatCard
          title="Average Salary"
          value={formatAmount(averageSalary)}
          subtitle="Per employee"
          icon={<TrendingUp className="h-6 w-6" />}
          color="#CC7A00"
        />
        <StatCard
          title="Total Deductions"
          value={formatAmount(totalDeductions)}
          subtitle="Tax + EPF + ESI"
          icon={<FileText className="h-6 w-6" />}
          color="#FF7373"
        />
      </div>

      {/* Current Month Status */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900">Current Month Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Alert */}
          <div className="flex items-start gap-4 p-4 bg-[#CC7A00]/5 border border-[#CC7A00]/20 rounded-xl">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-[#CC7A00]/10 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#CC7A00]" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Payroll Processing Due</p>
              <p className="text-sm text-[#8593A3]">{currentMonthLabel} payroll is pending processing</p>
            </div>
            <Button className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]" onClick={handleRunPayroll}>
              Process Now
            </Button>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#DEE4EB] rounded-xl bg-white">
              <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ATTENDANCE VERIFIED</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-2xl font-bold text-[#2DD4BF]">
                  {attendanceStats?.presentToday || 0}/{attendanceStats?.totalEmployees || employeeCount}
                </p>
                <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-[#2DD4BF]" />
                </div>
              </div>
            </div>

            <div className="p-4 border border-[#DEE4EB] rounded-xl bg-white">
              <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">LEAVE APPLICATIONS</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-2xl font-bold text-gray-900">{pendingLeaves || 0}</p>
                <Badge className="bg-[#CC7A00]/10 text-[#CC7A00] border-0 hover:bg-[#CC7A00]/20">Pending</Badge>
              </div>
            </div>

            <div className="p-4 border border-[#DEE4EB] rounded-xl bg-white">
              <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EXPENSE CLAIMS</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-2xl font-bold text-gray-900">{pendingExpenses || 0}</p>
                <Badge className="bg-[#CC7A00]/10 text-[#CC7A00] border-0 hover:bg-[#CC7A00]/20">To process</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll History Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Payroll History</CardTitle>
            <Link href="/employer/payroll" className="text-sm font-medium text-[#586AF5] hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {payrollData.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-[#8593A3] mx-auto mb-3" />
              <p className="text-[#8593A3]">No payroll history found</p>
            </div>
          ) : (
            <DataTable columns={columns} data={payrollData} />
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/employer/payroll/salary-structure" className="block">
              <div className="h-full p-5 rounded-xl border border-[#DEE4EB] hover:border-[#586AF5] hover:bg-[#586AF5]/5 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-[#586AF5]" />
                </div>
                <p className="font-semibold text-gray-900">Configure Salary Structure</p>
                <p className="text-sm text-[#8593A3] mt-1">Set up salary components</p>
              </div>
            </Link>

            <Link href="/employer/compliance/epf" className="block">
              <div className="h-full p-5 rounded-xl border border-[#DEE4EB] hover:border-[#2DD4BF] hover:bg-[#2DD4BF]/5 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-[#2DD4BF]" />
                </div>
                <p className="font-semibold text-gray-900">View Compliance Reports</p>
                <p className="text-sm text-[#8593A3] mt-1">EPF, ESI, TDS reports</p>
              </div>
            </Link>

            <Link href="/employer/reports" className="block">
              <div className="h-full p-5 rounded-xl border border-[#DEE4EB] hover:border-[#CC7A00] hover:bg-[#CC7A00]/5 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-[#CC7A00]" />
                </div>
                <p className="font-semibold text-gray-900">Download Payslips</p>
                <p className="text-sm text-[#8593A3] mt-1">Bulk download options</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Run Payroll Modal */}
      <Dialog open={isRunPayrollModalOpen} onOpenChange={setIsRunPayrollModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Run Payroll</DialogTitle>
            <DialogDescription>
              Process payroll for {currentMonthLabel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#F4F7FA] rounded-lg">
                <p className="text-sm text-[#8593A3]">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employeeCount}</p>
              </div>
              <div className="p-4 bg-[#F4F7FA] rounded-lg">
                <p className="text-sm text-[#8593A3]">Total Amount</p>
                <p className="text-2xl font-bold text-[#586AF5]">{formatAmount(monthlyPayroll)}</p>
              </div>
            </div>
            <div className="p-4 bg-[#CC7A00]/5 border border-[#CC7A00]/20 rounded-lg">
              <p className="text-sm text-[#CC7A00]">
                <strong>Note:</strong> Please ensure all leave applications and expense claims are processed before running payroll.
              </p>
            </div>
            {(pendingLeaves || 0) > 0 && (
              <div className="p-4 bg-[#FF7373]/5 border border-[#FF7373]/20 rounded-lg">
                <p className="text-sm text-[#FF7373]">
                  There are <strong>{pendingLeaves}</strong> pending leave applications that need to be processed.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsRunPayrollModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProcessPayroll}
              disabled={isProcessing}
              className="bg-[#642DFC] hover:bg-[#5020d9]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Payroll'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
