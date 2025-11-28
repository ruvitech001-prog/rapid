'use client'

import Link from 'next/link'
import {
  ChevronRight,
  MessageSquare,
  Bell,
  FileText,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
  secondaryBlue600: '#026ACA',
  success600: '#22957F',
  success50: '#EDF9F7',
  warning600: '#CC7A00',
  warning200: '#FFDD99',
  aqua200: '#A5E9F2',
  aqua300: '#77DEEC',
  aqua400: '#4AD3E5',
  green200: '#A7ECCA',
  rose200: '#FFB5C6',
  border: '#DEE4EB',
}

// Contract data for pie chart
const contractData = [
  { name: 'Hourly', value: 2, fill: colors.warning200 },
  { name: 'Fixed rate', value: 2, fill: colors.aqua400 },
  { name: 'Milestone', value: 2, fill: colors.rose200 },
]

// Invoice data
const invoicesData = [
  { id: 1, amount: 90000, company: 'ABC Corp, India', type: 'Hourly' },
  { id: 2, amount: 90000, company: 'Dce Corp, India', type: 'Fixed rate' },
]

const paymentsReceivedData = [
  { id: 1, amount: 6000, company: 'Efg Corp, India', type: 'Hourly' },
  { id: 2, amount: 6000, company: 'Qwerty Corp, India', type: 'Hourly' },
  { id: 3, amount: 6000, company: 'Asdf Corp, India', type: 'Hourly' },
]

// Updates data
const updatesData = [
  { id: 1, message: 'Time-off request for 23/Nov/22 has been approved.' },
  { id: 2, message: 'Time-off request for 23/Nov/22 has been approved.' },
]

// Contracts data
const contractsData = [
  { id: 1, type: 'Hourly', bgColor: colors.warning200, textColor: colors.warning600, company: 'ABC Corp.', role: 'Consulting agreement • Sales executive' },
  { id: 2, type: 'Milestone', bgColor: colors.rose200, textColor: '#D63384', company: 'Deloitte Corp.', role: 'Consulting agreement • Sales executive' },
  { id: 3, type: 'Fixed Rate', bgColor: colors.aqua200, textColor: colors.aqua400, company: 'Vedantu', role: 'Consulting agreement • Sales executive' },
]

// Holidays data
const holidaysData = [
  { id: 1, date: 'Tue, 15/Aug/2023', name: 'Independence Day' },
  { id: 2, date: 'Wed, 30/Aug/2023', name: 'Rakshabandhan' },
]

export default function ContractorDashboard() {
  const userName = 'Peter'

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
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[34px] font-bold" style={{ color: colors.neutral900 }}>10</p>
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
                  {contractData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                      <div className="flex-1">
                        <p className="text-sm" style={{ color: colors.neutral700 }}>{item.name}</p>
                        <p className="text-xs" style={{ color: colors.neutral500 }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
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
                  href="/contractor/updates"
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
                Unpaid invoices (4)
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
            {invoicesData.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 rounded-xl flex items-center justify-between"
                style={{ backgroundColor: colors.neutral50 }}
              >
                <div>
                  <p className="text-base font-semibold" style={{ color: colors.neutral800 }}>
                    INR {invoice.amount.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: colors.neutral600 }}>
                    {invoice.company} • {invoice.type}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5" style={{ color: colors.neutral500 }} />
              </div>
            ))}

            {/* Payments Received Section */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: colors.neutral500 }}
                >
                  Payments received (5)
                </p>
                <Link
                  href="/contractor/payments"
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: colors.iconBlue }}
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-0">
                {paymentsReceivedData.map((payment, index) => (
                  <div
                    key={payment.id}
                    className={`flex items-center justify-between py-3 ${index !== paymentsReceivedData.length - 1 ? 'border-b' : ''}`}
                    style={{ borderColor: colors.border }}
                  >
                    <div>
                      <p className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
                        INR {payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs" style={{ color: colors.neutral500 }}>
                        {payment.company}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5" style={{ color: colors.neutral500 }} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Completion Alert & Contracts */}
        <div className="space-y-6">
          {/* Completion Alert */}
          <Card className="rounded-2xl" style={{ backgroundColor: colors.warning200, borderColor: colors.warning200 }}>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2" style={{ color: colors.neutral800 }}>
                Completion of timesheet
              </h3>
              <p className="text-sm mb-4" style={{ color: colors.neutral700 }}>
                Last date for completion of timesheet for ABC Corp. for the month of Apr/23 is 10/May/23.
              </p>
              <Button
                className="w-full text-xs font-semibold"
                style={{ backgroundColor: colors.primary500 }}
              >
                Update timesheet
              </Button>
            </CardContent>
          </Card>

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
              {contractsData.map((contract) => (
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
              ))}
            </CardContent>
          </Card>
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
              href="/contractor/holidays"
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
