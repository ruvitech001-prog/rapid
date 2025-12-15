'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsService, type Notification } from '@/lib/services'

interface NotificationState {
  readIds: string[]
  deletedIds: string[]
}

const notificationKeys = {
  all: ['notifications'] as const,
  employee: (employeeId: string, limit: number) => [...notificationKeys.all, 'employee', employeeId, limit] as const,
  employer: (companyId: string, limit: number) => [...notificationKeys.all, 'employer', companyId, limit] as const,
  unread: (userId: string, userType: string) => [...notificationKeys.all, 'unread', userId, userType] as const,
  state: (userId: string) => [...notificationKeys.all, 'state', userId] as const,
}

export function useEmployeeNotifications(
  employeeId: string | undefined,
  limit: number = 10
) {
  return useQuery<Notification[]>({
    queryKey: notificationKeys.employee(employeeId!, limit),
    queryFn: () => notificationsService.getEmployeeNotifications(employeeId!, limit),
    enabled: !!employeeId,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000,
  })
}

export function useEmployerNotifications(
  companyId: string | undefined,
  limit: number = 10
) {
  return useQuery<Notification[]>({
    queryKey: notificationKeys.employer(companyId!, limit),
    queryFn: () => notificationsService.getEmployerNotifications(companyId!, limit),
    enabled: !!companyId,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000,
  })
}

export function useUnreadNotificationCount(
  userId: string | undefined,
  userType: 'employee' | 'employer'
) {
  return useQuery<number>({
    queryKey: notificationKeys.unread(userId!, userType),
    queryFn: () => notificationsService.getUnreadCount(userId!, userType),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000,
  })
}

/**
 * Get the notification state (read/deleted IDs) for a user
 */
export function useNotificationState(userId: string | undefined) {
  return useQuery<NotificationState>({
    queryKey: notificationKeys.state(userId!),
    queryFn: () => notificationsService.getNotificationState(userId!),
    enabled: !!userId,
    staleTime: 60000,
  })
}

/**
 * Mark a single notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; notificationId: string }>({
    mutationFn: ({ userId, notificationId }) =>
      notificationsService.markAsRead(userId, notificationId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.state(userId) })
    },
  })
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; notificationIds: string[] }>({
    mutationFn: ({ userId, notificationIds }) =>
      notificationsService.markAllAsRead(userId, notificationIds),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.state(userId) })
    },
  })
}

/**
 * Delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; notificationId: string }>({
    mutationFn: ({ userId, notificationId }) =>
      notificationsService.deleteNotification(userId, notificationId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.state(userId) })
    },
  })
}
