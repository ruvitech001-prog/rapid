/**
 * Salary Structure Settings Screen
 * GROUP B - Screen 10 (Complex multi-section FORM pattern)
 *
 * This screen demonstrates:
 * - Complex form with multiple sections
 * - Dynamic field arrays (allowances, deductions)
 * - Salary component configuration
 * - Collapsible sections
 * - Advanced validation
 * - Form state persistence
 *
 * @route /employer/settings/salary-structure
 */

'use client'

import { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
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
import { Card } from '@/components/ui/card'
import { Plus, Trash2, AlertCircle, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Component type options
 */
const COMPONENT_TYPES = [
  { value: 'salary', label: 'Basic Salary' },
  { value: 'hra', label: 'HRA (House Rent Allowance)' },
  { value: 'dearness', label: 'Dearness Allowance' },
  { value: 'conveyance', label: 'Conveyance Allowance' },
  { value: 'medical', label: 'Medical Allowance' },
  { value: 'special', label: 'Special Allowance' },
  { value: 'bonus', label: 'Annual Bonus' },
  { value: 'other', label: 'Other Allowance' },
]

const DEDUCTION_TYPES = [
  { value: 'pf', label: 'Provident Fund (PF)' },
  { value: 'esi', label: 'Employee State Insurance (ESI)' },
  { value: 'tax', label: 'Income Tax' },
  { value: 'loan', label: 'Loan Repayment' },
  { value: 'professional', label: 'Professional Tax' },
  { value: 'other', label: 'Other Deduction' },
]

/**
 * Salary structure schema
 */
const salaryStructureSchema = z.object({
  salary_structure_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  effective_from: z.string().min(1, 'Effective date is required'),
  components: z.array(z.object({
    type: z.string(),
    name: z.string().min(2, 'Component name required'),
    percentage: z.string()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
        message: 'Percentage must be between 0 and 100',
      }),
    is_taxable: z.enum(['yes', 'no']),
  })).min(1, 'At least one salary component is required'),
  deductions: z.array(z.object({
    type: z.string(),
    name: z.string().min(2, 'Deduction name required'),
    percentage: z.string()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
        message: 'Percentage must be between 0 and 100',
      }),
  })),
  notes: z.string().optional(),
})

type SalaryStructureFormData = z.infer<typeof salaryStructureSchema>

interface SalaryComponent {
  type: string
  name: string
  percentage: number
  is_taxable: boolean
}

interface SalaryDeduction {
  type: string
  name: string
  percentage: number
}

interface SalaryStructure {
  id: string
  company_id: string
  salary_structure_name: string
  description?: string
  effective_from: string
  components: SalaryComponent[]
  deductions: SalaryDeduction[]
  notes?: string
  created_at: string
  updated_at: string
}

export default function SalaryStructureSettingsPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const company = getCurrentMockCompany()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    components: true,
    deductions: false,
    notes: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SalaryStructureFormData>({
    resolver: zodResolver(salaryStructureSchema),
    defaultValues: {
      salary_structure_name: '',
      description: '',
      effective_from: '',
      components: [
        { type: 'salary', name: 'Basic Salary', percentage: '0', is_taxable: 'yes' },
      ],
      deductions: [
        { type: 'pf', name: 'Provident Fund', percentage: '0' },
      ],
    },
  })

  const { fields: componentFields, append: appendComponent, remove: removeComponent } = useFieldArray({
    control,
    name: 'components',
  })

  const { fields: deductionFields, append: appendDeduction, remove: removeDeduction } = useFieldArray({
    control,
    name: 'deductions',
  })

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Handle form submission
   */
  const onSubmit = async (data: SalaryStructureFormData) => {
    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!company) {
        toast.error('Company information not found')
        return
      }

      const today = new Date().toISOString().split('T')[0] || new Date().toISOString()

      // Create salary structure
      const newStructure: SalaryStructure = {
        id: generateId(),
        company_id: company.id,
        salary_structure_name: data.salary_structure_name,
        description: data.description,
        effective_from: data.effective_from,
        components: data.components.map(c => ({
          type: c.type,
          name: c.name,
          percentage: Number(c.percentage),
          is_taxable: c.is_taxable === 'yes',
        })),
        deductions: data.deductions.map(d => ({
          type: d.type,
          name: d.name,
          percentage: Number(d.percentage),
        })),
        notes: data.notes,
        created_at: today,
        updated_at: today,
      }

      // In a real app, save to database
      // addMockData('salaryStructures', newStructure)

      // Reset form
      reset()

      // Show success message
      toast.success(`Salary structure "${data.salary_structure_name}" created successfully`)
    } catch (error) {
      console.error('Error creating salary structure:', error)
      toast.error('Failed to create salary structure')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Toggle section expansion
   */
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Salary Structure Settings"
        description="Configure salary components and deductions for the organization"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Settings', href: '/employer/settings' },
          { label: 'Salary Structure' },
        ]}
      />

      {/* Form Wrapper */}
      <FormWrapper
        title="Create New Salary Structure"
        description="Define salary components, allowances, and deductions for employee compensation"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Saving...' : 'Save Salary Structure'}
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
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="salary_structure_name">Salary Structure Name *</Label>
                <Input
                  id="salary_structure_name"
                  placeholder="e.g., Standard Structure 2024"
                  {...register('salary_structure_name')}
                />
                {errors.salary_structure_name && (
                  <p className="text-sm text-red-600">{errors.salary_structure_name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this salary structure..."
                  className="min-h-20"
                  {...register('description')}
                />
              </div>

              {/* Effective From */}
              <div className="space-y-2">
                <Label htmlFor="effective_from">Effective From *</Label>
                <Input
                  id="effective_from"
                  type="date"
                  {...register('effective_from')}
                />
                {errors.effective_from && (
                  <p className="text-sm text-red-600">{errors.effective_from.message}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Salary Components Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('components')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>2. Salary Components & Allowances</span>
            <span>{expandedSections.components ? '▼' : '▶'}</span>
          </button>

          {expandedSections.components && (
            <div className="space-y-4 ml-4">
              {componentFields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Component {index + 1}</span>
                    {componentFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeComponent(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Component Type */}
                    <div className="space-y-2">
                      <Label htmlFor={`components.${index}.type`}>Type *</Label>
                      <Controller
                        name={`components.${index}.type`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id={`components.${index}.type`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {COMPONENT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {/* Component Name */}
                    <div className="space-y-2">
                      <Label htmlFor={`components.${index}.name`}>Name *</Label>
                      <Input
                        id={`components.${index}.name`}
                        placeholder="e.g., Basic Salary"
                        {...register(`components.${index}.name`)}
                      />
                    </div>

                    {/* Percentage */}
                    <div className="space-y-2">
                      <Label htmlFor={`components.${index}.percentage`}>Percentage of Basic (%)*</Label>
                      <Input
                        id={`components.${index}.percentage`}
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...register(`components.${index}.percentage`)}
                      />
                    </div>

                    {/* Taxable */}
                    <div className="space-y-2">
                      <Label htmlFor={`components.${index}.is_taxable`}>Is Taxable? *</Label>
                      <Controller
                        name={`components.${index}.is_taxable`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id={`components.${index}.is_taxable`}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add Component Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendComponent({
                    type: 'other',
                    name: '',
                    percentage: '0',
                    is_taxable: 'yes',
                  })
                }
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Component
              </Button>

              {errors.components && (
                <p className="text-sm text-red-600">{errors.components.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Deductions Section */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('deductions')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>3. Deductions</span>
            <span>{expandedSections.deductions ? '▼' : '▶'}</span>
          </button>

          {expandedSections.deductions && (
            <div className="space-y-4 ml-4">
              {deductionFields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Deduction {index + 1}</span>
                    {deductionFields.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeDeduction(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Deduction Type */}
                    <div className="space-y-2">
                      <Label htmlFor={`deductions.${index}.type`}>Type *</Label>
                      <Controller
                        name={`deductions.${index}.type`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id={`deductions.${index}.type`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {DEDUCTION_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {/* Deduction Name */}
                    <div className="space-y-2">
                      <Label htmlFor={`deductions.${index}.name`}>Name *</Label>
                      <Input
                        id={`deductions.${index}.name`}
                        placeholder="e.g., Provident Fund"
                        {...register(`deductions.${index}.name`)}
                      />
                    </div>

                    {/* Percentage */}
                    <div className="space-y-2">
                      <Label htmlFor={`deductions.${index}.percentage`}>Percentage of Basic (%) *</Label>
                      <Input
                        id={`deductions.${index}.percentage`}
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...register(`deductions.${index}.percentage`)}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add Deduction Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendDeduction({
                    type: 'other',
                    name: '',
                    percentage: '0',
                  })
                }
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Deduction
              </Button>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="border-b py-6">
          <button
            type="button"
            onClick={() => toggleSection('notes')}
            className="w-full text-left font-semibold text-lg mb-4 flex items-center justify-between hover:text-blue-600"
          >
            <span>4. Additional Notes (Optional)</span>
            <span>{expandedSections.notes ? '▼' : '▶'}</span>
          </button>

          {expandedSections.notes && (
            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this salary structure..."
                  className="min-h-24"
                  {...register('notes')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Important:</p>
              <p>Salary structures define how employee salaries are calculated. Changes are effective from the specified date and apply to new salary cycles.</p>
            </div>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}
