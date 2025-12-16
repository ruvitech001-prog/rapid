'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronRight, Download, SlidersHorizontal, AlertCircle, Loader2 } from 'lucide-react'
import { useContractors } from '@/lib/hooks'
import { useAuth } from '@/lib/auth'
import { colors } from '@/lib/design-tokens'

interface Contractor {
  id: string
  contractor_code: string
  first_name: string
  last_name: string
  email: string
  role: string
  rate_type: 'fixed' | 'hourly' | 'milestone'
  contract_start_date: string
  contract_end_date: string
  is_expiring_soon: boolean
}

type FilterType = 'all' | 'fixed' | 'hourly' | 'milestone' | 'expiring'

export default function ContractorsPage() {
  const { user } = useAuth()
  const companyId = user?.companyId

  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Fetch real contractor data
  const { data: contractorsData = [], isLoading } = useContractors(companyId || undefined)

  // Transform data to match expected interface
  const contractors: Contractor[] = useMemo(() => {
    return contractorsData.map(c => {
      // Calculate if expiring soon (within 30 days)
      const endDate = c.endDate ? new Date(c.endDate) : null
      const today = new Date()
      const daysUntilEnd = endDate
        ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : 999
      const isExpiring = daysUntilEnd > 0 && daysUntilEnd <= 30

      // Map payment terms to rate type
      let rateType: 'fixed' | 'hourly' | 'milestone' = 'hourly'
      if (c.paymentTerms === 'monthly') rateType = 'fixed'
      else if (c.paymentTerms === 'milestone') rateType = 'milestone'

      // Split full name
      const nameParts = c.fullName.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      return {
        id: c.id,
        contractor_code: c.contractorCode,
        first_name: firstName,
        last_name: lastName,
        email: c.email,
        role: c.businessName || 'Contractor',
        rate_type: rateType,
        contract_start_date: c.startDate || '',
        contract_end_date: c.endDate || '',
        is_expiring_soon: isExpiring,
      }
    })
  }, [contractorsData])

  // Filter counts
  const fixedCount = contractors.filter(c => c.rate_type === 'fixed').length
  const hourlyCount = contractors.filter(c => c.rate_type === 'hourly').length
  const milestoneCount = contractors.filter(c => c.rate_type === 'milestone').length
  const expiringCount = contractors.filter(c => c.is_expiring_soon).length

  // Filtered contractors
  const filteredContractors = contractors.filter(contractor => {
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = searchTerm === '' ||
      contractor.first_name.toLowerCase().includes(searchLower) ||
      contractor.last_name.toLowerCase().includes(searchLower) ||
      contractor.email.toLowerCase().includes(searchLower) ||
      contractor.contractor_code.includes(searchTerm)

    // Type filter
    let matchesFilter = true
    if (activeFilter === 'fixed') matchesFilter = contractor.rate_type === 'fixed'
    else if (activeFilter === 'hourly') matchesFilter = contractor.rate_type === 'hourly'
    else if (activeFilter === 'milestone') matchesFilter = contractor.rate_type === 'milestone'
    else if (activeFilter === 'expiring') matchesFilter = contractor.is_expiring_soon

    return matchesSearch && matchesFilter
  })

  // Format date to display format (12 Feb 2022)
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  // Format rate type for display
  const formatRateType = (rateType: string) => {
    switch (rateType) {
      case 'fixed': return 'Fixed Rate'
      case 'hourly': return 'Hourly'
      case 'milestone': return 'Milestone'
      default: return rateType
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary500 }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="font-semibold text-[24px] leading-none" style={{ color: colors.neutral800 }}>
          Contractors ({contractors.length})
        </h1>

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
            <ChevronDown className="w-4 h-4 text-white" />
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

      {/* Search and Download Row */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-[600px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5C2]" />
            <input
              type="text"
              placeholder="Search by ID, name, email address"
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
          onClick={() => setActiveFilter(activeFilter === 'fixed' ? 'all' : 'fixed')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'fixed'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Fixed rate ({fixedCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'hourly' ? 'all' : 'hourly')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'hourly'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Hourly ({hourlyCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'milestone' ? 'all' : 'milestone')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'milestone'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Milestone ({milestoneCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'expiring' ? 'all' : 'expiring')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'expiring'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Expiring soon({expiringCount})
        </button>

        {/* Role Dropdown */}
        <button className="flex items-center gap-3 px-3 py-1 border border-[#DEE4EB] rounded-lg bg-white text-[14px] font-medium text-[#8593A3] tracking-[0.25px] hover:border-[#586AF5] transition-colors">
          Role
          <ChevronDown className="w-4 h-4 text-[#8593A3]" />
        </button>
      </div>

      {/* Data Table */}
      <div className="border border-[#DEE4EB] rounded-2xl bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[60px_180px_100px_120px_200px_1fr_40px] gap-[42px] px-7 py-[23px] border-b border-[#DEE4EB]">
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">ID</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Contractor Name</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Type</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Role</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Duration</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Email Address</span>
          <span></span>
        </div>

        {/* Table Body */}
        <div>
          {filteredContractors.map((contractor) => (
            <Link
              key={contractor.id}
              href={`/employer/contractors/${contractor.id}`}
              className="grid grid-cols-[60px_180px_100px_120px_200px_1fr_40px] gap-[42px] px-7 py-4 border-b border-[#DEE4EB] hover:bg-[#F4F7FA]/50 transition-colors items-start group"
            >
              {/* ID */}
              <span className="text-[14px] font-medium text-[#8593A3]">
                {contractor.contractor_code}
              </span>

              {/* Contractor Name */}
              <span className="text-[14px] font-medium text-[#8593A3]">
                {contractor.first_name} {contractor.last_name}
              </span>

              {/* Type */}
              <span className="text-[14px] font-medium text-[#8593A3]">
                {formatRateType(contractor.rate_type)}
              </span>

              {/* Role */}
              <span className="text-[14px] font-medium text-[#8593A3]">
                {contractor.role}
              </span>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {formatDisplayDate(contractor.contract_start_date)} - {formatDisplayDate(contractor.contract_end_date)}
                </span>
                {contractor.is_expiring_soon && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF1F1] rounded-full w-fit">
                    <AlertCircle className="w-3 h-3 text-[#E24949]" />
                    <span className="text-[10px] font-medium text-[#B02020] tracking-[1.5px] uppercase">
                      Expiring Soon
                    </span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <span className="text-[14px] font-medium text-[#586AF5]">
                {contractor.email}
              </span>

              {/* Chevron */}
              <ChevronRight className="w-6 h-6 text-[#586AF5] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {filteredContractors.length > 0 && (
          <div className="px-7 py-4">
            <button className="px-3 py-2 bg-[#EEEFFD] rounded-lg text-[12px] font-semibold text-[#586AF5] tracking-[0.75px] hover:bg-[#E0D5FE] transition-colors">
              Load more
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredContractors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#8593A3] text-[14px]">No contractors found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
