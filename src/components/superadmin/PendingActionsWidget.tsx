'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  ChevronRight,
  Calendar,
  Receipt,
  FileText,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import type { PendingAction } from '@/types/superadmin'

// Figma Design Tokens
const colors = {
  primary500: '#642DFC',
  primary100: '#E0D5FE',
  primary50: '#F6F2FF',
  neutral900: '#1B1D21',
  neutral700: '#505862',
  neutral600: '#6A7682',
  neutral500: '#8593A3',
  neutral400: '#A8B5C2',
  neutral50: '#F4F7FA',
  border: '#DEE4EB',
  success600: '#22957F',
  success50: '#EDF9F7',
  warning600: '#CC7A00',
  warning50: '#FFF9EB',
  rose600: '#E11D48',
  rose50: '#FFF5F7',
  secondaryBlue600: '#026ACA',
  secondaryBlue50: '#EBF5FF',
}

const typeConfig: Record<PendingAction['type'], {
  icon: React.ElementType
  label: string
  bgColor: string
  iconColor: string
  link: string
}> = {
  leave: {
    icon: Calendar,
    label: 'Leave Request',
    bgColor: colors.secondaryBlue50,
    iconColor: colors.secondaryBlue600,
    link: '/super-admin/leaves',
  },
  expense: {
    icon: Receipt,
    label: 'Expense Claim',
    bgColor: colors.success50,
    iconColor: colors.success600,
    link: '/super-admin/requests',
  },
  invoice: {
    icon: FileText,
    label: 'Invoice',
    bgColor: colors.warning50,
    iconColor: colors.warning600,
    link: '/super-admin/invoices',
  },
  request: {
    icon: MessageSquare,
    label: 'Request',
    bgColor: colors.primary50,
    iconColor: colors.primary500,
    link: '/super-admin/requests',
  },
  escalation: {
    icon: AlertTriangle,
    label: 'Escalation',
    bgColor: colors.rose50,
    iconColor: colors.rose600,
    link: '/super-admin/requests',
  },
}

const priorityConfig: Record<PendingAction['priority'], {
  label: string
  bgColor: string
  textColor: string
}> = {
  high: {
    label: 'High',
    bgColor: colors.rose50,
    textColor: colors.rose600,
  },
  medium: {
    label: 'Medium',
    bgColor: colors.warning50,
    textColor: colors.warning600,
  },
  low: {
    label: 'Low',
    bgColor: colors.neutral50,
    textColor: colors.neutral600,
  },
}

interface PendingActionsWidgetProps {
  actions: PendingAction[]
}

export function PendingActionsWidget({ actions }: PendingActionsWidgetProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.type]) {
      acc[action.type] = []
    }
    acc[action.type].push(action)
    return acc
  }, {} as Record<PendingAction['type'], PendingAction[]>)

  const highPriorityCount = actions.filter(a => a.priority === 'high').length

  return (
    <Card className="rounded-2xl shadow-sm h-full" style={{ borderColor: colors.border }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.warning50 }}
            >
              <Clock className="h-4 w-4" style={{ color: colors.warning600 }} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold" style={{ color: colors.neutral900 }}>
                Pending Actions
              </CardTitle>
              <p className="text-xs" style={{ color: colors.neutral500 }}>
                {actions.length} items need attention
              </p>
            </div>
          </div>
          {highPriorityCount > 0 && (
            <Badge
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: colors.rose50, color: colors.rose600 }}
            >
              {highPriorityCount} urgent
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Category Summary */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(groupedActions).map(([type, items]) => {
            const config = typeConfig[type as PendingAction['type']]
            return (
              <Link
                key={type}
                href={config.link}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: config.bgColor }}
              >
                <config.icon className="h-3.5 w-3.5" style={{ color: config.iconColor }} />
                <span className="text-xs font-medium" style={{ color: config.iconColor }}>
                  {items.length} {config.label}s
                </span>
              </Link>
            )
          })}
        </div>

        {/* Action Items List */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto">
          {actions.slice(0, 8).map((action) => {
            const config = typeConfig[action.type]
            const priority = priorityConfig[action.priority]

            return (
              <Link
                key={action.id}
                href={config.link}
                className="flex items-start gap-3 p-3 rounded-xl border transition-colors hover:bg-gray-50"
                style={{ borderColor: colors.border }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <config.icon className="h-4 w-4" style={{ color: config.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate" style={{ color: colors.neutral900 }}>
                      {action.title}
                    </p>
                    <Badge
                      className="rounded-full px-1.5 py-0 text-[10px]"
                      style={{ backgroundColor: priority.bgColor, color: priority.textColor }}
                    >
                      {priority.label}
                    </Badge>
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: colors.neutral500 }}>
                    {action.requester} • {action.company}
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.neutral500 }}>
                    {formatDate(action.createdAt)}
                    {action.dueDate && (
                      <span style={{ color: colors.rose600 }}>
                        {' '}• Due {new Date(action.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: colors.neutral400 }} />
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        {actions.length > 8 && (
          <div className="mt-4 pt-3 border-t" style={{ borderColor: colors.border }}>
            <Button
              variant="ghost"
              className="w-full h-9 text-sm font-medium"
              style={{ color: colors.primary500 }}
              asChild
            >
              <Link href="/super-admin/requests">
                View all {actions.length} pending items
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
