'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  X,
  Loader2,
  User,
} from 'lucide-react'
import {
  useSuperAdminRequests,
  useSuperAdminRequestCounts,
  useApproveRequest,
  useRejectRequest,
} from '@/lib/hooks'
import type { RequestStatus, RequestCategory, RequestWithDetails } from '@/types/superadmin'
import { toast } from 'sonner'

// Design tokens
const colors = {
  primary500: '#642DFC',
  primary50: '#F6F2FF',
  neutral800: '#353B41',
  neutral700: '#505862',
  neutral600: '#6A7682',
  neutral500: '#8593A3',
  neutral50: '#F4F7FA',
  warning600: '#CC7A00',
  warning200: '#FFDD99',
  success600: '#22957F',
  success50: '#EDF9F7',
  rose200: '#FFB5C6',
  border: '#DEE4EB',
}

type StatusConfigType = { label: string; className: string; icon: React.ReactNode }

const DEFAULT_STATUS_CONFIG: StatusConfigType = {
  label: 'Unknown',
  className: 'bg-gray-100 text-gray-700',
  icon: <Clock className="h-3 w-3" />,
}

const STATUS_CONFIG: Record<string, StatusConfigType> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700',
    icon: <Clock className="h-3 w-3" />,
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-700',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700',
    icon: <AlertCircle className="h-3 w-3" />,
  },
  withdrawn: {
    label: 'Withdrawn',
    className: 'bg-gray-100 text-gray-700',
    icon: <X className="h-3 w-3" />,
  },
}

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  leave: { label: 'Leave', className: 'bg-orange-100 text-orange-800' },
  expense: { label: 'Expense', className: 'bg-blue-100 text-blue-800' },
  payroll_query: { label: 'Payroll Query', className: 'bg-pink-100 text-pink-800' },
  employment_letter: { label: 'Employment Letter', className: 'bg-violet-100 text-violet-800' },
  travel_letter: { label: 'Travel Letter', className: 'bg-sky-100 text-sky-800' },
  resignation: { label: 'Resignation', className: 'bg-red-100 text-red-800' },
  equipment_purchase: { label: 'Equipment Purchase', className: 'bg-indigo-100 text-indigo-800' },
  equipment_collect: { label: 'Equipment Collection', className: 'bg-cyan-100 text-cyan-800' },
  termination: { label: 'Termination', className: 'bg-red-100 text-red-800' },
  send_gifts: { label: 'Send Gifts', className: 'bg-purple-100 text-purple-800' },
}

export default function SuperAdminRequestsPage() {
  const [activeTab, setActiveTab] = useState<'all' | RequestCategory>('all')
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<RequestWithDetails | null>(null)
  const [remarks, setRemarks] = useState('')

  // Fetch data using hooks
  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useSuperAdminRequests({
    category: activeTab === 'all' ? undefined : activeTab,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
  })

  const { data: counts } = useSuperAdminRequestCounts()
  const approveRequest = useApproveRequest()
  const rejectRequest = useRejectRequest()

  const handleApprove = async () => {
    if (!selectedRequest) return
    try {
      await approveRequest.mutateAsync({
        requestId: selectedRequest.id,
        remarks: remarks || undefined,
      })
      toast.success('Request approved successfully')
      setSelectedRequest(null)
      setRemarks('')
      refetch()
    } catch {
      toast.error('Failed to approve request')
    }
  }

  const handleReject = async () => {
    if (!selectedRequest || !remarks) {
      toast.error('Please provide a reason for rejection')
      return
    }
    try {
      await rejectRequest.mutateAsync({
        requestId: selectedRequest.id,
        remarks,
      })
      toast.success('Request rejected')
      setSelectedRequest(null)
      setRemarks('')
      refetch()
    } catch {
      toast.error('Failed to reject request')
    }
  }

  const getStatusConfig = (status: string): StatusConfigType => {
    return STATUS_CONFIG[status] || DEFAULT_STATUS_CONFIG
  }

  const getTypeConfig = (type: string) => {
    return TYPE_CONFIG[type] || { label: type, className: 'bg-gray-100 text-gray-800' }
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
          <h1 className="text-2xl font-bold" style={{ color: colors.neutral800 }}>
            Requests
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.neutral600 }}>
            Manage approval requests across all clients
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: colors.border }}>
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'employee', label: 'Employee' },
          { id: 'employer', label: 'Employer' },
          { id: 'special', label: 'Special' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'all' | RequestCategory)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
            }`}
            style={{
              color: activeTab === tab.id ? colors.primary500 : colors.neutral500,
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: colors.primary500 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: colors.neutral500 }}>
            Status:
          </span>
          {(['all', 'pending', 'approved', 'rejected', 'withdrawn'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: statusFilter === status ? colors.primary500 : undefined,
                color: statusFilter === status ? 'white' : undefined,
              }}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && counts && (
                <span className="ml-1">
                  ({status === 'pending' ? counts.pending : status === 'approved' ? counts.approved : status === 'rejected' ? counts.rejected : counts.withdrawn})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1">
          <Card className="rounded-xl" style={{ borderColor: colors.border }}>
            <CardContent className="p-0">
              {requests.length === 0 ? (
                <div className="p-12 text-center" style={{ color: colors.neutral500 }}>
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No requests found</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: colors.neutral50 }}>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.neutral500 }}>
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.neutral500 }}>
                        Requester
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.neutral500 }}>
                        Company
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.neutral500 }}>
                        Details
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.neutral500 }}>
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.neutral500 }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => {
                      const typeConfig = getTypeConfig(request.requestType)
                      const statusConfig = getStatusConfig(request.status)
                      return (
                        <tr
                          key={request.id}
                          className={`border-b cursor-pointer transition-colors ${
                            selectedRequest?.id === request.id ? 'bg-primary/5' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <td className="py-3 px-4">
                            <Badge className={`${typeConfig.className} font-normal`}>
                              {typeConfig.label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: colors.primary50 }}
                              >
                                <User className="h-3.5 w-3.5" style={{ color: colors.primary500 }} />
                              </div>
                              <span style={{ color: colors.neutral700 }}>{request.requesterName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4" style={{ color: colors.neutral600 }}>
                            {request.companyName}
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate" style={{ color: colors.neutral600 }}>
                            {request.details}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`${statusConfig.className} font-normal gap-1`}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-xs" style={{ color: colors.neutral500 }}>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail Panel */}
        {selectedRequest && (
          <div
            className="w-[380px] bg-white rounded-xl p-6 h-fit sticky top-6"
            style={{ border: `1px solid ${colors.border}` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className={getTypeConfig(selectedRequest.requestType).className}>
                  {getTypeConfig(selectedRequest.requestType).label}
                </Badge>
                <h3 className="text-lg font-semibold mt-2" style={{ color: colors.neutral800 }}>
                  {selectedRequest.requesterName}
                </h3>
                <p className="text-sm" style={{ color: colors.neutral500 }}>
                  {selectedRequest.companyName}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="h-5 w-5" style={{ color: colors.neutral500 }} />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-medium uppercase mb-1" style={{ color: colors.neutral500 }}>
                  Details
                </p>
                <p className="text-sm" style={{ color: colors.neutral700 }}>
                  {selectedRequest.details}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase mb-1" style={{ color: colors.neutral500 }}>
                  Requested on
                </p>
                <p className="text-sm" style={{ color: colors.neutral700 }}>
                  {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase mb-1" style={{ color: colors.neutral500 }}>
                  Status
                </p>
                <Badge className={getStatusConfig(selectedRequest.status).className}>
                  {getStatusConfig(selectedRequest.status).icon}
                  <span className="ml-1">{getStatusConfig(selectedRequest.status).label}</span>
                </Badge>
              </div>
              {selectedRequest.remarks && (
                <div>
                  <p className="text-xs font-medium uppercase mb-1" style={{ color: colors.neutral500 }}>
                    Remarks
                  </p>
                  <p className="text-sm" style={{ color: colors.neutral700 }}>
                    {selectedRequest.remarks}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedRequest.status === 'pending' && (
              <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase mb-2" style={{ color: colors.neutral500 }}>
                    Add remarks
                  </p>
                  <Textarea
                    placeholder="Optional remarks..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: colors.primary500 }}
                    onClick={handleApprove}
                    disabled={approveRequest.isPending}
                  >
                    {approveRequest.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Approve'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleReject}
                    disabled={rejectRequest.isPending}
                  >
                    {rejectRequest.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Reject'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {selectedRequest.status !== 'pending' && (
              <div className="pt-4 border-t text-center" style={{ borderColor: colors.border }}>
                <p className="text-sm" style={{ color: colors.neutral500 }}>
                  This request has been {selectedRequest.status}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
