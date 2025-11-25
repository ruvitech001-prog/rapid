/**
 * Mock Attendance Data Generator
 */

import {
  generateId,
  formatDate,
  subtractDays,
  getRandomElement,
  getRandomNumber,
} from "./utils"

export interface MockAttendanceRecord {
  id: string
  employee_id: string
  company_id: string
  date: string
  clock_in_time: string | null
  clock_out_time: string | null
  work_hours: number
  status: "present" | "absent" | "late" | "half_day" | "on_leave"
  notes: string | null
  created_at: string
}

export function generateMockAttendance(
  employee_count: number = 25,
  days_count: number = 30,
  company_id: string = "",
  employee_ids: string[] = [],
): MockAttendanceRecord[] {
  const records: MockAttendanceRecord[] = []
  const currentDate = new Date()

  // Generate attendance for last 30 days
  for (let dayIndex = 0; dayIndex < days_count; dayIndex++) {
    const attendanceDate = subtractDays(currentDate, days_count - dayIndex - 1)
    const dayOfWeek = attendanceDate.getDay()

    // Skip Sundays (day 0)
    if (dayOfWeek === 0) continue

    for (let empIndex = 0; empIndex < employee_count; empIndex++) {
      const employee_id = employee_ids[empIndex] || generateId()
      const rand = Math.random()

      let status: "present" | "absent" | "late" | "half_day" | "on_leave"
      let clock_in_time: string | null = null
      let clock_out_time: string | null = null
      let work_hours = 0

      if (rand < 0.8) {
        // 80% present
        status = "present"
        const clockInHour = 8 + getRandomNumber(0, 1) // 8-9 AM
        const clockInMinute = getRandomNumber(0, 59)
        const clockOutHour = 17 + getRandomNumber(0, 1) // 5-6 PM
        const clockOutMinute = getRandomNumber(0, 59)

        clock_in_time = `${String(clockInHour).padStart(2, "0")}:${String(clockInMinute).padStart(2, "0")}`
        clock_out_time = `${String(clockOutHour).padStart(2, "0")}:${String(clockOutMinute).padStart(2, "0")}`
        work_hours = 8 + getRandomNumber(0, 2)
      } else if (rand < 0.85) {
        // 5% late
        status = "late"
        clock_in_time = `10:${getRandomNumber(0, 59)}`
        clock_out_time = `17:${getRandomNumber(0, 59)}`
        work_hours = 7
      } else if (rand < 0.9) {
        // 5% half day
        status = "half_day"
        clock_in_time = `08:${getRandomNumber(0, 59)}`
        clock_out_time = `12:${getRandomNumber(0, 59)}`
        work_hours = 4
      } else {
        // 10% absent or on leave
        status = getRandomElement(["absent", "on_leave"] as const)
        clock_in_time = null
        clock_out_time = null
        work_hours = 0
      }

      records.push({
        id: generateId(),
        employee_id,
        company_id: company_id || generateId(),
        date: formatDate(attendanceDate),
        clock_in_time,
        clock_out_time,
        work_hours,
        status,
        notes: status === "late" ? "Traffic delay" : null,
        created_at: formatDate(attendanceDate),
      })
    }
  }

  return records
}

export interface MockAttendanceSummary {
  id: string
  employee_id: string
  month: number
  year: number
  total_days: number
  present_days: number
  absent_days: number
  half_day_count: number
  late_count: number
  on_leave_days: number
  percentage: number
  created_at: string
}

export function generateMockAttendanceSummaries(
  employee_ids: string[] = [],
  months_count: number = 12,
): MockAttendanceSummary[] {
  const summaries: MockAttendanceSummary[] = []
  const currentDate = new Date()

  employee_ids.forEach((employee_id) => {
    for (let i = 0; i < months_count; i++) {
      const summaryDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const totalDays = 22 // working days per month
      const presentDays = getRandomNumber(18, 22)
      const absentDays = getRandomNumber(0, 2)
      const percentage = (presentDays / totalDays) * 100

      summaries.push({
        id: generateId(),
        employee_id,
        month: summaryDate.getMonth() + 1,
        year: summaryDate.getFullYear(),
        total_days: totalDays,
        present_days: presentDays,
        absent_days: absentDays,
        half_day_count: getRandomNumber(0, 2),
        late_count: getRandomNumber(0, 3),
        on_leave_days: totalDays - presentDays - absentDays,
        percentage,
        created_at: formatDate(summaryDate),
      })
    }
  })

  return summaries
}
