'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Bell, Check, Trash2, Settings, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { useEmployerNotifications } from '@/lib/hooks'
import type { Notification } from '@/lib/services'

export default function EmployerNotificationsPage() {
  const { user } = useAuth()
  const companyId = user?.companyId ?? undefined
  const { data: notificationsData, isLoading } = useEmployerNotifications(companyId)

  const [filter, setFilter] = useState<'all' | 'unread' | string>('all')
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

  const notifications = notificationsData?.filter(n => !deletedIds.has(n.id)) || []
  const filteredNotifications = notifications.filter(n => {
    const isUnread = !n.isRead && !readIds.has(n.id)
    if (filter === 'unread') return isUnread
    if (filter !== 'all' && filter !== 'unread') return n.type === filter
    return true
  })
  const unreadCount = notifications.filter(n => !n.isRead && !readIds.has(n.id)).length

  // Get unique notification types for filtering
  const notificationTypes = [...new Set(notifications.map(n => n.type))]

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]))
  }

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id)
    setReadIds(new Set(allIds))
  }

  const deleteNotification = (id: string) => {
    setDeletedIds(prev => new Set([...prev, id]))
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

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <Link href="/employer/settings">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{notifications.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
              <Bell className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                <p className="text-sm text-gray-500">Unread</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📬</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.type === 'leave').length}
                </p>
                <p className="text-sm text-gray-500">Leave Requests</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🏖️</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.type === 'expense').length}
                </p>
                <p className="text-sm text-gray-500">Expenses</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-lg">💳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-gray-500" />
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              {notificationTypes.map(type => (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(type)}
                >
                  {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
              <p className="text-gray-500 mt-1">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : filter !== 'all'
                    ? `No ${filter} notifications`
                    : 'No notifications to display'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map(notification => {
                const isRead = notification.isRead || readIds.has(notification.id)
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-sm font-medium text-gray-900">
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)} Notification
                              </h3>
                              {!isRead && (
                                <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                              )}
                              <Badge className={getTypeColor(notification.type)}>
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <p className="text-xs text-gray-500">
                                {formatTimestamp(notification.createdAt)}
                              </p>
                              {notification.actionUrl && (
                                <Link
                                  href={notification.actionUrl}
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs font-medium text-primary hover:underline"
                                >
                                  View Details →
                                </Link>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Card */}
      {notifications.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-sm font-medium text-blue-900">Quick Actions</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Click on a notification to see details. Use the filters above to find specific types of notifications.
                  Need to approve something? Click &quot;View Details&quot; to go directly to the approval page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
