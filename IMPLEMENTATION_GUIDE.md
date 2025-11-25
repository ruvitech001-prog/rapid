# 📚 Implementation Guide - 16 Critical Screens

This guide provides patterns and best practices for building the 16 critical screens in parallel using the mock data infrastructure.

---

## 🎯 QUICK START CHECKLIST

Before building any screen:

- [ ] Read the screen requirements from IMPLEMENTATION_TRACKER.md
- [ ] Review the Design System Reference (below)
- [ ] Create the route file (e.g., `/app/employer/settings/teams/page.tsx`)
- [ ] Use component templates from `/src/components/templates/`
- [ ] Integrate mock data from `/src/lib/mock-data/`
- [ ] Follow the TypeScript patterns (strict mode)
- [ ] Test on mobile (320px), tablet (768px), desktop
- [ ] Run the QA checklist before marking complete

---

## 📐 DESIGN SYSTEM

### Colors (Tailwind CSS)
```
Primary Action: blue-600
Secondary Action: blue-500
Success: green-600
Warning: amber-600
Danger: red-600
Neutral: gray-500
Background: gray-50
Border: gray-200
Text Primary: gray-900
Text Secondary: gray-600
Text Muted: gray-500
```

### Typography
```
Page Title (H1): text-3xl font-bold text-gray-900
Section Title (H2): text-2xl font-semibold text-gray-900
Subsection (H3): text-xl font-semibold text-gray-900
Body Text: text-base text-gray-900
Small Text: text-sm text-gray-600
Labels: text-sm font-medium text-gray-700
Descriptions: text-sm text-gray-600
```

### Spacing (Tailwind Scale)
```
xs: 4px (p-1)
sm: 8px (p-2)
md: 16px (p-4)
lg: 24px (p-6)
xl: 32px (p-8)
2xl: 48px (p-12)

Standard page padding: p-6 (24px)
Standard section gap: gap-4 (16px)
```

### Components to Use
```
✅ Use from shadcn/ui:
  - Button, Input, Select, Textarea
  - Card, CardHeader, CardTitle, CardContent
  - Dialog, AlertDialog
  - Tabs, Badge
  - Table (TanStack Table)
  - Form (React Hook Form)
  - Checkbox, RadioGroup
  - Label
  - Alert

✅ Use from lucide-react for icons:
  - ChevronRight, ChevronDown, ChevronUp
  - Plus, Edit, Trash2, Eye, EyeOff
  - Calendar, Clock, User, Settings
  - AlertCircle, CheckCircle, XCircle
  - Search, Filter, Download, Upload
  - etc.

❌ Don't use:
  - Custom styled divs
  - Inline styles
  - Non-shadcn UI components
```

---

## 🏗️ PAGE STRUCTURE PATTERN

Every page should follow this structure:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { PageHeader, FormWrapper, DataTableWrapper } from '@/components/templates'
import { getMockDataByCompany, updateMockData } from '@/lib/services/mock-api'
import { getCurrentMockCompany } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ScreenNamePage() {
  const company = getCurrentMockCompany()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. Load mock data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Get mock data
        const mockData = getMockDataByCompany('key', company.id)
        setData(mockData)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [company.id])

  // 2. Handle actions
  const handleSubmit = async (formData: any) => {
    try {
      // Process form
      console.log('Form submitted:', formData)
      toast.success('Action completed successfully')
      // Update mock data
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to complete action')
    }
  }

  // 3. Render
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Screen Title"
        description="Short description"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Screen Name' }
        ]}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            + New Item
          </Button>
        }
      />

      <DataTableWrapper
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'date', label: 'Date' },
        ]}
        data={data}
        isLoading={isLoading}
      />

      {/* Modal for creating/editing */}
      {isModalOpen && (
        <ModalFormWrapper
          title="Create New Item"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => handleSubmit({})}
        >
          {/* Form fields here */}
        </ModalFormWrapper>
      )}
    </div>
  )
}
```

---

## 📝 FORM PATTERNS

### Pattern 1: Simple Form with Zod Validation

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 1. Define Zod schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  amount: z.number().positive('Amount must be positive'),
})

type FormData = z.infer<typeof formSchema>

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    // Handle submission
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter name"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Amount Field */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          {...register('amount', { valueAsNumber: true })}
          placeholder="0"
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
```

### Pattern 2: Form with Select Dropdown

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SelectFormField() {
  const [value, setValue] = useState('')

  return (
    <div className="space-y-2">
      <Label htmlFor="select">Choose Option</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

### Pattern 3: Form with Checkboxes

```typescript
import { Checkbox } from '@/components/ui/checkbox'

export function CheckboxFormField() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="agree"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label htmlFor="agree">I agree to the terms</Label>
    </div>
  )
}
```

---

## 🎨 COMMON COMPONENTS

### Status Badge

```typescript
import { Badge } from '@/components/ui/badge'

// Usage
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Rejected</Badge>
<Badge variant="outline">Draft</Badge>
```

### Loading State

```typescript
import { Card } from '@/components/ui/card'

if (isLoading) {
  return (
    <Card className="p-8">
      <div className="flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    </Card>
  )
}
```

### Empty State

```typescript
import { AlertCircle } from 'lucide-react'

return (
  <Card className="p-12">
    <div className="text-center space-y-4">
      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
      <div>
        <h3 className="font-semibold text-gray-900">No data found</h3>
        <p className="text-gray-600 text-sm">Try adjusting your filters</p>
      </div>
    </div>
  </Card>
)
```

### Alert/Error Display

```typescript
import { Alert, AlertDescription } from '@/components/ui/alert'

<Alert variant="destructive">
  <AlertDescription>
    This action cannot be undone
  </AlertDescription>
</Alert>
```

---

## 📊 DATA TABLE PATTERNS

### Simple Table

```typescript
import { DataTableWrapper } from '@/components/templates'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'

<DataTableWrapper
  title="Employees"
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]}
  data={employees}
  isLoading={isLoading}
  onRowClick={(item) => handleRowClick(item)}
/>
```

---

## 🔗 MOCK DATA INTEGRATION PATTERNS

### Pattern 1: Get Data by Company

```typescript
import { getMockDataByCompany, getCurrentMockCompany } from '@/lib/mock-data'

const company = getCurrentMockCompany()
const employees = getMockDataByCompany('employees', company.id)
```

### Pattern 2: Create New Item

```typescript
import { addMockData, generateId } from '@/lib/mock-data'

const newEmployee = {
  id: generateId(),
  company_id: company.id,
  name: formData.name,
  email: formData.email,
  // ... other fields
}

addMockData('employees', newEmployee)
```

### Pattern 3: Update Item

```typescript
import { updateMockData } from '@/lib/services/mock-api'

const updated = updateMockData('employees', employeeId, {
  name: newName,
  email: newEmail,
})
```

### Pattern 4: Delete Item

```typescript
import { deleteMockData } from '@/lib/services/mock-api'

const deleted = deleteMockData('employees', employeeId)
```

---

## ✅ TESTING CHECKLIST

Before submitting a screen for review:

```
FUNCTIONALITY:
☐ All mock data loads without console errors
☐ List displays all data correctly
☐ Filtering works (if implemented)
☐ Sorting works (if implemented)
☐ Create form validates correctly
☐ Create form submits and updates data
☐ Edit form shows current values
☐ Edit form saves changes
☐ Delete shows confirmation
☐ Delete removes item

DESIGN:
☐ Page title is present
☐ Breadcrumbs are present (if applicable)
☐ Uses only shadcn/ui components
☐ Colors match design system
☐ Spacing is consistent (4, 8, 16, 24px)
☐ Typography matches design system
☐ Icons are from lucide-react

RESPONSIVE:
☐ Looks good on mobile (320px)
☐ Looks good on tablet (768px)
☐ Looks good on desktop (1440px)
☐ No horizontal scrolling on mobile

CODE QUALITY:
☐ TypeScript strict mode passes
☐ No console warnings
☐ No console errors
☐ No `any` types
☐ Props are typed
☐ Component names match PascalCase
☐ Functions use camelCase
☐ Comments on complex logic

ACCESSIBILITY:
☐ Form labels present
☐ Buttons have clear labels
☐ Color not only way to convey info
☐ Keyboard navigation works
☐ Tab order is logical
```

---

## 🚀 SCREEN BUILDING WORKFLOW

1. **Create Route File**
   ```bash
   Create: src/app/(employer|employee|contractor)/[feature]/[screen]/page.tsx
   ```

2. **Copy Template Structure**
   - Use PageHeader for title
   - Use FormWrapper or DataTableWrapper
   - Import required UI components

3. **Integrate Mock Data**
   - Import getMockDataByCompany
   - Load data in useEffect
   - Handle loading/error states

4. **Add Functionality**
   - Create form or list logic
   - Add create/edit/delete handlers
   - Add validation with Zod

5. **Style & Design**
   - Use Tailwind classes
   - Match design system colors/spacing
   - Add icons from lucide-react

6. **Test on All Breakpoints**
   - Mobile: 320px
   - Tablet: 768px
   - Desktop: 1440px

7. **Run QA Checklist**
   - Check all boxes before submitting

8. **Update IMPLEMENTATION_TRACKER**
   - Mark screen as complete
   - Add notes if any issues

---

## 🎓 EXAMPLE: Building a Simple List Screen

### File: `src/app/employer/employees/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { PageHeader, DataTableWrapper } from '@/components/templates'
import { getMockDataByCompany, getCurrentMockCompany } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function EmployeesPage() {
  const company = getCurrentMockCompany()
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      setIsLoading(true)
      const data = getMockDataByCompany('employees', company.id)
      setEmployees(data)
    } catch (error) {
      console.error('Error loading employees:', error)
      toast.error('Failed to load employees')
    } finally {
      setIsLoading(false)
    }
  }, [company.id])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Employees"
        description="Manage your company employees"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Employees' },
        ]}
        actions={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        }
      />

      <DataTableWrapper
        columns={[
          { key: 'first_name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'designation', label: 'Designation' },
          {
            key: 'status',
            label: 'Status',
            render: (status) => (
              <Badge
                variant={
                  status === 'active'
                    ? 'default'
                    : status === 'probation'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {status}
              </Badge>
            ),
          },
        ]}
        data={employees}
        isLoading={isLoading}
        emptyMessage="No employees found. Create one to get started."
      />
    </div>
  )
}
```

---

## 📞 COMMON ISSUES & SOLUTIONS

### Issue: Mock data not loading
**Solution**: Check that company.id is being passed correctly
```typescript
const data = getMockDataByCompany('employees', company.id)
console.log('Company ID:', company.id, 'Data length:', data.length)
```

### Issue: Form validation errors not showing
**Solution**: Ensure error messages are rendered
```typescript
{errors.fieldName && (
  <p className="text-sm text-red-600">{errors.fieldName.message}</p>
)}
```

### Issue: Page not responsive on mobile
**Solution**: Check Tailwind classes and use responsive prefixes
```typescript
<div className="p-4 md:p-6 lg:p-8"> {/* Mobile first */}
  <h1 className="text-xl md:text-2xl lg:text-3xl">
```

### Issue: Toast notifications not showing
**Solution**: Ensure `import { toast } from 'sonner'` is present
```typescript
toast.success('Action completed')
toast.error('Something went wrong')
```

---

## 🎁 Quick Copy-Paste Snippets

### Page wrapper
```tsx
<div className="p-6 max-w-7xl mx-auto space-y-6">
  {/* Content */}
</div>
```

### Form section
```tsx
<div className="space-y-2">
  <Label>Field Label</Label>
  <Input placeholder="..." />
</div>
```

### Button group
```tsx
<div className="flex gap-2 justify-end">
  <Button variant="outline">Cancel</Button>
  <Button>Submit</Button>
</div>
```

---

**Need help?** Review this guide and the example screens as you build.
