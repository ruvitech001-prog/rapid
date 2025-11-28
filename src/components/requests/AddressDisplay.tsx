'use client'

import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import type { Address } from './AddressInput'

interface AddressDisplayProps {
  address: Address
  onEdit?: () => void
  showEdit?: boolean
  selected?: boolean
  selectable?: boolean
  onSelect?: () => void
  className?: string
}

export function AddressDisplay({
  address,
  onEdit,
  showEdit = false,
  selected = false,
  selectable = false,
  onSelect,
  className = '',
}: AddressDisplayProps) {
  const formattedAddress = formatAddress(address)

  return (
    <div
      className={`
        relative rounded-lg border p-4
        ${selected ? 'border-[#642DFC] bg-[#642DFC]/5' : 'border-[#DEE4EB] bg-white'}
        ${selectable ? 'cursor-pointer hover:border-[#642DFC]/50' : ''}
        ${className}
      `}
      onClick={selectable ? onSelect : undefined}
    >
      {selectable && (
        <div className="absolute top-4 left-4">
          <div
            className={`
              w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${selected ? 'border-[#642DFC] bg-[#642DFC]' : 'border-gray-300'}
            `}
          >
            {selected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>
      )}

      <div className={selectable ? 'ml-6' : ''}>
        <p className="text-sm text-gray-900 whitespace-pre-line">{formattedAddress}</p>
      </div>

      {showEdit && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-[#642DFC] hover:text-[#5224D9] hover:bg-[#642DFC]/10"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <Edit2 className="w-4 h-4 mr-1" />
          Edit
        </Button>
      )}
    </div>
  )
}

export function formatAddress(address: Address): string {
  const parts = []

  if (address.addressLine1) {
    parts.push(address.addressLine1)
  }
  if (address.addressLine2) {
    parts.push(address.addressLine2)
  }

  const cityStateLine = [address.city, address.state, address.country]
    .filter(Boolean)
    .join(', ')

  if (cityStateLine) {
    parts.push(cityStateLine)
  }

  if (address.pinCode) {
    parts.push(address.pinCode)
  }

  return parts.join('\n')
}

export function formatAddressOneLine(address: Address): string {
  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.country,
    address.pinCode,
  ]
    .filter(Boolean)
    .join(', ')
}
