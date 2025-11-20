'use client';

import { useState } from 'react';

interface EmployeePayroll {
  id: string;
  employeeName: string;
  employeeId: string;
  basicSalary: number;
  allowances: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'failed';
}

export default function RunPayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [payrollData] = useState<EmployeePayroll[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      basicSalary: 40000,
      allowances: 20000,
      grossSalary: 60000,
      deductions: 8400,
      netSalary: 51600,
      status: 'pending',
    },
    {
      id: '2',
      employeeName: 'Sarah Smith',
      employeeId: 'EMP002',
      basicSalary: 50000,
      allowances: 25000,
      grossSalary: 75000,
      deductions: 10500,
      netSalary: 64500,
      status: 'pending',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      basicSalary: 30000,
      allowances: 15000,
      grossSalary: 45000,
      deductions: 6300,
      netSalary: 38700,
      status: 'pending',
    },
  ]);

  const [step, setStep] = useState<'review' | 'process' | 'complete'>('review');

  const totalGross = payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0);
  const totalDeductions = payrollData.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalNet = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);

  const handleProcessPayroll = () => {
    setStep('process');
    setTimeout(() => {
      setStep('complete');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Run Payroll</h1>
          <p className="text-gray-600 mt-2">Process monthly payroll for all employees</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'review' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'review' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {step === 'review' ? '1' : '✓'}
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
            <div className="w-24 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${
              step === 'process' ? 'text-blue-600' :
              step === 'complete' ? 'text-green-600' :
              'text-gray-400'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'process' ? 'bg-blue-600 text-white' :
                step === 'complete' ? 'bg-green-600 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {step === 'complete' ? '✓' : '2'}
              </div>
              <span className="ml-2 font-medium">Process</span>
            </div>
            <div className="w-24 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step === 'complete' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Review Step */}
        {step === 'review' && (
          <>
            {/* Month Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payroll Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Total Gross Salary</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalGross.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-3xl font-bold text-red-600 mt-2">₹{totalDeductions.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Total Net Payable</p>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{totalNet.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Payroll Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Employee Payroll Details</h2>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allowances
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Salary
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollData.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{employee.basicSalary.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{employee.allowances.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{employee.grossSalary.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        ₹{employee.deductions.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ₹{employee.netSalary.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Download Preview
              </button>
              <button
                onClick={handleProcessPayroll}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Process Payroll
              </button>
            </div>
          </>
        )}

        {/* Processing Step */}
        {step === 'process' && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payroll...</h2>
            <p className="text-gray-600">Please wait while we process the payroll for all employees</p>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payroll Processed Successfully!</h2>
            <p className="text-gray-600 mb-8">
              Payroll for {new Date(selectedMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} has been processed
            </p>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-3 gap-6 text-left">
                <div>
                  <p className="text-sm text-gray-600">Employees Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{payrollData.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalNet.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Download Payslips
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Download Report
              </button>
              <button
                onClick={() => window.location.href = '/employer/payroll/dashboard'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
