'use client';

import { useState } from 'react';
import { Activity, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const selectClass = "h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-[#8593A3] mt-1">Track all system activities and changes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL ACTIVITIES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{logs.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Activity className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SUCCESSFUL</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">
                  {logs.filter(l => l.status === 'success').length}
                </p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">FAILED</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">
                  {logs.filter(l => l.status === 'failure').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-[#8593A3] tracking-wider">FILTER BY STATUS:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={selectClass}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTION</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">USER</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TIMESTAMP</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.action}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8593A3]">{log.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        log.status === 'success' ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' : 'bg-[#FF7373]/10 text-[#FF7373]'
                      }`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#8593A3]">{log.details}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
