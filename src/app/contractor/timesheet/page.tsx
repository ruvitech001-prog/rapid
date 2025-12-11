'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Clock,
  ChevronDown,
  Plus,
  Edit2,
  Calendar,
  ChevronUp,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddTimeModal, type TimesheetFormData } from '@/components/timesheet'
import { RejectionReasonModal } from '@/components/timesheet'
import { useAuth } from '@/lib/auth'
import { useContractorTimesheets, useSaveTimesheet, useSubmitTimesheet } from '@/lib/hooks'

export default function TimesheetPage() {
  const { user } = useAuth()
  const contractorId = user?.id
  const { data: timesheets, isLoading, refetch } = useContractorTimesheets(contractorId)
  const saveTimesheet = useSaveTimesheet()
  const submitTimesheet = useSubmitTimesheet()

  const [activeTab, setActiveTab] = useState<'hourly' | 'milestone'>('hourly')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showAddTime, setShowAddTime] = useState(false)
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily')
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean
    reason: string
  }>({ isOpen: false, reason: '' })

  // Handle timesheet submission from modal
  const handleTimesheetSubmit = async (data: TimesheetFormData) => {
    if (!contractorId) {
      toast.error('User not authenticated')
      return
    }

    setIsSubmitting(true)
    try {
      // Parse time to calculate hours
      const parseTime = (timeStr: string) => {
        const [time, meridiem] = timeStr.split(' ')
        if (!time) return 0
        const [hoursStr, minutesStr] = time.split(':')
        let hours = Number(hoursStr) || 0
        const minutes = Number(minutesStr) || 0
        if (meridiem === 'PM' && hours !== 12) hours += 12
        if (meridiem === 'AM' && hours === 12) hours = 0
        return hours * 60 + minutes
      }

      const fromMinutes = parseTime(data.fromTime)
      const toMinutes = parseTime(data.toTime)
      let diffMinutes = toMinutes - fromMinutes
      if (diffMinutes < 0) diffMinutes += 24 * 60
      const hoursWorked = Math.round(diffMinutes / 60 * 10) / 10

      // Get the day of week from start date
      const startDate = new Date(data.startDate)
      const dayOfWeek = startDate.getDay()

      // Calculate week start (Monday)
      const weekStart = new Date(startDate)
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      weekStart.setDate(diff)

      // Calculate week end (Sunday)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      // Create timesheet entry with hours on the correct day
      const dayHours: Record<string, number> = {
        mondayHours: 0,
        tuesdayHours: 0,
        wednesdayHours: 0,
        thursdayHours: 0,
        fridayHours: 0,
        saturdayHours: 0,
        sundayHours: 0,
      }

      const dayNames = ['sundayHours', 'mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours'] as const
      const dayKey = dayNames[dayOfWeek]
      if (dayKey) {
        dayHours[dayKey] = hoursWorked
      }

      await saveTimesheet.mutateAsync({
        contractorId,
        contractId: 'default-contract', // In production, this would come from selected project/contract
        weekStartDate: weekStart.toISOString().split('T')[0] ?? '',
        weekEndDate: weekEnd.toISOString().split('T')[0] ?? '',
        ...dayHours,
        taskDescription: data.description,
      })

      toast.success('Timesheet entry saved successfully!')
      setShowAddTime(false)
      refetch()
    } catch (error) {
      console.error('Failed to save timesheet:', error)
      toast.error('Failed to save timesheet entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle submitting a draft timesheet for approval
  const handleSubmitForApproval = async (timesheetId: string) => {
    try {
      await submitTimesheet.mutateAsync(timesheetId)
      toast.success('Timesheet submitted for approval')
      refetch()
    } catch (error) {
      console.error('Failed to submit timesheet:', error)
      toast.error('Failed to submit timesheet')
    }
  }

  // Transform timesheets to display format
  const timesheetEntries = useMemo(() => {
    if (!timesheets) return []

    return timesheets.map(ts => ({
      id: ts.id,
      client: ts.contractorName || 'Unknown Client',
      project: 'Default Project',
      date: ts.week_start_date || '',
      dayOfWeek: ts.week_start_date ? new Date(ts.week_start_date).toLocaleDateString('en-US', { weekday: 'short' }) : '',
      hours: ts.totalHours || 0,
      status: ts.status as 'approved' | 'submitted' | 'rejected' | 'draft',
      description: ts.task_description || 'No description provided',
      rejectionReason: undefined,
    }))
  }, [timesheets])

  const toggleProject = (projectName: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectName]: !prev[projectName],
    }))
  }

  // Group by project
  const groupedByProject = useMemo(() => {
    return timesheetEntries.reduce(
      (acc, entry) => {
        if (!acc[entry.project]) {
          acc[entry.project] = []
        }
        acc[entry.project]!.push(entry)
        return acc
      },
      {} as Record<string, typeof timesheetEntries>,
    )
  }, [timesheetEntries])

  // Filter entries for current project
  const filterEntriesForProject = (entries: typeof timesheetEntries) => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.date.includes(searchTerm)
      const matchesStatus = !statusFilter || entry.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }

  const statusCounts = useMemo(() => ({
    approved: timesheetEntries.filter((e) => e.status === 'approved').length,
    submitted: timesheetEntries.filter((e) => e.status === 'submitted').length,
    rejected: timesheetEntries.filter((e) => e.status === 'rejected').length,
    draft: timesheetEntries.filter((e) => e.status === 'draft').length,
  }), [timesheetEntries])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Timesheet</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track and submit your work hours</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={`${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
            readOnly
            className="outline-none text-gray-900 bg-white cursor-pointer"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {timesheetEntries.reduce((sum, e) => sum + e.hours, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase">Approved</p>
          <p className="text-2xl font-bold text-teal-600 mt-1">{statusCounts.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts.submitted + statusCounts.draft}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{statusCounts.rejected}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'hourly' | 'milestone')}>
        <TabsList className="grid w-48 grid-cols-2">
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="milestone">Milestone</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {Object.keys(groupedByProject).length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No timesheet entries found</p>
              <Button
                onClick={() => setShowAddTime(true)}
                className="mt-4 bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Time Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedByProject).map(([projectName, projectEntries]) => {
                const filteredEntries = filterEntriesForProject(projectEntries)
                const isExpanded = expandedProjects[projectName] !== false

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
                                setStatusFilter(statusFilter === 'submitted' ? null : 'submitted')
                              }
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                statusFilter === 'submitted'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Submitted ({statusCounts.submitted})
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
                                      <div className="font-medium">
                                        {entry.date ? new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                      </div>
                                      <div className="text-xs text-gray-500">{entry.dayOfWeek}</div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                      {entry.hours} hours
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                      <div className="line-clamp-2">{entry.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <Badge
                                        className={`${
                                          entry.status === 'approved'
                                            ? 'bg-teal-100 text-teal-800'
                                            : entry.status === 'submitted'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : entry.status === 'rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                      >
                                        {entry.status === 'approved'
                                          ? 'Approved'
                                          : entry.status === 'submitted'
                                            ? 'Submitted'
                                            : entry.status === 'rejected'
                                              ? 'Rejected'
                                              : 'Draft'}
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
                                      {entry.status === 'draft' && (
                                        <button
                                          onClick={() => handleSubmitForApproval(entry.id)}
                                          className="px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 mr-2"
                                          disabled={submitTimesheet.isPending}
                                        >
                                          {submitTimesheet.isPending ? 'Submitting...' : 'Submit'}
                                        </button>
                                      )}
                                      {(entry.status === 'rejected' || entry.status === 'draft') && (
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
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Time Modal */}
      <AddTimeModal
        isOpen={showAddTime}
        onClose={() => setShowAddTime(false)}
        onSubmit={handleTimesheetSubmit}
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
