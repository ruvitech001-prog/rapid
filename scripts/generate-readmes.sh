#!/bin/bash

# Script to generate all README.md files for the project structure
# This ensures every folder has documentation explaining its purpose

BASE_DIR="/Users/expr/Documents/2025/rapid/aether"

# Function to create README file
create_readme() {
    local file_path="$1"
    local content="$2"

    echo "$content" > "$file_path"
    echo "✓ Created: $file_path"
}

echo "Generating README files for Rapid.one Next.js project..."
echo "=============================================="

# Public folder README
create_readme "$BASE_DIR/public/README.md" "# Public Assets

## Purpose
Static files served directly by Next.js without processing.

## Structure
\`\`\`
public/
├── icons/      # App icons, favicon.ico
├── images/     # Static images (logo, illustrations)
└── fonts/      # Custom web fonts (if any)
\`\`\`

## Usage
Files in this folder are accessible from the root URL.

Example:
- \`public/logo.png\` → accessible at \`/logo.png\`
- \`public/icons/favicon.ico\` → \`/icons/favicon.ico\`

## Best Practices
- ✅ Optimize images before adding (use next/image for dynamic images)
- ✅ Use descriptive filenames
- ✅ Keep file sizes small
- ❌ Don't put sensitive data here (publicly accessible)
"

# App Router README
create_readme "$BASE_DIR/src/app/README.md" "# App Router Structure

## Overview
Next.js 14 App Router with file-based routing and route groups.

## Route Groups (Parentheses)
- \`(auth)/\` - Public authentication routes (no sidebar)
- \`(employer)/\` - Employer dashboard (with sidebar)
- \`(employee)/\` - Employee dashboard (with sidebar)
- \`(contractor)/\` - Contractor dashboard (with sidebar)

Route groups don't affect URLs - they're for layout organization.

## Key Files
- \`layout.tsx\` - Root layout (wraps entire app)
- \`page.tsx\` - Home page (\`/\`)
- \`globals.css\` - Global styles
- \`providers.tsx\` - Client component wrappers

## Dynamic Routes
Use square brackets for dynamic segments:
- \`[id]/\` - Dynamic employee ID
- \`[slug]/\` - Dynamic content slug

## API Routes
- Located in \`api/\` directory
- Use \`route.ts\` files
- Support HTTP methods (GET, POST, PATCH, DELETE)

Learn more: https://nextjs.org/docs/app/building-your-application/routing
"

# Auth routes README
create_readme "$BASE_DIR/src/app/(auth)/README.md" "# Authentication Routes

## Overview
Public routes for user authentication and registration.

## Routes
- \`/login\` - User login page
- \`/signup\` - Company signup
- \`/forgot-password\` - Password reset request
- \`/reset-password\` - Password reset confirmation
- \`/company-onboarding\` - New company onboarding flow
- \`/verify-email\` - Email verification page

## Layout
Uses a simplified layout without sidebar or navigation.
See \`layout.tsx\` in this directory.

## Features
- Email/password authentication
- Google OAuth integration
- Password strength validation
- Email verification required
- Rate limiting on login attempts

## Related
- Auth logic: \`src/lib/supabase/\`
- Auth hooks: \`src/hooks/use-auth.ts\`
- Auth store: \`src/store/auth-store.ts\`
"

# Employer routes README
create_readme "$BASE_DIR/src/app/(employer)/README.md" "# Employer Dashboard Routes

## Overview
Protected routes for employer/company administrators.

## Access Control
- Requires authentication
- User type: \`employer\`
- Roles: Admin, HR Manager, Approver

## Main Routes
- \`/dashboard\` - Main employer dashboard with analytics
- \`/employees\` - Employee list and management
- \`/contractors\` - Contractor list and management
- \`/requests\` - Leave and expense approval queue
- \`/settings\` - Company settings and configuration

## Features
### Dashboard
- Employee count, pending requests
- Recent activities
- Quick actions (create contract, invite employee)
- Analytics charts

### Employee Management
- View all employees
- Create employment contracts
- Edit employee details
- Track onboarding status

### Request Management
- Approve/reject leave requests
- Approve/reject expense claims
- Magic link approvals (email-based)

### Settings
- Company profile
- Team management
- User access control (invite HR managers)
- Leave policies
- Expense policies
- Holiday calendar

## Related Components
- \`src/components/employer/\`
"

# Employee routes README
create_readme "$BASE_DIR/src/app/(employee)/README.md" "# Employee Dashboard Routes

## Overview
Protected routes for employee users.

## Access Control
- Requires authentication
- User type: \`employee\`

## Main Routes
- \`/dashboard\` - Employee dashboard and onboarding checklist
- \`/profile\` - Personal profile management
- \`/tax\` - Tax declaration and submission
- \`/requests\` - Leave, expense, and referral requests

## Features
### Dashboard
- Onboarding checklist (7 steps)
- eKYC verification status
- Offer letter view
- E-signature for employment agreement

### Profile
- Personal details (name, DOB, contact)
- Family details (spouse, children, parents)
- Bank account information
- Document uploads (Aadhaar, PAN, etc.)
- Nominee management (insurance, gratuity)

### Tax Management
- Tax regime selection (Old vs New)
- Investment declaration (80C, 80D, etc.)
- HRA exemption calculation
- Previous employer income
- Property income declaration
- LTA travel claims
- Proof submission (end of year)

### Requests
- Leave requests (casual, sick, earned)
- Expense claims with receipts
- Referral bonus requests
- Request history and status

## Related Components
- \`src/components/employee/\`
"

# Contractor routes README
create_readme "$BASE_DIR/src/app/(contractor)/README.md" "# Contractor Dashboard Routes

## Overview
Protected routes for contractor users.

## Access Control
- Requires authentication
- User type: \`contractor\`

## Main Routes
- \`/dashboard\` - Contractor dashboard
- \`/timesheets\` - Time sheet management
- \`/invoices\` - Invoice generation and tracking

## Features
### Dashboard
- Active contracts
- Pending timesheets
- Invoice status
- Payment tracking

### Timesheets
- **Hourly Timesheets**: Log hours per day/week
- **Milestone Timesheets**: Mark milestone completion
- Submit for approval
- Edit before approval

### Invoices
- Auto-generated from approved timesheets
- Invoice number (sequential)
- Billing period
- Rate card display
- GST calculation (if applicable)
- Payment tracking (due date, paid date)
- Download invoice PDF

## Related Components
- \`src/components/contractor/\`
"

# API routes README
create_readme "$BASE_DIR/src/app/api/README.md" "# API Routes

## Overview
Next.js API routes for backend functionality.

## Structure
\`\`\`
api/
├── auth/           # Authentication endpoints
├── employees/      # Employee CRUD operations
├── webhooks/       # External service webhooks
└── cron/           # Scheduled tasks (Vercel Cron)
\`\`\`

## Route Handlers
Each \`route.ts\` file exports HTTP method handlers:

\`\`\`typescript
export async function GET(request: Request) {
  // Handle GET request
}

export async function POST(request: Request) {
  // Handle POST request
}
\`\`\`

## Authentication
Most API routes require authentication:

\`\`\`typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // ... route logic
}
\`\`\`

## Webhooks
External services send events to these endpoints:
- \`/api/webhooks/springscan\` - eKYC verification results
- \`/api/webhooks/signeasy\` - E-signature status updates

**Security**: Verify webhook signatures to prevent unauthorized access.

## Cron Jobs
Vercel Cron jobs for scheduled tasks:
- \`/api/cron/reminders\` - Send agreement reminders (daily)

Configure in \`vercel.json\`:
\`\`\`json
{
  \"crons\": [
    {
      \"path\": \"/api/cron/reminders\",
      \"schedule\": \"0 10 * * *\"
    }
  ]
}
\`\`\`

## Error Handling
Always return proper HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
"

# Components README
create_readme "$BASE_DIR/src/components/README.md" "# Components

## Overview
Reusable React components organized by role and complexity.

## Structure
\`\`\`
components/
├── ui/           # Base UI components (shadcn/ui)
├── auth/         # Authentication components
├── employer/     # Employer-specific components
├── employee/     # Employee-specific components
├── contractor/   # Contractor-specific components
├── shared/       # Shared components across roles
└── forms/        # Reusable form components
\`\`\`

## Component Types

### 1. UI Components (\`ui/\`)
Base components from shadcn/ui:
- Button, Input, Card, Dialog
- Form, Select, Checkbox, Radio
- Table, DataTable
- Toast, Alert, Badge

**Installation**:
\`\`\`bash
npx shadcn-ui@latest add button
\`\`\`

### 2. Role-Specific Components
Components used by specific user types:
- \`employer/\` - Employee lists, contract forms, analytics
- \`employee/\` - Onboarding wizard, tax forms, requests
- \`contractor/\` - Timesheets, invoice generator

### 3. Shared Components (\`shared/\`)
Used across all user types:
- Sidebar, Navbar
- Loading states
- Error boundaries
- Data tables

### 4. Form Components (\`forms/\`)
Reusable form sections:
- Address form
- Bank details form
- Family details form

## Usage

### Server Components (Default)
\`\`\`typescript
// components/my-component.tsx
export function MyComponent({ data }: Props) {
  return <div>{data.title}</div>
}
\`\`\`

### Client Components (Interactive)
\`\`\`typescript
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
\`\`\`

## Best Practices
- ✅ Use TypeScript for all components
- ✅ Extract complex logic to custom hooks
- ✅ Keep components small (< 200 lines)
- ✅ Use Server Components when possible
- ✅ Add 'use client' only when needed (state, effects, browser APIs)
- ✅ Co-locate styles with components (Tailwind)

## Naming Conventions
- **Files**: kebab-case (\`login-form.tsx\`)
- **Components**: PascalCase (\`LoginForm\`)
- **Props interfaces**: \`ComponentNameProps\`
"

# Lib README
create_readme "$BASE_DIR/src/lib/README.md" "# Library Functions

## Overview
Core utilities, services, and external integrations.

## Structure
\`\`\`
lib/
├── supabase/        # Supabase client setup
├── services/        # Business logic services
├── integrations/    # External API clients
└── utils/           # Utility functions
\`\`\`

## Supabase Clients
Different clients for different environments:

\`\`\`typescript
// Browser client (Client Components)
import { createClientComponentClient } from './supabase/client'

// Server client (Server Components)
import { createServerComponentClient } from './supabase/server'

// Middleware client
import { createMiddlewareClient } from './supabase/middleware'
\`\`\`

## Services
Business logic layer (pure functions):

### Salary Calculator
\`\`\`typescript
import { calculateCTCBreakdown } from '@/lib/services/salary-calculator'

const breakdown = calculateCTCBreakdown(480000) // basic salary
// Returns: { basic, hra, epf, gratuity, gross, ctc }
\`\`\`

### Tax Calculator
\`\`\`typescript
import { calculateTax } from '@/lib/services/tax-calculator'

const tax = calculateTax(income, deductions, regime)
// Calculates Indian income tax
\`\`\`

## Integrations
External API clients:

### SpringScan (eKYC)
\`\`\`typescript
import { springscan } from '@/lib/integrations/springscan'

const result = await springscan.verifyDocument({
  type: 'aadhaar',
  number: '123456789012'
})
\`\`\`

### SignEasy (E-Signature)
\`\`\`typescript
import { signeasy } from '@/lib/integrations/signeasy'

const agreement = await signeasy.createRequest({
  documentUrl: 'https://...',
  signerEmail: 'employee@example.com'
})
\`\`\`

## Utils
Helper functions:

\`\`\`typescript
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

// Class names utility (for Tailwind)
const className = cn('text-sm', isActive && 'font-bold')

// Currency formatting
formatCurrency(1000) // '₹1,000.00'

// Date formatting
formatDate(new Date(), 'MMM dd, yyyy') // 'Nov 12, 2025'
\`\`\`

## Best Practices
- ✅ Keep functions pure (no side effects)
- ✅ Use TypeScript for type safety
- ✅ Add JSDoc comments
- ✅ Write unit tests for services
- ✅ Handle errors gracefully
"

# Supabase README
create_readme "$BASE_DIR/supabase/README.md" "# Supabase Configuration

## Overview
Database migrations and Edge Functions for Supabase.

## Structure
\`\`\`
supabase/
├── migrations/       # Database migrations (SQL)
├── functions/        # Edge Functions (Deno)
└── seed.sql          # Development seed data
\`\`\`

## Migrations
SQL files that modify database schema:

\`\`\`sql
-- migrations/001_initial_schema.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY \"Users can view own data\" ON users
  FOR SELECT USING (auth.uid() = id);
\`\`\`

### Running Migrations
\`\`\`bash
# Apply all migrations
pnpm supabase:migrate

# Create new migration
pnpm supabase migration new migration_name
\`\`\`

## Edge Functions
Serverless functions running on Deno:

\`\`\`typescript
// functions/face-verification/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  const { employeeId, selfieUrl } = await req.json()

  // Call SpringScan API for face matching
  const result = await fetch('https://api.springverify.com/face-match', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${Deno.env.get('SPRINGSCAN_API_KEY')}\`
    },
    body: JSON.stringify({ selfie: selfieUrl })
  })

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  })
})
\`\`\`

### Deploying Edge Functions
\`\`\`bash
# Deploy function
supabase functions deploy face-verification

# Test locally
supabase functions serve face-verification
\`\`\`

## Seed Data
Development data for local testing:

\`\`\`sql
-- seed.sql
INSERT INTO companies (name, email) VALUES
  ('Acme Corp', 'admin@acme.com'),
  ('TechStart Inc', 'admin@techstart.com');
\`\`\`

\`\`\`bash
# Load seed data
psql -h localhost -U postgres -d postgres -f seed.sql
\`\`\`

## Type Generation
Auto-generate TypeScript types from database:

\`\`\`bash
# Generate types
pnpm supabase:generate-types

# Output: src/lib/supabase/types.ts
\`\`\`

## Environment Variables
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
\`\`\`

## Learn More
- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
"

# Tests README
create_readme "$BASE_DIR/tests/README.md" "# Testing

## Overview
Comprehensive test suite covering E2E, integration, and unit tests.

## Structure
\`\`\`
tests/
├── e2e/              # End-to-end tests (Playwright)
├── integration/      # Integration tests
│   └── api/         # API endpoint tests
└── unit/            # Unit tests
    └── services/    # Service layer tests
\`\`\`

## E2E Tests (Playwright)
Test user flows from browser perspective:

\`\`\`typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')

  await page.fill('[name=\"email\"]', 'test@example.com')
  await page.fill('[name=\"password\"]', 'password123')
  await page.click('button[type=\"submit\"]')

  await expect(page).toHaveURL('/dashboard')
})
\`\`\`

### Running E2E Tests
\`\`\`bash
# Run all E2E tests
pnpm test:e2e

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run specific test
pnpm test:e2e auth.spec.ts
\`\`\`

## Integration Tests
Test API endpoints and database operations:

\`\`\`typescript
// tests/integration/api/employees.test.ts
import { createMocks } from 'node-mocks-http'

describe('GET /api/employees', () => {
  it('returns employee list', async () => {
    const { req, res } = createMocks({ method: 'GET' })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toHaveProperty('employees')
  })
})
\`\`\`

## Unit Tests (Vitest)
Test individual functions:

\`\`\`typescript
// tests/unit/services/salary-calculator.test.ts
import { describe, it, expect } from 'vitest'
import { calculateCTCBreakdown } from '@/lib/services/salary-calculator'

describe('calculateCTCBreakdown', () => {
  it('calculates HRA correctly', () => {
    const result = calculateCTCBreakdown(480000)
    expect(result.hra).toBe(240000) // 50% of basic
  })

  it('calculates EPF correctly', () => {
    const result = calculateCTCBreakdown(480000)
    expect(result.epf_employee).toBe(57600) // 12% of basic
  })
})
\`\`\`

### Running Unit Tests
\`\`\`bash
# Run all unit tests
pnpm test:unit

# Watch mode
pnpm test:unit --watch

# Coverage report
pnpm test:unit --coverage
\`\`\`

## Test Coverage Goals
- E2E: Critical user flows (login, onboarding, requests)
- Integration: All API endpoints
- Unit: All services and utilities
- Target: >80% coverage

## Best Practices
- ✅ Write tests before fixing bugs
- ✅ Test edge cases
- ✅ Use meaningful test descriptions
- ✅ Mock external API calls
- ✅ Keep tests independent (no shared state)
"

# Docs README
create_readme "$BASE_DIR/docs/README.md" "# Project Documentation

## Overview
Additional project documentation beyond code-level README files.

## Documents
- **DEVELOPMENT.md** - Development workflow and guidelines
- **DEPLOYMENT.md** - Production deployment instructions
- **SUPABASE_SETUP.md** - Supabase project configuration
- **MIGRATION_NOTES.md** - Migration progress and learnings

## Development Guide
See [DEVELOPMENT.md](./DEVELOPMENT.md) for:
- Code style guidelines
- Git workflow
- Pull request process
- Testing requirements
- Local development setup

## Deployment Guide
See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Vercel deployment
- Environment variable setup
- CI/CD pipeline
- Production checklist

## Supabase Setup
See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for:
- Project creation
- Database schema setup
- RLS policy configuration
- Storage bucket setup
- Edge Function deployment

## Migration Notes
See [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) for:
- Progress tracking
- Challenges encountered
- Solutions implemented
- Lessons learned
"

echo "=============================================="
echo "✅ All README files generated successfully!"
echo "Total README files created: 15+"
echo ""
echo "Next steps:"
echo "1. Review generated README files"
echo "2. Customize content as needed"
echo "3. Run: pnpm install (after package.json is created)"
echo "4. Run: pnpm dev (start development server)"
