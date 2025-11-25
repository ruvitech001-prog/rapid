'use client';

import { useState } from 'react';
import { Calendar, Download, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Timesheet {
  id: number;
  employee: string;
  employeeId: string;
  hours: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  week: string;
  submittedDate: string;
}

export default function TimesheetPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-11');

  const [timesheets] = useState<Timesheet[]>([
    { id: 1, employee: 'John Doe', employeeId: 'EMP001', hours: 160, status: 'Approved', week: 'Week 1', submittedDate: '2024-11-08' },
    { id: 2, employee: 'Jane Smith', employeeId: 'EMP002', hours: 156, status: 'Pending', week: 'Week 1', submittedDate: '2024-11-08' },
    { id: 3, employee: 'Mike Johnson', employeeId: 'EMP003', hours: 160, status: 'Approved', week: 'Week 1', submittedDate: '2024-11-07' },
    { id: 4, employee: 'John Doe', employeeId: 'EMP001', hours: 158, status: 'Approved', week: 'Week 2', submittedDate: '2024-11-15' },
    { id: 5, employee: 'Jane Smith', employeeId: 'EMP002', hours: 160, status: 'Approved', week: 'Week 2', submittedDate: '2024-11-15' },
    { id: 6, employee: 'Sarah Wilson', employeeId: 'EMP004', hours: 40, status: 'Rejected', week: 'Week 1', submittedDate: '2024-11-08' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'Pending':
        return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      case 'Rejected':
        return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' };
      default:
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
    }
  };

  const totalHours = timesheets.reduce((sum, t) => sum + t.hours, 0);
  const approvedCount = timesheets.filter(t => t.status === 'Approved').length;
  const pendingCount = timesheets.filter(t => t.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-[#8593A3] mt-1">Review and approve employee timesheets</p>
        </div>
        <Button variant="outline" className="gap-2 border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL SUBMISSIONS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{timesheets.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL HOURS</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">{totalHours}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">APPROVED</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{approvedCount}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-[#8593A3] tracking-wider block mb-2">SELECT MONTH</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8593A3]" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full pl-10 h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['All', 'Pending', 'Approved', 'Rejected'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#F4F7FA] text-[#8593A3] hover:bg-[#DEE4EB] transition-all"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timesheets Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Timesheet Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">WEEK</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">HOURS</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">SUBMITTED</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {timesheets.map((timesheet) => {
                  const statusColors = getStatusColor(timesheet.status);
                  return (
                    <tr key={timesheet.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{timesheet.employee}</div>
                          <div className="text-sm text-[#8593A3]">{timesheet.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timesheet.week}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{timesheet.hours} hrs</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                        {new Date(timesheet.submittedDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                          {timesheet.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-sm font-medium text-[#586AF5] hover:underline">
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
