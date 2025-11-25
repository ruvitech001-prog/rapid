/**
 * Mock Special Request Data Generator
 */

import {
  generateId,
  REQUEST_TYPES,
  REQUEST_STATUSES,
  formatDate,
  subtractDays,
  getRandomElement,
  getRandomNumber,
} from "./utils"

export interface MockSpecialRequest {
  id: string
  company_id: string
  requester_id: string
  request_type: string
  title: string
  description: string
  request_data: Record<string, any>
  status: string
  assigned_to: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export function generateMockSpecialRequests(
  count: number = 8,
  company_id: string = "",
  employee_ids: string[] = [],
  admin_id: string = "",
): MockSpecialRequest[] {
  const requests: MockSpecialRequest[] = []

  const titles = {
    equipment: "Request Equipment",
    gift: "Send Gift",
    salary_amendment: "Salary Amendment Request",
    promotion: "Promotion Request",
    termination: "Termination Request",
    resignation: "Resignation",
    probation_extension: "Probation Extension",
    office_space: "Office Space Request",
  }

  for (let i = 0; i < count; i++) {
    const requestType = getRandomElement(REQUEST_TYPES)
    const status = getRandomElement(REQUEST_STATUSES)
    const createdDate = subtractDays(new Date(), getRandomNumber(1, 30))

    requests.push({
      id: generateId(),
      company_id: company_id || generateId(),
      requester_id: employee_ids[i % employee_ids.length] || generateId(),
      request_type: requestType,
      title: titles[requestType as keyof typeof titles],
      description: `Details about the ${requestType} request`,
      request_data: {
        [requestType]: {
          details: "Request specific details",
          amount: getRandomNumber(10000, 100000),
        },
      },
      status,
      assigned_to: status !== "pending" ? admin_id || generateId() : null,
      notes: status === "rejected" ? "Request does not meet criteria" : null,
      created_at: formatDate(createdDate),
      updated_at: formatDate(new Date()),
    })
  }

  return requests
}
