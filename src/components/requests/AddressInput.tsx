'use client'

import { useState as _useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface Address {
  country: string
  addressLine1: string
  addressLine2: string
  pinCode: string
  city: string
  state: string
}

interface AddressInputProps {
  value: Address
  onChange: (address: Address) => void
  disabled?: boolean
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
]

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"
const labelClass = "text-sm font-medium text-gray-900"
const helpTextClass = "text-xs text-[#8593A3] mt-1"

export function AddressInput({ value, onChange, disabled = false }: AddressInputProps) {
  const handleChange = (field: keyof Address, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <div className="space-y-4">
      {/* Country */}
      <div className="space-y-1.5">
        <Label className={labelClass}>
          Country<span className="text-red-500">*</span>
        </Label>
        <Select
          value={value.country}
          onValueChange={(val) => handleChange('country', val)}
          disabled={disabled}
        >
          <SelectTrigger className={inputClass}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="India">India</SelectItem>
          </SelectContent>
        </Select>
        <p className={helpTextClass}>Country where you are currently residing</p>
      </div>

      {/* Address Line 1 */}
      <div className="space-y-1.5">
        <Label className={labelClass}>
          Address line 1<span className="text-red-500">*</span>
        </Label>
        <Input
          className={inputClass}
          placeholder="105 UDB Landmark"
          value={value.addressLine1}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
          disabled={disabled}
        />
        <p className={helpTextClass}>Your house/apartment/block/building number</p>
      </div>

      {/* Address Line 2 */}
      <div className="space-y-1.5">
        <Label className={labelClass}>
          Address line 2<span className="text-red-500">*</span>
        </Label>
        <Input
          className={inputClass}
          placeholder="Gopalpura, Tonk Road, Near Bus stand"
          value={value.addressLine2}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
          disabled={disabled}
        />
        <p className={helpTextClass}>Your street name/landmark</p>
      </div>

      {/* PIN Code */}
      <div className="space-y-1.5">
        <Label className={labelClass}>
          PIN code<span className="text-red-500">*</span>
        </Label>
        <Input
          className={inputClass}
          placeholder="302020"
          value={value.pinCode}
          onChange={(e) => handleChange('pinCode', e.target.value)}
          disabled={disabled}
          maxLength={6}
        />
        <p className={helpTextClass}>Your zip or postal code</p>
      </div>

      {/* City and State in grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={labelClass}>
            City<span className="text-red-500">*</span>
          </Label>
          <Input
            className={inputClass}
            placeholder="Jaipur"
            value={value.city}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="space-y-1.5">
          <Label className={labelClass}>
            State<span className="text-red-500">*</span>
          </Label>
          <Select
            value={value.state}
            onValueChange={(val) => handleChange('state', val)}
            disabled={disabled}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export const emptyAddress: Address = {
  country: 'India',
  addressLine1: '',
  addressLine2: '',
  pinCode: '',
  city: '',
  state: '',
}
