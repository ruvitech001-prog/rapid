import { BaseService } from './base.service'

// Types for attendance records
export interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  clock_in?: string | null
  clock_out?: string | null
  clock_in_location?: { lat: number; lng: number } | null
  clock_out_location?: { lat: number; lng: number } | null
  total_hours?: number | null
  status: 'clocked_in' | 'clocked_out' | 'absent'
  created_at: string | null
  updated_at: string | null
}

export interface AttendanceStats {
  totalWorkingDays: number
  daysPresent: number
  daysAbsent: number
  leavesTaken: number
  attendancePercentage: number
  currentMonthStats: {
    workingDays: number
    present: number
    absent: number
    leaves: number
  }
}

export interface DailyAttendance {
  date: string
  status: 'present' | 'absent' | 'leave' | 'holiday' | 'weekend'
  clockIn?: string
  clockOut?: string
  totalHours?: number
}

class AttendanceServiceClass extends BaseService {
  // Get attendance stats for an employee
  async getAttendanceStats(
    employeeId: string,
    month?: number,
    year?: number
  ): Promise<AttendanceStats> {
    const now = new Date()
    const targetMonth = month ?? now.getMonth()
    const targetYear = year ?? now.getFullYear()

    // Get employee's contract start date
    const { data: contract } = await this.supabase
      .from('employee_employeecontract')
      .select('start_date, company_id')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    const contractStart = contract?.start_date
      ? new Date(contract.start_date)
      : new Date(targetYear, 0, 1)

    // Get leaves taken this month
    const monthStart = new Date(targetYear, targetMonth, 1)
    const monthEnd = new Date(targetYear, targetMonth + 1, 0)

    const { data: leaves } = await this.supabase
      .from('leave_leaverequest')
      .select('total_days, start_date, end_date, status')
      .eq('employee_id', employeeId)
      .eq('status', 'approved')
      .gte('start_date', monthStart.toISOString().split('T')[0])
      .lte('end_date', monthEnd.toISOString().split('T')[0])

    const leaveDays =
      leaves?.reduce((sum, l) => sum + (l.total_days || 0), 0) || 0

    // Get holidays for this month
    const { data: holidays } = await this.supabase
      .from('holiday_holiday')
      .select('date')
      .eq('company_id', contract?.company_id || '')
      .gte('date', monthStart.toISOString().split('T')[0])
      .lte('date', monthEnd.toISOString().split('T')[0])

    const holidayCount = holidays?.length || 0

    // Calculate working days (excluding weekends and holidays)
    const workingDays = this.calculateWorkingDays(
      monthStart,
      monthEnd,
      holidays?.map((h) => h.date) || []
    )

    // Calculate days up to today (for current month)
    const effectiveEndDate =
      targetMonth === now.getMonth() && targetYear === now.getFullYear()
        ? now
        : monthEnd

    const daysPassedInMonth = this.calculateWorkingDays(
      monthStart,
      effectiveEndDate,
      holidays?.map((h) => h.date) || []
    )

    // Calculate attendance based on contract start
    const startDateForCalc =
      contractStart > monthStart ? contractStart : monthStart

    const expectedDays =
      startDateForCalc <= effectiveEndDate
        ? this.calculateWorkingDays(
            startDateForCalc,
            effectiveEndDate,
            holidays?.map((h) => h.date) || []
          )
        : 0

    const daysPresent = Math.max(0, expectedDays - leaveDays)
    const attendancePercentage =
      expectedDays > 0 ? Math.round((daysPresent / expectedDays) * 100) : 100

    return {
      totalWorkingDays: workingDays,
      daysPresent,
      daysAbsent: 0, // No absences tracked without clock-in system
      leavesTaken: leaveDays,
      attendancePercentage,
      currentMonthStats: {
        workingDays,
        present: daysPresent,
        absent: 0,
        leaves: leaveDays,
      },
    }
  }

  // Calculate working days between two dates excluding weekends and holidays
  private calculateWorkingDays(
    startDate: Date,
    endDate: Date,
    holidays: string[]
  ): number {
    let count = 0
    const current = new Date(startDate)

    while (current <= endDate) {
      const dayOfWeek = current.getDay()
      const dateStr = current.toISOString().split('T')[0]!

      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip holidays
        if (!holidays.includes(dateStr)) {
          count++
        }
      }

      current.setDate(current.getDate() + 1)
    }

    return count
  }

  // Get company-wide attendance summary
  async getCompanyAttendanceStats(companyId: string): Promise<{
    averageAttendance: number
    totalEmployees: number
    presentToday: number
    onLeaveToday: number
  }> {
    // Get active employees
    const { data: contracts } = await this.supabase
      .from('employee_employeecontract')
      .select('employee_id')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    const employeeCount = contracts?.length || 0
    const today = new Date().toISOString().split('T')[0]

    // Get employees on leave today
    const { data: leavesToday } = await this.supabase
      .from('leave_leaverequest')
      .select('employee_id')
      .eq('status', 'approved')
      .lte('start_date', today)
      .gte('end_date', today)

    const onLeaveToday = leavesToday?.length || 0
    const presentToday = employeeCount - onLeaveToday

    // Calculate average attendance (simplified - assumes all present except leaves)
    const averageAttendance =
      employeeCount > 0
        ? Math.round((presentToday / employeeCount) * 100)
        : 100

    return {
      averageAttendance,
      totalEmployees: employeeCount,
      presentToday,
      onLeaveToday,
    }
  }

  // Get monthly attendance calendar for an employee
  async getMonthlyCalendar(
    employeeId: string,
    month: number,
    year: number
  ): Promise<DailyAttendance[]> {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)

    // Get employee's company
    const { data: contract } = await this.supabase
      .from('employee_employeecontract')
      .select('company_id')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()

    // Get holidays
    const { data: holidays } = await this.supabase
      .from('holiday_holiday')
      .select('date, name')
      .eq('company_id', contract?.company_id || '')
      .gte('date', monthStart.toISOString().split('T')[0])
      .lte('date', monthEnd.toISOString().split('T')[0])

    const holidayDates = new Set(holidays?.map((h) => h.date) || [])

    // Get leaves
    const { data: leaves } = await this.supabase
      .from('leave_leaverequest')
      .select('start_date, end_date, status')
      .eq('employee_id', employeeId)
      .eq('status', 'approved')
      .or(
        `start_date.lte.${monthEnd.toISOString().split('T')[0]},end_date.gte.${monthStart.toISOString().split('T')[0]}`
      )

    // Build leave dates set
    const leaveDates = new Set<string>()
    leaves?.forEach((leave) => {
      if (!leave.start_date || !leave.end_date) return
      const start = new Date(leave.start_date)
      const end = new Date(leave.end_date)
      const current = new Date(start)
      while (current <= end) {
        leaveDates.add(current.toISOString().split('T')[0]!)
        current.setDate(current.getDate() + 1)
      }
    })

    // Build calendar
    const calendar: DailyAttendance[] = []
    const current = new Date(monthStart)
    const today = new Date()

    while (current <= monthEnd) {
      const dateStr = current.toISOString().split('T')[0] as string
      const dayOfWeek = current.getDay()

      let status: DailyAttendance['status'] = 'present'

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'weekend'
      } else if (holidayDates.has(dateStr)) {
        status = 'holiday'
      } else if (leaveDates.has(dateStr)) {
        status = 'leave'
      } else if (current > today) {
        status = 'present' // Future dates shown as expected present
      }

      calendar.push({
        date: dateStr,
        status,
        clockIn: status === 'present' && current <= today ? '09:00' : undefined,
        clockOut: status === 'present' && current <= today ? '18:00' : undefined,
        totalHours: status === 'present' && current <= today ? 9 : undefined,
      })

      current.setDate(current.getDate() + 1)
    }

    return calendar
  }

  // ===== CLOCK IN/OUT METHODS =====
  // Using Supabase attendance_employeeattendance table

  /**
   * Get employee's company_id from their contract
   */
  private async getEmployeeCompanyId(employeeId: string): Promise<string | null> {
    const { data } = await this.supabase
      .from('employee_employeecontract')
      .select('company_id')
      .eq('employee_id', employeeId)
      .eq('is_current', true)
      .single()
    return data?.company_id || null
  }

  /**
   * Clock in an employee
   */
  async clockIn(
    employeeId: string,
    location?: { lat: number; lng: number }
  ): Promise<AttendanceRecord> {
    const today = new Date().toISOString().split('T')[0]!
    const now = new Date()
    const clockInTime = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })

    // Get company_id
    const companyId = await this.getEmployeeCompanyId(employeeId)
    if (!companyId) {
      throw new Error('Employee contract not found')
    }

    // Check if already clocked in today
    const { data: existingRecord } = await this.supabase
      .from('attendance_employeeattendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single()

    if (existingRecord && existingRecord.status === 'clocked_in') {
      throw new Error('Already clocked in for today')
    }

    if (existingRecord && existingRecord.status === 'clocked_out') {
      throw new Error('Already completed attendance for today')
    }

    // Create new attendance record
    const { data: newRecord, error } = await this.supabase
      .from('attendance_employeeattendance')
      .insert({
        employee_id: employeeId,
        company_id: companyId,
        date: today,
        clock_in: clockInTime,
        clock_in_location_lat: location?.lat,
        clock_in_location_lng: location?.lng,
        status: 'clocked_in',
        work_type: 'office',
      })
      .select()
      .single()

    if (error) {
      console.error('Clock in error:', error)
      throw new Error('Failed to clock in. Please try again.')
    }

    // Transform to AttendanceRecord format (convert null to undefined)
    return {
      id: newRecord.id,
      employee_id: newRecord.employee_id,
      date: newRecord.date,
      clock_in: newRecord.clock_in ?? undefined,
      clock_in_location: location,
      status: newRecord.status as AttendanceRecord['status'],
      created_at: newRecord.created_at ?? new Date().toISOString(),
      updated_at: newRecord.updated_at ?? new Date().toISOString(),
    }
  }

  /**
   * Clock out an employee
   */
  async clockOut(
    employeeId: string,
    location?: { lat: number; lng: number }
  ): Promise<AttendanceRecord> {
    const today = new Date().toISOString().split('T')[0]!
    const clockOutTime = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })

    // Get today's record
    const { data: record, error: fetchError } = await this.supabase
      .from('attendance_employeeattendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single()

    if (fetchError || !record) {
      throw new Error('No clock-in record found for today. Please clock in first.')
    }

    if (record.status === 'clocked_out') {
      throw new Error('Already clocked out for today')
    }

    // Calculate total hours with safe array access
    const clockInParts = record.clock_in?.split(':') || []
    const clockOutParts = clockOutTime.split(':')

    // Validate array bounds and parse with NaN fallback
    const clockInHour = clockInParts.length > 0 ? parseInt(clockInParts[0]!, 10) : 0
    const clockInMin = clockInParts.length > 1 ? parseInt(clockInParts[1]!, 10) : 0
    const clockOutHour = clockOutParts.length > 0 ? parseInt(clockOutParts[0]!, 10) : 0
    const clockOutMin = clockOutParts.length > 1 ? parseInt(clockOutParts[1]!, 10) : 0

    // Handle NaN values
    const clockInMinutes = (isNaN(clockInHour) ? 0 : clockInHour) * 60 + (isNaN(clockInMin) ? 0 : clockInMin)
    const clockOutMinutes = (isNaN(clockOutHour) ? 0 : clockOutHour) * 60 + (isNaN(clockOutMin) ? 0 : clockOutMin)
    const totalHours = Math.max(0, (clockOutMinutes - clockInMinutes) / 60)

    // Update record
    const { data: updatedRecord, error: updateError } = await this.supabase
      .from('attendance_employeeattendance')
      .update({
        clock_out: clockOutTime,
        clock_out_location_lat: location?.lat,
        clock_out_location_lng: location?.lng,
        total_hours: Math.round(totalHours * 100) / 100,
        status: 'clocked_out',
      })
      .eq('id', record.id)
      .select()
      .single()

    if (updateError) {
      console.error('Clock out error:', updateError)
      throw new Error('Failed to clock out. Please try again.')
    }

    return {
      id: updatedRecord.id,
      employee_id: updatedRecord.employee_id,
      date: updatedRecord.date,
      clock_in: updatedRecord.clock_in ?? undefined,
      clock_out: updatedRecord.clock_out ?? undefined,
      clock_in_location: record.clock_in_location_lat && record.clock_in_location_lng
        ? { lat: Number(record.clock_in_location_lat), lng: Number(record.clock_in_location_lng) }
        : undefined,
      clock_out_location: location,
      total_hours: updatedRecord.total_hours ?? undefined,
      status: updatedRecord.status as AttendanceRecord['status'],
      created_at: updatedRecord.created_at ?? new Date().toISOString(),
      updated_at: updatedRecord.updated_at ?? new Date().toISOString(),
    }
  }

  /**
   * Get today's attendance record for an employee
   */
  async getTodayRecord(employeeId: string): Promise<AttendanceRecord | null> {
    const today = new Date().toISOString().split('T')[0]!

    const { data, error } = await this.supabase
      .from('attendance_employeeattendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single()

    if (error || !data) {
      return null
    }

    return {
      id: data.id,
      employee_id: data.employee_id,
      date: data.date,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      clock_in_location: data.clock_in_location_lat && data.clock_in_location_lng
        ? { lat: Number(data.clock_in_location_lat), lng: Number(data.clock_in_location_lng) }
        : undefined,
      clock_out_location: data.clock_out_location_lat && data.clock_out_location_lng
        ? { lat: Number(data.clock_out_location_lat), lng: Number(data.clock_out_location_lng) }
        : undefined,
      total_hours: data.total_hours,
      status: data.status as AttendanceRecord['status'],
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  /**
   * Get attendance history for an employee
   */
  async getAttendanceHistory(
    employeeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> {
    let query = this.supabase
      .from('attendance_employeeattendance')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching attendance history:', error)
      return []
    }

    return (data || []).map((record) => ({
      id: record.id,
      employee_id: record.employee_id,
      date: record.date,
      clock_in: record.clock_in,
      clock_out: record.clock_out,
      clock_in_location: record.clock_in_location_lat && record.clock_in_location_lng
        ? { lat: Number(record.clock_in_location_lat), lng: Number(record.clock_in_location_lng) }
        : undefined,
      clock_out_location: record.clock_out_location_lat && record.clock_out_location_lng
        ? { lat: Number(record.clock_out_location_lat), lng: Number(record.clock_out_location_lng) }
        : undefined,
      total_hours: record.total_hours,
      status: record.status as AttendanceRecord['status'],
      created_at: record.created_at,
      updated_at: record.updated_at,
    }))
  }
}

export const attendanceService = new AttendanceServiceClass()
