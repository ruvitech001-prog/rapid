'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import {
  useAttendanceStats,
  useTodayAttendance,
  useAttendanceHistory,
  useClockIn,
  useClockOut,
} from '@/lib/hooks'

export default function ClockInOutPage() {
  const { user } = useAuth()
  const employeeId = user?.id

  // Fetch attendance data
  const { data: stats, isLoading: statsLoading } = useAttendanceStats(employeeId)
  const { data: todayRecord, isLoading: todayLoading } = useTodayAttendance(employeeId)
  const { data: attendanceHistory, isLoading: historyLoading } = useAttendanceHistory(employeeId)

  // Mutations
  const clockInMutation = useClockIn()
  const clockOutMutation = useClockOut()

  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)

  const isLoading = statsLoading || todayLoading || historyLoading
  const isClockedIn = todayRecord?.status === 'clocked_in'
  const isCompleted = todayRecord?.status === 'clocked_out'

  // Get recent attendance (last 5 records)
  const recentAttendance = attendanceHistory?.slice(0, 5) || []

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setGettingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setGettingLocation(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setGettingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }, [])

  const handleClockIn = async () => {
    if (!employeeId) {
      toast.error('Please log in to clock in')
      return
    }

    try {
      await clockInMutation.mutateAsync({
        employeeId,
        location: location || undefined,
      })
      toast.success('Clocked in successfully!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clock in'
      toast.error(message)
    }
  }

  const handleClockOut = async () => {
    if (!employeeId) {
      toast.error('Please log in to clock out')
      return
    }

    // Confirm clock out
    if (!window.confirm('Are you sure you want to clock out?')) {
      return
    }

    try {
      await clockOutMutation.mutateAsync({
        employeeId,
        location: location || undefined,
      })
      toast.success('Clocked out successfully!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clock out'
      toast.error(message)
    }
  }

  const calculateWorkHours = () => {
    if (!todayRecord?.clock_in) return '0h 0m'

    const clockInParts = todayRecord.clock_in.split(':')
    const clockInMinutes =
      parseInt(clockInParts[0]!, 10) * 60 + parseInt(clockInParts[1]!, 10)

    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    const diff = Math.max(0, nowMinutes - clockInMinutes)
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60

    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Clock in/out for the day</p>
      </div>

      {/* Current Time & Status */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Time</p>
              <p className="text-5xl font-semibold text-foreground mt-3">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {isCompleted ? (
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-4 bg-green-50 dark:bg-green-950/30">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Attendance completed for today
                  </p>
                  <div className="flex justify-center gap-6 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Clock In</p>
                      <p className="text-lg font-semibold">{todayRecord?.clock_in}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clock Out</p>
                      <p className="text-lg font-semibold">{todayRecord?.clock_out}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Hours</p>
                      <p className="text-lg font-semibold">
                        {todayRecord?.total_hours?.toFixed(1)} hrs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : !isClockedIn ? (
              <Button
                size="lg"
                onClick={handleClockIn}
                disabled={clockInMutation.isPending}
                className="w-full sm:w-auto"
              >
                {clockInMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Clocking In...
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 mr-2" />
                    Clock In
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Clocked in at</p>
                  <p className="text-2xl font-semibold mt-2">{todayRecord?.clock_in}</p>
                  <p className="text-xs text-muted-foreground mt-3">Work Duration</p>
                  <p className="text-lg font-semibold mt-1">{calculateWorkHours()}</p>
                </div>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleClockOut}
                  disabled={clockOutMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {clockOutMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Clocking Out...
                    </>
                  ) : (
                    'Clock Out'
                  )}
                </Button>
              </div>
            )}

            {gettingLocation ? (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Getting location...</span>
              </div>
            ) : location ? (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs text-yellow-600">
                <MapPin className="h-4 w-4" />
                <span>Location not available</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {stats?.currentMonthStats?.present || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Days present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Working Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              {stats?.currentMonthStats?.workingDays || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leaves Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {stats?.currentMonthStats?.leaves || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-primary">
              {stats?.attendancePercentage || 100}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttendance.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent attendance records.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start by clocking in today!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Clock In
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Clock Out
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Hours
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">{record.clock_in || '-'}</td>
                      <td className="px-4 py-3">{record.clock_out || '-'}</td>
                      <td className="px-4 py-3 font-semibold">
                        {record.total_hours ? `${record.total_hours.toFixed(1)} hrs` : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            record.status === 'clocked_out'
                              ? 'default'
                              : record.status === 'clocked_in'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {record.status === 'clocked_out'
                            ? 'Completed'
                            : record.status === 'clocked_in'
                              ? 'In Progress'
                              : 'Absent'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Policy */}
      <Card className="border-border bg-muted/20">
        <CardHeader>
          <CardTitle className="text-sm">Attendance Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Standard work hours: 9:00 AM - 6:00 PM</li>
            <li>Grace period for clock-in: 15 minutes</li>
            <li>Minimum work hours required: 8 hours</li>
            <li>Location tracking is enabled for security purposes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
