'use client';

import { useState } from 'react';
import { Users, DollarSign, TrendingUp, Download, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TDSRecord {
  employeeId: string;
  employeeName: string;
  pan: string;
  grossSalary: number;
  taxableIncome: number;
  tdsDeducted: number;
  taxRegime: 'old' | 'new';
}

export default function TDSReportPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4-2024');

  const [tdsRecords] = useState<TDSRecord[]>([
    {
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      pan: 'ABCDE1234F',
      grossSalary: 720000,
      taxableIncome: 600000,
      tdsDeducted: 45000,
      taxRegime: 'new',
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Sarah Smith',
      pan: 'FGHIJ5678K',
      grossSalary: 900000,
      taxableIncome: 800000,
      tdsDeducted: 72000,
      taxRegime: 'old',
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      pan: 'LMNOP9012Q',
      grossSalary: 540000,
      taxableIncome: 450000,
      tdsDeducted: 22500,
      taxRegime: 'new',
    },
  ]);

  const totalTDS = tdsRecords.reduce((sum, rec) => sum + rec.tdsDeducted, 0);
  const totalTaxableIncome = tdsRecords.reduce((sum, rec) => sum + rec.taxableIncome, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TDS Compliance Report</h1>
          <p className="text-[#8593A3] mt-1">Tax Deducted at Source reporting and compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="gap-2 border-[#2DD4BF] text-[#2DD4BF] hover:bg-[#2DD4BF]/10">
            <Download className="h-4 w-4" />
            Download Form 24Q
          </Button>
          <Button size="lg" className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quarter Selection */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="space-y-2">
            <Label htmlFor="quarter" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SELECT QUARTER</Label>
            <select
              id="quarter"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-64 h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
            >
              <option value="Q1-2024">Q1 2024 (Apr-Jun)</option>
              <option value="Q2-2024">Q2 2024 (Jul-Sep)</option>
              <option value="Q3-2024">Q3 2024 (Oct-Dec)</option>
              <option value="Q4-2024">Q4 2024 (Jan-Mar)</option>
            </select>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{tdsRecords.length}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL TAXABLE INCOME</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">₹{totalTaxableIncome.toLocaleString('en-IN')}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL TDS DEDUCTED</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">₹{totalTDS.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">AVG TAX RATE</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">
                  {((totalTDS / totalTaxableIncome) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TDS Details Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">TDS Deduction Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">PAN</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">GROSS SALARY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TAXABLE INCOME</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TDS DEDUCTED</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TAX REGIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {tdsRecords.map((record) => (
                  <tr key={record.employeeId} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-[#8593A3]">{record.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.pan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{record.grossSalary.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#586AF5]">
                        ₹{record.taxableIncome.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#FF7373]">
                        ₹{record.tdsDeducted.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        record.taxRegime === 'new' ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' : 'bg-[#586AF5]/10 text-[#586AF5]'
                      }`}>
                        {record.taxRegime === 'new' ? 'New Regime' : 'Old Regime'}
                      </span>
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
                      ₹{totalTaxableIncome.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#FF7373]">
                      ₹{totalTDS.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td></td>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-[11px] font-semibold text-[#8593A3] tracking-wider">FILING DETAILS</h3>
              <div className="flex items-start gap-3 p-4 bg-[#F4F7FA] rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#2DD4BF]" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Form 24Q</p>
                  <p className="text-sm text-[#8593A3]">Quarterly TDS return for salary income</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#F4F7FA] rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#2DD4BF]" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Form 16</p>
                  <p className="text-sm text-[#8593A3]">Annual TDS certificate for employees</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DUE DATES</h3>
              <div className="flex items-start gap-3 p-4 bg-[#F4F7FA] rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-[#CC7A00]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#CC7A00]" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">TDS Payment</p>
                  <p className="text-sm text-[#8593A3]">7th of following month</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#F4F7FA] rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-[#CC7A00]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#CC7A00]" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quarterly Return</p>
                  <p className="text-sm text-[#8593A3]">31st of month following quarter end</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
