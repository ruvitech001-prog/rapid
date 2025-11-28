/**
 * Contract Amendment Form
 * Salary revision, Stock options, and Other amendments
 *
 * @route /employer/requests/new/special/contract-amendment
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Edit2 } from 'lucide-react'
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
import {
  EmployeeSelector,
  FileUpload,
  type Employee,
  type UploadedFile,
} from '@/components/requests'
import { addMockData, getCurrentMockCompany, getMockData } from '@/lib/mock-data'

type AmendmentType = 'salary_revision' | 'stock_options' | 'others'
type VariablePayType = 'flat_rate' | 'percentage'
type SalaryStructure = 'rapid_recommended' | 'custom'

const STOCK_TYPES = [
  { value: 'iso', label: 'Incentive Stock Options (ISOs)' },
  { value: 'nso', label: 'Non-Qualified Stock Options (NSOs)' },
  { value: 'rsu', label: 'Restricted Stock Units (RSUs)' },
]

const VESTING_SCHEDULES = [
  { value: '4_year_1_cliff', label: '4 years with 1 year cliff' },
  { value: '4_year_monthly', label: '4 years monthly vesting' },
  { value: '3_year_1_cliff', label: '3 years with 1 year cliff' },
  { value: 'custom', label: 'Custom' },
]

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export default function ContractAmendmentPage() {
  const router = useRouter()
  const company = getCurrentMockCompany()

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [amendmentType, setAmendmentType] = useState<AmendmentType>('salary_revision')

  // Salary Revision fields
  const [effectiveDate, setEffectiveDate] = useState('')
  const [revisedDesignation, setRevisedDesignation] = useState('')
  const [revisedSalary, setRevisedSalary] = useState('')
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure>('rapid_recommended')
  const [specialPayout, setSpecialPayout] = useState('')
  const [_hasVariablePay, _setHasVariablePay] = useState(false)
  const [variablePayType, setVariablePayType] = useState<VariablePayType>('flat_rate')
  const [variablePayAmount, setVariablePayAmount] = useState('')

  // Stock Options fields
  const [stockType, setStockType] = useState('')
  const [vestingStartDate, setVestingStartDate] = useState('')
  const [numberOfOptions, setNumberOfOptions] = useState('')
  const [vestingSchedule, setVestingSchedule] = useState('')
  const [vestingExpirationDate, setVestingExpirationDate] = useState('')

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

    setIsSubmitting(true)

    try {
      let requestData: any = {
        employee_id: selectedEmployee.id,
        employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        amendment_type: amendmentType,
      }

      let title = ''
      let description = ''

      if (amendmentType === 'salary_revision') {
        requestData = {
          ...requestData,
          effective_date: effectiveDate,
          existing_designation: selectedEmployee.designation,
          revised_designation: revisedDesignation,
          existing_salary: 1200000,
          revised_salary: parseFloat(revisedSalary) || 0,
          salary_structure: salaryStructure,
          special_payout: specialPayout,
          variable_pay: _hasVariablePay ? {
            type: variablePayType,
            amount: variablePayAmount,
          } : null,
        }
        title = `Salary revision - ${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        description = `New salary: INR ${revisedSalary}`
      } else if (amendmentType === 'stock_options') {
        requestData = {
          ...requestData,
          stock_type: stockType,
          vesting_start_date: vestingStartDate,
          number_of_options: parseInt(numberOfOptions),
          vesting_schedule: vestingSchedule,
          vesting_expiration_date: vestingExpirationDate,
        }
        title = `Stock options - ${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        description = `${numberOfOptions} options granted`
      } else {
        requestData = {
          ...requestData,
          leave_policy: { days: 14, description: '7 sick leaves + 7 casual leaves' },
          holiday_calendar: { days: 17, description: '7 fixed + 10 floating' },
          notice_period: { days: 15 },
          medical_insurance: 'Rapid health plus',
        }
        title = `Contract amendment - ${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        description = 'Policy and benefits update'
      }

      const newRequest = {
        id: crypto.randomUUID(),
        company_id: company?.id || '',
        requester_id: employees[0]?.id || '',
        request_type: 'contract_amendment',
        title,
        description,
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
                Contract amendment
              </div>
            </div>

            <EmployeeSelector
              label="Team member"
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              employees={employees}
              required
            />

            {/* Amendment Type Selection */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Amendment type<span className="text-red-500">*</span></Label>
              <Select value={amendmentType} onValueChange={(v) => setAmendmentType(v as AmendmentType)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary_revision">Salary revision letter</SelectItem>
                  <SelectItem value="stock_options">Top up stock options</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Revision Fields */}
            {amendmentType === 'salary_revision' && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Effective date<span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input type="date" className={inputClass} value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-[#8593A3]">Please add a date that doesn't go back from today's date.</p>
                </div>

                {selectedEmployee && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">Existing designation</Label>
                        <div className="h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-gray-50 text-sm text-gray-900 flex items-center">
                          {selectedEmployee.designation || 'Associate UX Designer'}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">Revised designation</Label>
                        <Input className={inputClass} placeholder="UX Designer" value={revisedDesignation} onChange={(e) => setRevisedDesignation(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">Existing salary</Label>
                        <div className="h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-gray-50 text-sm text-gray-900 flex items-center">
                          INR 12,00,000
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">Revised salary<span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">INR</span>
                          <Input className={`${inputClass} pl-12`} placeholder="15,00,000" value={revisedSalary} onChange={(e) => setRevisedSalary(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">Applicable salary structure</Label>
                  <div className="flex gap-2">
                    <button type="button" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${salaryStructure === 'rapid_recommended' ? 'bg-[#642DFC] text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setSalaryStructure('rapid_recommended')}>
                      Rapid recommended
                    </button>
                    <button type="button" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${salaryStructure === 'custom' ? 'bg-[#642DFC] text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setSalaryStructure('custom')}>
                      Customize salary structure
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Special payout</Label>
                  <Textarea className="min-h-[60px] rounded-lg border border-[#DEE4EB]" placeholder="One time, paid at the end of 3 months from start date" value={specialPayout} onChange={(e) => setSpecialPayout(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">Annual variable compensation</Label>
                  <p className="text-sm text-gray-600">Annually variable pay amount</p>
                  <div className="flex gap-2">
                    <button type="button" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${variablePayType === 'flat_rate' ? 'bg-[#642DFC] text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setVariablePayType('flat_rate')}>
                      Flat rate
                    </button>
                    <button type="button" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${variablePayType === 'percentage' ? 'bg-[#642DFC] text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setVariablePayType('percentage')}>
                      Percentage
                    </button>
                  </div>
                  {variablePayType === 'percentage' && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-900">% of total annual salary</Label>
                      <Input type="number" className={inputClass} placeholder="10" value={variablePayAmount} onChange={(e) => setVariablePayAmount(e.target.value)} />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Stock Options Fields */}
            {amendmentType === 'stock_options' && (
              <>
                <div className="p-3 rounded-lg bg-gray-50 border border-[#DEE4EB]">
                  <p className="text-sm text-gray-600">Stock options</p>
                  <p className="text-xs text-[#8593A3]">On the basis of the default company settings</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Type of stocks</Label>
                  <Select value={stockType} onValueChange={setStockType}>
                    <SelectTrigger className={inputClass}><SelectValue placeholder="Select stock type" /></SelectTrigger>
                    <SelectContent>
                      {STOCK_TYPES.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Vesting start date</Label>
                  <div className="relative">
                    <Input type="date" className={inputClass} value={vestingStartDate} onChange={(e) => setVestingStartDate(e.target.value)} />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Number of options being granted</Label>
                  <Input type="number" className={inputClass} placeholder="1000" value={numberOfOptions} onChange={(e) => setNumberOfOptions(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Vesting schedule</Label>
                  <Select value={vestingSchedule} onValueChange={setVestingSchedule}>
                    <SelectTrigger className={inputClass}><SelectValue placeholder="Select schedule" /></SelectTrigger>
                    <SelectContent>
                      {VESTING_SCHEDULES.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-900">Vesting expiration date</Label>
                  <div className="relative">
                    <Input type="date" className={inputClass} value={vestingExpirationDate} onChange={(e) => setVestingExpirationDate(e.target.value)} />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </>
            )}

            {/* Others Fields */}
            {amendmentType === 'others' && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-[#DEE4EB]">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Leave policy</p>
                      <p className="text-xs text-[#8593A3]">On the basis of the default company settings</p>
                      <p className="text-sm text-gray-600 mt-1">14 days - 7 sick leaves + 7 casual leaves</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-[#642DFC]"><Edit2 className="w-4 h-4 mr-1" />Edit</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-[#DEE4EB]">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Holiday calendar</p>
                      <p className="text-xs text-[#8593A3]">On the basis of the default company settings</p>
                      <p className="text-sm text-gray-600 mt-1">17 days - 7 fixed holidays + 10 floating holidays</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-[#642DFC]"><Edit2 className="w-4 h-4 mr-1" />Edit</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-[#DEE4EB]">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notice period</p>
                      <p className="text-xs text-[#8593A3]">On the basis of the default company settings</p>
                      <p className="text-sm text-gray-600 mt-1">15 days</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-[#642DFC]"><Edit2 className="w-4 h-4 mr-1" />Edit</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-[#DEE4EB]">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Medical insurance</p>
                      <p className="text-xs text-[#8593A3]">On the basis of the default company settings</p>
                      <p className="text-sm text-gray-600 mt-1">Rapid health plus</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-900">Notes</Label>
              <Textarea className="min-h-[100px] rounded-lg border border-[#DEE4EB]" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <FileUpload label="Upload documents" value={files} onChange={setFiles} />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="bg-[#642DFC] hover:bg-[#5224D9]" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
