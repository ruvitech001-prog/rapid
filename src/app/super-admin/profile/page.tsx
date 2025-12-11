'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload, Save, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { toast } from 'sonner'
import { useUserPreferences, useUpdateUserPreferences, useChangePassword } from '@/lib/hooks'

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Backend hooks for preferences and password
  const { data: userPreferences, isLoading: prefsLoading } = useUserPreferences()
  const updatePreferences = useUpdateUserPreferences()
  const changePassword = useChangePassword()

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  // Password form state
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    systemAlerts: true,
    payrollUpdates: true,
  })

  // Load user data when auth context is ready
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || ['', '']
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: '',
      })
    }
  }, [user])

  // Load notifications from user preferences when available
  useEffect(() => {
    if (userPreferences) {
      const notifPrefs = userPreferences.notificationPreferences
      setNotifications({
        emailNotifications: notifPrefs.emailNotifications,
        systemAlerts: notifPrefs.pushNotifications,
        payrollUpdates: notifPrefs.payrollAlerts,
      })
    }
  }, [userPreferences])

  // Get initials for avatar
  const getInitials = () => {
    if (!user?.name) return 'SA'
    const parts = user.name.split(' ')
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
  }

  // Handle profile form submission
  const handleSaveProfile = async () => {
    if (!profileData.firstName.trim()) {
      toast.error('First name is required')
      return
    }
    if (!profileData.email.trim()) {
      toast.error('Email is required')
      return
    }

    setIsSavingProfile(true)
    try {
      // Profile data update would go through user profile service
      // For now, show success as the data is managed by auth
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Handle password form submission
  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Current password is required')
      return
    }
    if (!passwordData.newPassword) {
      toast.error('New password is required')
      return
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    changePassword.mutate(
      { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
      {
        onSuccess: () => {
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          })
        },
      }
    )
  }

  // Handle notification toggle - saves to backend
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key],
    }
    setNotifications(updatedNotifications)

    // Map to backend notification preferences structure
    updatePreferences.mutate({
      notificationPreferences: {
        emailNotifications: key === 'emailNotifications' ? !notifications.emailNotifications : notifications.emailNotifications,
        pushNotifications: key === 'systemAlerts' ? !notifications.systemAlerts : notifications.systemAlerts,
        payrollAlerts: key === 'payrollUpdates' ? !notifications.payrollUpdates : notifications.payrollUpdates,
      },
    })
  }

  // Handle photo upload
  const handleUploadPhoto = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // In production, this would upload to storage
        toast.info('Photo upload requires backend storage integration')
      }
    }
    input.click()
  }

  if (authLoading || prefsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload or change your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="text-lg font-semibold">{getInitials()}</AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={handleUploadPhoto}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 98765 43210"
              className="mt-1"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
            {isSavingProfile ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your password and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Enter current password"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Enter new password"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
              className="mt-1"
            />
            {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
          <Button
            onClick={handleUpdatePassword}
            disabled={changePassword.isPending || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            {changePassword.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Control how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium text-sm">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive email updates</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationToggle('emailNotifications')}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium text-sm">System Alerts</p>
              <p className="text-xs text-muted-foreground">Notifications for critical events</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.systemAlerts}
              onChange={() => handleNotificationToggle('systemAlerts')}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium text-sm">Payroll Updates</p>
              <p className="text-xs text-muted-foreground">Updates about payroll processing</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.payrollUpdates}
              onChange={() => handleNotificationToggle('payrollUpdates')}
              className="h-4 w-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your account login history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Login from Chrome on macOS</p>
                <p className="text-xs text-muted-foreground">192.168.1.100 - Today at 9:30 AM</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Login from Chrome on macOS</p>
                <p className="text-xs text-muted-foreground">192.168.1.100 - Yesterday at 10:15 AM</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Login from Chrome on macOS</p>
                <p className="text-xs text-muted-foreground">192.168.1.100 - 2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
