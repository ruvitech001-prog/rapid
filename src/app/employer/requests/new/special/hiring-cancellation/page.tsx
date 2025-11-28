/**
 * Cancellation of Hiring Form
 *
 * @route /employer/requests/new/special/hiring-cancellation
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import {
  EmployeeSelector,
  FileUpload,
  type Employee,
  type UploadedFile,
} from '@/components/requests'
import { addMockData, getCurrentMockCompany, getMockData } from '@/lib/mock-data'

const CANCELLATION_REASONS = [
  { value: 'unable_to_contact', label: 'Unable to contact' },
  { value: 'candidate_withdrew', label: 'Candidate withdrew' },
  { value: 'position_filled', label: 'Position filled' },
  { value: 'budget_constraints', label: 'Budget constraints' },
  { value: 'other', label: 'Other' },
]

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export default function HiringCancellationPage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEmployee) {
      toast.error('Please select a team member')
      return
    }
    if (!reason) {
      toast.error('Please select a reason')
      return
    }

    setIsSubmitting(true)

    try {
      const newRequest = {
        id: crypto.randomUUID(),
        company_id: company?.id || '',
        requester_id: employees[0]?.id || '',
        request_type: 'cancellation_of_hiring',
        title: `Cancel hiring - ${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        description: `Reason: ${CANCELLATION_REASONS.find(r => r.value === reason)?.label}`,
        request_data: {
          employee_id: selectedEmployee.id,
          employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
          reason,
          current_start_date: '2023-12-11',
        },
        status: 'pending',
        assigned_to: null,
        notes: notes,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
      }

      addMockData('specialRequests', newRequest)
      toast.success('Request submitted successfully')
      router.push('/employer/requests')
    } catch (error) {
      toast.error('Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4 text-gray-600" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Create a special request</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-[#DEE4EB] p-6 space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Request type</Label>
              <div className="h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-gray-50 text-sm text-gray-900 flex items-center">
                Cancellation of hiring
              </div>
            </div>

            <EmployeeSelector
              label="Team member"
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              employees={employees}
              required
            />

            {selectedEmployee && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-900">Current start date</Label>
                <div className="h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-gray-50 text-sm text-gray-900 flex items-center">
                  11/Dec/2022
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Reason for cancellation<span className="text-red-500">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {CANCELLATION_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Notes</Label>
              <Textarea
                className="min-h-[100px] rounded-lg border border-[#DEE4EB]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <FileUpload label="Upload documents" value={files} onChange={setFiles} />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#642DFC] hover:bg-[#5224D9]" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
