'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { SuperAdminRole } from '@/lib/permissions'

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
  // SuperAdmin specific fields
  superAdminRole?: SuperAdminRole
  superAdminTeamId?: string
}

interface AuthContextType {
  user: AuthUser | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  /**
   * Fetch user profile data and determine role
   */
  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<AuthUser | null> => {
    try {
      // First check if user is a superadmin
      const { data: superadminData } = await supabase
        .from('superadmin_team')
        .select('id, role, is_active')
        .eq('user_id', supabaseUser.id)
        .eq('is_active', true)
        .single()

      if (superadminData) {
        // Fetch user details
        const { data: userData } = await supabase
          .from('users_user')
          .select('first_name, last_name, email')
          .eq('id', supabaseUser.id)
          .single()

        return {
          id: supabaseUser.id,
          email: supabaseUser.email || userData?.email || '',
          name: userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : supabaseUser.email || '',
          role: 'superadmin',
          companyId: null,
          companyName: null,
          superAdminRole: superadminData.role as SuperAdminRole,
          superAdminTeamId: superadminData.id,
        }
      }

      // Check if user is an employer
      const { data: employerData } = await supabase
        .from('company_employer')
        .select(`
          id,
          company_id,
          company_company!company_employer_company_id_fkey (
            id,
            legal_name,
            display_name
          ),
          users_user!company_employer_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .eq('user_id', supabaseUser.id)
        .single()

      if (employerData) {
        const company = employerData.company_company as { id: string; legal_name: string; display_name: string | null } | null
        const userData = employerData.users_user as { first_name: string | null; last_name: string | null; email: string } | null
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || userData?.email || '',
          name: userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : supabaseUser.email || '',
          role: 'employer',
          companyId: company?.id || null,
          companyName: company?.display_name || company?.legal_name || null,
        }
      }

      // Check if user is an employee
      const { data: employeeData } = await supabase
        .from('employee_employee')
        .select(`
          id,
          full_name,
          employee_code,
          company_companyemployee!inner (
            company_id,
            company_company!inner (
              id,
              legal_name,
              display_name
            )
          )
        `)
        .eq('user_id', supabaseUser.id)
        .single()

      if (employeeData) {
        const companyEmployee = employeeData.company_companyemployee as { company_id: string; company_company: { id: string; legal_name: string; display_name: string | null } }[] | null
        const company = companyEmployee?.[0]?.company_company
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: employeeData.full_name || supabaseUser.email || '',
          role: 'employee',
          companyId: company?.id || null,
          companyName: company?.display_name || company?.legal_name || null,
          employeeCode: employeeData.employee_code || undefined,
        }
      }

      // Check if user is a contractor
      const { data: contractorData } = await supabase
        .from('contractor_contractor')
        .select(`
          id,
          full_name,
          contractor_code,
          contractor_contractorcontract (
            company_id,
            is_current,
            company_company (
              id,
              legal_name,
              display_name
            )
          )
        `)
        .eq('user_id', supabaseUser.id)
        .single()

      if (contractorData) {
        const contracts = contractorData.contractor_contractorcontract as { company_id: string; is_current: boolean; company_company: { id: string; legal_name: string; display_name: string | null } }[] | null
        const currentContract = contracts?.find(c => c.is_current)
        const company = currentContract?.company_company
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: contractorData.full_name || supabaseUser.email || '',
          role: 'contractor',
          companyId: company?.id || null,
          companyName: company?.display_name || company?.legal_name || null,
          contractorCode: contractorData.contractor_code || undefined,
        }
      }

      // User exists but has no role assigned - default to basic user info
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.email?.split('@')[0] || 'User',
        role: 'employee', // Default role
        companyId: null,
        companyName: null,
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }, [supabase])

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get existing Supabase session
        const { data: { session: existingSession } } = await supabase.auth.getSession()

        if (existingSession?.user) {
          setSession(existingSession)
          setSupabaseUser(existingSession.user)
          const userProfile = await fetchUserProfile(existingSession.user)
          setUser(userProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_IN' && newSession?.user) {
        setSession(newSession)
        setSupabaseUser(newSession.user)
        const userProfile = await fetchUserProfile(newSession.user)
        setUser(userProfile)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setSupabaseUser(null)
        setUser(null)
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        setSession(newSession)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchUserProfile])

  /**
   * Login function
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    try {
      // Try Supabase Auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user)
        if (userProfile) {
          setUser(userProfile)

          const redirectMap: Record<UserRole, string> = {
            employer: '/employer/dashboard',
            employee: '/employee/dashboard',
            contractor: '/contractor/dashboard',
            superadmin: '/super-admin/dashboard',
          }

          return { success: true, redirectTo: redirectMap[userProfile.role] }
        }
      }

      return { success: false, error: 'Failed to fetch user profile' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setSession(null)
      setSupabaseUser(null)
      setUser(null)
    }
  }

  /**
   * Refresh session
   */
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Session refresh error:', error)
        return
      }
      if (data.session) {
        setSession(data.session)
        if (data.user) {
          setSupabaseUser(data.user)
          const userProfile = await fetchUserProfile(data.user)
          setUser(userProfile)
        }
      }
    } catch (error) {
      console.error('Session refresh error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshSession,
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

export function useSuperAdminRole() {
  const { user } = useAuth()
  return user?.superAdminRole || null
}
