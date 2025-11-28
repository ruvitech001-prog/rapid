/**
 * Invoice Approval Workflow Screen
 * GROUP B - Screen 9 (LIST with inline actions pattern)
 *
 * This screen demonstrates:
 * - DataTableWrapper for displaying invoices
 * - Inline approval/rejection actions
 * - Detailed invoice information display
 * - Amount filtering and status tracking
 * - Notes/comments for approval decisions
 * - Mock data integration
 *
 * @route /employer/invoices/approve
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/templates'
import { getCurrentMockCompany, getMockDataByCompany } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check, X, Eye, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Invoice interface
 */
interface Invoice {
  id: string
  company_id: string
  vendor_id: string
  vendor_name: string
  invoice_number: string
  invoice_date: string
  due_date: string
  amount: number
  tax_amount: number
  total_amount: number
  description: string
  status: string
  notes: string | null
  approval_notes: string | null
  created_at: string
  updated_at: string
}

const INVOICE_STATUS = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'submitted', label: 'Submitted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'pending_approval', label: 'Pending Approval', color: 'bg-orange-100 text-orange-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
]

export default function InvoiceApprovalPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const company = getCurrentMockCompany()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filterStatus, setFilterStatus] = useState('pending_approval')
  const [searchTerm, setSearchTerm] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null)
  const [approvalNotes, setApprovalNotes] = useState<Record<string, string>>({})

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Load invoices on component mount
   */
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setIsLoading(true)
        const mockInvoices = getMockDataByCompany('invoices', company?.id || '')
        setInvoices(mockInvoices || [])
      } catch (error) {
        console.error('Error loading invoices:', error)
        toast.error('Failed to load invoices')
      } finally {
        setIsLoading(false)
      }
    }

    if (company) {
      loadInvoices()
    }
  }, [company?.id])

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  /**
   * Filter invoices based on status, search term, and amount range
   */
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      filterStatus === 'all' || inv.status === filterStatus
    const matchesSearch =
      inv.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMinAmount =
      !minAmount || inv.total_amount >= Number(minAmount)
    const matchesMaxAmount =
      !maxAmount || inv.total_amount <= Number(maxAmount)
    return matchesStatus && matchesSearch && matchesMinAmount && matchesMaxAmount
  })

  /**
   * Calculate statistics
   */
  const stats = {
    total: invoices.length,
    pending: invoices.filter(i => i.status === 'pending_approval').length,
    approved: invoices.filter(i => i.status === 'approved').length,
    rejected: invoices.filter(i => i.status === 'rejected').length,
    pendingAmount: invoices
      .filter(i => i.status === 'pending_approval')
      .reduce((sum, i) => sum + i.total_amount, 0),
  }

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Get status color badge
   */
  const getStatusColor = (status: string) => {
    const statusObj = INVOICE_STATUS.find(s => s.value === status)
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800'
  }

  /**
   * Get status label
   */
  const getStatusLabel = (status: string) => {
    const statusObj = INVOICE_STATUS.find(s => s.value === status)
    return statusObj ? statusObj.label : status
  }

  /**
   * Handle approve invoice
   */
  const handleApprove = (invoiceId: string) => {
    const notes = approvalNotes[invoiceId] || ''
    setInvoices(
      invoices.map(inv =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'approved',
              approval_notes: notes,
              updated_at: new Date().toISOString().split('T')[0] || new Date().toISOString(),
            }
          : inv
      )
    )
    setApprovalNotes({ ...approvalNotes, [invoiceId]: '' })
    setExpandedInvoice(null)
    toast.success('Invoice approved successfully')
  }

  /**
   * Handle reject invoice
   */
  const handleReject = (invoiceId: string) => {
    const notes = approvalNotes[invoiceId] || ''
    if (!notes.trim()) {
      toast.error('Please provide reason for rejection')
      return
    }
    setInvoices(
      invoices.map(inv =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'rejected',
              approval_notes: notes,
              updated_at: new Date().toISOString().split('T')[0] || new Date().toISOString(),
            }
          : inv
      )
    )
    setApprovalNotes({ ...approvalNotes, [invoiceId]: '' })
    setExpandedInvoice(null)
    toast.success('Invoice rejected')
  }

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
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

  /**
   * Check if invoice is overdue
   */
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Invoice Approval Workflow"
        description="Review and approve pending invoices for payment"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Invoices', href: '/employer/invoices' },
          { label: 'Approve' },
        ]}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600 font-medium">Total Invoices</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 border-orange-200 bg-orange-50">
          <p className="text-sm text-orange-700 font-medium">Pending Approval</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600 font-medium">Total Pending Amount</p>
          <p className="text-xl font-bold text-gray-900 mt-2">{formatCurrency(stats.pendingAmount)}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Vendor/Invoice</Label>
            <Input
              id="search"
              placeholder="Search vendor or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {INVOICE_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Amount */}
          <div className="space-y-2">
            <Label htmlFor="min-amount">Min Amount (₹)</Label>
            <Input
              id="min-amount"
              type="number"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          {/* Max Amount */}
          <div className="space-y-2">
            <Label htmlFor="max-amount">Max Amount (₹)</Label>
            <Input
              id="max-amount"
              type="number"
              placeholder="999999"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>

          {/* Reset Button */}
          <div className="space-y-2 flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('pending_approval')
                setMinAmount('')
                setMaxAmount('')
              }}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{invoices.length === 0 ? 'No invoices found.' : 'No invoices match your filters.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className={expandedInvoice === invoice.id ? 'bg-blue-50' : ''}>
                    <TableCell className="font-medium">{invoice.vendor_name}</TableCell>
                    <TableCell className="text-gray-600">{invoice.invoice_number}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(invoice.total_amount)}
                    </TableCell>
                    <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatDate(invoice.due_date)}
                        {isOverdue(invoice.due_date) && invoice.status !== 'approved' && (
                          <AlertCircle className="w-4 h-4 text-red-600" aria-label="Overdue" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {invoice.status === 'pending_approval' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() =>
                                expandedInvoice === invoice.id
                                  ? setExpandedInvoice(null)
                                  : setExpandedInvoice(invoice.id)
                              }
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                expandedInvoice === invoice.id
                                  ? setExpandedInvoice(null)
                                  : setExpandedInvoice(invoice.id)
                              }
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() =>
                            expandedInvoice === invoice.id
                              ? setExpandedInvoice(null)
                              : setExpandedInvoice(invoice.id)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Invoice Details Expansion */}
      {expandedInvoice && (
        <div className="bg-white rounded-lg border p-6 space-y-6">
          {filteredInvoices.find(i => i.id === expandedInvoice) && (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Invoice {filteredInvoices.find(i => i.id === expandedInvoice)!.invoice_number}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredInvoices.find(i => i.id === expandedInvoice)!.vendor_name}
                  </p>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(filteredInvoices.find(i => i.id === expandedInvoice)!.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(filteredInvoices.find(i => i.id === expandedInvoice)!.tax_amount)}
                  </p>
                </div>
                <div className="border-t-2 border-gray-300 pt-2">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(filteredInvoices.find(i => i.id === expandedInvoice)!.total_amount)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{filteredInvoices.find(i => i.id === expandedInvoice)!.description}</p>
              </div>

              {/* Approval Notes (for pending invoices) */}
              {filteredInvoices.find(i => i.id === expandedInvoice)!.status === 'pending_approval' && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor={`notes-${expandedInvoice}`}>Approval Notes (Optional)</Label>
                    <Textarea
                      id={`notes-${expandedInvoice}`}
                      placeholder="Add notes for approver or reason for rejection..."
                      className="min-h-24"
                      value={approvalNotes[expandedInvoice] || ''}
                      onChange={(e) =>
                        setApprovalNotes({
                          ...approvalNotes,
                          [expandedInvoice]: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Approval Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="default"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(expandedInvoice)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Invoice
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(expandedInvoice)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Invoice
                    </Button>
                  </div>
                </div>
              )}

              {/* Approval History (for approved/rejected invoices) */}
              {filteredInvoices.find(i => i.id === expandedInvoice)!.status !== 'pending_approval' && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <p className="font-medium text-gray-900">Status: {getStatusLabel(filteredInvoices.find(i => i.id === expandedInvoice)!.status)}</p>
                  {filteredInvoices.find(i => i.id === expandedInvoice)!.approval_notes && (
                    <>
                      <p className="text-sm text-gray-600">Approval Notes:</p>
                      <p className="text-gray-900">{filteredInvoices.find(i => i.id === expandedInvoice)!.approval_notes}</p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Summary */}
      {filteredInvoices.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
      )}
    </div>
  )
}
