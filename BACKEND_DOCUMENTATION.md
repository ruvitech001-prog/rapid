# Aether Backend Documentation

## Overview

Aether is an HR management platform with a layered architecture:
- **Services Layer** - Direct Supabase database interactions
- **Hooks Layer** - React Query wrappers for state management
- **Auth Layer** - Demo-based authentication system

---

## Quick Start

### Demo Accounts

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Employer** | demo@rapidone.com | any value | `/employer/dashboard` |
| **Employee** | aarav@rapidone.com | any value | `/employee/dashboard` |
| **Contractor** | amit@rapidone.com | any value | `/contractor/dashboard` |
| **Super Admin** | admin@rapidone.com | any value | `/super-admin/dashboard` |

### Login Flow
1. Go to `http://localhost:3000/auth/login`
2. Use demo credentials or click quick login buttons
3. If already logged in, click "Switch Account" to logout first

---

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Login, signup, forgot-password
│   ├── employer/          # Employer dashboard and features
│   ├── employee/          # Employee dashboard and features
│   ├── contractor/        # Contractor dashboard and features
│   └── super-admin/       # SuperAdmin dashboard and features
├── lib/
│   ├── auth/              # Authentication context
│   ├── services/          # Supabase service layer (24 services)
│   ├── hooks/             # React Query hooks (24 hook files)
│   └── queries/           # Query key management
└── components/            # Shared UI components
```

---

## Services Reference

### Core Services

#### 1. Employees Service (`employees.service.ts`)
Manages employee profiles and relationships.

```typescript
// Get all employees for a company
const employees = await employeesService.getByCompany(companyId)

// Get single employee with contract
const employee = await employeesService.getById(employeeId)

// Get active count
const count = await employeesService.getCount(companyId)
```

**Tables:** `employee_employee`, `employee_employeecontract`, `users_user`

---

#### 2. Contractors Service (`contractors.service.ts`)
Manages contractor profiles and relationships.

```typescript
// Get all contractors for a company
const contractors = await contractorsService.getByCompany(companyId)

// Get single contractor with contract
const contractor = await contractorsService.getById(contractorId)
```

**Tables:** `contractor_contractor`, `contractor_contractorcontract`, `users_user`

---

#### 3. Leaves Service (`leaves.service.ts`)
Manages leave requests and balances with optimistic locking.

```typescript
// Get leave requests with filters
const requests = await leavesService.getRequests(companyId, {
  status: 'pending',
  leaveType: 'annual'
})

// Approve a request (auto-deducts balance)
await leavesService.approve(requestId, approverId)

// Reject with reason
await leavesService.reject(requestId, approverId, 'Insufficient coverage')

// Get employee balances
const balances = await leavesService.getBalances(employeeId)

// Create new request (reserves balance)
await leavesService.createLeaveRequest({
  employeeId,
  leaveType: 'annual',
  startDate: '2024-01-15',
  endDate: '2024-01-17',
  reason: 'Family vacation'
})
```

**Tables:** `leave_leaverequest`, `leave_leavebalance`, `employee_employeecontract`

**Special Features:**
- Optimistic locking on balance updates
- Automatic balance deduction on approval
- Balance reservation on request creation

---

#### 4. Expenses Service (`expenses.service.ts`)
Manages expense claims and approvals.

```typescript
// Get expense requests
const expenses = await expensesService.getRequests(companyId, { status: 'pending' })

// Approve/reject
await expensesService.approve(requestId, approverId)
await expensesService.reject(requestId, approverId, 'Missing receipt')

// Employee: create expense claim
await expensesService.createExpenseClaim({
  employeeId,
  category: 'travel',
  amount: 5000,
  merchant: 'Airlines Inc',
  expenseDate: '2024-01-10',
  description: 'Client visit travel'
})
```

**Tables:** `expense_expenseclaim`, `employee_employeecontract`, `employee_employee`

---

#### 5. Invoices Service (`invoices.service.ts`)
Manages contractor invoices and payments.

```typescript
// Employer: Get company invoices
const invoices = await invoicesService.getCompanyInvoices(companyId, { status: 'pending' })

// Employer: Pay/approve/reject
await invoicesService.payInvoice(invoiceId, 'PAY-REF-123')
await invoicesService.approveInvoice(invoiceId)
await invoicesService.rejectInvoice(invoiceId, 'Incorrect hours')

// Contractor: Create invoice
await invoicesService.createInvoice({
  contractorId,
  contractId,
  amount: 50000,
  invoiceDate: '2024-01-31',
  dueDate: '2024-02-15',
  description: 'January services'
})

// Analytics
const summary = await invoicesService.getInvoiceSummary(companyId)
const costs = await invoicesService.getCostOverview(companyId, 6)
```

**Tables:** `contractor_invoice`, `contractor_contractorcontract`, `contractor_contractor`

---

#### 6. Timesheets Service (`timesheets.service.ts`)
Manages contractor weekly timesheets.

```typescript
// Contractor: Get own timesheets
const timesheets = await timesheetsService.getContractorTimesheets(contractorId)

// Contractor: Save and submit
await timesheetsService.saveTimesheet({ contractId, weekStartDate, hours: 40 })
await timesheetsService.submitTimesheet(timesheetId)

// Employer: Approve/reject
await timesheetsService.approveTimesheet(timesheetId, approverId)
await timesheetsService.rejectTimesheet(timesheetId)
```

**Workflow:** `draft` → `submitted` → `approved` | `rejected`

**Tables:** `contractor_timesheet`, `contractor_contractorcontract`

---

#### 7. Payroll Service (`payroll.service.ts`)
Handles payroll calculations and payslips.

```typescript
// Employee: Get payroll history
const history = await payrollService.getEmployeePayrollHistory(employeeId, 12)

// Employee: Get current payslip
const payslip = await payrollService.getCurrentPayslip(employeeId)

// Employer: Get company payroll summary
const summary = await payrollService.getCompanyPayrollSummary(companyId, 6)

// Employer: Total payroll cost
const total = await payrollService.getTotalPayrollCost(companyId)
```

**Tax Calculation:** Uses simplified old regime slabs (0%, 5%, 20%, 30%)

**Tables:** `employee_employeecontract`, `employee_employee`

---

#### 8. Tax Service (`tax.service.ts`)
Handles tax declarations and Form 16.

```typescript
// Get/save investment declaration
const declaration = await taxService.getDeclaration(employeeId, '2024-25')
await taxService.saveDeclaration(employeeId, {
  section80c: 150000,
  section80d: 25000,
  hra: 200000
})
await taxService.submitDeclaration(declarationId)

// Get Form 16
const form16 = await taxService.getForm16(employeeId, '2023-24')

// Tax summary
const summary = await taxService.getTaxSummary(employeeId)
```

**Supported Sections:** 80C, 80D, 80E, 80G, 24B, Standard Deduction, HRA Exemption

**Tables:** `employee_investmentdeclaration`, `employee_employeecontract`

---

#### 9. Profile Service (`profile.service.ts`)
Manages complete user profiles.

```typescript
// Get full profile
const profile = await profileService.getEmployeeProfile(employeeId)
// Returns: employee info + contract + addresses + bank accounts + emergency contacts

// Update info
await profileService.updateEmployeeInfo(employeeId, { phone: '9876543210' })

// Manage addresses
await profileService.saveAddress({ employeeId, type: 'current', ... })

// Manage bank accounts
await profileService.addBankAccount({ employeeId, accountNumber, ... })
await profileService.updateBankAccount(accountId, { isPrimary: true })

// Manage emergency contacts
await profileService.addEmergencyContact({ employeeId, name, phone, relation })
await profileService.deleteEmergencyContact(contactId)
```

**Tables:** `employee_employee`, `commons_address`, `commons_bankaccount`, `commons_emergencycontact`

---

#### 10. Dashboard Service (`dashboard.service.ts`)
Aggregates data for dashboards.

```typescript
// Employer dashboard
const stats = await dashboardService.getEmployerStats(companyId)
// Returns: employeeCount, contractorCount, pendingLeaves, pendingExpenses,
//          upcomingPayroll, recentActivity, upcomingHolidays

// Employee dashboard
const stats = await dashboardService.getEmployeeStats(employeeId)
// Returns: leaveBalances, pendingRequests, upcomingHolidays, recentPayslips
```

---

### SuperAdmin Services

#### 11. SuperAdmin Dashboard (`superadmin-dashboard.service.ts`)
Platform-wide statistics and management.

```typescript
// Get dashboard stats
const stats = await superadminDashboardService.getStats()
// Returns: totalClients, pendingRequests, clientsByCountry,
//          revenueOverview, invoiceOverview, upcomingHolidays

// Get all companies
const companies = await superadminDashboardService.getCompanies()

// Get workforce across all companies
const workforce = await superadminDashboardService.getWorkforce(filters)
```

---

#### 12. SuperAdmin Requests (`superadmin-requests.service.ts`)
Platform-wide request management.

```typescript
// Get requests with filters
const requests = await superadminRequestsService.getRequests({
  status: 'pending',
  category: 'employee',
  requestType: 'leave'
})

// Get counts by status
const counts = await superadminRequestsService.getCounts()

// Process requests
await superadminRequestsService.approve(requestId, 'Approved per policy')
await superadminRequestsService.reject(requestId, 'Budget constraints')
await superadminRequestsService.assignTo(requestId, teamMemberId)
```

**Request Categories:**
- **Employee:** leave, expense, payroll_query, employment_letter, travel_letter, resignation
- **Employer:** termination, send_gifts
- **Special:** equipment_purchase, equipment_collect

---

#### 13. SuperAdmin Team (`superadmin-team.service.ts`)
Team member management with RBAC.

```typescript
// Get team members
const team = await superadminTeamService.getTeamMembers({ role: 'manager' })

// CRUD operations
await superadminTeamService.createTeamMember({ userId, role: 'manager', clientIds })
await superadminTeamService.updateTeamMember(id, { role: 'super_admin' })
await superadminTeamService.deleteTeamMember(id)

// Assign clients
await superadminTeamService.assignClients(teamMemberId, ['client-1', 'client-2'])
```

**Roles:** `super_admin`, `admin`, `manager`, `support`

**Safety:** Cannot delete the last super_admin

---

#### 14. SuperAdmin Audit (`superadmin-audit.service.ts`)
Audit logging for compliance.

```typescript
// Log an action
await superadminAuditService.log({
  userId: 'user-123',
  userEmail: 'admin@example.com',
  userRole: 'super_admin',
  action: 'request.approved',
  entityType: 'request',
  entityId: 'req-456',
  newData: { status: 'approved' }
})

// Get audit logs
const logs = await superadminAuditService.getLogs({
  action: 'request.approved',
  startDate: '2024-01-01',
  page: 1,
  limit: 50
})

// Get entity history
const history = await superadminAuditService.getEntityHistory('request', 'req-456')
```

**Tracked Actions:**
- `request.approved`, `request.rejected`, `request.assigned`
- `team.member_created`, `team.member_updated`, `team.member_deleted`
- `team.role_changed`, `team.clients_assigned`
- `company.viewed`, `settings.updated`

---

## React Hooks Reference

All hooks use React Query for caching and state management.

### Query Hooks (Read Operations)

```typescript
// Employees
const { data, isLoading } = useEmployees(companyId)
const { data } = useEmployee(employeeId)

// Leaves
const { data } = useLeaveRequests(companyId, { status: 'pending' })
const { data } = useLeaveBalances(employeeId)
const { data } = usePendingLeaveCount(companyId)

// Expenses
const { data } = useExpenseRequests(companyId, filters)
const { data } = useEmployeeExpenses(employeeId)

// Invoices
const { data } = useCompanyInvoices(companyId, filters)
const { data } = useContractorInvoices(contractorId)
const { data } = useInvoiceSummary(companyId)

// Dashboard
const { data } = useEmployerDashboard(companyId)
const { data } = useEmployeeDashboard(employeeId)

// SuperAdmin
const { data } = useSuperAdminDashboard()
const { data } = useSuperAdminRequests(filters)
const { data } = useSuperAdminTeam(filters)
```

### Mutation Hooks (Write Operations)

```typescript
// Leaves
const approveLeave = useApproveLeave()
await approveLeave.mutateAsync({ requestId, approverId })

const rejectLeave = useRejectLeave()
await rejectLeave.mutateAsync({ requestId, approverId, reason })

const createLeave = useCreateLeaveRequest()
await createLeave.mutateAsync({ employeeId, leaveType, startDate, endDate, reason })

// Expenses
const approveExpense = useApproveExpense()
const rejectExpense = useRejectExpense()
const createExpense = useCreateExpenseClaim()

// Invoices
const payInvoice = usePayInvoice()
const approveInvoice = useApproveInvoice()
const createInvoice = useCreateInvoice()

// SuperAdmin
const approveRequest = useApproveRequest()
const rejectRequest = useRejectRequest()
const createTeamMember = useCreateTeamMember()
```

### Auto-Refresh Intervals

| Hook | Interval |
|------|----------|
| `useSuperAdminRequests` | 30 seconds |
| `useSuperAdminDashboard` | 60 seconds |
| `useEmployeeNotifications` | 60 seconds |
| `useEmployerNotifications` | 60 seconds |
| `useUnreadNotificationCount` | 30 seconds |

---

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `users_user` | User authentication |
| `company_company` | Company records |
| `employee_employee` | Employee base info |
| `employee_employeecontract` | Employee contracts |
| `contractor_contractor` | Contractor base info |
| `contractor_contractorcontract` | Contractor contracts |

### HR Tables

| Table | Purpose |
|-------|---------|
| `leave_leaverequest` | Leave applications |
| `leave_leavebalance` | Leave balance tracking |
| `expense_expenseclaim` | Expense claims |
| `contractor_invoice` | Contractor invoices |
| `contractor_timesheet` | Weekly timesheets |
| `holiday_holiday` | Company holidays |

### Profile Tables

| Table | Purpose |
|-------|---------|
| `commons_address` | Addresses |
| `commons_bankaccount` | Bank accounts |
| `commons_emergencycontact` | Emergency contacts |
| `commons_document` | Documents |

### Admin Tables

| Table | Purpose |
|-------|---------|
| `superadmin_team` | Team members |
| `superadmin_team_client` | Client assignments |
| `superadmin_audit_log` | Audit trail |
| `request_request` | Platform requests |

---

## Integration Patterns

### 1. Rate Limiting (SuperAdmin)
All mutation hooks in SuperAdmin have 2-second rate limiting:

```typescript
const lastCallRef = useRef<number>(0)

// In mutationFn:
const now = Date.now()
if (now - lastCallRef.current < 2000) {
  throw new Error('Please wait before trying again')
}
lastCallRef.current = now
```

### 2. Audit Logging (SuperAdmin)
Every mutation automatically logs to audit:

```typescript
// After successful operation:
await superadminAuditService.log({
  userId: user.id,
  userEmail: user.email,
  userRole: user.role,
  action: 'request.approved',
  entityType: 'request',
  entityId: requestId,
  newData: { status: 'approved' }
})
```

### 3. Cache Invalidation
Mutations invalidate related queries:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['leaves'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
}
```

### 4. Optimistic Locking (Leaves)
Balance updates use version checking:

```typescript
// Check current balance before update
const currentBalance = await getBalance(employeeId, leaveType)
// Update with condition
await supabase
  .update({ used_days: newUsed })
  .eq('id', balanceId)
  .eq('used_days', currentBalance.used_days) // Optimistic lock
```

---

## Testing the Application

### 1. Start Development Server
```bash
pnpm dev
# Server runs on http://localhost:3000
```

### 2. Test Login Flow
1. Go to `/auth/login`
2. Click "Login as Admin" for SuperAdmin access
3. Or use specific demo credentials

### 3. Test SuperAdmin Features
- **Dashboard:** `/super-admin/dashboard` - View platform stats
- **Requests:** `/super-admin/requests` - Approve/reject requests
- **Access Control:** `/super-admin/access-control` - Manage team
- **Audit Logs:** `/super-admin/audit-logs` - View audit trail
- **Clients:** `/super-admin/clients` - View all companies

### 4. Test Employer Features
- **Dashboard:** `/employer/dashboard` - View company stats
- **Employees:** `/employer/employees` - Manage employees
- **Leaves:** `/employer/leave/requests` - Process leave requests
- **Invoices:** `/employer/invoices` - Manage contractor invoices

### 5. Test Employee Features
- **Dashboard:** `/employee/dashboard` - View personal stats
- **Leave:** `/employee/leave/apply` - Apply for leave
- **Expenses:** `/employee/expenses/submit` - Submit expenses
- **Profile:** `/employee/profile` - Update profile

---

## Troubleshooting

### Issue: Auto-redirecting on login
**Solution:** Click "Switch Account" button to logout first, then login with different credentials.

### Issue: Stale data
**Solution:** React Query caches data. Wait for auto-refresh or manually refresh the page.

### Issue: Rate limit error
**Solution:** Wait 2 seconds between actions (SuperAdmin mutations have rate limiting).

### Issue: Permission denied
**Solution:** Ensure you're logged in with the correct role for the feature you're accessing.

---

## Authentication Usage Patterns

### Using the Auth Context Correctly

The `useAuth()` hook provides a `user` object - **NOT** individual IDs directly.

```typescript
// ❌ WRONG - These properties don't exist on AuthContextType
const { employeeId } = useAuth()
const { contractorId } = useAuth()
const { companyId } = useAuth()

// ✅ CORRECT - Access via user object
const { user } = useAuth()
const employeeId = user?.id
const contractorId = user?.id
const companyId = user?.companyId
```

### Handling Null vs Undefined

Services often expect `undefined` for optional params, but auth returns `null`:

```typescript
// ❌ WRONG - companyId is string | null, but service expects string | undefined
const companyId = user?.companyId
await employeesService.getByCompany(companyId) // Type error!

// ✅ CORRECT - Convert null to undefined
const companyId = user?.companyId ?? undefined
```

### Demo Users Reference

```typescript
import { DEMO_USERS } from '@/lib/auth/auth-context'

// Available demo users:
DEMO_USERS.employer   // { id, email, role: 'employer', companyId }
DEMO_USERS.employee   // { id, email, role: 'employee', companyId, employeeCode }
DEMO_USERS.contractor // { id, email, role: 'contractor', companyId, contractorCode }
DEMO_USERS.superadmin // { id, email, role: 'superadmin', companyId: null }
```

### Role-Based Dashboard Routing

```typescript
const redirectMap: Record<UserRole, string> = {
  employer: '/employer/dashboard',
  employee: '/employee/dashboard',
  contractor: '/contractor/dashboard',
  superadmin: '/super-admin/dashboard',
}
```

---

## Type Safety Patterns

### Type Predicates for Filtering

When filtering arrays that may contain null values:

```typescript
// ❌ WRONG - .filter(Boolean) doesn't narrow the type
const ids = data?.map(c => c.contractor_id).filter(Boolean) || []
// Type: (string | null)[]

// ✅ CORRECT - Use type predicate
const ids = data?.map(c => c.contractor_id).filter((id): id is string => !!id) || []
// Type: string[]
```

### Service Types vs Database Types

Services return **camelCase** interfaces, but the database uses **snake_case**:

```typescript
// Database column names (Supabase)
const { data } = await supabase
  .from('employee_employee')
  .select('full_name, employee_code, date_of_birth')

// Service interface (TypeScript)
interface Employee {
  fullName: string
  employeeCode: string
  dateOfBirth: string
}
```

### PayslipData Type Structure

The `PayslipData` interface has **individual fields**, not arrays:

```typescript
// ❌ WRONG - These don't exist
payslip.earnings  // Array doesn't exist
payslip.deductions // Array doesn't exist
payslip.monthYear  // Doesn't exist

// ✅ CORRECT - Individual fields
payslip.basicSalary
payslip.hra
payslip.lta
payslip.medicalAllowance
payslip.specialAllowance
payslip.month  // Separate fields
payslip.year

// Build arrays when needed for display
const earnings = [
  { name: 'Basic Salary', amount: payslip.basicSalary },
  { name: 'HRA', amount: payslip.hra },
  { name: 'LTA', amount: payslip.lta },
].filter(e => e.amount > 0)
```

### Form16Data Type Structure

```typescript
// Access nested allowances
form16Data?.allowances.hra  // Not form16Data?.hra
form16Data?.employerTan     // Not form16Data?.employerTAN (case sensitive!)
```

### EmployeePayrollHistory Fields

```typescript
// ❌ WRONG
payrollHistory.totalDeductions
payrollHistory.grossSalary

// ✅ CORRECT
payrollHistory.deductions
payrollHistory.grossPay
```

### Notification Fields

```typescript
// ❌ WRONG
notification.read
notification.timestamp

// ✅ CORRECT
notification.isRead
notification.createdAt
```

---

## Contractor Features

### Contractor Dashboard

The contractor portal provides:
- **Dashboard Stats:** Total earnings, pending invoices, active contracts
- **Timesheets:** Weekly hour logging and submission
- **Invoices:** Create, view, and track payment status
- **Contracts:** View active and past contracts
- **Profile:** Update personal and banking information

### Contractor Hooks

```typescript
// Get contractor's own contracts
const { data: contracts } = useContractorOwnContracts(contractorId)

// Get contractor timesheets
const { data: timesheets } = useContractorTimesheets(contractorId)

// Get contractor invoices
const { data: invoices } = useContractorInvoices(contractorId)

// Create timesheet
const saveTimesheet = useSaveTimesheet()
await saveTimesheet.mutateAsync({
  contractorId,
  contractId,
  weekStartDate: '2024-01-01',
  weekEndDate: '2024-01-07',
  mondayHours: 8,
  tuesdayHours: 8,
  // ... other days
})
```

---

## Employer Features

### Employee Management

```typescript
// List employees with search and filtering
const { data: employees } = useEmployees(companyId)

// Get single employee details
const { data: employee } = useEmployee(employeeId)

// Employee counts
const { data: count } = useEmployeeCount(companyId)
```

### Contractor Management

```typescript
// List company contractors
const { data: contractors } = useContractors(companyId)

// Approve/reject timesheets
const approveTimesheet = useApproveTimesheet()
await approveTimesheet.mutateAsync({ timesheetId, approverId })
```

### Leave Management

```typescript
// View pending leave requests
const { data: requests } = useLeaveRequests(companyId, { status: 'pending' })

// Approve/reject
const approve = useApproveLeave()
const reject = useRejectLeave()
```

### Expense Management

```typescript
// View expense claims
const { data: expenses } = useExpenseRequests(companyId, filters)

// Process claims
const approve = useApproveExpense()
const reject = useRejectExpense()
```

---

## Employee Features

### Leave Application

```typescript
// Get leave balances
const { data: balances } = useLeaveBalances(employeeId)

// Apply for leave
const createLeave = useCreateLeaveRequest()
await createLeave.mutateAsync({
  employeeId,
  leaveType: 'annual',
  startDate: '2024-01-15',
  endDate: '2024-01-17',
  reason: 'Vacation'
})
```

### Expense Claims

```typescript
// Submit expense
const createExpense = useCreateExpenseClaim()
await createExpense.mutateAsync({
  employeeId,
  category: 'travel',
  amount: 5000,
  merchant: 'Airlines',
  expenseDate: '2024-01-10',
  description: 'Client visit'
})
```

### Payslips

```typescript
// Get payroll history
const { data: history } = usePayrollHistory(employeeId, 12)

// Get specific payslip
const { data: payslip } = usePayslip(employeeId, 'december-2024')
```

### Tax Management

```typescript
// Investment declaration
const { data: declaration } = useInvestmentDeclaration(employeeId, '2024-25')

// Save declaration
const save = useSaveDeclaration()
await save.mutateAsync({
  employeeId,
  section80c: 150000,
  section80d: 25000
})

// Form 16
const { data: form16 } = useForm16(employeeId, '2023-24')
```

---

## SuperAdmin Features

### Platform Dashboard

```typescript
// Platform-wide statistics
const { data: stats } = useSuperAdminDashboard()
// Returns: totalClients, pendingRequests, revenueOverview, etc.

// All companies
const { data: companies } = useSuperAdminCompanies()

// Platform workforce
const { data: workforce } = useSuperAdminWorkforce(filters)
```

### Request Management

```typescript
// Platform requests across all companies
const { data: requests } = useSuperAdminRequests({
  status: 'pending',
  category: 'employee',
  requestType: 'leave'
})

// Process requests
const approve = useApproveRequest()
const reject = useRejectRequest()
const assign = useAssignRequest()
```

### Payroll Overview

```typescript
// Platform payroll stats
const { data: stats } = useSuperAdminPayrollStats()
const { data: runs } = useSuperAdminPayrollRuns()
const { data: upcoming } = useSuperAdminUpcomingPayroll()
```

---

## Common Pitfalls & Solutions

### 1. UUID Format Errors

UUIDs must use valid hexadecimal characters (0-9, a-f):

```typescript
// ❌ WRONG - 's' is not valid hex
'sa000001-0001-0001-0001-000000000001'

// ✅ CORRECT - '5a' is valid hex
'5a000001-0001-0001-0001-000000000001'
```

### 2. Date Formatting

Use Indian locale for dates and currency:

```typescript
// Date formatting
new Date().toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

// Currency formatting
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(amount)
```

### 3. Array Access Safety

Always provide fallbacks for array operations:

```typescript
// ❌ Potentially undefined
lastDay.toISOString().split('T')[0]

// ✅ Safe with fallback
lastDay.toISOString().split('T')[0] || ''
```

### 4. Query Key Consistency

Use the query keys from `@/lib/queries/keys`:

```typescript
import { queryKeys } from '@/lib/queries/keys'

// Use consistent keys for cache invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all })
queryClient.invalidateQueries({ queryKey: queryKeys.employees.list(companyId) })
```

### 5. Enabled Conditions

Prevent queries from running without required params:

```typescript
// ❌ WRONG - Runs even without companyId
useQuery({
  queryKey: ['employees', companyId],
  queryFn: () => employeesService.getByCompany(companyId!)
})

// ✅ CORRECT - Only runs when companyId exists
useQuery({
  queryKey: ['employees', companyId],
  queryFn: () => employeesService.getByCompany(companyId!),
  enabled: !!companyId
})
```

---

## Version Information

- **Next.js:** 14.0.4
- **React Query:** @tanstack/react-query v5
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + shadcn/ui

---

*Last Updated: December 2024*
