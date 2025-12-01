'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronLeft, Download, SlidersHorizontal, Settings2 } from 'lucide-react'
import { mockDatabase, type MockContractor } from '@/lib/mock-data'

type ContractStatus = 'active' | 'inactive' | 'terminated' | 'expired'
type FilterType = 'all' | 'active' | 'inactive' | 'terminated' | 'expired'

interface ContractEntry {
  id: string
  contractorCode: string
  name: string
  status: ContractStatus
  createdOn: string
  email: string
  phone: string
}

export default function ContractSummaryPage() {
  const [contracts, setContracts] = useState<ContractEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Generate contract entries from mock data
  useEffect(() => {
    const contractors = mockDatabase.contractors
    const statuses: ContractStatus[] = ['active', 'inactive', 'terminated', 'expired']

    const generatedContracts: ContractEntry[] = contractors.map((contractor: MockContractor, index: number) => {
      let status: ContractStatus
      if (contractor.status === 'active') {
        status = 'active'
      } else if (contractor.status === 'inactive') {
        status = 'inactive'
      } else {
        status = statuses[index % statuses.length] as ContractStatus
      }

      return {
        id: contractor.id,
        contractorCode: contractor.contractor_code,
        name: `${contractor.first_name} ${contractor.last_name}`,
        status,
        createdOn: new Date(contractor.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        email: contractor.email,
        phone: contractor.phone
      }
    })

    setContracts(generatedContracts)
    setIsLoading(false)
  }, [])

  // Filter counts
  const activeCount = contracts.filter(c => c.status === 'active').length
  const inactiveCount = contracts.filter(c => c.status === 'inactive').length
  const terminatedCount = contracts.filter(c => c.status === 'terminated').length
  const expiredCount = contracts.filter(c => c.status === 'expired').length

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === '' ||
        contract.contractorCode.toLowerCase().includes(searchLower) ||
        contract.name.toLowerCase().includes(searchLower) ||
        contract.email.toLowerCase().includes(searchLower)

      // Status filter
      const matchesFilter = activeFilter === 'all' || contract.status === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [contracts, searchTerm, activeFilter])

  // Get status badge style
  const getStatusStyle = (status: ContractStatus) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-[#EDF9F7]',
          text: 'text-[#22957F]',
          label: 'Active'
        }
      case 'inactive':
        return {
          bg: 'bg-[#FFF8E6]',
          text: 'text-[#B68A00]',
          label: 'Inactive'
        }
      case 'terminated':
        return {
          bg: 'bg-[#FFF1F1]',
          text: 'text-[#E24949]',
          label: 'Terminated'
        }
      case 'expired':
        return {
          bg: 'bg-[#F4F7FA]',
          text: 'text-[#8593A3]',
          label: 'Expired'
        }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex items-center gap-4">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-[#F4F7FA] rounded"></div>
            <div className="h-10 w-[600px] bg-[#F4F7FA] rounded"></div>
            <div className="h-[400px] w-full bg-[#F4F7FA] rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        {/* Back and Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/employer/reports"
            className="p-1 hover:bg-[#F4F7FA] rounded transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#353B41]" />
          </Link>
          <h1 className="font-semibold text-[24px] text-[#353B41] leading-none">
            Contract summary
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Create Request Button */}
          <button className="flex items-center gap-2 px-4 py-3 border border-[#586AF5] rounded-lg bg-white hover:bg-[#F4F7FA] transition-colors">
            <span className="font-semibold text-[12px] text-[#586AF5] tracking-[0.75px]">+ Create request</span>
            <ChevronDown className="w-4 h-4 text-[#586AF5]" />
          </button>

          {/* Hire Another Button */}
          <button className="flex items-center gap-2 px-4 py-3 bg-[#642DFC] rounded-lg hover:bg-[#5620e0] transition-colors min-w-[139px] justify-center">
            <span className="font-semibold text-[12px] text-white tracking-[0.75px]">Hire another</span>
          </button>

          {/* Notification Bell */}
          <button className="flex items-center justify-center w-10 h-10 border border-[#EFF2F5] rounded-lg bg-white hover:bg-[#F4F7FA] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#8593A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#8593A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Search and Action Buttons Row */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-[600px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5C2]" />
            <input
              type="text"
              placeholder="Search by ID, name, email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-12 pr-4 border border-[#DEE4EB] rounded-md bg-white text-[14px] text-[#353B41] placeholder:text-[#A8B5C2] focus:outline-none focus:border-[#586AF5] focus:ring-1 focus:ring-[#586AF5]"
            />
          </div>
        </div>

        {/* Download Button */}
        <button className="flex items-center gap-2 px-4 py-3 border border-[#586AF5] rounded-lg bg-white hover:bg-[#F4F7FA] transition-colors ml-auto">
          <Download className="w-4 h-4 text-[#586AF5]" />
          <span className="font-semibold text-[12px] text-[#586AF5] tracking-[0.75px]">Download</span>
          <ChevronDown className="w-4 h-4 text-[#586AF5]" />
        </button>

        {/* Customize Button */}
        <button className="flex items-center gap-2 px-4 py-3 border border-[#586AF5] rounded-lg bg-white hover:bg-[#F4F7FA] transition-colors">
          <Settings2 className="w-4 h-4 text-[#586AF5]" />
          <span className="font-semibold text-[12px] text-[#586AF5] tracking-[0.75px]">Customize</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        {/* Filter Icon and Label */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#6A7682]" />
          <span className="text-[18px] text-[#6A7682] tracking-[0.5px]">Filters :</span>
        </div>

        {/* Filter Pills */}
        <button
          onClick={() => setActiveFilter(activeFilter === 'active' ? 'all' : 'active')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'active'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Active ({activeCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'inactive' ? 'all' : 'inactive')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'inactive'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Inactive ({inactiveCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'terminated' ? 'all' : 'terminated')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'terminated'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Terminated ({terminatedCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'expired' ? 'all' : 'expired')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'expired'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Expired ({expiredCount})
        </button>

        {/* Created On Dropdown */}
        <button className="flex items-center gap-3 px-3 py-1 border border-[#DEE4EB] rounded-lg bg-white text-[14px] font-medium text-[#8593A3] tracking-[0.25px] hover:border-[#586AF5] transition-colors">
          Created on
          <ChevronDown className="w-4 h-4 text-[#8593A3]" />
        </button>
      </div>

      {/* Data Table */}
      <div className="border border-[#DEE4EB] rounded-2xl bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_180px_120px_120px_220px_180px] gap-4 px-7 py-[23px] border-b border-[#DEE4EB]">
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">ID</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Name</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Status</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Created On</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Email</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Phone</span>
        </div>

        {/* Table Body */}
        <div>
          {filteredContracts.map((contract) => {
            const statusStyle = getStatusStyle(contract.status)
            return (
              <div
                key={contract.id}
                className="grid grid-cols-[80px_180px_120px_120px_220px_180px] gap-4 px-7 py-4 border-b border-[#DEE4EB] hover:bg-[#F4F7FA]/50 transition-colors items-center"
              >
                {/* ID */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {contract.contractorCode}
                </span>

                {/* Name */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {contract.name}
                </span>

                {/* Status */}
                <div className={`inline-flex items-center px-3 py-1 ${statusStyle.bg} rounded-full w-fit`}>
                  <span className={`text-[12px] font-medium ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* Created On */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {contract.createdOn}
                </span>

                {/* Email */}
                <span className="text-[14px] font-medium text-[#586AF5]">
                  {contract.email}
                </span>

                {/* Phone */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {contract.phone}
                </span>
              </div>
            )
          })}
        </div>

        {/* Load More Button */}
        {filteredContracts.length > 0 && (
          <div className="px-7 py-4">
            <button className="px-3 py-2 bg-[#EEEFFD] rounded-lg text-[12px] font-semibold text-[#586AF5] tracking-[0.75px] hover:bg-[#E0D5FE] transition-colors">
              Load more
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredContracts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#8593A3] text-[14px]">No contracts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
