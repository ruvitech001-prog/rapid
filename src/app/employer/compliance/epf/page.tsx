'use client';

import { useState } from 'react';
import { Users, DollarSign, Building2, Download, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EPFRecord {
  employeeId: string;
  employeeName: string;
  uan: string;
  basicSalary: number;
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
}

export default function EPFReportPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-03');

  const [epfRecords] = useState<EPFRecord[]>([
    {
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      uan: '100123456789',
      basicSalary: 40000,
      employeeContribution: 4800,
      employerContribution: 4800,
      totalContribution: 9600,
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Sarah Smith',
      uan: '100987654321',
      basicSalary: 50000,
      employeeContribution: 6000,
      employerContribution: 6000,
      totalContribution: 12000,
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      uan: '100456789123',
      basicSalary: 30000,
      employeeContribution: 3600,
      employerContribution: 3600,
      totalContribution: 7200,
    },
  ]);

  const totalEmployeeContribution = epfRecords.reduce((sum, rec) => sum + rec.employeeContribution, 0);
  const totalEmployerContribution = epfRecords.reduce((sum, rec) => sum + rec.employerContribution, 0);
  const totalContribution = epfRecords.reduce((sum, rec) => sum + rec.totalContribution, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EPF Compliance Report</h1>
          <p className="text-[#8593A3] mt-1">Employee Provident Fund contributions and compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="gap-2 border-[#2DD4BF] text-[#2DD4BF] hover:bg-[#2DD4BF]/10">
            <Download className="h-4 w-4" />
            Download ECR
          </Button>
          <Button size="lg" className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Month Selection */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="space-y-2">
            <Label htmlFor="month" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SELECT MONTH</Label>
            <input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-64 h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL EMPLOYEES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{epfRecords.length}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE CONTRIBUTION</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">₹{totalEmployeeContribution.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYER CONTRIBUTION</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">₹{totalEmployerContribution.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL EPF</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">₹{totalContribution.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EPF Details Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">EPF Contribution Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">UAN</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">BASIC SALARY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE (12%)</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYER (12%)</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {epfRecords.map((record) => (
                  <tr key={record.employeeId} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-[#8593A3]">{record.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.uan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{record.basicSalary.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#586AF5]">
                        ₹{record.employeeContribution.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#CC7A00]">
                        ₹{record.employerContribution.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#2DD4BF]">
                        ₹{record.totalContribution.toLocaleString('en-IN')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#F4F7FA] border-t border-[#DEE4EB]">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    Total:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#586AF5]">
                      ₹{totalEmployeeContribution.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#CC7A00]">
                      ₹{totalEmployerContribution.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#2DD4BF]">
                      ₹{totalContribution.toLocaleString('en-IN')}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Information */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">Compliance Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-[#F4F7FA] rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2DD4BF]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">EPF Calculation</p>
                <p className="text-sm text-[#8593A3]">Employee and Employer contribution calculated at 12% of basic salary</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[#F4F7FA] rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2DD4BF]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Due Date</p>
                <p className="text-sm text-[#8593A3]">EPF payment due by 15th of next month</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[#F4F7FA] rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2DD4BF]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">ECR Format</p>
                <p className="text-sm text-[#8593A3]">Download ECR file in standard format for EPF portal upload</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
