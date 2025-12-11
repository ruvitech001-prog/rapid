'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, Briefcase, Building2, TrendingUp, UserPlus, UserMinus, IndianRupee } from 'lucide-react'
import type { WorkforceStats } from '@/types/superadmin'

// Figma Design Tokens
const colors = {
  primary500: '#642DFC',
  primary100: '#E0D5FE',
  primary50: '#F6F2FF',
  neutral900: '#1B1D21',
  neutral700: '#505862',
  neutral600: '#6A7682',
  neutral500: '#8593A3',
  neutral50: '#F4F7FA',
  secondaryBlue50: '#EBF5FF',
  secondaryBlue600: '#026ACA',
  success600: '#22957F',
  success50: '#EDF9F7',
  warning600: '#CC7A00',
  warning50: '#FFF9EB',
  rose50: '#FFF5F7',
  rose600: '#E11D48',
  border: '#DEE4EB',
}

interface StatsCardsProps {
  workforceStats: WorkforceStats
  totalClients: number
  totalRevenue: number
  monthlyRevenue: number
}

export function StatsCards({ workforceStats, totalClients, totalRevenue, monthlyRevenue }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Employees',
      value: workforceStats.totalEmployees,
      icon: Users,
      iconBg: colors.primary50,
      iconColor: colors.primary500,
      subLabel: `${workforceStats.activeEmployees} active`,
      trend: workforceStats.onboardingEmployees > 0 ? `+${workforceStats.onboardingEmployees} onboarding` : null,
      trendColor: colors.success600,
    },
    {
      label: 'Total Contractors',
      value: workforceStats.totalContractors,
      icon: Briefcase,
      iconBg: colors.warning50,
      iconColor: colors.warning600,
      subLabel: `${workforceStats.activeContractors} active`,
      trend: null,
      trendColor: null,
    },
    {
      label: 'Active Clients',
      value: totalClients,
      icon: Building2,
      iconBg: colors.secondaryBlue50,
      iconColor: colors.secondaryBlue600,
      subLabel: 'Companies',
      trend: null,
      trendColor: null,
    },
    {
      label: 'Monthly Revenue',
      value: `₹${(monthlyRevenue / 100000).toFixed(1)}L`,
      icon: IndianRupee,
      iconBg: colors.success50,
      iconColor: colors.success600,
      subLabel: `Total: ₹${(totalRevenue / 100000).toFixed(1)}L`,
      trend: null,
      trendColor: null,
    },
  ]

  const highlights = [
    {
      label: 'Onboarding',
      value: workforceStats.onboardingEmployees,
      icon: UserPlus,
      color: colors.success600,
      bgColor: colors.success50,
    },
    {
      label: 'Exiting',
      value: workforceStats.exitingEmployees,
      icon: UserMinus,
      color: colors.rose600,
      bgColor: colors.rose50,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            style={{ borderColor: colors.border }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: colors.neutral500 }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: colors.neutral900 }}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.neutral600 }}>
                    {stat.subLabel}
                  </p>
                  {stat.trend && (
                    <p className="text-xs mt-1 font-medium" style={{ color: stat.trendColor || colors.neutral600 }}>
                      {stat.trend}
                    </p>
                  )}
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.iconColor }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Highlights Row */}
      <div className="grid grid-cols-2 gap-4">
        {highlights.map((highlight) => (
          <Card
            key={highlight.label}
            className="rounded-xl shadow-sm"
            style={{ borderColor: colors.border, backgroundColor: highlight.bgColor }}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'white' }}
                >
                  <highlight.icon className="h-4 w-4" style={{ color: highlight.color }} />
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: highlight.color }}>
                    {highlight.value}
                  </p>
                  <p className="text-xs font-medium" style={{ color: highlight.color }}>
                    {highlight.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
