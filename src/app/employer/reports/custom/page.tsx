'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronLeft, ChevronRight, FileText, DollarSign, Users, Briefcase } from 'lucide-react'

type ReportType = 'payment' | 'employee' | 'contractor' | 'expense'

interface ReportTypeOption {
  id: ReportType
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

const reportTypes: ReportTypeOption[] = [
  {
    id: 'payment',
    title: 'Payment summary',
    description: 'Generate a custom report for payment data',
    icon: <DollarSign className="w-6 h-6 text-[#359DFD]" />,
    href: '/employer/reports/custom/payment'
  },
  {
    id: 'employee',
    title: 'Employee report',
    description: 'Generate a custom report for employee data',
    icon: <Users className="w-6 h-6 text-[#22957F]" />,
    href: '/employer/reports/custom/employee'
  },
  {
    id: 'contractor',
    title: 'Contractor report',
    description: 'Generate a custom report for contractor data',
    icon: <Briefcase className="w-6 h-6 text-[#8357FD]" />,
    href: '/employer/reports/custom/contractor'
  },
  {
    id: 'expense',
    title: 'Expense report',
    description: 'Generate a custom report for expense data',
    icon: <FileText className="w-6 h-6 text-[#E24949]" />,
    href: '/employer/reports/custom/expense'
  }
]

export default function CustomReportPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

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
            Generate a Custom Report
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
        Select a report type to customize and generate
      </p>

      {/* Report Type Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((reportType) => (
          <Link
            key={reportType.id}
            href={reportType.href}
            className={`bg-white border rounded-xl p-6 transition-all cursor-pointer ${
              hoveredCard === reportType.id
                ? 'border-[#586AF5] shadow-md'
                : 'border-[#DEE4EB] hover:border-[#586AF5]'
            }`}
            onMouseEnter={() => setHoveredCard(reportType.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Icon */}
            <div className="mb-4">
              <div className="w-12 h-12 bg-[#F4F7FA] rounded-lg flex items-center justify-center">
                {reportType.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px] mb-1">
              {reportType.title}
            </h3>

            {/* Description */}
            <p className="text-[14px] text-[#8593A3] tracking-[0.25px] mb-4">
              {reportType.description}
            </p>

            {/* Arrow */}
            <div className={`flex items-center justify-end transition-opacity ${
              hoveredCard === reportType.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <ChevronRight className="w-5 h-5 text-[#586AF5]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
