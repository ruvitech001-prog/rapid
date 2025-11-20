'use client'

import { useState } from 'react'

export default function Form16Page() {
  const [selectedFY, setSelectedFY] = useState('2023-24')

  const form16Data = {
    financialYear: '2023-24',
    assessmentYear: '2024-25',
    employerDetails: {
      name: 'Acme Corporation Pvt Ltd',
      tan: 'DELE12345F',
      pan: 'AAACE1234F',
      address: '123 Business Park, Bangalore, Karnataka - 560001',
    },
    employeeDetails: {
      name: 'John Doe',
      pan: 'ABCDE1234F',
      designation: 'Senior Developer',
      employeeId: 'EMP001',
    },
    salaryDetails: {
      grossSalary: 600000,
      basic: 240000,
      hra: 120000,
      specialAllowance: 210000,
      otherAllowances: 30000,
    },
    deductions: {
      standard: 50000,
      section80C: 150000,
      section80D: 25000,
      hraExemption: 40000,
    },
    tdsDetails: [
      { quarter: 'Q1 (Apr-Jun)', amount: 8500, depositDate: '2023-07-07', challanNo: 'CH001' },
      { quarter: 'Q2 (Jul-Sep)', amount: 8500, depositDate: '2023-10-07', challanNo: 'CH002' },
      { quarter: 'Q3 (Oct-Dec)', amount: 8500, depositDate: '2024-01-07', challanNo: 'CH003' },
      { quarter: 'Q4 (Jan-Mar)', amount: 8500, depositDate: '2024-04-07', challanNo: 'CH004' },
    ],
  }

  const grossTaxableIncome = form16Data.salaryDetails.grossSalary - form16Data.deductions.standard - form16Data.deductions.hraExemption
  const totalDeductions = form16Data.deductions.section80C + form16Data.deductions.section80D
  const netTaxableIncome = grossTaxableIncome - totalDeductions
  const totalTDS = form16Data.tdsDetails.reduce((sum, q) => sum + q.amount, 0)

  const handleDownload = () => {
    alert('Downloading Form 16 PDF...')
  }

  const financialYears = ['2023-24', '2022-23', '2021-22']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form 16</h1>
          <p className="mt-1 text-sm text-gray-500">TDS Certificate for Income Tax Filing</p>
        </div>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Form 16
        </button>
      </div>

      {/* Financial Year Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Financial Year</label>
        <select
          value={selectedFY}
          onChange={(e) => setSelectedFY(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          {financialYears.map(year => (
            <option key={year} value={year}>FY {year}</option>
          ))}
        </select>
      </div>

      {/* Form 16 Document */}
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">FORM NO. 16</h2>
            <p className="text-sm text-gray-600 mt-1">[See rule 31(1)(a)]</p>
            <p className="text-sm text-gray-600">Certificate under section 203 of the Income-tax Act, 1961</p>
            <p className="text-sm text-gray-600">for tax deducted at source from income chargeable under the head "Salaries"</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <span className="font-medium">Financial Year:</span> {form16Data.financialYear}
              </div>
              <div className="text-right">
                <span className="font-medium">Assessment Year:</span> {form16Data.assessmentYear}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Part A - Employer & Employee Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Part A: Details of Employer and Employee</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employer Details */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Employer Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium text-gray-900">{form16Data.employerDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">TAN:</span>
                    <p className="font-medium text-gray-900">{form16Data.employerDetails.tan}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">PAN:</span>
                    <p className="font-medium text-gray-900">{form16Data.employerDetails.pan}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium text-gray-900">{form16Data.employerDetails.address}</p>
                  </div>
                </div>
              </div>

              {/* Employee Details */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Employee Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium text-gray-900">{form16Data.employeeDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">PAN:</span>
                    <p className="font-medium text-gray-900">{form16Data.employeeDetails.pan}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Designation:</span>
                    <p className="font-medium text-gray-900">{form16Data.employeeDetails.designation}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Employee ID:</span>
                    <p className="font-medium text-gray-900">{form16Data.employeeDetails.employeeId}</p>
                  </div>
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-medium text-gray-900">₹{form16Data.salaryDetails.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">House Rent Allowance (HRA)</span>
                  <span className="font-medium text-gray-900">₹{form16Data.salaryDetails.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Special Allowance</span>
                  <span className="font-medium text-gray-900">₹{form16Data.salaryDetails.specialAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Allowances</span>
                  <span className="font-medium text-gray-900">₹{form16Data.salaryDetails.otherAllowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span className="text-gray-900">Gross Salary</span>
                  <span className="text-blue-600">₹{form16Data.salaryDetails.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Deductions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Standard Deduction</span>
                  <span className="font-medium text-gray-900">₹{form16Data.deductions.standard.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HRA Exemption</span>
                  <span className="font-medium text-gray-900">₹{form16Data.deductions.hraExemption.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Section 80C (PF, Insurance, etc.)</span>
                  <span className="font-medium text-gray-900">₹{form16Data.deductions.section80C.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Section 80D (Health Insurance)</span>
                  <span className="font-medium text-gray-900">₹{form16Data.deductions.section80D.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span className="text-gray-900">Total Deductions</span>
                  <span className="text-red-600">₹{(form16Data.deductions.standard + form16Data.deductions.hraExemption + totalDeductions).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Taxable Income */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Net Taxable Income</span>
                <span className="text-2xl font-bold text-blue-600">₹{netTaxableIncome.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* TDS Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">TDS Deduction Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quarter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TDS Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposit Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Challan No.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {form16Data.tdsDetails.map((quarter, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quarter.quarter}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{quarter.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(quarter.depositDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quarter.challanNo}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total TDS</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      ₹{totalTDS.toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  )
}
