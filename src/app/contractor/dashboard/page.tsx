'use client'

import { CSSProperties, useState } from 'react'
import Link from 'next/link'
import {
  Clock,
  FileText,
  DollarSign,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Bell,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Contract data for pie chart
const contractData = [
  { name: 'Hourly', value: 2, fill: '#FCD34D' },
  { name: 'Fixed rate', value: 2, fill: '#2DD4BF' },
  { name: 'Milestone', value: 2, fill: '#FF7373' },
]

// Invoice data
const invoicesData = [
  { id: 1, amount: 90000, company: 'ABC Corp, India', type: 'Hourly', status: 'unpaid' },
  { id: 2, amount: 90000, company: 'Dce Corp, India', type: 'Fixed rate', status: 'unpaid' },
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
  { id: 1, type: 'HOURLY', company: 'ABC Corp.', role: 'Consulting agreement • Sales executive' },
  { id: 2, type: 'MILESTONE', company: 'Deloitte Corp.', role: 'Consulting agreement • Sales executive' },
  { id: 3, type: 'FIXED RATE', company: 'Vedantu', role: 'Consulting agreement • Sales executive' },
]

// Holidays data
const holidaysData = [
  { id: 1, date: 'Sat, 14/Jan/2023', name: 'MAKAR SANKRANTI' },
  { id: 2, date: 'Wed, 26/Jan/2023', name: 'REPUBLIC DAY' },
]

export default function ContractorDashboard() {
  const userName = 'Peter'

  const getContractBadgeColor = (type: string) => {
    if (type === 'HOURLY') return 'bg-yellow-100 text-yellow-800'
    if (type === 'MILESTONE') return 'bg-red-100 text-red-800'
    if (type === 'FIXED RATE') return 'bg-teal-100 text-teal-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Good morning {userName}!</h2>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>

      {/* ROW 1: Contracts Summary & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Contracts Summary */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border-0 h-full bg-[#EBF5FF]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Contracts summary</CardTitle>
                <Link
                  href="/contractor/contracts"
                  className="text-sm font-medium text-[#586AF5] hover:underline flex items-center gap-1"
                >
                  View <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Left: Pie Chart */}
                <div className="flex-1 flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={contractData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {contractData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className="text-4xl font-bold text-gray-900">10</p>
                    <p className="text-[10px] text-[#8593A3] tracking-wider font-medium">
                      TOTAL CONTRACTS
                    </p>
                  </div>
                </div>

                {/* Right: Legend */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#FCD34D]"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Hourly</p>
                      <p className="text-sm text-gray-600">2</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#2DD4BF]"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fixed rate</p>
                      <p className="text-sm text-gray-600">2</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#FF7373]"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Milestone</p>
                      <p className="text-sm text-gray-600">2</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Updates */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none h-full bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Updates</CardTitle>
                <Link
                  href="/contractor/updates"
                  className="text-sm font-medium text-[#586AF5] hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 pb-6">
              {updatesData.map((update) => (
                <div key={update.id} className="flex gap-3 py-3 px-2 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex-shrink-0 mt-0.5">
                    <Bell className="h-5 w-5 text-[#2DD4BF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">{update.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROW 2: Invoices & Payments | Completion Alert & Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Invoices & Payments */}
        <div className="space-y-6">
          {/* Invoices */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>INVOICES AND PAYMENTS</CardTitle>
                <Link href="/contractor/invoices" className="text-sm text-violet-600 hover:underline">
                  View all &gt;
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Unpaid Invoices */}
              <div>
                <p className="text-xs font-bold text-gray-900 mb-3">UNPAID INVOICES (4)</p>
                <div className="space-y-3">
                  {invoicesData.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            INR {invoice.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">{invoice.company} • {invoice.type}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments Received */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-900">PAYMENTS RECEIVED (5)</p>
                  <Link href="/contractor/payments" className="text-xs text-violet-600 hover:underline">
                    View all &gt;
                  </Link>
                </div>
                <div className="space-y-2">
                  {paymentsReceivedData.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">INR {payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{payment.company}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Completion Alert & Contracts */}
        <div className="space-y-6">
          {/* Completion Alert */}
          <Card className="rounded-2xl shadow-sm bg-yellow-50 border-yellow-100">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Completion of timesheet</h3>
              <p className="text-sm text-gray-700 mb-4">
                Last date for completion of timesheet for ABC Corp. for the month of Apr/23 is 10/May/23.
              </p>
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                Update timesheet
              </Button>
            </CardContent>
          </Card>

          {/* Contracts */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>CONTRACTS</CardTitle>
                <Link href="/contractor/contracts" className="text-sm text-violet-600 hover:underline">
                  View all contracts &gt;
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {contractsData.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <Badge className={`${getContractBadgeColor(contract.type)} mb-2 font-semibold`}>
                      {contract.type}
                    </Badge>
                    <p className="text-sm font-medium text-gray-900">{contract.company}</p>
                    <p className="text-xs text-gray-600">{contract.role}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROW 3: Help & Support & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Help & Support */}
        <div>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-gray-50 rounded-lg transition">
                  <div className="p-4 rounded-full bg-gray-100">
                    <MessageSquare className="h-8 w-8 text-gray-700" />
                  </div>
                  <p className="font-medium text-gray-900">Knowledge repository</p>
                </div>
                <div className="p-6 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-gray-50 rounded-lg transition">
                  <div className="p-4 rounded-full bg-gray-100">
                    <MessageSquare className="h-8 w-8 text-gray-700" />
                  </div>
                  <p className="font-medium text-gray-900">Live chat</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                For any further assistance, please reach out to us via support@rapid.one
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Holidays */}
        <div>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming holidays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {holidaysData.map((holiday) => (
                  <Card
                    key={holiday.id}
                    className="rounded-2xl shadow-sm bg-teal-50 border-teal-100"
                  >
                    <CardContent className="p-6">
                      <p className="text-sm text-teal-700 font-medium">{holiday.date}</p>
                      <p className="text-lg font-bold text-teal-900 mt-2">{holiday.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Link
                href="/contractor/holidays"
                className="text-sm text-violet-600 hover:underline mt-4 block"
              >
                View holiday calendar &gt;
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition">
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
