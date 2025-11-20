# Library Functions

## Overview
Core utilities, services, and external integrations.

## Structure
```
lib/
├── supabase/        # Supabase client setup
├── services/        # Business logic services
├── integrations/    # External API clients
└── utils/           # Utility functions
```

## Supabase Clients
Different clients for different environments:

```typescript
// Browser client (Client Components)
import { createClientComponentClient } from './supabase/client'

// Server client (Server Components)
import { createServerComponentClient } from './supabase/server'

// Middleware client
import { createMiddlewareClient } from './supabase/middleware'
```

## Services
Business logic layer (pure functions):

### Salary Calculator
```typescript
import { calculateCTCBreakdown } from '@/lib/services/salary-calculator'

const breakdown = calculateCTCBreakdown(480000) // basic salary
// Returns: { basic, hra, epf, gratuity, gross, ctc }
```

### Tax Calculator
```typescript
import { calculateTax } from '@/lib/services/tax-calculator'

const tax = calculateTax(income, deductions, regime)
// Calculates Indian income tax
```

## Integrations
External API clients:

### SpringScan (eKYC)
```typescript
import { springscan } from '@/lib/integrations/springscan'

const result = await springscan.verifyDocument({
  type: 'aadhaar',
  number: '123456789012'
})
```

### SignEasy (E-Signature)
```typescript
import { signeasy } from '@/lib/integrations/signeasy'

const agreement = await signeasy.createRequest({
  documentUrl: 'https://...',
  signerEmail: 'employee@example.com'
})
```

## Utils
Helper functions:

```typescript
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

// Class names utility (for Tailwind)
const className = cn('text-sm', isActive && 'font-bold')

// Currency formatting
formatCurrency(1000) // '₹1,000.00'

// Date formatting
formatDate(new Date(), 'MMM dd, yyyy') // 'Nov 12, 2025'
```

## Best Practices
- ✅ Keep functions pure (no side effects)
- ✅ Use TypeScript for type safety
- ✅ Add JSDoc comments
- ✅ Write unit tests for services
- ✅ Handle errors gracefully

