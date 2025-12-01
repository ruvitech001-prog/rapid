/**
 * Mock Contractor Data Generator
 */

import {
  generateId,
  FIRST_NAMES,
  LAST_NAMES,
  generateRandomEmail,
  generateRandomPhone,
  generatePAN,
  formatDate,
  subtractDays,
  getRandomElement,
  getRandomNumber,
} from "./utils"

export interface MockContractor {
  id: string
  user_id: string
  company_id: string
  contractor_code: string
  contractor_type: "individual" | "company"
  first_name: string
  last_name: string
  company_name: string | null
  email: string
  phone: string
  role: string
  contract_start_date: string
  contract_end_date: string
  rate_type: "hourly" | "fixed" | "milestone"
  rate_amount: number
  currency: string
  pan: string
  status: "active" | "inactive" | "terminated"
  is_expiring_soon: boolean
  created_at: string
}

const CONTRACTOR_ROLES = [
  "UX Designer",
  "Developer",
  "Accountant",
  "Marketing Consultant",
  "Data Analyst",
  "Project Manager",
  "Content Writer",
  "QA Engineer",
]

export function generateMockContractors(count: number = 8, company_id: string = ""): MockContractor[] {
  const contractors: MockContractor[] = []

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(FIRST_NAMES)
    const lastName = getRandomElement(LAST_NAMES)
    const contractStartDate = subtractDays(new Date(), getRandomNumber(30, 365))
    const contractEndDate = addDays(contractStartDate, getRandomNumber(90, 365))

    // Check if contract is expiring within 30 days
    const today = new Date()
    const endDate = new Date(contractEndDate)
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0

    contractors.push({
      id: generateId(),
      user_id: generateId(),
      company_id: company_id || generateId(),
      contractor_code: `${222 + i}`,
      contractor_type: getRandomElement(["individual", "company"] as const),
      first_name: firstName,
      last_name: lastName,
      company_name: getRandomElement(["individual", "company"]) === "company" ? `${firstName} ${lastName} Solutions` : null,
      email: generateRandomEmail(firstName, lastName),
      phone: generateRandomPhone(),
      role: getRandomElement(CONTRACTOR_ROLES),
      contract_start_date: formatDate(contractStartDate),
      contract_end_date: formatDate(contractEndDate),
      rate_type: getRandomElement(["hourly", "fixed", "milestone"] as const),
      rate_amount: getRandomNumber(500, 5000),
      currency: "INR",
      pan: generatePAN(),
      status: getRandomElement(["active", "active", "active", "inactive"] as const),
      is_expiring_soon: isExpiringSoon || i === 0, // First contractor always expiring soon for demo
      created_at: formatDate(contractStartDate),
    })
  }

  return contractors
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
