'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  attendanceService,
  type AttendanceStats,
  type DailyAttendance,
  type AttendanceRecord,
} from '@/lib/services'

export function useAttendanceStats(
  employeeId: string | undefined,
  month?: number,
  year?: number
) {
  return useQuery<AttendanceStats>({
    queryKey: ['attendance', 'stats', employeeId, month, year],
    queryFn: () => attendanceService.getAttendanceStats(employeeId!, month, year),
    enabled: !!employeeId,
  })
}

export function useCompanyAttendanceStats(companyId: string | undefined) {
  return useQuery<{
    averageAttendance: number
    totalEmployees: number
    presentToday: number
    onLeaveToday: number
  }>({
    queryKey: ['attendance', 'company', companyId],
    queryFn: () => attendanceService.getCompanyAttendanceStats(companyId!),
    enabled: !!companyId,
  })
}

export function useMonthlyAttendanceCalendar(
  employeeId: string | undefined,
  month: number,
  year: number
) {
  return useQuery<DailyAttendance[]>({
    queryKey: ['attendance', 'calendar', employeeId, month, year],
    queryFn: () => attendanceService.getMonthlyCalendar(employeeId!, month, year),
    enabled: !!employeeId,
  })
}

// Clock-in/out hooks
export function useTodayAttendance(employeeId: string | undefined) {
  return useQuery<AttendanceRecord | null>({
    queryKey: ['attendance', 'today', employeeId],
    queryFn: () => attendanceService.getTodayRecord(employeeId!),
    enabled: !!employeeId,
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useAttendanceHistory(
  employeeId: string | undefined,
  startDate?: string,
  endDate?: string
) {
  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', 'history', employeeId, startDate, endDate],
    queryFn: () => attendanceService.getAttendanceHistory(employeeId!, startDate, endDate),
    enabled: !!employeeId,
  })
}

export function useClockIn() {
  const queryClient = useQueryClient()

  return useMutation<
    AttendanceRecord,
    Error,
    { employeeId: string; location?: { lat: number; lng: number } }
  >({
    mutationFn: ({ employeeId, location }) =>
      attendanceService.clockIn(employeeId, location),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'today', variables.employeeId],
      })
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'history', variables.employeeId],
      })
    },
  })
}

export function useClockOut() {
  const queryClient = useQueryClient()

  return useMutation<
    AttendanceRecord,
    Error,
    { employeeId: string; location?: { lat: number; lng: number } }
  >({
    mutationFn: ({ employeeId, location }) =>
      attendanceService.clockOut(employeeId, location),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'today', variables.employeeId],
      })
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'history', variables.employeeId],
      })
    },
  })
}
