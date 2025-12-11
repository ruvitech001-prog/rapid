'use client'

import { useState } from 'react'
import { Download, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { useAttendanceStats, useMonthlyAttendanceCalendar } from '@/lib/hooks'

export default function AttendanceHistoryPage() {
  const { user } = useAuth()
  const employeeId = user?.id
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list')

  // Parse month selection
  const parts = selectedMonth.split('-').map(Number)
  const selectedYear = parts[0] || now.getFullYear()
  const selectedMonthNum = parts[1] || (now.getMonth() + 1)

  const { data: stats, isLoading: statsLoading } = useAttendanceStats(
    employeeId,
    selectedMonthNum - 1,
    selectedYear
  )
  const { data: calendar, isLoading: calendarLoading } = useMonthlyAttendanceCalendar(
    employeeId,
    selectedMonthNum - 1,
    selectedYear
  )

  const isLoading = statsLoading || calendarLoading

  const getStatusBadge = (status: string) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      leave: 'bg-blue-100 text-blue-800',
      weekend: 'bg-gray-100 text-gray-800',
      holiday: 'bg-purple-100 text-purple-800',
    }
    return (
      <Badge variant="outline" className={styles[status as keyof typeof styles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Calculate stats from calendar data
  const workingDaysRecords = calendar?.filter(r => r.status !== 'weekend' && r.status !== 'holiday') || []
  const presentDays = calendar?.filter(r => r.status === 'present').length || 0
  const absentDays = calendar?.filter(r => r.status === 'absent').length || 0
  const leaveDays = calendar?.filter(r => r.status === 'leave').length || 0
  const weekendDays = calendar?.filter(r => r.status === 'weekend').length || 0
  const holidayDays = calendar?.filter(r => r.status === 'holiday').length || 0
  const totalWorkHours = calendar?.reduce((sum, r) => sum + (r.totalHours || 0), 0) || 0
  const avgWorkHours = presentDays > 0 ? (totalWorkHours / presentDays) : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
          <p className="mt-2 text-muted-foreground">View your complete attendance records</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background focus:border-primary focus:outline-none text-sm"
          />
          <div className="flex rounded-md border border-input overflow-hidden">
            <button
              onClick={() => setViewType('list')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewType === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewType('calendar')}
              className={`px-4 py-2 text-sm font-medium border-l border-input transition-colors ${
                viewType === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Working Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats?.totalWorkingDays || workingDaysRecords.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">{stats?.daysPresent || presentDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-destructive">{stats?.daysAbsent || absentDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">{stats?.leavesTaken || leaveDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Weekends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-600">{weekendDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-purple-600">{holidayDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalWorkHours}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Attendance %</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              {stats?.attendancePercentage || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      {viewType === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {!calendar || calendar.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No attendance records for this month.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                        Day
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                        Clock In
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                        Clock Out
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                        Work Hours
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {calendar.map((record, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {new Date(record.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {record.clockIn || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {record.clockOut || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          {record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(record.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6">
            {/* Simple Calendar View */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {calendar?.map((record, idx) => {
                const date = new Date(record.date)
                const dayOfWeek = date.getDay()

                // Add empty cells for the first week
                const emptyCells = idx === 0 ? Array(dayOfWeek).fill(null) : []

                const statusColors = {
                  present: 'bg-green-100 text-green-800',
                  absent: 'bg-red-100 text-red-800',
                  leave: 'bg-blue-100 text-blue-800',
                  weekend: 'bg-gray-50 text-gray-400',
                  holiday: 'bg-purple-100 text-purple-800',
                }

                return (
                  <>
                    {emptyCells.map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    <div
                      key={record.date}
                      className={`aspect-square flex items-center justify-center text-sm rounded-md ${statusColors[record.status]}`}
                    >
                      {date.getDate()}
                    </div>
                  </>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100"></span> Present</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100"></span> Leave</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-50 border"></span> Weekend</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100"></span> Holiday</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Options */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Export to Excel
        </Button>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  )
}
