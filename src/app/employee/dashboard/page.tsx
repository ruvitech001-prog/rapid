'use client'

import { CSSProperties, useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
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

// Leaves data for donut chart
const leaveChartData = [
  { name: 'Taken', value: 14, fill: '#2DD4BF' },
  { name: 'Available', value: 6, fill: '#FF7373' },
]

// Payroll data - last 6 months
const payrollData = [
  { month: 'Nov', amount: 45000 },
  { month: 'Dec', amount: 48000 },
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 50000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 45000 },
]

const payrollColors = ['#7DD3FC', '#60A5FA', '#6EE7B7', '#FCD34D', '#2DD4BF', '#F472B6']

// Requests data
const requestsData = [
  {
    id: '1',
    type: 'LEAVE',
    typeColor: 'bg-amber-100 text-amber-800',
    label: '23/May - 28/May',
    description: 'Personal Leave',
  },
  {
    id: '2',
    type: 'EXPENSE',
    typeColor: 'bg-blue-100 text-blue-800',
    label: 'INR 5000',
    description: 'Travel Expense',
  },
  {
    id: '3',
    type: 'LEAVE',
    typeColor: 'bg-amber-100 text-amber-800',
    label: '02/Jun - 12/Jun',
    description: 'Vacation',
  },
]

// Updates data
const updatesData = [
  {
    id: '1',
    message: 'Time-off request for 23 Nov 22 has been approved.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    message: 'Expense request for 15 Nov 22 has been approved.',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    message: 'Payroll for November has been processed.',
    timestamp: '2 days ago',
  },
]

// Holidays data
const holidaysData = [
  { id: '1', date: 'Sat, 14/Jan/2023', name: 'MAKAR SANKRANTI' },
  { id: '2', date: 'Wed, 26/Jan/2023', name: 'REPUBLIC DAY' },
]

export default function EmployeeDashboard() {
  const [activeRequestsTab, setActiveRequestsTab] = useState('pending')
  const userName = 'Navin'

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Hi {userName}!</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="text-violet-700 border-violet-700">
            <Link href="/employee/requests/new">+ New request</Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>

      {/* ROW 1: Leave Balance & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Leave Balance */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border-0 h-full bg-[#EBF5FF]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Leave balance</CardTitle>
                <Link
                  href="/employee/leaves"
                  className="text-sm font-medium text-[#586AF5] hover:underline flex items-center gap-1"
                >
                  Apply <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <div className="flex flex-col sm:flex-row">
                {/* Left: Donut Chart */}
                <div className="flex-1 sm:pr-8 sm:border-r border-[#DEE4EB]">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={leaveChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
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
                      <p className="text-4xl font-bold text-gray-900">20</p>
                      <p className="text-[10px] text-[#8593A3] tracking-wider font-medium">
                        TOTAL DAYS
                      </p>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex justify-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]"></div>
                      <span className="text-[#8593A3]">Taken: 14</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF7373]"></div>
                      <span className="text-[#8593A3]">Available: 6</span>
                    </div>
                  </div>
                </div>

                {/* Right: Leave Breakdown */}
                <div className="flex-1 sm:pl-8 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-[#DEE4EB]">
                  <p className="text-[11px] font-semibold text-[#8593A3] mb-5 tracking-wider">
                    AVAILABLE LEAVES
                  </p>
                  <div>
                    <div className="flex items-center justify-between py-4 border-b border-[#DEE4EB]">
                      <span className="text-sm text-gray-700">Casual Leave</span>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">2</span>
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                          <ChevronRight className="h-4 w-4 text-[#8593A3]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <span className="text-sm text-gray-700">Sick Leave</span>
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
                <Link
                  href="/employee/updates"
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

      {/* ROW 2: Requests & Payroll | Compensation & Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Requests & Payroll */}
        <div className="space-y-6">
          {/* Requests */}
          <Card className="rounded-2xl shadow-sm">
            <Tabs value={activeRequestsTab} onValueChange={setActiveRequestsTab}>
              <CardHeader className="pb-3">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pending">Pending (3)</TabsTrigger>
                  <TabsTrigger value="approved">Approved (8)</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="pending" className="space-y-3 mt-0">
                  {requestsData.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <Badge className={`${request.typeColor} mb-2`}>{request.type}</Badge>
                        <p className="text-sm font-medium text-gray-900">{request.label}</p>
                        <p className="text-xs text-gray-600">{request.description}</p>
                      </div>
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700 ml-2">
                        View
                      </Button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="approved" className="space-y-3 mt-0">
                  <p className="text-sm text-gray-600 text-center py-4">Viewing approved requests</p>
                </TabsContent>

                <Button variant="outline" className="w-full mt-4 text-violet-600 border-violet-600">
                  View all requests
                </Button>
              </CardContent>
            </Tabs>
          </Card>

          {/* Payroll */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payroll</CardTitle>
                <Button variant="outline" size="sm">
                  Last 6 months
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Bar dataKey="amount" radius={[10, 10, 10, 10]} style={{ width: '100px' } as CSSProperties}>
                    {payrollData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={payrollColors[index]} />
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
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Net Pay (Last)</p>
                    <p className="text-2xl font-bold text-gray-900">₹45,000</p>
                    <p className="text-xs text-gray-500 mt-2">April 2024</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-violet-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Attendance</p>
                    <p className="text-2xl font-bold text-gray-900">94%</p>
                    <p className="text-xs text-gray-500 mt-2">This month</p>
                  </div>
                  <Calendar className="h-8 w-8 text-violet-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Leaves Taken</p>
                    <p className="text-2xl font-bold text-gray-900">14</p>
                    <p className="text-xs text-gray-500 mt-2">Out of 20</p>
                  </div>
                  <Clock className="h-8 w-8 text-violet-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-xs text-gray-500 mt-2">Requests</p>
                  </div>
                  <Bell className="h-8 w-8 text-violet-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Eligibility Cards */}
          <div className="space-y-4">
            {/* Tax Declaration */}
            <Card className="rounded-2xl shadow-sm bg-yellow-50 border-yellow-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Tax declaration</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Last date for tax declaration is 26/Feb/23.
                </p>
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                  Upload declarations
                </Button>
              </CardContent>
            </Card>

            {/* Health Insurance */}
            <Card className="rounded-2xl shadow-sm bg-pink-50 border-pink-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Health insurance</h3>
                <p className="text-sm text-gray-700 mb-4">
                  You're eligible for our comprehensive health insurance.
                </p>
                <Button variant="outline" className="w-full">
                  View details
                </Button>
              </CardContent>
            </Card>

            {/* Welcome Kit */}
            <Card className="rounded-2xl shadow-sm bg-cyan-50 border-cyan-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Welcome kit</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Get your company swag and welcome package.
                </p>
                <Button variant="outline" className="w-full">
                  View details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ROW 3: Help & Support & Holidays */}
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
            <Link
              href="/employee/holidays"
              className="text-sm text-violet-600 hover:underline"
            >
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
