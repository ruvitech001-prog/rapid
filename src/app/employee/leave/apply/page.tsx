'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export default function ApplyLeavePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    halfDay: false,
    halfDayPeriod: 'first_half',
  })

  const leaveBalances = [
    { type: 'earned_leave', label: 'Earned Leave', balance: 12, total: 18 },
    { type: 'casual_leave', label: 'Casual Leave', balance: 5, total: 12 },
    { type: 'sick_leave', label: 'Sick Leave', balance: 7, total: 12 },
    { type: 'comp_off', label: 'Comp Off', balance: 2, total: 0 },
    { type: 'lwp', label: 'Leave Without Pay', balance: 0, total: 0 },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return formData.halfDay ? 0.5 : diffDays
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Leave application:', formData)
    alert('Leave application submitted successfully!')
    router.push('/employee/leave/history')
  }

  const selectedLeaveBalance = leaveBalances.find(l => l.type === formData.leaveType)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Apply for Leave</h1>
        <p className="mt-1 text-sm text-muted-foreground">Submit your leave request</p>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaveBalances.filter(l => l.total > 0).map((leave) => (
          <Card key={leave.type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{leave.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{leave.balance}</p>
              <div className="mt-3 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(leave.balance / leave.total) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">of {leave.total} remaining</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leave Type */}
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type *</Label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Select Leave Type</option>
                  <option value="earned_leave">Earned Leave</option>
                  <option value="casual_leave">Casual Leave</option>
                  <option value="sick_leave">Sick Leave</option>
                  <option value="comp_off">Comp Off</option>
                  <option value="lwp">Leave Without Pay</option>
                </select>
                {selectedLeaveBalance && (
                  <p className="text-xs text-muted-foreground">
                    Available: {selectedLeaveBalance.balance} {selectedLeaveBalance.total > 0 ? `/ ${selectedLeaveBalance.total}` : ''}
                  </p>
                )}
              </div>

              {/* Half Day Checkbox */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="halfDay"
                    name="halfDay"
                    checked={formData.halfDay}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, halfDay: checked as boolean })
                    }
                  />
                  <Label htmlFor="halfDay" className="cursor-pointer">Half Day Leave</Label>
                </div>
                {formData.halfDay && (
                  <select
                    name="halfDayPeriod"
                    value={formData.halfDayPeriod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="first_half">First Half (Morning)</option>
                    <option value="second_half">Second Half (Afternoon)</option>
                  </select>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  disabled={formData.halfDay}
                />
                {formData.halfDay && (
                  <p className="text-xs text-muted-foreground">End date same as start date for half day</p>
                )}
              </div>

              {/* Reason */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  placeholder="Please provide a reason for your leave..."
                  rows={4}
                />
              </div>
            </div>

            {/* Summary */}
            {formData.startDate && formData.endDate && (
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <p className="text-sm font-semibold">Leave Summary</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold mt-1">{calculateDays()} day(s)</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">From - To</p>
                    <p className="text-sm font-semibold mt-1">
                      {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">
                Submit Leave Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
