'use client'

import { useState } from 'react'
import {
  Search,
  Clock,
  ChevronDown,
  Plus,
  Edit2,
  Calendar,
  ChevronUp,
} from 'lucide-react'
import { CardContent as _CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input as _Input } from '@/components/ui/input'
import { AddTimeModal } from '@/components/timesheet'
import { RejectionReasonModal } from '@/components/timesheet'

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
    description: 'Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever..',
  },
  {
    id: '2',
    client: 'Aditya Birla Group',
    project: 'Project B',
    date: '02/June/2023',
    dayOfWeek: 'Tue',
    hours: 7,
    status: 'approved' as const,
    description: 'Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.',
  },
  {
    id: '3',
    client: 'Aditya Birla Group',
    project: 'Project C',
    date: '03/June/2023',
    dayOfWeek: 'Wed',
    hours: 5,
    status: 'rejected' as const,
    description: 'Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.',
    rejectionReason: 'The submitted hours do not match the project requirements. Please verify your time tracking and resubmit.',
  },
  {
    id: '4',
    client: 'Aditya Birla Group',
    project: 'Project D',
    date: '04/June/2023',
    dayOfWeek: 'Thu',
    hours: 8,
    status: 'approved' as const,
    description: 'Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.',
  },
  {
    id: '5',
    client: 'Aditya Birla Group',
    project: 'Project E',
    date: '05/June/2023',
    dayOfWeek: 'Fri',
    hours: 6,
    status: 'approved' as const,
    description: 'Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.',
  },
  {
    id: '6',
    client: 'Aditya Birla Group',
    project: 'Project F',
    date: '06/June/2023',
    dayOfWeek: 'Sat',
    hours: 8,
    status: 'in_review' as const,
    description: 'Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.',
  },
  {
    id: '7',
    client: 'XYZ Corp',
    project: 'Project X',
    date: '07/June/2023',
    dayOfWeek: 'Sun',
    hours: 4,
    status: 'approved' as const,
    description: 'Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.',
  },
]

const clients = ['Aditya Birla Group', 'XYZ Corp', 'ABC Company']

export default function TimesheetPage() {
  const [activeTab, setActiveTab] = useState<'hourly' | 'milestone'>('hourly')
  const [selectedClient, setSelectedClient] = useState('Aditya Birla Group')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showAddTime, setShowAddTime] = useState(false)
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily')
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    'Project A': true,
  })
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean
    reason: string
  }>({ isOpen: false, reason: '' })

  // Filter entries by client
  const clientEntries = mockTimesheetEntries.filter((entry) => entry.client === selectedClient)

  // Group by project
  const groupedByProject = clientEntries.reduce(
    (acc, entry) => {
      if (!acc[entry.project]) {
        acc[entry.project] = []
      }
      acc[entry.project]!.push(entry)
      return acc
    },
    {} as Record<string, typeof mockTimesheetEntries>,
  )

  // Filter entries for current project
  const filterEntriesForProject = (entries: typeof mockTimesheetEntries) => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.date.includes(searchTerm)
      const matchesStatus = !statusFilter || entry.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }

  const toggleProject = (projectName: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectName]: !prev[projectName],
    }))
  }

  const statusCounts = {
    approved: clientEntries.filter((e) => e.status === 'approved').length,
    in_review: clientEntries.filter((e) => e.status === 'in_review').length,
    rejected: clientEntries.filter((e) => e.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Timesheet</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value="26/Jan/2023 - 26/Feb/2023"
            readOnly
            className="outline-none text-gray-900 bg-white cursor-pointer"
          />
        </div>
      </div>

      {/* Client Selector */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Client</label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-primary focus:outline-none"
        >
          {clients.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'hourly' | 'milestone')}>
        <TabsList className="grid w-48 grid-cols-2">
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="milestone">Milestone</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Projects Accordion */}
          <div className="space-y-3">
            {Object.entries(groupedByProject).map(([projectName, projectEntries]) => {
              const filteredEntries = filterEntriesForProject(projectEntries)
              const isExpanded = expandedProjects[projectName]

              return (
                <div key={projectName}>
                  {/* Project Header */}
                  <button
                    onClick={() => toggleProject(projectName)}
                    className="w-full flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
                  >
                    <h3 className="font-semibold text-primary text-lg">{projectName}</h3>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    )}
                  </button>

                  {/* Project Content */}
                  {isExpanded && (
                    <div className="border border-t-0 border-primary/20 rounded-b-lg p-4 space-y-4 bg-white">
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

                      {/* Controls Row */}
                      <div className="flex items-center justify-between gap-4">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                          View project contract
                        </Button>
                        <button
                          onClick={() => setViewMode(viewMode === 'daily' ? 'weekly' : 'daily')}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            viewMode === 'daily'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {viewMode === 'daily' ? 'Daily' : 'Weekly'}
                        </button>
                        <Button
                          onClick={() => setShowAddTime(true)}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Time
                        </Button>
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
                                ? 'bg-teal-500 text-white'
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

                      {/* Timesheet Table */}
                      {filteredEntries.length > 0 ? (
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">
                                  Date & Day
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">
                                  Hours Worked
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">
                                  Description
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
                                  <td className="px-6 py-4 font-semibold text-gray-900">
                                    {entry.hours} hours
                                  </td>
                                  <td className="px-6 py-4 text-gray-700">
                                    <div className="line-clamp-2">{entry.description}</div>
                                    {entry.description.length > 50 && (
                                      <button className="text-primary hover:underline text-xs mt-1">
                                        Read more
                                      </button>
                                    )}
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
                                  <td className="px-6 py-4 text-right space-x-2">
                                    {entry.status === 'rejected' && entry.rejectionReason && (
                                      <button
                                        onClick={() =>
                                          setRejectionModal({
                                            isOpen: true,
                                            reason: entry.rejectionReason!,
                                          })
                                        }
                                        className="text-red-600 hover:underline text-xs font-medium"
                                      >
                                        See why?
                                      </button>
                                    )}
                                    {entry.status === 'rejected' && (
                                      <button className="text-gray-600 hover:text-primary transition-colors p-1 inline-flex">
                                        <Edit2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                          <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No entries match the current filter</p>
                        </div>
                      )}

                      {/* Load More */}
                      {filteredEntries.length > 0 && (
                        <div className="text-center">
                          <button className="text-primary hover:underline font-medium text-sm">
                            Load more
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Time Modal */}
      <AddTimeModal
        isOpen={showAddTime}
        onClose={() => setShowAddTime(false)}
        onSubmit={(data) => {
          console.log('Timesheet submission:', data)
          setShowAddTime(false)
        }}
      />

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal({ isOpen: false, reason: '' })}
        reason={rejectionModal.reason}
      />
    </div>
  )
}
