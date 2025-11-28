/**
 * Send Gifts Form
 * Individual and Bulk (Team) modes
 *
 * @route /employer/requests/new/special/gifts
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  EmployeeSelector,
  TeamSelector,
  AddressInput,
  AddressDisplay,
  FileUpload,
  emptyAddress,
  type Employee,
  type Team,
  type Address,
  type UploadedFile,
} from '@/components/requests'
import { addMockData, getCurrentMockCompany, getMockData } from '@/lib/mock-data'

type Mode = 'individual' | 'bulk'

// Mock teams
const MOCK_TEAMS: Team[] = [
  { id: '1', name: 'Design team', description: 'Product design and UX', memberCount: 8 },
  { id: '2', name: 'Engineering team', description: 'Software development', memberCount: 15 },
  { id: '3', name: 'Marketing team', description: 'Marketing and growth', memberCount: 6 },
  { id: '4', name: 'Operations team', description: 'Operations and support', memberCount: 10 },
]

export default function SendGiftsPage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  // State
  const [mode, setMode] = useState<Mode>('individual')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [teamMembers, setTeamMembers] = useState<Employee[]>([])
  const [shippingAddress, setShippingAddress] = useState<Address>(emptyAddress)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
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

  // When team is selected, get team members
  useEffect(() => {
    if (selectedTeam) {
      // Filter employees by department (simulating team)
      const members = employees.slice(0, 4) // Just take first 4 for demo
      setTeamMembers(members)
    } else {
      setTeamMembers([])
    }
  }, [selectedTeam, employees])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'individual' && !selectedEmployee) {
      toast.error('Please select a team member')
      return
    }

    if (mode === 'bulk' && !selectedTeam) {
      toast.error('Please select a team')
      return
    }

    setIsSubmitting(true)

    try {
      const requestData = mode === 'individual'
        ? {
            mode: 'individual',
            employee_id: selectedEmployee?.id,
            employee_name: `${selectedEmployee?.first_name} ${selectedEmployee?.last_name}`,
            shipping_address: shippingAddress,
          }
        : {
            mode: 'bulk',
            team_id: selectedTeam?.id,
            team_name: selectedTeam?.name,
            members: teamMembers.map(m => ({
              id: m.id,
              name: `${m.first_name} ${m.last_name}`,
            })),
          }

      const newRequest = {
        id: crypto.randomUUID(),
        company_id: company?.id || '',
        requester_id: employees[0]?.id || '',
        request_type: 'send_gifts',
        title: mode === 'individual'
          ? `Send gift to ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}`
          : `Send gifts to ${selectedTeam?.name}`,
        description: notes || 'Gift request',
        request_data: requestData,
        status: 'pending',
        assigned_to: null,
        notes: notes,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
      }

      addMockData('specialRequests', newRequest)
      toast.success('Gift request submitted successfully')
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
                Send gifts
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Send to</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'individual'
                      ? 'bg-[#642DFC] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setMode('individual')}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'bulk'
                      ? 'bg-[#642DFC] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setMode('bulk')}
                >
                  Bulk
                </button>
              </div>
            </div>

            {/* Individual Mode */}
            {mode === 'individual' && (
              <>
                <EmployeeSelector
                  label="Send gifts to"
                  helpText="Select the team member to send gift"
                  value={selectedEmployee}
                  onChange={setSelectedEmployee}
                  employees={employees}
                  required
                />

                {selectedEmployee && (
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
                )}
              </>
            )}

            {/* Bulk Mode */}
            {mode === 'bulk' && (
              <>
                <TeamSelector
                  label="Send gifts to"
                  helpText="Select the team"
                  value={selectedTeam}
                  onChange={setSelectedTeam}
                  teams={MOCK_TEAMS}
                  required
                />

                {selectedTeam && teamMembers.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">List of team members</Label>
                    <div className="border border-[#DEE4EB] rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEE4EB]">
                          {teamMembers.map((member) => (
                            <tr key={member.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {member.first_name} {member.last_name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {member.personal_details?.address || '132/B, UDB Landmark, Tonk Road, Gopalpura, Jaipur, Rajasthan, India 302020'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3].map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`w-8 h-8 rounded-lg text-sm ${
                            page === 1
                              ? 'bg-[#642DFC] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

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
