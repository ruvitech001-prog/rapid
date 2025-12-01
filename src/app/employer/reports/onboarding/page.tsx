'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronLeft, Download, SlidersHorizontal, Settings2 } from 'lucide-react'
import { mockDatabase } from '@/lib/mock-data'

type OnboardingStatus = 'completed' | 'in_progress' | 'pending' | 'failed'
type EmploymentType = 'full_time' | 'part_time' | 'contractor'
type FilterType = 'all' | 'completed' | 'in_progress' | 'pending' | 'failed'

interface OnboardingEntry {
  id: string
  employeeCode: string
  name: string
  status: OnboardingStatus
  employmentType: EmploymentType
  onboardingDate: string
  email: string
}

export default function OnboardingReportPage() {
  const [entries, setEntries] = useState<OnboardingEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Generate onboarding entries from mock data
  useEffect(() => {
    const employees = mockDatabase.employees
    const statuses: OnboardingStatus[] = ['completed', 'in_progress', 'pending', 'failed']
    const employmentTypes: EmploymentType[] = ['full_time', 'part_time', 'contractor']

    const generatedEntries: OnboardingEntry[] = employees.slice(0, 20).map((emp, index) => {
      const status = statuses[index % statuses.length] as OnboardingStatus
      const employmentType = employmentTypes[index % employmentTypes.length] as EmploymentType
      return {
        id: emp.id,
        employeeCode: emp.employee_code,
        name: `${emp.first_name} ${emp.last_name}`,
        status,
        employmentType,
        onboardingDate: new Date(emp.joining_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        email: emp.email
      }
    })

    setEntries(generatedEntries)
    setIsLoading(false)
  }, [])

  // Filter counts
  const completedCount = entries.filter(e => e.status === 'completed').length
  const inProgressCount = entries.filter(e => e.status === 'in_progress').length
  const pendingCount = entries.filter(e => e.status === 'pending').length
  const failedCount = entries.filter(e => e.status === 'failed').length

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === '' ||
        entry.employeeCode.toLowerCase().includes(searchLower) ||
        entry.name.toLowerCase().includes(searchLower) ||
        entry.email.toLowerCase().includes(searchLower)

      // Status filter
      const matchesFilter = activeFilter === 'all' || entry.status === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [entries, searchTerm, activeFilter])

  // Get status badge style
  const getStatusStyle = (status: OnboardingStatus) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-[#EDF9F7]',
          text: 'text-[#22957F]',
          label: 'Completed'
        }
      case 'in_progress':
        return {
          bg: 'bg-[#EBF5FF]',
          text: 'text-[#359DFD]',
          label: 'In progress'
        }
      case 'pending':
        return {
          bg: 'bg-[#FFF8E6]',
          text: 'text-[#B68A00]',
          label: 'Pending'
        }
      case 'failed':
        return {
          bg: 'bg-[#FFF1F1]',
          text: 'text-[#E24949]',
          label: 'Failed'
        }
    }
  }

  // Format employment type
  const formatEmploymentType = (type: EmploymentType) => {
    switch (type) {
      case 'full_time': return 'Full-time'
      case 'part_time': return 'Part-time'
      case 'contractor': return 'Contractor'
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
            Onboarding report
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
          onClick={() => setActiveFilter(activeFilter === 'completed' ? 'all' : 'completed')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'completed'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Completed ({completedCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'in_progress' ? 'all' : 'in_progress')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'in_progress'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          In progress ({inProgressCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'pending'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Pending ({pendingCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'failed' ? 'all' : 'failed')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'failed'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Failed ({failedCount})
        </button>

        {/* Employment Type Dropdown */}
        <button className="flex items-center gap-3 px-3 py-1 border border-[#DEE4EB] rounded-lg bg-white text-[14px] font-medium text-[#8593A3] tracking-[0.25px] hover:border-[#586AF5] transition-colors">
          Employment type
          <ChevronDown className="w-4 h-4 text-[#8593A3]" />
        </button>

        {/* Date Range Dropdown */}
        <button className="flex items-center gap-3 px-3 py-1 border border-[#DEE4EB] rounded-lg bg-white text-[14px] font-medium text-[#8593A3] tracking-[0.25px] hover:border-[#586AF5] transition-colors">
          Date range
          <ChevronDown className="w-4 h-4 text-[#8593A3]" />
        </button>
      </div>

      {/* Data Table */}
      <div className="border border-[#DEE4EB] rounded-2xl bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_180px_120px_140px_140px_220px] gap-4 px-7 py-[23px] border-b border-[#DEE4EB]">
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">ID</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Name</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Status</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Employment Type</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Onboarding Date</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Email</span>
        </div>

        {/* Table Body */}
        <div>
          {filteredEntries.map((entry) => {
            const statusStyle = getStatusStyle(entry.status)
            return (
              <div
                key={entry.id}
                className="grid grid-cols-[80px_180px_120px_140px_140px_220px] gap-4 px-7 py-4 border-b border-[#DEE4EB] hover:bg-[#F4F7FA]/50 transition-colors items-center"
              >
                {/* ID */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {entry.employeeCode}
                </span>

                {/* Name */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {entry.name}
                </span>

                {/* Status */}
                <div className={`inline-flex items-center px-3 py-1 ${statusStyle.bg} rounded-full w-fit`}>
                  <span className={`text-[12px] font-medium ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* Employment Type */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {formatEmploymentType(entry.employmentType)}
                </span>

                {/* Onboarding Date */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {entry.onboardingDate}
                </span>

                {/* Email */}
                <span className="text-[14px] font-medium text-[#586AF5]">
                  {entry.email}
                </span>
              </div>
            )
          })}
        </div>

        {/* Load More Button */}
        {filteredEntries.length > 0 && (
          <div className="px-7 py-4">
            <button className="px-3 py-2 bg-[#EEEFFD] rounded-lg text-[12px] font-semibold text-[#586AF5] tracking-[0.75px] hover:bg-[#E0D5FE] transition-colors">
              Load more
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#8593A3] text-[14px]">No onboarding entries found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
