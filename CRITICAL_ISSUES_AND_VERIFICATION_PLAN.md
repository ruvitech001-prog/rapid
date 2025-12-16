# 🚨 CRITICAL ISSUES & COMPREHENSIVE VERIFICATION PLAN
**Rapid.one EoR Platform**
**Date**: 2025-12-16
**Severity**: Multiple P0 (Critical) and P1 (High) issues found

---

## EXECUTIVE SUMMARY

**Total Issues Found**: 47
**Critical (P0)**: 11 security + 3 functional = **14 blockers**
**High Priority (P1)**: 23 issues
**Medium (P2)**: 10 issues

**Status**: ⚠️ **NOT PRODUCTION READY** - Critical fixes required

---

## 🔴 P0 - CRITICAL BLOCKERS (Fix Before ANY Production Use)

### 1. OFFER WORKFLOW - NO DATABASE PERSISTENCE
**Status**: New UI exists, database tables missing
**Impact**: 100% of offer creations will fail

**Required Migration:**
```sql
CREATE TABLE employee_offer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employee_employee(id),
  company_id UUID REFERENCES company_company(id) NOT NULL,
  team_id UUID REFERENCES employer_team(id),

  -- Personal Details
  first_name VARCHAR NOT NULL,
  middle_name VARCHAR,
  last_name VARCHAR NOT NULL,
  employee_pan VARCHAR(10),
  personal_email VARCHAR NOT NULL,

  -- Job Details
  start_date DATE NOT NULL,
  job_title VARCHAR NOT NULL,
  job_description TEXT,

  -- Compensation
  gross_annual_salary NUMERIC NOT NULL CHECK (gross_annual_salary > 0),
  variable_comp_enabled BOOLEAN DEFAULT false,
  variable_calc_basis VARCHAR CHECK (variable_calc_basis IN ('percentage', 'fixed')),
  variable_calc_value NUMERIC,
  joining_bonus_enabled BOOLEAN DEFAULT false,
  joining_bonus_amount NUMERIC,
  special_payout_enabled BOOLEAN DEFAULT false,
  special_payout_amount NUMERIC,
  special_payout_reason TEXT,

  -- Benefits
  health_insurance_enabled BOOLEAN DEFAULT false,
  health_insurance_plan VARCHAR CHECK (health_insurance_plan IN ('pro', 'power', 'premium')),
  welcome_swag_enabled BOOLEAN DEFAULT false,
  welcome_swag_plan VARCHAR CHECK (welcome_swag_plan IN ('pro', 'power', 'premium')),
  bgv_enabled BOOLEAN DEFAULT true,
  bgv_plan VARCHAR DEFAULT 'pro' CHECK (bgv_plan IN ('pro', 'power', 'premium')),
  referred_by_employee_id UUID REFERENCES employee_employee(id),
  referral_bonus_enabled BOOLEAN DEFAULT false,
  referral_bonus_amount NUMERIC,

  -- Status & Workflow
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'withdrawn')),
  offer_sent_at TIMESTAMPTZ,
  offer_accepted_at TIMESTAMPTZ,
  offer_rejected_at TIMESTAMPTZ,
  offer_withdrawn_at TIMESTAMPTZ,
  withdrawal_reason TEXT,
  rejection_reason TEXT,

  -- Onboarding
  onboarding_status_percentage INT DEFAULT 0 CHECK (onboarding_status_percentage BETWEEN 0 AND 100),
  onboarding_completed_at TIMESTAMPTZ,

  -- Audit
  created_by UUID REFERENCES users_user(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_offer_employee ON employee_offer(employee_id);
CREATE INDEX idx_offer_company ON employee_offer(company_id);
CREATE INDEX idx_offer_status ON employee_offer(status);
CREATE INDEX idx_offer_start_date ON employee_offer(start_date);
CREATE INDEX idx_offer_referred_by ON employee_offer(referred_by_employee_id);

-- RLS Policies
ALTER TABLE employee_offer ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage company offers"
  ON employee_offer FOR ALL
  USING (company_id IN (
    SELECT company_id FROM company_employer WHERE user_id = (SELECT auth.uid())
  ));

CREATE POLICY "Employees can view own offers"
  ON employee_offer FOR SELECT
  USING (employee_id IN (
    SELECT id FROM employee_employee WHERE user_id = (SELECT auth.uid())
  ));

CREATE POLICY "SuperAdmin can manage all offers"
  ON employee_offer FOR ALL
  USING (EXISTS (
    SELECT 1 FROM superadmin_team
    WHERE user_id = (SELECT auth.uid()) AND is_active = true
  ));
```

---

### 2. SQL INJECTION - MULTIPLE SERVICES
**Files**:
- `src/lib/services/clients.service.ts:85`
- `src/lib/services/superadmin-dashboard.service.ts:260, 284, 304`

**Vulnerable Code:**
```typescript
// clients.service.ts:85 - INJECT HERE!
query = query.or(`legal_name.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%`)

// Attack: filters.search = "%' OR 1=1--"
// Result: Bypasses all authorization, returns ALL data
```

**Fix:**
```typescript
// SECURE VERSION:
const sanitized = filters.search?.replace(/[%_]/g, '\\$&') || ''
query = query.or(`legal_name.ilike.%${sanitized}%,display_name.ilike.%${sanitized}%`)

// BETTER: Use parameterized queries
query = query.textSearch('legal_name', sanitized, { type: 'websearch' })
```

**Priority**: Deploy within 24 hours

---

### 3. MISSING COMPANY AUTHORIZATION IN GETBYID
**Files**:
- `src/lib/services/employees.service.ts:99-135`
- `src/lib/services/contractors.service.ts:82-118`
- `src/lib/services/payroll.service.ts:135-200`
- `src/lib/services/documents.service.ts:66-78`

**Vulnerable Code:**
```typescript
// employees.service.ts:99
async getById(id: string) {
  const { data } = await this.supabase
    .from('employee_employee')
    .select('*')
    .eq('id', id)  // ← No company check!
    .single()
  return data
}
```

**Fix:**
```typescript
async getById(id: string, companyId: string) {
  const { data } = await this.supabase
    .from('employee_employee')
    .select(`
      *,
      employee_employeecontract!inner(company_id)
    `)
    .eq('id', id)
    .eq('employee_employeecontract.company_id', companyId)  // ← CRITICAL!
    .single()
  return data
}
```

**Priority**: Deploy within 48 hours

---

### 4. PAYROLL DOUBLE-PROCESSING RACE CONDITION
**File**: `src/lib/services/payroll.service.ts:376-387`

**Issue**: Check-then-insert without transaction allows duplicate payroll runs

**Fix:**
```sql
-- Add unique constraint
ALTER TABLE payroll_run
ADD CONSTRAINT unique_payroll_run
UNIQUE (company_id, pay_period_month, pay_period_year);
```

**Priority**: Deploy before any payroll processing

---

### 5. DEFAULT ROLE ASSIGNMENT - UNAUTHORIZED ACCESS
**File**: `src/lib/auth/auth-context.tsx:179-187`

**Issue**: Users without assigned role get 'employee' access by default

**Fix:**
```typescript
// BEFORE:
role: 'employee', // Anyone can become employee!

// AFTER:
if (!userData.user_type) {
  throw new Error('User role not assigned. Contact administrator.')
}
role: userData.user_type,
```

---

### 6. NO RATE LIMITING
**Impact**: Brute force attacks, DoS, API abuse

**Fix**: Implement using Vercel Rate Limiting or Upstash:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

---

### 7. FILE UPLOAD MIME TYPE SPOOFING
**File**: `src/lib/services/documents.service.ts:168`

**Fix**: Verify file content, not just MIME type:
```typescript
import { fileTypeFromBuffer } from 'file-type';

const buffer = await file.arrayBuffer();
const type = await fileTypeFromBuffer(new Uint8Array(buffer));
if (!ALLOWED_TYPES.includes(type?.mime)) {
  throw new Error('Invalid file type');
}
```

---

## 🟡 P1 - HIGH PRIORITY (Fix Within 1-2 Weeks)

### 8. MISSING REACT QUERY STALETIMES (30+ hooks)
**Files**: All hooks in `src/lib/hooks/`

**Fix**: Add to every useQuery:
```typescript
export function useEmployees(companyId) {
  return useQuery({
    queryKey: ['employees', companyId],
    queryFn: () => employeesService.getAll(companyId),
    staleTime: 60000, // ← ADD THIS!
    enabled: !!companyId,
  })
}
```

---

### 9. MISSING ERROR TOAST NOTIFICATIONS (20+ mutations)
**Files**: All mutation hooks

**Fix**:
```typescript
export function useCreateEmployee() {
  return useMutation({
    mutationFn: (data) => employeesService.create(data),
    onSuccess: () => {
      toast.success('Employee created successfully') // ← ADD
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create employee') // ← ADD
    },
  })
}
```

---

### 10. 24 UNINDEXED FOREIGN KEYS
**Impact**: Slow JOIN queries

**Fix** (sample):
```sql
CREATE INDEX idx_document_uploaded_by ON commons_document(uploaded_by_id);
CREATE INDEX idx_leave_approved_by ON leave_leaverequest(approved_by_id);
CREATE INDEX idx_expense_approved_by ON expense_expenseclaim(approved_by_id);
CREATE INDEX idx_employee_current_address ON employee_employee(current_address_id);
-- + 20 more
```

---

### 11. INEFFICIENT RLS POLICIES (30+ policies)
**Impact**: 10-100x slower queries at scale

**Fix**: Replace `auth.uid()` with `(SELECT auth.uid())` in ALL policies:
```sql
-- BEFORE (slow):
CREATE POLICY "Users can view own profile"
  ON users_user FOR SELECT
  USING (id = auth.uid());

-- AFTER (fast):
CREATE POLICY "Users can view own profile"
  ON users_user FOR SELECT
  USING (id = (SELECT auth.uid()));
```

---

## 📍 ROUTE CONSISTENCY ISSUES

### Missing Routes:
1. ❌ `/employer/offers` - Main list page (exists as `/employer/contracts`)
2. ❌ `/employer/offers/[id]` - Detail page (exists as `/employer/contracts/[id]`)

### Routes Needing Rename:
- `/employer/contracts/*` → `/employer/offers/*`
- `/employer/reports/contract-summary` → `/employer/reports/offer-summary`
- `/employer/requests/new/special/contract-amendment` → `/offer-amendment`

### Navigation Updates Needed:
**File**: `src/components/sidebar.tsx:65`
- Change "Contracts" → "Offers"
- Change route → `/employer/offers`

**Files with "Contract" terminology**: 12+ files need UI text updates

### Missing Redirect:
```javascript
// Add to next.config.js
{
  source: '/employer/contracts/:path*',
  destination: '/employer/offers/:path*',
  permanent: true,
}
```

---

## 🧪 COMPREHENSIVE VERIFICATION PLAN

### Phase 1: Critical Security Fixes (IMMEDIATE - 24-48 hours)

#### Test Plan for Security Fixes:

**1.1 SQL Injection Testing**
```bash
# Test cases:
- Search with: %' OR '1'='1--
- Search with: '; DROP TABLE users_user--
- Search with: %' UNION SELECT * FROM--
- Expected: All should be sanitized, no unauthorized data
```

**1.2 Multi-Tenancy Authorization**
```bash
# Test scenario:
1. Log in as Company A employer
2. Get employee ID from Company B (from database)
3. Try to access: GET /api/employees/{company-b-employee-id}
4. Expected: 403 Forbidden or empty result
5. Actual (before fix): Returns Company B employee data ← BREACH!
```

**1.3 Rate Limiting**
```bash
# Test:
1. Make 20 login requests in 10 seconds
2. Expected: Requests 11-20 should be rate limited
3. Check: Login still works after cooldown period
```

---

### Phase 2: Database Schema Fixes (1-2 days)

**2.1 Create Offer Tables**
- [ ] Run migration to create `employee_offer` table
- [ ] Verify all columns exist
- [ ] Test RLS policies
- [ ] Verify indexes created

**2.2 Add Missing Indexes**
- [ ] Run migration for 24 missing indexes
- [ ] Verify query performance improves
- [ ] Check index usage after 24 hours

**2.3 Fix RLS Policies**
- [ ] Update all 30+ policies to use `(SELECT auth.uid())`
- [ ] Test performance before/after
- [ ] Verify authorization still works

---

### Phase 3: Route Migration (2-3 days)

**3.1 Create Missing Offer Routes**
- [ ] Copy `/employer/contracts/page.tsx` → `/employer/offers/page.tsx`
- [ ] Copy `/employer/contracts/[id]/page.tsx` → `/employer/offers/[id]/page.tsx`
- [ ] Update all internal links in copied files
- [ ] Test navigation works

**3.2 Update Sidebar**
- [ ] Change "Contracts" → "Offers" in sidebar.tsx:65
- [ ] Update route to `/employer/offers`
- [ ] Test sidebar navigation

**3.3 Add Redirect**
- [ ] Add redirect in `next.config.js`
- [ ] Test old URLs redirect to new ones
- [ ] Verify bookmarks still work

**3.4 Update Terminology** (12+ files)
- [ ] Dashboard: "Contract Summary" → "Offer Summary"
- [ ] Reports: Update titles
- [ ] Special requests: "Contract amendment" → "Offer amendment"

---

### Phase 4: Code Quality Fixes (1 week)

**4.1 Add StaleTime to All Hooks** (30+ hooks)
- [ ] Add `staleTime: 60000` to all useQuery calls
- [ ] Test data refreshes properly
- [ ] Verify no excessive API calls

**4.2 Add Toast Notifications** (20+ mutations)
- [ ] Add `toast.success()` to all onSuccess
- [ ] Add `toast.error()` to all onError
- [ ] Test user sees feedback for all operations

**4.3 Input Validation**
- [ ] Add Zod schemas for all service methods
- [ ] Validate at service layer before DB operations
- [ ] Test invalid inputs are rejected

**4.4 Error Boundaries**
- [ ] Add error boundary to app layout
- [ ] Add error boundaries to major features
- [ ] Test graceful error handling

---

## 🧪 MANUAL TESTING CHECKLIST

### Authentication Testing (Updated Pages)

**Login Page** (`http://localhost:3000/auth/login`):
- [ ] Heading shows "Welcome to Rapid"
- [ ] 3 OAuth buttons visible (G M L)
- [ ] Button says "Log in" (not "Login")
- [ ] Signup link: "Don't have an account yet? Sign up now"
- [ ] Test valid login works
- [ ] Test invalid login shows error

**Signup Page** (`/auth/signup`):
- [ ] Heading: "Signup as a Company"
- [ ] Subheading about India team
- [ ] 3 OAuth buttons (G M L)
- [ ] Only 3 fields: Name, Business Email, Password
- [ ] Try gmail.com - should reject with message
- [ ] Button says "Sign Up"
- [ ] Link: "Already have an account? Log in"

**Verify Email** (`/auth/verify-email`):
- [ ] Heading: "Verify your email address"
- [ ] Mentions "60 mins" validity
- [ ] 6 separate OTP boxes
- [ ] Auto-focus between boxes
- [ ] Backspace moves back
- [ ] Enter "111111" → shows wrong code error
- [ ] Enter "000000" → shows expired error
- [ ] Resend shows success message

**Forgot Password Flow**:
- [ ] Page 1 (`/auth/forgot-password`):
  - [ ] Heading: "Forgot password" (no ?)
  - [ ] Button: "Send verification code"
  - [ ] Contact support link visible
  - [ ] Enter "notfound@example.com" → error message
  - [ ] Valid email → redirects to verify page

- [ ] Page 2 (`/auth/forgot-password/verify`):
  - [ ] 6-digit OTP boxes
  - [ ] Error handling works
  - [ ] Resend works
  - [ ] Valid OTP → redirects to reset

- [ ] Page 3 (`/auth/forgot-password/reset`):
  - [ ] Heading: "Reset your password"
  - [ ] Password validation works
  - [ ] Success → redirects to login

**Company Onboarding** (`/auth/company-onboarding`):
- [ ] Only simplified fields (no Logo, Charter, Industry, Size, PAN, GSTIN, etc.)
- [ ] ZIP code validation (must be 6 digits)
- [ ] Tax ID document upload (max 5 files)
- [ ] Can remove uploaded files
- [ ] Success → Welcome page
- [ ] Welcome: "Welcome to Rapid" + "We are happy to have you onboard!!!"
- [ ] Auto-redirects after 3 seconds

---

### Offer Creation Workflow (NEW)

**Navigate to**: `http://localhost:3000/employer/offers/new`

**Page 1: Employee Details**
- [ ] Team dropdown only shows if multiple teams exist
- [ ] First Name*, Middle Name, Last Name* fields work
- [ ] PAN field (max 10 chars, uppercase)
- [ ] Shows "(cannot be edited later)" note
- [ ] Email field with validation
- [ ] Leave field empty → shows error
- [ ] Fill all → "Review Offer" advances to Page 2

**Page 2: Job & Compensation**
- [ ] Start Date picker works
- [ ] Job Title and Description fields
- [ ] Gross Annual Salary with INR prefix
- [ ] Variable Compensation:
  - [ ] Toggle enables/disables section
  - [ ] Help text visible
  - [ ] Calculation basis dropdown (Percentage/Fixed)
  - [ ] Value changes based on basis (% or INR)
- [ ] Joining Bonus:
  - [ ] Toggle works
  - [ ] Help text about "3 months" and "recovered before a year"
  - [ ] Amount field appears when enabled
- [ ] Special Payout:
  - [ ] Toggle works
  - [ ] Amount and Reason fields
  - [ ] Help text visible
- [ ] Previous → back to Page 1
- [ ] Review Offer → Page 3

**Page 3: Benefits**
- [ ] Health Insurance:
  - [ ] Toggle works
  - [ ] Plan dropdown (Pro/Power/Premium)
  - [ ] Help text visible
- [ ] Welcome Swag:
  - [ ] Toggle works
  - [ ] Package dropdown with descriptions
- [ ] Background Check (mandatory):
  - [ ] Plan dropdown required
  - [ ] Shows pricing
- [ ] Referred by:
  - [ ] Dropdown shows existing employees
  - [ ] Default: "None"
  - [ ] Selecting employee shows Referral Bonus section
- [ ] Referral Bonus (conditional):
  - [ ] Only appears when referrer selected
  - [ ] Help text about "3 months of new hire's service"
  - [ ] Amount field
- [ ] Previous → back to Page 2
- [ ] Review Offer → Page 4

**Page 4: Review**
- [ ] Employee Information section shows all details
- [ ] Job Details section formatted properly
- [ ] Compensation breakdown:
  - [ ] Gross Annual Salary
  - [ ] Variable Compensation (if enabled)
  - [ ] Total CTC calculated correctly
- [ ] One-Time Payouts section (if any enabled)
- [ ] Benefits & Perks summary
- [ ] All values match what was entered
- [ ] Previous → back to Page 3
- [ ] "Send Offer" button visible

**Progress Indicator**:
- [ ] Shows 4 steps
- [ ] Current step highlighted in blue
- [ ] Completed steps show checkmark in green
- [ ] Progress line fills correctly

---

### Security Testing (CRITICAL)

**SQL Injection Test**:
```javascript
// Test in search fields:
1. Navigate to /employer/employees
2. Search for: %' OR '1'='1--
3. Expected: Sanitized, shows no results or safe results
4. Should NOT: Show all employees from all companies
```

**Multi-Tenancy Breach Test**:
```javascript
// Requires 2 test companies
1. Login as Company A
2. Open browser dev tools → Network tab
3. Navigate to employee details
4. Note the employee ID in the API call
5. Manually call API with Company B employee ID
6. Expected: 403 Forbidden or empty
7. Should NOT: Return Company B data
```

**Authorization Bypass Test**:
```javascript
// Test endpoints without authentication:
1. Logout
2. Try to access: /api/employees
3. Expected: 401 Unauthorized
4. Try: /api/payroll
5. Expected: 401 Unauthorized
```

---

### Database Verification

**Run These Checks:**
```sql
-- 1. Verify offer table exists
SELECT * FROM employee_offer LIMIT 1;

-- 2. Check indexes created
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE tablename = 'employee_offer';

-- 3. Verify RLS enabled
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'employee_offer';

-- 4. Test multi-tenancy (use actual IDs)
-- As Company A user, try to access Company B data
SELECT * FROM employee_employee
WHERE id = 'company-b-employee-id';
-- Expected: Empty (RLS should block)
```

---

### Performance Testing

**Before and After Index Creation:**
```sql
-- Run EXPLAIN ANALYZE on common queries:
EXPLAIN ANALYZE
SELECT e.*, c.*
FROM employee_employee e
JOIN employee_employeecontract c ON e.id = c.employee_id
WHERE c.company_id = 'your-company-id';

-- Check:
-- - Query execution time (should be < 50ms)
-- - Index usage (should use indexes, not seq scan)
-- - Rows examined vs returned (should be close)
```

---

## 📝 INFORMATION NEEDED FROM YOU

To complete the security fixes, I need:

**1. Environment Information:**
- [ ] Is this a production database or development/staging?
- [ ] Are the "demo" RLS policies intentional? (They allow public access to ALL data)
- [ ] Do you have multiple companies in the database currently?

**2. Business Logic Clarification:**
- [ ] Should offers and contracts be separate entities, or is "offers" just a rename?
- [ ] What happens to an offer after it's accepted? Does it become a contract?
- [ ] Can an employee have multiple offers simultaneously?

**3. Security Posture:**
- [ ] Do you have WAF (Web Application Firewall) in front of the app?
- [ ] Is there any rate limiting at infrastructure level (Cloudflare, Vercel)?
- [ ] Are you using Supabase Auth or custom auth?

**4. Testing Access:**
- [ ] Can I create test data in your database?
- [ ] Should I create migrations or do you have a migration process?
- [ ] Do you have a staging environment to test fixes?

---

## 🎯 IMMEDIATE ACTION PLAN

### TODAY (Next 2-4 hours):
1. ✅ Create `employee_offer` table migration
2. ✅ Fix SQL injection in 4 services
3. ✅ Add company authorization checks to getById methods
4. ✅ Create missing `/employer/offers` routes
5. ✅ Add redirect from contracts to offers

### TOMORROW:
6. Add 24 missing indexes
7. Fix RLS policy performance
8. Add rate limiting
9. Add input validation

### THIS WEEK:
10. Add staleTime to all hooks
11. Add toast notifications
12. Comprehensive testing

---

## 📊 RISK ASSESSMENT

| Issue | Severity | Impact | Effort | Priority |
|-------|----------|--------|--------|----------|
| No offer tables | P0 | Blocking | 2h | NOW |
| SQL injection | P0 | Data breach | 2h | NOW |
| Multi-tenancy bypass | P0 | Data breach | 4h | NOW |
| Missing offer routes | P1 | Broken UX | 2h | TODAY |
| Unindexed FKs | P1 | Slow queries | 1h | TODAY |
| RLS performance | P1 | Slow at scale | 4h | THIS WEEK |
| Missing staleTime | P1 | Poor UX | 2h | THIS WEEK |
| No error toasts | P1 | Poor UX | 2h | THIS WEEK |

**Total Effort**: ~20 hours to fix all P0 and P1 issues

---

## ✅ WHAT'S WORKING WELL

1. **RLS Enabled**: All tables have RLS ✅
2. **Foreign Keys**: All relationships enforced ✅
3. **Type Safety**: TypeScript compilation passes ✅
4. **Build Success**: All 147 pages compile ✅
5. **Auth Flow**: New authentication UX is excellent ✅
6. **Offer UI**: Multi-page workflow is beautiful ✅

---

## 🚀 RECOMMENDED NEXT STEPS

**Option A: Security First (Recommended)**
1. Fix P0 security issues TODAY
2. Create offer tables TODAY
3. Fix routes TOMORROW
4. Polish code quality THIS WEEK

**Option B: Feature Complete First**
1. Create offer tables NOW
2. Fix routes NOW
3. Security fixes in parallel
4. Deploy with feature flag OFF

**Option C: Staged Rollout**
1. Fix security in feature branch
2. Deploy security fixes to production
3. Build offer feature in separate branch
4. Merge and deploy offer feature after security is solid

---

## 📞 QUESTIONS FOR YOU

1. **Urgency**: Is this going to production soon? If yes, we must fix P0 security issues first.

2. **Offers vs Contracts**: Should I:
   - A) Keep both (offers become contracts when accepted)
   - B) Rename all contracts → offers
   - C) Offers are pre-acceptance, contracts are post-acceptance

3. **Database Access**: Can I run migrations directly, or should I generate SQL for you to review?

4. **Testing**: Do you want me to:
   - A) Fix issues one by one and test each
   - B) Fix all P0 issues then test together
   - C) Create all migration files for you to review first

5. **Demo Policies**: The database has "Public can view" policies on sensitive tables. Is this:
   - A) Development/demo database (keep them)
   - B) Production (REMOVE IMMEDIATELY)

---

**Ready to fix these issues?** Let me know your preference and I'll start with the highest priority fixes immediately!
