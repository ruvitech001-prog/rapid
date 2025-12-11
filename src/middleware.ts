import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * This middleware:
 * 1. Refreshes Supabase auth tokens
 * 2. Protects routes that require authentication
 * 3. Redirects unauthenticated users to login
 * 4. Redirects authenticated users away from auth pages
 */

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/super-admin',
  '/employer',
  '/employee',
  '/contractor',
]

// Routes that should redirect to dashboard if authenticated
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
]

// Public routes that don't require any authentication
const PUBLIC_ROUTES = [
  '/',
  '/api',
  '/_next',
  '/favicon.ico',
  '/images',
  '/fonts',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and static files
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Create a Supabase client configured to use cookies
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - this will update the cookies
  const { data: { session } } = await supabase.auth.getSession()

  // User is authenticated if they have a valid Supabase session
  const isAuthenticated = !!session

  // Handle protected routes
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // For Supabase authenticated users, verify their role matches the route
    if (session) {
      const userRole = await getUserRole(supabase, session.user.id)

      // Check if user has access to the requested route
      const routeRoleMap: Record<string, string[]> = {
        '/super-admin': ['superadmin'],
        '/employer': ['employer'],
        '/employee': ['employee'],
        '/contractor': ['contractor'],
      }

      for (const [routePrefix, allowedRoles] of Object.entries(routeRoleMap)) {
        if (pathname.startsWith(routePrefix) && !allowedRoles.includes(userRole)) {
          // User doesn't have access to this section
          const dashboardUrl = getDashboardUrl(userRole)
          return NextResponse.redirect(new URL(dashboardUrl, request.url))
        }
      }
    }
  }

  // Handle auth routes - redirect to dashboard if already authenticated
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (isAuthenticated && session) {
      // Get user's role and redirect to their dashboard
      const userRole = await getUserRole(supabase, session.user.id)
      const dashboardUrl = getDashboardUrl(userRole)
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }
  }

  return response
}

/**
 * Get user's role from the database
 */
async function getUserRole(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<string> {
  // Check superadmin_team first
  const { data: superadminData } = await supabase
    .from('superadmin_team')
    .select('role')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (superadminData) {
    return 'superadmin'
  }

  // Check employer
  const { data: employerData } = await supabase
    .from('company_employer')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (employerData) {
    return 'employer'
  }

  // Check employee
  const { data: employeeData } = await supabase
    .from('employee_employee')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (employeeData) {
    return 'employee'
  }

  // Check contractor
  const { data: contractorData } = await supabase
    .from('contractor_contractor')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (contractorData) {
    return 'contractor'
  }

  // Default to employee
  return 'employee'
}

/**
 * Get dashboard URL for a given role
 */
function getDashboardUrl(role: string): string {
  const dashboardMap: Record<string, string> = {
    superadmin: '/super-admin/dashboard',
    employer: '/employer/dashboard',
    employee: '/employee/dashboard',
    contractor: '/contractor/dashboard',
  }
  return dashboardMap[role] || '/employer/dashboard'
}

// Configure which paths should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
