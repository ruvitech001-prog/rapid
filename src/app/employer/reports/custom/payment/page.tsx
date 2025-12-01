'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronLeft, Calendar, Download } from 'lucide-react'

interface FieldOption {
  id: string
  label: string
  selected: boolean
}

interface FieldGroup {
  id: string
  title: string
  fields: FieldOption[]
}

const initialFieldGroups: FieldGroup[] = [
  {
    id: 'employee_info',
    title: 'Employee Information',
    fields: [
      { id: 'employee_id', label: 'Employee ID', selected: true },
      { id: 'employee_name', label: 'Employee Name', selected: true },
      { id: 'email', label: 'Email Address', selected: true },
      { id: 'department', label: 'Department', selected: false },
      { id: 'designation', label: 'Designation', selected: false },
      { id: 'joining_date', label: 'Joining Date', selected: false },
    ]
  },
  {
    id: 'payment_details',
    title: 'Payment Details',
    fields: [
      { id: 'gross_salary', label: 'Gross Salary', selected: true },
      { id: 'basic_salary', label: 'Basic Salary', selected: true },
      { id: 'hra', label: 'HRA', selected: true },
      { id: 'special_allowance', label: 'Special Allowance', selected: false },
      { id: 'conveyance', label: 'Conveyance', selected: false },
      { id: 'medical_allowance', label: 'Medical Allowance', selected: false },
    ]
  },
  {
    id: 'deductions',
    title: 'Deductions',
    fields: [
      { id: 'pf', label: 'Provident Fund (PF)', selected: true },
      { id: 'esi', label: 'ESI', selected: false },
      { id: 'professional_tax', label: 'Professional Tax', selected: true },
      { id: 'tds', label: 'TDS', selected: true },
      { id: 'other_deductions', label: 'Other Deductions', selected: false },
    ]
  },
  {
    id: 'summary',
    title: 'Summary',
    fields: [
      { id: 'total_earnings', label: 'Total Earnings', selected: true },
      { id: 'total_deductions', label: 'Total Deductions', selected: true },
      { id: 'net_pay', label: 'Net Pay', selected: true },
      { id: 'payment_date', label: 'Payment Date', selected: true },
      { id: 'payment_status', label: 'Payment Status', selected: true },
      { id: 'payment_method', label: 'Payment Method', selected: false },
    ]
  }
]

export default function PaymentCustomReportPage() {
  const [fieldGroups, setFieldGroups] = useState<FieldGroup[]>(initialFieldGroups)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [reportFormat, setReportFormat] = useState<'csv' | 'xlsx' | 'pdf'>('xlsx')

  // Toggle field selection
  const toggleField = (groupId: string, fieldId: string) => {
    setFieldGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              fields: group.fields.map(field =>
                field.id === fieldId
                  ? { ...field, selected: !field.selected }
                  : field
              )
            }
          : group
      )
    )
  }

  // Toggle all fields in a group
  const toggleGroup = (groupId: string) => {
    const group = fieldGroups.find(g => g.id === groupId)
    if (!group) return

    const allSelected = group.fields.every(f => f.selected)

    setFieldGroups(groups =>
      groups.map(g =>
        g.id === groupId
          ? {
              ...g,
              fields: g.fields.map(field => ({ ...field, selected: !allSelected }))
            }
          : g
      )
    )
  }

  // Count selected fields
  const selectedCount = fieldGroups.reduce(
    (count, group) => count + group.fields.filter(f => f.selected).length,
    0
  )

  // Handle generate report
  const handleGenerateReport = () => {
    const selectedFields = fieldGroups.flatMap(group =>
      group.fields.filter(f => f.selected).map(f => ({ group: group.title, field: f.label }))
    )
    console.log('Generating report with fields:', selectedFields)
    console.log('Date range:', dateRange)
    console.log('Format:', reportFormat)
    // In real implementation, this would trigger an API call
    alert(`Report generation started!\n\nSelected fields: ${selectedCount}\nFormat: ${reportFormat.toUpperCase()}`)
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        {/* Back and Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/employer/reports/custom"
            className="p-1 hover:bg-[#F4F7FA] rounded transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#353B41]" />
          </Link>
          <h1 className="font-semibold text-[24px] text-[#353B41] leading-none">
            Generate custom payment summary
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

      {/* Description */}
      <p className="text-[16px] text-[#6A7682] tracking-[0.5px]">
        Select the fields you want to include in your payment summary report
      </p>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Selection - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {fieldGroups.map((group) => {
            const allSelected = group.fields.every(f => f.selected)
            const someSelected = group.fields.some(f => f.selected) && !allSelected

            return (
              <div key={group.id} className="bg-white border border-[#DEE4EB] rounded-xl p-6">
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected
                    }}
                    onChange={() => toggleGroup(group.id)}
                    className="w-4 h-4 rounded border-[#DEE4EB] text-[#642DFC] focus:ring-[#642DFC] cursor-pointer"
                  />
                  <h3 className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px]">
                    {group.title}
                  </h3>
                </div>

                {/* Field Options Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {group.fields.map((field) => (
                    <label
                      key={field.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={field.selected}
                        onChange={() => toggleField(group.id, field.id)}
                        className="w-4 h-4 rounded border-[#DEE4EB] text-[#642DFC] focus:ring-[#642DFC] cursor-pointer"
                      />
                      <span className="text-[14px] text-[#6A7682] tracking-[0.25px]">
                        {field.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Configuration Panel - 1 column */}
        <div className="space-y-6">
          {/* Date Range */}
          <div className="bg-white border border-[#DEE4EB] rounded-xl p-6">
            <h3 className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px] mb-4">
              Date Range
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#6A7682] mb-2">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full h-10 px-4 border border-[#DEE4EB] rounded-lg bg-white text-[14px] text-[#353B41] focus:outline-none focus:border-[#586AF5] focus:ring-1 focus:ring-[#586AF5]"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8593A3] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[14px] text-[#6A7682] mb-2">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full h-10 px-4 border border-[#DEE4EB] rounded-lg bg-white text-[14px] text-[#353B41] focus:outline-none focus:border-[#586AF5] focus:ring-1 focus:ring-[#586AF5]"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8593A3] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Report Format */}
          <div className="bg-white border border-[#DEE4EB] rounded-xl p-6">
            <h3 className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px] mb-4">
              Report Format
            </h3>
            <div className="space-y-3">
              {(['xlsx', 'csv', 'pdf'] as const).map((format) => (
                <label
                  key={format}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="format"
                    checked={reportFormat === format}
                    onChange={() => setReportFormat(format)}
                    className="w-4 h-4 border-[#DEE4EB] text-[#642DFC] focus:ring-[#642DFC] cursor-pointer"
                  />
                  <span className="text-[14px] text-[#6A7682] tracking-[0.25px] uppercase">
                    {format}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#F6F2FF] border border-[#C1ABFE] rounded-xl p-6">
            <h3 className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px] mb-2">
              Report Summary
            </h3>
            <p className="text-[14px] text-[#6A7682] tracking-[0.25px] mb-4">
              {selectedCount} fields selected
            </p>
            <button
              onClick={handleGenerateReport}
              disabled={selectedCount === 0}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[12px] font-semibold tracking-[0.75px] transition-colors ${
                selectedCount === 0
                  ? 'bg-[#DEE4EB] text-[#8593A3] cursor-not-allowed'
                  : 'bg-[#642DFC] text-white hover:bg-[#5620e0]'
              }`}
            >
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
