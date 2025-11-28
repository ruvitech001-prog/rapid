'use client'

import { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, FormWrapper } from '@/components/templates'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calculator,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react'
import { toast } from 'sonner'

const deductionSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valid amount required'),
  category: z.enum(['section_80c', 'section_80d', 'section_80e', 'section_80g', 'section_80gg']),
  proof_status: z.enum(['uploaded', 'pending']),
  notes: z.string().optional(),
})

const taxDeductionsSchema = z.object({
  financial_year: z.enum(['2024-25', '2025-26']),
  hra_amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Valid amount required'),
  medical_insurance_premium: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Valid amount required'),
  additional_deductions: z.array(deductionSchema),
})

type TaxDeductionsFormData = z.infer<typeof taxDeductionsSchema>

const DEDUCTION_CATEGORIES = {
  section_80c: {
    name: 'Section 80C (Insurance, Investments)',
    limit: 150000,
    description: 'Life Insurance, ELSS, Fixed Deposits, etc.',
  },
  section_80d: {
    name: 'Section 80D (Medical Insurance)',
    limit: 100000,
    description: 'Health Insurance Premiums',
  },
  section_80e: {
    name: 'Section 80E (Education Loan)',
    limit: 200000,
    description: 'Interest on Education Loans',
  },
  section_80g: {
    name: 'Section 80G (Donations)',
    limit: 'No limit',
    description: 'Donations to Approved Charities',
  },
  section_80gg: {
    name: 'Section 80GG (Rent)',
    limit: 60000,
    description: 'Rent Paid (if HRA not received)',
  },
}

export default function TaxDeductionsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [_showCalculation, setShowCalculation] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TaxDeductionsFormData>({
    resolver: zodResolver(taxDeductionsSchema),
    defaultValues: {
      financial_year: '2024-25',
      hra_amount: '0',
      medical_insurance_premium: '0',
      additional_deductions: [],
    },
  })

  const { fields: deductionFields, append: appendDeduction, remove: removeDeduction } = useFieldArray({
    control,
    name: 'additional_deductions',
  })

  const hraAmount = Number(watch('hra_amount')) || 0
  const medicalPremium = Number(watch('medical_insurance_premium')) || 0
  const additionalDeductions = watch('additional_deductions')

  const totalAdditionalDeductions = additionalDeductions.reduce(
    (sum, ded) => sum + (Number(ded.amount) || 0),
    0
  )

  const totalDeductions = hraAmount + medicalPremium + totalAdditionalDeductions
  const estimatedTaxSavings = Math.round(totalDeductions * 0.3) // Approximate 30% tax slab

  const onSubmit = async (_data: TaxDeductionsFormData) => {
    try {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success('Tax deductions saved successfully!')
      setShowCalculation(true)
    } catch (error) {
      console.error('Error saving deductions:', error)
      toast.error('Failed to save deductions')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Tax Advanced Deductions"
        description="Manage your tax deductions and optimize your tax savings"
        breadcrumbs={[
          { label: 'Home', href: '/employee/dashboard' },
          { label: 'Tax', href: '/employee/tax' },
          { label: 'Deductions' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalDeductions.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Est. Tax Savings</p>
              <p className="text-2xl font-bold text-green-600">₹{estimatedTaxSavings.toLocaleString()}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Savings</p>
              <p className="text-2xl font-bold text-blue-600">₹{Math.round(estimatedTaxSavings / 12).toLocaleString()}</p>
            </div>
            <Calculator className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      <FormWrapper
        title="Configure Tax Deductions"
        description="Add and manage your tax deductions to reduce your tax liability"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Saving...' : 'Save Deductions'}
        isLoading={isSubmitting}
      >
        <div className="space-y-8">
          {/* Financial Year Selection */}
          <div className="space-y-2">
            <Label htmlFor="financial_year">Financial Year *</Label>
            <Controller
              name="financial_year"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="financial_year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2025-26">2025-26</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Standard Deductions */}
          <div className="space-y-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Standard Deductions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hra_amount">House Rent Allowance (HRA) *</Label>
                <Input
                  id="hra_amount"
                  type="number"
                  placeholder="0"
                  {...register('hra_amount')}
                />
                {errors.hra_amount && (
                  <p className="text-sm text-red-600">{errors.hra_amount.message}</p>
                )}
                <p className="text-xs text-gray-500">Annual amount</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_insurance_premium">Medical Insurance Premium *</Label>
                <Input
                  id="medical_insurance_premium"
                  type="number"
                  placeholder="0"
                  {...register('medical_insurance_premium')}
                />
                {errors.medical_insurance_premium && (
                  <p className="text-sm text-red-600">{errors.medical_insurance_premium.message}</p>
                )}
                <p className="text-xs text-gray-500">Annual amount (Section 80D)</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">HRA Deduction</span>
                  <span className="font-semibold">₹{hraAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medical Premium</span>
                  <span className="font-semibold">₹{medicalPremium.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-gray-600 font-medium">Standard Deductions Total</span>
                  <span className="font-bold text-blue-600">
                    ₹{(hraAmount + medicalPremium).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Deductions */}
          <div className="space-y-6 p-6 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Additional Deductions
              </h3>
              <Badge variant="secondary">{deductionFields.length} Added</Badge>
            </div>

            <div className="space-y-4">
              {deductionFields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Deduction {index + 1}</h4>
                    {deductionFields.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDeduction(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`deduction-category-${index}`}>Category *</Label>
                      <Controller
                        name={`additional_deductions.${index}.category`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id={`deduction-category-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(DEDUCTION_CATEGORIES).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`deduction-amount-${index}`}>Amount *</Label>
                      <Input
                        id={`deduction-amount-${index}`}
                        type="number"
                        placeholder="0"
                        {...register(`additional_deductions.${index}.amount`)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`deduction-proof-${index}`}>Proof Status *</Label>
                    <Controller
                      name={`additional_deductions.${index}.proof_status`}
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id={`deduction-proof-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uploaded">Uploaded</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`deduction-notes-${index}`}>Notes</Label>
                    <Input
                      id={`deduction-notes-${index}`}
                      placeholder="e.g., Investment in ELSS fund"
                      {...register(`additional_deductions.${index}.notes`)}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendDeduction({
                  amount: '',
                  category: 'section_80c',
                  proof_status: 'pending',
                  notes: '',
                })
              }
              className="w-full flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Deduction
            </Button>

            {deductionFields.length > 0 && (
              <div className="p-4 bg-white rounded border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3">Additional Deductions Summary</h4>
                <div className="space-y-2 text-sm">
                  {additionalDeductions.map((ded, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">
                        {DEDUCTION_CATEGORIES[ded.category as keyof typeof DEDUCTION_CATEGORIES].name}
                      </span>
                      <span className="font-semibold">₹{Number(ded.amount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-600 font-medium">Additional Total</span>
                    <span className="font-bold text-purple-600">
                      ₹{totalAdditionalDeductions.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tax Calculation Summary */}
          <div className="p-6 bg-green-50 rounded-lg border border-green-200 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Tax Savings Calculation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded">
                <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalDeductions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white rounded">
                <p className="text-sm text-gray-600 mb-1">Est. Tax Savings (30% slab)</p>
                <p className="text-2xl font-bold text-green-600">₹{estimatedTaxSavings.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700">
              Based on a 30% tax slab, your estimated annual tax savings is ₹{estimatedTaxSavings.toLocaleString()}.
              Your actual savings may vary based on your tax slab and other applicable deductions.
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  Ensure you have supporting documents for all claimed deductions. Submit proof documents
                  before the year-end to avoid claims being rejected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}
