'use client';

import { useState } from 'react';
import { Search, Download, Eye, CheckCircle, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaidInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const invoices = [
    { id: 'INV-001', vendor: 'ABC Supplies Inc.', amount: 523450, paidDate: '2024-11-15', dueDate: '2024-11-20' },
    { id: 'INV-002', vendor: 'Tech Solutions Ltd.', amount: 1250000, paidDate: '2024-11-10', dueDate: '2024-11-15' },
    { id: 'INV-003', vendor: 'Office Equipment Co.', amount: 389075, paidDate: '2024-11-05', dueDate: '2024-11-10' },
    { id: 'INV-004', vendor: 'Services Provider', amount: 815000, paidDate: '2024-10-30', dueDate: '2024-11-05' },
    { id: 'INV-005', vendor: 'Consulting Group', amount: 1560000, paidDate: '2024-10-25', dueDate: '2024-10-30' },
  ];

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const averageAmount = totalPaid / invoices.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paid Invoices</h1>
          <p className="text-[#8593A3] mt-1">View and manage paid invoices</p>
        </div>
        <Button className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL PAID</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{(totalPaid / 100000).toFixed(1)}L</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL INVOICES</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{filteredInvoices.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">AVERAGE AMOUNT</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">₹{(averageAmount / 100000).toFixed(1)}L</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8593A3]" />
            <input
              type="text"
              placeholder="Search by invoice ID or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Invoice List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">INVOICE ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">VENDOR</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">AMOUNT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">PAID DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DUE DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#586AF5]">{invoice.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">₹{invoice.amount.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                        {new Date(invoice.paidDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                        {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#2DD4BF]/10 text-[#2DD4BF]">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-[#586AF5]/10 rounded-lg transition-colors text-[#586AF5]">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-[#2DD4BF]/10 rounded-lg transition-colors text-[#2DD4BF]">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-[#F4F7FA] flex items-center justify-center mb-3">
                          <FileText className="h-6 w-6 text-[#8593A3]" />
                        </div>
                        <p className="text-[#8593A3]">No invoices found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      {filteredInvoices.length > 0 && (
        <p className="text-sm text-[#8593A3] text-center">
          Showing {filteredInvoices.length} of {invoices.length} paid invoices
        </p>
      )}
    </div>
  );
}
