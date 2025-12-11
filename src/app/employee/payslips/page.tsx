'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { useEmployeePayrollHistory, useCurrentPayslip } from '@/lib/hooks'

export default function PayslipsPage() {
  const { user } = useAuth()
  const employeeId = user?.id
  const { data: payrollHistory, isLoading: historyLoading } = useEmployeePayrollHistory(employeeId, 12)
  const { data: currentPayslip, isLoading: payslipLoading } = useCurrentPayslip(employeeId)

  const [selectedIndex, setSelectedIndex] = useState(0)

  const isLoading = historyLoading || payslipLoading

  // Get selected payslip data
  const selectedPayslip = payrollHistory?.[selectedIndex]

  // Calculate YTD totals
  const ytdNet = payrollHistory?.reduce((sum, p) => sum + p.netPay, 0) || 0
  const ytdDeductions = payrollHistory?.reduce((sum, p) => sum + p.deductions, 0) || 0

  const handleDownload = (month: string) => {
    if (!selectedPayslip) {
      toast.error('No payslip selected')
      return
    }

    toast.info(`Preparing payslip for ${month}...`)

    // Generate printable payslip content
    const payslipContent = `
PAYSLIP - ${month}
================================

EMPLOYEE DETAILS
----------------
Name: ${user?.name || 'Employee'}
Employee ID: ${user?.id || 'N/A'}

EARNINGS
--------
${earnings.map(e => `${e.name.padEnd(25)} ₹${e.amount.toLocaleString()}`).join('\n')}
${'─'.repeat(40)}
Gross Earnings:${' '.repeat(13)} ₹${selectedPayslip.grossPay.toLocaleString()}

DEDUCTIONS
----------
${deductions.map(d => `${d.name.padEnd(25)} ₹${d.amount.toLocaleString()}`).join('\n')}
${'─'.repeat(40)}
Total Deductions:${' '.repeat(11)} ₹${selectedPayslip.deductions.toLocaleString()}

================================
NET SALARY: ₹${selectedPayslip.netPay.toLocaleString()}
================================

This is a system generated payslip.
Generated on: ${new Date().toLocaleString()}
    `

    // Create and trigger download
    const blob = new Blob([payslipContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payslip-${month.replace(' ', '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast.success(`Payslip for ${month} downloaded`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!payrollHistory || payrollHistory.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Payslips</h1>
          <p className="mt-1 text-sm text-muted-foreground">View and download your salary slips</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payslips available yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your payslips will appear here after your first salary is processed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Build earnings and deductions from current payslip data
  const earnings = currentPayslip ? [
    { name: 'Basic Salary', amount: currentPayslip.basicSalary },
    { name: 'HRA', amount: currentPayslip.hra },
    { name: 'LTA', amount: currentPayslip.lta },
    { name: 'Medical Allowance', amount: currentPayslip.medicalAllowance },
    { name: 'Special Allowance', amount: currentPayslip.specialAllowance },
    { name: 'Telephone Allowance', amount: currentPayslip.telephoneAllowance },
    { name: 'Performance Bonus', amount: currentPayslip.performanceBonus },
  ].filter(e => e.amount > 0) : []

  const deductions = currentPayslip ? [
    { name: 'EPF (Employee)', amount: currentPayslip.epfEmployee },
    { name: 'ESIC (Employee)', amount: currentPayslip.esicEmployee },
    { name: 'Professional Tax', amount: currentPayslip.professionalTax },
    { name: 'Income Tax (TDS)', amount: currentPayslip.incomeTax },
  ].filter(d => d.amount > 0) : []

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
              ₹{(selectedPayslip?.netPay || 0).toLocaleString()}
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
              ₹{ytdNet.toLocaleString()}
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
              ₹{ytdDeductions.toLocaleString()}
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
              {payrollHistory.map((payslip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-full p-3 text-left hover:bg-muted/50 transition-colors ${
                    selectedIndex === idx ? 'bg-primary/5 border-l-2 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{payslip.month} {payslip.year}</p>
                      <p className="text-xs text-muted-foreground mt-1">₹{payslip.netPay.toLocaleString()}</p>
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
                <CardTitle>{selectedPayslip ? `${selectedPayslip.month} ${selectedPayslip.year}` : 'N/A'}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Salary for {selectedPayslip ? `${selectedPayslip.month} ${selectedPayslip.year}` : 'N/A'}
                </p>
              </div>
              <Button
                onClick={() => handleDownload(selectedPayslip ? `${selectedPayslip.month} ${selectedPayslip.year}` : '')}
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
                    <span className="text-primary">₹{(selectedPayslip?.grossPay || 0).toLocaleString()}</span>
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
                    <span className="text-destructive">₹{(selectedPayslip?.deductions || 0).toLocaleString()}</span>
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
                    ₹{(selectedPayslip?.netPay || 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  In words: {selectedPayslip ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(selectedPayslip.netPay).replace('₹', '') : '0'} Rupees Only
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
