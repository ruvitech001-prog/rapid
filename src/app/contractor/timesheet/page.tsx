'use client'

import { useState } from 'react'
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

// Mock Data
const mockTimesheetEntries = [
  {
    id: '1',
    client: 'Aditya Birla Group',
    project: 'Project A',
    date: '01/June/2023',
    dayOfWeek: 'Mon',
    hours: 6,
    status: 'approved' as const,
  },
  {
    id: '2',
    client: 'Aditya Birla Group',
    project: 'Project B',
    date: '02/June/2023',
    dayOfWeek: 'Tue',
    hours: 7,
    status: 'approved' as const,
  },
  {
    id: '3',
    client: 'Aditya Birla Group',
    project: 'Project C',
    date: '03/June/2023',
    dayOfWeek: 'Wed',
    hours: 5,
    status: 'rejected' as const,
  },
  {
    id: '4',
    client: 'Aditya Birla Group',
    project: 'Project D',
    date: '04/June/2023',
    dayOfWeek: 'Thu',
    hours: 8,
    status: 'approved' as const,
  },
  {
    id: '5',
    client: 'Aditya Birla Group',
    project: 'Project E',
    date: '05/June/2023',
    dayOfWeek: 'Fri',
    hours: 6,
    status: 'approved' as const,
  },
  {
    id: '6',
    client: 'Aditya Birla Group',
    project: 'Project F',
    date: '06/June/2023',
    dayOfWeek: 'Sat',
    hours: 8,
    status: 'in_review' as const,
  },
  {
    id: '7',
    client: 'XYZ Corp',
    project: 'Project X',
    date: '07/June/2023',
    dayOfWeek: 'Sun',
    hours: 4,
    status: 'approved' as const,
  },
]

const clients = ['Aditya Birla Group', 'XYZ Corp', 'ABC Company']

export default function TimesheetPage() {
  const [activeTab, setActiveTab] = useState<'hourly' | 'milestone'>('hourly')
  const [selectedClient, setSelectedClient] = useState('Aditya Birla Group')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showAddTime, setShowAddTime] = useState(false)

  // Filter entries
  const filteredEntries = mockTimesheetEntries.filter((entry) => {
    const matchesClient = entry.client === selectedClient
    const matchesSearch =
      entry.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.date.includes(searchTerm)
    const matchesStatus = !statusFilter || entry.status === statusFilter

    return matchesClient && matchesSearch && matchesStatus
  })

  // Group by client and count statuses
  const groupedByClient = mockTimesheetEntries.reduce(
    (acc, entry) => {
      if (!acc[entry.client]) {
        acc[entry.client] = []
      }
      acc[entry.client].push(entry)
      return acc
    },
    {} as Record<string, typeof mockTimesheetEntries>,
  )

  const statusCounts = {
    approved: mockTimesheetEntries.filter((e) => e.status === 'approved').length,
    in_review: mockTimesheetEntries.filter((e) => e.status === 'in_review').length,
    rejected: mockTimesheetEntries.filter((e) => e.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Timesheet</h1>
          <p className="mt-1 text-sm text-gray-500">Track your work hours and submissions</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'hourly' | 'milestone')}>
        <TabsList className="grid w-48 grid-cols-2">
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="milestone">Milestone</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Client Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Client:</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-primary focus:outline-none"
            >
              {clients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Filters:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setStatusFilter(statusFilter === 'approved' ? null : 'approved')
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'approved'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Approved ({statusCounts.approved})
                  </button>
                  <button
                    onClick={() =>
                      setStatusFilter(statusFilter === 'in_review' ? null : 'in_review')
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'in_review'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    In review ({statusCounts.in_review})
                  </button>
                  <button
                    onClick={() =>
                      setStatusFilter(statusFilter === 'rejected' ? null : 'rejected')
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Rejected ({statusCounts.rejected})
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timesheet Table */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Timesheet Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">
                        Date & Day
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">
                        Hours Worked
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-gray-900 text-xs uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          <div className="font-medium">{entry.date}</div>
                          <div className="text-xs text-gray-500">{entry.dayOfWeek}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{entry.project}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {entry.hours} hours
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`${
                              entry.status === 'approved'
                                ? 'bg-teal-100 text-teal-800'
                                : entry.status === 'in_review'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {entry.status === 'approved'
                              ? 'Approved'
                              : entry.status === 'in_review'
                                ? 'In Review'
                                : 'Rejected'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-primary hover:underline cursor-pointer">
                          View details
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEntries.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No timesheet entries found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Load More Button */}
          {filteredEntries.length > 0 && (
            <div className="text-center">
              <button className="text-primary hover:underline font-medium text-sm">
                Load more
              </button>
            </div>
          )}

          {/* Client Sections */}
          <div className="space-y-3">
            {Object.entries(groupedByClient).map(([client, entries]) => (
              <Card key={client} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client}</h3>
                    <p className="text-sm text-gray-500">{entries.length} entries</p>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Time Button - Floating */}
      <div className="fixed bottom-8 right-8">
        <Button
          onClick={() => setShowAddTime(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
