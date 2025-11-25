# Screen Blueprint & Implementation Patterns

This document consolidates the implementation patterns from the three example screens and provides copy-paste templates for building remaining screens consistently.

---

## Table of Contents

1. [Pattern Overview](#pattern-overview)
2. [Pattern 1: LIST + CREATE (DataTable + Modal)](#pattern-1-list--create-datatable--modal)
3. [Pattern 2: FORM ONLY (Single Form Submission)](#pattern-2-form-only-single-form-submission)
4. [Pattern 3: STEP FORM (Multi-Step Wizard)](#pattern-3-step-form-multi-step-wizard)
5. [Shared Patterns & Utilities](#shared-patterns--utilities)
6. [Component Template Quick Reference](#component-template-quick-reference)
7. [Validation Patterns](#validation-patterns)
8. [State Management Guidelines](#state-management-guidelines)
9. [Error Handling & Toast Notifications](#error-handling--toast-notifications)
10. [Testing Checklist](#testing-checklist)

---

## Pattern Overview

All 16 screens follow one of three primary patterns based on their complexity and UX requirements:

| Pattern | Use Cases | Example Screens |
|---------|-----------|-----------------|
| **LIST + CREATE** | Display data in table + add new records via modal | Team Management, Leave Requests, Expense Requests |
| **FORM ONLY** | Single form submission for requests/applications | Equipment Request, Gift Request, Role Request |
| **STEP FORM** | Multi-step wizard for complex onboarding/workflows | Contractor Onboarding, Employee Onboarding, Tax Onboarding |

### Complexity Levels

- **Simple**: Basic fields, straightforward validation
- **Medium**: Multiple fields, conditional visibility, file uploads
- **Complex**: Multi-step, dependent fields, custom validation logic

---

## Pattern 1: LIST + CREATE (DataTable + Modal)

**Example Implementation**: `/src/app/employer/settings/teams/page.tsx`

**Best for**:
- Displaying lists of items that users create
- Managing resources with CRUD operations
- Tables with edit/delete actions

### Code Template

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, DataTableWrapper, ModalFormWrapper } from '@/components/templates'
import { getMockDataByCompany, addMockData, generateId } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Validation schema for [ITEM_NAME] form
 */
const formSchema = z.object({
  field1: z.string().min(2, 'Field1 must be at least 2 characters'),
  field2: z.string().min(5, 'Field2 must be at least 5 characters'),
  // ... add more fields
})

type FormData = z.infer<typeof formSchema>

interface [ItemInterface] {
  id: string
  company_id: string
  field1: string
  field2: string
  // ... add more fields
  created_at: string
}

export default function [ScreenName]Page() {
  const company = getCurrentMockCompany()
  const [items, setItems] = useState<[ItemInterface][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  // Load mock data on component mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 300))

        const mockItems = getMockDataByCompany('mockDataKey', company.id)
        setItems(mockItems || [])
      } catch (error) {
        console.error('Error loading items:', error)
        toast.error('Failed to load items')
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [company.id])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newItem: [ItemInterface] = {
        id: generateId(),
        company_id: company.id,
        ...data,
        created_at: new Date().toISOString().split('T')[0],
      }

      addMockData('mockDataKey', newItem)
      setItems([...items, newItem])
      setIsModalOpen(false)
      reset()

      toast.success('Item created successfully')
    } catch (error) {
      console.error('Error creating item:', error)
      toast.error('Failed to create item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure?')) {
      setItems(items.filter((item) => item.id !== id))
      toast.success('Item deleted successfully')
    }
  }

  const handleEdit = (item: [ItemInterface]) => {
    console.log('Edit item:', item)
    toast.info('Edit functionality - coming soon')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="[Screen Title]"
        description="[Screen Description]"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: '[Parent]', href: '/employer/[parent]' },
          { label: '[Current]' },
        ]}
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create [Item]
          </Button>
        }
      />

      <DataTableWrapper<[ItemInterface]>
        columns={[
          {
            key: 'field1',
            label: 'Field 1',
          },
          {
            key: 'field2',
            label: 'Field 2',
          },
          {
            key: 'id',
            label: 'Actions',
            render: (_, item: [ItemInterface]) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={items}
        isLoading={isLoading}
        emptyMessage="No items created yet. Create your first item to get started."
      />

      <ModalFormWrapper
        title="Create New [Item]"
        description="[Description of what user is creating]"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          reset()
        }}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Creating...' : 'Create [Item]'}
        isLoading={isSubmitting}
      >
        {/* Form fields here */}
        <div className="space-y-2">
          <Label htmlFor="field1">Field 1 *</Label>
          <Input
            id="field1"
            placeholder="Placeholder text"
            {...register('field1')}
          />
          {errors.field1 && <p className="text-sm text-red-600">{errors.field1.message}</p>}
        </div>

        {/* Helper text */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          Helper text or information about the form
        </div>
      </ModalFormWrapper>
    </div>
  )
}
```

### Key Points for LIST + CREATE Pattern

1. **Mock Data Loading**: Always load data in `useEffect` with company filter
2. **Loading State**: Show loading state while fetching mock data
3. **Empty State**: Always provide meaningful empty message
4. **Modal Control**: Use simple boolean state for modal open/close
5. **Form Reset**: Always reset form when closing modal
6. **Row Actions**: Implement edit/delete in custom render function
7. **Toast Feedback**: Always show success/error toast after action

---

## Pattern 2: FORM ONLY (Single Form Submission)

**Example Implementation**: `/src/app/employer/requests/equipment/page.tsx`

**Best for**:
- Standalone form submissions
- Request/application forms
- Single-action workflows

### Code Template

```typescript
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
import { toast } from 'sonner'

/**
 * Validation schema
 */
const formSchema = z.object({
  field1: z.string().min(2, 'Field1 required'),
  field2: z.string().min(5, 'Field2 required'),
  enum_field: z.enum(['option1', 'option2', 'option3']),
  numeric_field: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Must be a positive number',
  }),
})

type FormData = z.infer<typeof formSchema>

interface SubmissionRecord {
  id: string
  company_id: string
  request_type: string
  title: string
  description: string
  request_data: Record<string, any>
  status: string
  created_at: string
}

const OPTIONS = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

export default function FormOnlyPage() {
  const company = getCurrentMockCompany()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enum_field: 'option1',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const submission: SubmissionRecord = {
        id: generateId(),
        company_id: company.id,
        request_type: '[request_type]',
        title: `[Request] - ${data.field1}`,
        description: data.field2,
        request_data: data,
        status: 'pending',
        created_at: new Date().toISOString().split('T')[0],
      }

      addMockData('[mockDataKey]', submission)
      reset()
      toast.success('Request submitted successfully')
    } catch (error) {
      console.error('Error submitting:', error)
      toast.error('Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="[Form Title]"
        description="[Form Description]"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: '[Parent]', href: '/employer/[parent]' },
          { label: '[Current]' },
        ]}
      />

      <FormWrapper
        title="[Form Title]"
        description="[Instructions for user]"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Submitting...' : 'Submit'}
        isLoading={isSubmitting}
      >
        {/* Text Input */}
        <div className="space-y-2">
          <Label htmlFor="field1">Field 1 *</Label>
          <Input
            id="field1"
            placeholder="Placeholder text"
            {...register('field1')}
          />
          {errors.field1 && <p className="text-sm text-red-600">{errors.field1.message}</p>}
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <Label htmlFor="field2">Field 2 *</Label>
          <Textarea
            id="field2"
            placeholder="Detailed information"
            className="min-h-24"
            {...register('field2')}
          />
          {errors.field2 && <p className="text-sm text-red-600">{errors.field2.message}</p>}
        </div>

        {/* Select */}
        <div className="space-y-2">
          <Label htmlFor="enum_field">Select Field *</Label>
          <Controller
            name="enum_field"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="enum_field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.enum_field && (
            <p className="text-sm text-red-600">{errors.enum_field.message}</p>
          )}
        </div>

        {/* Number Input */}
        <div className="space-y-2">
          <Label htmlFor="numeric_field">Numeric Field *</Label>
          <Input
            id="numeric_field"
            type="number"
            placeholder="Enter amount"
            {...register('numeric_field')}
          />
          {errors.numeric_field && (
            <p className="text-sm text-red-600">{errors.numeric_field.message}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          Important information or instructions for the user
        </div>
      </FormWrapper>
    </div>
  )
}
```

### Key Points for FORM ONLY Pattern

1. **Single Submit**: One form submission action
2. **Validation**: Zod schema with clear error messages
3. **Loading State**: Disable submit button during submission
4. **Form Reset**: Reset form after successful submission
5. **Collapsible Sections**: Optional - use for grouping related fields
6. **File Uploads**: Can be added with file input in form
7. **Info Boxes**: Provide context-specific information and guidelines

---

## Pattern 3: STEP FORM (Multi-Step Wizard)

**Example Implementation**: `/src/app/employer/contractor-onboarding/personal/page.tsx`

**Best for**:
- Complex onboarding flows
- Wizard-style workflows
- Forms with dependent/conditional fields
- Progressive disclosure of fields

### Code Template

```typescript
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
 * Define validation for each step separately
 * This allows showing errors only for current step
 */
const step1Schema = z.object({
  field1: z.string().min(2, 'Field1 required'),
  field2: z.string().min(2, 'Field2 required'),
})

const step2Schema = z.object({
  field3: z.string().min(1, 'Field3 required'),
  field4: z.string().min(1, 'Field4 required'),
})

const step3Schema = z.object({
  field5: z.string().min(1, 'Field5 required'),
  field6: z.string().min(1, 'Field6 required'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>
type AllStepData = Step1Data & Step2Data & Step3Data

interface SubmissionRecord {
  id: string
  company_id: string
  // ... fields from all steps
  status: string
  created_at: string
}

export default function StepFormPage() {
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
  } = useForm<AllStepData>({
    resolver: zodResolver(
      currentStep === 1 ? step1Schema : currentStep === 2 ? step2Schema : step3Schema
    ),
    mode: 'onChange',
    defaultValues: {
      field1: '',
      field2: '',
      field3: '',
      field4: '',
      field5: '',
      field6: '',
    },
  })

  const handleNextStep = async () => {
    const isValid = await trigger()
    if (isValid) {
      if (currentStep < 3) {
        setCompletedSteps([...new Set([...completedSteps, currentStep])])
        setCurrentStep(currentStep + 1)
      }
    } else {
      toast.error('Please fix errors before proceeding')
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: AllStepData) => {
    try {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 800))

      const submission: SubmissionRecord = {
        id: generateId(),
        company_id: company.id,
        ...data,
        status: 'pending',
        created_at: new Date().toISOString().split('T')[0],
      }

      addMockData('[mockDataKey]', submission)
      toast.success('Successfully completed')
      setCurrentStep(1)
      setCompletedSteps([])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepIcon = (step: number) => {
    if (completedSteps.includes(step)) {
      return <CheckCircle2 className="w-6 h-6 text-green-600" />
    }
    return <Circle className={`w-6 h-6 ${currentStep === step ? 'text-blue-600' : 'text-gray-300'}`} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="[Multi-Step Form]"
          description="[Description]"
          breadcrumbs={[
            { label: 'Home', href: '/employer/dashboard' },
            { label: '[Parent]' },
            { label: '[Current]' },
          ]}
        />

        {/* Progress Indicator */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => completedSteps.includes(step) && setCurrentStep(step)}
                  disabled={!completedSteps.includes(step) && step !== currentStep}
                >
                  {getStepIcon(step)}
                </button>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 ${completedSteps.includes(step) ? 'bg-green-600' : 'bg-gray-200'}`}
                    style={{ minWidth: '40px' }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </Card>

        {/* Form Content */}
        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Step 1: [Title]</h2>

                <div className="space-y-2">
                  <Label htmlFor="field1">Field 1 *</Label>
                  <Input id="field1" {...register('field1')} />
                  {errors.field1 && <p className="text-sm text-red-600">{errors.field1.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field2">Field 2 *</Label>
                  <Input id="field2" {...register('field2')} />
                  {errors.field2 && <p className="text-sm text-red-600">{errors.field2.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Step 2: [Title]</h2>

                <div className="space-y-2">
                  <Label htmlFor="field3">Field 3 *</Label>
                  <Input id="field3" {...register('field3')} />
                  {errors.field3 && <p className="text-sm text-red-600">{errors.field3.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field4">Field 4 *</Label>
                  <Input id="field4" {...register('field4')} />
                  {errors.field4 && <p className="text-sm text-red-600">{errors.field4.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Step 3: [Title]</h2>

                <div className="space-y-2">
                  <Label htmlFor="field5">Field 5 *</Label>
                  <Input id="field5" {...register('field5')} />
                  {errors.field5 && <p className="text-sm text-red-600">{errors.field5.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field6">Field 6 *</Label>
                  <Input id="field6" {...register('field6')} />
                  {errors.field6 && <p className="text-sm text-red-600">{errors.field6.message}</p>}
                </div>
              </div>
            )}

            {/* Navigation */}
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
                  {isSubmitting ? 'Submitting...' : 'Complete'}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
```

### Key Points for STEP FORM Pattern

1. **Separate Validation**: Each step has its own Zod schema
2. **Step-based Validation**: Only validate current step fields on next
3. **Progress Tracking**: Show completed steps visually
4. **Navigation**: Allow moving forward (validated) and backward (no validation)
5. **State Persistence**: Form data persists across steps using react-hook-form
6. **Clickable Steps**: Allow jumping to completed steps
7. **Conditional Fields**: Use `watch()` to show/hide fields based on selections
8. **Summary**: Optional review step before final submission

---

## Shared Patterns & Utilities

### 1. Always Import These

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, [TemplateComponent] } from '@/components/templates'
import { getCurrentMockCompany, addMockData, generateId, getMockDataByCompany } from '@/lib/mock-data'
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
```

### 2. Company Initialization

Every page should get the current company:

```typescript
const company = getCurrentMockCompany()
```

### 3. Generate New IDs

Always use this for new records:

```typescript
const newRecord = {
  id: generateId(),
  company_id: company.id,
  // ... other fields
  created_at: new Date().toISOString().split('T')[0],
}
```

### 4. Add to Mock Data

After creating a record, always add to mock data:

```typescript
addMockData('specialRequests', newRecord)
// OR
addMockData('teams', newRecord)
// etc.
```

### 5. Standard Button States

```typescript
<Button disabled={isSubmitting}>
  {isSubmitting ? 'Loading...' : 'Submit'}
</Button>
```

---

## Component Template Quick Reference

### FormWrapper (For FORM ONLY)

```typescript
<FormWrapper
  title="Create/Submit Something"
  description="User instructions"
  onSubmit={handleSubmit(onSubmit)}
  submitLabel={isSubmitting ? 'Submitting...' : 'Submit'}
  isLoading={isSubmitting}
>
  {/* Form fields here */}
</FormWrapper>
```

**Props**:
- `title: string` - Form title
- `description?: string` - Subtitle/instructions
- `children: React.ReactNode` - Form fields
- `onSubmit?: () => void` - Submit handler
- `submitLabel?: string` - Button text (default: "Submit")
- `isLoading?: boolean` - Disable during submission

### DataTableWrapper (For LIST + CREATE)

```typescript
<DataTableWrapper<ItemType>
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'id', label: 'Actions', render: (_, item) => (...) },
  ]}
  data={items}
  isLoading={isLoading}
  emptyMessage="No items yet"
  onRowClick={(item) => handleRowClick(item)}
/>
```

**Props**:
- `columns: Column<T>[]` - Table columns
- `data: T[]` - Table data
- `isLoading?: boolean` - Show loading state
- `emptyMessage?: string` - Message when no data
- `onRowClick?: (item: T) => void` - Row click handler

### ModalFormWrapper (For LIST + CREATE modals)

```typescript
<ModalFormWrapper
  title="Create New Item"
  description="Add a new item"
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false)
    reset()
  }}
  onSubmit={handleSubmit(onSubmit)}
  submitLabel="Create"
  isLoading={isSubmitting}
>
  {/* Form fields */}
</ModalFormWrapper>
```

**Props**:
- `title: string` - Modal title
- `description?: string` - Modal subtitle
- `isOpen: boolean` - Control modal visibility
- `onClose: () => void` - Close handler
- `children: React.ReactNode` - Form fields
- `onSubmit?: () => void` - Submit handler
- `submitLabel?: string` - Submit button text
- `isLoading?: boolean` - Disable during submission

### PageHeader

```typescript
<PageHeader
  title="Screen Title"
  description="Screen description"
  breadcrumbs={[
    { label: 'Home', href: '/employer/dashboard' },
    { label: 'Parent', href: '/employer/parent' },
    { label: 'Current' },
  ]}
  actions={<Button>Action</Button>}
/>
```

**Props**:
- `title: string` - Page title
- `description?: string` - Page subtitle
- `breadcrumbs?: Breadcrumb[]` - Navigation breadcrumbs
- `actions?: React.ReactNode` - Action buttons/elements

---

## Validation Patterns

### Basic Field Validation

```typescript
const schema = z.object({
  // Text fields
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),

  // Numbers
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Must be a positive number',
  }),

  // Enums
  status: z.enum(['active', 'inactive', 'pending']),

  // Dates
  start_date: z.string().min(1, 'Start date required'),

  // Optional fields
  notes: z.string().optional(),

  // Textarea
  description: z.string().min(10, 'Min 10 characters'),
})
```

### Conditional Validation

```typescript
const schema = z.object({
  contractor_type: z.enum(['individual', 'company']),
  company_name: z.string().optional(),
}).refine((data) => {
  if (data.contractor_type === 'company' && !data.company_name) {
    return false
  }
  return true
}, {
  message: 'Company name required for company type',
  path: ['company_name'],
})
```

### Cross-Field Validation

```typescript
const schema = z.object({
  start_date: z.string(),
  end_date: z.string(),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
})
```

### Custom Format Validation (PAN, IFSC, etc.)

```typescript
const schema = z.object({
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Valid PAN format required'),
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Valid IFSC code required'),
  gst: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z\d{1}$/, 'Valid GST required'),
})
```

---

## State Management Guidelines

### Simple State Pattern

```typescript
// For simple state like loading, modal open, submitting
const [isLoading, setIsLoading] = useState(false)
const [isModalOpen, setIsModalOpen] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
```

### List State Pattern

```typescript
// For managing list of items
const [items, setItems] = useState<ItemType[]>([])

// Add item
setItems([...items, newItem])

// Remove item
setItems(items.filter((item) => item.id !== id))

// Update item
setItems(items.map((item) =>
  item.id === id ? { ...item, ...updates } : item
))
```

### Multi-Step State Pattern

```typescript
const [currentStep, setCurrentStep] = useState(1)
const [completedSteps, setCompletedSteps] = useState<number[]>([])

// Mark step as completed
setCompletedSteps([...new Set([...completedSteps, currentStep])])

// Move to next
if (currentStep < totalSteps) {
  setCurrentStep(currentStep + 1)
}
```

### Form State Pattern (react-hook-form)

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  watch,
  control,
  trigger,
} = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {},
  mode: 'onChange',
})
```

---

## Error Handling & Toast Notifications

### Pattern for Form Submission

```typescript
const onSubmit = async (data: FormData) => {
  try {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create record
    const newRecord = { id: generateId(), ...data }

    // Add to mock data
    addMockData('key', newRecord)

    // Reset and notify
    reset()
    toast.success('Successfully created')

  } catch (error) {
    console.error('Error:', error)
    toast.error('Failed to create')

  } finally {
    setIsSubmitting(false)
  }
}
```

### Toast Patterns

```typescript
// Success
toast.success('Item created successfully')
toast.success(`Team "${data.name}" created`)

// Error
toast.error('Failed to create item')
toast.error('Please check your input')

// Info
toast.info('Edit functionality coming soon')

// Promise-based (for async operations)
toast.promise(
  apiCall(),
  {
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error occurred',
  }
)
```

### Error Display in Forms

```typescript
{errors.fieldName && (
  <p className="text-sm text-red-600">{errors.fieldName.message}</p>
)}
```

---

## Testing Checklist

For each screen implementation, verify:

### Functionality
- [ ] Form submits successfully with valid data
- [ ] Form shows errors with invalid data
- [ ] Modal/form resets after submission
- [ ] Delete/edit actions work correctly
- [ ] Loading states display properly
- [ ] Empty states show appropriate message
- [ ] Toast notifications appear and disappear

### UI/UX
- [ ] All form fields are visible and accessible
- [ ] Button states change during submission
- [ ] Error messages are clear and helpful
- [ ] Layout is clean and organized
- [ ] Breadcrumbs navigate correctly
- [ ] Page header displays correctly
- [ ] Responsive layout on mobile (if applicable)

### Data
- [ ] Data loads from mock data correctly
- [ ] New records have unique IDs
- [ ] Company ID is correctly set
- [ ] Timestamps are formatted correctly
- [ ] Optional fields work properly
- [ ] Conditional fields show/hide correctly

### Code Quality
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] Imports are organized
- [ ] Code follows established patterns
- [ ] Comments explain complex logic
- [ ] Variable names are descriptive

### Accessibility
- [ ] Form labels associated with inputs
- [ ] Keyboard navigation works
- [ ] Error messages have appropriate role
- [ ] Loading states announced to screen readers
- [ ] Links have proper href values

---

## Quick Implementation Checklist

When building a new screen, follow this checklist:

1. **Choose Pattern**: LIST+CREATE, FORM ONLY, or STEP FORM
2. **Create File**: In correct directory `/src/app/employer/[feature]/[page]/page.tsx`
3. **Copy Template**: Use appropriate template from above
4. **Update Names**: Replace placeholders with actual names
5. **Add Validation**: Create Zod schema with proper rules
6. **Implement Handlers**: Add submit, delete, edit handlers
7. **Mock Data**: Use correct mock data key
8. **Test**: Follow testing checklist
9. **Breadcrumbs**: Update breadcrumb paths
10. **Styling**: Ensure consistent spacing and colors

---

## File Organization

```
/src/app/employer/
  ├── [feature]/
  │   └── [page]/
  │       └── page.tsx          # Main page component
  │
/src/components/
  ├── ui/                        # shadcn/ui components
  │   ├── button.tsx
  │   ├── input.tsx
  │   ├── label.tsx
  │   ├── textarea.tsx
  │   ├── select.tsx
  │   └── ...
  └── templates/                 # Reusable template components
      ├── PageHeader.tsx
      ├── FormWrapper.tsx
      ├── DataTableWrapper.tsx
      ├── ModalFormWrapper.tsx
      └── index.ts
```

---

## Next Steps

1. Use these templates for remaining screens
2. Ensure consistency across all implementations
3. Test each screen thoroughly before launch
4. Update this document if new patterns emerge
5. Document any custom implementations

---

**Last Updated**: 2025-11-25
**Version**: 1.0
**Status**: Final for Phase 1 example screens
