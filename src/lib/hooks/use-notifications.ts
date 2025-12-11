'use client'

import { useQuery } from '@tanstack/react-query'
import { notificationsService, type Notification } from '@/lib/services'

export function useEmployeeNotifications(
  employeeId: string | undefined,
  limit: number = 10
) {
  return useQuery<Notification[]>({
    queryKey: ['notifications', 'employee', employeeId, limit],
    queryFn: () => notificationsService.getEmployeeNotifications(employeeId!, limit),
    enabled: !!employeeId,
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useEmployerNotifications(
  companyId: string | undefined,
  limit: number = 10
) {
  return useQuery<Notification[]>({
    queryKey: ['notifications', 'employer', companyId, limit],
    queryFn: () => notificationsService.getEmployerNotifications(companyId!, limit),
    enabled: !!companyId,
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useUnreadNotificationCount(
  userId: string | undefined,
  userType: 'employee' | 'employer'
) {
  return useQuery<number>({
    queryKey: ['notifications', 'unread', userId, userType],
    queryFn: () => notificationsService.getUnreadCount(userId!, userType),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}
