import type { Metadata } from 'next'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Employee Portal - Rapid.one',
  description: 'Access your profile, payslips, and benefits',
}

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          role="employee"
          userName="Employee Name"
          userEmail="employee@company.com"
          userInitials="EN"
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
