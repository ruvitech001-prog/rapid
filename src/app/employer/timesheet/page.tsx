'use client'

import { useState, useMemo } from 'react'
import { Calendar, Download, Clock, CheckCircle, AlertCircle, Users, Loader2, FileText, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth'
import { useCompanyTimesheets, usePendingTimesheetCount, useApproveTimesheet, useRejectTimesheet } from '@/lib/hooks'
import type { TimesheetFilters, TimesheetWithDetails } from '@/lib/services'
import { toast } from 'sonner'

export default function TimesheetPage() {
  const { user } = useAuth()
  const companyId = user?.companyId ?? undefined
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetWithDetails | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const filters: TimesheetFilters | undefined = useMemo(() => {
    if (statusFilter !== 'All') {
      return { status: statusFilter.toLowerCase() as 'draft' | 'submitted' | 'approved' | 'rejected' }
    }
    return undefined
  }, [statusFilter])

  const { data: timesheets, isLoading: timesheetsLoading, refetch } = useCompanyTimesheets(companyId, filters)
  const { data: pendingCount, isLoading: pendingLoading } = usePendingTimesheetCount(companyId)
  const approveTimesheet = useApproveTimesheet()
  const rejectTimesheet = useRejectTimesheet()

  const isLoading = timesheetsLoading || pendingLoading

  const handleReview = (timesheet: TimesheetWithDetails) => {
    setSelectedTimesheet(timesheet)
    setRejectionReason('')
    setIsReviewModalOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedTimesheet || !user?.id) return

    setIsProcessing(true)
    try {
      await approveTimesheet.mutateAsync({
        timesheetId: selectedTimesheet.id,
        approverId: user.id,
      })
      toast.success('Timesheet approved successfully')
      setIsReviewModalOpen(false)
      refetch()
    } catch (error) {
      toast.error('Failed to approve timesheet')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedTimesheet) return

    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setIsProcessing(true)
    try {
      // Note: rejection reason is currently not saved - may need to extend the service
      await rejectTimesheet.mutateAsync(selectedTimesheet.id)
      toast.success('Timesheet rejected')
      setIsReviewModalOpen(false)
      setRejectionReason('')
      refetch()
    } catch (error) {
      toast.error('Failed to reject timesheet')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExport = () => {
    if (!timesheets || timesheets.length === 0) {
      toast.error('No timesheets to export')
      return
    }

    const headers = ['Contractor', 'Code', 'Week', 'Hours', 'Submitted', 'Status']
    const rows = timesheets.map(t => [
      t.contractorName || 'Unknown',
      t.contractorCode || '-',
      `${t.week_start_date || ''} - ${t.week_end_date || ''}`,
      (t.totalHours || 0).toString(),
      t.submitted_at ? new Date(t.submitted_at).toLocaleDateString('en-IN') : '-',
      t.status || 'draft'
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timesheets-${selectedMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Timesheets exported successfully')
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' }
      case 'submitted':
      case 'pending':
        return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' }
      case 'rejected':
        return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' }
      case 'draft':
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' }
      default:
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' }
    }
  }

  const formatWeek = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return `${start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const timesheetList = timesheets || []
  const totalHours = timesheetList.reduce((sum, t) => sum + (t.totalHours || 0), 0)
  const approvedCount = timesheetList.filter(t => t.status === 'approved').length
  const submittedCount = timesheetList.filter(t => t.status === 'submitted').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-[#8593A3] mt-1">Review and approve contractor timesheets</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL SUBMISSIONS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{timesheetList.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL HOURS</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">{totalHours}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">APPROVED</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{approvedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING REVIEW</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{pendingCount || submittedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-[#8593A3] tracking-wider block mb-2">SELECT MONTH</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8593A3]" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full pl-10 h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['All', 'Submitted', 'Approved', 'Rejected'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === filter
                      ? 'bg-[#586AF5] text-white'
                      : 'bg-[#F4F7FA] text-[#8593A3] hover:bg-[#DEE4EB]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timesheets Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Timesheet Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {timesheetList.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-[#8593A3] mx-auto mb-3" />
              <p className="text-[#8593A3]">No timesheets found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACTOR</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">WEEK</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">HOURS</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">SUBMITTED</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE4EB]">
                  {timesheetList.map((timesheet) => {
                    const statusColors = getStatusColor(timesheet.status || 'draft')
                    return (
                      <tr key={timesheet.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {timesheet.contractorName || 'Unknown Contractor'}
                            </div>
                            <div className="text-sm text-[#8593A3]">
                              {timesheet.contractorCode || '-'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {timesheet.week_start_date && timesheet.week_end_date
                            ? formatWeek(timesheet.week_start_date, timesheet.week_end_date)
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">{timesheet.totalHours || 0} hrs</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                          {timesheet.submitted_at
                            ? new Date(timesheet.submitted_at).toLocaleDateString('en-IN')
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors.bg} ${statusColors.text}`}>
                            {timesheet.status || 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            className="text-sm font-medium text-[#586AF5] hover:underline"
                            onClick={() => handleReview(timesheet)}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      {timesheetList.length > 0 && (
        <p className="text-sm text-[#8593A3] text-center">
          Showing {timesheetList.length} timesheet{timesheetList.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Timesheet</DialogTitle>
          </DialogHeader>
          {selectedTimesheet && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Contractor</p>
                  <p className="font-semibold">{selectedTimesheet.contractorName || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedTimesheet.status || 'draft').bg} ${getStatusColor(selectedTimesheet.status || 'draft').text}`}>
                    {selectedTimesheet.status || 'Draft'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Week</p>
                  <p>{selectedTimesheet.week_start_date && selectedTimesheet.week_end_date
                    ? formatWeek(selectedTimesheet.week_start_date, selectedTimesheet.week_end_date)
                    : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Total Hours</p>
                  <p className="font-bold text-lg">{selectedTimesheet.totalHours || 0} hrs</p>
                </div>
              </div>

              {selectedTimesheet.task_description && (
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Task Description</p>
                  <p className="text-sm mt-1">{selectedTimesheet.task_description}</p>
                </div>
              )}

              {selectedTimesheet.status === 'submitted' && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider mb-2">Rejection Reason (if rejecting)</p>
                  <Textarea
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewModalOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            {selectedTimesheet?.status === 'submitted' && (
              <>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
                </Button>
                <Button
                  className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90"
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
