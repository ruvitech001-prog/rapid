'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContractorForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  contractorId: string;
  startDate: string;
  endDate: string;
  rate: string;
  rateType: 'hourly' | 'daily' | 'monthly';
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function NewContractorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ContractorForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    contractorId: '',
    startDate: '',
    endDate: '',
    rate: '',
    rateType: 'hourly',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    panNumber: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New contractor:', formData);
    router.push('/employer/contractors');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";
  const selectClass = "w-full h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/employer/contractors">
            <Button variant="outline" size="icon" className="border-[#DEE4EB] hover:bg-[#F4F7FA]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Contractor</h1>
            <p className="text-[#8593A3] mt-1">Fill in the details to onboard a new contractor</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">FIRST NAME *</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">LAST NAME *</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EMAIL *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PHONE NUMBER *</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Contract Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CONTRACTOR ID *</Label>
                <Input
                  type="text"
                  name="contractorId"
                  value={formData.contractorId}
                  onChange={handleChange}
                  required
                  placeholder="CON001"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SPECIALTY *</Label>
                <Input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Frontend Development"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">START DATE *</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">END DATE</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">RATE TYPE *</Label>
                <select
                  name="rateType"
                  value={formData.rateType}
                  onChange={handleChange}
                  required
                  className={selectClass}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">RATE AMOUNT *</Label>
                <Input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  required
                  placeholder="2500"
                  className={inputClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Bank Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">BANK NAME *</Label>
                <Input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ACCOUNT NUMBER *</Label>
                <Input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">IFSC CODE *</Label>
                <Input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Details */}
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Tax Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PAN NUMBER *</Label>
                <Input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  required
                  placeholder="ABCDE1234F"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">GST NUMBER</Label>
                <Input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  className={inputClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">STREET ADDRESS *</Label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
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
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">STATE *</Label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PINCODE *</Label>
                  <Input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]"
          >
            <UserPlus className="h-4 w-4" />
            Add Contractor
          </Button>
        </div>
      </form>
    </div>
  );
}
