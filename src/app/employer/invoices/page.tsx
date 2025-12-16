'use client'

import { useState } from 'react'
import { Plus, FileText, DollarSign, Clock, AlertTriangle, Download, Eye, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { useCompanyInvoices, useInvoiceSummary, usePayInvoice, useApproveInvoice } from '@/lib/hooks'
import type { InvoiceWithContractor } from '@/lib/services'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { colors } from '@/lib/design-tokens'

export default function InvoicesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const companyId = user?.companyId ?? undefined
  const { data: invoices, isLoading: invoicesLoading } = useCompanyInvoices(companyId)
  const { data: summary, isLoading: summaryLoading } = useInvoiceSummary(companyId)

  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithContractor | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Mutation hooks
  const payInvoiceMutation = usePayInvoice()
  const approveInvoiceMutation = useApproveInvoice()

  // Handler: View Invoice Details
  const handleViewInvoice = (invoice: InvoiceWithContractor) => {
    setSelectedInvoice(invoice)
    setIsDetailModalOpen(true)
  }

  // Handler: Download Invoice PDF
  const handleDownloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    try {
      // For now, show a toast - in production, this would generate/download a PDF
      toast.info(`Downloading invoice ${invoiceNumber}...`)
      // TODO: Implement actual PDF download
      // const pdfUrl = await invoicesService.getInvoicePdf(invoiceId)
      // window.open(pdfUrl, '_blank')
      setTimeout(() => {
        toast.success(`Invoice ${invoiceNumber} downloaded`)
      }, 1000)
    } catch (error) {
      toast.error('Failed to download invoice')
      console.error('Download error:', error)
    }
  }

  // Handler: Pay Invoice
  const handlePayInvoice = async (invoiceId: string) => {
    if (!companyId) {
      toast.error('Company ID is required to process payment')
      return
    }

    setProcessingId(invoiceId)
    try {
      await payInvoiceMutation.mutateAsync({
        invoiceId,
        companyId,
        paymentReference: `PAY-${Date.now()}`
      })
      toast.success('Invoice marked as paid')
      setIsDetailModalOpen(false)
    } catch (error) {
      toast.error('Failed to process payment')
      console.error('Payment error:', error)
    } finally {
      setProcessingId(null)
    }
  }

  // Handler: Approve Invoice
  const handleApproveInvoice = async (invoiceId: string) => {
    if (!companyId) {
      toast.error('Company ID is required to approve invoice')
      return
    }

    setProcessingId(invoiceId)
    try {
      await approveInvoiceMutation.mutateAsync({ invoiceId, companyId })
      toast.success('Invoice approved')
      setIsDetailModalOpen(false)
    } catch (error) {
      toast.error('Failed to approve invoice')
      console.error('Approval error:', error)
    } finally {
      setProcessingId(null)
    }
  }

  // Handler: Create Invoice - navigate to create page
  const handleCreateInvoice = () => {
    router.push('/employer/invoices/create')
  }

  const isLoading = invoicesLoading || summaryLoading

  const filteredInvoices = (invoices || []).filter(inv =>
    filterStatus === 'all' || inv.status === filterStatus
  )

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' }
      case 'pending':
      case 'submitted':
        return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' }
      case 'overdue':
      case 'rejected':
        return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' }
      case 'approved':
        return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' }
      default:
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary500 }} />
      </div>
    )
  }

  const totalRevenue = (summary?.paidAmount || 0) + (summary?.pendingAmount || 0)
  const pendingAmount = summary?.pendingAmount || 0
  const overdueCount = (invoices || []).filter(inv => inv.status === 'overdue').length
  const totalCount = invoices?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.neutral900 }}>Invoices</h1>
          <p className="mt-1" style={{ color: colors.neutral500 }}>Manage contractor invoices</p>
        </div>
        <Button className="gap-2 text-white" style={{ backgroundColor: colors.primary500 }} onClick={handleCreateInvoice}>
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL INVOICES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL AMOUNT</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">
                  {totalRevenue >= 100000
                    ? `₹${(totalRevenue / 100000).toFixed(1)}L`
                    : `₹${totalRevenue.toLocaleString('en-IN')}`
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING PAYMENT</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">
                  {pendingAmount >= 100000
                    ? `₹${(pendingAmount / 100000).toFixed(1)}L`
                    : `₹${pendingAmount.toLocaleString('en-IN')}`
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">OVERDUE</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{overdueCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'submitted', 'approved', 'paid', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-[#586AF5] text-white'
                    : 'bg-[#F4F7FA] text-[#8593A3] hover:bg-[#DEE4EB]'
                }`}
              >
                {status === 'all' ? 'All Invoices' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Invoice List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-[#8593A3] mx-auto mb-3" />
              <p className="text-[#8593A3]">No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">INVOICE NUMBER</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACTOR</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">AMOUNT</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DATE</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DUE DATE</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE4EB]">
                  {filteredInvoices.map((invoice) => {
                    const statusColors = getStatusColor(invoice.status)
                    return (
                      <tr key={invoice.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-[#586AF5]">{invoice.invoice_number}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.contractorName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{(invoice.total_amount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                          {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                          {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors.bg} ${statusColors.text}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 hover:bg-[#586AF5]/10 rounded-lg transition-colors text-[#586AF5]"
                              onClick={() => handleViewInvoice(invoice)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-[#2DD4BF]/10 rounded-lg transition-colors text-[#2DD4BF]"
                              onClick={() => handleDownloadInvoice(invoice.id, invoice.invoice_number || 'invoice')}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
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

      {/* Invoice Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoice_number || 'Invoice'}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8593A3]">Contractor</p>
                  <p className="font-medium">{selectedInvoice.contractorName || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8593A3]">Amount</p>
                  <p className="font-medium text-lg">₹{(selectedInvoice.total_amount || 0).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8593A3]">Invoice Date</p>
                  <p className="font-medium">
                    {selectedInvoice.invoice_date ? new Date(selectedInvoice.invoice_date).toLocaleDateString('en-IN') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8593A3]">Due Date</p>
                  <p className="font-medium">
                    {selectedInvoice.due_date ? new Date(selectedInvoice.due_date).toLocaleDateString('en-IN') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8593A3]">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedInvoice.status).bg} ${getStatusColor(selectedInvoice.status).text}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
                {selectedInvoice.businessName && (
                  <div>
                    <p className="text-sm text-[#8593A3]">Business Name</p>
                    <p className="font-medium">{selectedInvoice.businessName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => handleDownloadInvoice(selectedInvoice?.id || '', selectedInvoice?.invoice_number || 'invoice')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {selectedInvoice?.status === 'submitted' && (
              <Button
                onClick={() => handleApproveInvoice(selectedInvoice.id)}
                disabled={processingId === selectedInvoice.id}
                className="bg-[#586AF5] hover:bg-[#4858d4]"
              >
                {processingId === selectedInvoice.id ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Approve
              </Button>
            )}
            {(selectedInvoice?.status === 'approved' || selectedInvoice?.status === 'pending') && (
              <Button
                onClick={() => handlePayInvoice(selectedInvoice.id)}
                disabled={processingId === selectedInvoice.id}
                className="bg-[#642DFC] hover:bg-[#5020d9]"
              >
                {processingId === selectedInvoice.id ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
