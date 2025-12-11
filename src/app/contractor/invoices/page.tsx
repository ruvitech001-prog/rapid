'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Loader2, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { useContractorInvoices } from '@/lib/hooks'

export default function InvoicesPage() {
  const { user } = useAuth()
  const contractorId = user?.id
  const { data: invoices, isLoading } = useContractorInvoices(contractorId)
  const [statusFilter, setStatusFilter] = useState('all')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const invoiceList = invoices || []
  const filteredInvoices = invoiceList.filter(inv => statusFilter === 'all' || inv.status === statusFilter)

  const totalInvoiced = invoiceList.reduce((sum, inv) => sum + (inv.total_amount || 0), 0)
  const paidAmount = invoiceList.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0)
  const pendingAmount = invoiceList.filter(inv => inv.status === 'pending' || inv.status === 'submitted').reduce((sum, inv) => sum + (inv.total_amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Invoices</h1>
        <p className="mt-1 text-sm text-muted-foreground">View and download your invoices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">₹{totalInvoiced.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              ₹{paidAmount.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table Card */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-b-0 border-x-0 border-border rounded-b-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Invoice ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Company</th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        <Link
                          href={`/contractor/invoices/${invoice.id}`}
                          className="text-primary hover:underline"
                        >
                          {invoice.invoice_number || invoice.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.companyName || 'Unknown Company'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        ₹{(invoice.total_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                            {(invoice.status || 'pending').charAt(0).toUpperCase() + (invoice.status || 'pending').slice(1)}
                          </Badge>
                          {invoice.paid_date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Paid: {new Date(invoice.paid_date).toLocaleDateString('en-IN')}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/contractor/invoices/${invoice.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary hover:underline"
                        >
                          View <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      {filteredInvoices.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
