'use client'

import { useParams } from 'next/navigation'
import { Download, ChevronLeft, Printer, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useCurrentPayslip, useEmployeeProfile } from '@/lib/hooks'

export default function PayslipDetailPage() {
  const params = useParams()
  const monthParam = params.month as string
  const { user } = useAuth()
  const employeeId = user?.id

  const { data: payslip, isLoading: payslipLoading } = useCurrentPayslip(employeeId)
  const { data: profile, isLoading: profileLoading } = useEmployeeProfile(employeeId)

  const isLoading = payslipLoading || profileLoading

  // Convert URL parameter to readable format
  const monthDisplay = monthParam.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!payslip) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/employee/payslips"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payslip - {monthDisplay}</h1>
            <p className="text-slate-600 mt-1">Payslip not found</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-muted-foreground">No payslip data available for this month.</p>
        </div>
      </div>
    )
  }

  // Build earnings and deductions from individual fields
  const earnings = [
    { name: 'Basic Salary', amount: payslip.basicSalary },
    { name: 'HRA', amount: payslip.hra },
    { name: 'LTA', amount: payslip.lta },
    { name: 'Medical Allowance', amount: payslip.medicalAllowance },
    { name: 'Special Allowance', amount: payslip.specialAllowance },
    { name: 'Telephone Allowance', amount: payslip.telephoneAllowance },
    { name: 'Performance Bonus', amount: payslip.performanceBonus },
  ].filter(e => e.amount > 0)

  const deductions = [
    { name: 'EPF (Employee)', amount: payslip.epfEmployee },
    { name: 'ESIC (Employee)', amount: payslip.esicEmployee },
    { name: 'Professional Tax', amount: payslip.professionalTax },
    { name: 'Income Tax (TDS)', amount: payslip.incomeTax },
  ].filter(d => d.amount > 0)

  const totalEarnings = payslip.grossEarnings
  const totalDeductions = payslip.totalDeductions

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/employee/payslips"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payslip - {payslip.month} {payslip.year}</h1>
          <p className="text-slate-600 mt-1">View and download your detailed payslip</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Download size={20} />
          Download PDF
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
          <Printer size={20} />
          Print
        </button>
      </div>

      {/* Payslip Details */}
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        {/* Company and Employee Info */}
        <div className="mb-8 pb-8 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">Company</h3>
              <p className="text-lg font-bold text-slate-900">{profile?.contract?.companyName || 'Company'}</p>
              <p className="text-sm text-slate-600">Pay Period: {payslip.month} {payslip.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">Employee</h3>
              <p className="text-lg font-bold text-slate-900">{profile?.full_name || 'Employee'}</p>
              <p className="text-sm text-slate-600">ID: {profile?.employee_code || 'N/A'}</p>
              <p className="text-sm text-slate-600">Department: {profile?.contract?.department || 'N/A'}</p>
              <p className="text-sm text-slate-600">Designation: {profile?.contract?.designation || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Earnings and Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Earnings</h3>
            <div className="space-y-3">
              {earnings.map((earning, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-600">{earning.name}</span>
                  <span className="text-slate-900 font-medium">₹{earning.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <span className="font-semibold text-slate-900">Gross Salary</span>
                <span className="font-bold text-slate-900">₹{totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Deductions</h3>
            <div className="space-y-3">
              {deductions.map((deduction, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-600">{deduction.name}</span>
                  <span className="text-slate-900 font-medium">₹{deduction.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <span className="font-semibold text-slate-900">Total Deductions</span>
                <span className="font-bold text-slate-900">₹{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-900">Net Salary (Take Home)</span>
            <span className="text-2xl font-bold text-green-700">₹{payslip.netPay.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            This is an electronically generated payslip and does not require a signature.
          </p>
          <p className="text-xs text-slate-500 mt-4">
            For queries regarding this payslip, please contact HR
          </p>
        </div>
      </div>
    </div>
  )
}
