'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserPreferences, useUpdateUserPreferences, useChangePassword } from '@/lib/hooks';

export default function ContractorSettingsPage() {
  const [activeTab, setActiveTab] = useState<'preferences' | 'notifications' | 'security'>('preferences');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch user preferences from backend
  const { data: userPreferences, isLoading } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  const changePassword = useChangePassword();

  // Local state for form editing
  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'Asia/Kolkata',
    theme: 'light' as 'light' | 'dark' | 'system',
    currency: 'INR',
  });

  const [notifications, setNotifications] = useState({
    paymentReminders: true,
    invoiceNotifications: true,
    timesheetReminders: true,
    emailDigest: true,
  });

  // Update local state when data is loaded
  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        language: userPreferences.language,
        timezone: userPreferences.timezone,
        theme: userPreferences.theme,
        currency: userPreferences.currency,
      });

      // Map notification preferences for contractors
      const notifPrefs = userPreferences.notificationPreferences;
      setNotifications({
        paymentReminders: notifPrefs.payrollAlerts,
        invoiceNotifications: notifPrefs.invoiceAlerts,
        timesheetReminders: notifPrefs.weeklyDigest,
        emailDigest: notifPrefs.monthlyReport,
      });
    }
  }, [userPreferences]);

  const handlePreferencesSave = () => {
    updatePreferences.mutate({
      language: preferences.language,
      timezone: preferences.timezone,
      theme: preferences.theme,
      currency: preferences.currency,
    });
  };

  const handleNotificationsSave = () => {
    updatePreferences.mutate({
      notificationPreferences: {
        payrollAlerts: notifications.paymentReminders,
        invoiceAlerts: notifications.invoiceNotifications,
        weeklyDigest: notifications.timesheetReminders,
        monthlyReport: notifications.emailDigest,
      },
    });
  };

  const handleEnable2FA = () => {
    // 2FA implementation would go here
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your preferences and settings</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preferences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">General Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Asia/Kolkata</option>
                    <option>Asia/Dubai</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' | 'system' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handlePreferencesSave}
                  disabled={updatePreferences.isPending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {updatePreferences.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {updatePreferences.isPending ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Reminders</p>
                    <p className="text-sm text-gray-500">Reminders for upcoming payments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.paymentReminders}
                      onChange={(e) => setNotifications({ ...notifications, paymentReminders: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Invoice Notifications</p>
                    <p className="text-sm text-gray-500">Notifications for new invoices and status updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.invoiceNotifications}
                      onChange={(e) => setNotifications({ ...notifications, invoiceNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Timesheet Reminders</p>
                    <p className="text-sm text-gray-500">Reminders to submit timesheets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.timesheetReminders}
                      onChange={(e) => setNotifications({ ...notifications, timesheetReminders: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Digest</p>
                    <p className="text-sm text-gray-500">Weekly summary of activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailDigest}
                      onChange={(e) => setNotifications({ ...notifications, emailDigest: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNotificationsSave}
                  disabled={updatePreferences.isPending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {updatePreferences.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {updatePreferences.isPending ? 'Saving...' : 'Save Notifications'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={handleEnable2FA}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={changePassword.isPending || !currentPassword || !newPassword || newPassword !== confirmPassword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {changePassword.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {changePassword.isPending ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
