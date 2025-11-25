'use client';

import { useState } from 'react';
import { Clock, DollarSign, CheckCircle, Calendar, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheet Approvals</h1>
          <p className="text-[#8593A3] mt-1">Review and approve contractor timesheets</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING TIMESHEETS</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">APPROVED THIS WEEK</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">₹1.26L</p>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">₹5.2L</p>
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

      {/* Timesheets List */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Timesheets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACTOR</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">WEEK ENDING</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">HOURS WORKED</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">RATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL AMOUNT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredTimesheets.map((timesheet) => (
                  <tr key={timesheet.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{timesheet.contractorName}</div>
                        <div className="text-sm text-[#8593A3]">{timesheet.contractorId}</div>
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
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        timesheet.status === 'pending' ? 'bg-[#CC7A00]/10 text-[#CC7A00]' :
                        timesheet.status === 'approved' ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' :
                        'bg-[#FF7373]/10 text-[#FF7373]'
                      }`}>
                        {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTimesheet(timesheet)}
                          className="text-[#586AF5] hover:underline font-medium"
                        >
                          View
                        </button>
                        {timesheet.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(timesheet.id)}
                              className="text-[#2DD4BF] hover:underline font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(timesheet.id)}
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
          {filteredTimesheets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#8593A3]">No timesheets found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedTimesheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Timesheet Details</h2>
              <button
                onClick={() => setSelectedTimesheet(null)}
                className="w-8 h-8 rounded-lg bg-[#F4F7FA] hover:bg-[#DEE4EB] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8593A3]" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">CONTRACTOR NAME</p>
                  <p className="text-base font-medium text-gray-900">{selectedTimesheet.contractorName}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">CONTRACTOR ID</p>
                  <p className="text-base font-medium text-gray-900">{selectedTimesheet.contractorId}</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">WEEK ENDING</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(selectedTimesheet.weekEnding).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">SUBMITTED ON</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(selectedTimesheet.submittedOn).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">HOURS WORKED</p>
                  <p className="text-base font-medium text-gray-900">{selectedTimesheet.hoursWorked} hours</p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">HOURLY RATE</p>
                  <p className="text-base font-medium text-gray-900">
                    ₹{selectedTimesheet.rate.toLocaleString('en-IN')}/hr
                  </p>
                </div>
                <div className="p-4 bg-[#F4F7FA] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">TOTAL AMOUNT</p>
                  <p className="text-base font-medium text-[#2DD4BF]">
                    ₹{selectedTimesheet.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F4F7FA] rounded-xl">
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">WORK DESCRIPTION</p>
                <p className="text-base text-gray-900">{selectedTimesheet.description}</p>
              </div>

              {selectedTimesheet.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedTimesheet.id)}
                    className="border-[#FF7373] text-[#FF7373] hover:bg-[#FF7373]/10"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedTimesheet.id)}
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
