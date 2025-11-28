'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, X, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface Employee {
  id: string
  employee_code: string
  first_name: string
  last_name: string
  email: string
  designation: string
  department: string
  personal_details?: {
    address?: string
    city?: string
    state?: string
    postal_code?: string
  }
}

interface EmployeeSelectorProps {
  label?: string
  helpText?: string
  value: Employee | null
  onChange: (employee: Employee | null) => void
  employees: Employee[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export function EmployeeSelector({
  label = 'Team member',
  helpText,
  value,
  onChange,
  employees,
  placeholder = 'Select team member',
  disabled = false,
  required = false,
}: EmployeeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.employee_code.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query)
    )
  })

  const handleSelect = (employee: Employee) => {
    onChange(employee)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <Label className="text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <button
          type="button"
          className={`
            ${inputClass}
            flex items-center justify-between
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value ? `${value.first_name} ${value.last_name}` : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && !disabled && (
              <X
                className="w-4 h-4 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
              />
            )}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#DEE4EB] rounded-lg shadow-lg overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-[#DEE4EB]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9 h-9"
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Employee list */}
            <div className="max-h-60 overflow-y-auto">
              {filteredEmployees.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No employees found
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors
                      hover:bg-[#642DFC]/5
                      ${value?.id === employee.id ? 'bg-[#642DFC]/10' : ''}
                    `}
                    onClick={() => handleSelect(employee)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#642DFC]/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#642DFC]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {employee.designation} • {employee.department}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">{employee.employee_code}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {helpText && <p className="text-xs text-[#8593A3]">{helpText}</p>}
    </div>
  )
}
