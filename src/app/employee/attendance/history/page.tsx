'use client'

import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AttendanceHistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-02')
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list')

  const attendanceRecords = [
    { date: '2024-02-20', clockIn: '09:15 AM', clockOut: '06:30 PM', hours: 9.25, status: 'present', lateBy: 15 },
    { date: '2024-02-19', clockIn: '09:00 AM', clockOut: '06:15 PM', hours: 9.25, status: 'present', lateBy: 0 },
    { date: '2024-02-18', clockIn: '-', clockOut: '-', hours: 0, status: 'weekend', lateBy: 0 },
    { date: '2024-02-17', clockIn: '-', clockOut: '-', hours: 0, status: 'weekend', lateBy: 0 },
    { date: '2024-02-16', clockIn: '09:30 AM', clockOut: '06:45 PM', hours: 9.25, status: 'present', lateBy: 30 },
    { date: '2024-02-15', clockIn: '09:10 AM', clockOut: '06:20 PM', hours: 9.17, status: 'present', lateBy: 10 },
    { date: '2024-02-14', clockIn: '-', clockOut: '-', hours: 0, status: 'leave', lateBy: 0 },
    { date: '2024-02-13', clockIn: '09:05 AM', clockOut: '06:10 PM', hours: 9.08, status: 'present', lateBy: 5 },
    { date: '2024-02-12', clockIn: '08:55 AM', clockOut: '06:00 PM', hours: 9.08, status: 'present', lateBy: 0 },
  ]

  const monthStats = {
    totalDays: 24,
    present: 20,
    absent: 1,
    leaves: 1,
    weekends: 8,
    lateArrivals: 4,
    avgWorkHours: 9.15,
    totalWorkHours: 184.5,
  }

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
            <p className="text-2xl font-semibold">{monthStats.totalDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">{monthStats.present}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-destructive">{monthStats.absent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">{monthStats.leaves}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Late Arrivals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-orange-600">{monthStats.lateArrivals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Avg Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{monthStats.avgWorkHours}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{monthStats.totalWorkHours}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">Attendance %</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              {((monthStats.present / monthStats.totalDays) * 100).toFixed(0)}%
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
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Late By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {attendanceRecords.map((record, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {new Date(record.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.clockIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.clockOut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        {record.hours > 0 ? `${record.hours.toFixed(2)} hrs` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.lateBy > 0 ? (
                          <span className="text-destructive font-medium">{record.lateBy} min</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Calendar view coming soon...</p>
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
