/**
 * Special Requests List Screen
 * GROUP B - Screen 8 (LIST pattern - enhanced)
 *
 * This screen demonstrates:
 * - DataTableWrapper for displaying requests
 * - Advanced filtering (type, status, date range)
 * - Mock data integration
 * - Status badges and type colors
 * - Pagination support
 * - Inline actions (view, approve, reject)
 *
 * @route /employer/requests
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/templates'
import { getCurrentMockCompany, getMockDataByCompany } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check, X, Eye, Calendar } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Request type interface
 */
interface SpecialRequest {
  id: string
  company_id: string
  requester_id: string
  request_type: string
  title: string
  description: string
  request_data: any
  status: string
  assigned_to: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

/**
 * Request type definitions
 */
const REQUEST_TYPES = [
  { value: 'equipment', label: 'Equipment', color: 'bg-blue-100 text-blue-800' },
  { value: 'gifts', label: 'Gifts', color: 'bg-purple-100 text-purple-800' },
  { value: 'salary_amendment', label: 'Salary Amendment', color: 'bg-green-100 text-green-800' },
  { value: 'expense', label: 'Expense', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
]

const STATUS_TYPES = [
  { value: 'pending', label: 'Pending', color: 'bg-orange-100 text-orange-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'in_review', label: 'In Review', color: 'bg-blue-100 text-blue-800' },
]

export default function SpecialRequestsPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const company = getCurrentMockCompany()
  const [requests, setRequests] = useState<SpecialRequest[]>([])
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Load requests on component mount
   */
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true)
        const mockRequests = getMockDataByCompany('specialRequests', company.id)
        setRequests(mockRequests || [])
      } catch (error) {
        console.error('Error loading requests:', error)
        toast.error('Failed to load requests')
      } finally {
        setIsLoading(false)
      }
    }

    if (company) {
      loadRequests()
    }
  }, [company.id])

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  /**
   * Filter requests based on type, status, and search term
   */
  const filteredRequests = requests.filter((req) => {
    const matchesType = filterType === 'all' || req.request_type === filterType
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  /**
   * Calculate statistics
   */
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Get type color badge
   */
  const getTypeColor = (type: string) => {
    const typeObj = REQUEST_TYPES.find(t => t.value === type)
    return typeObj ? typeObj.color : 'bg-gray-100 text-gray-800'
  }

  /**
   * Get status color badge
   */
  const getStatusColor = (status: string) => {
    const statusObj = STATUS_TYPES.find(s => s.value === status)
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800'
  }

  /**
   * Get type label
   */
  const getTypeLabel = (type: string) => {
    const typeObj = REQUEST_TYPES.find(t => t.value === type)
    return typeObj ? typeObj.label : type
  }

  /**
   * Handle approve request
   */
  const handleApprove = (requestId: string) => {
    setRequests(
      requests.map(req =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    )
    toast.success('Request approved')
  }

  /**
   * Handle reject request
   */
  const handleReject = (requestId: string) => {
    setRequests(
      requests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    )
    toast.success('Request rejected')
  }

  /**
   * Format date
   */
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN')
    } catch {
      return dateStr
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Special Requests"
        description="Review and manage all special requests (equipment, gifts, salary amendments, etc.)"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Requests' },
        ]}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600 font-medium">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600 font-medium">Pending</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600 font-medium">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600 font-medium">Rejected</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="type-filter">Request Type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {REQUEST_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUS_TYPES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{requests.length === 0 ? 'No requests found.' : 'No requests match your filters.'}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Badge className={getTypeColor(request.request_type)}>
                      {getTypeLabel(request.request_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{request.title}</TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">
                    {request.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(request.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApprove(request.id)}
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(request.id)}
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Summary */}
      {filteredRequests.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      )}
    </div>
  )
}
