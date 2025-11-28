'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Edit2,
} from 'lucide-react'
import { CardContent as _CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RejectionReasonModal } from '@/components/timesheet/RejectionReasonModal'

interface TimesheetEntry {
  id: string
  date: string
  dayOfWeek: string
  hours: number
  description: string
  status: 'approved' | 'in_review' | 'rejected'
  rejectionReason?: string
}

interface ProjectData {
  name: string
  entries: TimesheetEntry[]
}

// Mock Data
const mockProjectData: ProjectData[] = [
  {
    name: 'Project A',
    entries: [
      {
        id: '1',
        date: '01/June/2023',
        dayOfWeek: 'Mon',
        hours: 6,
        description: 'Simply dummy text of the printing and typesetting industry.',
        status: 'approved',
      },
      {
        id: '2',
        date: '08/June/2023',
        dayOfWeek: 'Mon',
        hours: 6,
        description: 'Simply dummy text of the printing and typesetting industry.',
        status: 'approved',
      },
    ],
  },
  {
    name: 'Project B',
    entries: [
      {
        id: '3',
        date: '02/June/2023',
        dayOfWeek: 'Tue',
        hours: 7,
        description: 'Simply dummy text of the printing and typesetting industry.',
        status: 'approved',
      },
    ],
  },
  {
    name: 'Project C',
    entries: [
      {
        id: '4',
        date: '03/June/2023',
        dayOfWeek: 'Wed',
        hours: 5,
        description: 'Simply dummy text of the printing and typesetting industry.',
        status: 'rejected',
        rejectionReason:
          'The submitted hours do not match the project requirements. Please verify your time tracking and resubmit.',
      },
    ],
  },
]

export default function TimesheetDetailsPage() {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    'Project A': true,
  })
  const [activeTab, setActiveTab] = useState<'hourly' | 'milestone'>('hourly')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean
    reason: string
  }>({ isOpen: false, reason: '' })
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily')

  const toggleProject = (projectName: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectName]: !prev[projectName],
    }))
  }

  const statusCounts = {
    approved: mockProjectData.reduce(
      (sum, p) => sum + p.entries.filter((e) => e.status === 'approved').length,
      0,
    ),
    in_review: mockProjectData.reduce(
      (sum, p) => sum + p.entries.filter((e) => e.status === 'in_review').length,
      0,
    ),
    rejected: mockProjectData.reduce(
      (sum, p) => sum + p.entries.filter((e) => e.status === 'rejected').length,
      0,
    ),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Timesheet</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage your detailed timesheet</p>
      </div>

      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Date Range */}
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value="26/Jan/2023 - 26/Feb/2023"
            readOnly
            className="outline-none text-gray-900 bg-white cursor-pointer"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'daily'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'weekly'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'hourly' | 'milestone')}>
        <TabsList className="grid w-48 grid-cols-2">
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="milestone">Milestone</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Client Selection */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Client:</label>
            <select
              defaultValue="Aditya Birla Group"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-primary focus:outline-none"
            >
              <option>Aditya Birla Group</option>
              <option>XYZ Corp</option>
              <option>ABC Company</option>
            </select>
          </div>

          {/* Project Contract Button */}
          <Button variant="outline">View project contract</Button>

          {/* Filter Pills */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
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

          {/* Add Time Button */}
          <Button className="bg-primary hover:bg-primary/90">+ Add Time</Button>

          {/* Projects Accordion */}
          <div className="space-y-3">
            {mockProjectData.map((project) => {
              const filteredEntries = statusFilter
                ? project.entries.filter((e) => e.status === statusFilter)
                : project.entries

              return (
                <div key={project.name}>
                  {/* Project Header */}
                  <button
                    onClick={() => toggleProject(project.name)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                    {expandedProjects[project.name] ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>

                  {/* Project Entries Table */}
                  {expandedProjects[project.name] && filteredEntries.length > 0 && (
                    <div className="overflow-x-auto border border-t-0 border-gray-200 rounded-b-lg">
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
                                <button className="text-gray-600 hover:text-primary transition-colors p-1">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Empty State */}
                  {expandedProjects[project.name] && filteredEntries.length === 0 && (
                    <div className="border border-t-0 border-gray-200 rounded-b-lg p-8 text-center text-gray-500 bg-gray-50">
                      <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No entries match the current filter</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="text-primary hover:underline font-medium text-sm">
              Load more
            </button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal({ isOpen: false, reason: '' })}
        reason={rejectionModal.reason}
      />
    </div>
  )
}
