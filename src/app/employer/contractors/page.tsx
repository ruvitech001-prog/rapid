'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, UserCheck, Clock, DollarSign, Plus, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Contractor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  rate: number;
  rateType: 'hourly' | 'daily' | 'monthly';
  contractorId: string;
  startDate: string;
  status: 'active' | 'inactive';
  hoursWorked: number;
}

export default function ContractorsPage() {
  const [contractors] = useState<Contractor[]>([
    {
      id: '1',
      name: 'Robert Wilson',
      email: 'robert.w@contractor.com',
      specialty: 'Frontend Development',
      rate: 2500,
      rateType: 'hourly',
      contractorId: 'CON001',
      startDate: '2024-01-15',
      status: 'active',
      hoursWorked: 160,
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.d@contractor.com',
      specialty: 'UI/UX Design',
      rate: 60000,
      rateType: 'monthly',
      contractorId: 'CON002',
      startDate: '2024-02-01',
      status: 'active',
      hoursWorked: 0,
    },
    {
      id: '3',
      name: 'James Miller',
      email: 'james.m@contractor.com',
      specialty: 'DevOps',
      rate: 8000,
      rateType: 'daily',
      contractorId: 'CON003',
      startDate: '2023-11-10',
      status: 'active',
      hoursWorked: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contractor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contractor.contractorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contractor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = contractors.filter(c => c.status === 'active').length;
  const inactiveCount = contractors.filter(c => c.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contractors</h1>
          <p className="text-[#8593A3] mt-1">Manage your independent contractors and consultants</p>
        </div>
        <Button asChild size="lg" className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Link href="/employer/contractors/new">
            <Plus className="h-4 w-4" />
            Add Contractor
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL CONTRACTORS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{contractors.length}</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIVE</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{activeCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING TIMESHEETS</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">5</p>
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
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">THIS MONTH COST</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">₹5.2L</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SEARCH</Label>
              <Input
                id="search"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-[#DEE4EB] focus:border-[#586AF5] focus:ring-[#586AF5]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contractors List */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">
              Contractor List
              <span className="ml-2 text-sm font-normal text-[#8593A3]">
                ({filteredContractors.length} of {contractors.length})
              </span>
            </CardTitle>
            <Link href="/employer/contractors" className="text-sm font-medium text-[#586AF5] hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACTOR</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">SPECIALTY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">RATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">START DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredContractors.map((contractor) => (
                  <tr key={contractor.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contractor.name}</div>
                        <div className="text-sm text-[#8593A3]">{contractor.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contractor.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8593A3]">{contractor.contractorId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{contractor.rate.toLocaleString('en-IN')}/{contractor.rateType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8593A3]">
                        {new Date(contractor.startDate).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        contractor.status === 'active' ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' : 'bg-[#FF7373]/10 text-[#FF7373]'
                      }`}>
                        {contractor.status.charAt(0).toUpperCase() + contractor.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button className="text-[#586AF5] hover:underline font-medium">
                          View
                        </button>
                        <button className="text-[#586AF5] hover:underline font-medium">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredContractors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#8593A3]">No contractors found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
