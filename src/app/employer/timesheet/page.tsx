'use client';

import { useState } from 'react';
import { Calendar, Filter, Download } from 'lucide-react';

export default function TimesheetPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-11');

  const timesheets = [
    { id: 1, employee: 'John Doe', hours: 160, status: 'Approved', week: 'Week 1' },
    { id: 2, employee: 'Jane Smith', hours: 156, status: 'Pending', week: 'Week 1' },
    { id: 3, employee: 'Mike Johnson', hours: 160, status: 'Approved', week: 'Week 1' },
    { id: 4, employee: 'John Doe', hours: 158, status: 'Approved', week: 'Week 2' },
    { id: 5, employee: 'Jane Smith', hours: 160, status: 'Approved', week: 'Week 2' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Timesheets</h1>
          <p className="text-slate-600 mt-1">Review and approve employee timesheets</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
          <Filter size={20} />
          Filter
        </button>
      </div>

      {/* Timesheets Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Employee</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Week</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Hours</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {timesheets.map((timesheet) => (
              <tr key={timesheet.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{timesheet.employee}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{timesheet.week}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{timesheet.hours} hrs</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      timesheet.status === 'Approved'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    {timesheet.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline text-sm font-medium">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
