'use client';

import { useState } from 'react';
import { Plus, FileText, DollarSign, Clock, AlertTriangle, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      client: 'Acme Corporation',
      amount: 500000,
      date: '2024-01-01',
      dueDate: '2024-01-31',
      status: 'paid',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      client: 'Global Industries',
      amount: 350000,
      date: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'pending',
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      client: 'StartUp Innovations',
      amount: 200000,
      date: '2024-01-10',
      dueDate: '2024-01-25',
      status: 'overdue',
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      client: 'Tech Solutions',
      amount: 750000,
      date: '2024-02-01',
      dueDate: '2024-03-01',
      status: 'paid',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInvoices = invoices.filter(inv =>
    filterStatus === 'all' || inv.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'pending':
        return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      case 'overdue':
        return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' };
      default:
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-[#8593A3] mt-1">Manage your client invoices</p>
        </div>
        <Button className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL INVOICES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{invoices.length}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL REVENUE</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">₹{(totalRevenue / 100000).toFixed(1)}L</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING PAYMENT</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">₹{(pendingAmount / 100000).toFixed(1)}L</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">OVERDUE</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{overdueCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex gap-2 flex-wrap">
            {['all', 'paid', 'pending', 'overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-[#586AF5] text-white'
                    : 'bg-[#F4F7FA] text-[#8593A3] hover:bg-[#DEE4EB]'
                }`}
              >
                {status === 'all' ? 'All Invoices' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
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
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">INVOICE NUMBER</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CLIENT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">AMOUNT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DUE DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredInvoices.map((invoice) => {
                  const statusColors = getStatusColor(invoice.status);
                  return (
                    <tr key={invoice.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#586AF5]">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">₹{invoice.amount.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                        {new Date(invoice.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                        {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors.bg} ${statusColors.text}`}>
                          {invoice.status}
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
