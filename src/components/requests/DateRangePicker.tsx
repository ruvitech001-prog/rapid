'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, addMonths, subMonths } from 'date-fns'

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onChange: (start: Date | null, end: Date | null) => void
  disabled?: boolean
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(startDate || new Date())
  const [selecting, setSelecting] = useState<'start' | 'end'>('start')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDateDisplay = (date: Date | null) => {
    return date ? format(date, 'dd/MMM/yyyy') : ''
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const handleDayClick = (day: Date) => {
    if (selecting === 'start') {
      onChange(day, null)
      setSelecting('end')
    } else {
      if (startDate && day < startDate) {
        onChange(day, startDate)
      } else {
        onChange(startDate, day)
      }
      setSelecting('start')
      setIsOpen(false)
    }
  }

  const isInRange = (day: Date) => {
    if (!startDate || !endDate) return false
    return isWithinInterval(day, { start: startDate, end: endDate })
  }

  const isStart = (day: Date) => startDate && isSameDay(day, startDate)
  const isEnd = (day: Date) => endDate && isSameDay(day, endDate)

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const firstDayOfMonth = startOfMonth(currentMonth).getDay()

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm
          hover:border-[#642DFC]/50 transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900">
          {startDate && endDate
            ? `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`
            : startDate
            ? `${formatDateDisplay(startDate)} - Select end date`
            : 'Select date range'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white border border-[#DEE4EB] rounded-lg shadow-lg">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8" />
            ))}

            {days.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const inRange = isInRange(day)
              const isStartDay = isStart(day)
              const isEndDay = isEnd(day)

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={`
                    w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                    ${isStartDay || isEndDay ? 'bg-[#642DFC] text-white' : ''}
                    ${inRange && !isStartDay && !isEndDay ? 'bg-[#642DFC]/10' : ''}
                    ${isCurrentMonth && !isStartDay && !isEndDay ? 'hover:bg-gray-100' : ''}
                  `}
                  onClick={() => handleDayClick(day)}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>

          {/* Selection hint */}
          <p className="mt-3 text-xs text-gray-500 text-center">
            {selecting === 'start' ? 'Select start date' : 'Select end date'}
          </p>
        </div>
      )}
    </div>
  )
}
