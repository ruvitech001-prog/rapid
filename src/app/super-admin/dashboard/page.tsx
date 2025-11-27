'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, Eye, FileText, MessageSquare, Calendar } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Colorful Bar Chart Component using Recharts - Pill Style
function ColorfulBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    color: item.color,
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} label={{ value: 'Amount (in INR)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
          formatter={(value) => `${value}L`}
        />
        <Bar dataKey="value" fill="#60a5fa" radius={[20, 20, 20, 20]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// Grouped Bar Chart for Invoice Overview - Pill Style
function GroupedBarChart({ data }: { data: { label: string; raised: number; received: number }[] }) {
  const chartData = data.map((item) => ({
    name: item.label,
    raised: item.raised,
    received: item.received,
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} label={{ value: 'Amount (in INR)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
          formatter={(value) => `${value}L`}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar dataKey="raised" fill="#fbbf24" radius={[20, 20, 20, 20]} />
        <Bar dataKey="received" fill="#60a5fa" radius={[20, 20, 20, 20]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Donut Chart Component using Recharts
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    color: item.color,
  }))

  return (
    <div className="space-y-4">
      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="30%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text - positioned absolutely */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-center">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">total clients</div>
        </div>
      </div>

      {/* Legend - inline with arrows and values */}
      <div className="grid grid-cols-5 gap-2 px-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.label}</span>
            <span className="text-gray-400">›</span>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SuperAdminDashboard() {
  const clientsByCountry = [
    { label: 'India', value: 10, color: '#fbbf24' },
    { label: 'Canada', value: 6, color: '#f87171' },
    { label: 'USA', value: 8, color: '#60a5fa' },
    { label: 'Germany', value: 5, color: '#34d399' },
    { label: 'Poland', value: 3, color: '#22d3ee' },
  ]

  const revenueData = [
    { label: 'Nov', value: 40, color: '#60a5fa' },
    { label: 'Dec', value: 75, color: '#60a5fa' },
    { label: 'Jan', value: 35, color: '#34d399' },
    { label: 'Feb', value: 55, color: '#fbbf24' },
    { label: 'Mar', value: 20, color: '#22d3ee' },
    { label: 'Apr', value: 65, color: '#f87171' },
  ]

  const invoiceData = [
    { label: 'Nov', raised: 50, received: 30 },
    { label: 'Dec', raised: 65, received: 45 },
    { label: 'Jan', raised: 45, received: 35 },
    { label: 'Feb', raised: 80, received: 55 },
    { label: 'Mar', raised: 60, received: 40 },
    { label: 'Apr', raised: 75, received: 60 },
  ]

  const requests = [
    {
      id: 1,
      type: 'LEAVE',
      date: '23/May/2023 - 28/May/2023',
      name: 'Vidushi Maheshwari',
      role: 'Employee',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      id: 2,
      type: 'EXPENSE',
      date: 'USD 5000',
      name: 'Prithviraj Singh Hada',
      role: 'Client',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 3,
      type: 'LEAVE',
      date: '02/Jun/2023 - 12/Jun/2023',
      name: 'Khushi Mathur',
      role: 'Employee',
      color: 'bg-amber-100 text-amber-700',
    },
  ]

  const updates = [
    'ServiceNow has been onboarded successfully.',
    'ServiceNow has been onboarded successfully.',
    'ServiceNow has been onboarded successfully.',
    'ServiceNow has been onboarded successfully.',
    'Payment of INR 50,000 received from Agro Tech.',
  ]

  const holidays = [
    { date: 'Tue, 15/Aug/2023', name: 'INDEPENDENCE DAY' },
    { date: 'Wed, 30/Aug/2023', name: 'RAKSHABANDHAN' },
  ]

  return (
    <div className="space-y-6 bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">Good morning Peter!</h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clients in Countries */}
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Clients in countries</CardTitle>
              <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                View <ChevronRight className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <DonutChart data={clientsByCountry} />
            </CardContent>
          </Card>

          {/* Revenue Overview */}
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Revenue overview</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Last 6 months</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <ColorfulBarChart data={revenueData} />
            </CardContent>
          </Card>

          {/* Requests */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tabs */}
              <div className="flex gap-8 border-b border-gray-200 pb-4 mb-4">
                <button className="text-sm text-gray-500 pb-3">My requests (10)</button>
                <button className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-3">
                  For your approval (6)
                </button>
              </div>

              {/* Request Items */}
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${req.color}`}>
                          {req.type}
                        </span>
                        <span className="text-sm text-gray-600">{req.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{req.name}</p>
                      <p className="text-xs text-gray-500">{req.role}</p>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-8 px-4"
                    >
                      Approve
                    </Button>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-blue-600 text-sm font-medium mt-4 hover:underline">
                View all requests
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Updates */}
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Updates</CardTitle>
              <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {updates.map((update, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 ml-1.5" />
                    </div>
                    <p className="text-sm text-gray-700">{update}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Overview */}
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Invoice Overview</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Last 6 months</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <GroupedBarChart data={invoiceData} />
              <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-yellow-400" />
                  <span className="text-gray-600">Total amount of invoices raised</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-blue-400" />
                  <span className="text-gray-600">Total amount recieved</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="border border-blue-300 bg-blue-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-gray-900">Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-blue-100 rounded-lg transition-colors">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span className="text-xs font-medium text-gray-900">Knowledge repository</span>
                  <ChevronRight className="h-3 w-3 text-blue-600 ml-auto" />
                </button>
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-blue-100 rounded-lg transition-colors">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <span className="text-xs font-medium text-gray-900">Live chat</span>
                  <ChevronRight className="h-3 w-3 text-blue-600 ml-auto" />
                </button>
              </div>
              <p className="text-xs text-gray-600 text-center">
                For any further assistance, please reach out to us via <a href="mailto:support@rapid.one" className="text-blue-600 hover:underline">support@rapid.one</a>
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Holidays */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Upcoming holidays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {holidays.map((holiday, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium text-gray-900">{holiday.date}</p>
                  <p className="text-xs text-gray-500 uppercase">{holiday.name}</p>
                </div>
              ))}
              <button className="w-full text-center text-blue-600 text-sm font-medium mt-4 hover:underline">
                View holiday calendar <ChevronRight className="h-3 w-3 inline" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
