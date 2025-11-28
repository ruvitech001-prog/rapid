'use client';

import { useState } from 'react';
import { Clock, CheckCircle, DollarSign, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExpenseRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  receipt?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedOn: string;
}

export default function ExpenseRequestsPage() {
  const [requests, setRequests] = useState<ExpenseRequest[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      category: 'Travel',
      amount: 15000,
      date: '2024-03-10',
      description: 'Flight tickets for client meeting in Mumbai',
      receipt: 'receipt_001.pdf',
      status: 'pending',
      submittedOn: '2024-03-11',
    },
    {
      id: '2',
      employeeName: 'Sarah Smith',
      employeeId: 'EMP002',
      category: 'Food & Beverage',
      amount: 3500,
      date: '2024-03-08',
      description: 'Team lunch with clients',
      receipt: 'receipt_002.pdf',
      status: 'pending',
      submittedOn: '2024-03-09',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      category: 'Office Supplies',
      amount: 2500,
      date: '2024-03-05',
      description: 'Laptop accessories and stationery',
      receipt: 'receipt_003.pdf',
      status: 'pending',
      submittedOn: '2024-03-06',
    },
    {
      id: '4',
      employeeName: 'Alice Brown',
      employeeId: 'EMP004',
      category: 'Travel',
      amount: 8000,
      date: '2024-03-01',
      description: 'Hotel accommodation for conference',
      receipt: 'receipt_004.pdf',
      status: 'approved',
      submittedOn: '2024-03-02',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ExpenseRequest | null>(null);

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
  const pendingAmount = requests
    .filter(req => req.status === 'pending')
    .reduce((sum, req) => sum + req.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Requests</h1>
          <p className="text-[#8593A3] mt-1">Review and approve employee expense claims</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING AMOUNT</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">₹{pendingAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">APPROVED THIS MONTH</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">₹45,000</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL THIS MONTH</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹74,000</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#586AF5]" />
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
          <CardTitle className="text-gray-900">Expense Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CATEGORY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">AMOUNT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">SUBMITTED ON</th>
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
                      <div className="text-sm text-gray-900">{request.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{request.amount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8593A3]">
                        {new Date(request.date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8593A3]">
                        {new Date(request.submittedOn).toLocaleDateString('en-IN')}
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
              <p className="text-[#8593A3]">No expense requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Expense Request Details</h2>
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
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">CATEGORY</p>
                  <p className="text-base font-medium text-gray-900">{selectedRequest.category}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">AMOUNT</p>
                  <p className="text-base font-medium text-gray-900">₹{selectedRequest.amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">EXPENSE DATE</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(selectedRequest.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">SUBMITTED ON</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(selectedRequest.submittedOn).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F4F7FA] rounded-xl">
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">DESCRIPTION</p>
                <p className="text-base text-gray-900">{selectedRequest.description}</p>
              </div>

              {selectedRequest.receipt && (
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">RECEIPT</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{selectedRequest.receipt}</span>
                    <button className="text-[#586AF5] hover:underline text-sm font-medium">Download</button>
                  </div>
                </div>
              )}

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
