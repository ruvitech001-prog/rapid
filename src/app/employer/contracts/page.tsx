'use client';

import { useState } from 'react';
import { Plus, Search, FileText, MoreVertical } from 'lucide-react';

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const contracts = [
    { id: 1, type: 'Employment', employee: 'John Doe', startDate: '2024-01-15', status: 'Active' },
    { id: 2, type: 'Contractor', employee: 'Jane Smith', startDate: '2024-02-01', status: 'Active' },
    { id: 3, type: 'Employment', employee: 'Mike Johnson', startDate: '2023-06-10', status: 'Active' },
  ];

  const filteredContracts = contracts.filter(c =>
    c.employee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contracts</h1>
          <p className="text-slate-600 mt-1">Manage employment and contractor contracts</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={20} />
          New Contract
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search contracts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Employee</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredContracts.length > 0 ? (
              filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{contract.employee}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      <FileText size={14} />
                      {contract.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{contract.startDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                      <MoreVertical size={18} className="text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No contracts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
