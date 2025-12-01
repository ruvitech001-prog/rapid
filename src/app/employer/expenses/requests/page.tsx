'use client';

import { useState, useMemo } from 'react';
import { Clock, CheckCircle, DollarSign, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useExpenseRequests,
  usePendingExpenseCount,
  useApproveExpense,
  useRejectExpense,
} from '@/lib/hooks';
import type { ExpenseClaimWithEmployee } from '@/lib/services';
import { useAuth } from '@/lib/auth';

export default function ExpenseRequestsPage() {
  const { user } = useAuth();
  const companyId = user?.companyId || undefined;
  const employerId = user?.id || '';

  const { data: expenseRequestsData = [], isLoading } = useExpenseRequests(companyId);
  const { data: pendingCount = 0 } = usePendingExpenseCount(companyId);

  const approveMutation = useApproveExpense();
  const rejectMutation = useRejectExpense();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ExpenseClaimWithEmployee | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<ExpenseClaimWithEmployee | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Calculate stats
  const pendingAmount = useMemo(() => {
    return expenseRequestsData
      .filter(req => req.status === 'pending')
      .reduce((sum, req) => sum + (Number(req.amount) || 0), 0);
  }, [expenseRequestsData]);

  const approvedThisMonth = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenseRequestsData
      .filter(req => {
        const approvedDate = req.approved_at ? new Date(req.approved_at) : null;
        return req.status === 'approved' && approvedDate && approvedDate >= startOfMonth;
      })
      .reduce((sum, req) => sum + (Number(req.amount) || 0), 0);
  }, [expenseRequestsData]);

  const totalThisMonth = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenseRequestsData
      .filter(req => {
        const createdDate = req.created_at ? new Date(req.created_at) : null;
        return createdDate && createdDate >= startOfMonth;
      })
      .reduce((sum, req) => sum + (Number(req.amount) || 0), 0);
  }, [expenseRequestsData]);

  const handleApprove = (requestId: string) => {
    approveMutation.mutate(
      { requestId, approverId: employerId },
      {
        onSuccess: () => {
          setSelectedRequest(null);
        },
      }
    );
  };

  const handleRejectClick = (request: ExpenseClaimWithEmployee) => {
    setRejectingRequest(request);
    setRejectionReason('');
  };

  const handleRejectConfirm = () => {
    if (!rejectingRequest || !rejectionReason.trim()) return;

    rejectMutation.mutate(
      {
        requestId: rejectingRequest.id,
        approverId: employerId,
        reason: rejectionReason.trim(),
      },
      {
        onSuccess: () => {
          setRejectingRequest(null);
          setRejectionReason('');
          setSelectedRequest(null);
        },
      }
    );
  };

  const filteredRequests = filterStatus === 'all'
    ? expenseRequestsData
    : expenseRequestsData.filter(req => req.status === filterStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#586AF5]" />
      </div>
    );
  }

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
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">${pendingAmount.toLocaleString('en-US')}</p>
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
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">${approvedThisMonth.toLocaleString('en-US')}</p>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">${totalThisMonth.toLocaleString('en-US')}</p>
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
                        <div className="text-sm text-[#8593A3]">{request.employeeCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.expense_category || 'General'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${Number(request.amount).toLocaleString('en-US')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8593A3]">
                        {request.expense_date
                          ? new Date(request.expense_date).toLocaleDateString('en-US')
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8593A3]">
                        {request.created_at
                          ? new Date(request.created_at).toLocaleDateString('en-US')
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        request.status === 'pending' ? 'bg-[#CC7A00]/10 text-[#CC7A00]' :
                        request.status === 'approved' ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' :
                        'bg-[#FF7373]/10 text-[#FF7373]'
                      }`}>
                        {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Unknown'}
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
                              disabled={approveMutation.isPending}
                              className="text-[#2DD4BF] hover:underline font-medium disabled:opacity-50"
                            >
                              {approveMutation.isPending ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleRejectClick(request)}
                              disabled={rejectMutation.isPending}
                              className="text-[#FF7373] hover:underline font-medium disabled:opacity-50"
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
                  <p className="text-base font-medium text-gray-900">{selectedRequest.employeeCode}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">CATEGORY</p>
                  <p className="text-base font-medium text-gray-900">{selectedRequest.expense_category || 'General'}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">AMOUNT</p>
                  <p className="text-base font-medium text-gray-900">${Number(selectedRequest.amount).toLocaleString('en-US')}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">EXPENSE DATE</p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.expense_date
                      ? new Date(selectedRequest.expense_date).toLocaleDateString('en-US')
                      : '-'}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">SUBMITTED ON</p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedRequest.created_at
                      ? new Date(selectedRequest.created_at).toLocaleDateString('en-US')
                      : '-'}
                  </p>
                </div>
                {selectedRequest.merchant_name && (
                  <div className="p-4 bg-[#F4F7FA] rounded-xl">
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">MERCHANT</p>
                    <p className="text-base font-medium text-gray-900">{selectedRequest.merchant_name}</p>
                  </div>
                )}
                {selectedRequest.payment_mode && (
                  <div className="p-4 bg-[#F4F7FA] rounded-xl">
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">PAYMENT MODE</p>
                    <p className="text-base font-medium text-gray-900">{selectedRequest.payment_mode}</p>
                  </div>
                )}
              </div>

              {selectedRequest.description && (
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">DESCRIPTION</p>
                  <p className="text-base text-gray-900">{selectedRequest.description}</p>
                </div>
              )}

              {selectedRequest.receipt_document_id && (
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">RECEIPT</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Receipt attached</span>
                    <span className="text-[#586AF5] text-sm font-medium">
                      (Document ID: {selectedRequest.receipt_document_id.slice(0, 8)}...)
                    </span>
                  </div>
                </div>
              )}

              {selectedRequest.status === 'rejected' && selectedRequest.rejection_reason && (
                <div className="p-4 bg-[#FF7373]/10 rounded-xl">
                  <p className="text-[11px] font-semibold text-[#FF7373] tracking-wider mb-2">REJECTION REASON</p>
                  <p className="text-base text-gray-900">{selectedRequest.rejection_reason}</p>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(null);
                      handleRejectClick(selectedRequest);
                    }}
                    disabled={rejectMutation.isPending}
                    className="border-[#FF7373] text-[#FF7373] hover:bg-[#FF7373]/10"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={approveMutation.isPending}
                    className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-white"
                  >
                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Reject Expense Request</h2>
              <button
                onClick={() => setRejectingRequest(null)}
                className="w-8 h-8 rounded-lg bg-[#F4F7FA] hover:bg-[#DEE4EB] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8593A3]" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-[#8593A3]">
                Rejecting expense request for <span className="font-medium text-gray-900">{rejectingRequest.employeeName}</span> - ${Number(rejectingRequest.amount).toLocaleString('en-US')} ({rejectingRequest.expense_category || 'General'})
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reason for Rejection <span className="text-[#FF7373]">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this expense request..."
                  className="w-full px-4 py-3 rounded-xl border border-[#DEE4EB] focus:outline-none focus:ring-2 focus:ring-[#586AF5] resize-none"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setRejectingRequest(null)}
                  className="border-[#DEE4EB]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRejectConfirm}
                  disabled={!rejectionReason.trim() || rejectMutation.isPending}
                  className="bg-[#FF7373] hover:bg-[#FF7373]/90 text-white disabled:opacity-50"
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Reject Request'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
