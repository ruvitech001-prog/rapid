'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal } from 'lucide-react'

// Types for leave entries
type LeaveType = 'full_day' | 'first_half' | 'second_half'

interface LeaveEntry {
  id: string
  employeeName: string
  date: Date
  leaveType: LeaveType
}

// Sample leave data - in real app would come from mock data
const generateLeaveData = (year: number, month: number): LeaveEntry[] => {
  // Static leave entries for demo - these would be populated from mock database in real scenario
  const entries: LeaveEntry[] = [
    { id: '1', employeeName: 'Vidushi Maheshwari', date: new Date(year, month, 2), leaveType: 'full_day' },
    { id: '2', employeeName: 'Prithviraj Singh Hada', date: new Date(year, month, 2), leaveType: 'first_half' },
    { id: '3', employeeName: 'Diviksha Soni', date: new Date(year, month, 2), leaveType: 'second_half' },
    { id: '4', employeeName: 'Khushi Mathur', date: new Date(year, month, 5), leaveType: 'full_day' },
    { id: '5', employeeName: 'Smita Agarwal', date: new Date(year, month, 5), leaveType: 'full_day' },
    { id: '6', employeeName: 'Rakesh Gaur', date: new Date(year, month, 5), leaveType: 'first_half' },
    { id: '7', employeeName: 'Sudhanshu Sawnani', date: new Date(year, month, 5), leaveType: 'second_half' },
    { id: '8', employeeName: 'Amit Kumar', date: new Date(year, month, 10), leaveType: 'full_day' },
    { id: '9', employeeName: 'Sneha Gupta', date: new Date(year, month, 12), leaveType: 'first_half' },
    { id: '10', employeeName: 'Vikram Singh', date: new Date(year, month, 15), leaveType: 'second_half' },
    { id: '11', employeeName: 'Priya Sharma', date: new Date(year, month, 20), leaveType: 'full_day' },
    { id: '12', employeeName: 'Rahul Verma', date: new Date(year, month, 22), leaveType: 'first_half' },
  ]
  return entries
}

type FilterType = 'all' | 'first_half' | 'second_half' | 'full_day'

export default function LeavesPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 5, 1)) // June 2023 as shown in Figma
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [leaveData, setLeaveData] = useState<LeaveEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load leave data on mount and when month changes
  useEffect(() => {
    const data = generateLeaveData(currentDate.getFullYear(), currentDate.getMonth())
    setLeaveData(data)
    setIsLoading(false)
  }, [currentDate])

  // Get month and year
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
  const currentMonth = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of month (0 = Sunday)
    const firstDay = new Date(year, month, 1).getDay()

    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Create array of weeks
    const weeks: (number | null)[][] = []
    let currentWeek: (number | null)[] = []

    // Add empty days for first week
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null)
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    // Add remaining days to last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      weeks.push(currentWeek)
    }

    return weeks
  }, [currentDate])

  // Filter leave data
  const filteredLeaveData = useMemo(() => {
    return leaveData.filter(leave => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const matchesFilter = activeFilter === 'all' || leave.leaveType === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [leaveData, searchTerm, activeFilter])

  // Get leaves for a specific day
  const getLeavesForDay = (day: number | null) => {
    if (day === null) return []

    return filteredLeaveData.filter(leave => {
      return leave.date.getDate() === day &&
             leave.date.getMonth() === currentDate.getMonth() &&
             leave.date.getFullYear() === currentDate.getFullYear()
    })
  }

  // Get leave badge style based on type
  const getLeaveStyle = (type: LeaveType) => {
    switch (type) {
      case 'full_day':
        return {
          bg: 'bg-[#EDF9F7]',
          border: 'border-[#AAE3D9]',
          labelColor: 'text-[#22957F]',
          label: 'FULL DAY'
        }
      case 'first_half':
        return {
          bg: 'bg-[#EBF5FF]',
          border: 'border-[#9ACEFE]',
          labelColor: 'text-[#359DFD]',
          label: 'FIRST HALF'
        }
      case 'second_half':
        return {
          bg: 'bg-[#F6F2FF]',
          border: 'border-[#C1ABFE]',
          labelColor: 'text-[#8357FD]',
          label: 'SECOND HALF'
        }
    }
  }

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex items-center gap-4">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-[#F4F7FA] rounded"></div>
            <div className="h-10 w-[600px] bg-[#F4F7FA] rounded"></div>
            <div className="h-[400px] w-full bg-[#F4F7FA] rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="font-semibold text-[24px] text-[#353B41] leading-none">
          Leaves
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

      {/* Search Input */}
      <div className="max-w-[600px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5C2]" />
          <input
            type="text"
            placeholder="Search by name, date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-12 pr-4 border border-[#DEE4EB] rounded-md bg-white text-[14px] text-[#353B41] placeholder:text-[#A8B5C2] focus:outline-none focus:border-[#586AF5] focus:ring-1 focus:ring-[#586AF5]"
          />
        </div>
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
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'all'
              ? 'border-[#C1ABFE] bg-[#F6F2FF] text-[#642DFC]'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#C1ABFE]'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveFilter('first_half')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'first_half'
              ? 'border-[#C1ABFE] bg-[#F6F2FF] text-[#642DFC]'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#C1ABFE]'
          }`}
        >
          First half
        </button>

        <button
          onClick={() => setActiveFilter('second_half')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'second_half'
              ? 'border-[#C1ABFE] bg-[#F6F2FF] text-[#642DFC]'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#C1ABFE]'
          }`}
        >
          Second half
        </button>

        <button
          onClick={() => setActiveFilter('full_day')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'full_day'
              ? 'border-[#C1ABFE] bg-[#F6F2FF] text-[#642DFC]'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#C1ABFE]'
          }`}
        >
          Full day
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={goToPrevMonth}
          className="p-1 hover:bg-[#F4F7FA] rounded transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-[#642DFC]" />
        </button>
        <span className="font-semibold text-[18px] text-[#353B41] tracking-[0.75px]">
          {currentMonth} {currentYear}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-[#F4F7FA] rounded transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-[#642DFC]" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="border border-[#DEE4EB] rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-[#DEE4EB]">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-4 text-center border-r border-[#DEE4EB] last:border-r-0"
            >
              <span className="text-[16px] text-[#6A7682] tracking-[0.5px]">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Weeks */}
        {calendarDays.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-[#DEE4EB] last:border-b-0">
            {week.map((day, dayIndex) => {
              const leaves = getLeavesForDay(day)
              return (
                <div
                  key={dayIndex}
                  className="min-h-[120px] p-2 border-r border-[#DEE4EB] last:border-r-0 bg-white"
                >
                  {day !== null && (
                    <>
                      {/* Day Number */}
                      <div className="text-[16px] text-black mb-2">{day}</div>

                      {/* Leave Entries */}
                      <div className="space-y-1">
                        {leaves.map((leave) => {
                          const style = getLeaveStyle(leave.leaveType)
                          return (
                            <div
                              key={leave.id}
                              className={`${style.bg} border ${style.border} rounded p-1.5 cursor-pointer hover:opacity-80 transition-opacity`}
                            >
                              <div className={`text-[10px] font-medium ${style.labelColor} tracking-[1.5px] uppercase`}>
                                {style.label}
                              </div>
                              <div className="text-[12px] font-medium text-[#6A7682] truncate">
                                {leave.employeeName}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
