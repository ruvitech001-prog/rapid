'use client';

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      leaveType: 'Casual Leave',
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      days: 3,
      reason: 'Family function',
      status: 'pending',
      appliedOn: '2024-03-01',
    },
    {
      id: '2',
      employeeName: 'Sarah Smith',
      employeeId: 'EMP002',
      leaveType: 'Sick Leave',
      startDate: '2024-03-10',
      endDate: '2024-03-11',
      days: 2,
      reason: 'Medical appointment',
      status: 'pending',
      appliedOn: '2024-03-02',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      leaveType: 'Earned Leave',
      startDate: '2024-03-20',
      endDate: '2024-03-22',
      days: 3,
      reason: 'Personal work',
      status: 'pending',
      appliedOn: '2024-03-03',
    },
    {
      id: '4',
      employeeName: 'Alice Brown',
      employeeId: 'EMP004',
      leaveType: 'Casual Leave',
      startDate: '2024-02-28',
      endDate: '2024-02-29',
      days: 2,
      reason: 'Vacation',
      status: 'approved',
      appliedOn: '2024-02-20',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const handleApprove = (requestId: string) => {
    setRequests(requests.map(req =>
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
    setSelectedRequest(null);
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
    setSelectedRequest(null);
  };

  const filteredRequests = filterStatus === 'all'
    ? requests
    : requests.filter(req => req.status === filterStatus);

  const pendingCount = requests.filter(req => req.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-[#8593A3] mt-1">Review and manage employee leave requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING REQUESTS</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">APPROVED TODAY</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">3</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">REJECTED TODAY</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">1</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL THIS MONTH</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-[#8593A3] tracking-wider">FILTER BY STATUS:</span>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All', color: '#586AF5' },
                { key: 'pending', label: 'Pending', color: '#CC7A00' },
                { key: 'approved', label: 'Approved', color: '#2DD4BF' },
                { key: 'rejected', label: 'Rejected', color: '#FF7373' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilterStatus(item.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === item.key
                      ? 'text-white'
                      : 'bg-[#F4F7FA] text-[#8593A3] hover:bg-[#DEE4EB]'
                  }`}
                  style={filterStatus === item.key ? { backgroundColor: item.color } : {}}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Leave Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">LEAVE TYPE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DURATION</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DAYS</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">APPLIED ON</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        <div className="text-sm text-[#8593A3]">{request.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.leaveType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(request.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.days} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8593A3]">
                        {new Date(request.appliedOn).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        request.status === 'pending' ? 'bg-[#CC7A00]/10 text-[#CC7A00]' :
                        request.status === 'approved' ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' :
                        'bg-[#FF7373]/10 text-[#FF7373]'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-[#586AF5] hover:underline font-medium"
                        >
                          View
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-[#2DD4BF] hover:underline font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="text-[#FF7373] hover:underline font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#8593A3]">No leave requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Leave Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-lg bg-[#F4F7FA] hover:bg-[#DEE4EB] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8593A3]" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">EMPLOYEE NAME</p>
                  <p className="text-base font-medium text-gray-900">{selectedRequest.employeeName}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">EMPLOYEE ID</p>
                  <p className="text-base font-medium text-gray-900">{selectedRequest.employeeId}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">LEAVE TYPE</p>
                  <p className="text-base font-medium text-gray-900">{selectedRequest.leaveType}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">DURATION</p>
                  <p className="text-base font-medium text-gray-900">{selectedRequest.days} days</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">START DATE</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(selectedRequest.startDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">END DATE</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(selectedRequest.endDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F4F7FA] rounded-xl">
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">REASON</p>
                <p className="text-base text-gray-900">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedRequest.id)}
                    className="border-[#FF7373] text-[#FF7373] hover:bg-[#FF7373]/10"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-white"
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
