# Rapid.one - Next.js 14 Application

## Overview

This is the new **Rapid.one** frontend application built with **Next.js 14**, **TypeScript**, **Supabase**, and **Tailwind CSS**. This project replaces the legacy React + Vite frontend (`aether-legacy/`) as part of our migration to a modern, scalable stack.

**Purpose:** Employer of Record (EoR) platform for hiring, onboarding, and managing employees and contractors internationally, with focus on Indian market compliance.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Supabase Client (auto-generated)
- **Background Jobs:** Inngest (or Supabase Edge Functions)

---

## 📁 Project Structure

```
aether/
├── public/           # Static assets (icons, images, fonts)
├── src/
│   ├── app/         # Next.js App Router (pages and API routes)
│   ├── components/  # Reusable UI components
│   ├── lib/         # Core utilities, services, integrations
│   ├── hooks/       # Custom React hooks
│   ├── store/       # Zustand state management
│   ├── types/       # TypeScript type definitions
│   ├── schemas/     # Zod validation schemas
│   ├── constants/   # Application constants
│   └── config/      # App configuration
├── supabase/        # Supabase migrations and Edge Functions
├── scripts/         # Utility scripts
├── tests/           # E2E, integration, and unit tests
└── docs/            # Project documentation
```

**See [src/README.md](./src/README.md) for detailed source code organization.**

---

## 🎯 Key Features

### For Employers
- Employee & contractor onboarding
- Contract management
- Team organization
- User access control (Admin/HR Manager/Approver)
- Leave & expense approvals
- Analytics dashboard
- Policy configuration

### For Employees
- Self-service onboarding
- eKYC verification
- Tax declaration (Indian tax system)
- Leave & expense requests
- Referral bonuses
- LTA travel claims
- Document management

### For Contractors
- Time sheet management (hourly/milestone)
- Invoice generation
- Contract tracking

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm** 8+ (or yarn/npm)
- **Supabase** account and project
- **Git**

### Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in the required variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # External Services
   SPRINGSCAN_API_KEY=your-springscan-key
   SIGNEASY_API_KEY=your-signeasy-key
   SENDGRID_API_KEY=your-sendgrid-key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Database Setup

```bash
# Run Supabase migrations
pnpm supabase:migrate

# Generate TypeScript types from database
pnpm supabase:generate-types

# Seed development data (optional)
pnpm supabase:seed
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm type-check` | Run TypeScript compiler check |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run all tests |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm test:unit` | Run unit tests |
| `pnpm supabase:migrate` | Run database migrations |
| `pnpm supabase:generate-types` | Generate TypeScript types |

---

## 🗂️ Module Organization

### User Roles & Routes

**Public Routes** (`/app/(auth)/`)
- Login, Signup, Password Reset
- Email Verification
- Company Onboarding

**Employer Routes** (`/app/(employer)/`)
- Dashboard, Analytics
- Employee Management
- Contractor Management
- Request Approvals
- Settings (Company, Teams, Users, Policies)

**Employee Routes** (`/app/(employee)/`)
- Dashboard, Onboarding
- Profile Management
- Tax Declaration & Submission
- Leave & Expense Requests
- Referral Bonuses, LTA Claims

**Contractor Routes** (`/app/(contractor)/`)
- Dashboard
- Time Sheets (Hourly/Milestone)
- Invoices

### API Routes (`/app/api/`)

- **Auth:** Login, Logout, Refresh Token
- **Employees:** CRUD, Onboarding, Contract Management
- **Webhooks:** SpringScan (eKYC), SignEasy (E-Signature)
- **Cron:** Scheduled reminders

---

## 🧩 Component Structure

Components are organized by purpose:

- **`ui/`** - Base UI components from shadcn/ui (Button, Input, Card, etc.)
- **`auth/`** - Authentication components (Login Form, OAuth Buttons)
- **`employer/`** - Employer-specific components
- **`employee/`** - Employee-specific components
- **`contractor/`** - Contractor-specific components
- **`shared/`** - Shared components (Sidebar, Navbar, DataTable)
- **`forms/`** - Reusable form components

**See [src/components/README.md](./src/components/README.md) for details.**

---

## 📚 Documentation

- **[Development Guide](./docs/DEVELOPMENT.md)** - Detailed development workflow
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Supabase Setup](./docs/SUPABASE_SETUP.md)** - Supabase configuration guide
- **[Migration Notes](./docs/MIGRATION_NOTES.md)** - Migration progress and learnings
- **[Component Library](./src/components/README.md)** - Component usage guide
- **[API Reference](./src/app/api/README.md)** - API endpoints documentation

---

## 🔐 Authentication & Authorization

**Authentication Provider:** Supabase Auth

**Supported Methods:**
- Email/Password
- Google OAuth
- Magic Link (email)

**Role-Based Access:**
- **Employer Roles:** Admin, HR Manager, Approver
- **Employee:** Standard employee access
- **Contractor:** Contractor-specific access

**Route Protection:** Middleware-based authentication checks

---

## 🧪 Testing

### E2E Tests (Playwright)
```bash
pnpm test:e2e
```

Tests cover:
- Authentication flows
- Employee onboarding
- Contract creation
- Leave requests
- Expense approvals

### Unit Tests (Vitest)
```bash
pnpm test:unit
```

Tests cover:
- Service layer (salary calculator, tax calculator)
- Utility functions
- Validation schemas

---

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to `main`

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

**See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.**

---

## 📦 Migration from Legacy

This project replaces `aether-legacy/` (React + Vite). Key differences:

| Aspect | Legacy (aether-legacy) | New (aether) |
|--------|----------------------|--------------|
| Framework | React 18 + Vite | Next.js 14 |
| Routing | React Router v6 | App Router |
| State | Redux Toolkit | Zustand |
| Styling | MUI + Bootstrap | Tailwind + shadcn/ui |
| Forms | Formik + Yup | React Hook Form + Zod |
| Backend | Django REST API | Supabase + Next.js API Routes |
| Database | PostgreSQL (Django ORM) | Supabase PostgreSQL |

**Migration progress:** See [docs/MIGRATION_NOTES.md](./docs/MIGRATION_NOTES.md)

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Follow the code style (ESLint + Prettier)
3. Write tests for new features
4. Update documentation
5. Submit pull request

### Code Style

- **TypeScript:** Use strict mode
- **Components:** Functional components with TypeScript
- **Naming:** PascalCase for components, camelCase for functions
- **Files:** kebab-case for filenames

---

## 📄 License

[Add License Information]

---

## 👥 Team

- **Frontend:** Next.js 14 + TypeScript
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **DevOps:** Vercel

---

## 📞 Support

- **Documentation:** [/docs](./docs/)
- **Issues:** GitHub Issues
- **Email:** support@rapid.one

---

**Built with ❤️ for the future of global hiring**
