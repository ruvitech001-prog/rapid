'use client'

import { useState } from 'react'
import Link from 'next/link'

type Notification = {
  id: number
  type: 'payroll' | 'leave' | 'attendance' | 'document' | 'system' | 'announcement'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionLink?: string
  actionText?: string
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'payroll',
      title: 'Payslip Generated',
      message: 'Your payslip for March 2024 is now available for download.',
      timestamp: '2024-03-01T09:00:00',
      read: false,
      actionLink: '/employee/payroll',
      actionText: 'View Payslip'
    },
    {
      id: 2,
      type: 'leave',
      title: 'Leave Request Approved',
      message: 'Your casual leave request for March 15-16 has been approved.',
      timestamp: '2024-02-28T14:30:00',
      read: false,
      actionLink: '/employee/leave',
      actionText: 'View Details'
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Missing Clock-Out',
      message: 'You forgot to clock out yesterday. Please regularize your attendance.',
      timestamp: '2024-02-27T18:00:00',
      read: true,
      actionLink: '/employee/attendance/regularization',
      actionText: 'Regularize'
    },
    {
      id: 4,
      type: 'document',
      title: 'Document Requires Signature',
      message: 'Please sign your employment contract - expires in 3 days.',
      timestamp: '2024-02-26T10:00:00',
      read: false,
      actionLink: '/employee/documents/esign/1',
      actionText: 'Sign Now'
    },
    {
      id: 5,
      type: 'announcement',
      title: 'Company Holiday Announced',
      message: 'March 25 has been declared a company holiday for Holi celebrations.',
      timestamp: '2024-02-25T11:00:00',
      read: true,
    },
    {
      id: 6,
      type: 'system',
      title: 'Tax Declaration Reminder',
      message: 'Submit your tax declarations by March 15 to avoid last-minute rush.',
      timestamp: '2024-02-24T09:00:00',
      read: true,
      actionLink: '/employee/tax/declaration',
      actionText: 'Declare Now'
    },
    {
      id: 7,
      type: 'leave',
      title: 'Leave Balance Update',
      message: 'Your leave balance has been credited. You now have 12 days of casual leave.',
      timestamp: '2024-02-23T08:00:00',
      read: true,
    },
  ])

  const filteredNotifications = notifications.filter(n => filter === 'all' || !n.read)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    if (confirm('Delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id))
    }
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payroll': return '💰'
      case 'leave': return '🏖️'
      case 'attendance': return '📅'
      case 'document': return '📄'
      case 'announcement': return '📢'
      case 'system': return '⚙️'
      default: return '🔔'
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'payroll': return 'bg-green-100 text-green-800'
      case 'leave': return 'bg-blue-100 text-blue-800'
      case 'attendance': return 'bg-yellow-100 text-yellow-800'
      case 'document': return 'bg-purple-100 text-purple-800'
      case 'announcement': return 'bg-indigo-100 text-indigo-800'
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
              <p className="text-gray-500">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
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
                            {notification.title}
                          </h3>
                          {!notification.read && (
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
                            {formatTimestamp(notification.timestamp)}
                          </p>
                          {notification.actionLink && notification.actionText && (
                            <Link
                              href={notification.actionLink}
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-900"
                            >
                              {notification.actionText} →
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
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
            ))
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
