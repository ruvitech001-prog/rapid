'use client';

import { useState } from 'react';

interface Timesheet {
  id: string;
  contractorName: string;
  contractorId: string;
  weekEnding: string;
  hoursWorked: number;
  rate: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedOn: string;
  description: string;
}

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([
    {
      id: '1',
      contractorName: 'Robert Wilson',
      contractorId: 'CON001',
      weekEnding: '2024-03-15',
      hoursWorked: 40,
      rate: 2500,
      totalAmount: 100000,
      status: 'pending',
      submittedOn: '2024-03-16',
      description: 'Frontend development work on dashboard module',
    },
    {
      id: '2',
      contractorName: 'Emily Davis',
      contractorId: 'CON002',
      weekEnding: '2024-03-15',
      hoursWorked: 35,
      rate: 2200,
      totalAmount: 77000,
      status: 'pending',
      submittedOn: '2024-03-16',
      description: 'UI/UX design for mobile application',
    },
    {
      id: '3',
      contractorName: 'James Miller',
      contractorId: 'CON003',
      weekEnding: '2024-03-08',
      hoursWorked: 45,
      rate: 2800,
      totalAmount: 126000,
      status: 'approved',
      submittedOn: '2024-03-09',
      description: 'DevOps infrastructure setup and maintenance',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);

  const handleApprove = (timesheetId: string) => {
    setTimesheets(timesheets.map(ts =>
      ts.id === timesheetId ? { ...ts, status: 'approved' } : ts
    ));
    setSelectedTimesheet(null);
  };

  const handleReject = (timesheetId: string) => {
    setTimesheets(timesheets.map(ts =>
      ts.id === timesheetId ? { ...ts, status: 'rejected' } : ts
    ));
    setSelectedTimesheet(null);
  };

  const filteredTimesheets = filterStatus === 'all'
    ? timesheets
    : timesheets.filter(ts => ts.status === filterStatus);

  const pendingCount = timesheets.filter(ts => ts.status === 'pending').length;
  const pendingAmount = timesheets
    .filter(ts => ts.status === 'pending')
    .reduce((sum, ts) => sum + ts.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Timesheet Approvals</h1>
          <p className="text-gray-600 mt-2">Review and approve contractor timesheets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Pending Timesheets</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Pending Amount</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">₹{pendingAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Approved This Week</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹1.26L</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹5.2L</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Timesheets List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contractor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week Ending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTimesheets.map((timesheet) => (
                <tr key={timesheet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{timesheet.contractorName}</div>
                      <div className="text-sm text-gray-500">{timesheet.contractorId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(timesheet.weekEnding).toLocaleDateString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{timesheet.hoursWorked} hrs</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{timesheet.rate.toLocaleString('en-IN')}/hr</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{timesheet.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      timesheet.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      timesheet.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {timesheet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedTimesheet(timesheet)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    {timesheet.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(timesheet.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(timesheet.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTimesheets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No timesheets found.</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedTimesheet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Timesheet Details</h2>
                <button
                  onClick={() => setSelectedTimesheet(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Contractor Name</p>
                    <p className="text-base font-medium text-gray-900">{selectedTimesheet.contractorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contractor ID</p>
                    <p className="text-base font-medium text-gray-900">{selectedTimesheet.contractorId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Week Ending</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(selectedTimesheet.weekEnding).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(selectedTimesheet.submittedOn).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hours Worked</p>
                    <p className="text-base font-medium text-gray-900">{selectedTimesheet.hoursWorked} hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-base font-medium text-gray-900">
                      ₹{selectedTimesheet.rate.toLocaleString('en-IN')}/hr
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-base font-medium text-green-600">
                      ₹{selectedTimesheet.totalAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Work Description</p>
                  <p className="text-base text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedTimesheet.description}</p>
                </div>

                {selectedTimesheet.status === 'pending' && (
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      onClick={() => handleReject(selectedTimesheet.id)}
                      className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedTimesheet.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
