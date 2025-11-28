'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, FileText, MessageSquare } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

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
  amber400: '#FBBF24',
  border: '#DEE4EB',
}

export default function SuperAdminDashboard() {
  // Donut chart data for clients by country
  const clientsByCountry = [
    { name: 'India', value: 10, color: colors.amber400 },
    { name: 'Canada', value: 6, color: colors.rose200 },
    { name: 'USA', value: 8, color: colors.secondaryBlue200 },
    { name: 'Germany', value: 5, color: colors.primary100 },
    { name: 'Poland', value: 3, color: colors.aqua300 },
  ]

  // Revenue data
  const revenueData = [
    { month: 'Nov', Revenue: 40, color: colors.aqua400 },
    { month: 'Dec', Revenue: 75, color: colors.secondaryBlue200 },
    { month: 'Jan', Revenue: 35, color: colors.green200 },
    { month: 'Feb', Revenue: 55, color: colors.amber400 },
    { month: 'Mar', Revenue: 20, color: colors.aqua300 },
    { month: 'Apr', Revenue: 65, color: colors.rose200 },
  ]

  // Invoice data for grouped bars
  const invoiceData = [
    { month: 'Nov', Raised: 50, Received: 30 },
    { month: 'Dec', Raised: 65, Received: 45 },
    { month: 'Jan', Raised: 45, Received: 35 },
    { month: 'Feb', Raised: 80, Received: 55 },
    { month: 'Mar', Raised: 60, Received: 40 },
    { month: 'Apr', Raised: 75, Received: 60 },
  ]

  const requests = [
    {
      id: 1,
      type: 'LEAVE',
      date: '23/May/2023 - 28/May/2023',
      name: 'Vidushi Maheshwari',
      role: 'Employee',
      bgColor: colors.warning200,
      textColor: colors.warning600,
    },
    {
      id: 2,
      type: 'EXPENSE',
      date: 'USD 5000',
      name: 'Prithviraj Singh Hada',
      role: 'Client',
      bgColor: colors.secondaryBlue50,
      textColor: colors.secondaryBlue600,
    },
    {
      id: 3,
      type: 'LEAVE',
      date: '02/Jun/2023 - 12/Jun/2023',
      name: 'Khushi Mathur',
      role: 'Employee',
      bgColor: colors.warning200,
      textColor: colors.warning600,
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
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: colors.neutral900 }}>Good morning Peter!</h2>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clients in Countries */}
          <Card className="rounded-2xl shadow-sm" style={{ borderColor: colors.border }}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold" style={{ color: colors.neutral900 }}>Clients in countries</CardTitle>
              <button
                className="text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: colors.primary500 }}
              >
                View <ChevronRight className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="w-52 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientsByCountry}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        cornerRadius={10}
                        dataKey="value"
                      >
                        {clientsByCountry.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold" fill={colors.neutral900}>
                        32
                      </text>
                      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-xs" fill={colors.neutral600}>
                        TOTAL CLIENTS
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 ml-8">
                  {clientsByCountry.map((country) => (
                    <div key={country.name} className="flex items-center gap-3 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: country.color }} />
                      <span className="font-medium" style={{ color: colors.neutral700 }}>{country.name}</span>
                      <ChevronRight className="h-3 w-3" style={{ color: colors.neutral400 }} />
                      <span className="font-bold text-base" style={{ color: country.color }}>{country.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Overview */}
          <Card className="rounded-2xl shadow-sm" style={{ borderColor: colors.border }}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold" style={{ color: colors.neutral900 }}>Revenue overview</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: colors.neutral600 }}>Last 6 months</span>
                <ChevronRight className="h-4 w-4" style={{ color: colors.neutral400 }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral50} />
                    <XAxis dataKey="month" stroke={colors.neutral500} />
                    <YAxis stroke={colors.neutral500} tickFormatter={(value) => `${value}L`} />
                    <Tooltip formatter={(value) => `${value}L`} />
                    <Bar dataKey="Revenue" radius={[50, 50, 50, 50]}>
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Requests */}
          <Card className="rounded-2xl shadow-sm" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold" style={{ color: colors.neutral900 }}>Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tabs */}
              <div className="flex gap-8 border-b pb-4 mb-6" style={{ borderColor: colors.border }}>
                <button
                  className="text-sm pb-3 font-medium hover:opacity-80 transition-opacity"
                  style={{ color: colors.neutral500 }}
                >
                  My requests (10)
                </button>
                <button
                  className="text-sm font-semibold pb-3 border-b-2"
                  style={{ color: colors.primary500, borderColor: colors.primary500 }}
                >
                  For your approval (6)
                </button>
              </div>

              {/* Request Items */}
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start justify-between p-4 rounded-xl hover:shadow-md transition-all duration-200"
                    style={{ borderColor: colors.border, borderWidth: 1 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
                          style={{ backgroundColor: req.bgColor, color: req.textColor }}
                        >
                          {req.type}
                        </span>
                        <span className="text-sm font-medium" style={{ color: colors.neutral600 }}>{req.date}</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: colors.neutral800 }}>{req.name}</p>
                      <p className="text-xs mt-1" style={{ color: colors.neutral500 }}>• {req.role}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="text-sm h-9 px-6 font-semibold hover:text-white transition-all duration-200"
                      style={{
                        borderColor: colors.primary500,
                        color: colors.primary500,
                      }}
                    >
                      Approve
                    </Button>
                  </div>
                ))}
              </div>

              <button
                className="w-full text-center text-sm font-semibold mt-6 hover:underline transition-colors"
                style={{ color: colors.primary500 }}
              >
                View all requests
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Updates */}
          <Card className="rounded-2xl shadow-sm" style={{ borderColor: colors.border }}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold" style={{ color: colors.neutral900 }}>Updates</CardTitle>
              <button
                className="text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: colors.primary500 }}
              >
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {updates.map((update, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5">
                      <div
                        className="h-2 w-2 rounded-full mt-1.5 ml-1.5 animate-pulse"
                        style={{ backgroundColor: colors.success600, boxShadow: `0 0 8px ${colors.success600}` }}
                      />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: colors.neutral700 }}>{update}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Overview */}
          <Card className="rounded-2xl shadow-sm" style={{ borderColor: colors.border }}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold" style={{ color: colors.neutral900 }}>Invoice Overview</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: colors.neutral600 }}>Last 6 months</span>
                <ChevronRight className="h-4 w-4" style={{ color: colors.neutral400 }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={invoiceData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral50} />
                    <XAxis dataKey="month" stroke={colors.neutral500} />
                    <YAxis stroke={colors.neutral500} tickFormatter={(value) => `${value}L`} />
                    <Tooltip formatter={(value) => `${value}L`} />
                    <Bar dataKey="Raised" fill={colors.amber400} radius={[50, 50, 50, 50]} />
                    <Bar dataKey="Received" fill={colors.secondaryBlue200} radius={[50, 50, 50, 50]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.amber400 }} />
                  <span className="font-medium" style={{ color: colors.neutral600 }}>Total amount of invoices raised</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.secondaryBlue200 }} />
                  <span className="font-medium" style={{ color: colors.neutral600 }}>Total amount received</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="rounded-2xl shadow-sm" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold" style={{ color: colors.neutral900 }}>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-colors"
                  style={{ backgroundColor: colors.neutral50 }}
                >
                  <FileText className="h-7 w-7" style={{ color: colors.iconBlue }} />
                  <span className="text-xs font-semibold text-center leading-tight" style={{ color: colors.neutral800 }}>Knowledge repository</span>
                  <ChevronRight className="h-3 w-3 mt-1" style={{ color: colors.iconBlue }} />
                </button>
                <button
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-colors"
                  style={{ backgroundColor: colors.neutral50 }}
                >
                  <MessageSquare className="h-7 w-7" style={{ color: colors.iconBlue }} />
                  <span className="text-xs font-semibold text-center leading-tight" style={{ color: colors.neutral800 }}>Live chat</span>
                  <ChevronRight className="h-3 w-3 mt-1" style={{ color: colors.iconBlue }} />
                </button>
              </div>
              <p className="text-xs text-center leading-relaxed pt-2" style={{ color: colors.neutral600 }}>
                For any further assistance, please reach out to us via{' '}
                <a
                  href="mailto:support@rapid.one"
                  className="font-semibold hover:underline"
                  style={{ color: colors.primary500 }}
                >
                  support@rapid.one
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Holidays */}
          <Card className="rounded-2xl shadow-sm" style={{ borderColor: colors.border }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold" style={{ color: colors.neutral900 }}>Upcoming holidays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {holidays.map((holiday, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.neutral50 }}
                >
                  <p className="text-sm font-semibold" style={{ color: colors.neutral900 }}>{holiday.date}</p>
                  <p className="text-xs uppercase tracking-wide mt-1" style={{ color: colors.neutral500 }}>{holiday.name}</p>
                </div>
              ))}
              <button
                className="w-full text-center text-sm font-semibold mt-4 hover:underline transition-colors flex items-center justify-center gap-1"
                style={{ color: colors.primary500 }}
              >
                View holiday calendar <ChevronRight className="h-3 w-3" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
