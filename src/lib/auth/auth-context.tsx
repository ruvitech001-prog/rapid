'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Demo users for quick testing - IDs match seeded database data
export const DEMO_USERS = {
  employer: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'demo@rapidone.com',
    name: 'Demo Employer',
    role: 'employer' as const,
    companyId: '22222222-2222-2222-2222-222222222222',
    companyName: 'Aether Tech',
  },
  employee: {
    id: 'a0000001-0001-0001-0001-000000000001', // Matches seeded employee Aarav Sharma
    email: 'aarav@rapidone.com',
    name: 'Aarav Sharma',
    role: 'employee' as const,
    companyId: '22222222-2222-2222-2222-222222222222',
    companyName: 'Aether Tech',
    employeeCode: 'EMP001',
  },
  contractor: {
    id: 'b0000001-0001-0001-0001-000000000001', // Matches seeded contractor Amit Kapoor
    email: 'amit@rapidone.com',
    name: 'Amit Kapoor',
    role: 'contractor' as const,
    companyId: '22222222-2222-2222-2222-222222222222',
    companyName: 'Aether Tech',
    contractorCode: 'CON001',
  },
  superadmin: {
    id: 'sa000001-0001-0001-0001-000000000001',
    email: 'admin@rapidone.com',
    name: 'Super Admin',
    role: 'superadmin' as const,
    companyId: null,
    companyName: null,
  },
}

export type UserRole = 'employer' | 'employee' | 'contractor' | 'superadmin'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  companyId: string | null
  companyName: string | null
  employeeCode?: string
  contractorCode?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>
  logout: () => void
  switchUser: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'rapid_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored)
        setUser(parsedUser)
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // Simple login function - matches email to demo users
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find matching demo user by email
    const demoUser = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!demoUser) {
      // For testing, accept any email with password "demo123"
      if (password === 'demo123') {
        // Create a temporary employer user
        const tempUser: AuthUser = {
          id: '00000000-0000-0000-0000-000000000001',
          email: email,
          name: email.split('@')[0] || 'User',
          role: 'employer',
          companyId: '22222222-2222-2222-2222-222222222222',
          companyName: 'TechCorp Solutions',
        }
        setUser(tempUser)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tempUser))
        return { success: true, redirectTo: '/employer/dashboard' }
      }
      return { success: false, error: 'Invalid credentials. Use demo@rapidone.com or password: demo123' }
    }

    // For demo users, accept any password
    setUser(demoUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser))

    // Determine redirect based on role
    const redirectMap: Record<UserRole, string> = {
      employer: '/employer/dashboard',
      employee: '/employee/dashboard',
      contractor: '/contractor/dashboard',
      superadmin: '/superadmin/dashboard',
    }

    return { success: true, redirectTo: redirectMap[demoUser.role] }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  // Quick switch between demo users for testing
  const switchUser = (role: UserRole) => {
    const demoUser = DEMO_USERS[role]
    setUser(demoUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hooks for specific data
export function useCurrentCompanyId() {
  const { user } = useAuth()
  return user?.companyId || null
}

export function useCurrentUserId() {
  const { user } = useAuth()
  return user?.id || null
}

export function useCurrentUserRole() {
  const { user } = useAuth()
  return user?.role || null
}
