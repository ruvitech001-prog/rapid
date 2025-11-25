'use client';

import { useState } from 'react';
import { Plus, Search, Building2, Users, FileText, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Client {
  id: string;
  name: string;
  email: string;
  industry: string;
  employees: number;
  status: 'active' | 'inactive';
  contract: string;
}

export default function ClientsPage() {
  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      industry: 'Technology',
      employees: 450,
      status: 'active',
      contract: 'CON-2024-001',
    },
    {
      id: '2',
      name: 'Global Industries Ltd',
      email: 'hr@globalindustries.com',
      industry: 'Manufacturing',
      employees: 320,
      status: 'active',
      contract: 'CON-2024-002',
    },
    {
      id: '3',
      name: 'StartUp Innovations',
      email: 'admin@startupinnovations.com',
      industry: 'Technology',
      employees: 85,
      status: 'active',
      contract: 'CON-2024-003',
    },
    {
      id: '4',
      name: 'Finance Corp',
      email: 'info@financecorp.com',
      industry: 'Finance',
      employees: 200,
      status: 'inactive',
      contract: 'CON-2023-015',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalEmployees = clients.reduce((sum, c) => sum + c.employees, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-[#8593A3] mt-1">Manage your client companies and contracts</p>
        </div>
        <Button className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL CLIENTS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{clients.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIVE CLIENTS</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{activeClients}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL EMPLOYEES</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">{totalEmployees}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACTS</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{clients.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#CC7A00]" />
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
              placeholder="Search by client name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">All Clients</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CLIENT</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">INDUSTRY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEES</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACT ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-[#586AF5]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-[#8593A3]">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F4F7FA] text-[#8593A3]">
                        {client.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.employees}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#586AF5]">{client.contract}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active'
                          ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]'
                          : 'bg-[#8593A3]/10 text-[#8593A3]'
                      }`}>
                        {client.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
