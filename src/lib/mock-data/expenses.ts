/**
 * Mock Expense Request Data Generator
 */

import {
  generateId,
  EXPENSE_CATEGORIES,
  REQUEST_STATUSES,
  formatDate,
  subtractDays,
  getRandomElement,
  getRandomNumber,
} from "./utils"

export interface MockExpenseRequest {
  id: string
  employee_id: string
  company_id: string
  category: string
  amount: number
  currency: string
  description: string
  receipt_url: string | null
  status: string
  approver_id: string | null
  approved_at: string | null
  created_at: string
}

export function generateMockExpenseRequests(
  count: number = 10,
  company_id: string = "",
  employee_ids: string[] = [],
  approver_id: string = "",
): MockExpenseRequest[] {
  const requests: MockExpenseRequest[] = []

  for (let i = 0; i < count; i++) {
    const createdDate = subtractDays(new Date(), getRandomNumber(1, 60))
    const status = getRandomElement(REQUEST_STATUSES)

    requests.push({
      id: generateId(),
      employee_id: employee_ids[i % employee_ids.length] || generateId(),
      company_id: company_id || generateId(),
      category: getRandomElement(EXPENSE_CATEGORIES),
      amount: getRandomNumber(500, 10000),
      currency: "INR",
      description: "Business expense",
      receipt_url: Math.random() > 0.5 ? "/receipts/receipt-1.pdf" : null,
      status,
      approver_id: status === "pending" ? null : approver_id || generateId(),
      approved_at: status === "pending" ? null : formatDate(new Date()),
      created_at: formatDate(createdDate),
    })
  }

  return requests
}
