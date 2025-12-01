'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronLeft, Download, SlidersHorizontal, Settings2, FileDown } from 'lucide-react'
import { mockDatabase } from '@/lib/mock-data'

type BGVStatus = 'verified' | 'in_progress' | 'pending' | 'failed'
type BGVPlan = 'basic' | 'standard' | 'premium'
type FilterType = 'all' | 'verified' | 'in_progress' | 'pending' | 'failed'

interface BGVEntry {
  id: string
  name: string
  status: BGVStatus
  planSelected: BGVPlan
  initiatedOn: string
  downloadUrl: string | null
  selected: boolean
}

export default function BGVReportPage() {
  const [entries, setEntries] = useState<BGVEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectAll, setSelectAll] = useState(false)

  // Generate BGV entries from mock data
  useEffect(() => {
    const employees = mockDatabase.employees
    const statuses: BGVStatus[] = ['verified', 'in_progress', 'pending', 'failed']
    const plans: BGVPlan[] = ['basic', 'standard', 'premium']

    const generatedEntries: BGVEntry[] = employees.slice(0, 15).map((emp, index) => {
      const status = statuses[index % statuses.length] as BGVStatus
      const plan = plans[index % plans.length] as BGVPlan
      return {
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        status,
        planSelected: plan,
        initiatedOn: new Date(emp.joining_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        downloadUrl: status === 'verified' ? `/reports/bgv-${emp.id}.pdf` : null,
        selected: false
      }
    })

    setEntries(generatedEntries)
    setIsLoading(false)
  }, [])

  // Filter counts
  const verifiedCount = entries.filter(e => e.status === 'verified').length
  const inProgressCount = entries.filter(e => e.status === 'in_progress').length
  const pendingCount = entries.filter(e => e.status === 'pending').length
  const failedCount = entries.filter(e => e.status === 'failed').length

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === '' ||
        entry.name.toLowerCase().includes(searchLower)

      // Status filter
      const matchesFilter = activeFilter === 'all' || entry.status === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [entries, searchTerm, activeFilter])

  // Handle select all
  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setEntries(entries.map(entry => ({ ...entry, selected: newSelectAll })))
  }

  // Handle individual selection
  const handleSelect = (id: string) => {
    setEntries(entries.map(entry =>
      entry.id === id ? { ...entry, selected: !entry.selected } : entry
    ))
  }

  // Get status badge style
  const getStatusStyle = (status: BGVStatus) => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-[#EDF9F7]',
          text: 'text-[#22957F]',
          label: 'Verified'
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

  // Format plan name
  const formatPlan = (plan: BGVPlan) => {
    switch (plan) {
      case 'basic': return 'Basic'
      case 'standard': return 'Standard'
      case 'premium': return 'Premium'
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
            BGV report
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
              placeholder="Search by name"
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
          onClick={() => setActiveFilter(activeFilter === 'verified' ? 'all' : 'verified')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'verified'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Verified ({verifiedCount})
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

        {/* Plan Dropdown */}
        <button className="flex items-center gap-3 px-3 py-1 border border-[#DEE4EB] rounded-lg bg-white text-[14px] font-medium text-[#8593A3] tracking-[0.25px] hover:border-[#586AF5] transition-colors">
          Plan
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
        <div className="grid grid-cols-[50px_200px_120px_140px_140px_100px] gap-4 px-7 py-[23px] border-b border-[#DEE4EB]">
          {/* Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-[#DEE4EB] text-[#642DFC] focus:ring-[#642DFC] cursor-pointer"
            />
          </div>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Name</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Status</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Plan Selected</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Initiated On</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Download</span>
        </div>

        {/* Table Body */}
        <div>
          {filteredEntries.map((entry) => {
            const statusStyle = getStatusStyle(entry.status)
            return (
              <div
                key={entry.id}
                className="grid grid-cols-[50px_200px_120px_140px_140px_100px] gap-4 px-7 py-4 border-b border-[#DEE4EB] hover:bg-[#F4F7FA]/50 transition-colors items-center"
              >
                {/* Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={entry.selected}
                    onChange={() => handleSelect(entry.id)}
                    className="w-4 h-4 rounded border-[#DEE4EB] text-[#642DFC] focus:ring-[#642DFC] cursor-pointer"
                  />
                </div>

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

                {/* Plan Selected */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {formatPlan(entry.planSelected)}
                </span>

                {/* Initiated On */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {entry.initiatedOn}
                </span>

                {/* Download */}
                {entry.downloadUrl ? (
                  <button className="flex items-center gap-2 text-[#586AF5] hover:text-[#642DFC] transition-colors">
                    <FileDown className="w-4 h-4" />
                    <span className="text-[14px] font-medium">Download</span>
                  </button>
                ) : (
                  <span className="text-[14px] text-[#A8B5C2]">—</span>
                )}
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
            <p className="text-[#8593A3] text-[14px]">No BGV entries found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
