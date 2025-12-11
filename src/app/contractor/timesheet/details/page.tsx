'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RejectionReasonModal } from '@/components/timesheet/RejectionReasonModal'
import { useContractorTimesheets } from '@/lib/hooks/use-timesheets'
import { useAuth } from '@/lib/auth/auth-context'

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatWeekRange(startDate: string | null, endDate: string | null): string {
  if (!startDate || !endDate) return '-'
  const start = new Date(startDate)
  const end = new Date(endDate)
  return `${start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function TimesheetDetailsPage() {
  const { user } = useAuth()
  const contractorId = user?.id
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({})
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean
    reason: string
  }>({ isOpen: false, reason: '' })

  const { data: timesheets, isLoading, error } = useContractorTimesheets(contractorId)

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekId]: !prev[weekId],
    }))
  }

  // Filter timesheets by status
  const filteredTimesheets = statusFilter
    ? timesheets?.filter((ts) => ts.status === statusFilter)
    : timesheets

  // Calculate status counts
  const statusCounts = {
    approved: timesheets?.filter((ts) => ts.status === 'approved').length || 0,
    submitted: timesheets?.filter((ts) => ts.status === 'submitted').length || 0,
    draft: timesheets?.filter((ts) => ts.status === 'draft').length || 0,
    rejected: timesheets?.filter((ts) => ts.status === 'rejected').length || 0,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Timesheet History</h1>
          <p className="mt-1 text-sm text-gray-500">View your timesheet submissions</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Unable to load timesheets</h3>
            <p className="text-gray-500 mt-2">Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Timesheet History</h1>
        <p className="mt-1 text-sm text-gray-500">View and track your weekly timesheet submissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
            <div className="text-sm text-gray-500">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.submitted}</div>
            <div className="text-sm text-gray-500">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.draft}</div>
            <div className="text-sm text-gray-500">Draft</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({timesheets?.length || 0})
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'approved' ? null : 'approved')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved ({statusCounts.approved})
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'submitted' ? null : 'submitted')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === 'submitted'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({statusCounts.submitted})
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'draft' ? null : 'draft')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === 'draft'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Draft ({statusCounts.draft})
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'rejected' ? null : 'rejected')}
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

      {/* Timesheets List */}
      {filteredTimesheets && filteredTimesheets.length > 0 ? (
        <div className="space-y-3">
          {filteredTimesheets.map((timesheet) => {
            const weekId = timesheet.id
            const isExpanded = expandedWeeks[weekId]
            const dailyHours = [
              { day: 'Monday', hours: timesheet.monday_hours || 0 },
              { day: 'Tuesday', hours: timesheet.tuesday_hours || 0 },
              { day: 'Wednesday', hours: timesheet.wednesday_hours || 0 },
              { day: 'Thursday', hours: timesheet.thursday_hours || 0 },
              { day: 'Friday', hours: timesheet.friday_hours || 0 },
              { day: 'Saturday', hours: timesheet.saturday_hours || 0 },
              { day: 'Sunday', hours: timesheet.sunday_hours || 0 },
            ]

            return (
              <div key={weekId} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Week Header */}
                <button
                  onClick={() => toggleWeek(weekId)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">
                        Week of {formatWeekRange(timesheet.week_start_date, timesheet.week_end_date)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Total: {timesheet.totalHours} hours
                        {timesheet.submitted_at && ` • Submitted ${formatDate(timesheet.submitted_at)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${
                        timesheet.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : timesheet.status === 'submitted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : timesheet.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {timesheet.status === 'approved'
                        ? 'Approved'
                        : timesheet.status === 'submitted'
                          ? 'Pending Review'
                          : timesheet.status === 'rejected'
                            ? 'Rejected'
                            : 'Draft'}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Week Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {/* Daily Hours Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {dailyHours.map((day, idx) => (
                        <div
                          key={day.day}
                          className={`text-center p-3 rounded-lg ${
                            day.hours > 0 ? 'bg-primary/10' : 'bg-gray-50'
                          }`}
                        >
                          <div className="text-xs font-medium text-gray-500 mb-1">
                            {dayNames[idx]}
                          </div>
                          <div className={`text-lg font-bold ${day.hours > 0 ? 'text-primary' : 'text-gray-400'}`}>
                            {day.hours}
                          </div>
                          <div className="text-xs text-gray-500">hrs</div>
                        </div>
                      ))}
                    </div>

                    {/* Task Description */}
                    {timesheet.task_description && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Task Description</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {timesheet.task_description}
                        </p>
                      </div>
                    )}

                    {/* Status Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500">
                        {timesheet.status === 'approved' && timesheet.approved_at && (
                          <span>Approved on {formatDate(timesheet.approved_at)}</span>
                        )}
                        {timesheet.status === 'draft' && (
                          <span className="text-amber-600">
                            Not submitted yet - submit to get approval
                          </span>
                        )}
                      </div>
                      {timesheet.status === 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setRejectionModal({
                              isOpen: true,
                              reason: 'The submitted hours were not approved. Please review and resubmit.',
                            })
                          }
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          View Rejection Reason
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No timesheets found</h3>
            <p className="text-gray-500 mt-2">
              {statusFilter
                ? `No timesheets with status "${statusFilter}"`
                : 'Start logging your hours to see them here'}
            </p>
            <Button className="mt-4" onClick={() => window.location.href = '/contractor/timesheet'}>
              Log Hours
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal({ isOpen: false, reason: '' })}
        reason={rejectionModal.reason}
      />
    </div>
  )
}
