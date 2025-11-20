# Components

## Overview
Reusable React components organized by role and complexity.

## Structure
```
components/
├── ui/           # Base UI components (shadcn/ui)
├── auth/         # Authentication components
├── employer/     # Employer-specific components
├── employee/     # Employee-specific components
├── contractor/   # Contractor-specific components
├── shared/       # Shared components across roles
└── forms/        # Reusable form components
```

## Component Types

### 1. UI Components (`ui/`)
Base components from shadcn/ui:
- Button, Input, Card, Dialog
- Form, Select, Checkbox, Radio
- Table, DataTable
- Toast, Alert, Badge

**Installation**:
```bash
npx shadcn-ui@latest add button
```

### 2. Role-Specific Components
Components used by specific user types:
- `employer/` - Employee lists, contract forms, analytics
- `employee/` - Onboarding wizard, tax forms, requests
- `contractor/` - Timesheets, invoice generator

### 3. Shared Components (`shared/`)
Used across all user types:
- Sidebar, Navbar
- Loading states
- Error boundaries
- Data tables

### 4. Form Components (`forms/`)
Reusable form sections:
- Address form
- Bank details form
- Family details form

## Usage

### Server Components (Default)
```typescript
// components/my-component.tsx
export function MyComponent({ data }: Props) {
  return <div>{data.title}</div>
}
```

### Client Components (Interactive)
```typescript
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## Best Practices
- ✅ Use TypeScript for all components
- ✅ Extract complex logic to custom hooks
- ✅ Keep components small (< 200 lines)
- ✅ Use Server Components when possible
- ✅ Add 'use client' only when needed (state, effects, browser APIs)
- ✅ Co-locate styles with components (Tailwind)

## Naming Conventions
- **Files**: kebab-case (`login-form.tsx`)
- **Components**: PascalCase (`LoginForm`)
- **Props interfaces**: `ComponentNameProps`

