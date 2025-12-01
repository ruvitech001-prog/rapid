# Development Setup Guide

This guide will help you set up the Rapid.one EoR Platform for local development.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Running the Application](#running-the-application)
5. [Demo Credentials](#demo-credentials)
6. [Project Structure](#project-structure)
7. [Development Workflow](#development-workflow)
8. [Common Issues](#common-issues)

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x or higher | JavaScript runtime |
| pnpm | 8.x or higher | Package manager |
| Git | Latest | Version control |

### Verify Installation

```bash
node --version    # Should show v18.x.x or higher
pnpm --version    # Should show 8.x.x or higher
git --version     # Should show git version x.x.x
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aether
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required dependencies including:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Supabase Client
- Lucide Icons
- Recharts

---

## Environment Variables

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Configure Supabase

Add your Supabase credentials to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Running the Application

### Development Server

```bash
pnpm dev
```

The application will be available at:
- **Main App**: http://localhost:3000
- **Employer Dashboard**: http://localhost:3000/employer/dashboard
- **Employee Dashboard**: http://localhost:3000/employee/dashboard
- **Contractor Dashboard**: http://localhost:3000/contractor/dashboard

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Other Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |

---

## Demo Credentials

The database is pre-seeded with demo data. Use these credentials to explore different dashboards:

### Demo Company Information

| Field | Value |
|-------|-------|
| Company ID | `22222222-2222-2222-2222-222222222222` |
| Company Name | TechCorp Solutions |
| Organization ID | `11111111-1111-1111-1111-111111111111` |

### User Accounts

| Role | Email | User ID |
|------|-------|---------|
| Employer Admin | demo@rapidone.com | `00000000-0000-0000-0000-000000000001` |
| Employee 1 | e001@rapidone.com | `e0000001-0001-0001-0001-000000000001` |
| Employee 2 | e002@rapidone.com | `e0000002-0002-0002-0002-000000000002` |
| Contractor 1 | c001@rapidone.com | `c0000001-0001-0001-0001-000000000001` |

### Sample Data Counts

| Entity | Count |
|--------|-------|
| Users | 19 |
| Employees | 12 |
| Contractors | 6 |
| Leave Requests | 10 |
| Expense Claims | 10 |
| Holidays | 8 |

---

## Project Structure

```
aether/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── employer/             # Employer dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── employees/
│   │   │   ├── contractors/
│   │   │   ├── leave/
│   │   │   └── ...
│   │   ├── employee/             # Employee dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── leave/
│   │   │   ├── expenses/
│   │   │   └── ...
│   │   ├── contractor/           # Contractor dashboard routes
│   │   ├── (auth)/               # Authentication routes
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   └── layout.tsx            # Root layout
│   │
│   ├── components/               # Reusable components
│   │   ├── ui/                   # UI primitives
│   │   ├── providers/            # Context providers
│   │   └── ...
│   │
│   ├── lib/                      # Utilities and services
│   │   ├── supabase/             # Supabase clients
│   │   │   ├── client.ts         # Browser client
│   │   │   └── server.ts         # Server client
│   │   ├── services/             # Data services
│   │   │   ├── employees.service.ts
│   │   │   ├── contractors.service.ts
│   │   │   ├── leaves.service.ts
│   │   │   ├── expenses.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── index.ts
│   │   ├── hooks/                # React Query hooks
│   │   │   ├── use-employees.ts
│   │   │   ├── use-contractors.ts
│   │   │   ├── use-leaves.ts
│   │   │   ├── use-expenses.ts
│   │   │   ├── use-dashboard.ts
│   │   │   └── index.ts
│   │   ├── queries/              # Query utilities
│   │   │   └── keys.ts           # Query key factory
│   │   └── mock-data/            # Mock data (legacy)
│   │
│   └── types/                    # TypeScript types
│       └── database.types.ts     # Supabase generated types
│
├── docs/                         # Documentation
│   ├── COMPLETED_FEATURES.md
│   ├── USER_FLOW.md
│   ├── DEVELOPMENT_SETUP.md
│   └── SUPERADMIN_BACKEND_PLAN.md
│
├── public/                       # Static assets
│
├── .env.local                    # Environment variables (create this)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

---

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test locally**
   ```bash
   pnpm dev
   ```

4. **Run linting**
   ```bash
   pnpm lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

### Working with Supabase Data

#### Using React Query Hooks

```typescript
import { useEmployees, useContractors } from '@/lib/hooks'

// In your component
const COMPANY_ID = '22222222-2222-2222-2222-222222222222'

export default function MyComponent() {
  const { data: employees, isLoading, error } = useEmployees(COMPANY_ID)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {employees?.map(emp => (
        <li key={emp.id}>{emp.fullName}</li>
      ))}
    </ul>
  )
}
```

#### Using Services Directly

```typescript
import { employeesService } from '@/lib/services'

// In a Server Component or API route
const employees = await employeesService.getByCompany(companyId)
```

### Adding New Features

1. **Create a service** (if needed) in `src/lib/services/`
2. **Create React Query hooks** in `src/lib/hooks/`
3. **Add query keys** to `src/lib/queries/keys.ts`
4. **Create/update page** in `src/app/`

---

## Common Issues

### 1. Supabase Connection Error

**Error**: `Invalid API key` or `Network request failed`

**Solution**:
- Verify your `.env.local` file exists
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Restart the development server after changing environment variables

### 2. TypeScript Errors

**Error**: Type errors related to database types

**Solution**: Regenerate Supabase types
```bash
pnpm supabase:generate-types
```

### 3. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
pnpm dev -- -p 3001
```

### 4. Empty Data on Pages

**Error**: Pages show no data or loading forever

**Solution**:
- Check browser console for errors
- Verify the company ID matches seeded data: `22222222-2222-2222-2222-222222222222`
- Check Supabase RLS policies allow access

### 5. Build Errors

**Error**: Build fails with TypeScript errors

**Solution**:
```bash
# Run type check to see all errors
pnpm type-check

# Fix errors or add to tsconfig.json if intentional
```

---

## Quick Reference

### Key Files

| Purpose | Location |
|---------|----------|
| Main Layout | `src/app/layout.tsx` |
| Employer Layout | `src/app/employer/layout.tsx` |
| Employee Layout | `src/app/employee/layout.tsx` |
| Supabase Client | `src/lib/supabase/client.ts` |
| Query Provider | `src/components/providers/query-provider.tsx` |
| All Services | `src/lib/services/index.ts` |
| All Hooks | `src/lib/hooks/index.ts` |

### Important Constants

```typescript
// Demo Company ID - use this in development
const DEMO_COMPANY_ID = '22222222-2222-2222-2222-222222222222'

// Demo Organization ID
const DEMO_ORG_ID = '11111111-1111-1111-1111-111111111111'

// Demo Employer User ID
const DEMO_EMPLOYER_ID = '00000000-0000-0000-0000-000000000001'
```

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/seed` | POST | Check database seed status |
| `/api/seed` | DELETE | Disabled for safety |

---

## Need Help?

- Check the [COMPLETED_FEATURES.md](./COMPLETED_FEATURES.md) for what's implemented
- Review [USER_FLOW.md](./USER_FLOW.md) for user journey documentation
- See [SUPERADMIN_BACKEND_PLAN.md](./SUPERADMIN_BACKEND_PLAN.md) for upcoming features
- Check [FEATURE_GAP_ANALYSIS.md](./FEATURE_GAP_ANALYSIS.md) for roadmap
