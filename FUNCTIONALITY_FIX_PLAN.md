# Aether - Comprehensive Functionality Fix Plan

> **Document Version:** 1.0
> **Date:** December 8, 2025
> **Scope:** Employer Dashboard + SuperAdmin Dashboard

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Employer Dashboard Analysis](#3-employer-dashboard-analysis)
4. [SuperAdmin Dashboard Analysis](#4-superadmin-dashboard-analysis)
5. [Critical Issues Summary](#5-critical-issues-summary)
6. [User Flow Analysis](#6-user-flow-analysis)
7. [Detailed Fix Plan](#7-detailed-fix-plan)
8. [Database Requirements](#8-database-requirements)
9. [Implementation Roadmap](#9-implementation-roadmap)

---

## 1. Executive Summary

### Current State Assessment

| Dashboard | Completion | Backend Integration | UI Functional |
|-----------|------------|---------------------|---------------|
| **Employer** | ~65% | 70% working | 50% working |
| **SuperAdmin** | ~60% | 65% working | 45% working |

### Key Findings

- **Good:** Architecture is well-structured with clear separation (pages → hooks → services)
- **Good:** React Query integration provides good caching and state management
- **Bad:** Many UI buttons are purely visual with no onClick handlers
- **Bad:** Dashboard charts show mock/random data instead of real data
- **Bad:** Settings and Profile pages don't persist changes
- **Bad:** Several database tables may not exist (audit logs, holidays)

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        UI LAYER (Pages)                         │
│  src/app/employer/*, src/app/super-admin/*                     │
│  Status: Buttons render but many lack onClick handlers          │
├─────────────────────────────────────────────────────────────────┤
│                       HOOKS LAYER                               │
│  src/lib/hooks/use-*.ts                                        │
│  Status: Well implemented with React Query                      │
├─────────────────────────────────────────────────────────────────┤
│                     SERVICES LAYER                              │
│  src/lib/services/*.service.ts                                 │
│  Status: Queries work, some mock data present                   │
├─────────────────────────────────────────────────────────────────┤
│                    DATABASE (Supabase)                          │
│  Tables: company_*, employee_*, contractor_*, leave_*          │
│  Status: Some tables may not exist, demo data may be missing   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Employer Dashboard Analysis

### 3.1 Pages & Their Status

| Page | Location | Backend Connected | Actions Work | Issues |
|------|----------|-------------------|--------------|--------|
| Dashboard | `/employer/dashboard` | Yes | **NO** | "Pay now", "Approve" buttons non-functional |
| Employees List | `/employer/employees` | Yes | Partial | View works, Edit/Delete not wired |
| Employee Detail | `/employer/employees/[id]` | Yes | **NO** | All action buttons decorative |
| Invoices | `/employer/invoices` | Yes | **NO** | Create/View/Download buttons non-functional |
| Paid Invoices | `/employer/invoices/paid` | Yes | **NO** | Action buttons non-functional |
| Leave Requests | `/employer/leave/requests` | Yes | **YES** | Approve/Reject work correctly |
| Payroll Dashboard | `/employer/payroll/dashboard` | Yes | **NO** | "Run Payroll", "Process Now" non-functional |
| Timesheet | `/employer/timesheet` | Yes | Partial | View works, approve/reject unclear |
| Reports | `/employer/reports/*` | Partial | **NO** | Download/Export non-functional |

### 3.2 Employer Dashboard Specific Issues

#### 3.2.1 Dashboard Page (`src/app/employer/dashboard/page.tsx`)

**Non-functional Buttons:**
```typescript
// Line ~473-480: "Pay now" button has no onClick
<Button variant="outline" className="text-xs h-7 px-3">
  Pay now  // <- No onClick handler!
</Button>

// Line ~650-658: "Approve" button on requests has no onClick
<Button variant="outline" size="sm" className="text-primary border-primary">
  Approve  // <- No onClick handler!
</Button>
```

**Chart Data Masking:**
```typescript
// Line ~112-115: Uses fallback to prevent empty chart
const dynamicTeamData = [
  { name: 'Employees', value: activeEmployees || 1, fill: colors.aqua400 },
  { name: 'Contractors', value: activeContractors || 1, fill: colors.rose200 },
]
// Issue: Shows "1" when data is actually 0 - misleading
```

#### 3.2.2 Invoices Page (`src/app/employer/invoices/page.tsx`)

**Non-functional Actions:**
- "Create Invoice" button doesn't open modal or navigate
- Row "View" action doesn't navigate to detail page
- "Download" action doesn't trigger download
- Status change buttons have no handlers

#### 3.2.3 Payroll Dashboard (`src/app/employer/payroll/dashboard/page.tsx`)

**Non-functional Actions:**
```typescript
// Line ~161-164: Button does nothing
<Button size="lg" className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
  <Plus className="h-4 w-4" />
  Run Payroll  // <- No onClick handler!
</Button>

// Line ~217-219: Process Now does nothing
<Button className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
  Process Now  // <- No onClick handler!
</Button>
```

**Hardcoded/Calculated Values:**
```typescript
// Line ~142: Deductions are estimated, not from actual data
const totalDeductions = Math.round(monthlyPayroll * 0.17) // ~17% typical deductions
```

#### 3.2.4 Cost Calculation Inconsistency

**In `invoices.service.ts`:**
```typescript
// Uses gross_salary for cost calculation
const { data: contracts } = await this.supabase
  .from('employee_employeecontract')
  .select('gross_salary, start_date')
```

**In `dashboard.service.ts`:**
```typescript
// Uses ctc for different calculations
.select('ctc')
```

**Issue:** Cost calculations may not align across the app due to different field usage.

### 3.3 Employer Hooks Status

| Hook | File | Query Works | Mutation Works |
|------|------|-------------|----------------|
| useCompanyInvoices | use-invoices.ts | ✅ | - |
| usePendingInvoices | use-invoices.ts | ✅ | - |
| usePayInvoice | use-invoices.ts | ✅ | Not called |
| useApproveInvoice | use-invoices.ts | ✅ | Not called |
| useTotalPayrollCost | use-payroll.ts | ✅ | - |
| useCompanyPayrollSummary | use-payroll.ts | ✅ | - |
| useLeaveRequests | use-leaves.ts | ✅ | - |
| useApproveLeave | use-leaves.ts | ✅ | ✅ Used |
| useRejectLeave | use-leaves.ts | ✅ | ✅ Used |
| useCompanyAttendanceStats | use-attendance.ts | ✅ | - |

---

## 4. SuperAdmin Dashboard Analysis

### 4.1 Pages & Their Status

| Page | Location | Backend Connected | Actions Work | Issues |
|------|----------|-------------------|--------------|--------|
| Dashboard | `/super-admin/dashboard` | Partial | View links work | Revenue/Invoice charts show MOCK DATA |
| Requests | `/super-admin/requests` | Yes | **YES** | Approve/Reject work with audit logging |
| Access Control | `/super-admin/access-control` | Yes | Partial | Edit role works, Add new user BROKEN |
| Audit Logs | `/super-admin/audit-logs` | Yes | View only | Export button non-functional |
| Clients | `/super-admin/clients` | Yes | **NO** | All action buttons (View/Edit/Deactivate) non-functional |
| Team Members | `/super-admin/team-members` | Yes | **NO** | All action buttons non-functional |
| Invoices | `/super-admin/invoices` | Yes | **NO** | Generate/Download/Remind/Mark Paid non-functional |
| Payroll | `/super-admin/payroll` | Simulated | **NO** | Data is artificially generated, Run Payroll non-functional |
| Leaves | `/super-admin/leaves` | Yes | View only | No approve/reject actions available |
| Profile | `/super-admin/profile` | **NO** | Simulated | All saves are setTimeout mocks, not persisted |
| Settings | `/super-admin/settings` | **NO** | Simulated | All saves are setTimeout mocks, not persisted |

### 4.2 SuperAdmin Dashboard Specific Issues

#### 4.2.1 Dashboard Mock Data (`src/lib/services/superadmin-dashboard.service.ts`)

```typescript
// Lines 103-127: Revenue and Invoice data are RANDOM NUMBERS
private getRevenueOverview(): { month: string; amount: number }[] {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month) => ({
    month,
    amount: Math.floor(Math.random() * 50000) + 100000,  // <- RANDOM!
  }))
}

private getInvoiceOverview(): { month: string; raised: number; received: number }[] {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month) => {
    const raised = Math.floor(Math.random() * 30) + 20  // <- RANDOM!
    return {
      month,
      raised,
      received: Math.floor(raised * 0.85),
    }
  })
}
```

**Impact:** Dashboard charts show different values on every page load.

#### 4.2.2 Clients Page (`src/app/super-admin/clients/page.tsx`)

**Non-functional Actions:**
```typescript
// Lines 166-178: Dropdown actions have no onClick handlers
<DropdownMenuItem>
  <Eye className="h-4 w-4 mr-2" />
  View Details  // <- No onClick!
</DropdownMenuItem>
<DropdownMenuItem>
  <Edit className="h-4 w-4 mr-2" />
  Edit  // <- No onClick!
</DropdownMenuItem>
<DropdownMenuItem className="text-destructive">
  <Trash2 className="h-4 w-4 mr-2" />
  Deactivate  // <- No onClick!
</DropdownMenuItem>
```

**Add Client Link Broken:**
```typescript
// Line 78: Links to anchor that doesn't exist
<Link href="#add-client">
  <Plus className="h-4 w-4 mr-2" />
  Add New Client
</Link>
```

#### 4.2.3 Settings Page (`src/app/super-admin/settings/page.tsx`)

**All Saves Are Simulated:**
```typescript
// Example from Line 98-107: Save is just a timeout
const handleSaveBasicInfo = async () => {
  setIsSavingBasicInfo(true)
  try {
    await new Promise(resolve => setTimeout(resolve, 500))  // <- FAKE SAVE!
    toast.success('Basic information saved successfully')
  } catch {
    toast.error('Failed to save basic information')
  } finally {
    setIsSavingBasicInfo(false)
  }
}
```

**Impact:** All settings are lost on page refresh.

#### 4.2.4 Profile Page (`src/app/super-admin/profile/page.tsx`)

**Simulated Updates + Hardcoded Data:**
- Password change is simulated (setTimeout)
- Profile update is simulated (setTimeout)
- Login activity shows hardcoded dummy data
- No actual backend integration

#### 4.2.5 Access Control - Add User Broken

```typescript
// Line 159-161: Shows message instead of creating user
toast.info('To add a new team member, they must have an existing user account')
// The create flow is incomplete - can't actually add new users
```

#### 4.2.6 Payroll Simulated Data (`src/lib/services/superadmin-payroll.service.ts`)

**Payroll runs are artificially generated, not from database:**
```typescript
// Payroll history is created with hardcoded variations
const payrollRuns = months.map((monthDate, index) => {
  // Uses 2% decrease per month back - not real data
  const variation = 1 - (index * 0.02)
  ...
})
```

#### 4.2.7 Missing Tables

The following tables are required but may not exist:
- `superadmin_audit_log` - Used for audit logging
- `superadmin_team` - Used for team member management
- `superadmin_team_client` - Used for client assignments
- `holiday_holiday` - Used for upcoming holidays

### 4.3 SuperAdmin Hooks Status

| Hook | File | Query Works | Mutation Works |
|------|------|-------------|----------------|
| useSuperAdminDashboard | use-superadmin-dashboard.ts | ✅ (mock data) | - |
| useSuperAdminRequests | use-superadmin-requests.ts | ✅ | - |
| useApproveRequest | use-superadmin-requests.ts | ✅ | ✅ + Audit |
| useRejectRequest | use-superadmin-requests.ts | ✅ | ✅ + Audit |
| useSuperAdminTeam | use-superadmin-team.ts | ✅ | - |
| useCreateTeamMember | use-superadmin-team.ts | ✅ | Incomplete |
| useUpdateTeamMember | use-superadmin-team.ts | ✅ | ✅ + Audit |
| useDeleteTeamMember | use-superadmin-team.ts | ✅ | ✅ + Audit |
| useSuperAdminAuditLogs | use-superadmin-audit.ts | ✅ | - |
| useSuperAdminInvoices | use-superadmin-invoices.ts | ✅ | - |
| useSuperAdminPayrollRuns | use-superadmin-payroll.ts | ✅ (simulated) | - |
| useSuperAdminLeaves | use-superadmin-leaves.ts | ✅ | - |
| useSuperAdminCompanies | use-superadmin-dashboard.ts | ✅ | - |

---

## 5. Critical Issues Summary

### 5.1 Priority 1 - CRITICAL (Blocks Core Functionality)

| ID | Issue | Location | Impact |
|----|-------|----------|--------|
| C1 | Dashboard "Pay now" button non-functional | employer/dashboard | Can't pay invoices from dashboard |
| C2 | Dashboard "Approve" button non-functional | employer/dashboard | Can't approve requests from dashboard |
| C3 | Invoice actions non-functional | employer/invoices | Can't manage invoices |
| C4 | Payroll actions non-functional | employer/payroll/dashboard | Can't process payroll |
| C5 | SuperAdmin revenue/invoice charts show random data | super-admin/dashboard | Misleading financial information |
| C6 | SuperAdmin Settings don't persist | super-admin/settings | Settings lost on refresh |
| C7 | SuperAdmin Profile don't persist | super-admin/profile | Profile changes lost |
| C8 | Clients page actions non-functional | super-admin/clients | Can't manage clients |
| C9 | Team Members page actions non-functional | super-admin/team-members | Can't manage workforce |
| C10 | Add Team Member broken | super-admin/access-control | Can't add new admin users |

### 5.2 Priority 2 - HIGH (Significant User Impact)

| ID | Issue | Location | Impact |
|----|-------|----------|--------|
| H1 | Missing database tables | Database | Audit logs, holidays may not work |
| H2 | Demo user UUIDs may not match database | auth-context.tsx | Empty data if not seeded |
| H3 | Cost calculation field mismatch | invoices.service.ts vs dashboard.service.ts | Inconsistent amounts |
| H4 | Chart fallback masks empty data | employer/dashboard | Shows "1" when data is 0 |
| H5 | No error state UI | All pages | Users don't see why data fails |
| H6 | Payroll data is simulated | super-admin/payroll | Not real payroll information |
| H7 | Compliance stats hardcoded | super-admin/audit-logs | Always shows "100% Compliant" |
| H8 | Export/Download buttons non-functional | Multiple pages | Can't export data |

### 5.3 Priority 3 - MEDIUM (UX/Polish Issues)

| ID | Issue | Location | Impact |
|----|-------|----------|--------|
| M1 | Currency display inconsistency | Multiple pages | USD vs INR |
| M2 | Financial year format mismatch | leaves.service.ts | May miss leave balance data |
| M3 | No pagination on list views | Multiple pages | Performance with large datasets |
| M4 | Dashboard refetch every 60s | super-admin/dashboard | May be expensive |
| M5 | Rate limiting per hook instance | use-superadmin-requests.ts | Could be bypassed |
| M6 | Quick action links may 404 | employer/payroll/dashboard | Links to non-existent routes |
| M7 | Holidays table may be empty | super-admin/dashboard | Shows "No upcoming holidays" |

---

## 6. User Flow Analysis

### 6.1 Employer - Invoice Payment Flow

```
Current Flow (BROKEN):
1. User views Dashboard → Sees pending invoices
2. Clicks "Pay now" → NOTHING HAPPENS
3. User frustrated → No way to pay from dashboard

Expected Flow:
1. User views Dashboard → Sees pending invoices
2. Clicks "Pay now" → Opens payment modal OR navigates to invoice detail
3. User confirms payment → Invoice marked as paid
4. Dashboard updates → Invoice moves to "Recently Paid"
```

### 6.2 Employer - Leave Approval Flow

```
Current Flow (WORKS):
1. User views Leave Requests page
2. Clicks on request → Detail panel opens
3. Adds remarks (optional for approve, required for reject)
4. Clicks "Approve" or "Reject" → Mutation fires
5. Toast notification → Success message
6. List refreshes → Request status updated

Status: ✅ FUNCTIONAL
```

### 6.3 SuperAdmin - Request Management Flow

```
Current Flow (WORKS):
1. User views Requests page
2. Filters by status/category
3. Clicks on request → Detail panel opens
4. Adds remarks (optional for approve, required for reject)
5. Clicks "Approve" or "Reject" → Mutation fires with rate limiting
6. Audit log entry created
7. Toast notification → Success message

Status: ✅ FUNCTIONAL
```

### 6.4 SuperAdmin - Add Team Member Flow

```
Current Flow (BROKEN):
1. User clicks "Add Team Member" → Modal opens
2. User enters email and selects role
3. Clicks "Add Member" → Toast: "must have existing user account"
4. User confused → Can't actually add anyone

Expected Flow:
1. User clicks "Add Team Member" → Modal opens
2. User searches for existing user by email
3. If user exists → Select and assign role
4. If user doesn't exist → Option to invite
5. User confirms → Team member created with audit log
```

### 6.5 SuperAdmin - Client Management Flow

```
Current Flow (BROKEN):
1. User views Clients page → List loads correctly
2. Clicks dropdown menu → Options appear
3. Clicks "View Details" → NOTHING HAPPENS
4. Clicks "Edit" → NOTHING HAPPENS
5. Clicks "Deactivate" → NOTHING HAPPENS

Expected Flow:
1. User views Clients page → List loads
2. View Details → Navigate to client detail page
3. Edit → Open edit modal/page
4. Deactivate → Confirmation dialog → Status updated
```

---

## 7. Detailed Fix Plan

### Phase 1: Critical UI Wiring (Estimated: 3-5 days)

#### 1.1 Employer Dashboard Actions

**File: `src/app/employer/dashboard/page.tsx`**

```typescript
// Fix: Add handlers for "Pay now" buttons
const { mutate: payInvoice, isPending: isPaying } = usePayInvoice()

const handlePayInvoice = (invoiceId: string) => {
  // Option A: Open payment modal
  setSelectedInvoiceId(invoiceId)
  setIsPaymentModalOpen(true)

  // Option B: Direct payment with confirmation
  if (confirm('Mark this invoice as paid?')) {
    payInvoice({ invoiceId, paymentReference: `PAY-${Date.now()}` })
  }
}

// In JSX:
<Button
  variant="outline"
  className="text-xs h-7 px-3"
  onClick={() => handlePayInvoice(invoice.id)}
  disabled={isPaying}
>
  Pay now
</Button>
```

**Fix: Add handlers for "Approve" buttons on requests**
```typescript
const { mutate: approveLeave } = useApproveLeave()
const { user } = useAuth()

const handleApproveRequest = (request: LeaveRequest) => {
  approveLeave({
    requestId: request.id,
    approverId: user!.id
  })
}

// In JSX:
<Button onClick={() => handleApproveRequest(request)}>
  Approve
</Button>
```

#### 1.2 Employer Invoices Page Actions

**File: `src/app/employer/invoices/page.tsx`**

```typescript
// Add navigation to detail page
const router = useRouter()

const handleViewInvoice = (invoiceId: string) => {
  router.push(`/employer/invoices/${invoiceId}`)
}

// Add download handler
const handleDownloadInvoice = async (invoiceId: string) => {
  const pdfUrl = await invoicesService.getInvoicePdf(invoiceId)
  window.open(pdfUrl, '_blank')
}

// Create Invoice - either modal or navigation
const handleCreateInvoice = () => {
  // Option A: Navigate to create page
  router.push('/employer/invoices/create')

  // Option B: Open create modal
  setIsCreateModalOpen(true)
}
```

#### 1.3 Employer Payroll Actions

**File: `src/app/employer/payroll/dashboard/page.tsx`**

```typescript
// Add Run Payroll handler
const handleRunPayroll = () => {
  // Navigate to payroll run page
  router.push('/employer/payroll/run')

  // OR show modal with payroll options
  setIsRunPayrollModalOpen(true)
}

const handleProcessPayroll = () => {
  // Process current month's payroll
  if (confirm('Process payroll for the current month?')) {
    // Call payroll processing service
  }
}
```

#### 1.4 SuperAdmin Clients Page Actions

**File: `src/app/super-admin/clients/page.tsx`**

```typescript
const router = useRouter()
const [selectedClient, setSelectedClient] = useState<Company | null>(null)
const [isEditModalOpen, setIsEditModalOpen] = useState(false)

const handleViewClient = (clientId: string) => {
  router.push(`/super-admin/clients/${clientId}`)
}

const handleEditClient = (client: Company) => {
  setSelectedClient(client)
  setIsEditModalOpen(true)
}

const handleDeactivateClient = async (clientId: string) => {
  if (!confirm('Are you sure you want to deactivate this client?')) return

  try {
    await superadminDashboardService.updateCompanyStatus(clientId, false)
    toast.success('Client deactivated')
    refetch()
  } catch (error) {
    toast.error('Failed to deactivate client')
  }
}

// Wire up dropdown items:
<DropdownMenuItem onClick={() => handleViewClient(client.id)}>
  <Eye className="h-4 w-4 mr-2" />
  View Details
</DropdownMenuItem>
```

#### 1.5 SuperAdmin Team Members Page Actions

**Similar pattern to Clients page**

### Phase 2: Backend Data Fixes (Estimated: 2-3 days)

#### 2.1 Replace Mock Dashboard Data

**File: `src/lib/services/superadmin-dashboard.service.ts`**

```typescript
// Replace getRevenueOverview() with actual data query
async getRevenueOverview(): Promise<{ month: string; amount: number }[]> {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Query actual invoice/payment data
  const { data: payments, error } = await this.supabase
    .from('contractor_invoice')
    .select('amount, paid_at')
    .eq('status', 'paid')
    .gte('paid_at', sixMonthsAgo.toISOString())
    .order('paid_at', { ascending: true })

  if (error) this.handleError(error)

  // Group by month
  const monthlyRevenue = this.groupByMonth(payments || [])
  return monthlyRevenue
}
```

#### 2.2 Fix Cost Calculation Consistency

**Standardize on `ctc` or `gross_salary` throughout:**

```typescript
// In all services, use ctc consistently
.select('ctc, start_date')  // Use ctc everywhere
```

#### 2.3 Create Missing Database Tables

**SQL migrations needed:**

```sql
-- superadmin_audit_log table
CREATE TABLE IF NOT EXISTS superadmin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  actor_id UUID REFERENCES users_user(id),
  actor_email VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- superadmin_team table
CREATE TABLE IF NOT EXISTS superadmin_team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users_user(id) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- superadmin_team_client table (many-to-many)
CREATE TABLE IF NOT EXISTS superadmin_team_client (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_member_id UUID REFERENCES superadmin_team(id) ON DELETE CASCADE,
  company_id UUID REFERENCES company_company(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_member_id, company_id)
);

-- holiday_holiday table
CREATE TABLE IF NOT EXISTS holiday_holiday (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  company_id UUID REFERENCES company_company(id),
  is_national BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Phase 3: Settings & Profile Persistence (Estimated: 2-3 days)

#### 3.1 SuperAdmin Settings Persistence

**Create settings service:**

```typescript
// src/lib/services/settings.service.ts
class SettingsServiceClass extends BaseService {
  async getSettings(): Promise<SystemSettings> {
    const { data, error } = await this.supabase
      .from('system_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') this.handleError(error)
    return data || DEFAULT_SETTINGS
  }

  async updateSettings(settings: Partial<SystemSettings>): Promise<void> {
    const { error } = await this.supabase
      .from('system_settings')
      .upsert({
        id: 'main',
        ...settings,
        updated_at: new Date().toISOString()
      })

    if (error) this.handleError(error)
  }
}
```

#### 3.2 Profile Updates

**Create profile service with actual persistence:**

```typescript
// src/lib/services/profile.service.ts
async updateProfile(userId: string, data: ProfileUpdateData): Promise<void> {
  const { error } = await this.supabase
    .from('users_user')
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) this.handleError(error)
}

async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
  // Use Supabase auth
  const { error } = await this.supabase.auth.updateUser({
    password: newPassword
  })

  if (error) throw error
}
```

### Phase 4: Error Handling & UX (Estimated: 2 days)

#### 4.1 Add Error States to All Pages

**Create reusable error component:**

```typescript
// src/components/error-state.tsx
interface ErrorStateProps {
  error: Error | null
  onRetry?: () => void
  message?: string
}

export function ErrorState({ error, onRetry, message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        {message || error?.message || 'An unexpected error occurred'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}
```

**Add to all pages:**
```typescript
if (error) {
  return <ErrorState error={error} onRetry={refetch} />
}
```

#### 4.2 Fix Chart Empty States

**Replace fallback values with proper empty state:**

```typescript
// Instead of:
{ name: 'Employees', value: activeEmployees || 1 }

// Use:
const hasData = activeEmployees > 0 || activeContractors > 0

{hasData ? (
  <PieChart data={dynamicTeamData} />
) : (
  <EmptyState message="No team members yet" />
)}
```

### Phase 5: Add New Team Member Flow (Estimated: 1-2 days)

#### 5.1 Fix Access Control Add User

```typescript
// In access-control/page.tsx handleSubmit:

const handleSubmit = async () => {
  if (!editingMember) {
    // Creating new member
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Step 1: Find user by email
    const { data: user, error } = await supabase
      .from('users_user')
      .select('id, email, first_name, last_name')
      .eq('email', formData.email.toLowerCase())
      .single()

    if (error || !user) {
      toast.error('User not found. They must have an account first.')
      return
    }

    // Step 2: Create team member
    await createMember.mutateAsync({
      userId: user.id,
      role: formData.role
    })

    toast.success('Team member added successfully')
  } else {
    // Updating existing
    await updateMember.mutateAsync({
      id: editingMember.id,
      data: { role: formData.role }
    })
    toast.success('Team member updated')
  }

  setIsModalOpen(false)
  refetch()
}
```

---

## 8. Database Requirements

### 8.1 Required Tables

| Table | Purpose | Status |
|-------|---------|--------|
| company_company | Companies/Clients | Exists |
| employee_employee | Employee profiles | Exists |
| employee_employeecontract | Employment contracts | Exists |
| contractor_contractor | Contractor profiles | Exists |
| contractor_contractorcontract | Contractor contracts | Exists |
| contractor_invoice | Contractor invoices | Exists |
| leave_leaverequest | Leave requests | Exists |
| leave_leavebalance | Leave balances | Exists |
| request_request | General requests | Exists |
| users_user | User accounts | Exists |
| company_employer | Company-user relationship | Exists |
| superadmin_audit_log | Audit trail | **MAY NOT EXIST** |
| superadmin_team | SuperAdmin team | **MAY NOT EXIST** |
| superadmin_team_client | Team-Client assignments | **MAY NOT EXIST** |
| holiday_holiday | Company holidays | **MAY NOT EXIST** |
| system_settings | System configuration | **MAY NOT EXIST** |

### 8.2 Demo Data Seeding

**Demo user UUIDs in auth-context.tsx must match database:**

```typescript
// These UUIDs must exist in your Supabase database:
companyId: '22222222-2222-2222-2222-222222222222'  // company_company
employeeId: 'a0000001-0001-0001-0001-000000000001'  // employee_employee
contractorId: 'c0000001-0001-0001-0001-000000000001'  // contractor_contractor
```

---

## 9. Implementation Roadmap

### Week 1: Critical UI Fixes

| Day | Task | Files |
|-----|------|-------|
| 1-2 | Wire up Employer Dashboard buttons | employer/dashboard/page.tsx |
| 2-3 | Wire up Invoice page actions | employer/invoices/page.tsx |
| 3-4 | Wire up Payroll page actions | employer/payroll/dashboard/page.tsx |
| 4-5 | Wire up SuperAdmin Client/Team actions | super-admin/clients/page.tsx, team-members/page.tsx |

### Week 2: Backend & Data Fixes

| Day | Task | Files |
|-----|------|-------|
| 1 | Create missing database tables | SQL migrations |
| 2 | Seed demo data | Supabase seed script |
| 3 | Replace mock dashboard data | superadmin-dashboard.service.ts |
| 4 | Fix cost calculation consistency | invoices.service.ts, dashboard.service.ts |
| 5 | Verify all queries work with real data | Testing |

### Week 3: Settings & Polish

| Day | Task | Files |
|-----|------|-------|
| 1-2 | Implement settings persistence | settings.service.ts, settings/page.tsx |
| 2-3 | Implement profile persistence | profile.service.ts, profile/page.tsx |
| 3-4 | Add error states to all pages | All page.tsx files |
| 4-5 | Fix chart empty states | employer/dashboard/page.tsx |

### Post-Implementation Testing

- [ ] Test all employer dashboard actions
- [ ] Test all superadmin dashboard actions
- [ ] Verify data persistence across page refreshes
- [ ] Test with empty database (proper empty states)
- [ ] Test with demo data (proper data display)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check

---

## Appendix A: Quick Reference - Non-Functional Buttons

### Employer Dashboard
- [ ] `employer/dashboard` - "Pay now" buttons (all pending invoices)
- [ ] `employer/dashboard` - "Approve" buttons (all requests)
- [ ] `employer/dashboard` - "View all requests" button
- [ ] `employer/invoices` - "Create Invoice" button
- [ ] `employer/invoices` - Row "View" action
- [ ] `employer/invoices` - Row "Download" action
- [ ] `employer/payroll/dashboard` - "Run Payroll" button
- [ ] `employer/payroll/dashboard` - "Process Now" button
- [ ] `employer/employees/[id]` - All action buttons

### SuperAdmin Dashboard
- [ ] `super-admin/dashboard` - "View" button on clients chart
- [ ] `super-admin/clients` - "Add New Client" button
- [ ] `super-admin/clients` - "View Details" dropdown item
- [ ] `super-admin/clients` - "Edit" dropdown item
- [ ] `super-admin/clients` - "Deactivate" dropdown item
- [ ] `super-admin/team-members` - All dropdown actions
- [ ] `super-admin/invoices` - "Generate Now" button
- [ ] `super-admin/invoices` - "View Details" action
- [ ] `super-admin/invoices` - "Download PDF" action
- [ ] `super-admin/invoices` - "Send Reminder" action
- [ ] `super-admin/invoices` - "Mark as Paid" action
- [ ] `super-admin/payroll` - "Run Payroll" button
- [ ] `super-admin/audit-logs` - "Export" button
- [ ] `super-admin/settings` - All "Configure" buttons (Integrations)
- [ ] `super-admin/profile` - Save Profile (simulated)
- [ ] `super-admin/profile` - Change Password (simulated)
- [ ] `super-admin/settings` - All Save buttons (simulated)

---

**Document End**
