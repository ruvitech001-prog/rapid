'use client'

import Link from 'next/link'
import {
  Bell,
  ChevronRight,
  HelpCircle,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function EmployeeDashboard() {
  const userName = 'Navin'

  // Leaves data
  const leavesData = {
    totalDays: 20,
    taken: 14,
    available: 6,
    leaves: [
      { type: 'Casual', available: 2 },
      { type: 'Sick', available: 2 },
    ],
  }

  // Requests for approval
  const approvalRequests = [
    {
      id: 1,
      type: 'LEAVE',
      dateRange: '21/Oct/2022 - 22/Nov/2023',
      description: 'Vidushi Maheshwari • Employee',
    },
    {
      id: 2,
      type: 'EXPENSE',
      amount: 'INR 5000',
      description: 'Vidushi Maheshwari • Employee',
    },
    {
      id: 3,
      type: 'LEAVE',
      dateRange: '21/Oct/2022 - 22/Nov/2023',
      description: 'Vidushi Maheshwari • Contractor',
    },
  ]

  const updates = [
    { id: 1, text: 'Time-off request for 23 Nov 22 has been approved.' },
    { id: 2, text: 'Time-off request for 23 Nov 22 has been approved.' },
  ]

  const holidays = [
    { date: 'Sat, 14/Jan/2023', name: 'MAKAR SANKRANTI' },
    { date: 'Wed, 26/Jan/2023', name: 'REPUBLIC DAY' },
  ]

  const getRequestBadgeColor = (type: string) => {
    if (type === 'LEAVE') return 'bg-orange-100 text-orange-800'
    if (type === 'EXPENSE') return 'bg-blue-100 text-blue-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hi {userName}!</h1>
          <Button variant="outline" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Leaves Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Leaves summary</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Donut Chart Area */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Available (red) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="12"
                        strokeDasharray={`${(leavesData.available / leavesData.totalDays) * 251.2} 251.2`}
                        transform="rotate(-90 50 50)"
                      />
                      {/* Taken (teal) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="12"
                        strokeDasharray={`${(leavesData.taken / leavesData.totalDays) * 251.2} 251.2`}
                        strokeDashoffset={-((leavesData.available / leavesData.totalDays) * 251.2)}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-gray-900">20</p>
                      <p className="text-xs text-gray-600">TOTAL DAYS</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                      <span className="text-gray-700">Leaves taken: 14</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Leaves available: 6</span>
                    </div>
                  </div>
                </div>

                {/* Available Leaves */}
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700">Available leaves</p>
                  {leavesData.leaves.map((leave) => (
                    <div key={leave.type} className="space-y-1">
                      <p className="text-sm text-gray-600">{leave.type}</p>
                      <p className="text-2xl font-semibold text-gray-900">{leave.available}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Requests Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex gap-8 border-b border-gray-200">
                  <button className="text-gray-500 pb-4 relative">
                    My requests (10)
                  </button>
                  <button className="text-blue-600 pb-4 font-medium border-b-2 border-blue-600">
                    For your approval (6)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {approvalRequests.map((request) => (
                  <div key={request.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Badge className={`${getRequestBadgeColor(request.type)} font-semibold`}>
                        {request.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-gray-900">
                          {request.type === 'EXPENSE' ? request.amount : request.dateRange}
                        </p>
                        <p className="text-sm text-gray-600">{request.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4">
                      Approve
                    </Button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-2 text-blue-600 font-medium hover:bg-gray-50 rounded">
                View all requests
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Updates */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Updates</h3>
                <Link href="#" className="text-blue-600 text-sm font-medium flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {updates.map((update) => (
                  <div key={update.id} className="flex gap-3">
                    <Bell className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-700">{update.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Declaration */}
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tax declaration</h3>
              <p className="text-sm text-gray-700 mb-4">
                Last date for tax declaration is pending, last date to submit is 26/Feb/23.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Upload declarations
              </Button>
            </div>

            {/* Health Insurance */}
            <div className="bg-pink-50 rounded-lg border border-pink-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Health insurance</h3>
              <p className="text-sm text-gray-700 mb-4">
                Hi {userName}, you're eligible for health insurance.
              </p>
              <Button variant="outline" className="w-full">
                View and update details
              </Button>
            </div>

            {/* Welcome Kit */}
            <div className="bg-cyan-50 rounded-lg border border-cyan-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Welcome Kit</h3>
              <p className="text-sm text-gray-700 mb-4">
                Hi {userName}, you're eligible for our welcome kit.
              </p>
              <Button variant="outline" className="w-full">
                View and update details
              </Button>
            </div>

            {/* Upcoming Holidays */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming holidays</h3>
              <div className="space-y-4">
                {holidays.map((holiday, idx) => (
                  <div key={idx} className="pb-4 last:pb-0 border-b last:border-0">
                    <p className="text-sm text-gray-600">{holiday.date}</p>
                    <p className="text-sm font-medium text-gray-900">{holiday.name}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-blue-600 text-sm font-medium hover:bg-gray-50 rounded">
                View holiday calendar <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded hover:bg-gray-50">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Knowledge repository</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded hover:bg-gray-50">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Live chat</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                For any further assistance, please reach out to us via support@rapid.one
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
