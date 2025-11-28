/**
 * Employer Requests Page
 * Main list view with tabs, filters, and inline detail panel
 *
 * @route /employer/requests
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Plus,
  ChevronDown,
  Search,
  FileText,
  Eye,
  X,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { DateRangePicker } from '@/components/requests'
import { getCurrentMockCompany, getMockDataByCompany, getMockData, updateMockData } from '@/lib/mock-data'

// ============================================================================
// TYPES
// ============================================================================

interface Request {
  id: string
  company_id: string
  requester_id: string
  request_type: string
  title: string
  description: string
  request_data: Record<string, any>
  status: string
  assigned_to: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Enriched fields
  requester_name?: string
  requester_avatar?: string
}

type Tab = 'your_requests' | 'for_approval'
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'withdrawn'

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-orange-100 text-orange-800' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  withdrawn: { label: 'Withdrawn', className: 'bg-gray-100 text-gray-800' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800' },
}

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  leave: { label: 'Leave', className: 'bg-blue-100 text-blue-800' },
  expense: { label: 'Expense', className: 'bg-yellow-100 text-yellow-800' },
  expense_claim: { label: 'Expense claim', className: 'bg-yellow-100 text-yellow-800' },
  send_gifts: { label: 'Send gifts', className: 'bg-purple-100 text-purple-800' },
  gift: { label: 'Send gifts', className: 'bg-purple-100 text-purple-800' },
  purchase_equipment: { label: 'Purchase equipment', className: 'bg-indigo-100 text-indigo-800' },
  equipment: { label: 'Purchase equipment', className: 'bg-indigo-100 text-indigo-800' },
  collect_equipment: { label: 'Collect equipment', className: 'bg-cyan-100 text-cyan-800' },
  termination: { label: 'Termination', className: 'bg-red-100 text-red-800' },
  cancellation_of_hiring: { label: 'Cancellation of hiring', className: 'bg-orange-100 text-orange-800' },
  resignation: { label: 'Resignation', className: 'bg-orange-100 text-orange-800' },
  extension_of_probation: { label: 'Extension of probation', className: 'bg-amber-100 text-amber-800' },
  probation_extension: { label: 'Extension of probation', className: 'bg-amber-100 text-amber-800' },
  confirmation_of_probation: { label: 'Confirmation of probation', className: 'bg-teal-100 text-teal-800' },
  incentive_payment: { label: 'Incentive payment', className: 'bg-emerald-100 text-emerald-800' },
  promotion: { label: 'Promotion', className: 'bg-emerald-100 text-emerald-800' },
  salary_amendment: { label: 'Salary amendment', className: 'bg-green-100 text-green-800' },
  contract_amendment: { label: 'Contract amendment', className: 'bg-green-100 text-green-800' },
  office_space: { label: 'Office space', className: 'bg-slate-100 text-slate-800' },
  payroll_query: { label: 'Payroll query', className: 'bg-pink-100 text-pink-800' },
  travel_letter: { label: 'Travel letter', className: 'bg-sky-100 text-sky-800' },
  employment_letter: { label: 'Employment letter', className: 'bg-violet-100 text-violet-800' },
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'leave', label: 'Leave' },
  { value: 'expense', label: 'Expense' },
  { value: 'expense_claim', label: 'Expense claim' },
  { value: 'send_gifts', label: 'Send gifts' },
  { value: 'purchase_equipment', label: 'Purchase equipment' },
  { value: 'collect_equipment', label: 'Collect equipment' },
  { value: 'termination', label: 'Termination' },
  { value: 'cancellation_of_hiring', label: 'Cancellation of hiring' },
  { value: 'extension_of_probation', label: 'Extension of probation' },
  { value: 'confirmation_of_probation', label: 'Confirmation of probation' },
  { value: 'contract_amendment', label: 'Contract amendment' },
  { value: 'incentive_payment', label: 'Incentive payment' },
  { value: 'office_space', label: 'Office space' },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RequestsPage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  // State
  const [activeTab, setActiveTab] = useState<Tab>('your_requests')
  const [requests, setRequests] = useState<Request[]>([])
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Approval panel state
  const [remarks, setRemarks] = useState('')

  // Load requests
  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true)
      try {
        const companyId = company?.id || ''
        // Get special requests
        const specialRequests = getMockDataByCompany('specialRequests', companyId)

        // Get leave requests and transform
        const leaveRequests = getMockDataByCompany('leaveRequests', companyId).map((lr: any) => ({
          id: lr.id,
          company_id: lr.company_id,
          requester_id: lr.employee_id,
          request_type: 'leave',
          title: `${lr.leave_type} Leave`,
          description: `${lr.days_count} days - ${lr.reason}`,
          request_data: {
            start_date: lr.start_date,
            end_date: lr.end_date,
            days_count: lr.days_count,
            leave_type: lr.leave_type,
            reason: lr.reason,
          },
          status: lr.status,
          assigned_to: lr.approver_id,
          notes: null,
          created_at: lr.created_at,
          updated_at: lr.created_at,
        }))

        // Get expense requests and transform
        const expenseRequests = getMockDataByCompany('expenseRequests', companyId).map((er: any) => ({
          id: er.id,
          company_id: er.company_id,
          requester_id: er.employee_id,
          request_type: 'expense',
          title: `Expense Claim`,
          description: `INR ${er.amount.toLocaleString('en-IN')} - ${er.category}`,
          request_data: {
            amount: er.amount,
            category: er.category,
            description: er.description,
          },
          status: er.status === 'completed' ? 'approved' : er.status,
          assigned_to: er.approver_id,
          notes: null,
          created_at: er.created_at,
          updated_at: er.created_at,
        }))

        // Combine and enrich with requester info
        const employees = getMockData('employees')
        const allRequests = [...specialRequests, ...leaveRequests, ...expenseRequests].map((req) => {
          const employee = employees.find((e: any) => e.id === req.requester_id)
          return {
            ...req,
            requester_name: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
          }
        })

        // Sort by created_at descending
        allRequests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setRequests(allRequests)
        if (allRequests.length > 0) {
          setSelectedRequest(allRequests[0])
        }
      } catch (error) {
        console.error('Error loading requests:', error)
        toast.error('Failed to load requests')
      } finally {
        setIsLoading(false)
      }
    }

    loadRequests()
  }, [company?.id])

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    // Status filter
    if (statusFilter !== 'all' && req.status !== statusFilter) return false

    // Type filter
    if (typeFilter !== 'all' && req.request_type !== typeFilter) return false

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesId = req.id.toLowerCase().includes(query)
      const matchesTitle = req.title.toLowerCase().includes(query)
      const matchesRequester = req.requester_name?.toLowerCase().includes(query)
      if (!matchesId && !matchesTitle && !matchesRequester) return false
    }

    // Date range
    if (startDate && endDate) {
      const reqDate = new Date(req.created_at)
      if (reqDate < startDate || reqDate > endDate) return false
    }

    return true
  })

  // Calculate status counts
  const statusCounts = {
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved' || r.status === 'completed').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    withdrawn: requests.filter((r) => r.status === 'withdrawn' || r.status === 'cancelled').length,
  }

  // Handlers
  const handleApprove = (requestId: string) => {
    updateMockData('specialRequests', requestId, { status: 'approved' })
    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r)))
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: 'approved' })
    }
    toast.success('Request approved')
    setRemarks('')
  }

  const handleReject = (requestId: string) => {
    updateMockData('specialRequests', requestId, { status: 'rejected', notes: remarks })
    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r)))
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: 'rejected' })
    }
    toast.success('Request rejected')
    setRemarks('')
  }

  const handleWithdraw = (requestId: string) => {
    updateMockData('specialRequests', requestId, { status: 'withdrawn' })
    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: 'withdrawn' } : r)))
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: 'withdrawn' })
    }
    toast.success('Request withdrawn')
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MMM/yyyy')
    } catch {
      return dateStr
    }
  }

  const getTypeConfig = (type: string) => {
    return TYPE_CONFIG[type] || { label: type, className: 'bg-gray-100 text-gray-800' }
  }

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
  }

  const getRequestDetails = (req: Request) => {
    switch (req.request_type) {
      case 'leave':
        return `${formatDate(req.request_data.start_date)} - ${formatDate(req.request_data.end_date)}`
      case 'expense':
        return `INR ${req.request_data.amount?.toLocaleString('en-IN')} - ${req.request_data.category}`
      default:
        return req.description || req.title
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Requests</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#642DFC] hover:bg-[#5224D9] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create request
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push('/employer/leave/requests/new')}>
                Leave
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/employer/requests/new/expense')}>
                Expense claim
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/employer/requests/new/special')}>
                Special request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#DEE4EB]">
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'your_requests'
                ? 'text-[#642DFC]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('your_requests')}
          >
            Your requests ({requests.length})
            {activeTab === 'your_requests' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#642DFC]" />
            )}
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'for_approval'
                ? 'text-[#642DFC]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('for_approval')}
          >
            For your approval ({statusCounts.pending})
            {activeTab === 'for_approval' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#642DFC]" />
            )}
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {/* Date Range */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start)
              setEndDate(end)
            }}
          />

          {/* Status Pills */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filters :</span>
            <button
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-[#642DFC] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                statusFilter === 'approved'
                  ? 'bg-[#642DFC] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter(statusFilter === 'approved' ? 'all' : 'approved')}
            >
              Approved ({statusCounts.approved})
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                statusFilter === 'rejected'
                  ? 'bg-[#642DFC] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter(statusFilter === 'rejected' ? 'all' : 'rejected')}
            >
              Rejected ({statusCounts.rejected})
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                statusFilter === 'withdrawn'
                  ? 'bg-[#642DFC] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter(statusFilter === 'withdrawn' ? 'all' : 'withdrawn')}
            >
              Withdrawn ({statusCounts.withdrawn})
            </button>
          </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10 h-10"
              placeholder="Search by ID, name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content - Table + Detail Panel */}
        <div className="flex gap-6">
          {/* Table Section */}
          <div className="flex-1 bg-white rounded-xl border border-[#DEE4EB] overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Loading requests...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No requests found</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase">ID</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase">Type</TableHead>
                      {activeTab === 'for_approval' && (
                        <TableHead className="text-xs font-semibold text-gray-500 uppercase">Requested by</TableHead>
                      )}
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase">Request details</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((req) => (
                      <TableRow
                        key={req.id}
                        className={`cursor-pointer transition-colors ${
                          selectedRequest?.id === req.id ? 'bg-[#642DFC]/5' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedRequest(req)}
                      >
                        <TableCell className="text-sm text-gray-900">{req.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <Badge className={`${getTypeConfig(req.request_type).className} font-normal`}>
                            {getTypeConfig(req.request_type).label}
                          </Badge>
                        </TableCell>
                        {activeTab === 'for_approval' && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#642DFC]/10 flex items-center justify-center">
                                <User className="w-3 h-3 text-[#642DFC]" />
                              </div>
                              <span className="text-sm text-gray-900">{req.requester_name}</span>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {getRequestDetails(req)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusConfig(req.status).className} font-normal`}>
                            {getStatusConfig(req.status).label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Load More */}
                {filteredRequests.length >= 10 && (
                  <div className="p-4 text-center border-t border-[#DEE4EB]">
                    <button className="text-sm text-[#642DFC] hover:underline">Load more</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Detail Panel */}
          {selectedRequest && (
            <div className="w-[380px] bg-white rounded-xl border border-[#DEE4EB] p-6 h-fit sticky top-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedRequest.id.slice(0, 8)} {getTypeConfig(selectedRequest.request_type).label}
                  </h3>
                </div>
                <button
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  onClick={() => setSelectedRequest(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Details based on type */}
              <div className="space-y-4">
                {selectedRequest.request_type === 'leave' && (
                  <>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Dates</p>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedRequest.request_data.start_date)} - {formatDate(selectedRequest.request_data.end_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Total days</p>
                      <p className="text-sm text-gray-900">{selectedRequest.request_data.days_count}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Leave category</p>
                      <p className="text-sm text-gray-900 capitalize">{selectedRequest.request_data.leave_type}</p>
                    </div>
                  </>
                )}

                {selectedRequest.request_type === 'expense' && (
                  <>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Amount</p>
                      <p className="text-sm text-gray-900">
                        INR {selectedRequest.request_data.amount?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Category</p>
                      <p className="text-sm text-gray-900 capitalize">{selectedRequest.request_data.category}</p>
                    </div>
                    {selectedRequest.request_data.description && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Description</p>
                        <p className="text-sm text-gray-900">{selectedRequest.request_data.description}</p>
                      </div>
                    )}
                  </>
                )}

                {!['leave', 'expense'].includes(selectedRequest.request_type) && (
                  <>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Title</p>
                      <p className="text-sm text-gray-900">{selectedRequest.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Description</p>
                      <p className="text-sm text-gray-900">{selectedRequest.description}</p>
                    </div>
                  </>
                )}

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Requested on</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedRequest.created_at)}</p>
                </div>

                {selectedRequest.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Notes</p>
                    <p className="text-sm text-gray-900">{selectedRequest.notes}</p>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Documents</p>
                  <button className="text-sm text-[#642DFC] hover:underline flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View (2)
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-[#DEE4EB]">
                {activeTab === 'for_approval' && selectedRequest.status === 'pending' ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Add remarks</p>
                      <Textarea
                        className="resize-none"
                        rows={3}
                        placeholder="Optional remarks..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-[#642DFC] hover:bg-[#5224D9]"
                        onClick={() => handleApprove(selectedRequest.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(selectedRequest.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ) : activeTab === 'your_requests' && selectedRequest.status === 'pending' ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleWithdraw(selectedRequest.id)}
                  >
                    Withdraw request
                  </Button>
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    This request has been {selectedRequest.status}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
