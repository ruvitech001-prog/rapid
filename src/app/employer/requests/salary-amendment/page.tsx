'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { PageHeader, FormWrapper } from '@/components/templates'
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
import { TrendingUp, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { useCreateSpecialRequest } from '@/lib/hooks'

const AMENDMENT_TYPES = [
  { value: 'increment', label: 'Salary Increment' },
  { value: 'adjustment', label: 'Salary Adjustment' },
  { value: 'promotion', label: 'Promotion with Raise' },
  { value: 'restructure', label: 'Salary Structure Restructure' },
  { value: 'retention', label: 'Retention Bonus / Amendment' },
]

const AMENDMENT_FREQUENCY = [
  { value: 'immediate', label: 'Effective Immediately' },
  { value: 'next_month', label: 'Effective Next Month' },
  { value: 'specific_date', label: 'Effective from Specific Date' },
  { value: 'after_probation', label: 'After Probation Period' },
]

const salaryAmendmentSchema = z.object({
  employee_name: z.string()
    .min(2, 'Employee name must be at least 2 characters')
    .max(100, 'Employee name must be less than 100 characters'),
  employee_id: z.string()
    .min(3, 'Employee ID is required'),
  amendment_type: z.enum(['increment', 'adjustment', 'promotion', 'restructure', 'retention'], {
    errorMap: () => ({ message: 'Please select an amendment type' }),
  }),
  current_salary: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Please enter a valid current salary amount',
    }),
  new_salary: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Please enter a valid new salary amount',
    }),
  amendment_reason: z.string()
    .min(10, 'Please provide reason for amendment (min 10 characters)')
    .max(500, 'Reason must be less than 500 characters'),
  frequency: z.enum(['immediate', 'next_month', 'specific_date', 'after_probation'], {
    errorMap: () => ({ message: 'Please select effective date' }),
  }),
  effective_date: z.string().optional(),
  impact_analysis: z.string().optional(),
  approver_notes: z.string().optional(),
})

type SalaryAmendmentFormData = z.infer<typeof salaryAmendmentSchema>

export default function SalaryAmendmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.id
  const companyId = user?.companyId

  const [expandedSections, setExpandedSections] = useState({
    employee: true,
    salary: true,
    effectiveDate: true,
    justification: false,
  })

  const createRequest = useCreateSpecialRequest()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<SalaryAmendmentFormData>({
    resolver: zodResolver(salaryAmendmentSchema),
    defaultValues: {
      amendment_type: 'increment',
      frequency: 'next_month',
      current_salary: '',
      new_salary: '',
    },
  })

  const currentSalary = watch('current_salary')
  const newSalary = watch('new_salary')
  const frequency = watch('frequency')

  const salaryIncrease = newSalary && currentSalary ? Number(newSalary) - Number(currentSalary) : 0
  const salaryIncreasePercentage = currentSalary && salaryIncrease ? (salaryIncrease / Number(currentSalary)) * 100 : 0

  const onSubmit = async (data: SalaryAmendmentFormData) => {
    if (!userId || !companyId) {
      toast.error('User or company information not available')
      return
    }

    try {
      await createRequest.mutateAsync({
        companyId: companyId,
        requesterId: userId,
        requesterName: user?.email || 'Unknown',
        requestType: 'salary_amendment',
        title: `Salary Amendment - ${data.employee_name}`,
        description: data.amendment_reason,
        requestData: {
          employee_name: data.employee_name,
          employee_id: data.employee_id,
          amendment_type: data.amendment_type,
          current_salary: Number(data.current_salary),
          new_salary: Number(data.new_salary),
          salary_increase: salaryIncrease,
          salary_increase_percentage: Math.round(salaryIncreasePercentage * 100) / 100,
          amendment_reason: data.amendment_reason,
          frequency: data.frequency,
          effective_date: data.effective_date,
          impact_analysis: data.impact_analysis,
          approver_notes: data.approver_notes,
        },
        priority: 'high',
      })

      reset()
      toast.success(`Salary amendment for ${data.employee_name} submitted successfully`)
      router.push('/employer/requests')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit salary amendment')
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const isSubmitting = createRequest.isPending

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Request Salary Amendment"
        description="Submit a request for salary adjustment or amendment"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Requests', href: '/employer/requests' },
          { label: 'Salary Amendment' },
        ]}
      />

      <FormWrapper
        title="New Salary Amendment Request"
        description="Provide details about the proposed salary amendment. Your request will be reviewed by the HR team."
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Submitting...' : 'Submit Request'}
        isLoading={isSubmitting}
      >
        {/* Employee Information Section */}
        <div className="border-b pb-6">
          <button
            type="button"
            onClick={() => toggleSection('employee')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>1. Employee Information</span>
            <span>{expandedSections.employee ? '▼' : '▶'}</span>
          </button>

          {expandedSections.employee && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="employee_name">Employee Name *</Label>
                <Input
                  id="employee_name"
                  placeholder="e.g., John Smith"
                  {...register('employee_name')}
                />
                {errors.employee_name && (
                  <p className="text-sm text-red-600">{errors.employee_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee ID *</Label>
                <Input
                  id="employee_id"
                  placeholder="e.g., EMP001"
                  {...register('employee_id')}
                />
                {errors.employee_id && (
                  <p className="text-sm text-red-600">{errors.employee_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amendment_type">Amendment Type *</Label>
                <Controller
                  name="amendment_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="amendment_type">
                        <SelectValue placeholder="Select amendment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {AMENDMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.amendment_type && (
                  <p className="text-sm text-red-600">{errors.amendment_type.message}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Salary Information Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('salary')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>2. Salary Information</span>
            <span>{expandedSections.salary ? '▼' : '▶'}</span>
          </button>

          {expandedSections.salary && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="current_salary">Current Salary (₹) *</Label>
                <Input
                  id="current_salary"
                  type="number"
                  placeholder="e.g., 500000"
                  {...register('current_salary')}
                />
                {errors.current_salary && (
                  <p className="text-sm text-red-600">{errors.current_salary.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_salary">New Salary (₹) *</Label>
                <Input
                  id="new_salary"
                  type="number"
                  placeholder="e.g., 550000"
                  {...register('new_salary')}
                />
                {errors.new_salary && (
                  <p className="text-sm text-red-600">{errors.new_salary.message}</p>
                )}
              </div>

              {currentSalary && newSalary && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <p className="font-semibold text-blue-900">Salary Change Summary</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Increase Amount</p>
                      <p className="font-bold text-blue-900">₹{salaryIncrease.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Increase %</p>
                      <p className="font-bold text-blue-900">{salaryIncreasePercentage.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-blue-700">New Annual</p>
                      <p className="font-bold text-blue-900">₹{(Number(newSalary) * 12).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Effective Date Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('effectiveDate')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>3. Effective Date</span>
            <span>{expandedSections.effectiveDate ? '▼' : '▶'}</span>
          </button>

          {expandedSections.effectiveDate && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Effective From *</Label>
                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select effective date" />
                      </SelectTrigger>
                      <SelectContent>
                        {AMENDMENT_FREQUENCY.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.frequency && (
                  <p className="text-sm text-red-600">{errors.frequency.message}</p>
                )}
              </div>

              {frequency === 'specific_date' && (
                <div className="space-y-2">
                  <Label htmlFor="effective_date">Effective Date</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    {...register('effective_date')}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Justification Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('justification')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>4. Justification & Notes (Optional)</span>
            <span>{expandedSections.justification ? '▼' : '▶'}</span>
          </button>

          {expandedSections.justification && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="amendment_reason">Reason for Amendment *</Label>
                <Textarea
                  id="amendment_reason"
                  placeholder="Explain the reason for this salary amendment. Include performance metrics, market factors, or other relevant information."
                  className="min-h-28"
                  {...register('amendment_reason')}
                />
                {errors.amendment_reason && (
                  <p className="text-sm text-red-600">{errors.amendment_reason.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="impact_analysis">Budget Impact Analysis</Label>
                <Textarea
                  id="impact_analysis"
                  placeholder="Describe the financial impact on the department/company budget"
                  className="min-h-20"
                  {...register('impact_analysis')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="approver_notes">Internal Notes for Approver</Label>
                <Textarea
                  id="approver_notes"
                  placeholder="Any additional information for the approval team"
                  className="min-h-20"
                  {...register('approver_notes')}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-2">Important Information:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Salary amendments require approval from HR and Finance teams</li>
                <li>Changes are effective from the specified date</li>
                <li>All salary amendments are recorded for compliance and audit purposes</li>
                <li>Retroactive changes must be justified and approved separately</li>
              </ul>
            </div>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}
