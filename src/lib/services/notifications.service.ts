import { BaseService } from './base.service'
import type { Json } from '@/types/database.types'

export interface Notification {
  id: string
  type: 'leave' | 'expense' | 'payroll' | 'contract' | 'system'
  message: string
  createdAt: string
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, unknown>
}

interface NotificationState {
  readIds: string[]
  deletedIds: string[]
}

class NotificationsServiceClass extends BaseService {
  private stateKey = 'notification_state'

  /**
   * Get notification state (read/deleted IDs) from user_preference
   */
  async getNotificationState(userId: string): Promise<NotificationState> {
    const { data } = await this.supabase
      .from('user_preference')
      .select('notification_preferences')
      .eq('user_id', userId)
      .single()

    const prefs = data?.notification_preferences as Record<string, unknown> | null
    const state = prefs?.[this.stateKey] as NotificationState | undefined

    return state || { readIds: [], deletedIds: [] }
  }

  /**
   * Save notification state to user_preference
   */
  async saveNotificationState(userId: string, state: NotificationState): Promise<void> {
    // First get current preferences
    const { data: existing } = await this.supabase
      .from('user_preference')
      .select('notification_preferences')
      .eq('user_id', userId)
      .single()

    const currentPrefs = (existing?.notification_preferences || {}) as Record<string, unknown>
    const updatedPrefs = {
      ...currentPrefs,
      [this.stateKey]: state,
    }

    // Upsert the preference
    const { error } = await this.supabase
      .from('user_preference')
      .upsert({
        user_id: userId,
        notification_preferences: updatedPrefs as unknown as Json,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })

    if (error) {
      this.handleError(error)
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const state = await this.getNotificationState(userId)
    if (!state.readIds.includes(notificationId)) {
      state.readIds.push(notificationId)
      await this.saveNotificationState(userId, state)
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string, notificationIds: string[]): Promise<void> {
    const state = await this.getNotificationState(userId)
    const newReadIds = new Set([...state.readIds, ...notificationIds])
    state.readIds = Array.from(newReadIds)
    await this.saveNotificationState(userId, state)
  }

  /**
   * Delete a notification (soft delete by adding to deleted list)
   */
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const state = await this.getNotificationState(userId)
    if (!state.deletedIds.includes(notificationId)) {
      state.deletedIds.push(notificationId)
      await this.saveNotificationState(userId, state)
    }
  }

  // Get notifications for an employee
  async getEmployeeNotifications(
    employeeId: string,
    limit: number = 10
  ): Promise<Notification[]> {
    const notifications: Notification[] = []

    // Get recent leave request updates
    const { data: leaves } = await this.supabase
      .from('leave_leaverequest')
      .select('id, status, start_date, approved_at, created_at')
      .eq('employee_id', employeeId)
      .in('status', ['approved', 'rejected'])
      .order('approved_at', { ascending: false })
      .limit(5)

    leaves?.forEach((leave) => {
      const statusText = leave.status === 'approved' ? 'approved' : 'rejected'
      const date = new Date(leave.start_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })
      notifications.push({
        id: `leave-${leave.id}`,
        type: 'leave',
        message: `Time-off request for ${date} has been ${statusText}.`,
        createdAt: leave.approved_at || leave.created_at || new Date().toISOString(),
        isRead: false,
        actionUrl: '/employee/leave/history',
      })
    })

    // Get recent expense updates
    const { data: expenses } = await this.supabase
      .from('expense_expenseclaim')
      .select('id, status, expense_date, approved_at, created_at, amount')
      .eq('employee_id', employeeId)
      .in('status', ['approved', 'rejected', 'paid'])
      .order('approved_at', { ascending: false })
      .limit(5)

    expenses?.forEach((expense) => {
      let message = ''
      const date = new Date(expense.expense_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })

      if (expense.status === 'approved') {
        message = `Expense request for ${date} has been approved.`
      } else if (expense.status === 'rejected') {
        message = `Expense request for ${date} has been rejected.`
      } else if (expense.status === 'paid') {
        message = `Expense reimbursement of INR ${Number(expense.amount).toLocaleString()} has been processed.`
      }

      notifications.push({
        id: `expense-${expense.id}`,
        type: 'expense',
        message,
        createdAt: expense.approved_at || expense.created_at || new Date().toISOString(),
        isRead: false,
        actionUrl: '/employee/expenses/history',
      })
    })

    // Sort by date and return limited results
    return notifications
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit)
  }

  // Get notifications for employer (company-wide activity)
  async getEmployerNotifications(
    companyId: string,
    limit: number = 10
  ): Promise<Notification[]> {
    const notifications: Notification[] = []

    // Get employee IDs for this company
    const { data: contracts } = await this.supabase
      .from('employee_employeecontract')
      .select('employee_id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    const employeeIds =
      contracts?.map((c) => c.employee_id).filter(Boolean) || []

    if (employeeIds.length === 0) {
      return []
    }

    // Get recent approved/rejected leaves (actions taken by employer)
    const { data: leaves } = await this.supabase
      .from('leave_leaverequest')
      .select(
        `id, status, start_date, approved_at, created_at,
        employee:employee_employee!employee_id(full_name)`
      )
      .in('employee_id', employeeIds)
      .in('status', ['approved', 'rejected'])
      .order('approved_at', { ascending: false })
      .limit(5)

    leaves?.forEach((leave) => {
      const employeeName =
        (leave.employee as { full_name: string } | null)?.full_name || 'Employee'
      const statusText = leave.status === 'approved' ? 'approved' : 'rejected'
      const date = new Date(leave.start_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })

      notifications.push({
        id: `leave-${leave.id}`,
        type: 'leave',
        message: `Time-off request for ${employeeName} on ${date} has been ${statusText}.`,
        createdAt: leave.approved_at || leave.created_at || new Date().toISOString(),
        isRead: false,
        actionUrl: '/employer/leave/requests',
      })
    })

    // Get recent expense actions
    const { data: expenses } = await this.supabase
      .from('expense_expenseclaim')
      .select(
        `id, status, expense_date, approved_at, created_at, amount,
        employee:employee_employee!employee_id(full_name)`
      )
      .in('employee_id', employeeIds)
      .in('status', ['approved', 'rejected'])
      .order('approved_at', { ascending: false })
      .limit(5)

    expenses?.forEach((expense) => {
      const employeeName =
        (expense.employee as { full_name: string } | null)?.full_name ||
        'Employee'
      const statusText = expense.status === 'approved' ? 'approved' : 'rejected'
      const date = new Date(expense.expense_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })

      notifications.push({
        id: `expense-${expense.id}`,
        type: 'expense',
        message: `Expense request for ${employeeName} (${date}) has been ${statusText}.`,
        createdAt: expense.approved_at || expense.created_at || new Date().toISOString(),
        isRead: false,
        actionUrl: '/employer/expenses/requests',
      })
    })

    // Get new employee joins
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: newHires } = await this.supabase
      .from('employee_employeecontract')
      .select(
        `id, start_date, designation,
        employee:employee_employee!employee_id(full_name)`
      )
      .eq('company_id', companyId)
      .eq('is_current', true)
      .gte('start_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('start_date', { ascending: false })
      .limit(3)

    newHires?.forEach((hire) => {
      const employeeName =
        (hire.employee as { full_name: string } | null)?.full_name ||
        'New employee'
      const date = new Date(hire.start_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })

      notifications.push({
        id: `hire-${hire.id}`,
        type: 'contract',
        message: `${employeeName} joined as ${hire.designation} on ${date}.`,
        createdAt: hire.start_date,
        isRead: false,
        actionUrl: '/employer/employees',
      })
    })

    return notifications
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit)
  }

  // Get unread notification count
  async getUnreadCount(
    userId: string,
    userType: 'employee' | 'employer'
  ): Promise<number> {
    // For now, count recent activity as "unread"
    // In production, this would track actual read status
    const notifications =
      userType === 'employee'
        ? await this.getEmployeeNotifications(userId, 50)
        : await this.getEmployerNotifications(userId, 50)

    return notifications.length
  }
}

export const notificationsService = new NotificationsServiceClass()
