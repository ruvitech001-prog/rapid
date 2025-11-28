/**
 * Contractor Onboarding - Tax & Compliance Screen
 * GROUP A - Screen 6 (STEP form pattern)
 *
 * This screen demonstrates:
 * - Multi-step form with step-based validation
 * - Tax identification number validation (PAN, GST, TDS)
 * - Bank account and IFSC code validation
 * - Multi-section form with financial information
 * - Conditional field visibility
 * - Form data persistence
 * - Progress tracking
 *
 * @route /employer/contractor-onboarding/tax
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
import { Textarea as _Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Tax document types
 */
const TAX_DOCUMENT_TYPES = [
  { value: 'pan', label: 'PAN (Permanent Account Number)' },
  { value: 'aadhar', label: 'Aadhar' },
  { value: 'passport', label: 'Passport' },
  { value: 'dl', label: 'Driving License' },
]

/**
 * GST registration options
 */
const GST_OPTIONS = [
  { value: 'registered', label: 'GST Registered' },
  { value: 'not_registered', label: 'Not Registered' },
  { value: 'applied', label: 'Application in Progress' },
]

/**
 * Step 1: Tax Identification Validation
 */
const step1Schema = z.object({
  primary_tax_doc: z.enum(['pan', 'aadhar', 'passport', 'dl']),
  tax_doc_number: z.string().min(5, 'Valid tax document number is required'),
  pan: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Valid PAN format required (e.g., ABCDE1234F)'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(2, 'Nationality is required'),
})

/**
 * Step 2: GST & TDS Information Validation
 */
const step2Schema = z.object({
  gst_registration_status: z.enum(['registered', 'not_registered', 'applied']),
  gst_number: z.string().optional(),
  tds_applicable: z.enum(['yes', 'no']),
  tds_section: z.string().optional(),
  tds_rate: z.string().optional(),
})

/**
 * Step 3: Bank Account Details Validation
 */
const step3Schema = z.object({
  bank_name: z.string().min(2, 'Bank name is required'),
  account_type: z.enum(['savings', 'current', 'other']),
  account_number: z.string().min(10, 'Valid account number is required'),
  ifsc_code: z.string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Valid IFSC code required'),
  account_holder_name: z.string().min(2, 'Account holder name is required'),
  account_holder_pan: z.string().optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

/**
 * Combined type for all steps
 */
type FormData = Step1Data & Step2Data & Step3Data

export default function ContractorOnboardingTaxPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const company = getCurrentMockCompany()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    step1: true,
    step2: true,
    step3: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(
      currentStep === 1 ? step1Schema : currentStep === 2 ? step2Schema : step3Schema
    ),
    mode: 'onBlur',
    defaultValues: {
      gst_registration_status: 'not_registered',
      tds_applicable: 'no',
      account_type: 'savings',
    },
  })

  const gstStatus = watch('gst_registration_status')
  const tdsApplicable = watch('tds_applicable')
  const primaryTaxDoc = watch('primary_tax_doc')

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Move to next step after validation
   */
  const handleNextStep = async () => {
    const isValid = await trigger()
    if (isValid) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  /**
   * Move to previous step
   */
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  /**
   * Jump to specific step if already completed
   */
  const handleJumpToStep = (step: number) => {
    if (completedSteps.includes(step) || step < currentStep) {
      setCurrentStep(step)
    }
  }

  /**
   * Submit the entire form
   */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!company) {
        toast.error('Company information not found')
        return
      }

      // Create contractor tax onboarding record
      const today = new Date().toISOString().split('T')[0] || new Date().toISOString()
      const contractorTaxData = {
        id: generateId(),
        company_id: company.id,
        contractor_id: generateId(),
        onboarding_stage: 'tax_compliance',
        primary_tax_document: data.primary_tax_doc,
        tax_document_number: data.tax_doc_number,
        pan: data.pan,
        gst_status: data.gst_registration_status,
        gst_number: data.gst_number,
        tds_applicable: data.tds_applicable === 'yes',
        tds_section: data.tds_section,
        bank_name: data.bank_name,
        account_type: data.account_type,
        account_number: data.account_number,
        ifsc_code: data.ifsc_code,
        account_holder_name: data.account_holder_name,
        status: 'pending_review',
        created_at: today,
        updated_at: today,
      }

      // Add to mock data
      addMockData('contractors', contractorTaxData)

      // Reset form
      reset()
      setCurrentStep(1)
      setCompletedSteps([])

      // Show success message
      toast.success('Tax information submitted successfully! Proceeding to next step...')

      // In a real app, redirect to next onboarding step
      setTimeout(() => {
        window.location.href = '/employer/contractor-onboarding'
      }, 1500)
    } catch (error) {
      console.error('Error submitting tax information:', error)
      toast.error('Failed to submit tax information')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Toggle section expansion
   */
  const _toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  /**
   * Get step status
   */
  const getStepStatus = (step: number) => {
    if (completedSteps.includes(step)) return 'completed'
    if (step === currentStep) return 'active'
    return 'pending'
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Contractor Onboarding - Tax & Compliance"
        description="Complete your tax and banking information"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Contractor Onboarding', href: '/employer/contractor-onboarding' },
          { label: 'Tax & Compliance' },
        ]}
      />

      {/* Progress Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <button
                onClick={() => handleJumpToStep(step)}
                disabled={!completedSteps.includes(step) && step > currentStep}
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  getStepStatus(step) === 'completed'
                    ? 'bg-green-100 border-green-500'
                    : getStepStatus(step) === 'active'
                    ? 'bg-blue-100 border-blue-600'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                {getStepStatus(step) === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <span className="font-semibold text-gray-700">{step}</span>
                )}
              </button>
              <p className="text-xs font-medium mt-2 text-gray-600">
                {step === 1 ? 'Tax ID' : step === 2 ? 'GST & TDS' : 'Bank Details'}
              </p>
              {step < 3 && (
                <div
                  className={`absolute top-6 left-[60%] w-[calc(100%-40px)] h-1 transition-all ${
                    completedSteps.includes(step) ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Wrapper */}
      <Card className="p-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* STEP 1: Tax Identification */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Step 1: Tax Identification</h2>
              </div>

              {/* Primary Tax Document */}
              <div className="space-y-2">
                <Label htmlFor="primary_tax_doc">Primary Tax Document *</Label>
                <Controller
                  name="primary_tax_doc"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="primary_tax_doc">
                        <SelectValue placeholder="Select tax document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TAX_DOCUMENT_TYPES.map((doc) => (
                          <SelectItem key={doc.value} value={doc.value}>
                            {doc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.primary_tax_doc && (
                  <p className="text-sm text-red-600">{errors.primary_tax_doc.message}</p>
                )}
              </div>

              {/* Tax Document Number */}
              <div className="space-y-2">
                <Label htmlFor="tax_doc_number">
                  {primaryTaxDoc === 'pan' ? 'PAN' : 'Document'} Number *
                </Label>
                <Input
                  id="tax_doc_number"
                  placeholder={primaryTaxDoc === 'pan' ? 'ABCDE1234F' : 'Enter document number'}
                  {...register('tax_doc_number')}
                />
                {errors.tax_doc_number && (
                  <p className="text-sm text-red-600">{errors.tax_doc_number.message}</p>
                )}
              </div>

              {/* PAN */}
              <div className="space-y-2">
                <Label htmlFor="pan">PAN *</Label>
                <Input
                  id="pan"
                  placeholder="ABCDE1234F"
                  {...register('pan')}
                />
                {errors.pan && <p className="text-sm text-red-600">{errors.pan.message}</p>}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register('date_of_birth')}
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600">{errors.date_of_birth.message}</p>
                )}
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  placeholder="e.g., Indian"
                  {...register('nationality')}
                />
                {errors.nationality && (
                  <p className="text-sm text-red-600">{errors.nationality.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: GST & TDS Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Step 2: GST & TDS Information</h2>
              </div>

              {/* GST Registration Status */}
              <div className="space-y-2">
                <Label htmlFor="gst_registration_status">GST Registration Status *</Label>
                <Controller
                  name="gst_registration_status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="gst_registration_status">
                        <SelectValue placeholder="Select GST status" />
                      </SelectTrigger>
                      <SelectContent>
                        {GST_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gst_registration_status && (
                  <p className="text-sm text-red-600">{errors.gst_registration_status.message}</p>
                )}
              </div>

              {/* GST Number (conditional) */}
              {gstStatus === 'registered' && (
                <div className="space-y-2">
                  <Label htmlFor="gst_number">GST Number</Label>
                  <Input
                    id="gst_number"
                    placeholder="15-digit GST number"
                    {...register('gst_number')}
                  />
                </div>
              )}

              {/* TDS Applicable */}
              <div className="space-y-2">
                <Label htmlFor="tds_applicable">Is TDS Applicable? *</Label>
                <Controller
                  name="tds_applicable"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="tds_applicable">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tds_applicable && (
                  <p className="text-sm text-red-600">{errors.tds_applicable.message}</p>
                )}
              </div>

              {/* TDS Section (conditional) */}
              {tdsApplicable === 'yes' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="tds_section">TDS Section</Label>
                    <Input
                      id="tds_section"
                      placeholder="e.g., 194C, 194J"
                      {...register('tds_section')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tds_rate">TDS Rate (%)</Label>
                    <Input
                      id="tds_rate"
                      type="number"
                      placeholder="e.g., 2"
                      {...register('tds_rate')}
                    />
                  </div>
                </>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                <p className="font-medium mb-1">TDS Information:</p>
                <p className="text-xs">Tax Deducted at Source is applicable based on your contract value and terms. Contact your finance team for details.</p>
              </div>
            </div>
          )}

          {/* STEP 3: Bank Account Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Step 3: Bank Account Details</h2>
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <Label htmlFor="bank_name">Bank Name *</Label>
                <Input
                  id="bank_name"
                  placeholder="e.g., HDFC Bank"
                  {...register('bank_name')}
                />
                {errors.bank_name && (
                  <p className="text-sm text-red-600">{errors.bank_name.message}</p>
                )}
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <Label htmlFor="account_type">Account Type *</Label>
                <Controller
                  name="account_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="account_type">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="current">Current Account</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.account_type && (
                  <p className="text-sm text-red-600">{errors.account_type.message}</p>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="account_number">Account Number *</Label>
                <Input
                  id="account_number"
                  placeholder="Enter account number"
                  {...register('account_number')}
                />
                {errors.account_number && (
                  <p className="text-sm text-red-600">{errors.account_number.message}</p>
                )}
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <Label htmlFor="ifsc_code">IFSC Code *</Label>
                <Input
                  id="ifsc_code"
                  placeholder="e.g., HDFC0000001"
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
                  placeholder="Name as per bank records"
                  {...register('account_holder_name')}
                />
                {errors.account_holder_name && (
                  <p className="text-sm text-red-600">{errors.account_holder_name.message}</p>
                )}
              </div>

              {/* Account Holder PAN */}
              <div className="space-y-2">
                <Label htmlFor="account_holder_pan">Account Holder PAN</Label>
                <Input
                  id="account_holder_pan"
                  placeholder="ABCDE1234F"
                  {...register('account_holder_pan')}
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                <p className="font-medium mb-1">Security Notice:</p>
                <p className="text-xs">Your bank details are encrypted and stored securely. They are used only for salary/payment processing.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Continue'}
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Info Box */}
      <Card className="bg-indigo-50 border-indigo-200 p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-600" />
          <div className="text-sm text-indigo-900">
            <p className="font-medium mb-1">Important:</p>
            <p>Ensure all tax documents and banking information are accurate. Incorrect details may delay payment processing or cause compliance issues.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
