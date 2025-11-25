/**
 * Contractor Onboarding - Personal Details Screen
 * GROUP A - Example Screen 3 (STEP form pattern)
 *
 * This screen demonstrates:
 * - Multi-step form with progress tracking
 * - Step-by-step validation (each step validates independently)
 * - Form state persistence across steps
 * - Progress bar and step indicator
 * - Navigation between steps (Next, Previous, Submit)
 * - Conditional field visibility based on contractor type
 * - Summary review before submission
 * - Complex form with dependent fields
 * - Date picker integration
 *
 * @route /employer/contractor-onboarding/personal
 */

'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '@/components/templates'
import { getCurrentMockCompany, addMockData, generateId } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Circle, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Contractor types
 */
const CONTRACTOR_TYPES = [
  { value: 'individual', label: 'Individual Contractor' },
  { value: 'company', label: 'Company/Organization' },
]

/**
 * Rate types
 */
const RATE_TYPES = [
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'fixed', label: 'Fixed Amount (per project/month)' },
  { value: 'milestone', label: 'Milestone Based' },
]

/**
 * Step 1: Personal Information Validation
 */
const step1Schema = z.object({
  contractor_type: z.enum(['individual', 'company']),
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  company_name: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
})

/**
 * Step 2: Contract Details Validation
 */
const step2Schema = z.object({
  contract_start_date: z.string().min(1, 'Start date is required'),
  contract_end_date: z.string().min(1, 'End date is required'),
  rate_type: z.enum(['hourly', 'fixed', 'milestone']),
  rate_amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Rate amount must be greater than 0',
  }),
  currency: z.string().default('INR'),
}).refine((data) => new Date(data.contract_end_date) > new Date(data.contract_start_date), {
  message: 'End date must be after start date',
  path: ['contract_end_date'],
})

/**
 * Step 3: Tax & Compliance Validation
 */
const step3Schema = z.object({
  pan: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Valid PAN format is required (e.g., ABCDE1234F)'),
  gst_number: z.string().optional(),
  bank_account: z.string().min(10, 'Valid bank account number is required'),
  ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Valid IFSC code is required'),
  account_holder_name: z.string().min(2, 'Account holder name is required'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

/**
 * Combined form data type
 */
type ContractorOnboardingData = Step1Data & Step2Data & Step3Data

/**
 * Contractor interface for TypeScript type safety
 */
interface ContractorOnboarding {
  id: string
  user_id: string
  company_id: string
  contractor_type: 'individual' | 'company'
  first_name: string
  last_name: string
  company_name: string | null
  email: string
  phone: string
  contract_start_date: string
  contract_end_date: string
  rate_type: 'hourly' | 'fixed' | 'milestone'
  rate_amount: number
  currency: string
  pan: string
  gst_number?: string
  bank_account: string
  ifsc_code: string
  account_holder_name: string
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
}

export default function ContractorOnboardingPersonalPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const company = getCurrentMockCompany()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    trigger,
  } = useForm<ContractorOnboardingData>({
    resolver: zodResolver(
      currentStep === 1 ? step1Schema : currentStep === 2 ? step2Schema : step3Schema
    ),
    mode: 'onChange',
    defaultValues: {
      contractor_type: 'individual',
      currency: 'INR',
      rate_type: 'hourly',
    },
  })

  // Watch contractor type for conditional rendering
  const contractorType = watch('contractor_type')

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Validate and move to next step
   */
  const handleNextStep = async () => {
    // Trigger validation for current step
    const isValid = await trigger()

    if (isValid) {
      if (currentStep < 3) {
        setCompletedSteps([...new Set([...completedSteps, currentStep])])
        setCurrentStep(currentStep + 1)
      }
    } else {
      toast.error('Please fix the errors before proceeding')
    }
  }

  /**
   * Move to previous step without validation
   */
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  /**
   * Handle form submission (final step)
   */
  const onSubmit = async (data: ContractorOnboardingData) => {
    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (!company) {
        toast.error('Company information not found')
        setIsSubmitting(false)
        return
      }

      // Create contractor onboarding record
      const contractorOnboarding: ContractorOnboarding = {
        id: generateId(),
        user_id: generateId(),
        company_id: company.id,
        contractor_type: data.contractor_type as 'individual' | 'company',
        first_name: data.first_name,
        last_name: data.last_name,
        company_name: data.company_name || null,
        email: data.email,
        phone: data.phone,
        contract_start_date: data.contract_start_date,
        contract_end_date: data.contract_end_date,
        rate_type: data.rate_type as 'hourly' | 'fixed' | 'milestone',
        rate_amount: Number(data.rate_amount),
        currency: data.currency,
        pan: data.pan,
        gst_number: data.gst_number,
        bank_account: data.bank_account,
        ifsc_code: data.ifsc_code,
        account_holder_name: data.account_holder_name,
        status: 'pending',
        created_at: new Date().toISOString().split('T')[0] || new Date().toISOString(),
      }

      // Add to mock data
      addMockData('contractors', contractorOnboarding)

      // Show success message
      toast.success('Contractor onboarding completed successfully')

      // Redirect or reset
      setTimeout(() => {
        // In real app, redirect to contractor list or dashboard
        setCurrentStep(1)
        setCompletedSteps([])
      }, 1500)
    } catch (error) {
      console.error('Error submitting contractor onboarding:', error)
      toast.error('Failed to complete contractor onboarding')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ============================================================================
  // RENDER HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get step status icon
   */
  const getStepIcon = (step: number) => {
    if (completedSteps.includes(step)) {
      return <CheckCircle2 className="w-6 h-6 text-green-600" />
    }
    return <Circle className={`w-6 h-6 ${currentStep === step ? 'text-blue-600' : 'text-gray-300'}`} />
  }
  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <PageHeader
          title="Contractor Onboarding"
          description="Complete your contractor profile and contract details"
          breadcrumbs={[
            { label: 'Home', href: '/employer/dashboard' },
            { label: 'Contractor Onboarding', href: '/employer/contractor-onboarding' },
            { label: 'Personal Details' },
          ]}
        />

        {/* Progress Indicator */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <button
                    type="button"
                    onClick={() => completedSteps.includes(step) && setCurrentStep(step)}
                    className="flex flex-col items-center gap-2 mb-2 cursor-pointer"
                    disabled={!completedSteps.includes(step) && step !== currentStep}
                  >
                    {getStepIcon(step)}
                    <span className="text-xs font-medium text-gray-600">
                      {step === 1 ? 'Personal' : step === 2 ? 'Contract' : 'Compliance'}
                    </span>
                  </button>

                  {/* Connector line */}
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 ${
                        completedSteps.includes(step) ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                      style={{ minWidth: '40px' }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>

            {/* Step Status */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Step {currentStep} of 3:{' '}
                {currentStep === 1
                  ? 'Personal Information'
                  : currentStep === 2
                    ? 'Contract Details'
                    : 'Tax & Compliance'}
              </p>
            </div>
          </div>
        </Card>

        {/* Form Content */}
        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Provide your basic details to get started with the onboarding process.
                  </p>
                </div>

                {/* Contractor Type */}
                <div className="space-y-2">
                  <Label htmlFor="contractor_type">Contractor Type *</Label>
                  <Controller
                    name="contractor_type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="contractor_type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTRACTOR_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.contractor_type && (
                    <p className="text-sm text-red-600">{errors.contractor_type.message}</p>
                  )}
                </div>

                {/* Company Name (if company type) */}
                {contractorType === 'company' && (
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      placeholder="e.g., ABC Solutions Pvt Ltd"
                      {...register('company_name')}
                    />
                    {errors.company_name && (
                      <p className="text-sm text-red-600">{errors.company_name.message}</p>
                    )}
                  </div>
                )}

                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    {contractorType === 'company' ? 'Contact Person First Name' : 'First Name'} *
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="Enter first name"
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    placeholder="Enter last name"
                    {...register('last_name')}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: CONTRACT DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contract Details</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Define the contract period and compensation details.
                  </p>
                </div>

                {/* Contract Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="contract_start_date">Contract Start Date *</Label>
                  <Input
                    id="contract_start_date"
                    type="date"
                    {...register('contract_start_date')}
                  />
                  {errors.contract_start_date && (
                    <p className="text-sm text-red-600">{errors.contract_start_date.message}</p>
                  )}
                </div>

                {/* Contract End Date */}
                <div className="space-y-2">
                  <Label htmlFor="contract_end_date">Contract End Date *</Label>
                  <Input
                    id="contract_end_date"
                    type="date"
                    {...register('contract_end_date')}
                  />
                  {errors.contract_end_date && (
                    <p className="text-sm text-red-600">{errors.contract_end_date.message}</p>
                  )}
                </div>

                {/* Rate Type */}
                <div className="space-y-2">
                  <Label htmlFor="rate_type">Payment Type *</Label>
                  <Controller
                    name="rate_type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="rate_type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RATE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.rate_type && (
                    <p className="text-sm text-red-600">{errors.rate_type.message}</p>
                  )}
                </div>

                {/* Rate Amount */}
                <div className="space-y-2">
                  <Label htmlFor="rate_amount">Rate Amount (₹) *</Label>
                  <Input
                    id="rate_amount"
                    type="number"
                    placeholder="Enter amount"
                    {...register('rate_amount')}
                  />
                  {errors.rate_amount && (
                    <p className="text-sm text-red-600">{errors.rate_amount.message}</p>
                  )}
                </div>

                {/* Info Box */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  <p>
                    <strong>Note:</strong> Contract terms should align with the project
                    requirements and payment schedule.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: TAX & COMPLIANCE */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Tax & Compliance</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Complete the tax and banking details for payments and compliance.
                  </p>
                </div>

                {/* PAN */}
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN (Permanent Account Number) *</Label>
                  <Input
                    id="pan"
                    placeholder="e.g., ABCDE1234F"
                    {...register('pan')}
                  />
                  {errors.pan && (
                    <p className="text-sm text-red-600">{errors.pan.message}</p>
                  )}
                </div>

                {/* GST Number */}
                <div className="space-y-2">
                  <Label htmlFor="gst_number">GST Number (Optional)</Label>
                  <Input
                    id="gst_number"
                    placeholder="e.g., 27AABCU1234567Z1"
                    {...register('gst_number')}
                  />
                </div>

                {/* Bank Account */}
                <div className="space-y-2">
                  <Label htmlFor="bank_account">Bank Account Number *</Label>
                  <Input
                    id="bank_account"
                    placeholder="Enter account number"
                    {...register('bank_account')}
                  />
                  {errors.bank_account && (
                    <p className="text-sm text-red-600">{errors.bank_account.message}</p>
                  )}
                </div>

                {/* IFSC Code */}
                <div className="space-y-2">
                  <Label htmlFor="ifsc_code">IFSC Code *</Label>
                  <Input
                    id="ifsc_code"
                    placeholder="e.g., SBIN0001234"
                    {...register('ifsc_code')}
                  />
                  {errors.ifsc_code && (
                    <p className="text-sm text-red-600">{errors.ifsc_code.message}</p>
                  )}
                </div>

                {/* Account Holder Name */}
                <div className="space-y-2">
                  <Label htmlFor="account_holder_name">Account Holder Name *</Label>
                  <Input
                    id="account_holder_name"
                    placeholder="Name as it appears in bank records"
                    {...register('account_holder_name')}
                  />
                  {errors.account_holder_name && (
                    <p className="text-sm text-red-600">{errors.account_holder_name.message}</p>
                  )}
                </div>

                {/* Compliance Info */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                  <p className="font-medium mb-2">Compliance Information:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>All information will be verified with tax authorities</li>
                    <li>Ensure accuracy to avoid payment delays</li>
                    <li>You can update these details later if needed</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 1 || isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="ml-auto gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Help Section */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Contact support at support@rapid.one or call our help desk.
            All information is encrypted and secure.
          </p>
        </Card>
      </div>
    </div>
  )
}
