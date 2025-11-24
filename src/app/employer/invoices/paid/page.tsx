'use client';

import { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';

export default function PaidInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const invoices = [
    { id: 'INV-001', vendor: 'ABC Supplies Inc.', amount: '$5,234.50', paidDate: '2024-11-15', dueDate: '2024-11-20' },
    { id: 'INV-002', vendor: 'Tech Solutions Ltd.', amount: '$12,500.00', paidDate: '2024-11-10', dueDate: '2024-11-15' },
    { id: 'INV-003', vendor: 'Office Equipment Co.', amount: '$3,890.75', paidDate: '2024-11-05', dueDate: '2024-11-10' },
    { id: 'INV-004', vendor: 'Services Provider', amount: '$8,150.00', paidDate: '2024-10-30', dueDate: '2024-11-05' },
    { id: 'INV-005', vendor: 'Consulting Group', amount: '$15,600.00', paidDate: '2024-10-25', dueDate: '2024-10-30' },
  ];

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Paid Invoices</h1>
          <p className="text-slate-600 mt-1">View and manage paid invoices</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by invoice ID or vendor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Invoice ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Vendor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Paid Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Due Date</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{invoice.vendor}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{invoice.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{invoice.paidDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{invoice.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded transition-colors text-blue-600">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-600">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-600 text-sm">Total Paid</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">$45,375.25</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm">Total Invoices</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{filteredInvoices.length}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm">Average Amount</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">$9,075.05</p>
          </div>
        </div>
      </div>
    </div>
  );
}
