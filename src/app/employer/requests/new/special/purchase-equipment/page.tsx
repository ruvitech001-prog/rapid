/**
 * Purchase Equipment Form
 * Request equipment purchase for team members
 *
 * @route /employer/requests/new/special/purchase-equipment
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import {
  EmployeeSelector,
  AddressInput,
  AddressDisplay,
  DynamicItemList,
  FileUpload,
  createEmptyItem,
  emptyAddress,
  type Employee,
  type Address,
  type UploadedFile,
  type EquipmentItem,
} from '@/components/requests'
import { addMockData, getCurrentMockCompany, getMockData } from '@/lib/mock-data'

export default function PurchaseEquipmentPage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  // State
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [items, setItems] = useState<EquipmentItem[]>([createEmptyItem()])
  const [shippingAddress, setShippingAddress] = useState<Address>(emptyAddress)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [saveAddress, setSaveAddress] = useState(false)
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

  // When employee is selected, populate address
  useEffect(() => {
    if (selectedEmployee?.personal_details) {
      setShippingAddress({
        country: 'India',
        addressLine1: selectedEmployee.personal_details.address || '',
        addressLine2: '',
        city: selectedEmployee.personal_details.city || '',
        state: selectedEmployee.personal_details.state || '',
        pinCode: selectedEmployee.personal_details.postal_code || '',
      })
    }
  }, [selectedEmployee])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEmployee) {
      toast.error('Please select a team member')
      return
    }

    const validItems = items.filter(item => item.item && item.amount > 0)
    if (validItems.length === 0) {
      toast.error('Please add at least one item')
      return
    }

    setIsSubmitting(true)

    try {
      const totalAmount = validItems.reduce((sum, item) => sum + item.amount, 0)

      const newRequest = {
        id: crypto.randomUUID(),
        company_id: company?.id || '',
        requester_id: employees[0]?.id || '',
        request_type: 'purchase_equipment',
        title: `Purchase equipment for ${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        description: validItems.map(i => i.item).join(', '),
        request_data: {
          employee_id: selectedEmployee.id,
          employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
          items: validItems,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          save_address: saveAddress,
        },
        status: 'pending',
        assigned_to: null,
        notes: notes,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
      }

      addMockData('specialRequests', newRequest)
      toast.success('Equipment request submitted successfully')
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
            {/* Request Type (display only) */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Request type</Label>
              <div className="h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-gray-50 text-sm text-gray-900 flex items-center">
                Purchase equipment
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

            {/* Items */}
            <DynamicItemList
              label="Equipment items"
              items={items}
              onChange={setItems}
              currency="INR"
            />

            {/* Shipping Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-900">Shipping address</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[#642DFC] hover:text-[#5224D9]"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  {isEditingAddress ? 'Done' : 'Edit'}
                </Button>
              </div>
              {isEditingAddress ? (
                <AddressInput
                  value={shippingAddress}
                  onChange={setShippingAddress}
                />
              ) : (
                <AddressDisplay address={shippingAddress} />
              )}
            </div>

            {/* Save Address Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="save-address"
                checked={saveAddress}
                onCheckedChange={(checked) => setSaveAddress(checked === true)}
              />
              <Label htmlFor="save-address" className="text-sm text-gray-600 cursor-pointer">
                Save address for future use
              </Label>
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
