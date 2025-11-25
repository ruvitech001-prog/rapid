'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DollarSign, TrendingDown, CheckCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EmployeePayroll {
  id: string;
  employeeName: string;
  employeeId: string;
  basicSalary: number;
  allowances: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'failed';
}

export default function RunPayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [payrollData] = useState<EmployeePayroll[]>([
    { id: '1', employeeName: 'John Doe', employeeId: 'EMP001', basicSalary: 40000, allowances: 20000, grossSalary: 60000, deductions: 8400, netSalary: 51600, status: 'pending' },
    { id: '2', employeeName: 'Sarah Smith', employeeId: 'EMP002', basicSalary: 50000, allowances: 25000, grossSalary: 75000, deductions: 10500, netSalary: 64500, status: 'pending' },
    { id: '3', employeeName: 'Mike Johnson', employeeId: 'EMP003', basicSalary: 30000, allowances: 15000, grossSalary: 45000, deductions: 6300, netSalary: 38700, status: 'pending' },
  ]);

  const [step, setStep] = useState<'review' | 'process' | 'complete'>('review');

  const totalGross = payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0);
  const totalDeductions = payrollData.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalNet = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);

  const handleProcessPayroll = () => {
    setStep('process');
    setTimeout(() => setStep('complete'), 2000);
  };

  const inputClass = "h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Run Payroll</h1>
        <p className="text-[#8593A3] mt-1">Process monthly payroll for all employees</p>
      </div>

      {/* Progress Steps */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'review' ? 'text-[#586AF5]' : 'text-[#2DD4BF]'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step === 'review' ? 'bg-[#586AF5] text-white' : 'bg-[#2DD4BF] text-white'
              }`}>
                {step === 'review' ? '1' : <CheckCircle className="h-5 w-5" />}
              </div>
              <span className="font-medium">Review</span>
            </div>
            <div className="w-24 h-1 bg-[#DEE4EB]"></div>
            <div className={`flex items-center gap-2 ${
              step === 'process' ? 'text-[#586AF5]' : step === 'complete' ? 'text-[#2DD4BF]' : 'text-[#8593A3]'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step === 'process' ? 'bg-[#586AF5] text-white' : step === 'complete' ? 'bg-[#2DD4BF] text-white' : 'bg-[#DEE4EB] text-[#8593A3]'
              }`}>
                {step === 'complete' ? <CheckCircle className="h-5 w-5" /> : '2'}
              </div>
              <span className="font-medium">Process</span>
            </div>
            <div className="w-24 h-1 bg-[#DEE4EB]"></div>
            <div className={`flex items-center gap-2 ${step === 'complete' ? 'text-[#2DD4BF]' : 'text-[#8593A3]'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step === 'complete' ? 'bg-[#2DD4BF] text-white' : 'bg-[#DEE4EB] text-[#8593A3]'
              }`}>
                3
              </div>
              <span className="font-medium">Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Step */}
      {step === 'review' && (
        <>
          {/* Month Selection */}
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardContent className="p-5">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SELECT PAYROLL MONTH</Label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={inputClass}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL GROSS SALARY</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalGross.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#586AF5]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL DEDUCTIONS</p>
                    <p className="text-3xl font-bold text-[#FF7373] mt-2">₹{totalDeductions.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-[#FF7373]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL NET PAYABLE</p>
                    <p className="text-3xl font-bold text-[#2DD4BF] mt-2">₹{totalNet.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-[#2DD4BF]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payroll Data Table */}
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-gray-900">Employee Payroll Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                    <tr>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE</th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">BASIC SALARY</th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ALLOWANCES</th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">GROSS SALARY</th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DEDUCTIONS</th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">NET SALARY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEE4EB]">
                    {payrollData.map((employee) => (
                      <tr key={employee.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                            <div className="text-sm text-[#8593A3]">{employee.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{employee.basicSalary.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{employee.allowances.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{employee.grossSalary.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#FF7373]">₹{employee.deductions.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2DD4BF]">₹{employee.netSalary.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA] gap-2">
              <Download className="h-4 w-4" />
              Download Preview
            </Button>
            <Button onClick={handleProcessPayroll} className="bg-[#642DFC] hover:bg-[#5020d9]">
              Process Payroll
            </Button>
          </div>
        </>
      )}

      {/* Processing Step */}
      {step === 'process' && (
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#586AF5] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payroll...</h2>
            <p className="text-[#8593A3]">Please wait while we process the payroll for all employees</p>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-[#2DD4BF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-[#2DD4BF]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payroll Processed Successfully!</h2>
            <p className="text-[#8593A3] mb-8">
              Payroll for {new Date(selectedMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} has been processed
            </p>

            {/* Summary */}
            <div className="bg-[#F4F7FA] rounded-xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-6 text-left">
                <div>
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEES PROCESSED</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{payrollData.length}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL AMOUNT</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalNet.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</p>
                  <span className="inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF]">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3">
              <Button variant="outline" className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]">
                Download Payslips
              </Button>
              <Button variant="outline" className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]">
                Download Report
              </Button>
              <Button asChild className="bg-[#642DFC] hover:bg-[#5020d9]">
                <Link href="/employer/payroll/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
