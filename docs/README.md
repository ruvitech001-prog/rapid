# Project Documentation

## Overview
Comprehensive documentation for the Rapid.one EoR (Employer of Record) Platform.

---

## Quick Start

| Document | Purpose |
|----------|---------|
| [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) | Get started with local development |
| [COMPLETED_FEATURES.md](./COMPLETED_FEATURES.md) | What's been built and how it works |
| [USER_FLOW.md](./USER_FLOW.md) | User journeys for all roles |
| [SUPERADMIN_BACKEND_PLAN.md](./SUPERADMIN_BACKEND_PLAN.md) | Implementation plan for SuperAdmin |

---

## Core Documentation

### Development Setup
See [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for:
- Prerequisites and installation
- Environment variables configuration
- Running the application
- Demo credentials
- Project structure
- Common issues and solutions

### Completed Features
See [COMPLETED_FEATURES.md](./COMPLETED_FEATURES.md) for:
- Supabase integration status
- Service layer architecture
- React Query hooks
- Database schema and seed data
- Pages integrated with real data
- Pending integration work

### User Flows
See [USER_FLOW.md](./USER_FLOW.md) for:
- Employer user journey
- Employee user journey
- Contractor user journey
- SuperAdmin user journey (planned)
- Cross-role interactions

### SuperAdmin Backend Plan
See [SUPERADMIN_BACKEND_PLAN.md](./SUPERADMIN_BACKEND_PLAN.md) for:
- Implementation phases (8 phases)
- SQL migrations
- Service and hook code examples
- Page structure
- Implementation checklist

---

## Additional Documentation

### Feature Analysis
See [FEATURE_GAP_ANALYSIS.md](./FEATURE_GAP_ANALYSIS.md) for:
- Current implementation status
- Missing critical features
- Priority recommendations
- Phase-wise roadmap

### Technical Architecture
See [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) for:
- System architecture
- Technology stack
- Database design
- API patterns

### Employer Settings Flow
See [EMPLOYER_SETTINGS_FLOW.md](./EMPLOYER_SETTINGS_FLOW.md) for:
- Settings page structure
- Policy configuration
- Team management

---

## Key Information

### Demo Company
- **Company ID**: `22222222-2222-2222-2222-222222222222`
- **Company Name**: TechCorp Solutions

### Demo Users
| Role | Email |
|------|-------|
| Employer | demo@rapidone.com |
| Employee | e001@rapidone.com |
| Contractor | c001@rapidone.com |

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State**: React Query
- **Backend**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Charts**: Recharts

