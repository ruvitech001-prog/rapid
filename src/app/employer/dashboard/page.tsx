'use client'

import { useState, useMemo } from 'react'
import {
  Bell,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  FileText,
  Loader2,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  useEmployees,
  useContractors,
  useLeaveRequests,
  useExpenseRequests,
  usePendingInvoices,
  useRecentlyPaidInvoices,
  useCostOverview,
  useEmployerNotifications,
  useContractStats,
  useEmployeeContracts,
  usePayInvoice,
  useApproveLeave,
  useApproveExpense,
  useCompanySetupStatus,
  useJoiningThisMonth,
  useCostOverviewPeriod,
} from '@/lib/hooks'
import { useAuth } from '@/lib/auth'
import { dashboardService } from '@/lib/services'
import { useQuery } from '@tanstack/react-query'
import {
  TeamHeadcountChart,
  ProbationWidget,
  CelebrationsWidget,
  FirstTimeSetup,
} from '@/components/employer/dashboard'
import { colors, chartColors } from '@/lib/design-tokens'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const companyId = user?.companyId || undefined

  const [activeRequestsTab, setActiveRequestsTab] = useState<'yours' | 'approval'>('approval')
  const [processingInvoiceId, setProcessingInvoiceId] = useState<string | null>(null)
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null)
  const [costPeriod, setCostPeriod] = useState<3 | 6 | 12>(6)

  // Mutation hooks
  const payInvoiceMutation = usePayInvoice()
  const approveLeavesMutation = useApproveLeave()
  const approveExpenseMutation = useApproveExpense()

  // Fetch real data
  const { data: employees = [], isLoading: loadingEmployees } = useEmployees(companyId)
  const { data: contractors = [], isLoading: loadingContractors } = useContractors(companyId)
  const { data: leaveRequests = [], isLoading: loadingLeaves } = useLeaveRequests(companyId, { status: 'pending' })
  const { data: expenseRequests = [], isLoading: loadingExpenses } = useExpenseRequests(companyId, { status: 'pending' })
  const { data: pendingInvoices = [] } = usePendingInvoices(companyId, 4)
  const { data: recentlyPaidInvoices = [] } = useRecentlyPaidInvoices(companyId, 5)
  const { data: costOverviewData = [] } = useCostOverview(companyId, 6)
  const { data: notifications = [] } = useEmployerNotifications(companyId, 5)
  const { data: contractStats } = useContractStats(companyId)
  const { data: recentContracts = [] } = useEmployeeContracts(companyId)
  const { data: setupStatus } = useCompanySetupStatus(companyId)
  const { data: joiningEmployees = [] } = useJoiningThisMonth(companyId)
  const { data: costByPeriod = [] } = useCostOverviewPeriod(companyId, costPeriod)

  // Fetch upcoming holidays for the company
  const { data: upcomingHolidays = [] } = useQuery({
    queryKey: ['holidays', 'upcoming', companyId],
    queryFn: () => dashboardService.getCompanyHolidays(companyId!),
    enabled: !!companyId,
  })

  const isLoading = loadingEmployees || loadingContractors || loadingLeaves || loadingExpenses

  // Calculate real stats
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const activeContractors = contractors.filter(c => c.status === 'active').length
  const totalTeam = activeEmployees + activeContractors

  // Dynamic team data for chart
  const dynamicTeamData = [
    { name: 'Employees', value: activeEmployees || 1, fill: colors.aqua400 },
    { name: 'Contractors', value: activeContractors || 1, fill: colors.rose200 },
  ]

  // Transform cost overview for chart - use period-based data
  const costData = useMemo(() => {
    const data = costByPeriod.length > 0 ? costByPeriod : costOverviewData
    if (data.length === 0) {
      return [{ month: 'No data', cost: 0, fill: colors.neutral400 }]
    }
    return data.map((c, i) => ({
      month: c.month,
      cost: c.cost / 100000, // Convert to Lakhs
      fill: chartColors[i % chartColors.length],
    }))
  }, [costByPeriod, costOverviewData])

  // Period options for cost overview
  const periodOptions = [
    { label: '3 months', value: 3 as const },
    { label: '6 months', value: 6 as const },
    { label: '1 year', value: 12 as const },
  ]

  // Transform notifications for updates section
  const updatesData = useMemo(() => {
    if (notifications.length === 0) {
      return [{ id: '1', message: 'No recent updates' }]
    }
    return notifications.map(n => ({
      id: n.id,
      message: n.message,
    }))
  }, [notifications])

  // Transform pending invoices
  const pendingInvoicesData = useMemo(() => {
    return pendingInvoices.map(inv => ({
      id: inv.id,
      amount: inv.total_amount || 0,
      name: inv.contractorName,
      type: `Contractor${inv.businessName ? `, ${inv.businessName}` : ''}`,
    }))
  }, [pendingInvoices])

  // Transform recently paid invoices
  const recentlyPaidData = useMemo(() => {
    return recentlyPaidInvoices.map(inv => ({
      id: inv.id,
      amount: inv.total_amount || 0,
      name: inv.contractorName,
      type: `Contractor${inv.businessName ? `, ${inv.businessName}` : ''}`,
    }))
  }, [recentlyPaidInvoices])

  // Contract summary data
  const contractSummaryData = useMemo(() => {
    const total = (contractStats?.activeEmployeeContracts || 0) + (contractStats?.activeContractorContracts || 0)
    return {
      data: [
        { name: 'Employees', value: contractStats?.activeEmployeeContracts || 0, fill: colors.aqua300 },
        { name: 'Contractors', value: contractStats?.activeContractorContracts || 0, fill: colors.rose200 },
        { name: 'Expiring', value: contractStats?.expiringThisMonth || 0, fill: colors.warning200 },
      ],
      total,
    }
  }, [contractStats])

  // Recent contracts
  const recentContractsData = useMemo(() => {
    return recentContracts.slice(0, 3).map(c => ({
      id: c.id,
      name: c.employeeName,
      role: `${c.designation} • ${c.department || 'General'}`,
    }))
  }, [recentContracts])

  // Holidays data
  const holidaysData = useMemo(() => {
    if (upcomingHolidays.length === 0) {
      return [{ id: '1', date: 'No upcoming holidays', name: '' }]
    }
    return upcomingHolidays.slice(0, 4).map((h, i) => ({
      id: String(i + 1),
      date: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
      name: h.name,
    }))
  }, [upcomingHolidays])

  // Calculate new hires this month
  const newHiresThisMonth = useMemo(() => {
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const employeeHires = employees.filter(e => {
      if (!e.startDate) return false
      return new Date(e.startDate) >= thisMonth
    }).length
    const contractorHires = contractors.filter(c => {
      if (!c.startDate) return false
      return new Date(c.startDate) >= thisMonth
    }).length
    return { employees: employeeHires, contractors: contractorHires }
  }, [employees, contractors])

  // Combine pending requests for approval
  const pendingRequests = [
    ...leaveRequests.slice(0, 3).map(req => ({
      id: req.id,
      type: 'Leave' as const,
      bgColor: colors.warning600,
      label: `${new Date(req.start_date).toLocaleDateString()} - ${new Date(req.end_date).toLocaleDateString()}`,
      user: req.employeeName,
      role: 'Employee',
      days: req.total_days,
    })),
    ...expenseRequests.slice(0, 3).map(req => ({
      id: req.id,
      type: 'Expense' as const,
      bgColor: colors.secondaryBlue600,
      label: `INR ${Number(req.amount).toLocaleString()}`,
      user: req.employeeName,
      role: 'Employee',
      category: req.expense_category,
    })),
  ].slice(0, 4)

  const totalPendingRequests = leaveRequests.length + expenseRequests.length

  // Handler: Pay Invoice
  const handlePayInvoice = async (invoiceId: string) => {
    if (!user?.id || !companyId) {
      toast.error('Please log in to continue')
      return
    }

    setProcessingInvoiceId(invoiceId)
    try {
      await payInvoiceMutation.mutateAsync({
        invoiceId,
        companyId,
        paymentReference: `PAY-${Date.now()}`
      })
      toast.success('Invoice marked as paid successfully')
    } catch (error) {
      toast.error('Failed to process payment')
      console.error('Payment error:', error)
    } finally {
      setProcessingInvoiceId(null)
    }
  }

  // Handler: Approve Request (Leave or Expense)
  const handleApproveRequest = async (request: typeof pendingRequests[0]) => {
    if (!user?.id) {
      toast.error('Please log in to continue')
      return
    }

    setProcessingRequestId(request.id)
    try {
      if (request.type === 'Leave') {
        await approveLeavesMutation.mutateAsync({
          requestId: request.id,
          approverId: user.id
        })
        toast.success('Leave request approved')
      } else if (request.type === 'Expense') {
        await approveExpenseMutation.mutateAsync({
          requestId: request.id,
          approverId: user.id
        })
        toast.success('Expense request approved')
      }
    } catch (error) {
      toast.error(`Failed to approve ${request.type.toLowerCase()} request`)
      console.error('Approval error:', error)
    } finally {
      setProcessingRequestId(null)
    }
  }

  // Handler: View All Requests
  const handleViewAllRequests = () => {
    router.push('/employer/leave/requests')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary500 }} />
      </div>
    )
  }

  // Show first-time experience when no employees
  const showFirstTimeSetup = setupStatus && !setupStatus.hasEmployees

  if (showFirstTimeSetup) {
    return (
      <div className="pb-32">
        <FirstTimeSetup companyId={companyId} companyName={user?.companyName || undefined} />
      </div>
    )
  }

  // Helper function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: colors.neutral800 }}>
          {getGreeting()} {user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="h-10 px-4 text-xs font-semibold tracking-wide border rounded-lg"
            style={{ color: colors.iconBlue, borderColor: colors.iconBlue }}
          >
            <Link href="/employer/requests/new">
              + Create request
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            className="h-10 px-4 text-xs font-semibold tracking-wide rounded-lg text-white"
            style={{ backgroundColor: colors.primary500, color: 'white' }}
          >
            <Link href="/employer/employees/new">Hire another</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg"
            style={{ borderColor: colors.border }}
          >
            <Bell className="h-5 w-5" style={{ color: colors.neutral500 }} />
          </Button>
        </div>
      </div>

      {/* ROW 1: Team Overview & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Team Overview */}
        <div className="lg:col-span-7">
          <Card
            className="rounded-2xl h-full overflow-hidden"
            style={{ backgroundColor: colors.secondaryBlue50, borderColor: colors.secondaryBlue200 }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                  Team
                </CardTitle>
                <Link
                  href="/employer/employees"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  View <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <div className="flex">
                {/* Left: Semi-circle Gauge */}
                <div className="flex-1 pr-4 border-r" style={{ borderColor: colors.border }}>
                  <div className="relative h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dynamicTeamData}
                          cx="50%"
                          cy="95%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          cornerRadius={8}
                          dataKey="value"
                        >
                          {dynamicTeamData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered text inside gauge */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                      <p className="text-[34px] font-bold" style={{ color: colors.neutral900 }}>{totalTeam}</p>
                      <p
                        className="text-xs font-medium tracking-widest uppercase"
                        style={{ color: colors.neutral600 }}
                      >
                        Total team
                      </p>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex justify-center gap-8 mt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.aqua400 }} />
                      <span style={{ color: colors.neutral500 }}>Employees: {activeEmployees}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.rose200 }} />
                      <span style={{ color: colors.neutral500 }}>Contractors: {activeContractors}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Joining This Month */}
                <div className="flex-1 pl-6">
                  <div className="flex items-center justify-between mb-4">
                    <p
                      className="text-xs font-medium tracking-widest uppercase"
                      style={{ color: colors.neutral600 }}
                    >
                      Joining this month ({joiningEmployees.length})
                    </p>
                    {joiningEmployees.length > 3 && (
                      <Link
                        href="/employer/employees"
                        className="text-xs font-semibold"
                        style={{ color: colors.iconBlue }}
                      >
                        View all
                      </Link>
                    )}
                  </div>
                  <div className="space-y-0">
                    {joiningEmployees.length === 0 ? (
                      <p className="text-sm py-4" style={{ color: colors.neutral500 }}>
                        No new joiners this month
                      </p>
                    ) : (
                      joiningEmployees.slice(0, 3).map((emp, index) => (
                        <div
                          key={emp.id}
                          className={`flex items-center justify-between py-3 ${
                            index !== Math.min(joiningEmployees.length, 3) - 1 ? 'border-b' : ''
                          }`}
                          style={{ borderColor: colors.border }}
                        >
                          <div>
                            <p className="text-sm font-medium" style={{ color: colors.neutral700 }}>
                              {emp.name}
                            </p>
                            <p className="text-xs" style={{ color: colors.neutral500 }}>
                              {emp.designation}
                            </p>
                          </div>
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: emp.type === 'employee' ? colors.aqua400 : colors.rose200,
                              color: 'white',
                            }}
                          >
                            {emp.type === 'employee' ? 'EMP' : 'CON'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Updates */}
        <div className="lg:col-span-5">
          <Card className="rounded-2xl h-full" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold" style={{ color: colors.neutral700 }}>
                  Updates
                </CardTitle>
                <Link
                  href="/employer/updates"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <div className="space-y-0">
                {updatesData.map((update, index) => (
                  <div
                    key={update.id}
                    className={`flex gap-3 py-4 ${index !== updatesData.length - 1 ? 'border-b' : ''}`}
                    style={{ borderColor: colors.border }}
                  >
                    <div className="flex-shrink-0">
                      <Bell className="h-5 w-5" style={{ color: colors.success600 }} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: colors.neutral500 }}>
                      {update.message}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROW 2: Invoices & Cost Overview | Requests & Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Invoices & Cost Overview */}
        <div className="space-y-6">
          {/* Invoices */}
          <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                Invoices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {/* Pending Invoices Header */}
              <div className="flex items-center justify-between">
                <p
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: colors.neutral500 }}
                >
                  Pending invoices ({pendingInvoicesData.length})
                </p>
                <Link
                  href="/employer/invoices"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Pending Invoices Cards */}
              {pendingInvoicesData.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 rounded-xl flex items-center justify-between"
                  style={{ backgroundColor: colors.neutral50 }}
                >
                  <div>
                    <p className="text-base font-semibold" style={{ color: colors.neutral800 }}>
                      USD {invoice.amount.toLocaleString()}
                    </p>
                    <p className="text-xs" style={{ color: colors.neutral600 }}>
                      {invoice.name} • {invoice.type}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold px-3 py-2 h-8 rounded-lg"
                    style={{ color: colors.iconBlue, borderColor: colors.iconBlue }}
                    onClick={() => handlePayInvoice(invoice.id)}
                    disabled={processingInvoiceId === invoice.id}
                  >
                    {processingInvoiceId === invoice.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Pay now'
                    )}
                  </Button>
                </div>
              ))}

              {/* Recently Paid Section */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-xs font-medium tracking-widest uppercase"
                    style={{ color: colors.neutral500 }}
                  >
                    Recently paid invoices ({recentlyPaidData.length})
                  </p>
                  <Link
                    href="/employer/invoices/paid"
                    className="text-xs font-semibold flex items-center gap-0.5"
                    style={{ color: colors.iconBlue }}
                  >
                    View all <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-0">
                  {recentlyPaidData.map((paid, index) => (
                    <div
                      key={paid.id}
                      className={`flex items-center justify-between py-3 ${index !== recentlyPaidData.length - 1 ? 'border-b' : ''}`}
                      style={{ borderColor: colors.border }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
                          USD {paid.amount.toLocaleString()}
                        </p>
                        <p className="text-xs" style={{ color: colors.neutral500 }}>
                          {paid.name} • {paid.type}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5" style={{ color: colors.neutral500 }} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Overview */}
          <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                  Cost overview
                </CardTitle>
                <div className="flex items-center gap-1">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCostPeriod(option.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                        costPeriod === option.value
                          ? 'bg-opacity-100'
                          : 'bg-opacity-0 hover:bg-opacity-50'
                      }`}
                      style={{
                        backgroundColor: costPeriod === option.value ? colors.primary50 : 'transparent',
                        color: costPeriod === option.value ? colors.primary500 : colors.neutral500,
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-[10px] font-medium tracking-widest uppercase -rotate-90 origin-center"
                  style={{ color: colors.neutral400 }}
                >
                  Amount (in INR)
                </span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={costData} barSize={15}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: colors.neutral500, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: colors.neutral500, fontSize: 12 }}
                    tickFormatter={(value) => `${value}L`}
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                  />
                  <Bar dataKey="cost" radius={[12, 12, 12, 12]}>
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Requests & Contracts */}
        <div className="space-y-6">
          {/* Requests */}
          <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold" style={{ color: colors.neutral700 }}>
                Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Custom Tabs */}
              <div className="flex gap-6 mb-4">
                <button
                  onClick={() => setActiveRequestsTab('yours')}
                  className={`text-base font-semibold pb-2 border-b-2 transition-colors ${
                    activeRequestsTab === 'yours'
                      ? 'border-b-2'
                      : 'border-transparent'
                  }`}
                  style={{
                    color: activeRequestsTab === 'yours' ? colors.primary500 : colors.neutral400,
                    borderColor: activeRequestsTab === 'yours' ? colors.primary500 : 'transparent',
                  }}
                >
                  Your requests (0)
                </button>
                <button
                  onClick={() => setActiveRequestsTab('approval')}
                  className={`text-base font-semibold pb-2 border-b-2 transition-colors ${
                    activeRequestsTab === 'approval'
                      ? 'border-b-2'
                      : 'border-transparent'
                  }`}
                  style={{
                    color: activeRequestsTab === 'approval' ? colors.primary500 : colors.neutral400,
                    borderColor: activeRequestsTab === 'approval' ? colors.primary500 : 'transparent',
                  }}
                >
                  For your approval ({totalPendingRequests})
                </button>
              </div>

              {/* Request Items */}
              {activeRequestsTab === 'approval' && (
                <div className="space-y-3">
                  {pendingRequests.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-sm" style={{ color: colors.neutral500 }}>No pending requests</p>
                    </div>
                  ) : (
                    pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: colors.neutral50 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <span
                              className="inline-block px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase text-white rounded-full"
                              style={{ backgroundColor: request.bgColor }}
                            >
                              {request.type}
                            </span>
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-semibold" style={{ color: colors.neutral800 }}>
                                {request.label}
                              </p>
                              <ChevronRight className="h-4 w-4" style={{ color: colors.neutral600 }} />
                            </div>
                            <p className="text-xs" style={{ color: colors.neutral500 }}>
                              {request.user} • {request.role}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold px-3 py-2 h-8 rounded-lg"
                            style={{ color: colors.iconBlue, borderColor: colors.iconBlue }}
                            onClick={() => handleApproveRequest(request)}
                            disabled={processingRequestId === request.id}
                          >
                            {processingRequestId === request.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              'Approve'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeRequestsTab === 'yours' && (
                <div className="py-8 text-center">
                  <p className="text-sm" style={{ color: colors.neutral500 }}>No requests yet</p>
                </div>
              )}

              <Button
                className="w-full mt-4 text-xs font-semibold"
                style={{ backgroundColor: colors.primary50, color: colors.iconBlue }}
                onClick={handleViewAllRequests}
              >
                View all requests
              </Button>
            </CardContent>
          </Card>

          {/* Contract Summary */}
          <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                  Contract summary
                </CardTitle>
                <span
                  className="text-xs font-semibold flex items-center gap-0.5 cursor-default"
                  style={{ color: colors.iconBlue }}
                >
                  Last 6 months <ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 mb-4">
                {/* Donut Chart */}
                <div className="relative w-[110px] h-[110px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contractSummaryData.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={3}
                        cornerRadius={4}
                        dataKey="value"
                      >
                        {contractSummaryData.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-semibold" style={{ color: colors.neutral700 }}>{contractSummaryData.total}</p>
                    <p className="text-[10px] text-center leading-tight" style={{ color: colors.neutral600 }}>
                      Active<br />contracts
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-6">
                  {contractSummaryData.data.map((item) => (
                    <div key={item.name} className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1 h-7 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <div>
                          <p
                            className="text-xs font-medium tracking-widest uppercase"
                            style={{ color: colors.neutral700 }}
                          >
                            {item.value}
                          </p>
                          <p className="text-xs" style={{ color: colors.neutral500 }}>
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Contracts */}
              <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-xs font-medium tracking-widest uppercase"
                    style={{ color: colors.neutral500 }}
                  >
                    Recent contracts ({recentContractsData.length})
                  </p>
                  <Link
                    href="/employer/contracts"
                    className="text-xs font-semibold flex items-center gap-0.5"
                    style={{ color: colors.iconBlue }}
                  >
                    View all <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-0">
                  {recentContractsData.map((contract, index) => (
                    <div
                      key={contract.id}
                      className={`flex items-center justify-between py-3 ${index !== recentContractsData.length - 1 ? 'border-b' : ''}`}
                      style={{ borderColor: colors.border }}
                    >
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
                            {contract.name}
                          </p>
                          <ChevronRight className="h-3.5 w-3.5" style={{ color: colors.neutral500 }} />
                        </div>
                        <p className="text-xs" style={{ color: colors.neutral500 }}>
                          {contract.role}
                        </p>
                      </div>
                      <FileText className="h-5 w-5" style={{ color: colors.iconBlue }} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROW 3: Team Headcount & Probation & Celebrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TeamHeadcountChart companyId={companyId} />
        <ProbationWidget companyId={companyId} />
        <CelebrationsWidget companyId={companyId} />
      </div>

      {/* ROW 4: Help & Support & Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Help & Support */}
        <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold" style={{ color: colors.neutral700 }}>
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div
                className="p-4 rounded-lg cursor-pointer hover:opacity-90 transition"
                style={{ backgroundColor: colors.neutral50 }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill={colors.neutral50} />
                    <path
                      d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM25 31H23V29H25V31ZM27.07 23.25L26.17 24.17C25.45 24.9 25 25.5 25 27H23V26.5C23 25.4 23.45 24.4 24.17 23.67L25.41 22.41C25.78 22.05 26 21.55 26 21C26 19.9 25.1 19 24 19C22.9 19 22 19.9 22 21H20C20 18.79 21.79 17 24 17C26.21 17 28 18.79 28 21C28 21.88 27.64 22.68 27.07 23.25Z"
                      fill={colors.neutral500}
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: colors.neutral600 }}>
                    Knowledge repository
                  </p>
                  <ChevronRight className="h-5 w-5" style={{ color: colors.neutral500 }} />
                </div>
              </div>
              <div
                className="p-4 rounded-lg cursor-pointer hover:opacity-90 transition"
                style={{ backgroundColor: colors.neutral50 }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill={colors.neutral50} />
                    <path
                      d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM25 31H23V29H25V31ZM27.07 23.25L26.17 24.17C25.45 24.9 25 25.5 25 27H23V26.5C23 25.4 23.45 24.4 24.17 23.67L25.41 22.41C25.78 22.05 26 21.55 26 21C26 19.9 25.1 19 24 19C22.9 19 22 19.9 22 21H20C20 18.79 21.79 17 24 17C26.21 17 28 18.79 28 21C28 21.88 27.64 22.68 27.07 23.25Z"
                      fill={colors.neutral500}
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: colors.neutral600 }}>
                    Live chat
                  </p>
                  <ChevronRight className="h-5 w-5" style={{ color: colors.neutral500 }} />
                </div>
              </div>
            </div>
            <p className="text-xs" style={{ color: colors.neutral500 }}>
              For any further assistance, please reach out to us via{' '}
              <a href="mailto:support@rapid.one" style={{ color: colors.iconBlue }}>
                support@rapid.one
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
              Upcoming holidays
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {holidaysData.map((holiday) => (
                <div
                  key={holiday.id}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.success50 }}
                >
                  <p className="text-sm font-medium" style={{ color: colors.neutral700 }}>
                    {holiday.date}
                  </p>
                  <p
                    className="text-xs font-medium tracking-widest uppercase mt-1"
                    style={{ color: colors.neutral500 }}
                  >
                    {holiday.name}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/employer/holidays"
              className="text-xs font-semibold flex items-center gap-0.5"
              style={{ color: colors.iconBlue }}
            >
              View holiday calendar <ChevronRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          className="w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition"
          style={{ backgroundColor: colors.primary500 }}
        >
          <MessageSquare className="h-7 w-7" style={{ color: colors.primary50 }} />
        </button>
      </div>
    </div>
  )
}
