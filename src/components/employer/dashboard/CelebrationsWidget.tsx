'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUpcomingCelebrations } from '@/lib/hooks'
import { Loader2, Cake, Award, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { colors } from '@/lib/design-tokens'

interface CelebrationsWidgetProps {
  companyId: string | undefined
}

export function CelebrationsWidget({ companyId }: CelebrationsWidgetProps) {
  const { data: celebrations = [], isLoading } = useUpcomingCelebrations(companyId, 30)

  if (isLoading) {
    return (
      <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: colors.primary500 }} />
        </CardContent>
      </Card>
    )
  }

  const birthdays = celebrations.filter((c) => c.type === 'birthday')
  const anniversaries = celebrations.filter((c) => c.type === 'anniversary')

  return (
    <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
            Birthdays & Anniversaries
          </CardTitle>
          {celebrations.length > 4 && (
            <Link
              href="/employer/employees"
              className="text-xs font-semibold flex items-center gap-0.5"
              style={{ color: colors.iconBlue }}
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {celebrations.length === 0 ? (
          <div className="py-6 text-center">
            <Cake className="h-8 w-8 mx-auto mb-2" style={{ color: colors.neutral500 }} />
            <p className="text-sm" style={{ color: colors.neutral500 }}>
              No celebrations this month
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {celebrations.slice(0, 5).map((celebration) => (
              <div
                key={`${celebration.id}-${celebration.type}`}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor:
                    celebration.type === 'birthday' ? colors.rose50 : colors.aqua50,
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      celebration.type === 'birthday' ? colors.rose200 : colors.aqua200,
                  }}
                >
                  {celebration.type === 'birthday' ? (
                    <Cake className="h-4 w-4 text-white" />
                  ) : (
                    <Award className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: colors.neutral700 }}>
                    {celebration.name}
                  </p>
                  <p className="text-xs" style={{ color: colors.neutral500 }}>
                    {celebration.type === 'birthday'
                      ? 'Birthday'
                      : `${celebration.years} year${celebration.years !== 1 ? 's' : ''} anniversary`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium" style={{ color: colors.neutral700 }}>
                    {new Date(celebration.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
