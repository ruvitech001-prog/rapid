'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { WorkforceTrend } from '@/types/superadmin'

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
  border: '#DEE4EB',
  success600: '#22957F',
  success100: '#C6EFE5',
  warning600: '#CC7A00',
  warning100: '#FFE5B3',
}

interface WorkforceTrendChartProps {
  data: WorkforceTrend[]
}

export function WorkforceTrendChart({ data }: WorkforceTrendChartProps) {
  // Calculate growth percentage
  const calculateGrowth = () => {
    if (data.length < 2) return { employees: 0, contractors: 0 }
    const first = data[0]
    const last = data[data.length - 1]
    if (!first || !last) return { employees: 0, contractors: 0 }
    return {
      employees: first.employees > 0
        ? Math.round(((last.employees - first.employees) / first.employees) * 100)
        : 0,
      contractors: first.contractors > 0
        ? Math.round(((last.contractors - first.contractors) / first.contractors) * 100)
        : 0,
    }
  }

  const growth = calculateGrowth()

  return (
    <Card className="rounded-2xl shadow-sm" style={{ borderColor: colors.border }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary50 }}
            >
              <TrendingUp className="h-4 w-4" style={{ color: colors.primary500 }} />
            </div>
            <CardTitle className="text-base font-semibold" style={{ color: colors.neutral900 }}>
              Workforce Trend
            </CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary500 }} />
              <span className="text-xs" style={{ color: colors.neutral600 }}>
                Employees {growth.employees >= 0 ? '+' : ''}{growth.employees}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warning600 }} />
              <span className="text-xs" style={{ color: colors.neutral600 }}>
                Contractors {growth.contractors >= 0 ? '+' : ''}{growth.contractors}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="employeeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary500} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.primary500} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="contractorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.warning600} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.warning600} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.neutral500, fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.neutral500, fontSize: 12 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: colors.neutral900, fontWeight: 600, marginBottom: 4 }}
                itemStyle={{ color: colors.neutral600, fontSize: 12 }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: colors.neutral600 }}
              />
              <Area
                type="monotone"
                dataKey="employees"
                name="Employees"
                stroke={colors.primary500}
                strokeWidth={2}
                fill="url(#employeeGradient)"
              />
              <Area
                type="monotone"
                dataKey="contractors"
                name="Contractors"
                stroke={colors.warning600}
                strokeWidth={2}
                fill="url(#contractorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
