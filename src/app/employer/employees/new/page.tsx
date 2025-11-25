'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  employeeId: string;
  joinDate: string;
  salary: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  aadhaarNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function NewEmployeePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EmployeeForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    employeeId: '',
    joinDate: '',
    salary: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    panNumber: '',
    aadhaarNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New employee:', formData);
    router.push('/employer/employees');
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
          <Link href="/employer/employees">
            <Button variant="outline" size="icon" className="border-[#DEE4EB] hover:bg-[#F4F7FA]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
            <p className="text-[#8593A3] mt-1">Fill in the details to onboard a new employee</p>
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

        {/* Employment Details */}
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Employment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EMPLOYEE ID *</Label>
                <Input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  placeholder="EMP001"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DESIGNATION *</Label>
                <Input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DEPARTMENT *</Label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className={selectClass}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">JOIN DATE *</Label>
                <Input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ANNUAL SALARY (CTC) *</Label>
                <Input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  placeholder="1200000"
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

        {/* Compliance Details */}
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Compliance Details</CardTitle>
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
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">AADHAAR NUMBER *</Label>
                <Input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  required
                  placeholder="1234 5678 9012"
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
            Add Employee
          </Button>
        </div>
      </form>
    </div>
  );
}
