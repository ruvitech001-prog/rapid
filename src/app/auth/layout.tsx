import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Rapid.one',
  description: 'Login or signup to Rapid.one',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
