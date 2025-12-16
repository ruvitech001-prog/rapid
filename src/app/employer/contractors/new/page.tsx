'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { colors } from '@/lib/design-tokens';

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
    // TODO: Implement contractor creation via API
    router.push('/employer/contractors');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass = `w-full h-10 px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2`;
  const selectClass = `w-full h-10 rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/employer/contractors">
            <Button variant="outline" size="icon" className="border hover:bg-[#F4F7FA]" style={{ borderColor: colors.border }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Contractor</h1>
            <p className="mt-1" style={{ color: colors.neutral500 }}>Fill in the details to onboard a new contractor</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="rounded-2xl border shadow-none" style={{ borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="text-gray-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>FIRST NAME *</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>LAST NAME *</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>EMAIL *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>PHONE NUMBER *</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card className="rounded-2xl border shadow-none" style={{ borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="text-gray-900">Contract Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>CONTRACTOR ID *</Label>
                <Input
                  type="text"
                  name="contractorId"
                  value={formData.contractorId}
                  onChange={handleChange}
                  required
                  placeholder="CON001"
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>SPECIALTY *</Label>
                <Input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Frontend Development"
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>START DATE *</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>END DATE</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>RATE TYPE *</Label>
                <select
                  name="rateType"
                  value={formData.rateType}
                  onChange={handleChange}
                  required
                  className={selectClass}
                  style={{ borderColor: colors.border }}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>RATE AMOUNT *</Label>
                <Input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  required
                  placeholder="2500"
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="rounded-2xl border shadow-none" style={{ borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="text-gray-900">Bank Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>BANK NAME *</Label>
                <Input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>ACCOUNT NUMBER *</Label>
                <Input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>IFSC CODE *</Label>
                <Input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Details */}
        <Card className="rounded-2xl border shadow-none" style={{ borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="text-gray-900">Tax Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>PAN NUMBER *</Label>
                <Input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  required
                  placeholder="ABCDE1234F"
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>GST NUMBER</Label>
                <Input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  className={inputClass}
                  style={{ borderColor: colors.border }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="rounded-2xl border shadow-none" style={{ borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="text-gray-900">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>STREET ADDRESS *</Label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>CITY *</Label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    style={{ borderColor: colors.border }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>STATE *</Label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    style={{ borderColor: colors.border }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>PINCODE *</Label>
                  <Input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    style={{ borderColor: colors.border }}
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
            className="border text-gray-700"
            style={{ borderColor: colors.border }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="gap-2"
            style={{ backgroundColor: colors.primary500 }}
          >
            <UserPlus className="h-4 w-4" />
            Add Contractor
          </Button>
        </div>
      </form>
    </div>
  );
}
