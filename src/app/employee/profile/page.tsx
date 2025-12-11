'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { useEmployeeProfile, useUpdateEmployeeInfo, useChangePassword } from '@/lib/hooks'

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const employeeId = user?.id
  const { data: profile, isLoading } = useEmployeeProfile(employeeId)
  const updateEmployee = useUpdateEmployeeInfo()
  const changePassword = useChangePassword()

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    personalEmail: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    payslipEmail: true,
    leaveReminders: true,
    attendanceAlerts: true,
    policyUpdates: true,
  })

  // Load profile data when it's available
  useEffect(() => {
    if (profile) {
      const nameParts = profile.full_name?.split(' ') || ['', '']
      const primaryContact = profile.emergencyContacts?.[0]
      const currentAddress = profile.currentAddress

      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profile.personal_email || '',
        phone: profile.phone_number || '',
        personalEmail: profile.personal_email || '',
        dateOfBirth: profile.date_of_birth || '',
        gender: profile.gender || '',
        address: currentAddress
          ? `${currentAddress.address_line_1}${currentAddress.address_line_2 ? ', ' + currentAddress.address_line_2 : ''}, ${currentAddress.city}, ${currentAddress.state} ${currentAddress.pin_code}`
          : '',
        emergencyContactName: primaryContact?.name || '',
        emergencyContactPhone: primaryContact?.phone_number || '',
        emergencyContactRelation: primaryContact?.relationship || '',
      })
    }
  }, [profile])

  const handleProfileSave = async () => {
    if (!employeeId) return

    try {
      await updateEmployee.mutateAsync({
        employeeId,
        data: {
          full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          phone_number: profileData.phone,
          personal_email: profileData.personalEmail,
          date_of_birth: profileData.dateOfBirth || null,
          gender: profileData.gender || null,
        },
      })
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.email) {
      toast.error('Unable to verify user. Please try logging in again.')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long!')
      return
    }

    try {
      await changePassword.mutateAsync({
        email: user.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password'
      toast.error(errorMessage)
    }
  }

  const handlePreferencesSave = () => {
    // TODO: Implement preferences saving to backend
    toast.success('Preferences updated successfully!')
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your personal information and preferences</p>
      </div>

      {/* Employee Info Card */}
      {profile?.contract && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold">
              {profile.full_name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{profile.full_name}</p>
              <p className="text-sm text-gray-600">{profile.contract.designation} - {profile.contract.department}</p>
              <p className="text-xs text-gray-500">Employee ID: {profile.employee_code || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Work Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Contact HR to change work email</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Personal Email</label>
              <input
                type="email"
                value={profileData.personalEmail}
                onChange={(e) => setProfileData({ ...profileData, personalEmail: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                type="text"
                value={profileData.emergencyContactName}
                onChange={(e) => setProfileData({ ...profileData, emergencyContactName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <input
                type="tel"
                value={profileData.emergencyContactPhone}
                onChange={(e) => setProfileData({ ...profileData, emergencyContactPhone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Relation</label>
              <input
                type="text"
                value={profileData.emergencyContactRelation}
                onChange={(e) => setProfileData({ ...profileData, emergencyContactRelation: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleProfileSave}
            disabled={updateEmployee.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateEmployee.isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Bank Account Info (Read-only) */}
      {profile?.bankAccounts && profile.bankAccounts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bank Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.bankAccounts.map((account, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{account.bank_name}</p>
                <p className="text-sm text-gray-600">A/C: {account.account_number?.replace(/\d(?=\d{4})/g, '*')}</p>
                <p className="text-sm text-gray-600">IFSC: {account.ifsc_code}</p>
                {account.is_primary && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Primary</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Contact HR to update bank details</p>
        </div>
      )}

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {changePassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
              <p className="text-xs text-gray-500">Receive notifications via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Payslip Emails</p>
              <p className="text-xs text-gray-500">Get notified when payslips are generated</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.payslipEmail}
                onChange={(e) => setPreferences({ ...preferences, payslipEmail: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Leave Reminders</p>
              <p className="text-xs text-gray-500">Reminders for leave balance and policy</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.leaveReminders}
                onChange={(e) => setPreferences({ ...preferences, leaveReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Attendance Alerts</p>
              <p className="text-xs text-gray-500">Alerts for missing clock-in/out</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.attendanceAlerts}
                onChange={(e) => setPreferences({ ...preferences, attendanceAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Policy Updates</p>
              <p className="text-xs text-gray-500">Company policy and announcement updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.policyUpdates}
                onChange={(e) => setPreferences({ ...preferences, policyUpdates: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handlePreferencesSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
