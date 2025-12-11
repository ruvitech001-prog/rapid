'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Headphones, Plus, MessageCircle, Clock } from 'lucide-react'

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
}

// Placeholder data - will be connected to real service later
const placeholderStats = {
  open: 12,
  inProgress: 5,
  resolved: 34,
  avgResponseTime: '2.4 hrs',
}

export function SupportTicketsWidget() {
  return (
    <Card className="rounded-2xl shadow-sm h-full" style={{ borderColor: colors.border }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary50 }}
            >
              <Headphones className="h-4 w-4" style={{ color: colors.primary500 }} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold" style={{ color: colors.neutral900 }}>
                Support Tickets
              </CardTitle>
              <p className="text-xs" style={{ color: colors.neutral500 }}>
                Customer support overview
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="h-8 px-3 text-xs rounded-lg"
            style={{ backgroundColor: colors.primary500 }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Ticket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: colors.warning50 }}
          >
            <p className="text-2xl font-bold" style={{ color: colors.warning600 }}>
              {placeholderStats.open}
            </p>
            <p className="text-xs font-medium" style={{ color: colors.warning600 }}>
              Open Tickets
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: colors.primary50 }}
          >
            <p className="text-2xl font-bold" style={{ color: colors.primary500 }}>
              {placeholderStats.inProgress}
            </p>
            <p className="text-xs font-medium" style={{ color: colors.primary500 }}>
              In Progress
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: colors.success50 }}
          >
            <p className="text-2xl font-bold" style={{ color: colors.success600 }}>
              {placeholderStats.resolved}
            </p>
            <p className="text-xs font-medium" style={{ color: colors.success600 }}>
              Resolved (This Week)
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: colors.neutral50 }}
          >
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" style={{ color: colors.neutral600 }} />
              <p className="text-xl font-bold" style={{ color: colors.neutral700 }}>
                {placeholderStats.avgResponseTime}
              </p>
            </div>
            <p className="text-xs font-medium" style={{ color: colors.neutral600 }}>
              Avg. Response Time
            </p>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div
          className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed"
          style={{ borderColor: colors.border, backgroundColor: colors.neutral50 }}
        >
          <MessageCircle className="h-10 w-10 mb-3" style={{ color: colors.neutral400 }} />
          <p className="text-sm font-medium mb-1" style={{ color: colors.neutral700 }}>
            Full Support System Coming Soon
          </p>
          <p className="text-xs text-center px-4" style={{ color: colors.neutral500 }}>
            Integrated ticketing, live chat, and automated responses will be available in the next release.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
