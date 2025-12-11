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
        <Loader2 className="h-8 w-8 animate-spin text-[#642DFC]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-[#8593A3] mt-1">Review and manage employee leave requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">
                  PENDING REQUESTS
                </p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">
                  APPROVED TODAY
                </p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{approvedToday}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">
                  REJECTED TODAY
                </p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{rejectedToday}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">
                  TOTAL THIS MONTH
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{thisMonth}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-[#8593A3] tracking-wider">
              FILTER BY STATUS:
            </span>
            <div className="flex gap-2">
              {[
                { key: 'all' as FilterStatus, label: 'All', color: '#586AF5' },
                { key: 'pending' as FilterStatus, label: 'Pending', color: '#CC7A00' },
                { key: 'approved' as FilterStatus, label: 'Approved', color: '#2DD4BF' },
                { key: 'rejected' as FilterStatus, label: 'Rejected', color: '#FF7373' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilterStatus(item.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === item.key
                      ? 'text-white'
                      : 'bg-[#F4F7FA] text-[#8593A3] hover:bg-[#DEE4EB]'
                  }`}
                  style={filterStatus === item.key ? { backgroundColor: item.color } : {}}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Leave Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">
                    EMPLOYEE
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">
                    LEAVE TYPE
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">
                    DURATION
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">
                    DAYS
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">
                    APPLIED ON
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.employeeName}
                        </div>
                        <div className="text-sm text-[#8593A3]">{request.employeeCode}</div>
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
                      <div className="text-sm text-[#8593A3]">
                        {formatFullDate(request.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          request.status === 'pending'
                            ? 'bg-[#CC7A00]/10 text-[#CC7A00]'
                            : request.status === 'approved'
                              ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]'
                              : 'bg-[#FF7373]/10 text-[#FF7373]'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-[#586AF5] hover:underline font-medium"
                        >
                          View
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={approveMutation.isPending}
                              className="text-[#2DD4BF] hover:underline font-medium disabled:opacity-50"
                            >
                              {approveMutation.isPending ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => openRejectModal(request)}
                              disabled={rejectMutation.isPending}
                              className="text-[#FF7373] hover:underline font-medium disabled:opacity-50"
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
              <p className="text-[#8593A3]">No leave requests found.</p>
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
                className="w-8 h-8 rounded-lg bg-[#F4F7FA] hover:bg-[#DEE4EB] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8593A3]" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">
                    EMPLOYEE NAME
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.employeeName}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">
                    EMPLOYEE ID
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.employeeCode}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">
                    LEAVE TYPE
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.leaveType}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">
                    DURATION
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.totalDays} {selectedRequest.totalDays === 1 ? 'day' : 'days'}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">
                    START DATE
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {formatFullDate(selectedRequest.startDate)}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">
                    END DATE
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {formatFullDate(selectedRequest.endDate)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F4F7FA] rounded-xl">
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">
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
                    className="border-[#FF7373] text-[#FF7373] hover:bg-[#FF7373]/10"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={approveMutation.isPending}
                    className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-white"
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
                className="w-8 h-8 rounded-lg bg-[#F4F7FA] hover:bg-[#DEE4EB] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8593A3]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#8593A3] mb-2">
                  Rejecting leave request for{' '}
                  <span className="font-medium text-gray-900">{selectedRequest.employeeName}</span>
                </p>
                <p className="text-sm text-[#8593A3]">
                  {selectedRequest.leaveType} | {formatDate(selectedRequest.startDate)} -{' '}
                  {formatDate(selectedRequest.endDate)}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">
                  REJECTION REASON *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={4}
                  className="w-full px-4 py-3 border border-[#DEE4EB] rounded-xl text-sm focus:outline-none focus:border-[#586AF5] resize-none"
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
                  className="bg-[#FF7373] hover:bg-[#FF7373]/90 text-white"
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
