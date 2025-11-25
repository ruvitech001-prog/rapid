'use client';

import { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  present: number;
  absent: number;
  leave: number;
  lateArrival: number;
  totalWorkingDays: number;
  attendancePercentage: number;
}

export default function AttendanceReportPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const [attendanceData] = useState<AttendanceRecord[]>([
    {
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Engineering',
      present: 22,
      absent: 1,
      leave: 2,
      lateArrival: 3,
      totalWorkingDays: 25,
      attendancePercentage: 88,
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Sarah Smith',
      department: 'Product',
      present: 24,
      absent: 0,
      leave: 1,
      lateArrival: 1,
      totalWorkingDays: 25,
      attendancePercentage: 96,
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      department: 'Design',
      present: 20,
      absent: 2,
      leave: 3,
      lateArrival: 2,
      totalWorkingDays: 25,
      attendancePercentage: 80,
    },
    {
      employeeId: 'EMP004',
      employeeName: 'Alice Brown',
      department: 'Human Resources',
      present: 25,
      absent: 0,
      leave: 0,
      lateArrival: 0,
      totalWorkingDays: 25,
      attendancePercentage: 100,
    },
  ]);

  const departments = ['all', ...new Set(attendanceData.map(emp => emp.department))];

  const filteredData = filterDepartment === 'all'
    ? attendanceData
    : attendanceData.filter(emp => emp.department === filterDepartment);

  const totalPresent = filteredData.reduce((sum, emp) => sum + emp.present, 0);
  const totalAbsent = filteredData.reduce((sum, emp) => sum + emp.absent, 0);
  const totalLeave = filteredData.reduce((sum, emp) => sum + emp.leave, 0);
  const avgAttendance = filteredData.reduce((sum, emp) => sum + emp.attendancePercentage, 0) / filteredData.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
          <p className="text-[#8593A3] mt-1">View and analyze employee attendance data</p>
        </div>
        <Button size="lg" className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SELECT MONTH</Label>
              <input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DEPARTMENT</Label>
              <select
                id="department"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL PRESENT</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{totalPresent}</p>
                <p className="text-xs text-[#8593A3] mt-1">Days</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL ABSENT</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{totalAbsent}</p>
                <p className="text-xs text-[#8593A3] mt-1">Days</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL LEAVE</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{totalLeave}</p>
                <p className="text-xs text-[#8593A3] mt-1">Days</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">AVG ATTENDANCE</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">{avgAttendance.toFixed(1)}%</p>
                <p className="text-xs text-[#8593A3] mt-1">Percentage</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Attendance Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DEPARTMENT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">PRESENT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ABSENT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">LEAVE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">LATE ARRIVAL</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ATTENDANCE %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredData.map((record) => (
                  <tr key={record.employeeId} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-[#8593A3]">{record.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF]">
                        {record.present} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-[#FF7373]/10 text-[#FF7373]">
                        {record.absent} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-[#CC7A00]/10 text-[#CC7A00]">
                        {record.leave} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-[#586AF5]/10 text-[#586AF5]">
                        {record.lateArrival} times
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          {record.attendancePercentage}%
                        </div>
                        <div className="w-16 bg-[#DEE4EB] rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              record.attendancePercentage >= 90 ? 'bg-[#2DD4BF]' :
                              record.attendancePercentage >= 75 ? 'bg-[#CC7A00]' :
                              'bg-[#FF7373]'
                            }`}
                            style={{ width: `${record.attendancePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Department-wise Summary */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">Department-wise Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.filter(d => d !== 'all').map((dept) => {
              const deptData = attendanceData.filter(emp => emp.department === dept);
              const deptAvg = deptData.reduce((sum, emp) => sum + emp.attendancePercentage, 0) / deptData.length;
              return (
                <div key={dept} className="p-4 border border-[#DEE4EB] rounded-xl hover:border-[#586AF5] transition-colors">
                  <p className="text-sm font-medium text-gray-900">{dept}</p>
                  <p className="text-2xl font-bold text-[#586AF5] mt-2">{deptAvg.toFixed(1)}%</p>
                  <p className="text-xs text-[#8593A3] mt-1">{deptData.length} employees</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
