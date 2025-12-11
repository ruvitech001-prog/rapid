# Aether Platform - Complete Testing Guide

## Table of Contents
1. [Setup & Running](#setup--running)
2. [Demo Credentials](#demo-credentials)
3. [SuperAdmin Testing](#superadmin-testing)
4. [Employer Testing](#employer-testing)
5. [Employee Testing](#employee-testing)
6. [Contractor Testing](#contractor-testing)
7. [Database Information](#database-information)
8. [API Reference](#api-reference)

---

## Setup & Running

### Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase project (configured in `.env.local`)

### Start Development Server
```bash
cd /Users/expr/Documents/2025/rapid/aether
pnpm install
pnpm dev
```

Server runs on: **http://localhost:3000**

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Demo Credentials

### All Demo Accounts

| Role | Email | Name | Password | Dashboard URL |
|------|-------|------|----------|---------------|
| **Super Admin** | `admin@rapidone.com` | Peter Admin | any value | `/super-admin/dashboard` |
| **Employer** | `demo@rapidone.com` | Demo Employer | any value | `/employer/dashboard` |
| **Employee** | `aarav@rapidone.com` | Aarav Sharma | any value | `/employee/dashboard` |
| **Contractor** | `amit@rapidone.com` | Amit Kapoor | any value | `/contractor/dashboard` |

### Quick Login
1. Go to `http://localhost:3000/auth/login`
2. Click one of the quick login buttons:
   - "Login as Employer"
   - "Login as Employee"
   - "Login as Contractor"
   - "Login as Admin"

### Switching Accounts
If already logged in:
1. Go to `http://localhost:3000/auth/login`
2. Click "Switch Account" button (amber colored)
3. Select new account to login

---

## SuperAdmin Testing

### Access SuperAdmin Dashboard
1. Login with: `admin@rapidone.com`
2. URL: `http://localhost:3000/super-admin/dashboard`

### Available Pages & Features

#### 1. Dashboard (`/super-admin/dashboard`)
**What to Test:**
- [ ] Greeting shows "Good morning Peter!"
- [ ] "Clients in countries" donut chart displays
- [ ] "Revenue overview" bar chart shows 6 months
- [ ] "Requests" section shows pending approvals
- [ ] "Updates" section shows recent activity
- [ ] "Invoice Overview" chart displays
- [ ] "Help & Support" cards are clickable
- [ ] "Upcoming holidays" shows future dates

**Data Displayed:**
- Total clients count
- Clients by country breakdown
- Revenue trends (mock data)
- Pending request count
- Recent platform updates

---

#### 2. Clients (`/super-admin/clients`)
**What to Test:**
- [ ] List of all companies displays
- [ ] Each company shows employee/contractor count
- [ ] Company details are clickable

**Backend Service:** `superadminDashboardService.getCompanies()`

---

#### 3. Access Control (`/super-admin/access-control`)
**What to Test:**
- [ ] Team members list displays
- [ ] Can filter by role (super_admin, admin, manager, support)
- [ ] Can create new team member
- [ ] Can edit team member role
- [ ] Can assign clients to team member
- [ ] Can delete team member (except last super_admin)
- [ ] Rate limiting works (2 second delay between actions)

**How to Test CRUD:**
1. Click "Add Team Member"
2. Select user and role
3. Assign clients
4. Click Save
5. Edit the created member
6. Try to delete

**Backend Service:** `superadminTeamService`

**Audit Logged Actions:**
- `team.member_created`
- `team.member_updated`
- `team.role_changed`
- `team.member_deleted`
- `team.clients_assigned`

---

#### 4. Audit Logs (`/super-admin/audit-logs`)
**What to Test:**
- [ ] Audit log entries display
- [ ] Can filter by action type
- [ ] Can filter by date range
- [ ] Can filter by user
- [ ] Pagination works
- [ ] Entity history shows changes over time

**Logged Actions:**
| Action | Description |
|--------|-------------|
| `request.approved` | Request was approved |
| `request.rejected` | Request was rejected |
| `request.assigned` | Request assigned to team member |
| `team.member_created` | New team member added |
| `team.member_updated` | Team member info updated |
| `team.member_deleted` | Team member removed |
| `team.role_changed` | Role was changed |
| `team.clients_assigned` | Clients assigned to member |

**Backend Service:** `superadminAuditService`

---

#### 5. Services (`/super-admin/services`)
**What to Test:**
- [ ] List of available services displays
- [ ] Service status indicators work

---

#### 6. Requests (`/super-admin/requests`)
**What to Test:**
- [ ] All pending requests display
- [ ] Can filter by status (pending, approved, rejected)
- [ ] Can filter by category (employee, employer, special)
- [ ] Can filter by request type (leave, expense, etc.)
- [ ] Can approve request with remarks
- [ ] Can reject request with reason (required)
- [ ] Can assign request to team member
- [ ] Real-time updates (30 second polling)

**Request Categories:**
| Category | Types |
|----------|-------|
| Employee | leave, expense, payroll_query, employment_letter, travel_letter, resignation |
| Employer | termination, send_gifts |
| Special | equipment_purchase, equipment_collect |

**How to Test Approval Flow:**
1. Find a pending request
2. Click "Approve" → Enter remarks (optional) → Confirm
3. Check audit logs for `request.approved` entry
4. Check request status changed to "approved"

**How to Test Rejection Flow:**
1. Find a pending request
2. Click "Reject" → Enter reason (required) → Confirm
3. Check audit logs for `request.rejected` entry

**Backend Service:** `superadminRequestsService`

---

#### 7. Invoices (`/super-admin/invoices`)
**What to Test:**
- [ ] Platform-wide invoice statistics
- [ ] Invoice trends over time

---

#### 8. Payroll (`/super-admin/payroll`)
**What to Test:**
- [ ] Payroll run management
- [ ] Upcoming payroll schedule
- [ ] Payroll analytics

---

#### 9. Company (`/super-admin/company`)
**What to Test:**
- [ ] Company settings display
- [ ] Can update company information

---

#### 10. Leaves (`/super-admin/leaves`)
**What to Test:**
- [ ] Platform-wide leave statistics
- [ ] Leave trends and analytics

---

#### 11. Profile (`/super-admin/profile`)
**What to Test:**
- [ ] Profile information displays
- [ ] Can update profile details

---

#### 12. Settings (`/super-admin/settings`)
**What to Test:**
- [ ] Settings options display
- [ ] Confirmation dialogs for destructive actions

---

## Employer Testing

### Access Employer Dashboard
1. Login with: `demo@rapidone.com`
2. URL: `http://localhost:3000/employer/dashboard`

### Available Pages & Features

#### 1. Dashboard (`/employer/dashboard`)
**What to Test:**
- [ ] Employee count displays
- [ ] Contractor count displays
- [ ] Pending leave requests count
- [ ] Pending expense claims count
- [ ] Upcoming payroll amount
- [ ] Recent activity feed
- [ ] Upcoming holidays list

**Backend Service:** `dashboardService.getEmployerStats()`

---

#### 2. Employees (`/employer/employees`)
**What to Test:**
- [ ] Employee list displays with photos
- [ ] Can search/filter employees
- [ ] Can view employee details
- [ ] Employee contract information shows

**Backend Service:** `employeesService.getByCompany()`

---

#### 3. Contractors (`/employer/contractors`)
**What to Test:**
- [ ] Contractor list displays
- [ ] Can view contractor details
- [ ] Contract information shows

**Backend Service:** `contractorsService.getByCompany()`

---

#### 4. Contracts (`/employer/contracts`)
**What to Test:**
- [ ] Employee contracts tab
- [ ] Contractor contracts tab
- [ ] Contract status (active, expiring, expired)
- [ ] Contract statistics

**Backend Service:** `contractsService`

---

#### 5. Leave Requests (`/employer/leave/requests`)
**What to Test:**
- [ ] Pending requests display
- [ ] Can filter by status, leave type
- [ ] Can approve leave request
- [ ] Can reject leave with reason
- [ ] Leave balance auto-updates on approval

**How to Test Approval:**
1. Find pending leave request
2. Click "Approve"
3. Verify employee's leave balance decreased

**How to Test Rejection:**
1. Find pending leave request
2. Click "Reject"
3. Enter rejection reason
4. Verify balance NOT deducted

**Backend Service:** `leavesService`

---

#### 6. Expense Requests (via Requests page)
**What to Test:**
- [ ] Pending expenses display
- [ ] Can view expense details (receipt, amount, category)
- [ ] Can approve expense
- [ ] Can reject expense with reason

**Backend Service:** `expensesService`

---

#### 7. Invoices (`/employer/invoices`)
**What to Test:**
- [ ] Pending invoices from contractors
- [ ] Can approve invoice
- [ ] Can reject invoice with reason
- [ ] Can mark invoice as paid
- [ ] Invoice summary statistics

**How to Test Payment Flow:**
1. Find approved invoice
2. Click "Pay"
3. Enter payment reference
4. Verify status changes to "paid"

**Backend Service:** `invoicesService`

---

#### 8. Timesheet (`/employer/timesheet`)
**What to Test:**
- [ ] Submitted timesheets display
- [ ] Can approve timesheet
- [ ] Can reject timesheet
- [ ] Hours calculation correct

**Backend Service:** `timesheetsService`

---

#### 9. Reports (`/employer/reports`)
**What to Test:**
- [ ] Various report types available
- [ ] Can generate reports
- [ ] Export functionality

---

#### 10. Documents (`/employer/documents`)
**What to Test:**
- [ ] Company documents display
- [ ] Can upload documents
- [ ] Can view/download documents

**Backend Service:** `documentsService`

---

#### 11. Settings (`/employer/settings`)
**What to Test:**
- [ ] Company settings
- [ ] Notification preferences
- [ ] Integration settings

---

## Employee Testing

### Access Employee Dashboard
1. Login with: `aarav@rapidone.com`
2. URL: `http://localhost:3000/employee/dashboard`

### Available Pages & Features

#### 1. Dashboard (`/employee/dashboard`)
**What to Test:**
- [ ] Leave balance summary displays
- [ ] Pending requests status
- [ ] Upcoming holidays
- [ ] Recent payslip info

**Backend Service:** `dashboardService.getEmployeeStats()`

---

#### 2. Leave Application (`/employee/leave/apply`)
**What to Test:**
- [ ] Leave balances display by type
- [ ] Can select leave type
- [ ] Can select date range
- [ ] Half-day option works
- [ ] Reason field required
- [ ] Submit creates pending request
- [ ] Balance shows reserved amount

**How to Test Leave Application:**
1. Check current leave balance
2. Select leave type (Annual, Sick, etc.)
3. Select start and end dates
4. Enter reason
5. Submit
6. Verify balance shows pending deduction
7. Check request appears in history

**Leave Types:**
- Annual Leave
- Sick Leave
- Personal Leave
- Maternity/Paternity
- Bereavement
- Unpaid Leave

**Backend Service:** `leavesService.createLeaveRequest()`

---

#### 3. Expense Submission (`/employee/expenses/submit`)
**What to Test:**
- [ ] Can create new expense claim
- [ ] Can select category
- [ ] Can enter amount
- [ ] Can add merchant name
- [ ] Can attach receipt (if implemented)
- [ ] Submit creates pending request

**Expense Categories:**
- Travel
- Meals
- Accommodation
- Office Supplies
- Training
- Other

**How to Test:**
1. Click "New Expense"
2. Select category: "Travel"
3. Enter amount: 5000
4. Enter merchant: "Airlines Inc"
5. Select date
6. Enter description
7. Submit
8. Verify appears in expense history

**Backend Service:** `expensesService.createExpenseClaim()`

---

#### 4. Attendance (`/employee/attendance/clockin`)
**What to Test:**
- [ ] Clock in/out functionality
- [ ] Attendance calendar view
- [ ] Monthly statistics

**Backend Service:** `attendanceService`

---

#### 5. Payslips (`/employee/payslips`)
**What to Test:**
- [ ] Current month payslip displays
- [ ] Historical payslips available
- [ ] Earnings breakdown correct
- [ ] Deductions breakdown correct
- [ ] Net pay calculation correct

**Payslip Components:**
| Earnings | Deductions |
|----------|------------|
| Basic Salary | Income Tax |
| HRA | Provident Fund |
| Special Allowance | Professional Tax |
| Bonus | Other Deductions |

**Backend Service:** `payrollService.getCurrentPayslip()`

---

#### 6. Tax Documents (`/employee/tax/declaration`)
**What to Test:**
- [ ] Investment declaration form
- [ ] Can enter Section 80C investments
- [ ] Can enter Section 80D (health insurance)
- [ ] Can enter HRA exemption
- [ ] Can save draft
- [ ] Can submit declaration
- [ ] Form 16 available (after FY end)

**Tax Sections:**
| Section | Max Limit | Description |
|---------|-----------|-------------|
| 80C | ₹1,50,000 | PPF, ELSS, LIC, etc. |
| 80D | ₹25,000-₹100,000 | Health Insurance |
| 80E | No limit | Education Loan Interest |
| 80G | Varies | Donations |
| 24B | ₹2,00,000 | Home Loan Interest |

**How to Test:**
1. Go to Tax Declaration
2. Enter 80C: 150000
3. Enter 80D: 25000
4. Save Draft
5. Verify saved
6. Submit Declaration

**Backend Service:** `taxService`

---

#### 7. Profile (`/employee/profile`)
**What to Test:**
- [ ] Personal info displays
- [ ] Can update phone number
- [ ] Address management (current, permanent)
- [ ] Bank account management
- [ ] Emergency contacts management

**How to Test Profile Update:**
1. Click "Edit" on personal info
2. Update phone number
3. Save
4. Verify update persisted

**How to Test Address:**
1. Click "Add Address"
2. Select type (Current/Permanent)
3. Enter address details
4. Save

**How to Test Bank Account:**
1. Click "Add Bank Account"
2. Enter account number
3. Enter IFSC code
4. Enter bank name
5. Set as primary (optional)
6. Save

**Backend Service:** `profileService`

---

#### 8. Documents (`/employee/documents/library`)
**What to Test:**
- [ ] Personal documents display
- [ ] Can filter by category
- [ ] Can view document details
- [ ] Verification status shows

**Backend Service:** `documentsService`

---

## Contractor Testing

### Access Contractor Dashboard
1. Login with: `amit@rapidone.com`
2. URL: `http://localhost:3000/contractor/dashboard`

### Available Pages & Features

#### 1. Dashboard (`/contractor/dashboard`)
**What to Test:**
- [ ] Active contract details
- [ ] Pending invoice amount
- [ ] Recent timesheet status
- [ ] Payment history summary

---

#### 2. Timesheet (`/contractor/timesheet`)
**What to Test:**
- [ ] Can create weekly timesheet
- [ ] Can enter hours per day
- [ ] Can save as draft
- [ ] Can submit for approval
- [ ] History shows previous timesheets

**Timesheet Workflow:**
1. Draft → 2. Submitted → 3. Approved/Rejected

**How to Test:**
1. Click "New Timesheet"
2. Select week
3. Enter hours for each day
4. Save as Draft
5. Review
6. Submit
7. Wait for employer approval

**Backend Service:** `timesheetsService`

---

#### 3. Invoices (`/contractor/invoices`)
**What to Test:**
- [ ] Can create new invoice
- [ ] Invoice linked to contract
- [ ] Can set amount and due date
- [ ] Invoice history displays
- [ ] Payment status shows

**Invoice Workflow:**
1. Draft → 2. Submitted → 3. Approved → 4. Paid
                      ↘ 3. Rejected

**How to Test:**
1. Click "Create Invoice"
2. Select contract
3. Enter amount: 50000
4. Set invoice date
5. Set due date
6. Add description
7. Submit
8. Wait for employer approval/payment

**Backend Service:** `invoicesService.createInvoice()`

---

#### 4. Profile (`/contractor/profile`)
**What to Test:**
- [ ] Personal info displays
- [ ] Contract details show
- [ ] Bank account for payments
- [ ] Can update contact info

**Backend Service:** `profileService.getContractorProfile()`

---

## Database Information

### Supabase Tables Used

#### Core Tables
```sql
-- Users & Auth
users_user (id, email, first_name, last_name)

-- Companies
company_company (id, name, country, currency)

-- Employees
employee_employee (id, user_id, employee_code, date_of_birth, ...)
employee_employeecontract (id, employee_id, company_id, salary, ...)

-- Contractors
contractor_contractor (id, user_id, contractor_code, ...)
contractor_contractorcontract (id, contractor_id, company_id, rate, ...)
```

#### HR Tables
```sql
-- Leave Management
leave_leaverequest (id, employee_id, leave_type, start_date, end_date, status, ...)
leave_leavebalance (id, employee_id, leave_type, total_days, used_days, ...)

-- Expense Management
expense_expenseclaim (id, employee_id, category, amount, status, ...)

-- Contractor Invoices
contractor_invoice (id, contractor_id, contract_id, amount, status, ...)

-- Timesheets
contractor_timesheet (id, contract_id, week_start_date, hours, status, ...)
```

#### Admin Tables
```sql
-- SuperAdmin
superadmin_team (id, user_id, role, is_active)
superadmin_team_client (team_member_id, company_id)
superadmin_audit_log (id, user_id, action, entity_type, entity_id, ...)

-- Platform Requests
request_request (id, requester_id, request_type, category, status, ...)
```

### Test Data in Database

Based on seed data, expect:
- **23 users** in `users_user`
- **25 requests** in `request_request`
- **12 employees** in `employee_employee`
- **6 contractors** in `contractor_contractor`
- Multiple companies in `company_company`

---

## API Reference

### Authentication
```typescript
// Login
const { login, logout, user, isAuthenticated } = useAuth()

// Login with credentials
await login('admin@rapidone.com', 'anypassword')

// Logout
logout()

// Check current user
console.log(user) // { id, email, name, role, companyId }
```

### React Query Hooks

#### Read Data (Queries)
```typescript
// Dashboard
const { data } = useEmployerDashboard(companyId)
const { data } = useEmployeeDashboard(employeeId)
const { data } = useSuperAdminDashboard()

// Employees/Contractors
const { data } = useEmployees(companyId)
const { data } = useContractors(companyId)

// Leaves
const { data } = useLeaveRequests(companyId, filters)
const { data } = useLeaveBalances(employeeId)

// Expenses
const { data } = useExpenseRequests(companyId, filters)
const { data } = useEmployeeExpenses(employeeId)

// Invoices
const { data } = useCompanyInvoices(companyId, filters)
const { data } = useContractorInvoices(contractorId)
```

#### Write Data (Mutations)
```typescript
// Leaves
const approveLeave = useApproveLeave()
await approveLeave.mutateAsync({ requestId, approverId })

const createLeave = useCreateLeaveRequest()
await createLeave.mutateAsync({
  employeeId: 'emp-123',
  leaveType: 'annual',
  startDate: '2024-01-15',
  endDate: '2024-01-17',
  reason: 'Family vacation'
})

// Expenses
const createExpense = useCreateExpenseClaim()
await createExpense.mutateAsync({
  employeeId: 'emp-123',
  category: 'travel',
  amount: 5000,
  merchant: 'Airlines',
  expenseDate: '2024-01-10',
  description: 'Client visit'
})

// SuperAdmin
const approveRequest = useApproveRequest()
await approveRequest.mutateAsync({
  requestId: 'req-123',
  remarks: 'Approved per policy'
})
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't login | Clear browser localStorage and try again |
| Auto-redirecting to wrong dashboard | Click "Switch Account" on login page |
| Data not updating | Wait for auto-refresh or manually refresh page |
| Rate limit error | Wait 2 seconds between actions (SuperAdmin) |
| Permission denied | Verify you're logged in with correct role |
| Blank page | Check browser console for errors |

### Debug Commands
```bash
# Check server logs
pnpm dev

# Clear Next.js cache
rm -rf .next && pnpm dev

# Check database connection
# View Supabase dashboard for query logs
```

### Browser Console Checks
```javascript
// Check auth state
localStorage.getItem('rapid_auth_user')

// Clear auth (force logout)
localStorage.removeItem('rapid_auth_user')
```

---

## Testing Checklist

### Quick Smoke Test (5 minutes)
- [ ] Login as SuperAdmin
- [ ] View dashboard
- [ ] Navigate to Requests
- [ ] Login as Employee (switch account)
- [ ] Apply for leave
- [ ] Login as Employer (switch account)
- [ ] Approve the leave request

### Full Feature Test (30 minutes)
- [ ] All SuperAdmin pages load
- [ ] All Employer pages load
- [ ] All Employee pages load
- [ ] All Contractor pages load
- [ ] Leave request → approval flow
- [ ] Expense claim → approval flow
- [ ] Invoice creation → payment flow
- [ ] Timesheet submission → approval flow
- [ ] Profile update saves correctly
- [ ] Audit logs record actions

---

*Document Version: 1.0*
*Last Updated: December 2024*
