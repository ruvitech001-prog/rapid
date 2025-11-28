'use client'

import { ChevronDown as _ChevronDown } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type RequestType =
  | 'send_gifts'
  | 'purchase_equipment'
  | 'collect_equipment'
  | 'termination'
  | 'cancellation_of_hiring'
  | 'extension_of_probation'
  | 'confirmation_of_probation'
  | 'incentive_payment'
  | 'office_space'
  | 'contract_amendment'

export const REQUEST_TYPES: { value: RequestType; label: string; description?: string }[] = [
  { value: 'send_gifts', label: 'Send gifts', description: 'Send gifts to team members' },
  { value: 'purchase_equipment', label: 'Purchase equipment', description: 'Request equipment purchase' },
  { value: 'collect_equipment', label: 'Collect equipment', description: 'Collect equipment from team member' },
  { value: 'termination', label: 'Termination', description: 'Process employee termination' },
  { value: 'cancellation_of_hiring', label: 'Cancellation of hiring', description: 'Cancel pending hire' },
  { value: 'extension_of_probation', label: 'Extension of probation', description: 'Extend probation period' },
  { value: 'confirmation_of_probation', label: 'Confirmation of probation', description: 'Confirm probation completion' },
  { value: 'incentive_payment', label: 'Incentive payment', description: 'Process bonus or incentive' },
  { value: 'office_space', label: 'Renting an office space', description: 'Request office space rental' },
  { value: 'contract_amendment', label: 'Contract amendment', description: 'Amend employee contract' },
]

interface RequestTypeSelectorProps {
  value: RequestType | ''
  onChange: (type: RequestType) => void
  disabled?: boolean
}

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export function RequestTypeSelector({
  value,
  onChange,
  disabled = false,
}: RequestTypeSelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-900">
        Request type<span className="text-red-500">*</span>
      </Label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as RequestType)}
        disabled={disabled}
      >
        <SelectTrigger className={inputClass}>
          <SelectValue placeholder="Select request type" />
        </SelectTrigger>
        <SelectContent>
          {REQUEST_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
