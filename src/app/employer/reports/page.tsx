'use client';

import { useState } from 'react';
import { FileText, DollarSign, Calendar, Receipt, Shield, Briefcase, BarChart3, Download, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export default function ReportsPage() {
  const [reports] = useState<Report[]>([
    { id: '1', name: 'Payroll Summary Report', description: 'Comprehensive payroll summary with salary breakdowns', category: 'Payroll', icon: 'payroll' },
    { id: '2', name: 'Attendance Report', description: 'Employee attendance tracking and analysis', category: 'Attendance', icon: 'attendance' },
    { id: '3', name: 'Leave Balance Report', description: 'Current leave balances for all employees', category: 'Leave', icon: 'leave' },
    { id: '4', name: 'Expense Claims Report', description: 'Employee expense claims and reimbursements', category: 'Expenses', icon: 'expenses' },
    { id: '5', name: 'EPF Compliance Report', description: 'EPF contributions and compliance details', category: 'Compliance', icon: 'compliance' },
    { id: '6', name: 'TDS Report', description: 'Tax deducted at source reporting', category: 'Compliance', icon: 'compliance' },
    { id: '7', name: 'Contractor Payments Report', description: 'Contractor timesheets and payments', category: 'Contractors', icon: 'contractors' },
    { id: '8', name: 'Department-wise Cost Report', description: 'Cost analysis by department', category: 'Analytics', icon: 'analytics' },
    { id: '9', name: 'Headcount Report', description: 'Employee headcount trends and analytics', category: 'Analytics', icon: 'analytics' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', ...new Set(reports.map(r => r.category))];
  const filteredReports = selectedCategory === 'all' ? reports : reports.filter(r => r.category === selectedCategory);

  const getIconComponent = (iconType: string) => {
    const iconClass = "h-8 w-8";
    switch (iconType) {
      case 'payroll': return <DollarSign className={iconClass} />;
      case 'attendance': return <FileText className={iconClass} />;
      case 'leave': return <Calendar className={iconClass} />;
      case 'expenses': return <Receipt className={iconClass} />;
      case 'compliance': return <Shield className={iconClass} />;
      case 'contractors': return <Briefcase className={iconClass} />;
      case 'analytics': return <BarChart3 className={iconClass} />;
      default: return <FileText className={iconClass} />;
    }
  };

  const getIconColor = (iconType: string) => {
    switch (iconType) {
      case 'payroll': return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
      case 'attendance': return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'leave': return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      case 'expenses': return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' };
      case 'compliance': return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
      case 'contractors': return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'analytics': return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      default: return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
        <p className="text-[#8593A3] mt-1">Generate and download various HR and payroll reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL REPORTS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{reports.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">GENERATED TODAY</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">5</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SCHEDULED</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">2</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CATEGORY:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#586AF5] text-white'
                    : 'bg-[#F4F7FA] text-[#8593A3] hover:bg-[#DEE4EB]'
                }`}
              >
                {category === 'all' ? 'All Reports' : category}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => {
          const colors = getIconColor(report.icon);
          return (
            <Card key={report.id} className="rounded-2xl border border-[#DEE4EB] shadow-none hover:border-[#586AF5] transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                    {getIconComponent(report.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{report.name}</h3>
                    <p className="text-sm text-[#8593A3] mb-4">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F4F7FA] text-[#8593A3]">
                        {report.category}
                      </span>
                      <div className="flex gap-2">
                        <button className="text-sm text-[#586AF5] hover:underline font-medium">Generate</button>
                        <button className="text-sm text-[#8593A3] hover:underline font-medium">Schedule</button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'Payroll Summary Report - March 2024', date: 'Mar 15, 2024 at 3:45 PM' },
            { name: 'Attendance Report - February 2024', date: 'Mar 1, 2024 at 10:20 AM' },
            { name: 'EPF Compliance Report - Q4 2024', date: 'Feb 28, 2024 at 2:15 PM' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl hover:bg-[#DEE4EB] transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-[#8593A3] mt-1">Generated on {item.date}</p>
              </div>
              <button className="text-sm text-[#586AF5] hover:underline font-medium">Download</button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'Monthly Payroll Summary', schedule: 'Runs on 1st of every month at 9:00 AM' },
            { name: 'Weekly Attendance Report', schedule: 'Runs every Monday at 8:00 AM' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#586AF5]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-[#8593A3]">{item.schedule}</p>
                </div>
              </div>
              <button className="text-sm text-[#8593A3] hover:text-gray-900">Edit</button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
