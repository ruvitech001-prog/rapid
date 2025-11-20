'use client';

import { useState } from 'react';

interface TDSRecord {
  employeeId: string;
  employeeName: string;
  pan: string;
  grossSalary: number;
  taxableIncome: number;
  tdsDeducted: number;
  taxRegime: 'old' | 'new';
}

export default function TDSReportPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4-2024');

  const [tdsRecords] = useState<TDSRecord[]>([
    {
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      pan: 'ABCDE1234F',
      grossSalary: 720000,
      taxableIncome: 600000,
      tdsDeducted: 45000,
      taxRegime: 'new',
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Sarah Smith',
      pan: 'FGHIJ5678K',
      grossSalary: 900000,
      taxableIncome: 800000,
      tdsDeducted: 72000,
      taxRegime: 'old',
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      pan: 'LMNOP9012Q',
      grossSalary: 540000,
      taxableIncome: 450000,
      tdsDeducted: 22500,
      taxRegime: 'new',
    },
  ]);

  const totalTDS = tdsRecords.reduce((sum, rec) => sum + rec.tdsDeducted, 0);
  const totalTaxableIncome = tdsRecords.reduce((sum, rec) => sum + rec.taxableIncome, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TDS Compliance Report</h1>
            <p className="text-gray-600 mt-2">Tax Deducted at Source reporting and compliance</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Download Form 24Q
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Quarter Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Quarter
          </label>
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Q1-2024">Q1 2024 (Apr-Jun)</option>
            <option value="Q2-2024">Q2 2024 (Jul-Sep)</option>
            <option value="Q3-2024">Q3 2024 (Oct-Dec)</option>
            <option value="Q4-2024">Q4 2024 (Jan-Mar)</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{tdsRecords.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Taxable Income</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalTaxableIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total TDS Deducted</p>
            <p className="text-3xl font-bold text-red-600 mt-2">₹{totalTDS.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Avg Tax Rate</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {((totalTDS / totalTaxableIncome) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* TDS Details Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">TDS Deduction Details</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxable Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TDS Deducted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Regime
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tdsRecords.map((record) => (
                <tr key={record.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                      <div className="text-sm text-gray-500">{record.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.pan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{record.grossSalary.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      ₹{record.taxableIncome.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-600">
                      ₹{record.tdsDeducted.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.taxRegime === 'new' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {record.taxRegime === 'new' ? 'New Regime' : 'Old Regime'}
                    </span>
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
                    ₹{totalTaxableIncome.toLocaleString('en-IN')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-red-600">
                    ₹{totalTDS.toLocaleString('en-IN')}
                  </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Compliance Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Filing Details</h3>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Form 24Q</p>
                  <p className="text-sm text-gray-600">Quarterly TDS return for salary income</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Form 16</p>
                  <p className="text-sm text-gray-600">Annual TDS certificate for employees</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Due Dates</h3>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">TDS Payment</p>
                  <p className="text-sm text-gray-600">7th of following month</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quarterly Return</p>
                  <p className="text-sm text-gray-600">31st of month following quarter end</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
