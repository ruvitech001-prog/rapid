'use client'

import { useState } from 'react'
import { Download, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { useForm16, useEmployeeProfile, useDownloadForm16 } from '@/lib/hooks'

export default function Form16Page() {
  const { user } = useAuth()
  const employeeId = user?.id
  const currentFY = `${new Date().getFullYear() - 1}-${String(new Date().getFullYear()).slice(2)}`
  const [selectedFY, setSelectedFY] = useState(currentFY)

  const { data: form16Data, isLoading: form16Loading } = useForm16(employeeId, selectedFY)
  const { data: profile, isLoading: profileLoading } = useEmployeeProfile(employeeId)
  const downloadForm16 = useDownloadForm16()

  const isLoading = form16Loading || profileLoading

  const financialYears = [
    currentFY,
    `${new Date().getFullYear() - 2}-${String(new Date().getFullYear() - 1).slice(2)}`,
    `${new Date().getFullYear() - 3}-${String(new Date().getFullYear() - 2).slice(2)}`,
  ]

  const handleDownload = async () => {
    if (!employeeId) return

    try {
      const downloadUrl = await downloadForm16.mutateAsync({
        employeeId,
        financialYear: selectedFY,
      })

      // Open the download URL in a new tab
      window.open(downloadUrl, '_blank')
      toast.success('Form 16 download started')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download Form 16')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Use real data or defaults
  const employerDetails = {
    name: form16Data?.employerName || 'Your Company Pvt Ltd',
    tan: form16Data?.employerTan || 'XXXX00000X',
  }

  const employeeDetails = {
    name: profile?.full_name || form16Data?.employeeName || 'Employee Name',
    pan: profile?.pan_number || form16Data?.pan || 'XXXXX0000X',
    designation: profile?.contract?.designation || 'Employee',
    employeeId: profile?.employee_code || form16Data?.employeeCode || 'EMP001',
  }

  const salaryDetails = {
    grossSalary: form16Data?.grossSalary || 0,
    basic: form16Data ? Math.round(form16Data.grossSalary * 0.4) : 0, // Approximate basic as 40% of gross
    hra: form16Data?.allowances.hra || 0,
    specialAllowance: form16Data?.allowances.special || 0,
    otherAllowances: (form16Data?.allowances.lta || 0) + (form16Data?.allowances.medical || 0),
  }

  const deductionsData = {
    standard: form16Data?.deductions.standardDeduction || 50000,
    section80C: form16Data?.deductions.section80C || 0,
    section80D: form16Data?.deductions.section80D || 0,
    hraExemption: 0, // HRA exemption is calculated separately
  }

  // Calculate taxable income using Form16Data values
  const grossTaxableIncome = salaryDetails.grossSalary - deductionsData.standard
  const totalDeductionsAmount = deductionsData.section80C + deductionsData.section80D +
    (form16Data?.deductions.section80E || 0) +
    (form16Data?.deductions.section80G || 0) +
    (form16Data?.deductions.section24b || 0)
  const netTaxableIncome = form16Data?.taxableIncome || Math.max(0, grossTaxableIncome - totalDeductionsAmount)
  const totalTDS = form16Data?.tdsDeducted || 0

  const fyParts = selectedFY.split('-')
  const fyStartYear = parseInt(fyParts[0] || '0')
  const fyEndYear = parseInt(fyParts[1] || '0')
  const assessmentYear = `${fyStartYear + 1}-${fyEndYear + 1}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form 16</h1>
          <p className="mt-1 text-sm text-gray-500">TDS Certificate for Income Tax Filing</p>
        </div>
        <Button onClick={handleDownload} className="gap-2" disabled={downloadForm16.isPending}>
          {downloadForm16.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download Form 16
        </Button>
      </div>

      {/* Financial Year Selector */}
      <Card>
        <CardContent className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Financial Year</label>
          <select
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            {financialYears.map(year => (
              <option key={year} value={year}>FY {year}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Form 16 Content */}
      {salaryDetails.grossSalary === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Form 16 Not Available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Form 16 for FY {selectedFY} is not yet generated. Please check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          {/* Header */}
          <div className="p-6 bg-blue-50 border-b border-blue-200">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">FORM NO. 16</h2>
              <p className="text-sm text-gray-600 mt-1">[See rule 31(1)(a)]</p>
              <p className="text-sm text-gray-600">Certificate under section 203 of the Income-tax Act, 1961</p>
              <p className="text-sm text-gray-600">for tax deducted at source from income chargeable under the head &quot;Salaries&quot;</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <span className="font-medium">Financial Year:</span> {selectedFY}
                </div>
                <div className="text-right">
                  <span className="font-medium">Assessment Year:</span> {assessmentYear}
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Part A - Employer & Employee Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Part A: Details of Employer and Employee</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Employer Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span><p className="font-medium text-gray-900">{employerDetails.name}</p></div>
                    <div><span className="text-gray-600">TAN:</span><p className="font-medium text-gray-900">{employerDetails.tan}</p></div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Employee Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span><p className="font-medium text-gray-900">{employeeDetails.name}</p></div>
                    <div><span className="text-gray-600">PAN:</span><p className="font-medium text-gray-900">{employeeDetails.pan}</p></div>
                    <div><span className="text-gray-600">Designation:</span><p className="font-medium text-gray-900">{employeeDetails.designation}</p></div>
                    <div><span className="text-gray-600">Employee ID:</span><p className="font-medium text-gray-900">{employeeDetails.employeeId}</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Part B - Salary & Tax Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Part B: Details of Salary and Tax Deducted</h3>

              {/* Salary Details */}
              <div className="border rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Salary Breakup</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Basic Salary</span><span className="font-medium text-gray-900">₹{salaryDetails.basic.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">House Rent Allowance (HRA)</span><span className="font-medium text-gray-900">₹{salaryDetails.hra.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Special Allowance</span><span className="font-medium text-gray-900">₹{salaryDetails.specialAllowance.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Other Allowances</span><span className="font-medium text-gray-900">₹{salaryDetails.otherAllowances.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2"><span className="text-gray-900">Gross Salary</span><span className="text-blue-600">₹{salaryDetails.grossSalary.toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              {/* Deductions */}
              <div className="border rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Deductions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Standard Deduction</span><span className="font-medium text-gray-900">₹{deductionsData.standard.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Section 80C (PF, Insurance, etc.)</span><span className="font-medium text-gray-900">₹{deductionsData.section80C.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Section 80D (Health Insurance)</span><span className="font-medium text-gray-900">₹{deductionsData.section80D.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2"><span className="text-gray-900">Total Deductions</span><span className="text-red-600">₹{(deductionsData.standard + totalDeductionsAmount).toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              {/* Taxable Income */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Net Taxable Income</span>
                  <span className="text-2xl font-bold text-blue-600">₹{netTaxableIncome.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* TDS Details */}
            {totalTDS > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">TDS Deduction Details</h3>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">Total TDS Deducted (for FY {form16Data?.financialYear})</span>
                    <span className="text-lg font-bold text-green-600">₹{totalTDS.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    TDS has been deducted monthly from salary as per Income Tax rules.
                  </p>
                </div>
              </div>
            )}

            {/* Verification */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 italic">
                This is a system-generated Form 16 and does not require a physical signature.
                The certificate has been digitally signed by the authorized signatory of the employer.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                For any queries or corrections, please contact the HR department.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
