'use client';

import { useState } from 'react';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  status: 'success' | 'failure';
  details: string;
}

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      action: 'Employee Added',
      user: 'Sarah Johnson',
      timestamp: '2024-01-28 10:30 AM',
      status: 'success',
      details: 'Added new employee: John Smith',
    },
    {
      id: '2',
      action: 'Payroll Processed',
      user: 'Mike Chen',
      timestamp: '2024-01-27 3:15 PM',
      status: 'success',
      details: 'Processed January 2024 payroll for 150 employees',
    },
    {
      id: '3',
      action: 'Access Revoked',
      user: 'Sarah Johnson',
      timestamp: '2024-01-26 2:00 PM',
      status: 'success',
      details: 'Revoked access for user: Lisa Chen',
    },
    {
      id: '4',
      action: 'Leave Approved',
      user: 'Mike Chen',
      timestamp: '2024-01-25 11:20 AM',
      status: 'success',
      details: 'Approved leave request for James Wilson (5 days)',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredLogs = logs.filter(log =>
    filterStatus === 'all' || log.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-2">Track all system activities and changes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Activities</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{logs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Successful</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {logs.filter(l => l.status === 'success').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {logs.filter(l => l.status === 'failure').length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.action}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.timestamp}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.details}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
