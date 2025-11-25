/**
 * Mock Data Generator & Storage
 * Provides consistent mock data across the application
 * Falls back to in-memory storage when Supabase is unavailable
 */

import { generateMockCompanies } from "./companies"
import { generateMockEmployees } from "./employees"
import { generateMockContractors } from "./contractors"
import { generateMockLeaveRequests } from "./leave"
import { generateMockExpenseRequests } from "./expenses"
import { generateMockPayrollRuns } from "./payroll"
import { generateMockSpecialRequests } from "./special-requests"
import { generateMockTaxDeclarations } from "./tax"
import { generateMockInvoices } from "./invoices"
import { generateMockAttendance } from "./attendance"
import { generateMockRoles } from "./roles"
import { generateMockPolicies } from "./policies"

// Mock database in-memory storage
export const mockDatabase = {
  companies: generateMockCompanies(1),
  employees: generateMockEmployees(25),
  contractors: generateMockContractors(8),
  leaveRequests: generateMockLeaveRequests(15),
  expenseRequests: generateMockExpenseRequests(10),
  payrollRuns: generateMockPayrollRuns(12),
  specialRequests: generateMockSpecialRequests(8),
  taxDeclarations: generateMockTaxDeclarations(15),
  invoices: generateMockInvoices(12),
  attendance: generateMockAttendance(25, 30),
  roles: generateMockRoles(generateMockCompanies(1)[0].id),
  policies: generateMockPolicies(generateMockCompanies(1)[0].id),
}

// Initialize mock data on app startup
export function initializeMockData() {
  console.log("[Mock Data] Initialized with:", {
    companies: mockDatabase.companies.length,
    employees: mockDatabase.employees.length,
    contractors: mockDatabase.contractors.length,
    leaveRequests: mockDatabase.leaveRequests.length,
    expenseRequests: mockDatabase.expenseRequests.length,
    payrollRuns: mockDatabase.payrollRuns.length,
    specialRequests: mockDatabase.specialRequests.length,
    taxDeclarations: mockDatabase.taxDeclarations.length,
    invoices: mockDatabase.invoices.length,
    attendance: mockDatabase.attendance.length,
    roles: mockDatabase.roles.length,
  })
}

// Get current company (for multi-tenant context)
export function getCurrentMockCompany() {
  return mockDatabase.companies[0]
}

// Get mock data by key
export function getMockData(key: keyof typeof mockDatabase): any[] {
  return mockDatabase[key] as any[]
}

// Get mock data filtered by company ID
export function getMockDataByCompany(key: keyof typeof mockDatabase, company_id: string): any[] {
  const data = mockDatabase[key] as any[]
  return data.filter((item: any) => item.company_id === company_id)
}

// Get mock data by ID
export function getMockDataById(key: keyof typeof mockDatabase, id: string): any | undefined {
  const data = mockDatabase[key] as any[]
  return data.find((item: any) => item.id === id)
}

// Add new item to mock data
export function addMockData(key: keyof typeof mockDatabase, item: any): void {
  const data = mockDatabase[key] as any[]
  data.push(item)
}

// Update mock data item
export function updateMockData(key: keyof typeof mockDatabase, id: string, updates: any): any {
  const data = mockDatabase[key] as any[]
  const index = data.findIndex((item: any) => item.id === id)
  if (index !== -1) {
    data[index] = { ...data[index], ...updates }
    return data[index]
  }
  return null
}

// Delete mock data item
export function deleteMockData(key: keyof typeof mockDatabase, id: string): boolean {
  const data = mockDatabase[key] as any[]
  const index = data.findIndex((item: any) => item.id === id)
  if (index !== -1) {
    data.splice(index, 1)
    return true
  }
  return false
}

// Reset mock data (useful for testing)
export function resetMockData() {
  Object.assign(mockDatabase, {
    companies: generateMockCompanies(1),
    employees: generateMockEmployees(25),
    contractors: generateMockContractors(8),
    leaveRequests: generateMockLeaveRequests(15),
    expenseRequests: generateMockExpenseRequests(10),
    payrollRuns: generateMockPayrollRuns(12),
    specialRequests: generateMockSpecialRequests(8),
    taxDeclarations: generateMockTaxDeclarations(15),
    invoices: generateMockInvoices(12),
    attendance: generateMockAttendance(25, 30),
    roles: generateMockRoles(generateMockCompanies(1)[0].id),
  })
}

export * from "./companies"
export * from "./employees"
export * from "./contractors"
export * from "./leave"
export * from "./expenses"
export * from "./payroll"
export * from "./special-requests"
export * from "./tax"
export * from "./invoices"
export * from "./attendance"
export * from "./roles"
export * from "./policies"
export * from "./utils"
