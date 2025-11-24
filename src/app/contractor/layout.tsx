import type { Metadata } from 'next'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Contractor Portal - Rapid.one',
  description: 'Manage timesheets and invoices',
}

export default function ContractorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          role="contractor"
          userName="Contractor Name"
          userEmail="contractor@company.com"
          userInitials="CN"
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
