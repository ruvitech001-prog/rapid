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
  contractor_type: "individual" | "company"
  first_name: string
  last_name: string
  company_name: string | null
  email: string
  phone: string
  contract_start_date: string
  contract_end_date: string
  rate_type: "hourly" | "fixed" | "milestone"
  rate_amount: number
  currency: string
  pan: string
  status: "active" | "inactive" | "terminated"
  created_at: string
}

export function generateMockContractors(count: number = 8, company_id: string = ""): MockContractor[] {
  const contractors: MockContractor[] = []

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(FIRST_NAMES)
    const lastName = getRandomElement(LAST_NAMES)
    const contractStartDate = subtractDays(new Date(), getRandomNumber(30, 365))
    const contractEndDate = addDays(contractStartDate, getRandomNumber(90, 365))

    contractors.push({
      id: generateId(),
      user_id: generateId(),
      company_id: company_id || generateId(),
      contractor_type: getRandomElement(["individual", "company"] as const),
      first_name: firstName,
      last_name: lastName,
      company_name: getRandomElement(["individual", "company"]) === "company" ? `${firstName} ${lastName} Solutions` : null,
      email: generateRandomEmail(firstName, lastName),
      phone: generateRandomPhone(),
      contract_start_date: formatDate(contractStartDate),
      contract_end_date: formatDate(contractEndDate),
      rate_type: getRandomElement(["hourly", "fixed", "milestone"] as const),
      rate_amount: getRandomNumber(500, 5000),
      currency: "INR",
      pan: generatePAN(),
      status: getRandomElement(["active", "active", "active", "inactive"] as const),
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
