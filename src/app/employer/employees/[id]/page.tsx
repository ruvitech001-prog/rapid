'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, User, Briefcase, Building, CreditCard, FileText, MapPin, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  employeeId: string;
  joinDate: string;
  status: string;
  salary: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  aadhaarNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface LeaveRecord {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
}

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: string;
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const [employee] = useState<Employee>({
    id: params.id as string,
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+91 9876543210',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    employeeId: 'EMP001',
    joinDate: '2023-01-15',
    status: 'active',
    salary: 1200000,
    bankName: 'HDFC Bank',
    accountNumber: '1234567890',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '1234 5678 9012',
    address: '123 Main Street, Apartment 4B',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
  });

  const [leaveRecords] = useState<LeaveRecord[]>([
    { id: '1', type: 'Casual Leave', startDate: '2024-01-10', endDate: '2024-01-12', days: 3, status: 'Approved' },
    { id: '2', type: 'Sick Leave', startDate: '2024-02-05', endDate: '2024-02-05', days: 1, status: 'Approved' },
  ]);

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    { date: '2024-03-01', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '9.25', status: 'Present' },
    { date: '2024-03-02', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9.00', status: 'Present' },
    { date: '2024-03-03', checkIn: '09:30 AM', checkOut: '06:45 PM', hours: '9.25', status: 'Present' },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'leave' | 'attendance'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'leave' as const, label: 'Leave History', icon: Calendar },
    { id: 'attendance' as const, label: 'Attendance', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/employer/employees">
            <Button variant="outline" size="icon" className="border-[#DEE4EB] hover:bg-[#F4F7FA]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-[#8593A3] mt-1">{employee.designation} - {employee.department}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA] gap-2">
            <Link href={`/employer/employees/${employee.id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit Employee
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id ? 'bg-[#586AF5] text-white' : 'text-[#8593A3] hover:bg-[#F4F7FA]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-[#586AF5]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'FULL NAME', value: employee.name },
                  { label: 'EMPLOYEE ID', value: employee.employeeId },
                  { label: 'EMAIL', value: employee.email },
                  { label: 'PHONE', value: employee.phone },
                  { label: 'JOIN DATE', value: new Date(employee.joinDate).toLocaleDateString('en-IN') },
                  { label: 'STATUS', value: employee.status, badge: true },
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-[#F4F7FA] rounded-xl">
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">{item.label}</p>
                    {item.badge ? (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] capitalize">
                        {item.value}
                      </span>
                    ) : (
                      <p className="text-base font-medium text-gray-900">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#586AF5]" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'DESIGNATION', value: employee.designation },
                  { label: 'DEPARTMENT', value: employee.department },
                  { label: 'ANNUAL CTC', value: `₹${employee.salary.toLocaleString('en-IN')}` },
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-[#F4F7FA] rounded-xl">
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">{item.label}</p>
                    <p className="text-base font-medium text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#586AF5]" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'BANK NAME', value: employee.bankName },
                  { label: 'ACCOUNT NUMBER', value: employee.accountNumber },
                  { label: 'IFSC CODE', value: employee.ifscCode },
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-[#F4F7FA] rounded-xl">
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">{item.label}</p>
                    <p className="text-base font-medium text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Details */}
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#586AF5]" />
                Compliance Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'PAN NUMBER', value: employee.panNumber },
                  { label: 'AADHAAR NUMBER', value: employee.aadhaarNumber },
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-[#F4F7FA] rounded-xl">
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-1">{item.label}</p>
                    <p className="text-base font-medium text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#586AF5]" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-[#F4F7FA] rounded-xl">
                <p className="text-base text-gray-900">{employee.address}</p>
                <p className="text-base text-gray-900 mt-1">{employee.city}, {employee.state} - {employee.pincode}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leave Tab */}
      {activeTab === 'leave' && (
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-gray-900">Leave History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">LEAVE TYPE</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">START DATE</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">END DATE</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DAYS</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE4EB]">
                  {leaveRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(record.startDate).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(record.endDate).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.days}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF]">
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-gray-900">Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DATE</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CHECK IN</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CHECK OUT</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">HOURS</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE4EB]">
                  {attendanceRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-[#F4F7FA]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(record.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkIn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkOut}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.hours} hrs</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF]">
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
