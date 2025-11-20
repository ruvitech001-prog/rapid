# Source Code Organization

## Overview

This directory contains all source code for the Rapid.one Next.js application. The structure follows Next.js 14 App Router conventions with clear separation of concerns.

---

## 📁 Directory Structure

```
src/
├── app/             # Next.js App Router (routing, pages, API)
├── components/      # Reusable UI components
├── lib/             # Core utilities, services, integrations
├── hooks/           # Custom React hooks
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── schemas/         # Zod validation schemas
├── constants/       # Application constants
├── config/          # App configuration
└── middleware.ts    # Next.js middleware (authentication)
```

---

## 📂 Detailed Breakdown

### `app/` - App Router
**Purpose:** Next.js routing, page components, and API routes

**Sub-directories:**
- `(auth)/` - Public authentication routes
- `(employer)/` - Employer dashboard routes (protected)
- `(employee)/` - Employee dashboard routes (protected)
- `(contractor)/` - Contractor dashboard routes (protected)
- `api/` - API route handlers

**Key Files:**
- `layout.tsx` - Root layout (applies to all pages)
- `page.tsx` - Home page
- `globals.css` - Global styles
- `providers.tsx` - Client-side provider wrappers

**Learn more:** [app/README.md](./app/README.md)

---

### `components/` - UI Components
**Purpose:** Reusable React components organized by role and complexity

**Sub-directories:**
- `ui/` - Base UI components (shadcn/ui)
- `auth/` - Authentication components
- `employer/` - Employer-specific components
- `employee/` - Employee-specific components
- `contractor/` - Contractor-specific components
- `shared/` - Shared components across roles
- `forms/` - Reusable form components

**Learn more:** [components/README.md](./components/README.md)

---

### `lib/` - Core Libraries
**Purpose:** Utilities, services, and external integrations

**Sub-directories:**
- `supabase/` - Supabase client configuration
- `services/` - Business logic services
- `integrations/` - External API clients
- `utils/` - Utility functions

**Key Services:**
- `salary-calculator.ts` - CTC breakdown calculations
- `tax-calculator.ts` - Indian tax slab calculations
- `leave-balance.ts` - Leave balance management
- `contract-generator.ts` - Contract document generation

**Key Integrations:**
- `springscan.ts` - eKYC verification API
- `signeasy.ts` - E-signature API
- `sendgrid.ts` - Email service API

**Learn more:** [lib/README.md](./lib/README.md)

---

### `hooks/` - Custom React Hooks
**Purpose:** Reusable stateful logic

**Common Hooks:**
- `use-user.ts` - Current user data and auth state
- `use-auth.ts` - Authentication helpers
- `use-company.ts` - Company data access
- `use-toast.ts` - Toast notifications
- `use-debounce.ts` - Input debouncing

**Example Usage:**
```typescript
import { useUser } from '@/hooks/use-user'

function MyComponent() {
  const { user, isLoading } = useUser()

  if (isLoading) return <Loading />
  return <div>Welcome, {user.name}</div>
}
```

---

### `store/` - State Management (Zustand)
**Purpose:** Global application state

**Store Slices:**
- `auth-store.ts` - Authentication state
- `user-store.ts` - User profile data
- `company-store.ts` - Company data
- `ui-store.ts` - UI state (modals, toasts, loading)

**Example Usage:**
```typescript
import { useAuthStore } from '@/store/auth-store'

function LoginButton() {
  const { login, isAuthenticated } = useAuthStore()

  if (isAuthenticated) return <LogoutButton />
  return <button onClick={login}>Login</button>
}
```

**Why Zustand?**
- Simpler than Redux
- Better TypeScript support
- Less boilerplate
- Smaller bundle size

---

### `types/` - TypeScript Types
**Purpose:** Type definitions for type-safe development

**Key Files:**
- `database.ts` - Supabase database types (auto-generated)
- `api.ts` - API request/response types
- `employee.ts` - Employee-related types
- `contractor.ts` - Contractor-related types
- `company.ts` - Company-related types

**Generation:**
```bash
# Auto-generate from Supabase schema
pnpm supabase:generate-types
```

---

### `schemas/` - Validation Schemas (Zod)
**Purpose:** Form and data validation

**Key Files:**
- `auth.ts` - Authentication form schemas
- `employee.ts` - Employee form schemas
- `tax.ts` - Tax declaration schemas
- `contract.ts` - Contract form schemas

**Example:**
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export type LoginInput = z.infer<typeof loginSchema>
```

---

### `constants/` - Application Constants
**Purpose:** Centralized constant values

**Key Files:**
- `routes.ts` - Route path constants
- `api-endpoints.ts` - API endpoint URLs
- `leave-types.ts` - Leave type options
- `tax-slabs.ts` - Indian tax slab data
- `user-roles.ts` - User role definitions

**Example:**
```typescript
// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EMPLOYER: {
    DASHBOARD: '/dashboard',
    EMPLOYEES: '/employees',
    SETTINGS: '/settings'
  }
} as const
```

---

### `config/` - App Configuration
**Purpose:** Application-wide configuration

**Key Files:**
- `site.ts` - Site metadata (name, description, URLs)
- `navigation.ts` - Navigation structure

**Example:**
```typescript
// config/site.ts
export const siteConfig = {
  name: 'Rapid.one',
  description: 'Employer of Record Platform',
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/rapidone',
    github: 'https://github.com/rapidone'
  }
}
```

---

### `middleware.ts` - Route Protection
**Purpose:** Authentication and authorization checks

**Functionality:**
- Verify Supabase session
- Redirect unauthenticated users to login
- Role-based route protection
- Refresh expired tokens

**Example:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient({ request })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}
```

---

## 🔄 Data Flow

### 1. User Request
```
User → Next.js Page → React Component
```

### 2. Data Fetching
```
Component → Hook → Supabase Client → Database
```

### 3. Business Logic
```
Component → Service Layer → External API/Database
```

### 4. State Management
```
Component → Zustand Store → All Subscribed Components
```

---

## 🎨 Code Organization Principles

### 1. **Separation of Concerns**
- **Components:** UI presentation only
- **Hooks:** Stateful logic
- **Services:** Business logic
- **Utils:** Pure functions

### 2. **Naming Conventions**
- **Components:** PascalCase (`LoginForm.tsx`)
- **Hooks:** camelCase with `use` prefix (`useAuth.ts`)
- **Utils:** camelCase (`formatCurrency.ts`)
- **Constants:** SCREAMING_SNAKE_CASE (`API_BASE_URL`)

### 3. **File Structure**
```
feature/
├── index.ts           # Public exports
├── component.tsx      # Component implementation
├── hooks.ts           # Related hooks
├── types.ts           # Type definitions
└── utils.ts           # Utility functions
```

### 4. **Import Order**
```typescript
// 1. External libraries
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Internal absolute imports
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// 3. Relative imports
import { localFunction } from './utils'
```

---

## 📝 Best Practices

### Components
- ✅ Use TypeScript for all components
- ✅ Extract complex logic to custom hooks
- ✅ Keep components small and focused
- ✅ Use Server Components by default
- ✅ Add 'use client' only when needed

### State Management
- ✅ Use Zustand for global state
- ✅ Use React state for local component state
- ✅ Use Server Components for data fetching when possible

### Forms
- ✅ Use React Hook Form + Zod
- ✅ Define schemas in `schemas/` directory
- ✅ Extract reusable form components

### Error Handling
- ✅ Use error boundaries for component errors
- ✅ Display user-friendly error messages
- ✅ Log errors for debugging

---

## 🔗 Related Documentation

- [App Router Structure](./app/README.md)
- [Component Library](./components/README.md)
- [Library Functions](./lib/README.md)
- [API Documentation](./app/api/README.md)

---

**Questions?** Check the [main README](../README.md) or project documentation in `/docs`
