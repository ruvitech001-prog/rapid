'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ClockInOutPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null)

  const recentAttendance = [
    { date: '2024-02-19', clockIn: '09:15 AM', clockOut: '06:30 PM', hours: 9.25, status: 'present' },
    { date: '2024-02-16', clockIn: '09:00 AM', clockOut: '06:15 PM', hours: 9.25, status: 'present' },
    { date: '2024-02-15', clockIn: '09:30 AM', clockOut: '06:45 PM', hours: 9.25, status: 'present' },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const handleClockIn = () => {
    setIsClockedIn(true)
    setClockInTime(new Date())
    alert('Clocked in successfully!')
  }

  const handleClockOut = () => {
    if (confirm('Are you sure you want to clock out?')) {
      setIsClockedIn(false)
      alert('Clocked out successfully!')
    }
  }

  const calculateWorkHours = () => {
    if (!clockInTime) return '0h 0m'
    const now = new Date()
    const diff = now.getTime() - clockInTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
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
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {!isClockedIn ? (
              <Button size="lg" onClick={handleClockIn} className="w-full sm:w-auto">
                <Clock className="h-5 w-5 mr-2" />
                Clock In
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Clocked in at</p>
                  <p className="text-2xl font-semibold mt-2">
                    {clockInTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">Work Duration</p>
                  <p className="text-lg font-semibold mt-1">{calculateWorkHours()}</p>
                </div>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleClockOut}
                  className="w-full sm:w-auto"
                >
                  Clock Out
                </Button>
              </div>
            )}

            {location && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
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
            <p className="text-3xl font-semibold">22</p>
            <p className="text-xs text-muted-foreground mt-1">Days present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Clock In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">9:15 AM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Work Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">9.2 hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
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
                {recentAttendance.map((record, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {record.clockIn}
                    </td>
                    <td className="px-4 py-3">
                      {record.clockOut}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {record.hours.toFixed(2)} hrs
                    </td>
                    <td className="px-4 py-3">
                      <Badge>Present</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
