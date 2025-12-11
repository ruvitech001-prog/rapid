/**
 * Date and Timezone Utilities for Aether Platform
 *
 * Handles timezone-aware date operations, Indian financial year calculations,
 * and working day computations.
 */

// Default timezone for India
export const DEFAULT_TIMEZONE = 'Asia/Kolkata'

/**
 * Get today's date in a specific timezone
 * @param timezone - IANA timezone string (default: Asia/Kolkata)
 * @returns Date string in YYYY-MM-DD format
 */
export function getTodayInTimezone(timezone: string = DEFAULT_TIMEZONE): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(now)
}

/**
 * Get current time in a specific timezone
 * @param timezone - IANA timezone string (default: Asia/Kolkata)
 * @returns Time string in HH:MM:SS format
 */
export function getCurrentTimeInTimezone(timezone: string = DEFAULT_TIMEZONE): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  return formatter.format(now)
}

/**
 * Get the current Indian financial year
 * Indian FY runs from April 1 to March 31
 * @param date - Optional date to check (default: now)
 * @returns Financial year string in format "2024-25"
 */
export function getCurrentFinancialYear(date?: Date): string {
  const d = date || new Date()
  const month = d.getMonth() // 0-indexed (0 = January)
  const year = d.getFullYear()

  // If month is April (3) or later, FY starts this year
  // If month is before April, FY started last year
  const fyStartYear = month >= 3 ? year : year - 1
  const fyEndYear = fyStartYear + 1

  return `${fyStartYear}-${fyEndYear.toString().slice(-2)}`
}

/**
 * Get the start date of a financial year
 * @param fy - Financial year string (e.g., "2024-25")
 * @returns Start date (April 1)
 */
export function getFinancialYearStart(fy: string): Date {
  const parts = fy.split('-')
  const startYear = parseInt(parts[0] || '0', 10)
  return new Date(startYear, 3, 1) // April 1
}

/**
 * Get the end date of a financial year
 * @param fy - Financial year string (e.g., "2024-25")
 * @returns End date (March 31)
 */
export function getFinancialYearEnd(fy: string): Date {
  const parts = fy.split('-')
  const startYear = parseInt(parts[0] || '0', 10)
  return new Date(startYear + 1, 2, 31) // March 31 of next year
}

/**
 * Calculate working days between two dates
 * Excludes weekends (Saturday and Sunday)
 * @param startDate - Start date
 * @param endDate - End date
 * @param excludeHolidays - Optional array of holiday dates to exclude
 * @returns Number of working days
 */
export function calculateWorkingDays(
  startDate: Date | string,
  endDate: Date | string,
  excludeHolidays: (Date | string)[] = []
): number {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < start) return 0

  const holidaySet = new Set(
    excludeHolidays.map(h => new Date(h).toISOString().split('T')[0])
  )

  let workingDays = 0
  const current = new Date(start)

  while (current <= end) {
    const dayOfWeek = current.getDay()
    const dateStr = current.toISOString().split('T')[0]

    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidaySet.has(dateStr)) {
      workingDays++
    }

    current.setDate(current.getDate() + 1)
  }

  return workingDays
}

/**
 * Calculate leave days (including partial days)
 * @param startDate - Start date
 * @param endDate - End date
 * @param isHalfDay - Whether this is a half-day leave
 * @returns Number of leave days
 */
export function calculateLeaveDays(
  startDate: Date | string,
  endDate: Date | string,
  isHalfDay: boolean = false
): number {
  if (isHalfDay) {
    return 0.5
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  // Calculate difference in days
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end days

  return Math.max(0, diffDays)
}

/**
 * Format date for display
 * @param date - Date to format
 * @param format - Format type
 * @param timezone - Timezone for formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'iso' = 'short',
  timezone: string = DEFAULT_TIMEZONE
): string {
  const d = new Date(date)

  if (format === 'iso') {
    return d.toISOString().split('T')[0] || ''
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    ...(format === 'short'
      ? { day: '2-digit', month: 'short', year: 'numeric' }
      : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    ),
  }

  return new Intl.DateTimeFormat('en-IN', options).format(d)
}

/**
 * Format time for display
 * @param time - Time string in HH:MM or HH:MM:SS format
 * @param format - 12 or 24 hour format
 * @returns Formatted time string
 */
export function formatTime(time: string, format: '12h' | '24h' = '12h'): string {
  const parts = time.split(':').map(Number)
  const hours = parts[0] ?? 0
  const minutes = parts[1] ?? 0

  if (format === '24h') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Get month name from month number
 * @param month - Month number (1-12)
 * @param format - Short or long format
 * @returns Month name
 */
export function getMonthName(month: number, format: 'short' | 'long' = 'long'): string {
  const date = new Date(2000, month - 1, 1)
  return date.toLocaleString('en-IN', { month: format })
}

/**
 * Calculate hours between two time strings
 * @param startTime - Start time in HH:MM format
 * @param endTime - End time in HH:MM format
 * @returns Number of hours (decimal)
 */
export function calculateHoursBetween(startTime: string, endTime: string): number {
  const startParts = startTime.split(':').map(Number)
  const endParts = endTime.split(':').map(Number)
  const startHour = startParts[0] ?? 0
  const startMin = startParts[1] ?? 0
  const endHour = endParts[0] ?? 0
  const endMin = endParts[1] ?? 0

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  // Handle overnight shifts
  const diff = endMinutes >= startMinutes
    ? endMinutes - startMinutes
    : (24 * 60 - startMinutes) + endMinutes

  return Math.round((diff / 60) * 100) / 100
}

/**
 * Get the start and end dates of a week
 * @param date - Any date within the week
 * @param weekStartsOn - Day week starts (0 = Sunday, 1 = Monday)
 * @returns Object with weekStart and weekEnd dates
 */
export function getWeekBounds(
  date: Date | string,
  weekStartsOn: 0 | 1 = 1
): { weekStart: Date; weekEnd: Date } {
  const d = new Date(date)
  const day = d.getDay()

  // Calculate days to subtract to get to week start
  const diff = weekStartsOn === 0
    ? day
    : (day === 0 ? 6 : day - 1)

  const weekStart = new Date(d)
  weekStart.setDate(d.getDate() - diff)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return { weekStart, weekEnd }
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @param timezone - Timezone for comparison
 * @returns Boolean
 */
export function isToday(date: Date | string, timezone: string = DEFAULT_TIMEZONE): boolean {
  const today = getTodayInTimezone(timezone)
  const checkDate = new Date(date).toISOString().split('T')[0]
  return today === checkDate
}

/**
 * Parse a date string safely
 * @param dateString - Date string to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  const parsed = new Date(dateString)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Get all possible financial year format strings for database queries
 * Handles inconsistent FY formats in the database
 * @returns Array of possible FY format strings
 */
export function getFinancialYearFormats(): string[] {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()

  const fyStartYear = month >= 3 ? year : year - 1
  const fyEndYear = fyStartYear + 1

  return [
    `${fyStartYear}`,
    `${fyStartYear}-${fyEndYear}`,
    `${fyStartYear}-${String(fyEndYear).slice(2)}`,
    `FY${fyStartYear}`,
    `FY${fyStartYear}-${fyEndYear}`,
    `FY${fyStartYear}-${String(fyEndYear).slice(2)}`,
    `FY ${fyStartYear}-${String(fyEndYear).slice(2)}`,
  ]
}

/**
 * Format currency for Indian locale
 * @param amount - Amount to format
 * @param currency - Currency code (default: INR)
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to compare
 */
export function getRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffSecs = Math.round(diffMs / 1000)
  const diffMins = Math.round(diffSecs / 60)
  const diffHours = Math.round(diffMins / 60)
  const diffDays = Math.round(diffHours / 24)

  if (Math.abs(diffSecs) < 60) return 'just now'
  if (Math.abs(diffMins) < 60) {
    return diffMins > 0 ? `in ${diffMins} min` : `${Math.abs(diffMins)} min ago`
  }
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `in ${diffHours}h` : `${Math.abs(diffHours)}h ago`
  }
  if (Math.abs(diffDays) < 7) {
    return diffDays > 0 ? `in ${diffDays}d` : `${Math.abs(diffDays)}d ago`
  }

  return formatDate(date, 'short')
}
