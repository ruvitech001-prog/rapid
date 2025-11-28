/**
 * Office Space Rental Form
 * Request via WeWork or Custom deal
 *
 * @route /employer/requests/new/special/office-space
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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

type RentingMode = 'wework' | 'custom'

const CITIES = ['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata']
const LOCATIONS = ['Sitapura', 'Malviya Nagar', 'C-Scheme', 'Vaishali Nagar', 'Mansarovar']
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP']

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export default function OfficeSpacePage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  const [mode, setMode] = useState<RentingMode>('wework')

  // WeWork fields
  const [city, setCity] = useState('')
  const [location, setLocation] = useState('')
  const [seats, setSeats] = useState('')

  // Custom deal fields
  const [description, setDescription] = useState('')
  const [customLocation, setCustomLocation] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [amount, setAmount] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'wework' && (!city || !location || !seats)) {
      toast.error('Please fill in all required fields')
      return
    }

    if (mode === 'custom' && (!customLocation || !amount || !contactName)) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const employees = getMockData('employees')
      const requestData = mode === 'wework'
        ? {
            mode: 'wework',
            city,
            location,
            seats: parseInt(seats),
          }
        : {
            mode: 'custom',
            description,
            location: customLocation,
            currency,
            amount: parseFloat(amount),
            contact_name: contactName,
            contact_phone: contactPhone,
            contact_email: contactEmail,
          }

      const newRequest = {
        id: crypto.randomUUID(),
        company_id: company?.id || '',
        requester_id: employees[0]?.id || '',
        request_type: 'office_space',
        title: mode === 'wework'
          ? `WeWork office - ${city}, ${location}`
          : `Custom office space - ${customLocation}`,
        description: mode === 'wework'
          ? `${seats} seats at ${location}, ${city}`
          : description,
        request_data: requestData,
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
                Renting an office space
              </div>
            </div>

            {/* Mode Selection */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Renting via</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'wework'
                      ? 'bg-[#642DFC] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setMode('wework')}
                >
                  WeWork
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'custom'
                      ? 'bg-[#642DFC] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setMode('custom')}
                >
                  Custom deal
                </button>
              </div>
            </div>

            {/* WeWork Mode */}
            {mode === 'wework' && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">City<span className="text-red-500">*</span></Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Location<span className="text-red-500">*</span></Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Number of seats<span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    className={inputClass}
                    placeholder="10"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Custom Deal Mode */}
            {mode === 'custom' && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Description<span className="text-red-500">*</span></Label>
                  <Textarea
                    className="min-h-[80px] rounded-lg border border-[#DEE4EB]"
                    placeholder="Describe the office space requirements..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Location<span className="text-red-500">*</span></Label>
                  <Input
                    className={inputClass}
                    placeholder="Enter location"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-900">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-900">Amount<span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      className={inputClass}
                      placeholder="50,000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Contact person's name<span className="text-red-500">*</span></Label>
                  <Input
                    className={inputClass}
                    placeholder="Rakesh Gaur"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-900">Phone number</Label>
                    <Input
                      className={inputClass}
                      placeholder="+91 9898989898"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-900">Email address</Label>
                    <Input
                      type="email"
                      className={inputClass}
                      placeholder="email@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

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
