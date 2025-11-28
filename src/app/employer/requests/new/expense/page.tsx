/**
 * Expense Claim Form
 * Create request for expense claim
 *
 * @route /employer/requests/new/expense
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { FileUpload, type UploadedFile } from '@/components/requests'
import { addMockData, getCurrentMockCompany, getMockData } from '@/lib/mock-data'

const EXPENSE_CATEGORIES = [
  { value: 'business_meeting', label: 'Business meeting' },
  { value: 'travel', label: 'Travel' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'meals', label: 'Meals' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'software', label: 'Software' },
  { value: 'training', label: 'Training' },
  { value: 'office_supplies', label: 'Office supplies' },
  { value: 'other', label: 'Other' },
]

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export default function ExpenseClaimPage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  const [formData, setFormData] = useState({
    dateOfExpense: '',
    amount: '',
    category: '',
    notes: '',
  })
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.dateOfExpense || !formData.amount || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Get first employee as requester (in real app, this would be current user)
      const employees = getMockData('employees')
      const requesterId = employees[0]?.id || ''

      // Create expense request
      const newRequest = {
        id: crypto.randomUUID(),
        employee_id: requesterId,
        company_id: company?.id || '',
        category: formData.category,
        amount: parseFloat(formData.amount.replace(/,/g, '')),
        currency: 'INR',
        description: formData.notes || `Expense claim for ${EXPENSE_CATEGORIES.find(c => c.value === formData.category)?.label}`,
        receipt_url: files.length > 0 ? 'uploaded' : null,
        status: 'pending',
        approver_id: null,
        approved_at: null,
        created_at: formData.dateOfExpense,
      }

      addMockData('expenseRequests', newRequest)
      toast.success('Expense claim submitted successfully')
      router.push('/employer/requests')
    } catch (error) {
      console.error('Error submitting expense:', error)
      toast.error('Failed to submit expense claim')
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
          <h1 className="text-2xl font-semibold text-gray-900">Create request for expense claim</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-[#DEE4EB] p-6 space-y-6">
            {/* Date of expense */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Date of expense<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  className={inputClass}
                  value={formData.dateOfExpense}
                  onChange={(e) => handleChange('dateOfExpense', e.target.value)}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Amount<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">INR</span>
                <Input
                  type="text"
                  className={`${inputClass} pl-12`}
                  placeholder="12,000"
                  value={formData.amount}
                  onChange={(e) => {
                    // Allow only numbers and commas
                    const value = e.target.value.replace(/[^0-9,]/g, '')
                    handleChange('amount', value)
                  }}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Choose expense category<span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Notes</Label>
              <Textarea
                className="min-h-[100px] rounded-lg border border-[#DEE4EB] focus:border-[#642DFC] focus:ring-2 focus:ring-[#642DFC]/20"
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>

            {/* File Upload */}
            <FileUpload
              label="Upload documents"
              value={files}
              onChange={setFiles}
              accept=".pdf,.jpg,.jpeg,.png"
              maxFiles={5}
              maxSize={10}
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
