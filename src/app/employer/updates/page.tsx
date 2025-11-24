'use client';

import { useState } from 'react';
import { Bell, Trash2, Clock } from 'lucide-react';

export default function UpdatesPage() {
  const [updates] = useState([
    {
      id: 1,
      title: 'Payroll Processing Complete',
      description: 'November payroll has been successfully processed and dispatched.',
      date: '2024-11-20',
      type: 'payroll',
      read: false,
    },
    {
      id: 2,
      title: 'New Employee Onboarded',
      description: 'Sarah Johnson has completed onboarding.',
      date: '2024-11-18',
      type: 'employee',
      read: false,
    },
    {
      id: 3,
      title: 'Leave Approval Pending',
      description: '3 leave requests awaiting your approval.',
      date: '2024-11-15',
      type: 'leave',
      read: true,
    },
    {
      id: 4,
      title: 'System Maintenance Scheduled',
      description: 'System will be under maintenance on Nov 25 from 2-4 PM.',
      date: '2024-11-10',
      type: 'system',
      read: true,
    },
    {
      id: 5,
      title: 'Compliance Report Due',
      description: 'Monthly compliance report is due on Nov 30.',
      date: '2024-11-05',
      type: 'compliance',
      read: true,
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payroll':
        return 'bg-green-50 text-green-700';
      case 'employee':
        return 'bg-blue-50 text-blue-700';
      case 'leave':
        return 'bg-yellow-50 text-yellow-700';
      case 'compliance':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Updates</h1>
          <p className="text-slate-600 mt-1">Stay informed with the latest updates</p>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className={`rounded-lg border p-6 transition-colors ${
              update.read
                ? 'bg-white border-slate-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{update.title}</h3>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                      update.type
                    )}`}
                  >
                    {update.type}
                  </span>
                </div>
                <p className="text-slate-600 mb-3">{update.description}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={16} />
                  {new Date(update.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-600">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
