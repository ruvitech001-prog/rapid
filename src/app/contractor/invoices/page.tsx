'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  const invoices = [
    { id: 'INV-2024-003', date: '2024-02-28', amount: 20000, hours: 40, status: 'paid', paidOn: '2024-03-05' },
    { id: 'INV-2024-002', date: '2024-02-14', amount: 20000, hours: 40, status: 'pending', paidOn: null },
    { id: 'INV-2024-001', date: '2024-01-31', amount: 19000, hours: 38, status: 'paid', paidOn: '2024-02-07' },
  ]

  const filteredInvoices = invoices.filter(inv => statusFilter === 'all' || inv.status === statusFilter)

  const handleDownload = (invoiceId: string) => {
    alert(`Downloading ${invoiceId}...`)
  }

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
            <p className="text-2xl font-semibold">₹{invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              ₹{invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              ₹{invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
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
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto border border-b-0 border-x-0 border-border rounded-b-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Invoice ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Hours</th>
                  <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.hours} hrs</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">₹{invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                        {invoice.paidOn && (
                          <p className="text-xs text-muted-foreground mt-1">Paid: {new Date(invoice.paidOn).toLocaleDateString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(invoice.id)}
                        className="text-primary hover:text-primary"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
