// SuperAdmin Types

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

// Request categories matching Figma tabs
export type RequestCategory = 'employer' | 'employee' | 'special'

// Request types from Figma design
export type RequestType =
  | 'leave'
  | 'expense'
  | 'payroll_query'
  | 'employment_letter'
  | 'travel_letter'
  | 'resignation'
  | 'equipment_purchase'
  | 'equipment_collect'
  | 'termination'
  | 'send_gifts'

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn'

export interface SuperAdminRequestFilters extends PaginationParams {
  category?: RequestCategory
  status?: RequestStatus
  requestType?: RequestType
  companyId?: string
  search?: string
}

export interface RequestWithDetails {
  id: string
  requestType: RequestType
  category: RequestCategory
  status: RequestStatus

  // Requester info
  requesterId: string
  requesterName: string
  requesterEmail: string

  // Company info
  companyId: string
  companyName: string

  // Request details (varies by type)
  details: string

  // Assignment
  assignedToId?: string
  assignedToName?: string

  // Timestamps
  createdAt: string
  updatedAt: string

  // Remarks
  remarks?: string
}

export interface RequestCounts {
  pending: number
  approved: number
  rejected: number
  withdrawn: number
  byCategory: {
    employer: number
    employee: number
    special: number
  }
}

// Team member types for Access Control
export type TeamMemberRole = 'super_admin' | 'admin' | 'support' | 'viewer'

export interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: TeamMemberRole
  isActive: boolean
  assignedClients: { id: string; name: string }[]
  createdAt: string
}

export interface TeamMemberFilters extends PaginationParams {
  role?: TeamMemberRole
  companyId?: string
  isActive?: boolean
}

// Dashboard types
export interface WorkforceStats {
  totalEmployees: number
  totalContractors: number
  activeEmployees: number
  activeContractors: number
  onboardingEmployees: number
  exitingEmployees: number
}

export interface WorkforceTrend {
  month: string
  employees: number
  contractors: number
}

export interface PendingAction {
  id: string
  type: 'leave' | 'expense' | 'invoice' | 'request' | 'escalation'
  title: string
  requester: string
  company: string
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  createdAt: string
}

export interface SearchResult {
  id: string
  type: 'employee' | 'contractor' | 'company' | 'invoice' | 'request'
  title: string
  subtitle: string
  link: string
}

export interface SuperAdminDashboardStats {
  // Existing
  totalClients: number
  clientsByCountry: { country: string; count: number; color: string }[]
  pendingRequests: RequestCounts
  revenueOverview: { month: string; amount: number }[]
  invoiceOverview: { month: string; raised: number; received: number }[]
  recentUpdates: { id: string; message: string; createdAt: string }[]
  upcomingHolidays: { date: string; name: string }[]

  // New additions
  workforceStats: WorkforceStats
  workforceTrend: WorkforceTrend[]
  pendingActions: PendingAction[]
  totalRevenue: number
  monthlyRevenue: number
}

// Company types for SuperAdmin
export interface CompanyWithStats {
  id: string
  legalName: string
  displayName: string | null
  isActive: boolean
  employeeCount: number
  contractorCount: number
  createdAt: string
}
