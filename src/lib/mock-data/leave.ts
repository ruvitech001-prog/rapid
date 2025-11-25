/**
 * Mock Leave Request Data Generator
 */

import {
  generateId,
  LEAVE_STATUSES,
  LEAVE_TYPES,
  formatDate,
  subtractDays,
  addDays,
  getRandomElement,
  getRandomNumber,
} from "./utils"

export interface MockLeaveRequest {
  id: string
  employee_id: string
  company_id: string
  leave_type: string
  start_date: string
  end_date: string
  days_count: number
  reason: string
  status: string
  approver_id: string | null
  approved_at: string | null
  created_at: string
}

export function generateMockLeaveRequests(
  count: number = 15,
  company_id: string = "",
  employee_ids: string[] = [],
  approver_id: string = "",
): MockLeaveRequest[] {
  const requests: MockLeaveRequest[] = []

  for (let i = 0; i < count; i++) {
    const startDate = subtractDays(new Date(), getRandomNumber(1, 90))
    const daysCount = getRandomNumber(1, 5)
    const endDate = addDays(startDate, daysCount)
    const status = getRandomElement(LEAVE_STATUSES)

    requests.push({
      id: generateId(),
      employee_id: employee_ids[i % employee_ids.length] || generateId(),
      company_id: company_id || generateId(),
      leave_type: getRandomElement(LEAVE_TYPES),
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      days_count: daysCount,
      reason: ["Vacation", "Medical", "Personal", "Emergency"][Math.floor(Math.random() * 4)],
      status,
      approver_id: status === "pending" ? null : approver_id || generateId(),
      approved_at: status === "pending" ? null : formatDate(new Date()),
      created_at: formatDate(startDate),
    })
  }

  return requests
}
