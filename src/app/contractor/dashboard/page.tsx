'use client'

import Link from 'next/link'
import {
  ChevronRight,
  MessageSquare,
  Bell,
  FileText,
  Loader2,
  Calendar,
  DollarSign,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import {
  useContractorProfile,
  useContractorInvoices,
  useContractorOwnContracts,
  useContractorTimesheets,
} from '@/lib/hooks'

// Figma Design Tokens
const colors = {
  primary500: '#642DFC',
  primary100: '#E0D5FE',
  primary50: '#F6F2FF',
  iconBlue: '#586AF5',
  neutral900: '#1B1D21',
  neutral800: '#353B41',
  neutral700: '#505862',
  neutral600: '#6A7682',
  neutral500: '#8593A3',
  neutral400: '#A8B5C2',
  neutral50: '#F4F7FA',
  secondaryBlue50: '#EBF5FF',
  secondaryBlue200: '#9ACEFE',
  success600: '#22957F',
  success50: '#EDF9F7',
  warning600: '#CC7A00',
  warning200: '#FFDD99',
  aqua200: '#A5E9F2',
  aqua400: '#4AD3E5',
  green200: '#A7ECCA',
  rose200: '#FFB5C6',
  border: '#DEE4EB',
}

export default function ContractorDashboard() {
  const { user } = useAuth()
  const contractorId = user?.id
  const { data: profile, isLoading: profileLoading } = useContractorProfile(contractorId)
  const { data: invoices, isLoading: invoicesLoading } = useContractorInvoices(contractorId)
  const { data: contracts, isLoading: contractsLoading } = useContractorOwnContracts(contractorId)
  const { data: timesheets, isLoading: timesheetsLoading } = useContractorTimesheets(contractorId)

  const isLoading = profileLoading || invoicesLoading || contractsLoading || timesheetsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const userName = profile?.full_name?.split(' ')[0] || 'Contractor'

  // Calculate contract data for pie chart
  const contractTypes = contracts?.reduce((acc, c) => {
    const type = c.contract_type || 'Other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const contractData = Object.entries(contractTypes).map(([name, value], idx) => ({
    name,
    value,
    fill: [colors.warning200, colors.aqua400, colors.rose200, colors.green200][idx % 4],
  }))

  const totalContracts = contracts?.length || 0

  // Invoice data
  const unpaidInvoices = invoices?.filter(inv => inv.status !== 'paid').slice(0, 2) || []
  const paidInvoices = invoices?.filter(inv => inv.status === 'paid').slice(0, 3) || []

  // Timesheet alert - check for pending timesheets
  const pendingTimesheets = timesheets?.filter(ts => ts.status === 'draft' || ts.status === 'submitted') || []
  const hasTimesheetAlert = pendingTimesheets.length > 0

  // Transform contracts for display
  const displayContracts = contracts?.slice(0, 3).map((contract, idx) => ({
    id: contract.id,
    type: contract.contract_type || 'Hourly',
    bgColor: [colors.warning200, colors.rose200, colors.aqua200][idx % 3],
    textColor: [colors.warning600, '#D63384', colors.aqua400][idx % 3],
    company: contract.companyName || 'Unknown Company',
    role: `${contract.designation || 'Consultant'} - ${contract.department || 'General'}`,
  })) || []

  // Get current month name
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: colors.neutral800 }}>
          Good morning {userName}!
        </h1>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-lg"
          style={{ borderColor: colors.border }}
        >
          <Bell className="h-5 w-5" style={{ color: colors.neutral500 }} />
        </Button>
      </div>

      {/* ROW 1: Contracts Summary & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contracts Summary */}
        <div className="lg:col-span-7">
          <Card
            className="rounded-2xl h-full overflow-hidden"
            style={{ backgroundColor: colors.secondaryBlue50, borderColor: colors.secondaryBlue200 }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                  Contracts summary
                </CardTitle>
                <Link
                  href="/contractor/contracts"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  View <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <div className="flex items-center gap-8">
                {/* Left: Pie Chart */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative w-[160px] h-[160px]">
                    {contractData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={contractData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            cornerRadius={8}
                            dataKey="value"
                          >
                            {contractData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-[120px] h-[120px] rounded-full border-8 border-gray-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[34px] font-bold" style={{ color: colors.neutral900 }}>{totalContracts}</p>
                      <p
                        className="text-[10px] font-medium tracking-widest uppercase"
                        style={{ color: colors.neutral600 }}
                      >
                        Total contracts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Legend */}
                <div className="flex-1 space-y-4">
                  {contractData.length > 0 ? (
                    contractData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                        <div className="flex-1">
                          <p className="text-sm" style={{ color: colors.neutral700 }}>{item.name}</p>
                          <p className="text-xs" style={{ color: colors.neutral500 }}>{item.value}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: colors.neutral500 }}>No active contracts</p>
                  )}
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
                  href="/contractor/notifications"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <div className="space-y-0">
                {paidInvoices.length > 0 ? (
                  paidInvoices.slice(0, 2).map((invoice, index) => (
                    <div
                      key={invoice.id}
                      className={`flex gap-3 py-4 ${index !== Math.min(paidInvoices.length, 2) - 1 ? 'border-b' : ''}`}
                      style={{ borderColor: colors.border }}
                    >
                      <div className="flex-shrink-0">
                        <DollarSign className="h-5 w-5" style={{ color: colors.success600 }} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: colors.neutral500 }}>
                        Payment of ₹{(invoice.total_amount || 0).toLocaleString('en-IN')} received for invoice {invoice.invoice_number}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm py-4" style={{ color: colors.neutral500 }}>
                    No recent updates
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROW 2: Invoices & Payments | Completion Alert & Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Invoices & Payments */}
        <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
              Invoices and payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* Unpaid Invoices Header */}
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: colors.neutral500 }}
              >
                Unpaid invoices ({unpaidInvoices.length})
              </p>
              <Link
                href="/contractor/invoices"
                className="text-xs font-semibold flex items-center gap-0.5"
                style={{ color: colors.iconBlue }}
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Unpaid Invoices Cards */}
            {unpaidInvoices.length > 0 ? (
              unpaidInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 rounded-xl flex items-center justify-between"
                  style={{ backgroundColor: colors.neutral50 }}
                >
                  <div>
                    <p className="text-base font-semibold" style={{ color: colors.neutral800 }}>
                      INR {(invoice.total_amount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs" style={{ color: colors.neutral600 }}>
                      {invoice.companyName || 'Unknown'} - {invoice.status}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5" style={{ color: colors.neutral500 }} />
                </div>
              ))
            ) : (
              <p className="text-sm p-4 text-center" style={{ color: colors.neutral500 }}>
                No unpaid invoices
              </p>
            )}

            {/* Payments Received Section */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: colors.neutral500 }}
                >
                  Payments received ({paidInvoices.length})
                </p>
                <Link
                  href="/contractor/invoices?status=paid"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-0">
                {paidInvoices.length > 0 ? (
                  paidInvoices.map((payment, index) => (
                    <div
                      key={payment.id}
                      className={`flex items-center justify-between py-3 ${index !== paidInvoices.length - 1 ? 'border-b' : ''}`}
                      style={{ borderColor: colors.border }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
                          INR {(payment.total_amount || 0).toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs" style={{ color: colors.neutral500 }}>
                          {payment.companyName || 'Unknown Company'}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5" style={{ color: colors.neutral500 }} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm py-3 text-center" style={{ color: colors.neutral500 }}>
                    No payments received yet
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Completion Alert & Contracts */}
        <div className="space-y-6">
          {/* Completion Alert */}
          {hasTimesheetAlert && (
            <Card className="rounded-2xl" style={{ backgroundColor: colors.warning200, borderColor: colors.warning200 }}>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2" style={{ color: colors.neutral800 }}>
                  Completion of timesheet
                </h3>
                <p className="text-sm mb-4" style={{ color: colors.neutral700 }}>
                  You have {pendingTimesheets.length} pending timesheet{pendingTimesheets.length > 1 ? 's' : ''} for {currentMonth}.
                </p>
                <Link href="/contractor/timesheet">
                  <Button
                    className="w-full text-xs font-semibold"
                    style={{ backgroundColor: colors.primary500 }}
                  >
                    Update timesheet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Contracts */}
          <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                  Contracts
                </CardTitle>
                <Link
                  href="/contractor/contracts"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {displayContracts.length > 0 ? (
                displayContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: colors.neutral50 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <span
                          className="inline-block px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase rounded-full"
                          style={{ backgroundColor: contract.bgColor, color: contract.textColor }}
                        >
                          {contract.type}
                        </span>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-semibold" style={{ color: colors.neutral800 }}>
                            {contract.company}
                          </p>
                          <ChevronRight className="h-4 w-4" style={{ color: colors.neutral600 }} />
                        </div>
                        <p className="text-xs" style={{ color: colors.neutral500 }}>
                          {contract.role}
                        </p>
                      </div>
                      <FileText className="h-5 w-5" style={{ color: colors.iconBlue }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm p-4 text-center" style={{ color: colors.neutral500 }}>
                  No active contracts
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROW 3: Help & Support & Upcoming */}
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-gray-100">
                  <FileText className="h-6 w-6" style={{ color: colors.neutral500 }} />
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-gray-100">
                  <MessageSquare className="h-6 w-6" style={{ color: colors.neutral500 }} />
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

        {/* Upcoming */}
        <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {pendingTimesheets.length > 0 ? (
                pendingTimesheets.slice(0, 2).map((ts) => (
                  <div
                    key={ts.id}
                    className="p-4 rounded-lg flex items-center gap-3"
                    style={{ backgroundColor: colors.success50 }}
                  >
                    <Calendar className="h-5 w-5" style={{ color: colors.success600 }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.neutral700 }}>
                        Timesheet due: {ts.week_end_date ? new Date(ts.week_end_date).toLocaleDateString('en-IN') : 'Soon'}
                      </p>
                      <p
                        className="text-xs font-medium tracking-widest uppercase mt-1"
                        style={{ color: colors.neutral500 }}
                      >
                        {ts.totalHours || 0} hours logged
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.success50 }}
                >
                  <p className="text-sm font-medium" style={{ color: colors.neutral700 }}>
                    No upcoming deadlines
                  </p>
                  <p
                    className="text-xs font-medium mt-1"
                    style={{ color: colors.neutral500 }}
                  >
                    All timesheets are submitted
                  </p>
                </div>
              )}
            </div>
            <Link
              href="/contractor/timesheet"
              className="text-xs font-semibold flex items-center gap-0.5 mt-4"
              style={{ color: colors.iconBlue }}
            >
              View timesheet <ChevronRight className="h-4 w-4" />
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
