'use client';

import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Report</h1>
            <p className="text-gray-600 mt-2">View and analyze employee attendance data</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Present</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{totalPresent}</p>
            <p className="text-xs text-gray-500 mt-1">Days</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Absent</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{totalAbsent}</p>
            <p className="text-xs text-gray-500 mt-1">Days</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Leave</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{totalLeave}</p>
            <p className="text-xs text-gray-500 mt-1">Days</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Avg Attendance</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{avgAttendance.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">Percentage</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late Arrival
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((record) => (
                <tr key={record.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                      <div className="text-sm text-gray-500">{record.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {record.present} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {record.absent} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {record.leave} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {record.lateArrival} times
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">
                        {record.attendancePercentage}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            record.attendancePercentage >= 90 ? 'bg-green-600' :
                            record.attendancePercentage >= 75 ? 'bg-yellow-600' :
                            'bg-red-600'
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

        {/* Department-wise Summary */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Department-wise Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.filter(d => d !== 'all').map((dept) => {
              const deptData = attendanceData.filter(emp => emp.department === dept);
              const deptAvg = deptData.reduce((sum, emp) => sum + emp.attendancePercentage, 0) / deptData.length;
              return (
                <div key={dept} className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{dept}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{deptAvg.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500 mt-1">{deptData.length} employees</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
