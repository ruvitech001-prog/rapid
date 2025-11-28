/**
 * Mock Special Request Data Generator
 */

import {
  generateId,
  REQUEST_TYPES,
  REQUEST_STATUSES,
  INDIAN_STATES,
  INDIAN_CITIES,
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

const REQUEST_TITLES: Record<string, string> = {
  expense_claim: "Expense Claim",
  send_gifts: "Send Gifts",
  purchase_equipment: "Purchase Equipment",
  collect_equipment: "Collect Equipment",
  termination: "Termination Request",
  cancellation_of_hiring: "Cancel Hiring",
  extension_of_probation: "Probation Extension",
  confirmation_of_probation: "Probation Confirmation",
  incentive_payment: "Incentive Payment",
  office_space: "Office Space Request",
  contract_amendment: "Contract Amendment",
}

function generateRequestData(type: string, employeeNames: string[]): Record<string, any> {
  const employeeName = getRandomElement(employeeNames) || "John Doe"
  const statesWithCities = Object.keys(INDIAN_CITIES) as Array<keyof typeof INDIAN_CITIES>
  const state = getRandomElement(statesWithCities)
  const cities = INDIAN_CITIES[state]
  const city = getRandomElement(cities)

  switch (type) {
    case "expense_claim":
      return {
        category: getRandomElement(["travel", "accommodation", "meals", "equipment", "software"]),
        amount: getRandomNumber(5000, 50000),
        currency: "INR",
        expense_date: formatDate(subtractDays(new Date(), getRandomNumber(1, 30))),
        merchant: getRandomElement(["Amazon", "Flipkart", "Uber", "Ola", "MakeMyTrip", "OYO"]),
        description: "Business expense for project work",
      }

    case "send_gifts":
      return {
        mode: getRandomElement(["individual", "bulk"]),
        recipient_name: employeeName,
        gift_type: getRandomElement(["birthday", "anniversary", "festival", "appreciation"]),
        delivery_address: {
          country: "India",
          address_line_1: `${getRandomNumber(1, 999)}, MG Road`,
          address_line_2: `Block A, ${city}`,
          pin: `${getRandomNumber(100000, 999999)}`,
          city,
          state,
        },
        gift_amount: getRandomNumber(1000, 10000),
      }

    case "purchase_equipment":
      return {
        employee_name: employeeName,
        items: [
          {
            name: getRandomElement(["MacBook Pro", "Dell Monitor", "Logitech Keyboard", "Herman Miller Chair"]),
            link: "https://example.com/product",
            amount: getRandomNumber(20000, 200000),
          },
        ],
        total_amount: getRandomNumber(20000, 200000),
        delivery_address: {
          country: "India",
          address_line_1: `${getRandomNumber(1, 999)}, Park Street`,
          address_line_2: `Phase 2, ${city}`,
          pin: `${getRandomNumber(100000, 999999)}`,
          city,
          state,
        },
      }

    case "collect_equipment":
      return {
        employee_name: employeeName,
        equipment_list: getRandomElement([
          "Laptop, Charger, Mouse",
          "Monitor, Keyboard, Headphones",
          "Laptop, Monitor, Accessories",
        ]),
        shipping_option: getRandomElement(["self_arrange", "company_arrange"]),
        pickup_address: {
          country: "India",
          address_line_1: `${getRandomNumber(1, 999)}, Gandhi Nagar`,
          address_line_2: `Near Metro, ${city}`,
          pin: `${getRandomNumber(100000, 999999)}`,
          city,
          state,
        },
      }

    case "termination":
      return {
        employee_name: employeeName,
        termination_reason: getRandomElement([
          "performance",
          "misconduct",
          "restructuring",
          "end_of_contract",
        ]),
        last_working_day: formatDate(subtractDays(new Date(), getRandomNumber(-30, 30))),
        notice_period_days: getRandomElement([0, 15, 30, 60, 90]),
        equipment_action: getRandomElement(["return", "keep", "buyout"]),
      }

    case "cancellation_of_hiring":
      return {
        candidate_name: employeeName,
        position: getRandomElement(["Software Engineer", "Product Manager", "Designer", "QA Engineer"]),
        original_joining_date: formatDate(subtractDays(new Date(), getRandomNumber(-30, 30))),
        cancellation_reason: getRandomElement([
          "candidate_withdrew",
          "position_cancelled",
          "budget_constraints",
          "other",
        ]),
      }

    case "extension_of_probation":
      return {
        employee_name: employeeName,
        current_probation_end: formatDate(subtractDays(new Date(), getRandomNumber(-15, 15))),
        extension_duration: getRandomElement(["30", "60", "90"]),
        new_end_date: formatDate(subtractDays(new Date(), getRandomNumber(-90, -30))),
        reason: getRandomElement([
          "performance_review",
          "training_incomplete",
          "project_assessment",
          "other",
        ]),
      }

    case "confirmation_of_probation":
      return {
        employee_name: employeeName,
        effective_date: formatDate(subtractDays(new Date(), getRandomNumber(-30, 30))),
        performance_rating: getRandomElement(["excellent", "good", "satisfactory"]),
      }

    case "incentive_payment":
      return {
        employee_name: employeeName,
        bonus_type: getRandomElement(["referral", "performance", "holiday", "retention", "other"]),
        bonus_label: getRandomElement([
          "Referral bonus",
          "Performance bonus",
          "Holiday bonus",
          "Retention bonus",
          "Other bonus",
        ]),
        occurrence: getRandomElement(["one_time", "monthly"]),
        amount: getRandomNumber(10000, 100000),
        effective_date: formatDate(subtractDays(new Date(), getRandomNumber(-30, 30))),
      }

    case "office_space":
      return {
        mode: getRandomElement(["wework", "custom"]),
        city: getRandomElement(["Jaipur", "Delhi", "Mumbai", "Bangalore"]),
        location: getRandomElement(["Sitapura", "Malviya Nagar", "C-Scheme", "Vaishali Nagar"]),
        seats: getRandomNumber(5, 50),
        currency: "INR",
        amount: getRandomNumber(50000, 500000),
      }

    case "contract_amendment":
      return {
        amendment_type: getRandomElement(["salary_revision", "stock_options", "others"]),
        employee_name: employeeName,
        effective_date: formatDate(subtractDays(new Date(), getRandomNumber(-30, 30))),
        details: {
          new_salary: getRandomNumber(500000, 2500000),
          new_designation: getRandomElement(["Senior Engineer", "Tech Lead", "Manager"]),
        },
      }

    default:
      return {
        details: "Request specific details",
        amount: getRandomNumber(10000, 100000),
      }
  }
}

export function generateMockSpecialRequests(
  count: number = 15,
  company_id: string = "",
  employee_ids: string[] = [],
  admin_id: string = "",
): MockSpecialRequest[] {
  const requests: MockSpecialRequest[] = []

  // Generate employee names for request data
  const employeeNames = [
    "Amit Sharma",
    "Priya Patel",
    "Rahul Kumar",
    "Sneha Gupta",
    "Vikram Singh",
    "Ananya Reddy",
    "Karan Jain",
    "Divya Menon",
  ]

  // Generate at least one of each type
  const allTypes = [...REQUEST_TYPES]

  for (let i = 0; i < count; i++) {
    // Use different types for variety
    const requestType = (i < allTypes.length ? allTypes[i] : getRandomElement(allTypes)) || "expense_claim"
    const status = getRandomElement(REQUEST_STATUSES)
    const createdDate = subtractDays(new Date(), getRandomNumber(1, 60))
    const requestData = generateRequestData(requestType, employeeNames)

    const titlePrefix = REQUEST_TITLES[requestType as keyof typeof REQUEST_TITLES] || "Request"
    const employeeName = requestData.employee_name || requestData.recipient_name || requestData.candidate_name || ""
    const title = employeeName ? `${titlePrefix} - ${employeeName}` : titlePrefix

    let description = ""
    switch (requestType) {
      case "expense_claim":
        description = `${requestData.category} expense - ₹${requestData.amount?.toLocaleString()}`
        break
      case "send_gifts":
        description = `${requestData.gift_type} gift for ${requestData.recipient_name}`
        break
      case "purchase_equipment":
        description = `Equipment purchase - ₹${requestData.total_amount?.toLocaleString()}`
        break
      case "collect_equipment":
        description = `Collect: ${requestData.equipment_list}`
        break
      case "termination":
        description = `Reason: ${requestData.termination_reason}`
        break
      case "cancellation_of_hiring":
        description = `Position: ${requestData.position}`
        break
      case "extension_of_probation":
        description = `${requestData.extension_duration} days extension`
        break
      case "confirmation_of_probation":
        description = `Effective: ${requestData.effective_date}`
        break
      case "incentive_payment":
        description = `${requestData.bonus_label} - ₹${requestData.amount?.toLocaleString()}`
        break
      case "office_space":
        description = `${requestData.mode === "wework" ? "WeWork" : "Custom"} - ${requestData.seats} seats`
        break
      case "contract_amendment":
        description = `${requestData.amendment_type?.replace(/_/g, " ")}`
        break
      default:
        description = `Details about the ${requestType} request`
    }

    requests.push({
      id: generateId(),
      company_id: company_id || generateId(),
      requester_id: employee_ids[i % Math.max(employee_ids.length, 1)] || generateId(),
      request_type: requestType,
      title,
      description,
      request_data: requestData,
      status,
      assigned_to: status !== "pending" ? admin_id || generateId() : null,
      notes: status === "rejected" ? "Request does not meet criteria" : null,
      created_at: formatDate(createdDate),
      updated_at: formatDate(new Date()),
    })
  }

  return requests
}
