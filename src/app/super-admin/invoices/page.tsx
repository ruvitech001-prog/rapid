'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Download, Eye, MoreHorizontal, Loader2, FileText, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  useSuperAdminInvoices,
  useSuperAdminInvoiceStats,
  useMarkInvoiceAsPaid,
  useSendPaymentReminder,
} from '@/lib/hooks/use-superadmin-invoices'
import { toast } from 'sonner'

type Invoice = NonNullable<ReturnType<typeof useSuperAdminInvoices>['data']>[0]

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isMarkPaidModalOpen, setIsMarkPaidModalOpen] = useState(false)

  const markInvoiceAsPaid = useMarkInvoiceAsPaid()
  const sendPaymentReminder = useSendPaymentReminder()

  const { data: invoices, isLoading: invoicesLoading, refetch } = useSuperAdminInvoices({
    search: searchTerm,
    status: statusFilter,
  })
  const { data: stats, isLoading: statsLoading } = useSuperAdminInvoiceStats()

  const isLoading = invoicesLoading || statsLoading

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailModalOpen(true)
  }

  const handleDownloadPDF = (invoice: Invoice) => {
    toast.info(`Downloading invoice ${invoice.invoiceNumber}...`)
    // Create printable content
    const printContent = `
      Invoice: ${invoice.invoiceNumber}
      Company: ${invoice.company}
      Contractor: ${invoice.contractorName}
      Amount: ₹${invoice.amount.toLocaleString('en-IN')}
      Date: ${invoice.date ? new Date(invoice.date).toLocaleDateString('en-IN') : '-'}
      Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : '-'}
      Status: ${invoice.status}
    `
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
    toast.success(`Invoice ${invoice.invoiceNumber} downloaded`)
  }

  const handleSendReminder = async (invoice: Invoice) => {
    toast.info(`Sending reminder for ${invoice.invoiceNumber}...`)
    try {
      const result = await sendPaymentReminder.mutateAsync(invoice.id)
      toast.success(result.message || `Payment reminder sent to ${invoice.contractorName}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reminder')
    }
  }

  const handleMarkAsPaid = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsMarkPaidModalOpen(true)
  }

  const confirmMarkAsPaid = async () => {
    if (!selectedInvoice) return

    try {
      await markInvoiceAsPaid.mutateAsync({ invoiceId: selectedInvoice.id })
      toast.success(`Invoice ${selectedInvoice.invoiceNumber} marked as paid`)
      setIsMarkPaidModalOpen(false)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update invoice status')
    }
  }

  const handleExport = () => {
    if (!invoices || invoices.length === 0) {
      toast.error('No invoices to export')
      return
    }

    const headers = ['Invoice ID', 'Company', 'Contractor', 'Type', 'Date', 'Due Date', 'Amount', 'Status']
    const rows = invoices.map(inv => [
      inv.invoiceNumber,
      inv.company,
      inv.contractorName,
      inv.type,
      inv.date ? new Date(inv.date).toLocaleDateString('en-IN') : '-',
      inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN') : '-',
      inv.amount.toString(),
      inv.status
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Invoices exported successfully')
  }

  const handleGenerateInvoice = () => {
    toast.info('Invoice generation feature coming soon')
  }

  const invoiceStats = [
    { label: 'Total Invoiced', value: stats?.totalInvoiced || 0 },
    { label: 'Pending Payment', value: stats?.pendingPayment || 0 },
    { label: 'Paid Invoices', value: stats?.paidAmount || 0 },
    { label: 'Outstanding', value: stats?.overdueAmount || 0 },
  ]

  const formatAmount = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700'
      case 'Sent':
        return 'bg-blue-100 text-blue-700'
      case 'Pending':
      case 'Approved':
        return 'bg-yellow-100 text-yellow-700'
      case 'Draft':
        return 'bg-gray-100 text-gray-700'
      case 'Overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices Management</h1>
          <p className="text-muted-foreground mt-2">Manage payroll and contractor invoices</p>
        </div>
        <Button onClick={handleGenerateInvoice}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {invoiceStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatAmount(stat.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice ID or company..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>Complete invoice history and management</CardDescription>
        </CardHeader>
        <CardContent>
          {!invoices || invoices.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-foreground">No invoices found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Invoices will appear here once created'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Invoice ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Company</th>
                    <th className="text-left py-3 px-4 font-semibold">Contractor</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Due Date</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4">{invoice.company}</td>
                      <td className="py-3 px-4 text-muted-foreground">{invoice.contractorName}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{invoice.type}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {invoice.date ? new Date(invoice.date).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">{formatAmount(invoice.amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendReminder(invoice)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reminder
                            </DropdownMenuItem>
                            {invoice.status !== 'Paid' && (
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-Generation Info */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Invoice Generation</CardTitle>
          <CardDescription>Automatic payroll invoice generation schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Generation Schedule</h4>
              <p className="text-2xl font-bold">16th</p>
              <p className="text-sm text-muted-foreground">Day of every month</p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Configure
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Next Generation</h4>
              <p className="text-2xl font-bold">
                {new Date(new Date().getFullYear(), new Date().getMonth() + (new Date().getDate() > 16 ? 1 : 0), 16).toLocaleDateString('en-IN')}
              </p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Generate Now
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Last Generated</h4>
              <p className="text-2xl font-bold">
                {new Date(new Date().getFullYear(), new Date().getMonth() - (new Date().getDate() > 16 ? 0 : 1), 16).toLocaleDateString('en-IN')}
              </p>
              <p className="text-sm text-muted-foreground">{invoices?.length || 0} invoices created</p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      {invoices && invoices.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Invoice Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Invoice Number</p>
                  <p className="font-semibold">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Company</p>
                  <p className="font-medium">{selectedInvoice.company}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Contractor</p>
                  <p className="font-medium">{selectedInvoice.contractorName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Invoice Date</p>
                  <p>{selectedInvoice.date ? new Date(selectedInvoice.date).toLocaleDateString('en-IN') : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</p>
                  <p>{selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString('en-IN') : '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Amount</p>
                <p className="text-2xl font-bold">{formatAmount(selectedInvoice.amount)}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
            {selectedInvoice && (
              <Button onClick={() => {
                handleDownloadPDF(selectedInvoice)
                setIsDetailModalOpen(false)
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Confirmation Modal */}
      <Dialog open={isMarkPaidModalOpen} onOpenChange={setIsMarkPaidModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Invoice as Paid</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="py-4">
              <p className="text-muted-foreground">
                Are you sure you want to mark invoice <strong>{selectedInvoice.invoiceNumber}</strong> as paid?
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold">{formatAmount(selectedInvoice.amount)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Contractor:</span>
                  <span>{selectedInvoice.contractorName}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMarkPaidModalOpen(false)} disabled={markInvoiceAsPaid.isPending}>
              Cancel
            </Button>
            <Button onClick={confirmMarkAsPaid} disabled={markInvoiceAsPaid.isPending}>
              {markInvoiceAsPaid.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
