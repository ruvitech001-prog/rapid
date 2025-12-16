'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
    staleTime: 60000, // 1 minute
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
    staleTime: 60000, // 1 minute
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
    staleTime: 60000, // 1 minute
  })
}

// Clock-in/out hooks
export function useTodayAttendance(employeeId: string | undefined) {
  return useQuery<AttendanceRecord | null>({
    queryKey: ['attendance', 'today', employeeId],
    queryFn: () => attendanceService.getTodayRecord(employeeId!),
    enabled: !!employeeId,
    staleTime: 30000, // 30 seconds
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
    staleTime: 60000, // 1 minute
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
      toast.success('Clocked in successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to clock in')
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
      toast.success('Clocked out successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to clock out')
    },
  })
}
