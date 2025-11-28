'use client';

import { useState } from 'react';
import { Building2, MapPin, Shield, Save, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  employees: number;
  yearEstablished: number;
  panNumber: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CompanyPage() {
  const [company, setCompany] = useState<CompanyInfo>({
    name: 'Tech Solutions Pvt Ltd',
    email: 'info@techsolutions.com',
    phone: '+91 9876543210',
    website: 'www.techsolutions.com',
    industry: 'Technology',
    employees: 150,
    yearEstablished: 2020,
    panNumber: 'AABCT1234E',
    gstNumber: '29AABCT1234E1ZX',
    address: '123 Business Park, Tech Hub',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log('Saving company info:', company);
  };

  const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";
  const _disabledClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-[#F4F7FA] text-sm cursor-not-allowed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Information</h1>
        <p className="text-[#8593A3] mt-1">Manage your company details and settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL EMPLOYEES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{company.employees}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">YEAR ESTABLISHED</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{company.yearEstablished}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">INDUSTRY</p>
                <p className="text-3xl font-bold text-[#586AF5] mt-2">{company.industry}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#586AF5]/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Basic Information */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#586AF5]" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">COMPANY NAME *</Label>
              <Input
                type="text"
                name="name"
                value={company.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EMAIL *</Label>
              <Input
                type="email"
                name="email"
                value={company.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PHONE *</Label>
              <Input
                type="tel"
                name="phone"
                value={company.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">WEBSITE</Label>
              <Input
                type="url"
                name="website"
                value={company.website}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">INDUSTRY *</Label>
              <Input
                type="text"
                name="industry"
                value={company.industry}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">YEAR ESTABLISHED</Label>
              <Input
                type="number"
                name="yearEstablished"
                value={company.yearEstablished}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
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
              <Input
                type="text"
                name="address"
                value={company.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CITY *</Label>
                <Input
                  type="text"
                  name="city"
                  value={company.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">STATE *</Label>
                <Input
                  type="text"
                  name="state"
                  value={company.state}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PINCODE *</Label>
                <Input
                  type="text"
                  name="pincode"
                  value={company.pincode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Details */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#586AF5]" />
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
                value={company.panNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">GST NUMBER</Label>
              <Input
                type="text"
                name="gstNumber"
                value={company.gstNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Save className="h-4 w-4" />
          Save Company Information
        </Button>
      </div>
    </div>
  );
}
