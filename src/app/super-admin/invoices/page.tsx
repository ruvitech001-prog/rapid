'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Download, Eye, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function InvoicesPage() {
  const invoices = [
    {
      id: 'INV-2024-001',
      company: 'TechCorp Inc',
      amount: '₹12,50,000',
      date: '2024-04-01',
      dueDate: '2024-04-16',
      status: 'Pending',
      type: 'Payroll Invoice',
    },
    {
      id: 'INV-2024-002',
      company: 'Global Solutions',
      amount: '₹8,20,000',
      date: '2024-04-01',
      dueDate: '2024-04-16',
      status: 'Sent',
      type: 'Payroll Invoice',
    },
    {
      id: 'INV-2024-003',
      company: 'Innovation Labs',
      amount: '₹15,30,000',
      date: '2024-04-01',
      dueDate: '2024-04-16',
      status: 'Paid',
      type: 'Payroll Invoice',
    },
    {
      id: 'INV-2024-004',
      company: 'Digital Services',
      amount: '₹5,80,000',
      date: '2024-04-01',
      dueDate: '2024-04-16',
      status: 'Draft',
      type: 'Payroll Invoice',
    },
    {
      id: 'INV-2024-005',
      company: 'Creative Agency',
      amount: '₹4,50,000',
      date: '2024-03-01',
      dueDate: '2024-03-16',
      status: 'Paid',
      type: 'Payroll Invoice',
    },
  ]

  const invoiceStats = [
    { label: 'Total Invoiced', value: '₹46,30,000' },
    { label: 'Pending Payment', value: '₹26,10,000' },
    { label: 'Paid Invoices', value: '₹19,80,000' },
    { label: 'Outstanding', value: '₹6,30,000' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700'
      case 'Sent':
        return 'bg-blue-100 text-blue-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Draft':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices Management</h1>
          <p className="text-muted-foreground mt-2">Manage payroll and contractor invoices</p>
        </div>
        <Button asChild>
          <Link href="#generate-invoice">
            <Plus className="h-4 w-4 mr-2" />
            Generate Invoice
          </Link>
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
              <p className="text-2xl font-bold">{stat.value}</p>
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
              <Input placeholder="Search by invoice ID or company..." className="pl-10" />
            </div>
            <Button variant="outline">Filter by Status</Button>
            <Button variant="outline">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Invoice ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Company</th>
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
                    <td className="py-3 px-4 font-medium">{invoice.id}</td>
                    <td className="py-3 px-4">{invoice.company}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{invoice.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">{invoice.date}</td>
                    <td className="py-3 px-4 text-muted-foreground">{invoice.dueDate}</td>
                    <td className="py-3 px-4 text-right font-semibold">{invoice.amount}</td>
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <p className="text-2xl font-bold">2024-04-16</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Generate Now
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Last Generated</h4>
              <p className="text-2xl font-bold">2024-03-16</p>
              <p className="text-sm text-muted-foreground">5 invoices created</p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
