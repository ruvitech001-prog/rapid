'use client';

import { useParams } from 'next/navigation';
import { Download, ChevronLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function PayslipDetailPage() {
  const params = useParams();
  const monthParam = params.month as string;

  // Convert URL parameter to readable format
  const monthDisplay = monthParam.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Sample payslip data
  const payslipData = {
    month: monthDisplay,
    employee: 'John Doe',
    employeeId: 'EMP-001',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    salary: '$5,000.00',
    earnings: {
      basicSalary: '$3,000.00',
      dearness: '$500.00',
      houseRent: '$800.00',
      conveyance: '$200.00',
      medical: '$300.00',
      other: '$200.00',
    },
    deductions: {
      incomeTax: '$450.00',
      providentFund: '$350.00',
      employeeContribution: '$200.00',
      other: '$100.00',
    },
    netSalary: '$4,200.00',
  };

  const totalEarnings = Object.values(payslipData.earnings)
    .reduce((sum, val) => sum + parseFloat(val.replace('$', '').replace(',', '')), 0);

  const totalDeductions = Object.values(payslipData.deductions)
    .reduce((sum, val) => sum + parseFloat(val.replace('$', '').replace(',', '')), 0);

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
          <h1 className="text-3xl font-bold text-slate-900">Payslip - {monthDisplay}</h1>
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
              <p className="text-lg font-bold text-slate-900">Aether Inc.</p>
              <p className="text-sm text-slate-600">Address: 123 Business Park</p>
              <p className="text-sm text-slate-600">City, State ZIP</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">Employee</h3>
              <p className="text-lg font-bold text-slate-900">{payslipData.employee}</p>
              <p className="text-sm text-slate-600">ID: {payslipData.employeeId}</p>
              <p className="text-sm text-slate-600">Department: {payslipData.department}</p>
            </div>
          </div>
        </div>

        {/* Earnings and Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Earnings</h3>
            <div className="space-y-3">
              {Object.entries(payslipData.earnings).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-slate-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-slate-900 font-medium">{value}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <span className="font-semibold text-slate-900">Gross Salary</span>
                <span className="font-bold text-slate-900">${totalEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Deductions</h3>
            <div className="space-y-3">
              {Object.entries(payslipData.deductions).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-slate-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-slate-900 font-medium">{value}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <span className="font-semibold text-slate-900">Total Deductions</span>
                <span className="font-bold text-slate-900">${totalDeductions.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-900">Net Salary (Take Home)</span>
            <span className="text-2xl font-bold text-green-700">{payslipData.netSalary}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            This is an electronically generated payslip and does not require a signature.
          </p>
          <p className="text-xs text-slate-500 mt-4">
            For queries regarding this payslip, please contact HR at hr@aether.com
          </p>
        </div>
      </div>
    </div>
  );
}
