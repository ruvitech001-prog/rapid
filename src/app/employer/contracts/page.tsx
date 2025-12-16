'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronRight,
  ChevronDown,
  Download,
  Calendar,
  Bell,
  SlidersHorizontal,
  Users,
  Building2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEmployeeContracts, useContractorContracts, useContractStats } from '@/lib/hooks';
import { useAuth } from '@/lib/auth';
import { colors } from '@/lib/design-tokens';

type ContractStatus = 'active' | 'pending' | 'expired' | 'terminated';

const getStatusDisplay = (status: string | null, isActive: boolean | null): { text: string; status: ContractStatus } => {
  if (!isActive) {
    return { text: 'Terminated', status: 'terminated' };
  }
  switch (status?.toLowerCase()) {
    case 'active':
      return { text: 'Accepted', status: 'active' };
    case 'pending':
      return { text: 'Pending', status: 'pending' };
    case 'expired':
      return { text: 'Expired', status: 'expired' };
    default:
      return { text: 'Active', status: 'active' };
  }
};

const getStatusColorValue = (status: ContractStatus) => {
  switch (status) {
    case 'active':
      return colors.success600;
    case 'pending':
      return colors.warning600;
    case 'expired':
    case 'terminated':
      return colors.error600;
    default:
      return colors.neutral500;
  }
};

export default function ContractsPage() {
  const { user } = useAuth();
  const companyId = user?.companyId;

  const { data: employeeContractsData = [], isLoading: loadingEmployees } = useEmployeeContracts(companyId || undefined);
  const { data: contractorContractsData = [], isLoading: loadingContractors } = useContractorContracts(companyId || undefined);
  const { data: stats } = useContractStats(companyId || undefined);

  const [activeTab, setActiveTab] = useState<'employees' | 'contractors'>('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const isLoading = loadingEmployees || loadingContractors;

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Transform and filter employee contracts
  const filteredEmployeeContracts = useMemo(() => {
    return employeeContractsData
      .map(contract => {
        const statusInfo = getStatusDisplay(null, contract.is_active);
        return {
          id: contract.id,
          name: contract.employeeName,
          status: statusInfo.text,
          statusType: statusInfo.status,
          createdOn: contract.created_at
            ? new Date(contract.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
            : '-',
          email: contract.employeeEmail || '-',
          designation: contract.designation || '-',
          ctc: contract.ctc ? `$${Number(contract.ctc).toLocaleString()}` : '-',
        };
      })
      .filter(contract => {
        const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              contract.id.includes(searchTerm);
        const matchesFilter = selectedFilters.length === 0 ||
                              selectedFilters.some(f => f.toLowerCase() === contract.statusType);
        return matchesSearch && matchesFilter;
      });
  }, [employeeContractsData, searchTerm, selectedFilters]);

  // Transform and filter contractor contracts
  const filteredContractorContracts = useMemo(() => {
    return contractorContractsData
      .map(contract => {
        const statusInfo = getStatusDisplay(null, contract.is_active);
        // Determine rate from hourly_rate or monthly_rate
        const rate = contract.hourly_rate
          ? `$${Number(contract.hourly_rate).toLocaleString()}/hr`
          : contract.monthly_rate
          ? `$${Number(contract.monthly_rate).toLocaleString()}/mo`
          : '-';
        // Determine payment type from payment_terms
        const paymentType = contract.payment_terms === 'hourly'
          ? 'Hourly'
          : contract.payment_terms === 'milestone'
          ? 'Milestone'
          : 'Fixed Rate';
        return {
          id: contract.id,
          contractorName: contract.contractorName,
          contractName: 'Service Agreement',
          createdOn: contract.created_at
            ? new Date(contract.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
            : '-',
          type: paymentType,
          role: 'Contractor',
          status: statusInfo.text,
          statusType: statusInfo.status,
          rate: rate,
        };
      })
      .filter(contract => {
        const matchesSearch = contract.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              contract.id.includes(searchTerm);
        const matchesFilter = selectedFilters.length === 0 ||
                              selectedFilters.some(f => f.toLowerCase() === contract.statusType);
        return matchesSearch && matchesFilter;
      });
  }, [contractorContractsData, searchTerm, selectedFilters]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    if (activeTab === 'employees') {
      const active = employeeContractsData.filter(c => c.is_active).length;
      const pending = 0; // Would need status field
      return { accepted: active, pending };
    } else {
      const active = contractorContractsData.filter(c => c.is_active).length;
      const pending = 0;
      return { accepted: active, pending };
    }
  }, [activeTab, employeeContractsData, contractorContractsData]);

  const totalCount = activeTab === 'employees'
    ? employeeContractsData.length
    : contractorContractsData.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.iconBlue }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold" style={{ color: colors.neutral800 }}>
          Contracts ({totalCount})
        </h1>

        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
            <Calendar className="h-5 w-5 text-[#A8B5C2]" />
            <span className="text-[16px] text-[#353B41]">All Time</span>
            <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
          </div>

          {/* Create Request Button */}
          <Button
            variant="outline"
            className="border-[#586AF5] text-[#586AF5] hover:bg-[#586AF5]/10 font-semibold text-[12px] tracking-[0.75px] px-4 py-3 h-auto"
          >
            + Create request
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>

          {/* Hire Another Button with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-[#642DFC] hover:bg-[#5020d9] text-white font-semibold text-[12px] tracking-[0.75px] px-4 py-3 h-auto"
              >
                Hire another
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/employer/contracts/create/employee" className="flex items-center gap-3 py-3">
                  <Building2 className="h-4 w-4 text-[#642DFC]" />
                  <div>
                    <p className="text-[14px] font-medium text-[#353B41]">Employee</p>
                    <p className="text-[12px] text-[#8593A3]">Full-time or part-time</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/employer/contracts/create/contractor" className="flex items-center gap-3 py-3">
                  <Users className="h-4 w-4 text-[#642DFC]" />
                  <div>
                    <p className="text-[14px] font-medium text-[#353B41]">Contractor</p>
                    <p className="text-[12px] text-[#8593A3]">Fixed, hourly, or milestone</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification Bell */}
          <Button
            variant="outline"
            size="icon"
            className="border-[#EFF2F5] h-10 w-10"
          >
            <Bell className="h-5 w-5 text-[#8593A3]" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-[#DEE4EB] rounded-xl p-4">
            <p className="text-[12px] text-[#8593A3] uppercase tracking-wider">Active Employees</p>
            <p className="text-[24px] font-bold text-[#353B41] mt-1">{stats.activeEmployeeContracts}</p>
          </div>
          <div className="bg-white border border-[#DEE4EB] rounded-xl p-4">
            <p className="text-[12px] text-[#8593A3] uppercase tracking-wider">Active Contractors</p>
            <p className="text-[24px] font-bold text-[#353B41] mt-1">{stats.activeContractorContracts}</p>
          </div>
          <div className="bg-white border border-[#DEE4EB] rounded-xl p-4">
            <p className="text-[12px] text-[#8593A3] uppercase tracking-wider">Total Contracts</p>
            <p className="text-[24px] font-bold text-[#353B41] mt-1">{stats.totalEmployeeContracts + stats.totalContractorContracts}</p>
          </div>
          <div className="bg-white border border-[#DEE4EB] rounded-xl p-4">
            <p className="text-[12px] text-[#8593A3] uppercase tracking-wider">Expiring This Month</p>
            <p className="text-[24px] font-bold text-[#CC7A00] mt-1">{stats.expiringThisMonth}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#DEE4EB]">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 text-[16px] font-semibold tracking-[0.15px] border-b-2 transition-colors ${
              activeTab === 'employees'
                ? 'text-[#642DFC] border-[#642DFC]'
                : 'text-[#A8B5C2] border-transparent hover:text-[#8593A3]'
            }`}
          >
            Employees ({employeeContractsData.length})
          </button>
          <button
            onClick={() => setActiveTab('contractors')}
            className={`px-4 py-2 text-[16px] font-semibold tracking-[0.15px] border-b-2 transition-colors ${
              activeTab === 'contractors'
                ? 'text-[#642DFC] border-[#642DFC]'
                : 'text-[#A8B5C2] border-transparent hover:text-[#8593A3]'
            }`}
          >
            Contractors ({contractorContractsData.length})
          </button>
        </div>
      </div>

      {/* Search and Download Row */}
      <div className="flex items-center justify-between">
        {/* Search Input */}
        <div className="relative w-[600px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8B5C2]" />
          <Input
            type="text"
            placeholder="Search by name, ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-10 rounded-md border-[#DEE4EB] bg-white text-[14px] placeholder:text-[#A8B5C2] focus:border-[#586AF5] focus:ring-0"
          />
        </div>

        {/* Download Button */}
        <Button
          variant="outline"
          className="border-[#586AF5] text-[#586AF5] hover:bg-[#586AF5]/10 font-semibold text-[12px] tracking-[0.75px] px-4 py-3 h-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[#6A7682]">
          <SlidersHorizontal className="h-5 w-5" />
          <span className="text-[18px]">Filters :</span>
        </div>

        <button
          onClick={() => toggleFilter('active')}
          className={`px-3 py-1 rounded-lg border text-[14px] font-medium transition-colors ${
            selectedFilters.includes('active')
              ? 'border-[#642DFC] bg-[#642DFC]/10 text-[#642DFC]'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#A8B5C2]'
          }`}
        >
          Active ({filterCounts.accepted})
        </button>

        <button
          onClick={() => toggleFilter('pending')}
          className={`px-3 py-1 rounded-lg border text-[14px] font-medium transition-colors ${
            selectedFilters.includes('pending')
              ? 'border-[#642DFC] bg-[#642DFC]/10 text-[#642DFC]'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#A8B5C2]'
          }`}
        >
          Pending ({filterCounts.pending})
        </button>

        {activeTab === 'contractors' && (
          <button className="px-3 py-1 rounded-lg border border-[#DEE4EB] bg-white text-[#8593A3] text-[14px] font-medium flex items-center gap-2 hover:border-[#A8B5C2]">
            Type
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#DEE4EB] rounded-2xl overflow-hidden">
        {activeTab === 'employees' ? (
          /* Employees Table */
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DEE4EB]">
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Name</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Status</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Designation</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Created On</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Email</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">CTC</th>
                <th className="px-7 py-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployeeContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-7 py-12 text-center text-[#8593A3]">
                    No employee contracts found
                  </td>
                </tr>
              ) : (
                filteredEmployeeContracts.map((contract, index) => (
                  <tr
                    key={contract.id}
                    className={`border-b border-[#DEE4EB] hover:bg-[#F4F7FA]/50 transition-colors ${
                      index === filteredEmployeeContracts.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-7 py-5 text-[14px] font-medium" style={{ color: colors.neutral800 }}>{contract.name}</td>
                    <td className="px-7 py-5 text-[14px] font-medium" style={{ color: getStatusColorValue(contract.statusType) }}>
                      {contract.status}
                    </td>
                    <td className="px-7 py-5 text-[14px] font-medium text-[#8593A3]">{contract.designation}</td>
                    <td className="px-7 py-5 text-[14px] font-medium text-[#8593A3]">{contract.createdOn}</td>
                    <td className="px-7 py-5 text-[14px] font-medium text-[#586AF5]">{contract.email}</td>
                    <td className="px-7 py-5 text-[14px] font-medium text-[#8593A3]">{contract.ctc}</td>
                    <td className="px-7 py-5">
                      <Link href={`/employer/contracts/${contract.id}`}>
                        <ChevronRight className="h-6 w-6 text-[#586AF5] cursor-pointer hover:opacity-70" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          /* Contractors Table */
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DEE4EB]">
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Contractor Name</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Contract Type</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Created On</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Payment Type</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Role</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Rate</th>
                <th className="px-7 py-6 text-left text-[12px] font-medium text-[#353B41] uppercase tracking-[1.5px]">Status</th>
                <th className="px-7 py-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredContractorContracts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-7 py-12 text-center text-[#8593A3]">
                    No contractor contracts found
                  </td>
                </tr>
              ) : (
                filteredContractorContracts.map((contract, index) => (
                  <tr
                    key={contract.id}
                    className={`border-b border-[#DEE4EB] hover:bg-[#F4F7FA]/50 transition-colors ${
                      index === filteredContractorContracts.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-7 py-5 text-[14px] font-medium text-[#353B41]">{contract.contractorName}</td>
                    <td className="px-7 py-5 text-[14px] font-medium text-[#8593A3]">{contract.contractName}</td>
                    <td className="px-7 py-5 text-[14px] font-medium text-[#8593A3]">{contract.createdOn}</td>
                    <td className="px-7 py-5 text-[14px] font-medium text-[#8593A3]">{contract.type}</td>
                    <td className="px-7 py-5 text-[14px] font-medium" style={{ color: colors.neutral500 }}>{contract.role}</td>
                    <td className="px-7 py-5 text-[14px] font-medium" style={{ color: colors.neutral500 }}>{contract.rate}</td>
                    <td className="px-7 py-5 text-[14px] font-medium" style={{ color: getStatusColorValue(contract.statusType) }}>
                      {contract.status}
                    </td>
                    <td className="px-7 py-5">
                      <Link href={`/employer/contracts/${contract.id}`}>
                        <ChevronRight className="h-6 w-6 text-[#586AF5] cursor-pointer hover:opacity-70" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
