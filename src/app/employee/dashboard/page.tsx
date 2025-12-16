'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Bell,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Calendar,
  Clock,
  DollarSign,
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
import {
  useEmployeeDashboard,
  useLeaveBalances,
  useEmployeePayrollHistory,
  useEmployeeNotifications,
  useCurrentPayslip,
  useAttendanceStats,
  useTaxDeclarationStatus,
  usePendingAssetConfirmations,
  useConfirmAssetReceipt,
} from '@/lib/hooks'
import { useAuth } from '@/lib/auth'
import { colors, chartColors } from '@/lib/design-tokens'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const employeeId = user?.id || undefined
  const userName = user?.name?.split(' ')[0] || 'User'

  const [activeRequestsTab, setActiveRequestsTab] = useState<'pending' | 'approved'>('pending')

  // Fetch real data
  const { data: dashboardStats, isLoading } = useEmployeeDashboard(employeeId)
  const { data: leaveBalancesData = [] } = useLeaveBalances(employeeId)
  const { data: payrollHistory = [] } = useEmployeePayrollHistory(employeeId, 6)
  const { data: notifications = [] } = useEmployeeNotifications(employeeId, 5)
  const { data: currentPayslip } = useCurrentPayslip(employeeId)
  const { data: attendanceStats } = useAttendanceStats(employeeId)
  const { data: taxDeadline } = useTaxDeclarationStatus(employeeId)
  const { data: pendingAssets } = usePendingAssetConfirmations(employeeId)
  const confirmAssetMutation = useConfirmAssetReceipt()

  // Transform payroll history for chart
  const payrollData = useMemo(() => {
    if (payrollHistory.length === 0) {
      return [{ month: 'No data', amount: 0, fill: colors.neutral400 }]
    }
    return payrollHistory.map((p, i) => ({
      month: p.month,
      amount: p.netPay / 10000, // Convert to 10K units for display
      fill: chartColors[i % chartColors.length],
    }))
  }, [payrollHistory])

  // Transform notifications for updates section
  const updatesData = useMemo(() => {
    if (notifications.length === 0) {
      return [{ id: '1', message: 'No recent updates' }]
    }
    return notifications.map((n) => ({
      id: n.id,
      message: n.message,
    }))
  }, [notifications])

  // Calculate totals from leave balances
  const leaveStats = useMemo(() => {
    if (!dashboardStats?.leaveBalances || dashboardStats.leaveBalances.length === 0) {
      return { total: 20, taken: 14, available: 6 }
    }

    const total = dashboardStats.leaveBalances.reduce((sum, b) => sum + b.total, 0)
    const taken = dashboardStats.leaveBalances.reduce((sum, b) => sum + b.taken, 0)
    const available = dashboardStats.leaveBalances.reduce((sum, b) => sum + b.available, 0)

    return { total, taken, available }
  }, [dashboardStats?.leaveBalances])

  // Chart data for leave balance
  const leaveChartData = useMemo(() => [
    { name: 'Taken', value: leaveStats.taken || 1, fill: colors.aqua400 },
    { name: 'Available', value: leaveStats.available || 1, fill: colors.rose200 },
  ], [leaveStats])

  // Total pending requests
  const totalPendingRequests = useMemo(() => {
    return (dashboardStats?.pendingLeaveRequests || 0) + (dashboardStats?.pendingExpenseRequests || 0)
  }, [dashboardStats])

  // Mock requests data based on pending counts
  const requestsData = useMemo(() => {
    const requests = []
    if (dashboardStats?.pendingLeaveRequests && dashboardStats.pendingLeaveRequests > 0) {
      requests.push({
        id: '1',
        type: 'Leave',
        bgColor: colors.warning600,
        label: 'Pending Leave Request',
        description: `${dashboardStats.pendingLeaveRequests} request(s) pending approval`,
      })
    }
    if (dashboardStats?.pendingExpenseRequests && dashboardStats.pendingExpenseRequests > 0) {
      requests.push({
        id: '2',
        type: 'Expense',
        bgColor: colors.secondaryBlue600,
        label: 'Pending Expense Claim',
        description: `${dashboardStats.pendingExpenseRequests} claim(s) pending approval`,
      })
    }
    return requests.length > 0 ? requests : [
      { id: '1', type: 'Info', bgColor: colors.success600, label: 'All caught up!', description: 'No pending requests' }
    ]
  }, [dashboardStats])

  // Format holidays from real data
  const holidaysData = useMemo(() => {
    if (!dashboardStats?.upcomingHolidays || dashboardStats.upcomingHolidays.length === 0) {
      return [
        { id: '1', date: 'No upcoming holidays', name: '' }
      ]
    }

    return dashboardStats.upcomingHolidays.map((h, i) => ({
      id: String(i + 1),
      date: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
      name: h.name,
    }))
  }, [dashboardStats?.upcomingHolidays])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.iconBlue }} />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: colors.neutral800 }}>
          Hi {userName}!
        </h1>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="h-10 px-4 text-xs font-semibold tracking-wide border rounded-lg"
            style={{ color: colors.iconBlue, borderColor: colors.iconBlue }}
          >
            <Link href="/employee/requests/new">+ New request</Link>
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

      {/* ROW 1: Leave Balance & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leave Balance */}
        <div className="lg:col-span-7">
          <Card
            className="rounded-2xl h-full overflow-hidden"
            style={{ backgroundColor: colors.secondaryBlue50, borderColor: colors.secondaryBlue200 }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                  Leave balance
                </CardTitle>
                <Link
                  href="/employee/leaves"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  Apply <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <div className="flex">
                {/* Left: Donut Chart */}
                <div className="flex-1 pr-4 border-r" style={{ borderColor: colors.border }}>
                  <div className="relative h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leaveChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          cornerRadius={8}
                          dataKey="value"
                        >
                          {leaveChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[34px] font-bold" style={{ color: colors.neutral900 }}>{leaveStats.total}</p>
                      <p
                        className="text-xs font-medium tracking-widest uppercase"
                        style={{ color: colors.neutral600 }}
                      >
                        Total days
                      </p>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex justify-center gap-8 mt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.aqua400 }} />
                      <span style={{ color: colors.neutral500 }}>Taken: {leaveStats.taken}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.rose200 }} />
                      <span style={{ color: colors.neutral500 }}>Available: {leaveStats.available}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Leave Breakdown */}
                <div className="flex-1 pl-6">
                  <p
                    className="text-xs font-medium tracking-widest uppercase mb-4"
                    style={{ color: colors.neutral600 }}
                  >
                    Available leaves
                  </p>
                  <div className="space-y-0">
                    {dashboardStats?.leaveBalances && dashboardStats.leaveBalances.length > 0 ? (
                      dashboardStats.leaveBalances.slice(0, 3).map((balance, index) => (
                        <div
                          key={balance.type}
                          className={`flex items-center justify-between py-4 ${index !== Math.min(dashboardStats.leaveBalances.length - 1, 2) ? 'border-b' : ''}`}
                          style={{ borderColor: colors.border }}
                        >
                          <span className="text-xs" style={{ color: colors.neutral500 }}>{balance.type}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-semibold" style={{ color: colors.neutral700 }}>{balance.available}</span>
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <ChevronRight className="h-3 w-3" style={{ color: colors.neutral500 }} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div
                          className="flex items-center justify-between py-4 border-b"
                          style={{ borderColor: colors.border }}
                        >
                          <span className="text-xs" style={{ color: colors.neutral500 }}>Casual Leave</span>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-semibold" style={{ color: colors.neutral700 }}>0</span>
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <ChevronRight className="h-3 w-3" style={{ color: colors.neutral500 }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-4">
                          <span className="text-xs" style={{ color: colors.neutral500 }}>Sick Leave</span>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-semibold" style={{ color: colors.neutral700 }}>0</span>
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <ChevronRight className="h-3 w-3" style={{ color: colors.neutral500 }} />
                            </div>
                          </div>
                        </div>
                      </>
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
                  href="/employee/updates"
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

      {/* ROW 2: Requests & Payroll | Quick Stats & Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Requests & Payroll */}
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
                  onClick={() => setActiveRequestsTab('pending')}
                  className="text-base font-semibold pb-2 border-b-2 transition-colors"
                  style={{
                    color: activeRequestsTab === 'pending' ? colors.primary500 : colors.neutral400,
                    borderColor: activeRequestsTab === 'pending' ? colors.primary500 : 'transparent',
                  }}
                >
                  Pending ({totalPendingRequests})
                </button>
                <button
                  onClick={() => setActiveRequestsTab('approved')}
                  className="text-base font-semibold pb-2 border-b-2 transition-colors"
                  style={{
                    color: activeRequestsTab === 'approved' ? colors.primary500 : colors.neutral400,
                    borderColor: activeRequestsTab === 'approved' ? colors.primary500 : 'transparent',
                  }}
                >
                  Approved
                </button>
              </div>

              {/* Request Items */}
              {activeRequestsTab === 'pending' && (
                <div className="space-y-3">
                  {requestsData.map((request) => (
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
                            {request.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="text-xs font-semibold px-3 py-2 h-8 rounded-lg"
                          style={{ backgroundColor: colors.primary500 }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeRequestsTab === 'approved' && (
                <div className="py-8 text-center">
                  <p className="text-sm" style={{ color: colors.neutral500 }}>Viewing approved requests</p>
                </div>
              )}

              <Button
                className="w-full mt-4 text-xs font-semibold"
                style={{ backgroundColor: colors.primary50, color: colors.iconBlue }}
              >
                View all requests
              </Button>
            </CardContent>
          </Card>

          {/* Payroll */}
          <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                  Payroll
                </CardTitle>
                <span
                  className="text-xs font-semibold flex items-center gap-0.5 cursor-default"
                  style={{ color: colors.iconBlue }}
                >
                  Last 6 months <ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={payrollData} barSize={15}>
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
                    tickFormatter={(value) => `$${value}0K`}
                  />
                  <Bar dataKey="amount" radius={[12, 12, 12, 12]}>
                    {payrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Stats & Eligibility */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs mb-2" style={{ color: colors.neutral600 }}>Net Pay (Last)</p>
                    <p className="text-xl font-bold" style={{ color: colors.neutral800 }}>
                      {currentPayslip ? `₹${currentPayslip.netPay.toLocaleString()}` : '—'}
                    </p>
                    <p className="text-xs mt-2" style={{ color: colors.neutral500 }}>
                      {currentPayslip ? `${currentPayslip.month} ${currentPayslip.year}` : 'No data'}
                    </p>
                  </div>
                  <DollarSign className="h-7 w-7" style={{ color: colors.primary100 }} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs mb-2" style={{ color: colors.neutral600 }}>Attendance</p>
                    <p className="text-xl font-bold" style={{ color: colors.neutral800 }}>
                      {attendanceStats ? `${attendanceStats.attendancePercentage}%` : '—'}
                    </p>
                    <p className="text-xs mt-2" style={{ color: colors.neutral500 }}>This month</p>
                  </div>
                  <Calendar className="h-7 w-7" style={{ color: colors.primary100 }} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs mb-2" style={{ color: colors.neutral600 }}>Leaves Taken</p>
                    <p className="text-xl font-bold" style={{ color: colors.neutral800 }}>{leaveStats.taken}</p>
                    <p className="text-xs mt-2" style={{ color: colors.neutral500 }}>Out of {leaveStats.total}</p>
                  </div>
                  <Clock className="h-7 w-7" style={{ color: colors.primary100 }} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs mb-2" style={{ color: colors.neutral600 }}>Pending</p>
                    <p className="text-xl font-bold" style={{ color: colors.neutral800 }}>{totalPendingRequests}</p>
                    <p className="text-xs mt-2" style={{ color: colors.neutral500 }}>Requests</p>
                  </div>
                  <Bell className="h-7 w-7" style={{ color: colors.primary100 }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Eligibility Cards */}
          <div className="space-y-4">
            {/* Tax Declaration - Dynamic */}
            <Card
              className="rounded-2xl"
              style={{
                backgroundColor: taxDeadline?.isWindowOpen ? colors.warning200 : colors.neutral50,
                borderColor: taxDeadline?.isWindowOpen ? colors.warning200 : colors.border,
              }}
            >
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2" style={{ color: colors.neutral800 }}>
                  Tax declaration {taxDeadline?.financialYear || ''}
                </h3>
                <p className="text-sm mb-4" style={{ color: colors.neutral700 }}>
                  {taxDeadline?.isWindowOpen ? (
                    <>
                      Last date: {taxDeadline.deadline.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                      {taxDeadline.daysRemaining > 0 && (
                        <span className="ml-1">({taxDeadline.daysRemaining} days left)</span>
                      )}
                    </>
                  ) : (
                    'Declaration window is currently closed'
                  )}
                </p>
                {taxDeadline?.declarationStatus === 'submitted' || taxDeadline?.declarationStatus === 'verified' ? (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full text-xs font-semibold bg-white"
                    style={{ color: colors.success600, borderColor: colors.success600 }}
                  >
                    <Link href="/employee/tax/declaration">View Declaration</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full text-xs font-semibold"
                    style={{ backgroundColor: colors.primary500 }}
                    disabled={!taxDeadline?.isWindowOpen}
                  >
                    <Link href="/employee/tax/declaration">
                      {taxDeadline?.declarationStatus === 'draft' ? 'Continue Declaration' : 'Upload declarations'}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Health Insurance */}
            <Card className="rounded-2xl" style={{ backgroundColor: colors.rose200, borderColor: colors.rose200 }}>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2" style={{ color: colors.neutral800 }}>Health insurance</h3>
                <p className="text-sm mb-4" style={{ color: colors.neutral700 }}>
                  You're eligible for our comprehensive health insurance.
                </p>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold bg-white"
                  style={{ color: colors.neutral700, borderColor: colors.border }}
                >
                  View details
                </Button>
              </CardContent>
            </Card>

            {/* Welcome Kit */}
            <Card className="rounded-2xl" style={{ backgroundColor: colors.aqua200, borderColor: colors.aqua200 }}>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2" style={{ color: colors.neutral800 }}>Welcome kit</h3>
                <p className="text-sm mb-4" style={{ color: colors.neutral700 }}>
                  Get your company swag and welcome package.
                </p>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold bg-white"
                  style={{ color: colors.neutral700, borderColor: colors.border }}
                >
                  View details
                </Button>
              </CardContent>
            </Card>

            {/* Device/Gift Receipt Confirmation - Only show when pending */}
            {pendingAssets && pendingAssets.count > 0 && (
              <Card className="rounded-2xl" style={{ backgroundColor: colors.success200, borderColor: colors.success200 }}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold" style={{ color: colors.neutral800 }}>
                      Confirm receipt
                    </h3>
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full"
                      style={{ backgroundColor: colors.success600, color: 'white' }}
                    >
                      {pendingAssets.count}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: colors.neutral700 }}>
                    {pendingAssets.count === 1
                      ? 'You have 1 item delivered that needs receipt confirmation.'
                      : `You have ${pendingAssets.count} items delivered that need receipt confirmation.`}
                  </p>
                  <div className="space-y-2 mb-4">
                    {pendingAssets.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/60"
                      >
                        <div>
                          <p className="text-sm font-medium" style={{ color: colors.neutral800 }}>
                            {item.name}
                          </p>
                          <p className="text-xs capitalize" style={{ color: colors.neutral500 }}>
                            {item.type.replace('_', ' ')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="text-xs px-3 h-7"
                          style={{ backgroundColor: colors.success600 }}
                          onClick={() => confirmAssetMutation.mutate({ assetId: item.id })}
                          disabled={confirmAssetMutation.isPending}
                        >
                          Confirm
                        </Button>
                      </div>
                    ))}
                  </div>
                  {pendingAssets.count > 2 && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full text-xs font-semibold bg-white"
                      style={{ color: colors.success600, borderColor: colors.success600 }}
                    >
                      <Link href="/employee/assets">View all ({pendingAssets.count})</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ROW 3: Help & Support & Holidays */}
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3">
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3">
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
              {holidaysData.slice(0, 4).map((holiday) => (
                <div
                  key={holiday.id}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.success50 }}
                >
                  <p className="text-sm font-medium" style={{ color: colors.neutral700 }}>
                    {holiday.date}
                  </p>
                  {holiday.name && (
                    <p
                      className="text-xs font-medium tracking-widest uppercase mt-1"
                      style={{ color: colors.neutral500 }}
                    >
                      {holiday.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Link
              href="/employee/holidays"
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
