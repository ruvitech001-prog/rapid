'use client'

import { useState } from 'react'
import { Clock, CheckCircle, XCircle, Calendar, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  useLeaveRequests,
  usePendingLeaveCount,
  useApproveLeave,
  useRejectLeave,
} from '@/lib/hooks'
import { useAuth } from '@/lib/auth'
import { colors } from '@/lib/design-tokens'

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

interface LeaveRequestDisplay {
  id: string
  employeeName: string
  employeeCode: string
  leaveType: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string | null
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function LeaveRequestsPage() {
  const { user } = useAuth()
  const companyId = user?.companyId || undefined
  const employerId = user?.id || ''

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestDisplay | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  // Fetch leave requests
  const { data: leaveRequestsData = [], isLoading } = useLeaveRequests(companyId)
  const { data: pendingCount = 0 } = usePendingLeaveCount(companyId)

  // Mutations
  const approveMutation = useApproveLeave()
  const rejectMutation = useRejectLeave()

  // Transform data for display
  const requests: LeaveRequestDisplay[] = leaveRequestsData.map((req) => ({
    id: req.id,
    employeeName: req.employeeName,
    employeeCode: req.employeeCode,
    leaveType: req.leave_type,
    startDate: req.start_date,
    endDate: req.end_date,
    totalDays: Number(req.total_days) || 0,
    reason: req.reason,
    status: req.status as 'pending' | 'approved' | 'rejected',
    createdAt: req.created_at || '',
  }))

  // Calculate stats
  const approvedToday = requests.filter(
    (req) =>
      req.status === 'approved' &&
      new Date(req.createdAt).toDateString() === new Date().toDateString()
  ).length

  const rejectedToday = requests.filter(
    (req) =>
      req.status === 'rejected' &&
      new Date(req.createdAt).toDateString() === new Date().toDateString()
  ).length

  const thisMonth = requests.filter((req) => {
    const date = new Date(req.createdAt)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  // Filter requests
  const filteredRequests =
    filterStatus === 'all' ? requests : requests.filter((req) => req.status === filterStatus)

  const handleApprove = async (requestId: string) => {
    try {
      await approveMutation.mutateAsync({
        requestId,
        approverId: employerId,
      })
      setSelectedRequest(null)
    } catch (error) {
      console.error('Failed to approve leave:', error)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    try {
      await rejectMutation.mutateAsync({
        requestId,
        approverId: employerId,
        reason: rejectReason,
      })
      toast.success('Leave request rejected')
      setSelectedRequest(null)
      setShowRejectModal(false)
      setRejectReason('')
    } catch {
      toast.error('Failed to reject leave request')
    }
  }

  const openRejectModal = (request: LeaveRequestDisplay) => {
    setSelectedRequest(request)
    setShowRejectModal(true)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary500 }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="mt-1" style={{ color: colors.neutral500 }}>Review and manage employee leave requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border shadow-none" style={{ borderColor: colors.border, backgroundColor: colors.secondaryBlue50 }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                  PENDING REQUESTS
                </p>
                <p className="text-3xl font-bold mt-2" style={{ color: colors.warning600 }}>{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Clock className="h-6 w-6" style={{ color: colors.warning600 }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-none bg-white" style={{ borderColor: colors.border }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                  APPROVED TODAY
                </p>
                <p className="text-3xl font-bold mt-2" style={{ color: colors.success600 }}>{approvedToday}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.success600}10` }}>
                <CheckCircle className="h-6 w-6" style={{ color: colors.success600 }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-none bg-white" style={{ borderColor: colors.border }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                  REJECTED TODAY
                </p>
                <p className="text-3xl font-bold mt-2" style={{ color: colors.error600 }}>{rejectedToday}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.error600}10` }}>
                <XCircle className="h-6 w-6" style={{ color: colors.error600 }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-none bg-white" style={{ borderColor: colors.border }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                  TOTAL THIS MONTH
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{thisMonth}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.iconBlue}10` }}>
                <Calendar className="h-6 w-6" style={{ color: colors.iconBlue }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border shadow-none" style={{ borderColor: colors.border }}>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
              FILTER BY STATUS:
            </span>
            <div className="flex gap-2">
              {[
                { key: 'all' as FilterStatus, label: 'All', color: colors.iconBlue },
                { key: 'pending' as FilterStatus, label: 'Pending', color: colors.warning600 },
                { key: 'approved' as FilterStatus, label: 'Approved', color: colors.success600 },
                { key: 'rejected' as FilterStatus, label: 'Rejected', color: colors.error600 },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilterStatus(item.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === item.key
                      ? 'text-white'
                      : ''
                  }`}
                  style={filterStatus === item.key ? { backgroundColor: item.color } : { backgroundColor: colors.neutral50, color: colors.neutral500 }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="rounded-2xl border shadow-none overflow-hidden" style={{ borderColor: colors.border }}>
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Leave Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: colors.neutral50 }}>
                <tr style={{ borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                    EMPLOYEE
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                    LEAVE TYPE
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                    DURATION
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                    DAYS
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                    APPLIED ON
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderColor: colors.border }} className="divide-y">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:opacity-90 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.employeeName}
                        </div>
                        <div className="text-sm" style={{ color: colors.neutral500 }}>{request.employeeCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.leaveType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: colors.neutral500 }}>
                        {formatFullDate(request.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-3 py-1 inline-flex text-xs font-semibold rounded-full"
                        style={{
                          backgroundColor: request.status === 'pending' ? `${colors.warning600}10` : request.status === 'approved' ? `${colors.success600}10` : `${colors.error600}10`,
                          color: request.status === 'pending' ? colors.warning600 : request.status === 'approved' ? colors.success600 : colors.error600
                        }}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="hover:underline font-medium"
                          style={{ color: colors.iconBlue }}
                        >
                          View
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={approveMutation.isPending}
                              className="hover:underline font-medium disabled:opacity-50"
                              style={{ color: colors.success600 }}
                            >
                              {approveMutation.isPending ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => openRejectModal(request)}
                              disabled={rejectMutation.isPending}
                              className="hover:underline font-medium disabled:opacity-50"
                              style={{ color: colors.error600 }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: colors.neutral500 }}>No leave requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedRequest && !showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Leave Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.neutral50 }}
              >
                <X className="w-5 h-5" style={{ color: colors.neutral500 }} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.neutral50 }}>
                  <p className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: colors.neutral500 }}>
                    EMPLOYEE NAME
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.employeeName}
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.neutral50 }}>
                  <p className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: colors.neutral500 }}>
                    EMPLOYEE ID
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.employeeCode}
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.neutral50 }}>
                  <p className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: colors.neutral500 }}>
                    LEAVE TYPE
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.leaveType}
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.neutral50 }}>
                  <p className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: colors.neutral500 }}>
                    DURATION
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.totalDays} {selectedRequest.totalDays === 1 ? 'day' : 'days'}
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.neutral50 }}>
                  <p className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: colors.neutral500 }}>
                    START DATE
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {formatFullDate(selectedRequest.startDate)}
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.neutral50 }}>
                  <p className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: colors.neutral500 }}>
                    END DATE
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {formatFullDate(selectedRequest.endDate)}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: colors.neutral50 }}>
                <p className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: colors.neutral500 }}>
                  REASON
                </p>
                <p className="text-base text-gray-900">
                  {selectedRequest.reason || 'No reason provided'}
                </p>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => openRejectModal(selectedRequest)}
                    className="border"
                    style={{ borderColor: colors.error600, color: colors.error600 }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={approveMutation.isPending}
                    className="text-white"
                    style={{ backgroundColor: colors.success600 }}
                  >
                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Reject Leave Request</h2>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.neutral50 }}
              >
                <X className="w-5 h-5" style={{ color: colors.neutral500 }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2" style={{ color: colors.neutral500 }}>
                  Rejecting leave request for{' '}
                  <span className="font-medium text-gray-900">{selectedRequest.employeeName}</span>
                </p>
                <p className="text-sm" style={{ color: colors.neutral500 }}>
                  {selectedRequest.leaveType} | {formatDate(selectedRequest.startDate)} -{' '}
                  {formatDate(selectedRequest.endDate)}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider mb-2" style={{ color: colors.neutral500 }}>
                  REJECTION REASON *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={4}
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none resize-none"
                  style={{ borderColor: colors.border }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReason('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReject(selectedRequest.id)}
                  disabled={rejectMutation.isPending || !rejectReason.trim()}
                  className="text-white"
                  style={{ backgroundColor: colors.error600 }}
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Reject Request'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
