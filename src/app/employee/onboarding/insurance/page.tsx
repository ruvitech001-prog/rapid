'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, FormWrapper } from '@/components/templates'
import { Button as _Button } from '@/components/ui/button'
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
  Heart,
  Gift,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

const insuranceSwagSchema = z.object({
  health_insurance_plan: z.enum(['basic', 'standard', 'premium']),
  dependent_coverage: z.enum(['self_only', 'self_spouse', 'self_children', 'family']),
  nominee_name: z.string().min(2, 'Nominee name required'),
  nominee_relationship: z.enum(['spouse', 'parent', 'child', 'sibling', 'other']),
  swag_size: z.enum(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  swag_items: z.array(z.string()).min(1, 'Select at least one swag item'),
})

type InsuranceSwagFormData = z.infer<typeof insuranceSwagSchema>

const SWAG_OPTIONS = [
  { id: 'laptop_bag', label: 'Laptop Bag', available: true },
  { id: 'water_bottle', label: 'Water Bottle', available: true },
  { id: 'hoodie', label: 'Hoodie', available: true },
  { id: 'cap', label: 'Cap', available: true },
  { id: 'tshirt', label: 'T-Shirt', available: true },
  { id: 'stickers', label: 'Sticker Pack', available: true },
]

export default function InsurancePage() {
  const [completedSections, setCompletedSections] = useState({
    insurance: false,
    swag: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InsuranceSwagFormData>({
    resolver: zodResolver(insuranceSwagSchema),
    defaultValues: {
      health_insurance_plan: 'standard',
      dependent_coverage: 'self_only',
      nominee_name: '',
      nominee_relationship: 'spouse',
      swag_size: 'm',
      swag_items: [],
    },
  })

  const selectedSwagItems = watch('swag_items')

  const onSubmit = async (_data: InsuranceSwagFormData) => {
    try {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success('Insurance and swag preferences saved successfully!')
      setCompletedSections({
        insurance: true,
        swag: true,
      })
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPlanDetails = (plan: string) => {
    const plans = {
      basic: { coverage: '₹5,00,000', premium: '₹0', features: ['Hospitalization', 'OPD'] },
      standard: {
        coverage: '₹10,00,000',
        premium: '₹0',
        features: ['Hospitalization', 'OPD', 'Dental (₹25k)', 'Vision (₹10k)'],
      },
      premium: {
        coverage: '₹25,00,000',
        premium: '₹0',
        features: [
          'Hospitalization',
          'OPD',
          'Dental (₹50k)',
          'Vision (₹20k)',
          'Mental Health',
          'Wellness',
        ],
      },
    }
    return plans[plan as keyof typeof plans]
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Insurance & Swag Selection"
        description="Choose your health insurance plan and onboarding swag items"
        breadcrumbs={[
          { label: 'Home', href: '/employee/dashboard' },
          { label: 'Onboarding', href: '/employee/onboarding' },
          { label: 'Insurance & Swag' },
        ]}
      />

      <FormWrapper
        title="Insurance & Swag Setup"
        description="Select your health insurance coverage and company swag items"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Saving...' : 'Complete Setup'}
        isLoading={isSubmitting}
      >
        <div className="space-y-8">
          {/* Insurance Section */}
          <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Health Insurance</h3>
              {completedSections.insurance && (
                <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
              )}
            </div>

            {/* Plan Selection */}
            <div className="space-y-2">
              <Label htmlFor="health_insurance_plan">Select Your Plan *</Label>
              <Controller
                name="health_insurance_plan"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="health_insurance_plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Plan</SelectItem>
                      <SelectItem value="standard">Standard Plan (Recommended)</SelectItem>
                      <SelectItem value="premium">Premium Plan</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Plan Details Card */}
            {(() => {
              const planDetails = getPlanDetails(watch('health_insurance_plan'))
              return (
                <Card className="p-4 bg-white">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Coverage Amount</p>
                      <p className="font-bold text-lg text-gray-900">{planDetails.coverage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Employee Premium</p>
                      <p className="font-bold text-lg text-green-600">{planDetails.premium}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-sm text-gray-600 mb-2">Features</p>
                      <div className="space-y-1">
                        {planDetails.features.map((feature, i) => (
                          <p key={i} className="text-sm text-gray-700">
                            ✓ {feature}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })()}

            {/* Dependent Coverage */}
            <div className="space-y-2">
              <Label htmlFor="dependent_coverage">Dependent Coverage *</Label>
              <Controller
                name="dependent_coverage"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="dependent_coverage">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_only">Self Only</SelectItem>
                      <SelectItem value="self_spouse">Self + Spouse</SelectItem>
                      <SelectItem value="self_children">Self + Children</SelectItem>
                      <SelectItem value="family">Family (All)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Nominee Details */}
            <div className="space-y-4 p-4 bg-white rounded border border-blue-200">
              <h4 className="font-semibold text-gray-900">Nominee Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nominee_name">Nominee Name *</Label>
                  <Input
                    id="nominee_name"
                    placeholder="Full name"
                    {...register('nominee_name')}
                  />
                  {errors.nominee_name && (
                    <p className="text-sm text-red-600">{errors.nominee_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nominee_relationship">Relationship *</Label>
                  <Controller
                    name="nominee_relationship"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="nominee_relationship">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Swag Section */}
          <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">Onboarding Swag</h3>
              {completedSections.swag && (
                <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <Label htmlFor="swag_size">T-Shirt & Hoodie Size *</Label>
              <Controller
                name="swag_size"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="swag_size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">Extra Small (XS)</SelectItem>
                      <SelectItem value="s">Small (S)</SelectItem>
                      <SelectItem value="m">Medium (M)</SelectItem>
                      <SelectItem value="l">Large (L)</SelectItem>
                      <SelectItem value="xl">Extra Large (XL)</SelectItem>
                      <SelectItem value="xxl">2X Large (XXL)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Swag Items Selection */}
            <div className="space-y-3">
              <Label>Select Swag Items *</Label>
              <div className="space-y-2">
                {SWAG_OPTIONS.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={item.id}
                      {...register('swag_items')}
                      disabled={!item.available}
                      className="w-4 h-4"
                    />
                    <span className={`text-sm ${!item.available ? 'text-gray-400' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    {!item.available && <Badge variant="secondary">Out of Stock</Badge>}
                  </label>
                ))}
              </div>
              {errors.swag_items && (
                <p className="text-sm text-red-600">{errors.swag_items.message}</p>
              )}
            </div>

            {/* Swag Summary */}
            {selectedSwagItems.length > 0 && (
              <Card className="p-4 bg-white">
                <h4 className="font-semibold text-gray-900 mb-2">Selected Items</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSwagItems.map((item) => {
                    const swagItem = SWAG_OPTIONS.find((s) => s.id === item)
                    return (
                      <Badge key={item} className="bg-purple-100 text-purple-800">
                        {swagItem?.label}
                      </Badge>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Note:</p>
                <p>
                  Health insurance coverage is effective from your first day. Swag items will be
                  shipped to your registered address within 2-3 weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}
