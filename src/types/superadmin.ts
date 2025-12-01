// SuperAdmin Types
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

export interface SuperAdminRequestFilters {
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

export interface TeamMemberFilters {
  role?: TeamMemberRole
  companyId?: string
  isActive?: boolean
}

// Dashboard types
export interface SuperAdminDashboardStats {
  totalClients: number
  clientsByCountry: { country: string; count: number; color: string }[]
  pendingRequests: RequestCounts
  revenueOverview: { month: string; amount: number }[]
  invoiceOverview: { month: string; raised: number; received: number }[]
  recentUpdates: { id: string; message: string; createdAt: string }[]
  upcomingHolidays: { date: string; name: string }[]
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
