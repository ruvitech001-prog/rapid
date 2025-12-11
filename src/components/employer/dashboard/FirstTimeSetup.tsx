'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCompanySetupStatus } from '@/lib/hooks'
import {
  Loader2,
  UserPlus,
  Calendar,
  FileText,
  Shield,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Heart,
  Gift,
  Search,
} from 'lucide-react'
import Link from 'next/link'

const colors = {
  primary500: '#642DFC',
  primary100: '#E0D5FE',
  primary50: '#F6F2FF',
  iconBlue: '#586AF5',
  neutral800: '#353B41',
  neutral700: '#505862',
  neutral600: '#6A7682',
  neutral500: '#8593A3',
  neutral50: '#F4F7FA',
  border: '#DEE4EB',
  success600: '#22957F',
  success50: '#EDF9F7',
  secondaryBlue50: '#EBF5FF',
}

interface FirstTimeSetupProps {
  companyId: string | undefined
  companyName?: string
}

export function FirstTimeSetup({ companyId, companyName }: FirstTimeSetupProps) {
  const { data: setupStatus, isLoading } = useCompanySetupStatus(companyId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary500 }} />
      </div>
    )
  }

  // If setup is complete, don't show this component
  if (setupStatus?.hasEmployees) {
    return null
  }

  const setupItems = [
    {
      id: 'incentive-structure',
      label: 'Customize Incentive Structure',
      description: 'Set up salary components and bonuses',
      icon: DollarSign,
      href: '/employer/settings/salary-structure',
      completed: false, // Would need backend check
    },
    {
      id: 'leave-policy',
      label: 'Define Leave Policy',
      description: 'Set up leave types and balances',
      icon: FileText,
      href: '/employer/leave/settings',
      completed: setupStatus?.hasLeavePolicy || false,
    },
    {
      id: 'holiday-calendar',
      label: 'Design Holiday Calendar',
      description: 'Add company holidays',
      icon: Calendar,
      href: '/employer/holidays',
      completed: setupStatus?.hasHolidayCalendar || false,
    },
    {
      id: 'health-insurance',
      label: 'Select Health Insurance Plan',
      description: 'Choose coverage for employees',
      icon: Heart,
      href: '/employer/perks',
      completed: false, // Would need backend check
    },
    {
      id: 'welcome-swag',
      label: 'Choose Welcome Swag Combos',
      description: 'Select welcome kit options',
      icon: Gift,
      href: '/employer/perks',
      completed: false, // Would need backend check
    },
    {
      id: 'bgv',
      label: 'Pick Background Verification',
      description: 'Set up verification levels',
      icon: Search,
      href: '/employer/perks',
      completed: false, // Would need backend check
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-8"
        style={{ backgroundColor: colors.secondaryBlue50 }}
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.neutral800 }}>
          Welcome to {companyName || 'Rapid.one'}!
        </h1>
        <p className="text-base mb-6" style={{ color: colors.neutral600 }}>
          Let&apos;s get your company set up. Complete these steps to start managing your team.
        </p>
        <div className="flex gap-4">
          <Button
            asChild
            className="h-11 px-6 text-sm font-semibold rounded-lg"
            style={{ backgroundColor: colors.primary500 }}
          >
            <Link href="/employer/employees/new">
              <UserPlus className="h-4 w-4 mr-2" />
              Hire your first employee
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 px-6 text-sm font-semibold rounded-lg"
            style={{ borderColor: colors.iconBlue, color: colors.iconBlue }}
          >
            <Link href="/employer/contractors/new">
              Add a contractor
            </Link>
          </Button>
        </div>
      </div>

      {/* Setup Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Empty State Illustration */}
        <Card
          className="rounded-2xl"
          style={{ borderColor: colors.border, backgroundColor: colors.neutral50 }}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary100 }}
            >
              <UserPlus className="h-10 w-10" style={{ color: colors.primary500 }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.neutral800 }}>
              No team members yet
            </h3>
            <p className="text-sm text-center mb-4" style={{ color: colors.neutral500 }}>
              Start building your team by adding your first employee or contractor
            </p>
          </CardContent>
        </Card>

        {/* Right: Setup Checklist */}
        <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
                Personalize Company Policies
              </CardTitle>
              <span className="text-xs font-medium" style={{ color: colors.neutral500 }}>
                {setupStatus?.completedCount || 0}/{setupItems.length} completed
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-0 max-h-[320px] overflow-y-auto">
              {setupItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-4 py-4 ${
                    index !== setupItems.length - 1 ? 'border-b' : ''
                  } hover:bg-gray-50 -mx-4 px-4 transition-colors`}
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: item.completed ? colors.success50 : colors.primary50,
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5" style={{ color: colors.success600 }} />
                    ) : (
                      <item.icon className="h-5 w-5" style={{ color: colors.primary500 }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${item.completed ? 'line-through' : ''}`}
                      style={{ color: item.completed ? colors.neutral500 : colors.neutral700 }}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs" style={{ color: colors.neutral500 }}>
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: colors.neutral500 }} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
