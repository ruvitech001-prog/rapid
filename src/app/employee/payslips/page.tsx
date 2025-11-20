'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PayslipsPage() {
  const payslips = [
    { month: 'February 2024', gross: 50000, deductions: 6000, net: 44000, status: 'paid', paidOn: '2024-03-01' },
    { month: 'January 2024', gross: 50000, deductions: 6000, net: 44000, status: 'paid', paidOn: '2024-02-01' },
    { month: 'December 2023', gross: 50000, deductions: 6000, net: 44000, status: 'paid', paidOn: '2024-01-01' },
    { month: 'November 2023', gross: 50000, deductions: 6000, net: 44000, status: 'paid', paidOn: '2023-12-01' },
    { month: 'October 2023', gross: 50000, deductions: 6000, net: 44000, status: 'paid', paidOn: '2023-11-01' },
  ]

  const [selectedPayslip, setSelectedPayslip] = useState(payslips[0])

  const earnings = [
    { name: 'Basic Salary', amount: 20000 },
    { name: 'HRA', amount: 10000 },
    { name: 'Special Allowance', amount: 17500 },
    { name: 'Transport Allowance', amount: 1600 },
    { name: 'Medical Allowance', amount: 900 },
  ]

  const deductions = [
    { name: 'EPF (Employee)', amount: 2400 },
    { name: 'Professional Tax', amount: 200 },
    { name: 'TDS', amount: 3400 },
  ]

  const handleDownload = (month: string) => {
    console.log('Downloading payslip for:', month)
    alert(`Downloading payslip for ${month}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Payslips</h1>
        <p className="mt-1 text-sm text-muted-foreground">View and download your salary slips</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              ₹{selectedPayslip?.net.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Net Salary</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Year to Date (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              ₹{(payslips.reduce((sum, p) => sum + p.net, 0)).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-destructive">
              ₹{(payslips.reduce((sum, p) => sum + p.deductions, 0)).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payslip List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {payslips.map((payslip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPayslip(payslip)}
                  className={`w-full p-3 text-left hover:bg-muted/50 transition-colors ${
                    selectedPayslip?.month === payslip.month ? 'bg-primary/5 border-l-2 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{payslip.month}</p>
                      <p className="text-xs text-muted-foreground mt-1">₹{payslip.net.toLocaleString()}</p>
                    </div>
                    <Badge>Paid</Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payslip Details */}
        <Card className="lg:col-span-2">
          {/* Header */}
          <CardHeader className="border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedPayslip?.month || 'N/A'}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Paid on {selectedPayslip?.paidOn ? new Date(selectedPayslip.paidOn).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <Button
                onClick={() => handleDownload(selectedPayslip?.month || '')}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>

          {/* Earnings & Deductions */}
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Earnings */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Earnings</h3>
                <div className="space-y-2">
                  {earnings.map((earning, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{earning.name}</span>
                      <span className="font-medium">₹{earning.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-2">
                    <span>Gross Earnings</span>
                    <span className="text-primary">₹{selectedPayslip?.gross.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Deductions</h3>
                <div className="space-y-2">
                  {deductions.map((deduction, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{deduction.name}</span>
                      <span className="font-medium">₹{deduction.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-2">
                    <span>Total Deductions</span>
                    <span className="text-destructive">₹{selectedPayslip?.deductions.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="border-t border-border pt-4">
              <div className="border border-border rounded-lg p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Net Salary</span>
                  <span className="text-2xl font-semibold text-primary">
                    ₹{selectedPayslip?.net.toLocaleString() || '0'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  In words: {selectedPayslip ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(selectedPayslip.net).replace('₹', '') : '0'} Rupees Only
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-xs text-muted-foreground space-y-1">
              <p>This is a system generated payslip and does not require a signature.</p>
              <p>For any queries, please contact HR department.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
