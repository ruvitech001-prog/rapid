/**
 * Collect Equipment Form
 * Collect equipment from team members with shipping options
 *
 * @route /employer/requests/new/special/collect-equipment
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import {
  EmployeeSelector,
  AddressInput,
  AddressDisplay,
  FileUpload,
  emptyAddress,
  type Employee,
  type Address,
  type UploadedFile,
} from '@/components/requests'
import { addMockData, getCurrentMockCompany, getMockData } from '@/lib/mock-data'

interface AssignedItem {
  id: string
  name: string
  description: string
  selected: boolean
}

type ShipTo = 'team_member' | 'rapid_office'

export default function CollectEquipmentPage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  // State
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([
    { id: '1', name: 'Lenovo SG345 laptop', description: 'Assigned on 01/Jan/2023', selected: true },
    { id: '2', name: 'Dell wireless mouse', description: 'Assigned on 01/Jan/2023', selected: true },
  ])
  const [shipTo, setShipTo] = useState<ShipTo>('team_member')
  const [shippingAddress, setShippingAddress] = useState<Address>(emptyAddress)
  const [pickupAddress, setPickupAddress] = useState<Address>({
    country: 'India',
    addressLine1: '132/B, UDB Landmark',
    addressLine2: 'Tonk Road, Gopalpura',
    city: 'Jaipur',
    state: 'Rajasthan',
    pinCode: '302020',
  })
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

    const selectedItems = assignedItems.filter(item => item.selected)
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to collect')
      return
    }

    setIsSubmitting(true)

    try {
      const newRequest = {
        id: crypto.randomUUID(),
        company_id: company?.id || '',
        requester_id: employees[0]?.id || '',
        request_type: 'collect_equipment',
        title: `Collect equipment from ${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        description: selectedItems.map(i => i.name).join(', '),
        request_data: {
          employee_id: selectedEmployee.id,
          employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
          items: selectedItems,
          ship_to: shipTo,
          shipping_address: shipTo === 'team_member' ? shippingAddress : null,
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
      toast.success('Equipment collection request submitted successfully')
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
                Collect equipment
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
              <Label className="text-sm font-medium text-gray-900">Ship selected items to</Label>
              <p className="text-xs text-[#8593A3]">Choose where to ship the collected equipment</p>

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

            {/* Shipping Address (if team member) */}
            {shipTo === 'team_member' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-900">Shipping address</Label>
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
                <AddressInput
                  value={shippingAddress}
                  onChange={setShippingAddress}
                />
              </div>
            )}

            {/* Storage Fee (if Rapid's office) */}
            {shipTo === 'rapid_office' && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900">Storage and handling fees</h4>
                <p className="text-sm text-blue-700 mt-1">
                  For storing equipment at Rapid office, Rapid charges a fee of INR 1,000
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="mt-3 bg-[#642DFC] hover:bg-[#5224D9]"
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
