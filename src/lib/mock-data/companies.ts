/**
 * Mock Company Data Generator
 */

import { generateId, COMPANY_NAMES, formatDate, addDays } from "./utils"

export interface MockCompany {
  id: string
  name: string
  domain: string
  email: string
  phone: string
  country: string
  timezone: string
  currency: string
  settings: {
    probation_period_months: number
    notice_period_days: number
    max_annual_leaves: number
    max_sick_leaves: number
    max_casual_leaves: number
    financial_year_start: string
    financial_year_end: string
  }
  subscription_tier: "free" | "basic" | "pro" | "enterprise"
  status: "active" | "inactive" | "suspended"
  created_at: string
  updated_at: string
}

export function generateMockCompanies(count: number = 1): MockCompany[] {
  const companies: MockCompany[] = []

  for (let i = 0; i < count; i++) {
    const name = COMPANY_NAMES[i % COMPANY_NAMES.length]
    companies.push({
      id: generateId(),
      name: `${name} ${i > 0 ? `- Branch ${i + 1}` : ""}`,
      domain: `${name.toLowerCase().replace(/\s+/g, "-")}.com`,
      email: `admin@${name.toLowerCase().replace(/\s+/g, "-")}.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      country: "India",
      timezone: "Asia/Kolkata",
      currency: "INR",
      settings: {
        probation_period_months: 3,
        notice_period_days: 30,
        max_annual_leaves: 20,
        max_sick_leaves: 7,
        max_casual_leaves: 8,
        financial_year_start: "2025-04-01",
        financial_year_end: "2026-03-31",
      },
      subscription_tier: "pro",
      status: "active",
      created_at: formatDate(addDays(new Date(), -30)),
      updated_at: formatDate(new Date()),
    })
  }

  return companies
}

export interface MockTeam {
  id: string
  company_id: string
  name: string
  description: string
  manager_id: string
  created_at: string
}

export function generateMockTeams(
  count: number = 5,
  company_id: string = "",
  manager_ids: string[] = [],
): MockTeam[] {
  const teamNames = [
    "Engineering",
    "Product",
    "Design",
    "Operations",
    "Finance",
    "Sales",
    "Marketing",
    "HR",
  ]

  const teams: MockTeam[] = []

  for (let i = 0; i < Math.min(count, teamNames.length); i++) {
    teams.push({
      id: generateId(),
      company_id: company_id || generateId(),
      name: teamNames[i],
      description: `${teamNames[i]} team`,
      manager_id: manager_ids[i % manager_ids.length] || generateId(),
      created_at: formatDate(new Date()),
    })
  }

  return teams
}

export interface MockSalaryStructure {
  id: string
  company_id: string
  name: string
  description: string
  components: {
    basic_salary: number
    hra: number
    dearness_allowance: number
    conveyance_allowance: number
    special_allowance: number
    performance_bonus: number
  }
  deductions: {
    provident_fund: number
    gratuity: number
    insurance: number
    professional_tax: number
  }
  created_at: string
}

export function generateMockSalaryStructures(
  count: number = 3,
  company_id: string = "",
): MockSalaryStructure[] {
  const structures: MockSalaryStructure[] = []

  const baseSalaries = [500000, 750000, 1000000]
  const names = ["Junior Developer", "Senior Developer", "Tech Lead"]

  for (let i = 0; i < Math.min(count, baseSalaries.length); i++) {
    const base = baseSalaries[i]

    structures.push({
      id: generateId(),
      company_id: company_id || generateId(),
      name: names[i],
      description: `Salary structure for ${names[i]} role`,
      components: {
        basic_salary: base * 0.4,
        hra: base * 0.15,
        dearness_allowance: base * 0.1,
        conveyance_allowance: base * 0.05,
        special_allowance: base * 0.2,
        performance_bonus: base * 0.1,
      },
      deductions: {
        provident_fund: base * 0.12,
        gratuity: base * 0.0833,
        insurance: base * 0.02,
        professional_tax: 200,
      },
      created_at: formatDate(new Date()),
    })
  }

  return structures
}

export interface MockLeavePolicy {
  id: string
  company_id: string
  leave_type: string
  max_days: number
  carryforward_allowed: boolean
  max_carryforward_days: number
  encashment_allowed: boolean
  requires_approval: boolean
  created_at: string
}

export function generateMockLeavePolicies(
  company_id: string = "",
): MockLeavePolicy[] {
  return [
    {
      id: generateId(),
      company_id: company_id || generateId(),
      leave_type: "casual",
      max_days: 8,
      carryforward_allowed: true,
      max_carryforward_days: 5,
      encashment_allowed: true,
      requires_approval: true,
      created_at: formatDate(new Date()),
    },
    {
      id: generateId(),
      company_id: company_id || generateId(),
      leave_type: "sick",
      max_days: 7,
      carryforward_allowed: false,
      max_carryforward_days: 0,
      encashment_allowed: false,
      requires_approval: true,
      created_at: formatDate(new Date()),
    },
    {
      id: generateId(),
      company_id: company_id || generateId(),
      leave_type: "earned",
      max_days: 20,
      carryforward_allowed: true,
      max_carryforward_days: 10,
      encashment_allowed: true,
      requires_approval: true,
      created_at: formatDate(new Date()),
    },
  ]
}

export interface MockExpensePolicy {
  id: string
  company_id: string
  category: string
  daily_limit: number
  monthly_limit: number
  requires_receipt: boolean
  requires_approval: boolean
  created_at: string
}

export function generateMockExpensePolicies(
  company_id: string = "",
): MockExpensePolicy[] {
  return [
    {
      id: generateId(),
      company_id: company_id || generateId(),
      category: "travel",
      daily_limit: 5000,
      monthly_limit: 50000,
      requires_receipt: true,
      requires_approval: true,
      created_at: formatDate(new Date()),
    },
    {
      id: generateId(),
      company_id: company_id || generateId(),
      category: "meals",
      daily_limit: 1000,
      monthly_limit: 20000,
      requires_receipt: false,
      requires_approval: false,
      created_at: formatDate(new Date()),
    },
    {
      id: generateId(),
      company_id: company_id || generateId(),
      category: "accommodation",
      daily_limit: 10000,
      monthly_limit: 100000,
      requires_receipt: true,
      requires_approval: true,
      created_at: formatDate(new Date()),
    },
  ]
}
