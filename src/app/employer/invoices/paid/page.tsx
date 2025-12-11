'use client'

import { useState } from 'react'
import { Search, Download, Eye, CheckCircle, DollarSign, FileText, Loader2, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { useRecentlyPaidInvoices } from '@/lib/hooks'
import { toast } from 'sonner'

type PaidInvoice = NonNullable<ReturnType<typeof useRecentlyPaidInvoices>['data']>[0]

export default function PaidInvoicesPage() {
  const { user } = useAuth()
  const companyId = user?.companyId ?? undefined
  const { data: invoices, isLoading } = useRecentlyPaidInvoices(companyId)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<PaidInvoice | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleViewInvoice = (invoice: PaidInvoice) => {
    setSelectedInvoice(invoice)
    setIsDetailModalOpen(true)
  }

  const handleDownloadInvoice = (invoice: PaidInvoice) => {
    toast.info(`Downloading invoice ${invoice.invoice_number}...`)
    // Trigger print dialog as PDF download
    const printContent = `
      Invoice: ${invoice.invoice_number}
      Contractor: ${invoice.contractorName || 'Unknown'}
      Amount: ₹${(invoice.total_amount || 0).toLocaleString('en-IN')}
      Invoice Date: ${invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-IN') : '-'}
      Paid Date: ${invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString('en-IN') : '-'}
      Status: Paid
    `
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
    toast.success(`Invoice ${invoice.invoice_number} downloaded`)
  }

  const handleExportReport = () => {
    if (!invoices || invoices.length === 0) {
      toast.error('No invoices to export')
      return
    }

    // Create CSV content
    const headers = ['Invoice ID', 'Contractor', 'Amount', 'Paid Date', 'Invoice Date', 'Status']
    const rows = invoices.map(inv => [
      inv.invoice_number || '',
      inv.contractorName || 'Unknown',
      (inv.total_amount || 0).toString(),
      inv.paid_date ? new Date(inv.paid_date).toLocaleDateString('en-IN') : '-',
      inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString('en-IN') : '-',
      'Paid'
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paid-invoices-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Report exported successfully')
  }

  const filteredInvoices = (invoices || []).filter((invoice) =>
    (invoice.invoice_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.contractorName || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPaid = filteredInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0)
  const averageAmount = filteredInvoices.length > 0 ? totalPaid / filteredInvoices.length : 0

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
          <h1 className="text-2xl font-bold text-gray-900">Paid Invoices</h1>
          <p className="text-[#8593A3] mt-1">View and manage paid invoices</p>
        </div>
        <Button className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]" onClick={handleExportReport}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL PAID</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalPaid >= 100000
                    ? `₹${(totalPaid / 100000).toFixed(1)}L`
                    : `₹${totalPaid.toLocaleString('en-IN')}`
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL INVOICES</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{filteredInvoices.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">AVERAGE AMOUNT</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">
                  {averageAmount >= 100000
                    ? `₹${(averageAmount / 100000).toFixed(1)}L`
                    : `₹${Math.round(averageAmount).toLocaleString('en-IN')}`
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8593A3]" />
            <input
              type="text"
              placeholder="Search by invoice ID or contractor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Invoice List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">INVOICE ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACTOR</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">AMOUNT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">PAID DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">INVOICE DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
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
                        {invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                        {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#2DD4BF]/10 text-[#2DD4BF]">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 hover:bg-[#586AF5]/10 rounded-lg transition-colors text-[#586AF5]"
                            onClick={() => handleViewInvoice(invoice)}
                            title="View Invoice"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-[#2DD4BF]/10 rounded-lg transition-colors text-[#2DD4BF]"
                            onClick={() => handleDownloadInvoice(invoice)}
                            title="Download Invoice"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-[#F4F7FA] flex items-center justify-center mb-3">
                          <FileText className="h-6 w-6 text-[#8593A3]" />
                        </div>
                        <p className="text-[#8593A3]">No paid invoices found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      {filteredInvoices.length > 0 && (
        <p className="text-sm text-[#8593A3] text-center">
          Showing {filteredInvoices.length} paid invoice{filteredInvoices.length !== 1 ? 's' : ''}
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
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Invoice Number</p>
                  <p className="font-semibold text-[#586AF5]">{selectedInvoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Status</p>
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[#2DD4BF]/10 text-[#2DD4BF]">
                    Paid
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Contractor</p>
                  <p className="font-medium">{selectedInvoice.contractorName || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Amount</p>
                  <p className="font-bold text-lg">₹{(selectedInvoice.total_amount || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Invoice Date</p>
                  <p>{selectedInvoice.invoice_date ? new Date(selectedInvoice.invoice_date).toLocaleDateString('en-IN') : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider">Paid Date</p>
                  <p>{selectedInvoice.paid_date ? new Date(selectedInvoice.paid_date).toLocaleDateString('en-IN') : '-'}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-[#2DD4BF] hover:bg-[#2DD4BF]/90"
                  onClick={() => {
                    handleDownloadInvoice(selectedInvoice)
                    setIsDetailModalOpen(false)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
