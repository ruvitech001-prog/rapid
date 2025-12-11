'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { useAuth } from '@/lib/auth/auth-context'
import { Loader2, ShieldAlert } from 'lucide-react'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/super-admin/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not superadmin
  if (!user || user.role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have permission to access the SuperAdmin dashboard.
            Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Get user initials
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          role="super_admin"
          userName={user.name}
          userEmail={user.email}
          userInitials={initials}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
          <Header showNotifications />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
