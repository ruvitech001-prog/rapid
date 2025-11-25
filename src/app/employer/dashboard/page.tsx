'use client'

import { CSSProperties, useState } from 'react'
import {
  Bell,
  ChevronRight,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

// Data for Team Overview (Semi-circle gauge)
const teamData = [
  { name: 'Employees', value: 14, fill: '#2DD4BF' },
  { name: 'Contractors', value: 6, fill: '#FF7373' },
]

// Data for Cost Overview (Bar Chart)
const costData = [
  { month: 'Nov', cost: 45000 },
  { month: 'Dec', cost: 65000 },
  { month: 'Jan', cost: 72000 },
  { month: 'Feb', cost: 58000 },
  { month: 'Mar', cost: 81000 },
  { month: 'Apr', cost: 92000 },
]

const costColors = ['#7DD3FC', '#60A5FA', '#6EE7B7', '#FCD34D', '#2DD4BF', '#F472B6']

// Data for Contract Summary (Donut Chart)
const contractData = [
  { name: 'Accepted', value: 25, fill: '#2DD4BF' },
  { name: 'In progress', value: 10, fill: '#F472B6' },
  { name: 'Rejected', value: 15, fill: '#FBBF24' },
]

// Updates data
const updatesData = [
  {
    id: '1',
    message: 'Time-off request for 16/May/2023 has been approved.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    message: 'Expense request for 12/May/23 has been approved.',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    message: 'Time-off request for 25/May/23 has been approved.',
    timestamp: '1 day ago',
  },
]

// Invoices data
const invoicesData = [
  {
    id: '1',
    amount: 90000,
    contractor: 'Alex George',
    title: 'Contractor, India',
  },
  {
    id: '2',
    amount: 75000,
    contractor: 'Sarah Johnson',
    title: 'Contractor, USA',
  },
]

const recentlyPaidData = [
  { id: '1', amount: 6000, contractor: 'John Doe' },
  { id: '2', amount: 8500, contractor: 'Jane Smith' },
  { id: '3', amount: 5200, contractor: 'Mike Wilson' },
]

// Requests data
const requestsForApproval = [
  {
    id: '1',
    type: 'LEAVE',
    typeColor: 'bg-amber-100 text-amber-800',
    label: '23/May - 28/May',
    user: 'Vidushi Patel',
  },
  {
    id: '2',
    type: 'EXPENSE',
    typeColor: 'bg-blue-100 text-blue-800',
    label: 'USD 5000',
    user: 'Prithviraj Kumar',
  },
  {
    id: '3',
    type: 'LEAVE',
    typeColor: 'bg-amber-100 text-amber-800',
    label: '02/Jun - 12/Jun',
    user: 'Khushi Sharma',
  },
]

// Contracts data
const recentContractsData = [
  { id: '1', name: 'Sarah Johnson', role: 'Senior Developer' },
  { id: '2', name: 'Mike Chen', role: 'Product Manager' },
  { id: '3', name: 'Lisa Rodriguez', role: 'Designer' },
]

// Holidays data
const holidaysData = [
  { id: '1', date: 'Tue, 15/Aug/2023', name: 'INDEPENDENCE DAY' },
  { id: '2', date: 'Wed, 30/Aug/2023', name: 'RAKSHABANDHAN' },
]

export default function EmployerDashboard() {
  const [activeRequestsTab, setActiveRequestsTab] = useState('approval')

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Good morning Peter!</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="text-violet-700 border-violet-700">
            <Link href="/employer/requests/new">+ Create request</Link>
          </Button>
          <Button asChild className="bg-violet-600 text-white hover:bg-violet-700">
            <Link href="/employer/employees/new">Hire another</Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>

      {/* ROW 1: Team Overview & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Team Overview */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border-0 h-full bg-[#EBF5FF]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Team</CardTitle>
                <Link href="/employer/employees" className="text-sm font-medium text-[#586AF5] hover:underline flex items-center gap-1">
                  View <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <div className="flex flex-col sm:flex-row">
                {/* Left: Semi-circle Gauge */}
                <div className="flex-1 sm:pr-8 sm:border-r border-[#DEE4EB]">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={teamData}
                          cx="50%"
                          cy="100%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {teamData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered text inside gauge */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                      <p className="text-4xl font-bold text-gray-900">20</p>
                      <p className="text-[10px] text-[#8593A3] tracking-wider font-medium">TOTAL DAYS</p>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]"></div>
                      <span className="text-[#8593A3]">Employees: 14</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF7373]"></div>
                      <span className="text-[#8593A3]">Contractors: 6</span>
                    </div>
                  </div>
                </div>

                {/* Right: Joining This Month */}
                <div className="flex-1 sm:pl-8 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-[#DEE4EB]">
                  <p className="text-[11px] font-semibold text-[#8593A3] mb-5 tracking-wider">JOINING THIS MONTH</p>
                  <div>
                    <div className="flex items-center justify-between py-4 border-b border-[#DEE4EB]">
                      <span className="text-sm text-gray-700">Employees</span>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">2</span>
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                          <ChevronRight className="h-4 w-4 text-[#8593A3]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <span className="text-sm text-gray-700">Contractors</span>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">2</span>
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                          <ChevronRight className="h-4 w-4 text-[#8593A3]" />
                        </div>
                      </div>
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
                <Link href="/employer/updates" className="text-sm font-medium text-[#586AF5] hover:underline flex items-center gap-1">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 pb-6">
              {updatesData.map((update) => (
                <div
                  key={update.id}
                  className="flex gap-3 py-3 px-2 rounded-lg hover:bg-gray-50 transition"
                >
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

      {/* ROW 2: Invoices & Cost Overview | Requests & Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Invoices & Cost Overview */}
        <div className="space-y-6">
          {/* Invoices */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>PENDING INVOICES (4)</CardTitle>
                <Link href="/employer/invoices" className="text-sm text-violet-600 hover:underline">
                  View all &gt;
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pending Invoices Cards */}
              {invoicesData.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">USD {invoice.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{invoice.contractor} • {invoice.title}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-violet-600 border-violet-600 hover:bg-violet-50"
                  >
                    Pay now
                  </Button>
                </div>
              ))}

              {/* Recently Paid Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-900">RECENTLY PAID INVOICES (5)</p>
                  <Link href="/employer/invoices/paid" className="text-xs text-violet-600 hover:underline">
                    View all &gt;
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentlyPaidData.map((paid) => (
                    <div
                      key={paid.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">USD {paid.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{paid.contractor}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Overview */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cost overview</CardTitle>
                <Button variant="outline" size="sm">
                  Last 6 months
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" radius={[10, 10, 10, 10]} style={{ width: '100px' } as CSSProperties}>
                        {costData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={costColors[index]} />
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
          <Card className="rounded-2xl shadow-sm">
            <Tabs value={activeRequestsTab} onValueChange={setActiveRequestsTab}>
              <CardHeader className="pb-3">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="yours">Your requests (10)</TabsTrigger>
                  <TabsTrigger value="approval">For your approval (6)</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="approval" className="space-y-3 mt-0">
                  {requestsForApproval.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <Badge className={`${request.typeColor} mb-2`}>
                          {request.type}
                        </Badge>
                        <p className="text-sm font-medium text-gray-900">{request.label}</p>
                        <p className="text-xs text-gray-600">{request.user}</p>
                      </div>
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                        Approve
                      </Button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="yours" className="space-y-3 mt-0">
                  <p className="text-sm text-gray-600 text-center py-4">No requests yet</p>
                </TabsContent>

                <Button variant="outline" className="w-full mt-4 text-violet-600 border-violet-600">
                  View all requests
                </Button>
              </CardContent>
            </Tabs>
          </Card>

          {/* Contract Summary */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contract summary</CardTitle>
                <Button variant="outline" size="sm">
                  Last 6 months
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={contractData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {contractData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-gray-900">50</p>
                <p className="text-sm text-gray-600">Contracts rolled out</p>
              </div>

              <div className="flex justify-center gap-4 mb-4 text-sm">
                {contractData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    ></div>
                    <span className="text-gray-700">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-900">RECENT CONTRACTS (8)</p>
                  <Link href="/employer/contracts" className="text-xs text-violet-600 hover:underline">
                    View all &gt;
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentContractsData.map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contract.name}</p>
                        <p className="text-xs text-gray-600">{contract.role}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROW 3: Help & Support & Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Help & Support */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4 h-full">
              <div className="p-4 rounded-full bg-gray-100">
                <MessageSquare className="h-8 w-8 text-gray-700" />
              </div>
              <p className="font-medium text-gray-900 text-center">Knowledge repository</p>
              <ArrowRight className="h-5 w-5 text-violet-600" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4 h-full">
              <div className="p-4 rounded-full bg-gray-100">
                <MessageSquare className="h-8 w-8 text-gray-700" />
              </div>
              <p className="font-medium text-gray-900 text-center">Live chat</p>
              <ArrowRight className="h-5 w-5 text-violet-600" />
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Holidays */}
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
          <div className="col-span-2">
            <Link href="/employer/holidays" className="text-sm text-violet-600 hover:underline">
              View holiday calendar &gt;
            </Link>
          </div>
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
