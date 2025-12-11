'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { useTeamHeadcount } from '@/lib/hooks'
import { Loader2 } from 'lucide-react'

const colors = {
  primary500: '#642DFC',
  iconBlue: '#586AF5',
  neutral800: '#353B41',
  neutral500: '#8593A3',
  neutral400: '#A8B5C2',
  border: '#DEE4EB',
  aqua400: '#4AD3E5',
  rose200: '#FFB5C6',
}

const barColors = ['#4AD3E5', '#FFB5C6', '#9ACEFE', '#A7ECCA', '#FFDD99', '#77DEEC']

interface TeamHeadcountChartProps {
  companyId: string | undefined
}

export function TeamHeadcountChart({ companyId }: TeamHeadcountChartProps) {
  const { data: teamData = [], isLoading } = useTeamHeadcount(companyId)

  if (isLoading) {
    return (
      <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.primary500 }} />
        </CardContent>
      </Card>
    )
  }

  if (teamData.length === 0) {
    return (
      <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
            Headcount by Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-sm" style={{ color: colors.neutral500 }}>
            No team data available yet
          </p>
        </CardContent>
      </Card>
    )
  }

  // Transform data for horizontal bar chart
  const chartData = teamData.slice(0, 6).map((t, i) => ({
    name: t.team,
    total: t.total,
    employees: t.employees,
    contractors: t.contractors,
    fill: barColors[i % barColors.length],
  }))

  return (
    <Card className="rounded-2xl" style={{ borderColor: colors.border }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold" style={{ color: colors.neutral800 }}>
          Headcount by Teams
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 20 }}
            barSize={16}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.neutral500, fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.neutral500, fontSize: 11 }}
              width={80}
            />
            <Tooltip
              formatter={(value, name, props) => [
                `${props.payload.employees} employees, ${props.payload.contractors} contractors`,
                'Total',
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="total" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
          {chartData.map((team) => (
            <div key={team.name} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: team.fill }}
              />
              <span className="text-xs" style={{ color: colors.neutral500 }}>
                {team.name}: {team.total}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
