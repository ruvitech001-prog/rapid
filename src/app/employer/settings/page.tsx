'use client';

import { useState } from 'react';
import { Building, MapPin, FileText, DollarSign, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanySettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  panNumber: string;
  gstNumber: string;
  epfNumber: string;
  esiNumber: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'payroll' | 'notifications' | 'security'>('company');

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: 'Tech Solutions Pvt Ltd',
    companyEmail: 'info@techsolutions.com',
    companyPhone: '+91 9876543210',
    address: '123 Business Park, Tech Hub',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    panNumber: 'AABCT1234E',
    gstNumber: '29AABCT1234E1ZX',
    epfNumber: 'KN/BLR/12345/000',
    esiNumber: '12345678901234567',
  });

  const handleCompanySettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanySettings({
      ...companySettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveCompanySettings = () => {
    console.log('Saving company settings:', companySettings);
    alert('Company settings saved successfully!');
  };

  const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";
  const selectClass = "h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";

  const tabs = [
    { id: 'company' as const, label: 'Company Details', icon: Building },
    { id: 'payroll' as const, label: 'Payroll Settings', icon: DollarSign },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-[#8593A3] mt-1">Manage your company and system settings</p>
      </div>

      {/* Tabs */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#586AF5] text-white'
                      : 'text-[#8593A3] hover:bg-[#F4F7FA]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Company Details Tab */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-[#586AF5]" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">COMPANY NAME *</Label>
                  <Input
                    type="text"
                    name="companyName"
                    value={companySettings.companyName}
                    onChange={handleCompanySettingsChange}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">COMPANY EMAIL *</Label>
                  <Input
                    type="email"
                    name="companyEmail"
                    value={companySettings.companyEmail}
                    onChange={handleCompanySettingsChange}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">COMPANY PHONE *</Label>
                  <Input
                    type="tel"
                    name="companyPhone"
                    value={companySettings.companyPhone}
                    onChange={handleCompanySettingsChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#586AF5]" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">STREET ADDRESS *</Label>
                  <textarea
                    name="address"
                    value={companySettings.address}
                    onChange={handleCompanySettingsChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CITY *</Label>
                    <Input
                      type="text"
                      name="city"
                      value={companySettings.city}
                      onChange={handleCompanySettingsChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">STATE *</Label>
                    <Input
                      type="text"
                      name="state"
                      value={companySettings.state}
                      onChange={handleCompanySettingsChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PINCODE *</Label>
                    <Input
                      type="text"
                      name="pincode"
                      value={companySettings.pincode}
                      onChange={handleCompanySettingsChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#586AF5]" />
                Compliance Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PAN NUMBER *</Label>
                  <Input
                    type="text"
                    name="panNumber"
                    value={companySettings.panNumber}
                    onChange={handleCompanySettingsChange}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">GST NUMBER *</Label>
                  <Input
                    type="text"
                    name="gstNumber"
                    value={companySettings.gstNumber}
                    onChange={handleCompanySettingsChange}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EPF NUMBER *</Label>
                  <Input
                    type="text"
                    name="epfNumber"
                    value={companySettings.epfNumber}
                    onChange={handleCompanySettingsChange}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ESI NUMBER</Label>
                  <Input
                    type="text"
                    name="esiNumber"
                    value={companySettings.esiNumber}
                    onChange={handleCompanySettingsChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveCompanySettings}
              className="bg-[#642DFC] hover:bg-[#5020d9]"
            >
              Save Company Settings
            </Button>
          </div>
        </div>
      )}

      {/* Payroll Settings Tab */}
      {activeTab === 'payroll' && (
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Payroll Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Payroll Cycle</p>
                <p className="text-sm text-[#8593A3]">When do you process payroll?</p>
              </div>
              <select className={selectClass}>
                <option>Last day of month</option>
                <option>First day of month</option>
                <option>15th of month</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Working Days</p>
                <p className="text-sm text-[#8593A3]">Standard working days per month</p>
              </div>
              <input
                type="number"
                defaultValue={26}
                className="w-24 h-10 px-3 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Auto-approve Payroll</p>
                <p className="text-sm text-[#8593A3]">Automatically approve payroll after generation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[#DEE4EB] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#586AF5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#DEE4EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#586AF5]"></div>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Email Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Leave Requests</p>
                <p className="text-sm text-[#8593A3]">Notify when employees submit leave requests</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#DEE4EB] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#586AF5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#DEE4EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#586AF5]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Expense Claims</p>
                <p className="text-sm text-[#8593A3]">Notify when employees submit expense claims</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#DEE4EB] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#586AF5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#DEE4EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#586AF5]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Payroll Completion</p>
                <p className="text-sm text-[#8593A3]">Notify when payroll processing is complete</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#DEE4EB] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#586AF5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#DEE4EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#586AF5]"></div>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-[#8593A3]">Add an extra layer of security to your account</p>
              </div>
              <Button className="bg-[#642DFC] hover:bg-[#5020d9]">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-[#8593A3]">Automatically log out after period of inactivity</p>
              </div>
              <select className={selectClass}>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-[#8593A3]">Update your account password</p>
              </div>
              <Button variant="outline" className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
