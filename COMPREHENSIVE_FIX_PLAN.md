# Aether Platform - Comprehensive Backend Integration Fix Plan

**Document Version:** 1.0
**Date:** December 8, 2025
**Scope:** Complete analysis of all 4 user roles (Employee, Employer, Contractor, Super Admin)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Employee Section Analysis](#employee-section-analysis)
4. [Employer Section Analysis](#employer-section-analysis)
5. [Contractor Section Analysis](#contractor-section-analysis)
6. [Super Admin Section Analysis](#super-admin-section-analysis)
7. [Cross-Cutting Issues](#cross-cutting-issues)
8. [Database Schema Requirements](#database-schema-requirements)
9. [Priority-Based Fix Plan](#priority-based-fix-plan)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

### Overall Platform Health

| Section | Pages | Data Fetching | Write Operations | Overall Status |
|---------|-------|---------------|------------------|----------------|
| **Employee** | 31 | 70% Working | 30% Working | **55% Functional** |
| **Employer** | 73 | 85% Working | 40% Working | **63% Functional** |
| **Contractor** | 16 | 90% Working | 20% Working | **65% Functional** |
| **Super Admin** | 14 | 95% Working | 85% Working | **90% Functional** |

### Critical Issues Count

| Severity | Employee | Employer | Contractor | Super Admin | Total |
|----------|----------|----------|------------|-------------|-------|
| **CRITICAL** (App Breaking) | 4 | 3 | 3 | 0 | **10** |
| **HIGH** (Major Feature Broken) | 6 | 8 | 2 | 2 | **18** |
| **MEDIUM** (Partial Functionality) | 5 | 12 | 3 | 3 | **23** |
| **LOW** (Minor/Polish) | 3 | 10 | 2 | 2 | **17** |

---

## Architecture Overview

### Data Flow Pattern
```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  Page Component (React)                                          │
│       │                                                          │
│       ▼                                                          │
│  Custom Hook (React Query)                                       │
│       │ useQuery / useMutation                                   │
│       ▼                                                          │
│  Service Class (extends BaseService)                             │
│       │                                                          │
│       ▼                                                          │
│  Supabase Client                                                 │
│       │                                                          │
├───────┼─────────────────────────────────────────────────────────┤
│       │              BACKEND (Supabase)                          │
│       ▼                                                          │
│  PostgreSQL Database                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Files Structure
```
src/
├── app/
│   ├── employee/        # 31 pages
│   ├── employer/        # 73 pages
│   ├── contractor/      # 16 pages
│   └── super-admin/     # 14 pages
├── lib/
│   ├── auth/
│   │   └── auth-context.tsx    # Authentication state
│   ├── hooks/
│   │   ├── use-leaves.ts       # Leave management
│   │   ├── use-expenses.ts     # Expense management
│   │   ├── use-payroll.ts      # Payroll data
│   │   ├── use-attendance.ts   # Attendance tracking
│   │   ├── use-profile.ts      # User profiles
│   │   ├── use-invoices.ts     # Invoice management
│   │   ├── use-contracts.ts    # Contracts
│   │   ├── use-timesheets.ts   # Timesheet tracking
│   │   └── use-superadmin-*.ts # Super admin hooks
│   └── services/
│       ├── base.service.ts     # Base class
│       ├── leaves.service.ts
│       ├── expenses.service.ts
│       ├── payroll.service.ts
│       ├── attendance.service.ts
│       ├── profile.service.ts
│       ├── invoices.service.ts
│       ├── contracts.service.ts
│       ├── timesheets.service.ts
│       └── superadmin-*.service.ts
└── types/
    └── database.types.ts       # Supabase generated types
```

---

## Employee Section Analysis

### Pages Inventory (31 Total)

| Category | Pages | Status |
|----------|-------|--------|
| Dashboard | 1 | Working with fallback data |
| Attendance | 3 | Clock-in NOT working |
| Leave | 2 | Mostly working |
| Payroll/Payslips | 2 | Synthetic data |
| Documents | 3 | Read-only working |
| Expenses | 2 | Submit NOT working |
| Tax | 4 | Partial |
| Profile/Settings | 3 | Partial save |
| Notifications | 1 | Working |
| Onboarding | 10 | Demo only |

### CRITICAL Issues (Must Fix)

#### 1. Clock-In/Clock-Out Not Persisting
**File:** `src/app/employee/attendance/clockin/page.tsx`
**Lines:** 59-73

```typescript
// CURRENT (BROKEN):
const handleClockIn = () => {
  setIsClockedIn(true)
  setClockInTime(new Date())
  // TODO: Persist clock-in to attendance service
  toast.success('Clocked in successfully!')
}
```

**Problem:** Only updates React state, data lost on refresh
**Impact:** Employees cannot track attendance
**Fix Required:**
- Create `attendanceService.clockIn(employeeId, timestamp, location)`
- Create `attendanceService.clockOut(employeeId, timestamp)`
- Add `attendance_employeeattendance` table queries
- Create `useClockIn()` and `useClockOut()` mutation hooks

---

#### 2. Expense Submission Not Working
**File:** `src/app/employee/expenses/submit/page.tsx`
**Lines:** 44-49

```typescript
// CURRENT (BROKEN):
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // TODO: Implement actual expense submission to service
  toast.success('Expense claim submitted successfully!')
  router.push('/employee/expenses/history')
}
```

**Problem:** No backend call, `useCreateExpenseClaim` exists but not used
**Impact:** Employees cannot submit expense claims
**Fix Required:**
- Import `useCreateExpenseClaim` from hooks
- Add file upload to Supabase storage
- Call mutation with form data
- Handle file URLs in expense record

---

#### 3. Password Change Not Implemented
**File:** `src/app/employee/profile/page.tsx`
**Lines:** 89-102

```typescript
// CURRENT (BROKEN):
const handlePasswordChange = (e: React.FormEvent) => {
  // ... validation ...
  // TODO: Implement actual password change via Supabase auth
  toast.success('Password changed successfully!')
  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
}
```

**Problem:** Shows success without changing password
**Impact:** Security issue - users think password changed but it didn't
**Fix Required:**
- Use Supabase auth `updateUser({ password })` method
- Verify current password first
- Handle auth errors properly

---

#### 4. Leave Balance Financial Year Mismatch
**File:** `src/lib/services/leaves.service.ts`
**Lines:** 198-217

```typescript
// CURRENT (POTENTIALLY BROKEN):
const financialYearFormats = [
  `${currentYear}`,                    // '2025'
  `${currentYear}-${currentYear + 1}`, // '2025-2026'
  `FY${currentYear}`,                  // 'FY2025'
]
```

**Problem:** If database uses different format (e.g., "FY 2025-26"), no data returned
**Impact:** Leave balances show 0 or fallback data
**Fix Required:**
- Audit database for actual `financial_year` values
- Add all matching formats OR standardize via migration
- Add fallback query with no year filter

---

### HIGH Priority Issues

#### 5. Attendance Stats Are Simulated
**File:** `src/lib/services/attendance.service.ts`
**Lines:** 105-121

**Problem:**
- `daysAbsent` hardcoded to 0 (line 112-113)
- Clock times hardcoded as "09:00"/"18:00" (lines 268-270)
- No actual attendance table queried

**Fix Required:**
- Query `attendance_employeeattendance` table
- Calculate real present/absent days
- Get actual clock-in/out times

---

#### 6. Payroll Data Is Synthetic
**File:** `src/lib/services/payroll.service.ts`
**Lines:** 49-92

**Problem:**
- Generates history from contract salary
- Same amount every month
- No actual payroll runs tracked

**Fix Required:**
- Query `payroll_payslip` or `payroll_payrollrun` table
- Return actual historical payroll data
- Handle months without payroll

---

#### 7. Profile Emergency Contact Not Saved
**File:** `src/app/employee/profile/page.tsx`
**Lines:** 69-87

**Problem:**
- `handleProfileSave()` only updates basic employee info
- Emergency contact fields shown but not sent to backend

**Fix Required:**
- Call `useUpdateEmergencyContact` or `useAddEmergencyContact`
- Save emergency contact with profile

---

#### 8. Profile Address Not Saved
**File:** `src/app/employee/profile/page.tsx`
**Lines:** 214-223

**Problem:**
- Address shown as single textarea
- Database expects separate fields (line1, line2, city, state, pin)
- No parse/save logic

**Fix Required:**
- Add structured address form fields
- Use `useSaveAddress` hook

---

#### 9. Notification Preferences Not Persisted
**File:** `src/app/employee/profile/page.tsx`
**Lines:** 104-107

**Problem:** Preferences only in React state, lost on refresh

**Fix Required:**
- Create `employee_preferences` table
- Add service and hook for preferences
- Save on toggle change

---

#### 10. Notifications All Show as Unread
**File:** `src/lib/services/notifications.service.ts`
**Lines:** 222-234

**Problem:**
- `getUnreadCount()` returns total count
- No read tracking mechanism
- `isRead` always false

**Fix Required:**
- Create `notification_read_status` table
- Track read status per notification per user
- Mark as read on view

---

### MEDIUM Priority Issues

#### 11. Dashboard Fallback Data Masks Errors
**File:** `src/app/employee/dashboard/page.tsx`
**Lines:** 113-124, 307-330

**Problem:** When API returns empty, static values shown instead of error

**Fix Required:**
- Add error states to hooks
- Show "Unable to load" messages
- Add retry buttons

---

#### 12. Tax Declaration - Partial Implementation
**Files:** `src/app/employee/tax/declaration/page.tsx`, `src/lib/services/tax.service.ts`

**Status:** Service methods exist but may not be fully connected

**Review Required:**
- Verify `useSaveDeclaration()` is called
- Verify `useSubmitDeclaration()` is called
- Check draft vs submitted state handling

---

#### 13. Document Upload - File Storage
**File:** `src/app/employee/documents/upload/page.tsx`

**Status:** Unknown - needs verification

**Review Required:**
- Check if Supabase storage is configured
- Verify upload service exists
- Test actual file upload flow

---

### Database Tables Required for Employee

| Table | Status | Used By |
|-------|--------|---------|
| `employee_employee` | Exists | Profile, Dashboard |
| `employee_employeecontract` | Exists | Payroll, Dashboard |
| `leave_leaverequest` | Exists | Leave management |
| `leave_leavebalance` | Exists | Leave balance |
| `expense_expenseclaim` | Exists | Expenses |
| `employee_investmentdeclaration` | Exists | Tax |
| `commons_address` | Exists | Profile |
| `commons_bankaccount` | Exists | Profile |
| `commons_emergencycontact` | Exists | Profile |
| `commons_document` | Exists | Documents |
| `holiday_holiday` | Exists | Dashboard |
| `attendance_employeeattendance` | **NEEDS VERIFICATION** | Clock-in |
| `payroll_payslip` | **NEEDS VERIFICATION** | Payslips |
| `employee_preferences` | **MISSING** | Settings |
| `notification_read_status` | **MISSING** | Notifications |

---

## Employer Section Analysis

### Pages Inventory (73 Total)

| Category | Pages | Status |
|----------|-------|--------|
| Dashboard | 1 | 70% working |
| Employees | 4 | Mostly working, team edit broken |
| Contractors | 5 | Working |
| Invoices | 3 | Actions partially broken |
| Leave | 3 | Working |
| Payroll | 3 | Simulated processing |
| Contracts | 4 | Read working, create unknown |
| Requests | 18 | Uses MOCK DATA |
| Attendance | 1 | Read-only |
| Compliance | 2 | Unknown |
| Reports | 7 | Unknown |
| Settings | 6 | Not persisted |
| Other | 16 | Various |

### CRITICAL Issues

#### 1. Requests Hub Uses Mock Data
**File:** `src/app/employer/requests/page.tsx`

**Problem:**
- Uses `getCurrentMockCompany()` for data
- Approvals/rejections update mock state only
- Real database not touched

**Impact:** All special requests non-functional

**Fix Required:**
- Replace mock data with `request_request` table queries
- Wire approval mutations to real service
- Add audit logging

---

#### 2. Payroll Processing Not Implemented
**File:** `src/app/employer/payroll/dashboard/page.tsx`

```typescript
// CURRENT (SIMULATED):
const handleProcessPayroll = async () => {
  setIsProcessing(true)
  await new Promise(resolve => setTimeout(resolve, 3000)) // Fake delay
  setIsProcessing(false)
  // ... just closes dialog
}
```

**Problem:** No actual payroll run service

**Fix Required:**
- Create `payrollService.processPayroll(companyId, month)`
- Calculate deductions, taxes
- Generate payslips
- Update employee payroll records

---

#### 3. Invoice PDF Download Fake
**File:** `src/app/employer/invoices/page.tsx`

**Problem:** Download shows toast, no actual PDF

**Fix Required:**
- Implement PDF generation (jsPDF or server-side)
- Store PDF in Supabase storage
- Return download URL

---

### HIGH Priority Issues

#### 4. Team Management Not Persisting
**File:** `src/app/employer/employees/page.tsx`

```typescript
const handleUpdateTeamDetails = () => {
  console.log('Update team details') // Just logs!
}
```

**Fix Required:**
- Create team update service
- Wire to database

---

#### 5. Invoice Payment Actions
**File:** `src/app/employer/invoices/page.tsx`

**Problem:** `handlePayInvoice` may not be properly wired

**Fix Required:**
- Verify `usePayInvoice()` mutation is called
- Add proper error handling

---

#### 6. Holiday Calendar Data
**File:** Various employer pages

**Problem:** `holiday_holiday` table may not have data

**Fix Required:**
- Verify table exists and has data
- Add seed data if needed
- Handle empty state

---

#### 7. Settings Pages Not Saving
**Files:** Multiple settings pages

**Problem:** All settings use simulated delays, no actual save

**Fix Required:**
- Create employer settings table
- Implement save service
- Persist all settings changes

---

### Database Tables Required for Employer

| Table | Status | Notes |
|-------|--------|-------|
| `employee_employee` | Exists | |
| `employee_employeecontract` | Exists | |
| `contractor_contractor` | Exists | |
| `contractor_contractorcontract` | Exists | |
| `contractor_invoice` | Exists | |
| `leave_leaverequest` | Exists | |
| `expense_expenseclaim` | Exists | |
| `request_request` | Exists | Not used (mock data instead) |
| `holiday_holiday` | **NEEDS VERIFICATION** | May be empty |
| `company_settings` | **MISSING** | For settings persistence |
| `payroll_payrollrun` | **NEEDS VERIFICATION** | For payroll processing |

---

## Contractor Section Analysis

### Pages Inventory (16 Total)

| Category | Pages | Status |
|----------|-------|--------|
| Dashboard | 1 | Working |
| Timesheet | 3 | Read works, submit broken |
| Invoices | 2 | Working |
| Profile | 1 | Partial |
| Settings | 1 | Not working |
| Onboarding | 6 | Demo only |

### CRITICAL Issues

#### 1. Timesheet Submission Not Working
**File:** `src/app/contractor/timesheets/submit/page.tsx`

```typescript
// CURRENT (BROKEN):
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // TODO: Implement actual timesheet submission via service
  toast.success('Timesheet submitted!')
  router.push('/contractor/timesheet')
}
```

**Problem:** No service call, `useSaveTimesheet` exists but unused

**Fix Required:**
- Import `useSubmitTimesheet` hook
- Call with form data
- Handle success/error properly

---

#### 2. Settings Not Persisting
**File:** `src/app/contractor/settings/page.tsx`

```typescript
// TODO: Persist preferences to backend
// TODO: Persist notification settings to backend
```

**Problem:** All settings lost on refresh

**Fix Required:**
- Create `contractor_preferences` table
- Add settings service
- Save on change

---

#### 3. Password Change Not Working
**File:** `src/app/contractor/profile/page.tsx`

```typescript
// TODO: Implement actual password change via Supabase auth
```

**Same issue as employee section**

---

### HIGH Priority Issues

#### 4. Sidebar Shows Hardcoded User
**File:** `src/app/contractor/layout.tsx`

```typescript
<Sidebar
  role="contractor"
  userName="Contractor Name"  // HARDCODED!
  userEmail="contractor@company.com"  // HARDCODED!
  userInitials="CN"  // HARDCODED!
/>
```

**Fix Required:**
- Get contractor name from `useAuth()` or `useContractorProfile()`
- Generate initials dynamically
- Handle email display (may need to get from auth)

---

#### 5. Timesheet Edit Not Implemented
**File:** `src/app/contractor/timesheet/page.tsx`

**Problem:** Edit button exists but no handler

**Fix Required:**
- Wire edit button to edit modal/page
- Call `useSaveTimesheet` for updates

---

### Database Tables Required for Contractor

| Table | Status | Notes |
|-------|--------|-------|
| `contractor_contractor` | Exists | |
| `contractor_contractorcontract` | Exists | |
| `contractor_invoice` | Exists | |
| `contractor_timesheet` | Exists | Service exists but not used |
| `contractor_preferences` | **MISSING** | For settings |

---

## Super Admin Section Analysis

### Pages Inventory (14 Total)

| Category | Pages | Status |
|----------|-------|--------|
| Dashboard | 1 | Working (some mock data) |
| Access Control | 1 | Working |
| Audit Logs | 1 | Working |
| Clients | 1 | Partial |
| Invoices | 1 | Working |
| Leaves | 1 | Working |
| Payroll | 1 | Working (mock historical) |
| Requests | 1 | Working |
| Team Members | 1 | Working |
| Profile | 1 | Similar issues to other profiles |
| Settings | 1 | Not persisted |

### HIGH Priority Issues

#### 1. Revenue/Invoice Charts Use Mock Data
**File:** `src/lib/services/superadmin-dashboard.service.ts`
**Lines:** 105-128

```typescript
// Revenue overview - Mock data generation
async getRevenueOverview(): Promise<...> {
  // Generates random numbers
  const amount = Math.floor(Math.random() * 2000000) + 5000000
}
```

**Fix Required:**
- Query actual invoice data for revenue
- Aggregate by month
- Calculate real totals

---

#### 2. Client Stats Hardcoded
**File:** `src/lib/services/superadmin-dashboard.service.ts`
**Lines:** 42-48

```typescript
// Returns hardcoded India distribution
return {
  India: { count: totalClients, percentage: 100 },
}
```

**Fix Required:**
- Query company addresses
- Group by country
- Calculate real percentages

---

#### 3. Payroll Growth Hardcoded
**File:** `src/lib/services/superadmin-payroll.service.ts`
**Line:** 129

```typescript
growthPercent: 8, // Hardcoded
```

**Fix Required:**
- Calculate from historical data
- Compare current vs previous month

---

#### 4. Client Deactivation/Add Not Connected
**File:** `src/app/super-admin/clients/page.tsx`

```typescript
handleAddClient() // Shows "coming soon" toast
confirmDeactivation() // 1000ms delay, no real call
```

**Fix Required:**
- Implement client creation flow
- Wire deactivation to database

---

### Database Tables Required for Super Admin

| Table | Status | Notes |
|-------|--------|-------|
| `company_company` | Exists | |
| `request_request` | Exists | |
| `superadmin_team` | Exists | |
| `superadmin_team_client` | Exists | |
| `superadmin_audit_log` | **TYPE ASSERTION USED** | May need Supabase type regen |
| `users_user` | Exists | |

---

## Cross-Cutting Issues

### 1. Authentication - Demo Users May Not Match Database

**File:** `src/lib/auth/auth-context.tsx`

```typescript
export const DEMO_USERS = {
  employee: {
    id: 'a0000001-0001-0001-0001-000000000001', // This ID must exist in DB!
    // ...
  }
}
```

**Risk:** If database doesn't have records for these exact IDs, all queries return empty

**Verification Required:**
- Check database for matching employee/contractor/company IDs
- Update IDs to match seeded data OR
- Seed data with these exact IDs

---

### 2. File Upload Storage Not Configured

Multiple pages reference file uploads:
- Expense receipts
- Tax documents
- Document library
- Employee documents

**Verification Required:**
- Check Supabase storage buckets exist
- Verify RLS policies allow uploads
- Test actual upload flow

---

### 3. Email/Notification Sending

Multiple features assume email sending:
- Leave approval notifications
- Expense approval notifications
- Password reset
- Invoice reminders

**Status:** Unknown - likely not implemented

**Fix Required:**
- Configure email provider (SendGrid, Resend, etc.)
- Create email templates
- Add notification sending service

---

### 4. PDF Generation

Multiple features need PDF generation:
- Payslips
- Invoices
- Form 16
- Employment letters
- Contracts

**Status:** Partially implemented (some client-side, some missing)

**Fix Required:**
- Choose PDF library (jsPDF, @react-pdf/renderer, or server-side)
- Implement consistent PDF generation
- Store in Supabase storage

---

## Database Schema Requirements

### Tables Needing Verification

| Table | Section | Purpose |
|-------|---------|---------|
| `attendance_employeeattendance` | Employee | Clock in/out records |
| `payroll_payslip` | Employee/Employer | Individual payslip records |
| `payroll_payrollrun` | Employer | Monthly payroll runs |
| `holiday_holiday` | All | Company holidays |

### Tables Needing Creation

| Table | Section | Purpose | Schema |
|-------|---------|---------|--------|
| `employee_preferences` | Employee | User preferences | `id, employee_id, preference_key, preference_value, created_at, updated_at` |
| `contractor_preferences` | Contractor | User preferences | `id, contractor_id, preference_key, preference_value, created_at, updated_at` |
| `company_settings` | Employer | Company settings | `id, company_id, setting_key, setting_value, created_at, updated_at` |
| `notification_read_status` | All | Read tracking | `id, user_id, notification_type, entity_id, read_at` |

---

## Priority-Based Fix Plan

### PHASE 1: CRITICAL (Week 1) - App Breaking Issues

| # | Issue | Section | Files to Modify | Estimated Effort |
|---|-------|---------|-----------------|------------------|
| 1 | Clock-in/out persistence | Employee | `attendance/clockin/page.tsx`, `attendance.service.ts` | 4-6 hours |
| 2 | Expense submission | Employee | `expenses/submit/page.tsx` | 2-3 hours |
| 3 | Timesheet submission | Contractor | `timesheets/submit/page.tsx` | 2-3 hours |
| 4 | Password change | Employee, Contractor | `profile/page.tsx` (both) | 2-3 hours |
| 5 | Leave balance format | Employee | `leaves.service.ts`, DB migration | 2-4 hours |
| 6 | Requests mock data | Employer | `requests/page.tsx` | 4-6 hours |
| 7 | Payroll processing | Employer | `payroll/dashboard/page.tsx`, new service | 6-8 hours |
| 8 | Verify demo user IDs | All | `auth-context.tsx`, DB check | 1-2 hours |

**Phase 1 Total: ~25-35 hours**

---

### PHASE 2: HIGH PRIORITY (Week 2) - Major Features Broken

| # | Issue | Section | Files to Modify | Estimated Effort |
|---|-------|---------|-----------------|------------------|
| 9 | Attendance stats real data | Employee | `attendance.service.ts` | 3-4 hours |
| 10 | Payroll history real data | Employee | `payroll.service.ts` | 3-4 hours |
| 11 | Emergency contact save | Employee | `profile/page.tsx` | 2-3 hours |
| 12 | Address save | Employee | `profile/page.tsx` | 2-3 hours |
| 13 | Team management persist | Employer | `employees/page.tsx` | 3-4 hours |
| 14 | Invoice PDF generation | Employer | `invoices/page.tsx`, new service | 4-6 hours |
| 15 | Holiday data verification | All | DB verification, seeding | 2-3 hours |
| 16 | Sidebar contractor data | Contractor | `layout.tsx` | 1-2 hours |
| 17 | Timesheet edit | Contractor | `timesheet/page.tsx` | 2-3 hours |
| 18 | Super admin revenue data | Super Admin | `superadmin-dashboard.service.ts` | 3-4 hours |

**Phase 2 Total: ~28-38 hours**

---

### PHASE 3: MEDIUM PRIORITY (Week 3) - Partial Functionality

| # | Issue | Section | Files to Modify | Estimated Effort |
|---|-------|---------|-----------------|------------------|
| 19 | Notification preferences | Employee | `profile/page.tsx`, new table | 3-4 hours |
| 20 | Notification read status | All | `notifications.service.ts`, new table | 3-4 hours |
| 21 | Dashboard error states | Employee | `dashboard/page.tsx` | 2-3 hours |
| 22 | Settings persistence | Employee, Contractor, Employer | Multiple pages, new tables | 4-6 hours |
| 23 | Tax declaration verify | Employee | Tax pages | 2-3 hours |
| 24 | Document upload verify | Employee | Document pages | 2-3 hours |
| 25 | Invoice payment actions | Employer | `invoices/page.tsx` | 2-3 hours |
| 26 | Super admin client stats | Super Admin | `superadmin-dashboard.service.ts` | 2-3 hours |
| 27 | Audit log table type | Super Admin | Supabase types regen | 1-2 hours |

**Phase 3 Total: ~22-32 hours**

---

### PHASE 4: LOW PRIORITY (Week 4) - Polish & Enhancement

| # | Issue | Section | Files to Modify | Estimated Effort |
|---|-------|---------|-----------------|------------------|
| 28 | Onboarding persistence | Employee, Contractor | Onboarding pages | 4-6 hours |
| 29 | Email notifications | All | New email service | 6-8 hours |
| 30 | Missing pages | Contractor | `/contracts`, `/notifications` | 3-4 hours |
| 31 | Compliance reports | Employer | Compliance pages | 4-6 hours |
| 32 | Custom reports | Employer | Report builder | 6-8 hours |

**Phase 4 Total: ~23-32 hours**

---

## Implementation Roadmap

### Week 1: Critical Fixes
```
Day 1-2: Authentication & Database Verification
  - Verify demo user IDs match database
  - Verify required tables exist
  - Create missing tables (preferences, notifications)

Day 3-4: Employee Critical Fixes
  - Clock-in/out persistence
  - Expense submission
  - Password change
  - Leave balance format

Day 5: Employer Critical Fixes
  - Replace mock data in requests
  - Basic payroll processing stub
```

### Week 2: High Priority Fixes
```
Day 1-2: Employee Data Fixes
  - Real attendance stats
  - Real payroll history
  - Profile saves (emergency contact, address)

Day 3-4: Employer & Contractor Fixes
  - Team management persistence
  - Invoice PDF generation
  - Contractor sidebar data
  - Timesheet edit

Day 5: Cross-cutting
  - Holiday data verification
  - Super admin revenue data
```

### Week 3: Medium Priority
```
Day 1-2: Notification System
  - Notification preferences
  - Read status tracking

Day 3-4: Settings Persistence
  - All sections' settings
  - Error states in dashboards

Day 5: Verification
  - Tax declaration flow
  - Document upload flow
  - Invoice payment actions
```

### Week 4: Polish
```
Day 1-3: Onboarding & Missing Features
  - Onboarding persistence
  - Missing contractor pages

Day 4-5: Reports & Email
  - Compliance reports
  - Email notification setup
```

---

## Testing Checklist

### Employee Section
- [ ] Can clock in and see record after refresh
- [ ] Can clock out and see total hours
- [ ] Can submit expense with receipt upload
- [ ] Expense appears in history after submit
- [ ] Can change password and login with new password
- [ ] Leave balance shows correct data for current financial year
- [ ] Payroll history shows actual payslip data
- [ ] Can save emergency contact
- [ ] Can save address
- [ ] Notification preferences persist after refresh

### Employer Section
- [ ] Can approve/reject requests (real database update)
- [ ] Can process payroll run
- [ ] Payslips generated for employees
- [ ] Can download invoice PDF
- [ ] Can update team assignments
- [ ] Settings persist after refresh
- [ ] Holiday calendar has data

### Contractor Section
- [ ] Can submit timesheet
- [ ] Timesheet appears after submit
- [ ] Can edit rejected timesheet
- [ ] Can change password
- [ ] Settings persist after refresh
- [ ] Sidebar shows actual contractor name

### Super Admin Section
- [ ] Revenue chart shows real data
- [ ] Client stats show country distribution
- [ ] Can add new client
- [ ] Can deactivate client
- [ ] Payroll growth calculated correctly
- [ ] Audit logs record all actions

---

## Conclusion

This document provides a comprehensive analysis of the Aether platform's backend integration status across all four user roles. The platform has a solid architectural foundation but requires significant work on write operations and data persistence.

**Key Statistics:**
- **Total Issues Identified:** 68
- **Critical (Must Fix):** 10
- **Total Estimated Effort:** ~98-137 hours (4-6 weeks with 1 developer)

**Recommended Approach:**
1. Fix all CRITICAL issues first (Phase 1)
2. Verify each fix with manual testing
3. Proceed to HIGH priority only after Phase 1 complete
4. Consider parallel development for independent fixes

**Success Criteria:**
- All CRITICAL and HIGH issues resolved
- Manual testing passes for all user flows
- No data loss on page refresh
- All write operations persist to database
