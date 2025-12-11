'use client'

import { useState, useEffect } from 'react'
import { Loader2, User, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { useContractorProfile, useUpdateContractorInfo, useChangePassword } from '@/lib/hooks'

export default function ContractorProfilePage() {
  const { user } = useAuth()
  const contractorId = user?.id
  const { data: profile, isLoading } = useContractorProfile(contractorId)
  const updateProfile = useUpdateContractorInfo()
  const changePassword = useChangePassword()

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    address: '',
    dateOfBirth: '',
    bankAccount: '',
    gstin: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      const nameParts = (profile.full_name || '').split(' ')
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: '', // Email not stored in contractor table
        phone: profile.phone_number || '',
        specialization: profile.business_name || '', // Using business_name for specialization
        experience: '',
        address: '',
        dateOfBirth: '',
        bankAccount: profile.bankAccounts?.[0]?.account_number
          ? `XXXX XXXX ${profile.bankAccounts[0].account_number.slice(-4)}`
          : '',
        gstin: profile.gstin || '',
      })
    }
  }, [profile])

  const handleProfileSave = async () => {
    if (!contractorId) return

    try {
      await updateProfile.mutateAsync({
        contractorId,
        data: {
          full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          phone_number: profileData.phone,
        },
      })
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
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
        <h1 className="text-2xl font-bold text-gray-900">Contractor Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your personal and professional information</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-500">{profile?.contractor_code || 'Contractor'}</p>
              <p className="text-sm text-gray-400">{profileData.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="border-t pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <input
                  type="text"
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="border-t pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Tax Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">GSTIN (if applicable)</label>
                <input
                  type="text"
                  value={profileData.gstin}
                  onChange={(e) => setProfileData({ ...profileData, gstin: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Account (Last 4 digits)</label>
                <input
                  type="text"
                  value={profileData.bankAccount}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleProfileSave}
              disabled={updateProfile.isPending}
              className="gap-2"
            >
              {updateProfile.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
