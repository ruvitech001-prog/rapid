'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProbationEnding } from '@/lib/hooks'
import { Loader2, AlertCircle, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'

const colors = {
  primary500: '#642DFC',
  iconBlue: '#586AF5',
  neutral800: '#353B41',
  neutral700: '#505862',
  neutral500: '#8593A3',
  neutral50: '#F4F7FA',
  border: '#DEE4EB',
  warning600: '#CC7A00',
  warning50: '#FFF8EB',
}

interface ProbationWidgetProps {
  companyId: string | undefined
}

export function ProbationWidget({ companyId }: ProbationWidgetProps) {
  const { data: probationEmployees = [], isLoading } = useProbationEnding(companyId, 14)

  if (isLoading) {
    return (
      <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: colors.primary500 }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
              Probation Ending
            </CardTitle>
            {probationEmployees.length > 0 && (
              <span
                className="px-2 py-0.5 text-xs font-medium rounded-full"
                style={{ backgroundColor: colors.warning50, color: colors.warning600 }}
              >
                {probationEmployees.length}
              </span>
            )}
          </div>
          {probationEmployees.length > 3 && (
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
        {probationEmployees.length === 0 ? (
          <div className="py-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2" style={{ color: colors.neutral500 }} />
            <p className="text-sm" style={{ color: colors.neutral500 }}>
              No probations ending soon
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {probationEmployees.slice(0, 4).map((employee, index) => (
              <div
                key={employee.id}
                className={`flex items-center justify-between py-3 ${
                  index !== Math.min(probationEmployees.length, 4) - 1 ? 'border-b' : ''
                }`}
                style={{ borderColor: colors.border }}
              >
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
                      {employee.name}
                    </p>
                    <ChevronRight className="h-3.5 w-3.5" style={{ color: colors.neutral500 }} />
                  </div>
                  <p className="text-xs" style={{ color: colors.neutral500 }}>
                    {employee.designation} • {employee.department}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      employee.daysRemaining <= 3 ? 'text-red-600' : ''
                    }`}
                    style={{
                      color: employee.daysRemaining <= 3 ? undefined : colors.warning600,
                    }}
                  >
                    {employee.daysRemaining === 0
                      ? 'Today'
                      : employee.daysRemaining === 1
                      ? 'Tomorrow'
                      : `${employee.daysRemaining} days`}
                  </p>
                  <p className="text-xs" style={{ color: colors.neutral500 }}>
                    {new Date(employee.probationEndDate).toLocaleDateString('en-US', {
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
