/**
 * Policies Settings Screen
 * GROUP B - Screen 11 (Multi-section collapsible FORM pattern)
 *
 * This screen demonstrates:
 * - Multi-section form with collapsible sections
 * - Leave policies configuration
 * - Expense policies
 * - Notice periods
 * - Form state management
 *
 * @route /employer/settings/policies
 */

'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, FormWrapper } from '@/components/templates'
import { getCurrentMockCompany, addMockData, generateId } from '@/lib/mock-data'
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
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const policiesSchema = z.object({
  policy_name: z.string().min(2, 'Policy name required'),
  annual_leave: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Valid days required'),
  sick_leave: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Valid days required'),
  casual_leave: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Valid days required'),
  maternity_leave: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Valid days required'),
  expense_limit_monthly: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valid amount required'),
  notice_period_days: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valid days required'),
  leave_carry_forward: z.enum(['allowed', 'not_allowed']),
  leave_encashment: z.enum(['allowed', 'not_allowed']),
  policy_description: z.string().optional(),
})

type PoliciesFormData = z.infer<typeof policiesSchema>

interface PolicyConfig {
  id: string
  company_id: string
  policy_name: string
  leave_policies: {
    annual_leave: number
    sick_leave: number
    casual_leave: number
    maternity_leave: number
    carry_forward: boolean
    encashment: boolean
  }
  expense_policies: {
    monthly_limit: number
  }
  notice_period: number
  description?: string
  created_at: string
}

export default function PoliciesSettingsPage() {
  const company = getCurrentMockCompany()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    leave: true,
    expense: false,
    notice: false,
    description: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<PoliciesFormData>({
    resolver: zodResolver(policiesSchema),
    defaultValues: {
      policy_name: '',
      annual_leave: '20',
      sick_leave: '10',
      casual_leave: '8',
      maternity_leave: '90',
      expense_limit_monthly: '10000',
      notice_period_days: '30',
      leave_carry_forward: 'allowed',
      leave_encashment: 'allowed',
    },
  })

  const onSubmit = async (data: PoliciesFormData) => {
    try {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!company) {
        toast.error('Company information not found')
        return
      }

      const today = new Date().toISOString().split('T')[0] || new Date().toISOString()
      const newPolicy: PolicyConfig = {
        id: generateId(),
        company_id: company.id,
        policy_name: data.policy_name,
        leave_policies: {
          annual_leave: Number(data.annual_leave),
          sick_leave: Number(data.sick_leave),
          casual_leave: Number(data.casual_leave),
          maternity_leave: Number(data.maternity_leave),
          carry_forward: data.leave_carry_forward === 'allowed',
          encashment: data.leave_encashment === 'allowed',
        },
        expense_policies: {
          monthly_limit: Number(data.expense_limit_monthly),
        },
        notice_period: Number(data.notice_period_days),
        description: data.policy_description,
        created_at: today,
      }

      addMockData('policies', newPolicy)
      reset()
      toast.success(`Policy "${data.policy_name}" saved successfully`)
    } catch (error) {
      console.error('Error saving policy:', error)
      toast.error('Failed to save policy')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Company Policies"
        description="Configure leave, expense, and other company policies"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Settings', href: '/employer/settings' },
          { label: 'Policies' },
        ]}
      />

      <FormWrapper
        title="Edit Company Policies"
        description="Define organizational policies for leaves, expenses, and notice periods"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Saving...' : 'Save Policies'}
        isLoading={isSubmitting}
      >
        {/* Policy Name */}
        <div className="space-y-2 pb-6 border-b">
          <Label htmlFor="policy_name">Policy Name *</Label>
          <Input
            id="policy_name"
            placeholder="e.g., Annual Policy 2024"
            {...register('policy_name')}
          />
          {errors.policy_name && (
            <p className="text-sm text-red-600">{errors.policy_name.message}</p>
          )}
        </div>

        {/* Leave Policies Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('leave')}
            className="w-full text-left font-semibold text-lg mb-4 flex justify-between hover:text-blue-600"
          >
            <span>1. Leave Policies</span>
            <span>{expandedSections.leave ? '▼' : '▶'}</span>
          </button>

          {expandedSections.leave && (
            <div className="space-y-4 ml-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annual_leave">Annual Leave (days) *</Label>
                  <Input id="annual_leave" type="number" {...register('annual_leave')} />
                  {errors.annual_leave && (
                    <p className="text-sm text-red-600">{errors.annual_leave.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sick_leave">Sick Leave (days) *</Label>
                  <Input id="sick_leave" type="number" {...register('sick_leave')} />
                  {errors.sick_leave && (
                    <p className="text-sm text-red-600">{errors.sick_leave.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="casual_leave">Casual Leave (days) *</Label>
                  <Input id="casual_leave" type="number" {...register('casual_leave')} />
                  {errors.casual_leave && (
                    <p className="text-sm text-red-600">{errors.casual_leave.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maternity_leave">Maternity Leave (days) *</Label>
                  <Input id="maternity_leave" type="number" {...register('maternity_leave')} />
                  {errors.maternity_leave && (
                    <p className="text-sm text-red-600">{errors.maternity_leave.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leave_carry_forward">Leave Carry Forward Allowed *</Label>
                  <Controller
                    name="leave_carry_forward"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="leave_carry_forward">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="allowed">Allowed</SelectItem>
                          <SelectItem value="not_allowed">Not Allowed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leave_encashment">Leave Encashment Allowed *</Label>
                  <Controller
                    name="leave_encashment"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="leave_encashment">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="allowed">Allowed</SelectItem>
                          <SelectItem value="not_allowed">Not Allowed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Expense Policies Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('expense')}
            className="w-full text-left font-semibold text-lg mb-4 flex justify-between hover:text-blue-600"
          >
            <span>2. Expense Policies</span>
            <span>{expandedSections.expense ? '▼' : '▶'}</span>
          </button>

          {expandedSections.expense && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="expense_limit_monthly">Monthly Expense Limit (₹) *</Label>
                <Input
                  id="expense_limit_monthly"
                  type="number"
                  placeholder="10000"
                  {...register('expense_limit_monthly')}
                />
                {errors.expense_limit_monthly && (
                  <p className="text-sm text-red-600">{errors.expense_limit_monthly.message}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notice Period Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('notice')}
            className="w-full text-left font-semibold text-lg mb-4 flex justify-between hover:text-blue-600"
          >
            <span>3. Notice Period</span>
            <span>{expandedSections.notice ? '▼' : '▶'}</span>
          </button>

          {expandedSections.notice && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="notice_period_days">Notice Period (days) *</Label>
                <Input
                  id="notice_period_days"
                  type="number"
                  placeholder="30"
                  {...register('notice_period_days')}
                />
                {errors.notice_period_days && (
                  <p className="text-sm text-red-600">{errors.notice_period_days.message}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('description')}
            className="w-full text-left font-semibold text-lg mb-4 flex justify-between hover:text-blue-600"
          >
            <span>4. Policy Description (Optional)</span>
            <span>{expandedSections.description ? '▼' : '▶'}</span>
          </button>

          {expandedSections.description && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="policy_description">Additional Details</Label>
                <Textarea
                  id="policy_description"
                  placeholder="Any additional details about the policy..."
                  className="min-h-24"
                  {...register('policy_description')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Note:</p>
              <p>These policies apply to all employees. Changes are effective immediately for new policies and from the specified date for existing employees.</p>
            </div>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}
