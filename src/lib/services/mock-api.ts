/**
 * Mock API Service
 * Intercepts API calls in development and returns mock data
 * Falls back to real Supabase if available
 */

import { mockDatabase, initializeMockData, getCurrentMockCompany } from "@/lib/mock-data"
import { delay } from "@/lib/mock-data/utils"

export interface MockApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta: {
    timestamp: string
    requestId: string
  }
}

export interface MockApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  delay?: number
  useRealSupabase?: boolean
}

// Check if Supabase is configured and available
function isSupabaseAvailable(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(supabaseUrl && supabaseKey)
}

// Mock data matchers
const mockEndpoints: Record<
  string,
  (
    method: string,
    params: Record<string, any>,
  ) => MockApiResponse<any> | Promise<MockApiResponse<any>>
> = {
  "/api/employees": (method, params) => {
    const company = getCurrentMockCompany()
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.employees.filter((e) => e.company_id === company.id),
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    if (method === "POST") {
      // Would create new employee in mock DB
      return {
        success: true,
        data: { id: "new-employee-id", ...params.body },
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/contractors": (method, params) => {
    const company = getCurrentMockCompany()
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.contractors.filter((c) => c.company_id === company.id),
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/leave/requests": (method, params) => {
    const company = getCurrentMockCompany()
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.leaveRequests.filter((lr) => lr.company_id === company.id),
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/expenses/requests": (method, params) => {
    const company = getCurrentMockCompany()
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.expenseRequests.filter((er) => er.company_id === company.id),
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/payroll/runs": (method, params) => {
    const company = getCurrentMockCompany()
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.payrollRuns.filter((pr) => pr.company_id === company.id),
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/payroll/payslips": (method, params) => {
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.payroll || [], // Placeholder for payslips
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/special-requests": (method, params) => {
    const company = getCurrentMockCompany()
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.specialRequests.filter((sr) => sr.company_id === company.id),
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/invoices": (method, params) => {
    const company = getCurrentMockCompany()
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.invoices.filter((i) => i.company_id === company.id),
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/attendance": (method, params) => {
    const company = getCurrentMockCompany()
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.attendance.filter((a) => a.company_id === company.id),
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },

  "/api/tax/declarations": (method, params) => {
    if (method === "GET") {
      return {
        success: true,
        data: mockDatabase.taxDeclarations,
        meta: { timestamp: new Date().toISOString(), requestId: generateRequestId() },
      }
    }
    return errorResponse("Not Found")
  },
}

function generateRequestId(): string {
  return `req_${Math.random().toString(36).substr(2, 9)}`
}

function errorResponse(message: string): MockApiResponse<null> {
  return {
    success: false,
    error: {
      code: "ERROR",
      message,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  }
}

/**
 * Fetch from mock API
 * Returns mock data if endpoint is registered, otherwise throws error
 */
export async function fetchMockApi<T = any>(
  endpoint: string,
  options: MockApiFetchOptions = {},
): Promise<MockApiResponse<T>> {
  const { method = "GET", body = {}, delay: customDelay = 300 } = options

  // Initialize mock data on first call
  if (!mockDatabase.companies.length) {
    initializeMockData()
  }

  // Add simulated delay
  await delay(customDelay)

  // Try to match endpoint
  for (const [pattern, handler] of Object.entries(mockEndpoints)) {
    if (endpoint.startsWith(pattern)) {
      try {
        const response = await handler(method, { endpoint, body })
        console.log("[Mock API]", method, endpoint, "✓")
        return response
      } catch (error) {
        console.error("[Mock API] Error:", error)
        return errorResponse("Internal Server Error")
      }
    }
  }

  // Endpoint not found in mock data
  console.warn("[Mock API] Endpoint not registered:", endpoint)
  return errorResponse("Not Found")
}

/**
 * Wrapper to use mock API or real API based on availability
 */
export async function fetchWithFallback<T = any>(
  endpoint: string,
  options: MockApiFetchOptions = {},
): Promise<MockApiResponse<T>> {
  if (options.useRealSupabase || (isSupabaseAvailable() && process.env.NODE_ENV === "production")) {
    // Use real Supabase
    try {
      const response = await fetch(endpoint, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      })
      return await response.json()
    } catch (error) {
      console.error("Supabase fetch failed:", error)
      // Fall back to mock data
      return fetchMockApi(endpoint, options)
    }
  }

  // Use mock API in development
  return fetchMockApi(endpoint, options)
}

/**
 * Get mock data directly (useful for SSR)
 */
export function getMockData(key: keyof typeof mockDatabase): any[] {
  return mockDatabase[key] || []
}

/**
 * Get mock data by ID
 */
export function getMockDataById(
  key: keyof typeof mockDatabase,
  id: string,
): any | undefined {
  const data = mockDatabase[key]
  if (Array.isArray(data)) {
    return data.find((item: any) => item.id === id)
  }
  return undefined
}

/**
 * Filter mock data by company_id
 */
export function getMockDataByCompany(
  key: keyof typeof mockDatabase,
  company_id: string,
): any[] {
  const data = mockDatabase[key]
  if (Array.isArray(data)) {
    return data.filter((item: any) => item.company_id === company_id)
  }
  return []
}

/**
 * Add mock data
 */
export function addMockData(key: keyof typeof mockDatabase, item: any): void {
  const data = mockDatabase[key]
  if (Array.isArray(data)) {
    data.push(item)
  }
}

/**
 * Update mock data
 */
export function updateMockData(
  key: keyof typeof mockDatabase,
  id: string,
  updates: any,
): any | undefined {
  const data = mockDatabase[key]
  if (Array.isArray(data)) {
    const index = data.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...updates }
      return data[index]
    }
  }
  return undefined
}

/**
 * Delete mock data
 */
export function deleteMockData(key: keyof typeof mockDatabase, id: string): boolean {
  const data = mockDatabase[key]
  if (Array.isArray(data)) {
    const index = data.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      data.splice(index, 1)
      return true
    }
  }
  return false
}

console.log(
  "[Mock API Service] Initialized. Supabase available:",
  isSupabaseAvailable(),
  "Environment:",
  process.env.NODE_ENV,
)
