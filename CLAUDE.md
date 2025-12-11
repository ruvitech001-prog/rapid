# Rapid.one EoR Platform - Claude Code Context

## Project Overview

Rapid.one is an **Employer of Record (EoR)** platform built with Next.js 14 and Supabase. It manages employees, contractors, payroll, invoices, and compliance across multiple client companies.

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State**: React Query (@tanstack/react-query v5) + Zustand
- **UI**: Tailwind CSS, Radix UI, shadcn/ui components, Tremor charts
- **Forms**: React Hook Form + Zod validation

---

## Architecture Patterns

### Service Layer (`src/lib/services/*.service.ts`)

All services extend `BaseService` which provides Supabase client:

```typescript
import { BaseService, ServiceError } from './base.service'

class MyServiceClass extends BaseService {
  async getData(): Promise<DataType[]> {
    const { data, error } = await this.supabase
      .from('table_name')
      .select('*')

    if (error) this.handleError(error)
    return data || []
  }
}

export const myService = new MyServiceClass()
```

### React Query Hooks (`src/lib/hooks/use-*.ts`)

Hooks wrap services with caching and mutations:

```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { myService } from '@/lib/services/my.service'
import { toast } from 'sonner'

export function useMyData() {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: () => myService.getData(),
    staleTime: 60000, // Always include staleTime
  })
}

export function useCreateMyData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateInput) => myService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-data'] })
      toast.success('Created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create')
    },
  })
}
```

### Page Components (`src/app/**/page.tsx`)

Pages use hooks and handle loading/error states:

```typescript
'use client'

import { useMyData, useCreateMyData } from '@/lib/hooks'
import { Loader2 } from 'lucide-react'

export default function MyPage() {
  const { data, isLoading, error } = useMyData()
  const createMutation = useCreateMyData()

  if (isLoading) {
    return <div className="flex justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  }

  // Render UI...
}
```

---

## Database Conventions

### Table Naming
- Snake_case with module prefix: `employee_employee`, `company_company`
- Junction tables: `employer_team_member`, `superadmin_role_permission`

### Common Columns
- `id`: UUID primary key
- `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
- `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
- `is_active`: BOOLEAN DEFAULT true (soft delete)

### Key Tables
| Table | Description |
|-------|-------------|
| `users_user` | Authentication users |
| `company_company` | Client companies |
| `employee_employee` | Employees |
| `contractor_contractor` | Contractors |
| `payroll_payroll_run` | Payroll runs |
| `invoice_invoice` | Invoices |
| `leave_leave_request` | Leave requests |
| `expense_expense_claim` | Expense claims |
| `employer_team` | Company teams |
| `user_preference` | User settings |

---

## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Login, signup, forgot password
│   ├── employee/          # Employee portal
│   ├── employer/          # Employer portal
│   ├── contractor/        # Contractor portal
│   ├── super-admin/       # SuperAdmin portal
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   └── [feature]/         # Feature-specific components
├── lib/
│   ├── auth/              # Auth context and utilities
│   ├── hooks/             # React Query hooks
│   ├── services/          # Supabase service layer
│   ├── queries/           # Query key factories
│   ├── supabase/          # Supabase client config
│   └── utils/             # Utility functions
└── types/                 # TypeScript types
```

---

## Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm lint                   # Run ESLint
pnpm lint:fix              # Fix lint errors
pnpm type-check            # TypeScript check

# Testing
pnpm test                   # Run Vitest
pnpm test:e2e              # Run Playwright tests

# Supabase
pnpm supabase:start        # Start local Supabase
pnpm supabase:migrate      # Push migrations
pnpm supabase:generate-types # Generate TypeScript types
```

---

## User Roles

| Role | Portal | Description |
|------|--------|-------------|
| `employee` | /employee/* | Company employees |
| `employer` | /employer/* | Company admins/HR |
| `contractor` | /contractor/* | Independent contractors |
| `superadmin` | /super-admin/* | Rapid.one staff (admin, manager, support) |

### SuperAdmin Roles
- `admin`: Full access
- `manager`: Client management
- `support`: Read-only + ticket handling

---

## Key Dependencies

- **@tanstack/react-query**: Server state management
- **@supabase/supabase-js**: Database client
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **sonner**: Toast notifications
- **lucide-react**: Icons
- **date-fns**: Date utilities
- **recharts**: Data visualization

---

## Common Patterns

### Authentication Check
```typescript
const { user, isLoading } = useAuth()
if (!user && !isLoading) redirect('/auth/login')
```

### Permission Check
```typescript
import { usePermissions } from '@/lib/hooks'

const { hasPermission } = usePermissions()
if (!hasPermission('clients.create')) {
  // Hide or disable action
}
```

### Form with Validation
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: '', email: '' },
})
```

### Loading Button
```typescript
<Button disabled={mutation.isPending}>
  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {mutation.isPending ? 'Saving...' : 'Save'}
</Button>
```

---

## Supabase MCP

This project has Supabase MCP configured. Use it for:
- Checking database schema: `mcp__supabase__list_tables`
- Running queries: `mcp__supabase__execute_sql`
- Applying migrations: `mcp__supabase__apply_migration`
- Checking advisors: `mcp__supabase__get_advisors`

---

## Important Notes

1. **Always use 'use client'** for components with hooks
2. **Always include staleTime** in useQuery options
3. **Use toast from 'sonner'** for notifications
4. **Extend BaseService** for new services
5. **Export from index files** - update `src/lib/services/index.ts` and `src/lib/hooks/index.ts`
6. **No localStorage** - all user data persists to Supabase
7. **No demo mode** - removed, use real Supabase auth
