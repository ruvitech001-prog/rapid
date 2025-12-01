'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronLeft, Download, SlidersHorizontal, Settings2 } from 'lucide-react'
import { mockDatabase } from '@/lib/mock-data'

type PaymentStatus = 'paid' | 'partially_paid' | 'due' | 'failed'

interface ExpenseEntry {
  id: string
  invoiceId: string
  expenseBy: string
  date: string
  status: PaymentStatus
  invoiceFor: string
  totalAmount: number
  totalPaid: number
  balance: number
}

type FilterType = 'all' | 'paid' | 'partially_paid' | 'due' | 'failed'

export default function ExpenseSummaryPage() {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Generate expense entries from mock data
  useEffect(() => {
    const employees = mockDatabase.employees
    const statuses: PaymentStatus[] = ['paid', 'partially_paid', 'due', 'failed']
    const invoicePurposes = [
      'Salary & benefits',
      'Office supplies',
      'Travel expenses',
      'Software subscription',
      'Consulting fees',
      'Marketing services',
      'Equipment purchase'
    ]

    const generatedExpenses: ExpenseEntry[] = employees.slice(0, 15).map((emp, index) => {
      const status = statuses[index % statuses.length] as PaymentStatus
      const invoiceFor = invoicePurposes[index % invoicePurposes.length] as string
      const totalAmount = 10000 + Math.floor(Math.random() * 90000)
      let totalPaid = 0

      if (status === 'paid') totalPaid = totalAmount
      else if (status === 'partially_paid') totalPaid = Math.floor(totalAmount * 0.6)
      else if (status === 'due') totalPaid = 0
      else totalPaid = 0

      return {
        id: `exp-${index + 1}`,
        invoiceId: `INV-${String(index + 1).padStart(4, '0')}`,
        expenseBy: `${emp.first_name} ${emp.last_name}`,
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status,
        invoiceFor,
        totalAmount,
        totalPaid,
        balance: totalAmount - totalPaid
      }
    })

    setExpenses(generatedExpenses)
    setIsLoading(false)
  }, [])

  // Filter counts
  const paidCount = expenses.filter(e => e.status === 'paid').length
  const partiallyPaidCount = expenses.filter(e => e.status === 'partially_paid').length
  const dueCount = expenses.filter(e => e.status === 'due').length
  const failedCount = expenses.filter(e => e.status === 'failed').length

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === '' ||
        expense.invoiceId.toLowerCase().includes(searchLower) ||
        expense.expenseBy.toLowerCase().includes(searchLower) ||
        expense.invoiceFor.toLowerCase().includes(searchLower)

      // Status filter
      const matchesFilter = activeFilter === 'all' || expense.status === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [expenses, searchTerm, activeFilter])

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  // Get status badge style
  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return {
          bg: 'bg-[#EDF9F7]',
          text: 'text-[#22957F]',
          label: 'Paid'
        }
      case 'partially_paid':
        return {
          bg: 'bg-[#FFF8E6]',
          text: 'text-[#B68A00]',
          label: 'Partially paid'
        }
      case 'due':
        return {
          bg: 'bg-[#FFF1F1]',
          text: 'text-[#E24949]',
          label: 'Due'
        }
      case 'failed':
        return {
          bg: 'bg-[#FFF1F1]',
          text: 'text-[#E24949]',
          label: 'Failed'
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
            Expense summary
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
              placeholder="Search by ID, name, invoice"
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
          onClick={() => setActiveFilter(activeFilter === 'paid' ? 'all' : 'paid')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'paid'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Paid ({paidCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'partially_paid' ? 'all' : 'partially_paid')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'partially_paid'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Partially paid ({partiallyPaidCount})
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'due' ? 'all' : 'due')}
          className={`px-3 py-1 border rounded-lg text-[14px] font-medium tracking-[0.25px] transition-colors ${
            activeFilter === 'due'
              ? 'border-[#586AF5] bg-[#586AF5] text-white'
              : 'border-[#DEE4EB] bg-white text-[#8593A3] hover:border-[#586AF5]'
          }`}
        >
          Due ({dueCount})
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

        {/* Invoice Date Dropdown */}
        <button className="flex items-center gap-3 px-3 py-1 border border-[#DEE4EB] rounded-lg bg-white text-[14px] font-medium text-[#8593A3] tracking-[0.25px] hover:border-[#586AF5] transition-colors">
          Invoice date
          <ChevronDown className="w-4 h-4 text-[#8593A3]" />
        </button>

        {/* Amount Range Dropdown */}
        <button className="flex items-center gap-3 px-3 py-1 border border-[#DEE4EB] rounded-lg bg-white text-[14px] font-medium text-[#8593A3] tracking-[0.25px] hover:border-[#586AF5] transition-colors">
          Amount range
          <ChevronDown className="w-4 h-4 text-[#8593A3]" />
        </button>
      </div>

      {/* Data Table */}
      <div className="border border-[#DEE4EB] rounded-2xl bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[100px_150px_100px_120px_180px_120px_120px_100px] gap-4 px-7 py-[23px] border-b border-[#DEE4EB]">
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Invoice ID</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Expense By</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Date</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Status</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Invoice For</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Total Amount</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Total Paid</span>
          <span className="text-[12px] font-medium text-[#353B41] tracking-[1.5px] uppercase">Balance</span>
        </div>

        {/* Table Body */}
        <div>
          {filteredExpenses.map((expense) => {
            const statusStyle = getStatusStyle(expense.status)
            return (
              <div
                key={expense.id}
                className="grid grid-cols-[100px_150px_100px_120px_180px_120px_120px_100px] gap-4 px-7 py-4 border-b border-[#DEE4EB] hover:bg-[#F4F7FA]/50 transition-colors items-center"
              >
                {/* Invoice ID */}
                <span className="text-[14px] font-medium text-[#586AF5]">
                  {expense.invoiceId}
                </span>

                {/* Expense By */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {expense.expenseBy}
                </span>

                {/* Date */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {expense.date}
                </span>

                {/* Status */}
                <div className={`inline-flex items-center px-3 py-1 ${statusStyle.bg} rounded-full w-fit`}>
                  <span className={`text-[12px] font-medium ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* Invoice For */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {expense.invoiceFor}
                </span>

                {/* Total Amount */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {formatCurrency(expense.totalAmount)}
                </span>

                {/* Total Paid */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {formatCurrency(expense.totalPaid)}
                </span>

                {/* Balance */}
                <span className="text-[14px] font-medium text-[#8593A3]">
                  {formatCurrency(expense.balance)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Load More Button */}
        {filteredExpenses.length > 0 && (
          <div className="px-7 py-4">
            <button className="px-3 py-2 bg-[#EEEFFD] rounded-lg text-[12px] font-semibold text-[#586AF5] tracking-[0.75px] hover:bg-[#E0D5FE] transition-colors">
              Load more
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredExpenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#8593A3] text-[14px]">No expenses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
