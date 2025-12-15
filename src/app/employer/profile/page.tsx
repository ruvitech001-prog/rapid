'use client';

import { useState } from 'react';
import { User, Lock, Save, Mail, Phone, Briefcase, Building2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EmployerProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@company.com',
    phone: '+91 98765 43210',
    designation: 'HR Manager',
    department: 'Human Resources',
    address: '456 Park Avenue, Bangalore',
    dateOfBirth: '1985-03-20',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSave = () => {
    // TODO: Implement profile save via API
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }
    if (passwordData.newPassword.length < 8) {
      return;
    }
    // TODO: Implement password change via Supabase Auth
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";
  const disabledClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-[#F4F7FA] text-sm cursor-not-allowed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-[#8593A3] mt-1">Manage your personal information and security settings</p>
      </div>

      {/* Profile Summary */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#586AF5] flex items-center justify-center text-white text-2xl font-bold">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-[#8593A3] mt-1">{profileData.designation} - {profileData.department}</p>
              <p className="text-[#586AF5] text-sm mt-1">{profileData.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-[#586AF5]" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">FIRST NAME *</Label>
              <Input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">LAST NAME *</Label>
              <Input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EMAIL</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8593A3]" />
                <Input
                  type="email"
                  value={profileData.email}
                  disabled
                  className={`${disabledClass} pl-10`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PHONE *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8593A3]" />
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DESIGNATION</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8593A3]" />
                <Input
                  type="text"
                  value={profileData.designation}
                  onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DEPARTMENT</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8593A3]" />
                <Input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ADDRESS</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#8593A3]" />
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 pl-10 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handleProfileSave} className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#586AF5]" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CURRENT PASSWORD *</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">NEW PASSWORD *</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={8}
                  className={inputClass}
                />
                <p className="text-xs text-[#8593A3]">Minimum 8 characters</p>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CONFIRM PASSWORD *</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="outline" className="gap-2 border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]">
                <Lock className="h-4 w-4" />
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
