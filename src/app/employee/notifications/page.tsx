'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { useEmployeeNotifications } from '@/lib/hooks'
import type { Notification } from '@/lib/services'

const NOTIFICATIONS_STORAGE_KEY = 'employee_notifications_state'

interface NotificationState {
  readIds: string[]
  deletedIds: string[]
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const employeeId = user?.id
  const { data: notificationsData, isLoading } = useEmployeeNotifications(employeeId)

  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

  // Load persisted state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
      if (savedState) {
        const parsed: NotificationState = JSON.parse(savedState)
        setReadIds(new Set(parsed.readIds || []))
        setDeletedIds(new Set(parsed.deletedIds || []))
      }
    } catch (error) {
      console.error('Failed to load notification state:', error)
    }
  }, [])

  // Persist state to localStorage
  const persistState = useCallback((newReadIds: Set<string>, newDeletedIds: Set<string>) => {
    try {
      const state: NotificationState = {
        readIds: Array.from(newReadIds),
        deletedIds: Array.from(newDeletedIds),
      }
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save notification state:', error)
    }
  }, [])

  const notifications = notificationsData?.filter(n => !deletedIds.has(n.id)) || []
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') {
      return !n.isRead && !readIds.has(n.id)
    }
    return true
  })
  const unreadCount = notifications.filter(n => !n.isRead && !readIds.has(n.id)).length

  const markAsRead = (id: string) => {
    const newReadIds = new Set([...readIds, id])
    setReadIds(newReadIds)
    persistState(newReadIds, deletedIds)
    toast.success('Marked as read')
  }

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id)
    const newReadIds = new Set(allIds)
    setReadIds(newReadIds)
    persistState(newReadIds, deletedIds)
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (id: string) => {
    if (confirm('Delete this notification?')) {
      const newDeletedIds = new Set([...deletedIds, id])
      setDeletedIds(newDeletedIds)
      persistState(readIds, newDeletedIds)
      toast.success('Notification deleted')
    }
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payroll': return '💰'
      case 'leave': return '🏖️'
      case 'expense': return '💳'
      case 'contract': return '📄'
      case 'system': return '⚙️'
      default: return '🔔'
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'payroll': return 'bg-green-100 text-green-800'
      case 'leave': return 'bg-blue-100 text-blue-800'
      case 'expense': return 'bg-orange-100 text-orange-800'
      case 'contract': return 'bg-purple-100 text-purple-800'
      case 'system': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <Link
          href="/employee/profile"
          className="text-sm text-blue-600 hover:text-blue-900"
        >
          Notification Settings
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'unread'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-900"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-500">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications to display'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const isRead = notification.isRead || readIds.has(notification.id)
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)} Notification
                            </h3>
                            {!isRead && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                                New
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-4">
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(notification.createdAt)}
                            </p>
                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl}
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-900"
                              >
                                View Details →
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-blue-600 hover:text-blue-900"
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-sm text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {filteredNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-2xl mr-3">💡</div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Manage Your Notifications</h3>
              <p className="text-xs text-blue-700 mt-1">
                You can customize which notifications you receive in your{' '}
                <Link href="/employee/profile" className="underline hover:text-blue-900">
                  profile settings
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
