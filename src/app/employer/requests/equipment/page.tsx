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
import { Badge } from '@/components/ui/badge'
import { Paperclip, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { useCreateSpecialRequest } from '@/lib/hooks'

const EQUIPMENT_CATEGORIES = [
  { value: 'laptop', label: 'Laptop/Computer' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'keyboard', label: 'Keyboard & Mouse' },
  { value: 'headphones', label: 'Headphones/Speakers' },
  { value: 'phone', label: 'Mobile Phone' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'software', label: 'Software License' },
  { value: 'other', label: 'Other Equipment' },
]

const URGENCY_LEVELS = [
  { value: 'low', label: 'Low - Can wait 2+ weeks' },
  { value: 'medium', label: 'Medium - Needed within 1-2 weeks' },
  { value: 'high', label: 'High - Needed within 3-5 days' },
  { value: 'critical', label: 'Critical - Needed immediately' },
]

const equipmentRequestSchema = z.object({
  category: z.enum(['laptop', 'monitor', 'keyboard', 'headphones', 'phone', 'furniture', 'software', 'other'], {
    errorMap: () => ({ message: 'Please select an equipment category' }),
  }),
  item_name: z.string()
    .min(3, 'Equipment name must be at least 3 characters')
    .max(100, 'Equipment name must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  justification: z.string()
    .min(20, 'Please provide a detailed justification (min 20 characters)')
    .max(1000, 'Justification must be less than 1000 characters'),
  urgency: z.enum(['low', 'medium', 'high', 'critical'], {
    errorMap: () => ({ message: 'Please select an urgency level' }),
  }),
  estimated_cost: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Please enter a valid cost amount',
    }),
  business_case: z.string().optional(),
  vendor_preference: z.string().optional(),
  notes: z.string().optional(),
})

type EquipmentRequestFormData = z.infer<typeof equipmentRequestSchema>

export default function EquipmentRequestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.id
  const companyId = user?.companyId

  const [attachments, setAttachments] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    justification: true,
    additional: false,
  })

  const createRequest = useCreateSpecialRequest()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<EquipmentRequestFormData>({
    resolver: zodResolver(equipmentRequestSchema),
    defaultValues: {
      category: 'laptop',
      urgency: 'medium',
      estimated_cost: '',
    },
  })

  const selectedUrgency = watch('urgency')

  const onSubmit = async (data: EquipmentRequestFormData) => {
    if (!userId || !companyId) {
      toast.error('User or company information not available')
      return
    }

    try {
      await createRequest.mutateAsync({
        companyId: companyId,
        requesterId: userId,
        requesterName: user?.email || 'Unknown',
        requestType: 'equipment',
        title: `Equipment Request - ${data.item_name}`,
        description: data.description,
        requestData: {
          category: data.category,
          item_name: data.item_name,
          justification: data.justification,
          urgency: data.urgency,
          estimated_cost: Number(data.estimated_cost),
          business_case: data.business_case,
          vendor_preference: data.vendor_preference,
          notes: data.notes,
          attachments: attachments.length > 0 ? attachments : undefined,
        },
        priority: data.urgency === 'critical' ? 'critical' : data.urgency === 'high' ? 'high' : 'normal',
      })

      reset()
      setAttachments([])
      toast.success(`Equipment request for "${data.item_name}" submitted successfully`)
      router.push('/employer/requests')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit equipment request')
    }
  }

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        setAttachments([...attachments, file.name])
        toast.success(`Attachment "${file.name}" added`)
      })
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const isSubmitting = createRequest.isPending

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Request Equipment"
        description="Submit a request for new equipment or tools needed for your work"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Requests', href: '/employer/requests' },
          { label: 'Equipment' },
        ]}
      />

      <FormWrapper
        title="New Equipment Request"
        description="Please provide detailed information about the equipment you need. Your request will be reviewed by the admin team."
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Submitting...' : 'Submit Request'}
        isLoading={isSubmitting}
      >
        {/* Basic Information Section */}
        <div className="border-b pb-6">
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>1. Basic Information</span>
            <span>{expandedSections.basic ? '▼' : '▶'}</span>
          </button>

          {expandedSections.basic && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="category">Equipment Category *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select equipment category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EQUIPMENT_CATEGORIES.map((cat) => (
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
                <Label htmlFor="item_name">Equipment Name *</Label>
                <Input
                  id="item_name"
                  placeholder="e.g., MacBook Pro 16-inch, Dell Monitor 4K"
                  {...register('item_name')}
                />
                {errors.item_name && (
                  <p className="text-sm text-red-600">{errors.item_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the specific equipment you need. Include model, specifications, or features required."
                  className="min-h-24"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Estimated Cost (₹) *</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  placeholder="e.g., 150000"
                  {...register('estimated_cost')}
                />
                {errors.estimated_cost && (
                  <p className="text-sm text-red-600">{errors.estimated_cost.message}</p>
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
            <span>2. Justification & Urgency</span>
            <span>{expandedSections.justification ? '▼' : '▶'}</span>
          </button>

          {expandedSections.justification && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="justification">Why do you need this equipment? *</Label>
                <Textarea
                  id="justification"
                  placeholder="Explain how this equipment will improve your work, productivity, or capabilities. Include specific use cases."
                  className="min-h-28"
                  {...register('justification')}
                />
                {errors.justification && (
                  <p className="text-sm text-red-600">{errors.justification.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Controller
                  name="urgency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        {URGENCY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.urgency && (
                  <p className="text-sm text-red-600">{errors.urgency.message}</p>
                )}
              </div>

              {selectedUrgency && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-700">
                    <strong>Selected Urgency:</strong>{' '}
                    <Badge variant={getUrgencyColor(selectedUrgency) as 'default' | 'destructive' | 'secondary' | 'outline'}>
                      {selectedUrgency.toUpperCase()}
                    </Badge>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Information Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('additional')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>3. Additional Information (Optional)</span>
            <span>{expandedSections.additional ? '▼' : '▶'}</span>
          </button>

          {expandedSections.additional && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="business_case">Business Case / ROI</Label>
                <Textarea
                  id="business_case"
                  placeholder="Optional: Provide business case or return on investment analysis if applicable"
                  className="min-h-20"
                  {...register('business_case')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor_preference">Preferred Vendor/Brand</Label>
                <Input
                  id="vendor_preference"
                  placeholder="e.g., Apple, Dell, Microsoft. Leave blank if no preference."
                  {...register('vendor_preference')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other information that might be helpful for processing this request"
                  className="min-h-20"
                  {...register('notes')}
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleAddAttachment}
                    className="hidden"
                    id="file-input"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="file-input"
                    className="flex items-center justify-center gap-2 cursor-pointer hover:text-blue-600"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm">Click to attach files (images, PDFs, documents)</span>
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Attached files:</p>
                    <div className="space-y-1">
                      {attachments.map((attachment, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-100 rounded"
                        >
                          <span className="text-sm text-gray-700">{attachment}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
          <p className="font-medium mb-2">Important Information:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>All equipment requests are reviewed by the admin team</li>
            <li>Equipment becomes company property and must be returned upon termination</li>
            <li>Personal use of company equipment is not permitted</li>
            <li>You will receive an email notification once your request is processed</li>
          </ul>
        </div>
      </FormWrapper>
    </div>
  )
}
