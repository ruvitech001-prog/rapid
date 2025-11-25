'use client';

import { useState } from 'react';
import { Plus, Search, FileText, MoreVertical, Eye, Download, Users, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Contract {
  id: number;
  type: 'Employment' | 'Contractor' | 'Internship';
  employee: string;
  email: string;
  startDate: string;
  endDate: string | null;
  status: 'Active' | 'Expired' | 'Pending';
}

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [contracts] = useState<Contract[]>([
    { id: 1, type: 'Employment', employee: 'John Doe', email: 'john@company.com', startDate: '2024-01-15', endDate: null, status: 'Active' },
    { id: 2, type: 'Contractor', employee: 'Jane Smith', email: 'jane@contractor.com', startDate: '2024-02-01', endDate: '2024-12-31', status: 'Active' },
    { id: 3, type: 'Employment', employee: 'Mike Johnson', email: 'mike@company.com', startDate: '2023-06-10', endDate: null, status: 'Active' },
    { id: 4, type: 'Internship', employee: 'Sarah Wilson', email: 'sarah@university.edu', startDate: '2024-03-01', endDate: '2024-06-30', status: 'Active' },
    { id: 5, type: 'Contractor', employee: 'Tom Brown', email: 'tom@freelance.com', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Expired' },
  ]);

  const filteredContracts = contracts.filter(c =>
    c.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Employment':
        return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
      case 'Contractor':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'Internship':
        return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      default:
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'Expired':
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
      case 'Pending':
        return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      default:
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
    }
  };

  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  const employmentContracts = contracts.filter(c => c.type === 'Employment').length;
  const contractorContracts = contracts.filter(c => c.type === 'Contractor').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-[#8593A3] mt-1">Manage employment and contractor contracts</p>
        </div>
        <Button className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Plus className="h-4 w-4" />
          New Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL CONTRACTS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{contracts.length}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIVE</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{activeContracts}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYMENT</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">{employmentContracts}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACTORS</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{contractorContracts}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8593A3]" />
            <Input
              type="text"
              placeholder="Search contracts by employee or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">All Contracts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TYPE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">START DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">END DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredContracts.length > 0 ? (
                  filteredContracts.map((contract) => {
                    const typeColors = getTypeColor(contract.type);
                    const statusColors = getStatusColor(contract.status);
                    return (
                      <tr key={contract.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{contract.employee}</div>
                            <div className="text-sm text-[#8593A3]">{contract.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                            <FileText className="h-3 w-3" />
                            {contract.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(contract.startDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                          {contract.endDate ? new Date(contract.endDate).toLocaleDateString('en-IN') : 'Permanent'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                            {contract.status}
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
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#8593A3]">
                      No contracts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
