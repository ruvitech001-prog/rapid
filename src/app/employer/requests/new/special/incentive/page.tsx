/**
 * Incentive Payment Form
 * Process bonus or incentive payments
 * Design matches Figma: node-id=5063-82341
 *
 * @route /employer/requests/new/special/incentive
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Plus, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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

interface BonusType {
  id: string
  label: string
  description: string
  enabled: boolean
  occurrence: 'one_time' | 'monthly'
  effectiveDate: string
  startDate: string
  endDate: string
  showEndDate: boolean
  occurrenceCount: string
}

const initialBonusTypes: BonusType[] = [
  {
    id: 'referral',
    label: 'Referral bonus',
    description: 'Refer your friends to join our team and earn a bonus for every successful hire!',
    enabled: false,
    occurrence: 'one_time',
    effectiveDate: '',
    startDate: '',
    endDate: '',
    showEndDate: false,
    occurrenceCount: '',
  },
  {
    id: 'performance',
    label: 'Performance bonus',
    description: 'Maximize your employees hard work with a performance bonus',
    enabled: false,
    occurrence: 'one_time',
    effectiveDate: '',
    startDate: '',
    endDate: '',
    showEndDate: false,
    occurrenceCount: '',
  },
  {
    id: 'holiday',
    label: 'Holiday bonus',
    description: 'Reward employees during holiday season',
    enabled: false,
    occurrence: 'one_time',
    effectiveDate: '',
    startDate: '',
    endDate: '',
    showEndDate: false,
    occurrenceCount: '',
  },
  {
    id: 'retention',
    label: 'Retention bonus',
    description: 'Incentivize key employees to stay with the company',
    enabled: false,
    occurrence: 'one_time',
    effectiveDate: '',
    startDate: '',
    endDate: '',
    showEndDate: false,
    occurrenceCount: '',
  },
  {
    id: 'other',
    label: 'Other bonus',
    description: 'Custom bonus type',
    enabled: false,
    occurrence: 'one_time',
    effectiveDate: '',
    startDate: '',
    endDate: '',
    showEndDate: false,
    occurrenceCount: '',
  },
]

const inputClass = "w-full h-12 px-4 py-3 rounded-md border border-[#DEE4EB] bg-white text-base focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export default function IncentivePage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [incentiveType, setIncentiveType] = useState('bonus')
  const [bonusTypes, setBonusTypes] = useState<BonusType[]>(initialBonusTypes)
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

  const updateBonusType = (id: string, updates: Partial<BonusType>) => {
    setBonusTypes(prev => prev.map(bt =>
      bt.id === id ? { ...bt, ...updates } : bt
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const enabledBonuses = bonusTypes.filter(bt => bt.enabled)
    if (!selectedEmployee || enabledBonuses.length === 0) {
      toast.error('Please select a team member and at least one bonus type')
      return
    }

    setIsSubmitting(true)

    try {
      const primaryBonus = enabledBonuses[0]
      const newRequest = {
        id: crypto.randomUUID(),
        company_id: company?.id || '',
        requester_id: employees[0]?.id || '',
        request_type: 'incentive_payment',
        title: `${primaryBonus?.label || 'Bonus'} - ${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        description: `${primaryBonus?.occurrence === 'one_time' ? 'One-time' : 'Monthly'} incentive`,
        request_data: {
          employee_id: selectedEmployee.id,
          employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
          incentive_type: incentiveType,
          bonuses: enabledBonuses.map(bt => ({
            type: bt.id,
            label: bt.label,
            occurrence: bt.occurrence,
            effective_date: bt.occurrence === 'one_time' ? bt.effectiveDate : null,
            start_date: bt.occurrence === 'monthly' ? bt.startDate : null,
            end_date: bt.occurrence === 'monthly' && bt.showEndDate ? bt.endDate : null,
            occurrence_count: bt.occurrence === 'monthly' ? bt.occurrenceCount : null,
          })),
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
    <div className="min-h-screen bg-white">
      <div className="p-6 max-w-[600px] mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4 text-gray-600" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-[#353B41] tracking-[0.15px]">Create a special request</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Request Type */}
          <div className="space-y-1">
            <Label className="text-base font-normal text-[#8593A3] tracking-[0.5px]">Request type</Label>
            <div className={`${inputClass} flex items-center text-[#353B41]`}>
              Incentive payment
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

          {/* Incentive Type */}
          <div className="space-y-1">
            <Label className="text-base font-normal text-[#8593A3] tracking-[0.5px]">Incentive type</Label>
            <Select value={incentiveType} onValueChange={setIncentiveType}>
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bonus">Bonus</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="allowance">Allowance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bonus Types with Toggles */}
          <div className="space-y-0">
            {bonusTypes.map((bonus) => (
              <div key={bonus.id}>
                {/* Bonus Type Header with Toggle */}
                <div className="py-4 border-b border-[#EFF2F5]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base font-normal text-[#505862] tracking-[0.5px]">{bonus.label}</p>
                      <p className="text-xs text-[#6A7682] tracking-[0.25px] mt-1">{bonus.description}</p>
                    </div>
                    <Switch
                      checked={bonus.enabled}
                      onCheckedChange={(checked) => updateBonusType(bonus.id, { enabled: checked })}
                      className="data-[state=checked]:bg-[#642DFC]"
                    />
                  </div>

                  {/* Expanded Options when Enabled */}
                  {bonus.enabled && (
                    <div className="mt-6 space-y-4">
                      {/* Incentive Occurrence */}
                      <div className="space-y-3">
                        <Label className="text-base font-normal text-[#8593A3] tracking-[0.5px]">
                          Incentive occurrence
                        </Label>
                        <div className="flex gap-16">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                bonus.occurrence === 'one_time'
                                  ? 'border-[#642DFC] bg-[#642DFC]'
                                  : 'border-[#642DFC] bg-white'
                              }`}
                              onClick={() => updateBonusType(bonus.id, { occurrence: 'one_time' })}
                            >
                              {bonus.occurrence === 'one_time' && (
                                <div className="w-3 h-3 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-base text-[#8593A3] tracking-[0.5px]">One time</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                bonus.occurrence === 'monthly'
                                  ? 'border-[#642DFC] bg-[#642DFC]'
                                  : 'border-[#642DFC] bg-white'
                              }`}
                              onClick={() => updateBonusType(bonus.id, { occurrence: 'monthly' })}
                            >
                              {bonus.occurrence === 'monthly' && (
                                <div className="w-3 h-3 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-base text-[#8593A3] tracking-[0.5px]">Monthly</span>
                          </label>
                        </div>
                      </div>

                      {/* One-time: Effective Date */}
                      {bonus.occurrence === 'one_time' && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Label className="text-base font-normal text-[#8593A3] tracking-[0.5px]">
                              Effective date
                            </Label>
                            <Info className="w-4 h-4 text-[#8593A3]" />
                          </div>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8593A3]" />
                            <Input
                              type="date"
                              className={`${inputClass} pl-12`}
                              value={bonus.effectiveDate}
                              onChange={(e) => updateBonusType(bonus.id, { effectiveDate: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Monthly: Start Date + End Date + Occurrence Count */}
                      {bonus.occurrence === 'monthly' && (
                        <>
                          <div className="flex gap-4 items-end">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-1">
                                <Label className="text-base font-normal text-[#8593A3] tracking-[0.5px]">
                                  Start date
                                </Label>
                                <Info className="w-4 h-4 text-[#8593A3]" />
                              </div>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8593A3]" />
                                <Input
                                  type="date"
                                  className={`${inputClass} pl-12`}
                                  value={bonus.startDate}
                                  onChange={(e) => updateBonusType(bonus.id, { startDate: e.target.value })}
                                />
                              </div>
                            </div>
                            {!bonus.showEndDate && (
                              <Button
                                type="button"
                                variant="ghost"
                                className="bg-[#EEEFFD] text-[#586AF5] hover:bg-[#E0D5FE] px-4 py-3 h-12 rounded-lg"
                                onClick={() => updateBonusType(bonus.id, { showEndDate: true })}
                              >
                                <Plus className="w-5 h-5 mr-2" />
                                Add end date
                              </Button>
                            )}
                          </div>

                          {bonus.showEndDate && (
                            <div className="space-y-1">
                              <Label className="text-base font-normal text-[#8593A3] tracking-[0.5px]">
                                End date
                              </Label>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8593A3]" />
                                <Input
                                  type="date"
                                  className={`${inputClass} pl-12`}
                                  value={bonus.endDate}
                                  onChange={(e) => updateBonusType(bonus.id, { endDate: e.target.value })}
                                />
                              </div>
                            </div>
                          )}

                          <div className="space-y-1">
                            <Input
                              type="number"
                              className={inputClass}
                              placeholder="Occurence count"
                              value={bonus.occurrenceCount}
                              onChange={(e) => updateBonusType(bonus.id, { occurrenceCount: e.target.value })}
                            />
                            <p className="text-xs text-[#6A7682] tracking-[0.25px]">
                              The bonus occurrence will end after this count
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Textarea
              className="min-h-[100px] rounded-md border border-[#DEE4EB] px-4 py-3 text-base"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <FileUpload label="Upload documents" value={files} onChange={setFiles} />

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-8">
            <Button
              type="button"
              variant="ghost"
              className="text-[#586AF5] hover:text-[#642DFC] hover:bg-transparent px-0"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#642DFC] hover:bg-[#5224D9] text-white px-4 py-3 h-10 rounded-lg text-xs font-semibold tracking-[0.75px]"
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
