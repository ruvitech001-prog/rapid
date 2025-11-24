'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function HolidaysPage() {
  const [holidays] = useState([
    { id: 1, name: 'New Year Day', date: '2025-01-01', type: 'National', optional: false },
    { id: 2, name: 'Republic Day', date: '2025-01-26', type: 'National', optional: false },
    { id: 3, name: 'Holi', date: '2025-03-14', type: 'National', optional: false },
    { id: 4, name: 'Good Friday', date: '2025-04-18', type: 'National', optional: false },
    { id: 5, name: 'Independence Day', date: '2025-08-15', type: 'National', optional: false },
    { id: 6, name: 'Diwali', date: '2025-10-20', type: 'National', optional: false },
    { id: 7, name: 'Christmas', date: '2025-12-25', type: 'National', optional: false },
    { id: 8, name: 'Company Founding Day', date: '2025-06-10', type: 'Optional', optional: true },
  ]);

  const getTypeColor = (type: string) => {
    return type === 'National'
      ? 'bg-red-50 text-red-700'
      : 'bg-blue-50 text-blue-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Holidays</h1>
          <p className="text-slate-600 mt-1">Manage company holidays and important dates</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={20} />
          Add Holiday
        </button>
      </div>

      {/* Holidays Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Holiday Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {holidays.map((holiday) => (
              <tr key={holiday.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{holiday.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(holiday.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.type)}`}
                  >
                    {holiday.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-600">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded transition-colors text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Holiday Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-600 text-sm">Total Holidays</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{holidays.length}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm">National Holidays</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {holidays.filter((h) => h.type === 'National').length}
            </p>
          </div>
          <div>
            <p className="text-slate-600 text-sm">Optional Holidays</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {holidays.filter((h) => h.type === 'Optional').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
