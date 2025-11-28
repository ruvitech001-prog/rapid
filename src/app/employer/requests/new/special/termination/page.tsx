/**
 * Termination Request Form
 * Process employee termination
 *
 * @route /employer/requests/new/special/termination
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  EmployeeSelector,
  AddressDisplay,
  FileUpload,
  emptyAddress,
  type Employee,
  type Address,
  type UploadedFile,
} from '@/components/requests'
import { addMockData, getCurrentMockCompany, getMockData } from '@/lib/mock-data'

const TERMINATION_REASONS = [
  { value: 'unable_to_contact', label: 'Unable to contact' },
  { value: 'performance_issues', label: 'Performance issues' },
  { value: 'policy_violation', label: 'Policy violation' },
  { value: 'misconduct', label: 'Misconduct' },
  { value: 'redundancy', label: 'Redundancy' },
  { value: 'other', label: 'Other' },
]

interface AssignedItem {
  id: string
  name: string
  selected: boolean
}

type ShipTo = 'team_member' | 'rapid_office'

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export default function TerminationPage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  // State
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [reason, setReason] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([
    { id: '1', name: 'Lenovo SG345 laptop', selected: true },
    { id: '2', name: 'Dell wireless mouse', selected: true },
  ])
  const [shipTo, setShipTo] = useState<ShipTo>('rapid_office')
  const [pickupAddress, setPickupAddress] = useState<Address>(emptyAddress)
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load employees
  useEffect(() => {
    const allEmployees = getMockData('employees')
    setEmployees(allEmployees.map((e: any) => ({
      id: e.id,
      employee_code: e.employee_code,
      first_name: e.first_name,
      last_name: e.last_name,
      email: e.email,
      designation: e.designation,
      department: e.department,
      personal_details: e.personal_details,
    })))
  }, [])

  // When employee is selected, populate pickup address
  useEffect(() => {
    if (selectedEmployee?.personal_details) {
      setPickupAddress({
        country: 'India',
        addressLine1: selectedEmployee.personal_details.address || '132/B, UDB Landmark',
        addressLine2: 'Tonk Road, Gopalpura',
        city: selectedEmployee.personal_details.city || 'Jaipur',
        state: selectedEmployee.personal_details.state || 'Rajasthan',
        pinCode: selectedEmployee.personal_details.postal_code || '302020',
      })
    }
  }, [selectedEmployee])

  const toggleItemSelection = (itemId: string) => {
    setAssignedItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEmployee) {
      toast.error('Please select a team member')
      return
    }
    if (!reason) {
      toast.error('Please select a reason for termination')
      return
    }
    if (!effectiveDate) {
      toast.error('Please select an effective date')
      return
    }

    setIsSubmitting(true)

    try {
      const selectedItems = assignedItems.filter(item => item.selected)

      const newRequest = {
        id: crypto.randomUUID(),
        company_id: company?.id || '',
        requester_id: employees[0]?.id || '',
        request_type: 'termination',
        title: `Termination - ${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        description: `Reason: ${TERMINATION_REASONS.find(r => r.value === reason)?.label}`,
        request_data: {
          employee_id: selectedEmployee.id,
          employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
          reason,
          effective_date: effectiveDate,
          items_to_collect: selectedItems,
          ship_to: shipTo,
          pickup_address: pickupAddress,
          storage_fee: shipTo === 'rapid_office' ? 1000 : 0,
        },
        status: 'pending',
        assigned_to: null,
        notes: notes,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
      }

      addMockData('specialRequests', newRequest)
      toast.success('Termination request submitted successfully')
      router.push('/employer/requests')
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-gray-600"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Create a special request</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-[#DEE4EB] p-6 space-y-6">
            {/* Request Type */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Request type</Label>
              <div className="h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-gray-50 text-sm text-gray-900 flex items-center">
                Termination
              </div>
            </div>

            {/* Team Member */}
            <EmployeeSelector
              label="Team member"
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              employees={employees}
              required
            />

            {/* Reason */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Reason for termination<span className="text-red-500">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {TERMINATION_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Effective Date */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Effective date<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  className={inputClass}
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Assigned Items */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Items assigned to the team member</Label>
              <div className="space-y-2">
                {assignedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#DEE4EB] bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                      <span className="text-sm text-gray-900">{item.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#642DFC] hover:text-[#5224D9]"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ship To Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Ship selected item to</Label>
              <p className="text-xs text-[#8593A3]">Choose where to ship the equipment</p>

              <div className="space-y-2">
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    shipTo === 'team_member'
                      ? 'border-[#642DFC] bg-[#642DFC]/5'
                      : 'border-[#DEE4EB] hover:border-[#642DFC]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipTo"
                    value="team_member"
                    checked={shipTo === 'team_member'}
                    onChange={() => setShipTo('team_member')}
                    className="w-4 h-4 text-[#642DFC] border-gray-300 focus:ring-[#642DFC]"
                  />
                  <span className="text-sm text-gray-900">A team member</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    shipTo === 'rapid_office'
                      ? 'border-[#642DFC] bg-[#642DFC]/5'
                      : 'border-[#DEE4EB] hover:border-[#642DFC]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipTo"
                    value="rapid_office"
                    checked={shipTo === 'rapid_office'}
                    onChange={() => setShipTo('rapid_office')}
                    className="w-4 h-4 text-[#642DFC] border-gray-300 focus:ring-[#642DFC]"
                  />
                  <span className="text-sm text-gray-900">Rapid's office</span>
                </label>
              </div>
            </div>

            {/* Storage Fee */}
            {shipTo === 'rapid_office' && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-700">
                  Storage & handling fee i.e. <strong>INR 1,000</strong>
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="mt-2 bg-[#642DFC] hover:bg-[#5224D9]"
                >
                  Pay now
                </Button>
              </div>
            )}

            {/* Pickup Address */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-900">Pickup address</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[#642DFC] hover:text-[#5224D9]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add address
                </Button>
              </div>
              <AddressDisplay address={pickupAddress} />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Notes</Label>
              <Textarea
                className="min-h-[100px] rounded-lg border border-[#DEE4EB] focus:border-[#642DFC] focus:ring-2 focus:ring-[#642DFC]/20"
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* File Upload */}
            <FileUpload
              label="Upload documents"
              value={files}
              onChange={setFiles}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#642DFC] hover:bg-[#5224D9]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
