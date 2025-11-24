'use client';

import { useState } from 'react';

interface Request {
  id: string;
  type: 'leave' | 'expense' | 'document' | 'access';
  employee: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export default function RequestsPage() {
  const [requests] = useState<Request[]>([
    {
      id: '1',
      type: 'leave',
      employee: 'John Smith',
      description: 'Annual leave for 5 days',
      status: 'pending',
      date: '2024-01-28',
    },
    {
      id: '2',
      type: 'expense',
      employee: 'Emma Wilson',
      description: 'Business travel expenses - ₹15,000',
      status: 'pending',
      date: '2024-01-27',
    },
    {
      id: '3',
      type: 'document',
      employee: 'Michael Brown',
      description: 'Request for certificate of service',
      status: 'approved',
      date: '2024-01-26',
    },
    {
      id: '4',
      type: 'access',
      employee: 'Sarah Davis',
      description: 'Request for new system access',
      status: 'rejected',
      date: '2024-01-25',
    },
  ]);

  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRequests = requests.filter(req =>
    (filterType === 'all' || req.type === filterType) &&
    (filterStatus === 'all' || req.status === filterStatus)
  );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      leave: 'bg-blue-100 text-blue-800',
      expense: 'bg-yellow-100 text-yellow-800',
      document: 'bg-purple-100 text-purple-800',
      access: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-600 mt-2">Review and manage employee requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{requests.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="leave">Leave</option>
                <option value="expense">Expense</option>
                <option value="document">Document</option>
                <option value="access">Access</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getTypeColor(req.type)}`}>
                      {req.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{req.employee}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{req.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{req.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {req.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                        <button className="text-red-600 hover:text-red-900">Reject</button>
                      </>
                    )}
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
