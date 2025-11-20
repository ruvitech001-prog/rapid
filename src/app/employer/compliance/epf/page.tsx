'use client';

import { useState } from 'react';

interface EPFRecord {
  employeeId: string;
  employeeName: string;
  uan: string;
  basicSalary: number;
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
}

export default function EPFReportPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-03');

  const [epfRecords] = useState<EPFRecord[]>([
    {
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      uan: '100123456789',
      basicSalary: 40000,
      employeeContribution: 4800,
      employerContribution: 4800,
      totalContribution: 9600,
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Sarah Smith',
      uan: '100987654321',
      basicSalary: 50000,
      employeeContribution: 6000,
      employerContribution: 6000,
      totalContribution: 12000,
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      uan: '100456789123',
      basicSalary: 30000,
      employeeContribution: 3600,
      employerContribution: 3600,
      totalContribution: 7200,
    },
  ]);

  const totalEmployeeContribution = epfRecords.reduce((sum, rec) => sum + rec.employeeContribution, 0);
  const totalEmployerContribution = epfRecords.reduce((sum, rec) => sum + rec.employerContribution, 0);
  const totalContribution = epfRecords.reduce((sum, rec) => sum + rec.totalContribution, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EPF Compliance Report</h1>
            <p className="text-gray-600 mt-2">Employee Provident Fund contributions and compliance</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Download ECR
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Month Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Month
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{epfRecords.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Employee Contribution</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalEmployeeContribution.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Employer Contribution</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">₹{totalEmployerContribution.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total EPF</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{totalContribution.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* EPF Details Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">EPF Contribution Details</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee (12%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employer (12%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {epfRecords.map((record) => (
                <tr key={record.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                      <div className="text-sm text-gray-500">{record.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.uan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{record.basicSalary.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600">
                      ₹{record.employeeContribution.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-purple-600">
                      ₹{record.employerContribution.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ₹{record.totalContribution.toLocaleString('en-IN')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-blue-600">
                    ₹{totalEmployeeContribution.toLocaleString('en-IN')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-purple-600">
                    ₹{totalEmployerContribution.toLocaleString('en-IN')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-green-600">
                    ₹{totalContribution.toLocaleString('en-IN')}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Compliance Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Information</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">EPF Calculation</p>
                <p className="text-sm text-gray-600">Employee and Employer contribution calculated at 12% of basic salary</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Due Date</p>
                <p className="text-sm text-gray-600">EPF payment due by 15th of next month</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">ECR Format</p>
                <p className="text-sm text-gray-600">Download ECR file in standard format for EPF portal upload</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
