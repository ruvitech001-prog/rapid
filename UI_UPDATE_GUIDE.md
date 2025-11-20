# UI/UX Update Guide - Rapid.one

## ✅ Completed Pages (9 pages)

### Foundation
- ✅ Sidebar Component (`/src/components/sidebar.tsx`)
- ✅ Header Component (`/src/components/header.tsx`)
- ✅ DataTable Component (`/src/components/data-table.tsx`)
- ✅ 13 Core UI Components (Button, Card, Input, Label, etc.)

### Layouts (3)
- ✅ Employer Layout (`/src/app/employer/layout.tsx`)
- ✅ Employee Layout (`/src/app/employee/layout.tsx`)
- ✅ Contractor Layout (`/src/app/contractor/layout.tsx`)

### Pages (3)
- ✅ Employer Dashboard (`/src/app/employer/dashboard/page.tsx`)
- ✅ Login Page (`/src/app/auth/login/page.tsx`)
- ✅ Signup Page (`/src/app/auth/signup/page.tsx`)
- ✅ Payroll Dashboard (`/src/app/employer/payroll/dashboard/page.tsx`)

---

## 📋 Remaining Pages to Update (43 pages)

### Pattern: How to Update Pages

Every page should follow this structure:

```typescript
'use client'

import { useState } from 'react'
import { [Icons] from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

// Use shadow classes with the sidebar automatically
// Your layout already has Sidebar + Header, so just focus on content

export default function PageName() {
  return (
    <div className="space-y-8">
      {/* Page Title and Main CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
          <p className="text-muted-foreground mt-2">Description</p>
        </div>
        <Button size="lg">Primary Action</Button>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards, Tables, etc. */}
      </div>
    </div>
  )
}
```

### Key Styling Rules

1. **Spacing**: Use `space-y-8` for sections, `gap-6` for grids
2. **Colors**: Use `primary` for main actions (automatically #642DFC)
3. **Icons**: Import from `lucide-react`
4. **Cards**: Wrap content in `<Card>` components
5. **No extra background**: Don't add `bg-gray-50` - layout handles it
6. **No manual padding**: Layout p-6 is already applied

---

## 🔧 Quick Update Checklist

For each page:

- [ ] Replace old gray colors with semantic colors (primary, muted-foreground, etc.)
- [ ] Replace HTML tables with `<DataTable>` component
- [ ] Replace div cards with `<Card>` components
- [ ] Replace button elements with `<Button>` component
- [ ] Replace input elements with `<Input>` component
- [ ] Add `'use client'` at top
- [ ] Remove background colors from page container
- [ ] Add proper spacing with `space-y-` and `gap-` utilities
- [ ] Test responsive design (grid-cols-1, md:grid-cols-2, lg:grid-cols-3)

---

## 📄 Pages by Category

### Authentication (5 remaining)
- [ ] `/auth/forgot-password/page.tsx`
- [ ] `/auth/reset-password/page.tsx`
- [ ] `/auth/verify-email/page.tsx`
- [ ] `/auth/company-onboarding/page.tsx`
- [ ] `/auth/layout.tsx` - Update to remove old styling

### Employer - Employees (4)
- [ ] `/employer/employees/page.tsx` - List employees
- [ ] `/employer/employees/new/page.tsx` - Create employee form
- [ ] `/employer/employees/[id]/page.tsx` - View employee
- [ ] `/employer/employees/[id]/edit/page.tsx` - Edit employee

### Employer - Contractors (3)
- [ ] `/employer/contractors/page.tsx` - List contractors
- [ ] `/employer/contractors/new/page.tsx` - Create contractor
- [ ] `/employer/contractors/timesheets/page.tsx` - Timesheets

### Employer - Leave Management (3)
- [ ] `/employer/leave/requests/page.tsx` - Leave requests
- [ ] `/employer/leave/calendar/page.tsx` - Leave calendar
- [ ] `/employer/leave/settings/page.tsx` - Leave settings

### Employer - Expenses (1)
- [ ] `/employer/expenses/requests/page.tsx` - Expense requests

### Employer - Payroll (2)
- [ ] `/employer/payroll/run/page.tsx` - Run payroll form
- [ ] `/employer/payroll/salary-structure/page.tsx` - Salary config

### Employer - Attendance (1)
- [ ] `/employer/attendance/report/page.tsx` - Attendance report

### Employer - Compliance (2)
- [ ] `/employer/compliance/epf/page.tsx` - EPF reports
- [ ] `/employer/compliance/tds/page.tsx` - TDS reports

### Employer - Other (5)
- [ ] `/employer/reports/page.tsx` - Reports
- [ ] `/employer/settings/page.tsx` - Employer settings
- [ ] `/employer/clients/page.tsx` - Clients management
- [ ] `/employer/access-control/page.tsx` - Access control
- [ ] `/employer/audit-logs/page.tsx` - Audit logs

### Employee (18)
- [ ] `/employee/dashboard/page.tsx` - Employee dashboard
- [ ] `/employee/profile/page.tsx` - Profile
- [ ] `/employee/notifications/page.tsx` - Notifications
- [ ] `/employee/leave/apply/page.tsx` - Apply for leave
- [ ] `/employee/leave/history/page.tsx` - Leave history
- [ ] `/employee/expenses/submit/page.tsx` - Submit expense
- [ ] `/employee/expenses/history/page.tsx` - Expense history
- [ ] `/employee/payslips/page.tsx` - Payslips list
- [ ] `/employee/tax/declaration/page.tsx` - Tax declaration
- [ ] `/employee/tax/proofs/page.tsx` - Tax proofs
- [ ] `/employee/tax/form16/page.tsx` - Form 16
- [ ] `/employee/attendance/clockin/page.tsx` - Clock in/out
- [ ] `/employee/attendance/history/page.tsx` - Attendance history
- [ ] `/employee/attendance/regularization/page.tsx` - Regularization
- [ ] `/employee/documents/library/page.tsx` - Document library
- [ ] `/employee/documents/upload/page.tsx` - Document upload
- [ ] `/employee/documents/esign/[id]/page.tsx` - E-sign document

### Contractor (4)
- [ ] `/contractor/dashboard/page.tsx` - Contractor dashboard
- [ ] `/contractor/timesheets/submit/page.tsx` - Submit timesheet
- [ ] `/contractor/invoices/page.tsx` - Invoices list

---

## 🎨 Component Usage Examples

### Stat Card Pattern
```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Title</p>
        <p className="text-3xl font-bold mt-2">Value</p>
        <p className="text-sm text-muted-foreground mt-2">Subtitle</p>
      </div>
      <div className="p-3 rounded-lg bg-primary/10 text-primary">
        <Icon className="h-8 w-8" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Table Pattern
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search..."
    />
  </CardContent>
</Card>
```

### Action Buttons Pattern
```tsx
<div className="flex gap-3">
  <Button>Primary Action</Button>
  <Button variant="outline">Secondary</Button>
  <Button variant="ghost" size="sm">Tertiary</Button>
</div>
```

### Status Badge Pattern
```tsx
const statusConfig = {
  active: { label: 'Active', class: 'bg-green-100 text-green-800' },
  pending: { label: 'Pending', class: 'bg-orange-100 text-orange-800' },
  inactive: { label: 'Inactive', class: 'bg-gray-100 text-gray-800' },
}
const config = statusConfig[status]
return <Badge variant="outline" className={config.class}>{config.label}</Badge>
```

### Form Pattern
```tsx
<Card>
  <CardHeader>
    <CardTitle>Form Title</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="field">Field Label</Label>
        <Input id="field" placeholder="..." />
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  </CardContent>
</Card>
```

---

## 🎯 Priority Order

Start with these pages (high traffic, high impact):

1. **Employees Page** (`/employer/employees/page.tsx`) - DataTable example
2. **Leave Requests** (`/employer/leave/requests/page.tsx`) - Approval workflow
3. **Expense Requests** (`/employer/expenses/requests/page.tsx`) - Similar to leaves
4. **Employee Dashboard** (`/employee/dashboard/page.tsx`) - Employee view
5. **Reports Page** (`/employer/reports/page.tsx`) - Dashboard-style

---

## 🚀 How to Update a Page Fast

### For List/Table Pages:
1. Replace table HTML with DataTable import
2. Create ColumnDef array
3. Wrap in Card
4. Add filters/search in DataTable props
5. Add action buttons in last column

### For Form Pages:
1. Use Card wrapper
2. Import Input, Label, Button, Checkbox, Textarea from @/components/ui
3. Use space-y-6 for form spacing
4. Add Input with Label for each field
5. Add Button with size="lg" className="w-full" for submit

### For Dashboard Pages:
1. Use StatCard pattern
2. Create icon from lucide-react
3. Grid with grid-cols-1 md:grid-cols-2 lg:grid-cols-4
4. Add Card sections below stats

---

## 🔄 Color Reference

### Primary Color (Your Brand): #642DFC
- Use `text-primary` and `bg-primary` for main actions
- Use `text-primary/90` and `bg-primary/10` for variations

### Semantic Colors:
- `text-muted-foreground` - Labels, hints, secondary text
- `bg-muted/50` - Hover states, backgrounds
- `border-border` - All borders
- `bg-destructive` - Error/delete actions
- `bg-green-100 text-green-800` - Success status

---

## ✨ Final Notes

All pages automatically inherit:
- ✅ Professional Sidebar with navigation
- ✅ Sticky Header with search & notifications
- ✅ Responsive design (mobile-first)
- ✅ Dark mode ready
- ✅ Proper spacing and padding
- ✅ Brand color (#642DFC) throughout

Just focus on the content structure - the layout system handles the rest!

---

**Last Updated**: 2025-11-20
**Total Progress**: 9/52 pages (17%)
**Remaining**: 43 pages to update
