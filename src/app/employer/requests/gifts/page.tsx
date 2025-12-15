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
import { Gift } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { useCreateSpecialRequest } from '@/lib/hooks'

const GIFT_CATEGORIES = [
  { value: 'voucher', label: 'Gift Voucher/Card' },
  { value: 'tech', label: 'Tech Gadget' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'merchandise', label: 'Company Merchandise' },
  { value: 'experiential', label: 'Experiential Gift (Event, Activity)' },
  { value: 'food', label: 'Food & Beverages' },
  { value: 'wellness', label: 'Wellness Product' },
  { value: 'other', label: 'Other' },
]

const OCCASIONS = [
  { value: 'anniversary', label: 'Work Anniversary' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'milestone', label: 'Achievement/Milestone' },
  { value: 'joining', label: 'Joining Bonus' },
  { value: 'performance', label: 'Performance Recognition' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'other', label: 'Other Occasion' },
]

const giftsRequestSchema = z.object({
  recipient_name: z.string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(100, 'Recipient name must be less than 100 characters'),
  recipient_email: z.string()
    .email('Please enter a valid email address'),
  category: z.enum(['voucher', 'tech', 'accessories', 'merchandise', 'experiential', 'food', 'wellness', 'other'], {
    errorMap: () => ({ message: 'Please select a gift category' }),
  }),
  gift_description: z.string()
    .min(5, 'Gift description must be at least 5 characters')
    .max(200, 'Gift description must be less than 200 characters'),
  occasion: z.enum(['anniversary', 'birthday', 'milestone', 'joining', 'performance', 'retirement', 'other'], {
    errorMap: () => ({ message: 'Please select an occasion' }),
  }),
  amount: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Please enter a valid amount',
    }),
  justification: z.string()
    .min(10, 'Please provide justification (min 10 characters)')
    .max(500, 'Justification must be less than 500 characters'),
  notes: z.string().optional(),
})

type GiftsRequestFormData = z.infer<typeof giftsRequestSchema>

export default function GiftsRequestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.id
  const companyId = user?.companyId

  const [expandedSections, setExpandedSections] = useState({
    recipient: true,
    giftDetails: true,
    justification: false,
  })

  const createRequest = useCreateSpecialRequest()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<GiftsRequestFormData>({
    resolver: zodResolver(giftsRequestSchema),
    defaultValues: {
      category: 'voucher',
      occasion: 'birthday',
      amount: '',
    },
  })

  const onSubmit = async (data: GiftsRequestFormData) => {
    if (!userId || !companyId) {
      toast.error('User or company information not available')
      return
    }

    try {
      await createRequest.mutateAsync({
        companyId: companyId,
        requesterId: userId,
        requesterName: user?.email || 'Unknown',
        requestType: 'gifts',
        title: `Gift Request - ${data.recipient_name}`,
        description: data.gift_description,
        requestData: {
          recipient_name: data.recipient_name,
          recipient_email: data.recipient_email,
          category: data.category,
          gift_description: data.gift_description,
          occasion: data.occasion,
          amount: Number(data.amount),
          justification: data.justification,
          notes: data.notes,
        },
      })

      reset()
      toast.success(`Gift request for ${data.recipient_name} submitted successfully`)
      router.push('/employer/requests')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit gift request')
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
        title="Request Gifts"
        description="Submit a gift request for employees, clients, or business associates"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Requests', href: '/employer/requests' },
          { label: 'Gifts' },
        ]}
      />

      <FormWrapper
        title="New Gifts Request"
        description="Please provide recipient details and gift preferences. Your request will be reviewed by the admin team."
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Submitting...' : 'Submit Request'}
        isLoading={isSubmitting}
      >
        {/* Recipient Information Section */}
        <div className="border-b pb-6">
          <button
            type="button"
            onClick={() => toggleSection('recipient')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>1. Recipient Information</span>
            <span>{expandedSections.recipient ? '▼' : '▶'}</span>
          </button>

          {expandedSections.recipient && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="recipient_name">Recipient Name *</Label>
                <Input
                  id="recipient_name"
                  placeholder="e.g., John Smith"
                  {...register('recipient_name')}
                />
                {errors.recipient_name && (
                  <p className="text-sm text-red-600">{errors.recipient_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient_email">Recipient Email *</Label>
                <Input
                  id="recipient_email"
                  type="email"
                  placeholder="john.smith@company.com"
                  {...register('recipient_email')}
                />
                {errors.recipient_email && (
                  <p className="text-sm text-red-600">{errors.recipient_email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion *</Label>
                <Controller
                  name="occasion"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="occasion">
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        {OCCASIONS.map((occ) => (
                          <SelectItem key={occ.value} value={occ.value}>
                            {occ.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.occasion && (
                  <p className="text-sm text-red-600">{errors.occasion.message}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Gift Details Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('giftDetails')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>2. Gift Details</span>
            <span>{expandedSections.giftDetails ? '▼' : '▶'}</span>
          </button>

          {expandedSections.giftDetails && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="category">Gift Category *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select gift category" />
                      </SelectTrigger>
                      <SelectContent>
                        {GIFT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gift_description">Gift Description *</Label>
                <Input
                  id="gift_description"
                  placeholder="e.g., Apple AirPods Pro, Amazon Gift Card"
                  {...register('gift_description')}
                />
                {errors.gift_description && (
                  <p className="text-sm text-red-600">{errors.gift_description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Gift Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 5000"
                  {...register('amount')}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
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
            <span>3. Justification (Optional)</span>
            <span>{expandedSections.justification ? '▼' : '▶'}</span>
          </button>

          {expandedSections.justification && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="justification">Why this gift? *</Label>
                <Textarea
                  id="justification"
                  placeholder="Explain the reason for selecting this gift and the relationship with the recipient"
                  className="min-h-24"
                  {...register('justification')}
                />
                {errors.justification && (
                  <p className="text-sm text-red-600">{errors.justification.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special delivery instructions or preferences"
                  className="min-h-20"
                  {...register('notes')}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <div className="flex gap-3">
            <Gift className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="font-medium mb-2">Gift Request Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>All gift requests are reviewed and approved by the admin team</li>
                <li>Gifts must follow company policy and budget guidelines</li>
                <li>Personal relationships must be documented for transparency</li>
                <li>You will receive an email confirmation once the gift is sent</li>
              </ul>
            </div>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}
