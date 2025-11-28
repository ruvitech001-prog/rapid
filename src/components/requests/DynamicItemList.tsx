'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface EquipmentItem {
  id: string
  item: string
  link: string
  amount: number
}

interface DynamicItemListProps {
  label?: string
  items: EquipmentItem[]
  onChange: (items: EquipmentItem[]) => void
  disabled?: boolean
  currency?: string
}

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export function DynamicItemList({
  label,
  items,
  onChange,
  disabled = false,
  currency = 'INR',
}: DynamicItemListProps) {
  const addItem = () => {
    const newItem: EquipmentItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      item: '',
      link: '',
      amount: 0,
    }
    onChange([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length <= 1) return
    onChange(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof EquipmentItem, value: string | number) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-medium text-gray-900">{label}</Label>}

      {/* Header row */}
      <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-500 uppercase">
        <div className="col-span-4">Item</div>
        <div className="col-span-4">Link</div>
        <div className="col-span-3">Amount</div>
        <div className="col-span-1"></div>
      </div>

      {/* Item rows */}
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
          <div className="col-span-4">
            <Input
              className={inputClass}
              placeholder="Laptop"
              value={item.item}
              onChange={(e) => updateItem(item.id, 'item', e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="col-span-4">
            <Input
              className={inputClass}
              placeholder="https://www.amazon.in/..."
              value={item.link}
              onChange={(e) => updateItem(item.id, 'link', e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="col-span-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {currency}
              </span>
              <Input
                className={`${inputClass} pl-12`}
                type="number"
                placeholder="50,000"
                value={item.amount || ''}
                onChange={(e) => updateItem(item.id, 'amount', parseInt(e.target.value) || 0)}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="col-span-1 flex justify-center">
            {items.length > 1 && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-10 w-10 p-0"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Add another button */}
      {!disabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-[#642DFC] hover:text-[#5224D9] hover:bg-[#642DFC]/10"
          onClick={addItem}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add another
        </Button>
      )}

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-[#DEE4EB]">
        <span className="text-sm font-medium text-gray-900">Total amount</span>
        <span className="text-lg font-semibold text-gray-900">
          {formatCurrency(totalAmount)}
        </span>
      </div>
    </div>
  )
}

export function createEmptyItem(): EquipmentItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    item: '',
    link: '',
    amount: 0,
  }
}
