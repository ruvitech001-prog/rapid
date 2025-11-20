'use client';

import { useState } from 'react';

interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export default function ReportsPage() {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      name: 'Payroll Summary Report',
      description: 'Comprehensive payroll summary with salary breakdowns',
      category: 'Payroll',
      icon: 'payroll',
    },
    {
      id: '2',
      name: 'Attendance Report',
      description: 'Employee attendance tracking and analysis',
      category: 'Attendance',
      icon: 'attendance',
    },
    {
      id: '3',
      name: 'Leave Balance Report',
      description: 'Current leave balances for all employees',
      category: 'Leave',
      icon: 'leave',
    },
    {
      id: '4',
      name: 'Expense Claims Report',
      description: 'Employee expense claims and reimbursements',
      category: 'Expenses',
      icon: 'expenses',
    },
    {
      id: '5',
      name: 'EPF Compliance Report',
      description: 'EPF contributions and compliance details',
      category: 'Compliance',
      icon: 'compliance',
    },
    {
      id: '6',
      name: 'TDS Report',
      description: 'Tax deducted at source reporting',
      category: 'Compliance',
      icon: 'compliance',
    },
    {
      id: '7',
      name: 'Contractor Payments Report',
      description: 'Contractor timesheets and payments',
      category: 'Contractors',
      icon: 'contractors',
    },
    {
      id: '8',
      name: 'Department-wise Cost Report',
      description: 'Cost analysis by department',
      category: 'Analytics',
      icon: 'analytics',
    },
    {
      id: '9',
      name: 'Headcount Report',
      description: 'Employee headcount trends and analytics',
      category: 'Analytics',
      icon: 'analytics',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(reports.map(r => r.category))];

  const filteredReports = selectedCategory === 'all'
    ? reports
    : reports.filter(r => r.category === selectedCategory);

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'payroll':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'attendance':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'leave':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'expenses':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'compliance':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'contractors':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'analytics':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="text-gray-600 mt-2">Generate and download various HR and payroll reports</p>
        </div>

        {/* Category Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Reports' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                  {getIconComponent(report.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {report.category}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-900 font-medium">
                        Generate
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Payroll Summary Report - March 2024</p>
                <p className="text-xs text-gray-500 mt-1">Generated on Mar 15, 2024 at 3:45 PM</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-900 font-medium">
                Download
              </button>
            </div>
            <div className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Attendance Report - February 2024</p>
                <p className="text-xs text-gray-500 mt-1">Generated on Mar 1, 2024 at 10:20 AM</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-900 font-medium">
                Download
              </button>
            </div>
            <div className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">EPF Compliance Report - Q4 2024</p>
                <p className="text-xs text-gray-500 mt-1">Generated on Feb 28, 2024 at 2:15 PM</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-900 font-medium">
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scheduled Reports</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Monthly Payroll Summary</p>
                  <p className="text-xs text-gray-500">Runs on 1st of every month at 9:00 AM</p>
                </div>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Weekly Attendance Report</p>
                  <p className="text-xs text-gray-500">Runs every Monday at 8:00 AM</p>
                </div>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
