# User Flows - Rapid.one EoR Platform

This document describes the user journey and flow for each type of user in the platform.

---

## Table of Contents

1. [User Types](#user-types)
2. [Employer User Flow](#employer-user-flow)
3. [Employee User Flow](#employee-user-flow)
4. [Contractor User Flow](#contractor-user-flow)
5. [SuperAdmin User Flow](#superadmin-user-flow-planned)

---

## User Types

| Type | Description | Dashboard URL |
|------|-------------|---------------|
| **Employer** | Company HR/Admin who manages employees and contractors | `/employer/dashboard` |
| **Employee** | Full-time employee managed through the platform | `/employee/dashboard` |
| **Contractor** | Independent contractor working with a company | `/contractor/dashboard` |
| **SuperAdmin** | Rapid.one platform administrator (planned) | `/superadmin/dashboard` |

---

## Employer User Flow

### Overview
Employers are company administrators who manage their workforce, approve requests, and configure company policies.

### Main Navigation Flow

```
                           ┌─────────────────────────────────────────┐
                           │              EMPLOYER LOGIN              │
                           │      Email: demo@rapidone.com           │
                           └───────────────┬─────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              DASHBOARD                                        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │ Employees  │ │ Contractors│ │  Pending   │ │  Pending   │                │
│  │   Count    │ │   Count    │ │  Leaves    │ │  Expenses  │                │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                │
│                                                                              │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │   Team Distribution Chart   │  │   Recent Approval Items     │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
└──────────────────────────────────────────────────────────────────────────────┘
                                           │
           ┌───────────┬───────────┬───────┴───────┬───────────┬───────────┐
           ▼           ▼           ▼               ▼           ▼           ▼
     ┌──────────┐┌──────────┐┌──────────┐   ┌──────────┐┌──────────┐┌──────────┐
     │Employees ││Contractors││  Leave   │   │ Expenses ││ Payroll  ││ Settings │
     └────┬─────┘└────┬─────┘└────┬─────┘   └────┬─────┘└────┬─────┘└────┬─────┘
          │           │           │               │           │           │
          ▼           ▼           ▼               ▼           ▼           ▼
```

### Detailed User Journeys

#### Journey 1: Managing Employees

```
Employees List → Click Employee → Employee Detail
     │                               │
     │                               ├── View Personal Info
     │                               ├── View Contract Details
     │                               ├── View Documents
     │                               ├── View Leave History
     │                               └── Edit Employee →
     │                                         │
     │                                         ├── Update Personal Details
     │                                         ├── Update Contract
     │                                         └── Update Compensation
     │
     └── + Add New Employee →
                  │
                  ├── Step 1: Personal Details
                  ├── Step 2: Employment Details
                  ├── Step 3: Compensation
                  └── Step 4: Review & Send Offer
```

#### Journey 2: Approving Leave Requests

```
Dashboard (Pending Leaves Badge)
     │
     └── Click "View All" →
              │
              └── Leave Requests Page →
                       │
                       ├── Filter by Status (Pending/Approved/Rejected)
                       ├── Filter by Leave Type
                       ├── Search by Employee
                       │
                       └── Click Request →
                                │
                                ├── View Leave Details
                                ├── View Employee Leave Balance
                                │
                                └── Action:
                                     ├── Approve → Confirmation Modal → Success
                                     └── Reject → Add Reason → Confirmation → Success
```

#### Journey 3: Company Settings

```
Settings →
    │
    ├── Company Profile
    │      ├── Legal Name
    │      ├── Display Name
    │      ├── Logo
    │      ├── CIN, GSTIN, PAN
    │      └── Registered Address
    │
    ├── Leave Policies
    │      ├── Casual Leave (days, carry forward)
    │      ├── Sick Leave (days, documentation)
    │      ├── Earned Leave (days, encashment)
    │      └── Add Custom Leave Type
    │
    ├── Salary Structure
    │      ├── Components (Basic, HRA, etc.)
    │      ├── Percentages
    │      └── Tax settings
    │
    └── Teams
           ├── View Departments
           ├── Add Department
           └── Assign Employees
```

### Sidebar Navigation Structure

```
├── Dashboard
├── Employees
│   ├── All Employees
│   └── Add New
├── Contractors
│   ├── All Contractors
│   ├── Add New
│   └── Timesheets
├── Leave
│   ├── Requests
│   ├── Calendar
│   └── Settings
├── Expenses
│   └── Requests
├── Payroll
│   ├── Dashboard
│   ├── Run Payroll
│   └── Salary Structure
├── Compliance
│   ├── EPF
│   └── TDS
├── Invoices
│   ├── All Invoices
│   └── Approve
├── Requests
│   └── Special Requests
├── Reports
├── Documents
├── Holidays
└── Settings
    ├── Company
    ├── Policies
    └── Teams
```

---

## Employee User Flow

### Overview
Employees access the platform to view their information, apply for leaves, submit expenses, and access payslips.

### Main Navigation Flow

```
                           ┌─────────────────────────────────────────┐
                           │              EMPLOYEE LOGIN              │
                           │   Email: john.doe@rapidone.com          │
                           └───────────────┬─────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              DASHBOARD                                        │
│  ┌────────────────────────────┐  ┌────────────────────────────┐             │
│  │     Leave Balance          │  │    Upcoming Holidays       │             │
│  │  Casual: 8/12             │  │    Republic Day - Jan 26   │             │
│  │  Sick: 5/7                │  │    Holi - Mar 14           │             │
│  │  Earned: 15/15            │  │    Good Friday - Apr 18    │             │
│  └────────────────────────────┘  └────────────────────────────┘             │
│                                                                              │
│  ┌────────────────────────────┐  ┌────────────────────────────┐             │
│  │    Quick Actions           │  │    Announcements           │             │
│  │  • Apply Leave             │  │    • Tax proof deadline    │             │
│  │  • Submit Expense          │  │    • Holiday calendar      │             │
│  │  • View Payslip            │  │                            │             │
│  └────────────────────────────┘  └────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Detailed User Journeys

#### Journey 1: Applying for Leave

```
Dashboard →
    │
    └── "Apply Leave" (Quick Action) OR Leave → Apply →
              │
              └── Leave Application Form
                       │
                       ├── Select Leave Type
                       │      (Shows available balance)
                       │
                       ├── Select Date Range
                       │      (Calendar picker)
                       │      (Auto-calculates days)
                       │
                       ├── Half Day Toggle
                       │
                       ├── Reason (optional)
                       │
                       ├── Emergency Contact
                       │
                       └── Submit →
                                │
                                └── Confirmation →
                                         │
                                         └── Leave History (status: Pending)
```

#### Journey 2: Submitting Expense

```
Dashboard →
    │
    └── "Submit Expense" (Quick Action) OR Expenses → Submit →
              │
              └── Expense Submission Form
                       │
                       ├── Select Category
                       │      (Travel, Meals, Software, etc.)
                       │
                       ├── Enter Amount
                       │
                       ├── Expense Date
                       │
                       ├── Merchant Name
                       │
                       ├── Payment Mode (Cash/Card/UPI)
                       │
                       ├── Description
                       │
                       ├── Upload Receipt (optional)
                       │
                       └── Submit →
                                │
                                └── Confirmation →
                                         │
                                         └── Expense History (status: Pending)
```

#### Journey 3: Tax Declaration

```
Tax →
    │
    ├── Declaration →
    │      │
    │      ├── Select Financial Year
    │      │
    │      ├── Choose Tax Regime (Old/New)
    │      │
    │      ├── Section 80C
    │      │      ├── LIC Premium
    │      │      ├── PPF Contribution
    │      │      ├── ELSS Funds
    │      │      └── Home Loan Principal
    │      │
    │      ├── Section 80D (Health Insurance)
    │      │
    │      ├── Section 80E (Education Loan)
    │      │
    │      ├── HRA Exemption
    │      │      ├── Rent Paid
    │      │      └── Metro City Toggle
    │      │
    │      └── Submit Declaration
    │
    ├── Proofs → Upload Supporting Documents
    │
    ├── Deductions → View Tax Computation
    │
    └── Form 16 → Download Annual Tax Statement
```

### Sidebar Navigation Structure

```
├── Dashboard
├── Profile
│   ├── Personal Info
│   ├── Bank Details
│   └── Documents
├── Leave
│   ├── Apply
│   └── History
├── Expenses
│   ├── Submit
│   └── History
├── Payslips
│   └── Monthly Payslips
├── Tax
│   ├── Declaration
│   ├── Proofs
│   ├── Deductions
│   └── Form 16
├── Attendance
│   ├── Clock In/Out
│   ├── History
│   └── Regularization
├── Documents
│   ├── Library
│   └── Upload
├── Onboarding (if applicable)
└── Settings
```

---

## Contractor User Flow

### Overview
Contractors use the platform to submit timesheets, generate invoices, and track payments.

### Main Navigation Flow

```
                           ┌─────────────────────────────────────────┐
                           │            CONTRACTOR LOGIN              │
                           │   Email: contractor@example.com         │
                           └───────────────┬─────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              DASHBOARD                                        │
│  ┌────────────────────────────┐  ┌────────────────────────────┐             │
│  │    Active Contract         │  │    Current Week Hours      │             │
│  │    Company: TechCorp       │  │    Mon: 8h  Tue: 8h        │             │
│  │    Type: Monthly           │  │    Wed: 7h  Thu: 8h        │             │
│  │    Rate: $5,000/month      │  │    Fri: 6h                 │             │
│  │    End: Mar 31, 2025       │  │    Total: 37h              │             │
│  └────────────────────────────┘  └────────────────────────────┘             │
│                                                                              │
│  ┌────────────────────────────┐  ┌────────────────────────────┐             │
│  │    Pending Invoices        │  │    Payment Status          │             │
│  │    INV-2024-001: $5,000    │  │    Last Payment: Nov 15    │             │
│  │    Status: Submitted       │  │    Amount: $5,000          │             │
│  └────────────────────────────┘  └────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Detailed User Journeys

#### Journey 1: Submitting Timesheet (Hourly Contractors)

```
Dashboard →
    │
    └── Timesheets → Submit Timesheet →
              │
              └── Weekly Timesheet Form
                       │
                       ├── Select Week (Week Start Date)
                       │
                       ├── Enter Daily Hours
                       │      Mon: [ ] Tue: [ ] Wed: [ ]
                       │      Thu: [ ] Fri: [ ] Sat: [ ] Sun: [ ]
                       │
                       ├── Task Description
                       │
                       └── Submit →
                                │
                                └── Status: Pending Approval
                                         │
                                         └── Employer Approves →
                                                   │
                                                   └── Generate Invoice
```

#### Journey 2: Invoice Generation

```
Invoices →
    │
    ├── Generate Invoice →
    │      │
    │      ├── Auto-populated from:
    │      │      ├── Approved Timesheet (hourly)
    │      │      └── Monthly Contract (fixed)
    │      │
    │      ├── Invoice Details
    │      │      ├── Invoice Number (auto)
    │      │      ├── Invoice Date
    │      │      ├── Billing Period
    │      │      └── Due Date
    │      │
    │      ├── Line Items
    │      │      ├── Description
    │      │      ├── Hours/Units
    │      │      ├── Rate
    │      │      └── Amount
    │      │
    │      ├── Tax Calculation
    │      │      ├── CGST
    │      │      ├── SGST
    │      │      └── IGST
    │      │
    │      └── Submit to Employer →
    │
    └── Invoice History →
           │
           └── Track Status: Draft → Submitted → Approved → Paid
```

### Sidebar Navigation Structure

```
├── Dashboard
├── Profile
│   ├── Personal/Business Info
│   ├── Bank Details
│   └── Tax Details (GSTIN, PAN)
├── Contracts
│   └── Active Contracts
├── Timesheets
│   ├── Submit
│   └── History
├── Invoices
│   ├── Generate
│   └── History
├── Documents
└── Settings
```

---

## SuperAdmin User Flow (Planned)

### Overview
SuperAdmins are Rapid.one platform administrators who manage all client companies, process requests, and handle invoicing.

### Main Dashboard Flow

```
                           ┌─────────────────────────────────────────┐
                           │           SUPERADMIN LOGIN               │
                           │      Email: admin@rapid.one             │
                           └───────────────┬─────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           SUPERADMIN DASHBOARD                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Companies│ │Employees │ │Contractors│ │ Pending  │ │ Monthly  │          │
│  │    15    │ │   450    │ │    120   │ │ Requests │ │ Revenue  │          │
│  │          │ │          │ │          │ │    25    │ │  $250K   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                              │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │   Companies by Status       │  │   Recent Activity           │          │
│  │   Active: 12               │  │   • TechCorp added employee  │          │
│  │   Trial: 2                 │  │   • Invoice #245 paid        │          │
│  │   Churned: 1               │  │   • Equipment request new    │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Planned Navigation Structure

```
├── Dashboard
│   └── Platform Overview
├── Clients
│   ├── All Companies
│   └── Company Detail (drill-down)
├── Team
│   └── Rapid.one Team Members
├── Requests
│   ├── All Requests
│   ├── Equipment
│   ├── Gifts
│   └── Terminations
├── Invoices
│   ├── Generate Payroll Invoice
│   ├── All Invoices
│   └── Payment Tracking
├── Services
│   ├── Health Insurance
│   ├── Background Verification
│   ├── Equipment
│   └── Office Space
├── Reports
│   ├── Revenue
│   ├── Employee Count
│   └── Service Usage
├── Audit Logs
└── Settings
    ├── Platform Config
    ├── Email Templates
    └── Integrations
```

---

## Cross-Role Interactions

### Request Flow (Employer → SuperAdmin)

```
EMPLOYER                          SUPERADMIN
   │                                  │
   │ 1. Submit Special Request        │
   │ ─────────────────────────────►   │
   │    (Equipment Purchase)          │
   │                                  │
   │                                  │ 2. Review Request
   │                                  │
   │                                  │ 3. Process/Fulfill
   │                                  │
   │   4. Status Update               │
   │ ◄─────────────────────────────   │
   │    (Completed)                   │
   │                                  │
```

### Leave Approval Flow (Employee → Employer)

```
EMPLOYEE                          EMPLOYER
   │                                  │
   │ 1. Apply Leave                   │
   │ ─────────────────────────────►   │
   │                                  │
   │                                  │ 2. Review Application
   │                                  │
   │                                  │ 3. Approve/Reject
   │                                  │
   │   4. Email Notification          │
   │ ◄─────────────────────────────   │
   │    (Leave Approved)              │
   │                                  │
```

### Invoice Flow (Contractor → Employer → SuperAdmin)

```
CONTRACTOR               EMPLOYER               SUPERADMIN
   │                        │                        │
   │ 1. Submit Timesheet    │                        │
   │ ───────────────────►   │                        │
   │                        │                        │
   │                        │ 2. Approve Timesheet   │
   │ ◄───────────────────   │                        │
   │    (Approved)          │                        │
   │                        │                        │
   │ 3. Generate Invoice    │                        │
   │ ───────────────────►   │                        │
   │                        │                        │
   │                        │ 4. Approve Invoice     │
   │                        │ ───────────────────►   │
   │                        │                        │
   │                        │                        │ 5. Process Payment
   │                        │                        │
   │   6. Payment Received  │                        │
   │ ◄─────────────────────────────────────────────  │
   │                        │                        │
```

---

## URL Reference

### Employer Routes
| Feature | URL |
|---------|-----|
| Dashboard | `/employer/dashboard` |
| Employees List | `/employer/employees` |
| Employee Detail | `/employer/employees/[id]` |
| Add Employee | `/employer/employees/new` |
| Leave Requests | `/employer/leave/requests` |
| Expense Requests | `/employer/expenses/requests` |
| Settings | `/employer/settings` |

### Employee Routes
| Feature | URL |
|---------|-----|
| Dashboard | `/employee/dashboard` |
| Profile | `/employee/profile` |
| Apply Leave | `/employee/leave/apply` |
| Submit Expense | `/employee/expenses/submit` |
| Payslips | `/employee/payslips` |
| Tax Declaration | `/employee/tax/declaration` |

### Contractor Routes
| Feature | URL |
|---------|-----|
| Dashboard | `/contractor/dashboard` |
| Profile | `/contractor/profile` |
| Timesheets | `/contractor/timesheets` |
| Invoices | `/contractor/invoices` |
