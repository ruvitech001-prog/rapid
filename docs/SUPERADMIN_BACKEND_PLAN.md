# SuperAdmin Backend Implementation Plan

**Purpose**: This document provides a detailed implementation plan for building the SuperAdmin portal. It is designed to be used by Claude Code or any developer to systematically build out the SuperAdmin features.

---

## Table of Contents

1. [Overview](#overview)
2. [Existing Infrastructure](#existing-infrastructure)
3. [Phase 1: Authentication & Layout](#phase-1-authentication--layout)
4. [Phase 2: Dashboard & Companies](#phase-2-dashboard--companies)
5. [Phase 3: Team & Access Control](#phase-3-team--access-control)
6. [Phase 4: Requests Management](#phase-4-requests-management)
7. [Phase 5: Invoicing](#phase-5-invoicing)
8. [Phase 6: Services Management](#phase-6-services-management)
9. [Phase 7: Reports & Audit Logs](#phase-7-reports--audit-logs)
10. [Phase 8: Settings](#phase-8-settings)
11. [Implementation Checklist](#implementation-checklist)

---

## Overview

### What is SuperAdmin?

SuperAdmin is the internal Rapid.one administration portal for managing:
- **Client Companies**: Onboard, monitor, and support client companies
- **Platform Users**: View all employees and contractors across companies
- **Requests**: Process special requests (equipment, gifts, terminations, etc.)
- **Invoicing**: Generate and track invoices to client companies
- **Services**: Manage health insurance, BGV, equipment, office space
- **Platform Settings**: Configure platform-wide settings

### Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| State Management | React Query |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Charts | Recharts |

---

## Existing Infrastructure

### Database Tables Available

These tables already exist and can be used:

| Table | Rows | Relevant For |
|-------|------|--------------|
| `company_organization` | 1 | Parent organizations |
| `company_company` | 1 | Client companies |
| `company_employer` | 1 | Company admins |
| `users_user` | 19 | All platform users |
| `employee_employee` | 12 | Employee profiles |
| `employee_employeecontract` | 12 | Employment contracts |
| `contractor_contractor` | 6 | Contractor profiles |
| `contractor_contractorcontract` | 6 | Contractor contracts |
| `leave_leaverequest` | 10 | Leave requests |
| `expense_expenseclaim` | 10 | Expense claims |
| `request_request` | 0 | Generic requests (empty) |

### Existing Services Pattern

Follow the established pattern in `src/lib/services/`:

```typescript
// Example: src/lib/services/employees.service.ts
import { createClient } from '@/lib/supabase/client'

class EmployeesService {
  private get supabase() {
    return createClient()
  }

  async getByCompany(companyId: string) {
    const { data, error } = await this.supabase
      .from('employee_employee')
      .select(`...`)
      .eq('contract.company_id', companyId)

    if (error) throw error
    return data
  }
}

export const employeesService = new EmployeesService()
```

### Existing Hooks Pattern

Follow the pattern in `src/lib/hooks/`:

```typescript
// Example: src/lib/hooks/use-employees.ts
'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries/keys'
import { employeesService } from '@/lib/services'

export function useEmployees(companyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.employees.byCompany(companyId!),
    queryFn: () => employeesService.getByCompany(companyId!),
    enabled: !!companyId,
  })
}
```

---

## Phase 1: Authentication & Layout

### Step 1.1: Add SuperAdmin User Type

**Task**: Modify the `users_user` table to support superadmin role.

**SQL Migration** (apply via Supabase MCP):

```sql
-- Migration: add_superadmin_user_type
-- Description: Add superadmin to user_type enum and create initial superadmin user

-- Step 1: Drop existing constraint
ALTER TABLE users_user DROP CONSTRAINT IF EXISTS users_user_user_type_check;

-- Step 2: Add new constraint with superadmin
ALTER TABLE users_user ADD CONSTRAINT users_user_user_type_check
  CHECK (user_type IN ('employer', 'employee', 'contractor', 'superadmin'));

-- Step 3: Create superadmin user
INSERT INTO users_user (
  id,
  email,
  first_name,
  last_name,
  user_type,
  is_active,
  is_email_verified
) VALUES (
  'sa000001-0001-0001-0001-000000000001',
  'admin@rapid.one',
  'Super',
  'Admin',
  'superadmin',
  true,
  true
) ON CONFLICT (email) DO NOTHING;
```

### Step 1.2: Create SuperAdmin Layout

**Files to Create**:

```
src/app/superadmin/
├── layout.tsx
├── page.tsx
└── not-found.tsx
```

**File: `src/app/superadmin/layout.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Receipt,
  Package,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/superadmin/clients', icon: Building2 },
  { name: 'Team', href: '/superadmin/team', icon: Users },
  { name: 'Requests', href: '/superadmin/requests', icon: FileText },
  { name: 'Invoices', href: '/superadmin/invoices', icon: Receipt },
  { name: 'Services', href: '/superadmin/services', icon: Package },
  { name: 'Reports', href: '/superadmin/reports', icon: BarChart3 },
  { name: 'Audit Logs', href: '/superadmin/audit-logs', icon: ScrollText },
  { name: 'Settings', href: '/superadmin/settings', icon: Settings },
]

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-[#F4F7FA]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#EFF2F5] flex flex-col">
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-[#EFF2F5]">
          <span className="text-[20px] font-bold text-[#642DFC]">rapid</span>
          <span className="text-[20px] font-bold text-[#353B41]">.one</span>
          <span className="ml-2 px-2 py-0.5 bg-[#642DFC] text-white text-[10px] font-semibold rounded">
            ADMIN
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#642DFC] text-white'
                    : 'text-[#6A7682] hover:bg-[#F4F7FA]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#EFF2F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#642DFC] flex items-center justify-center text-white font-semibold">
              SA
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-[#353B41]">Super Admin</p>
              <p className="text-[12px] text-[#8593A3]">admin@rapid.one</p>
            </div>
            <button className="p-2 hover:bg-[#F4F7FA] rounded-lg">
              <LogOut className="w-4 h-4 text-[#8593A3]" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="h-[72px] bg-white border-b border-[#EFF2F5] flex items-center justify-end px-8 gap-4">
          <button className="relative p-2 hover:bg-[#F4F7FA] rounded-lg">
            <Bell className="w-5 h-5 text-[#6A7682]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
```

**File: `src/app/superadmin/page.tsx`**

```typescript
import { redirect } from 'next/navigation'

export default function SuperAdminPage() {
  redirect('/superadmin/dashboard')
}
```

**File: `src/app/superadmin/not-found.tsx`**

```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-[24px] font-semibold text-[#353B41] mb-2">Page Not Found</h2>
      <p className="text-[#8593A3] mb-6">The page you're looking for doesn't exist.</p>
      <Link
        href="/superadmin/dashboard"
        className="px-4 py-2 bg-[#642DFC] text-white rounded-lg hover:bg-[#5620e0]"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
```

---

## Phase 2: Dashboard & Companies

### Step 2.1: Create SuperAdmin Service

**File: `src/lib/services/superadmin.service.ts`**

```typescript
import { createClient } from '@/lib/supabase/client'

export interface CompanyWithStats {
  id: string
  legalName: string
  displayName: string | null
  isActive: boolean
  employeeCount: number
  contractorCount: number
  createdAt: string
}

export interface SuperAdminDashboardStats {
  totalCompanies: number
  activeCompanies: number
  totalEmployees: number
  totalContractors: number
  pendingRequests: number
  pendingInvoices: number
}

class SuperAdminService {
  private get supabase() {
    return createClient()
  }

  async getDashboardStats(): Promise<SuperAdminDashboardStats> {
    // Get company counts
    const { count: totalCompanies } = await this.supabase
      .from('company_company')
      .select('*', { count: 'exact', head: true })

    const { count: activeCompanies } = await this.supabase
      .from('company_company')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get employee count
    const { count: totalEmployees } = await this.supabase
      .from('employee_employee')
      .select('*', { count: 'exact', head: true })

    // Get contractor count
    const { count: totalContractors } = await this.supabase
      .from('contractor_contractor')
      .select('*', { count: 'exact', head: true })

    // Get pending requests
    const { count: pendingRequests } = await this.supabase
      .from('request_request')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    return {
      totalCompanies: totalCompanies || 0,
      activeCompanies: activeCompanies || 0,
      totalEmployees: totalEmployees || 0,
      totalContractors: totalContractors || 0,
      pendingRequests: pendingRequests || 0,
      pendingInvoices: 0, // Will implement when invoice table exists
    }
  }

  async getCompanies(): Promise<CompanyWithStats[]> {
    const { data: companies, error } = await this.supabase
      .from('company_company')
      .select(`
        id,
        legal_name,
        display_name,
        is_active,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get employee counts per company
    const companiesWithStats = await Promise.all(
      (companies || []).map(async (company) => {
        const { count: employeeCount } = await this.supabase
          .from('employee_employeecontract')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .eq('is_current', true)

        const { count: contractorCount } = await this.supabase
          .from('contractor_contractorcontract')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .eq('is_current', true)

        return {
          id: company.id,
          legalName: company.legal_name,
          displayName: company.display_name,
          isActive: company.is_active,
          employeeCount: employeeCount || 0,
          contractorCount: contractorCount || 0,
          createdAt: company.created_at,
        }
      })
    )

    return companiesWithStats
  }

  async getCompanyById(companyId: string) {
    const { data, error } = await this.supabase
      .from('company_company')
      .select(`
        *,
        organization:company_organization(name),
        employers:company_employer(
          id,
          role,
          department,
          user:users_user(email, first_name, last_name)
        )
      `)
      .eq('id', companyId)
      .single()

    if (error) throw error
    return data
  }
}

export const superAdminService = new SuperAdminService()
```

### Step 2.2: Create SuperAdmin Hooks

**File: `src/lib/hooks/use-superadmin.ts`**

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { superAdminService } from '@/lib/services/superadmin.service'

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: ['superadmin', 'dashboard'],
    queryFn: () => superAdminService.getDashboardStats(),
  })
}

export function useCompanies() {
  return useQuery({
    queryKey: ['superadmin', 'companies'],
    queryFn: () => superAdminService.getCompanies(),
  })
}

export function useCompany(companyId: string | undefined) {
  return useQuery({
    queryKey: ['superadmin', 'company', companyId],
    queryFn: () => superAdminService.getCompanyById(companyId!),
    enabled: !!companyId,
  })
}
```

### Step 2.3: Create Dashboard Page

**File: `src/app/superadmin/dashboard/page.tsx`**

```typescript
'use client'

import { Building2, Users, Briefcase, FileText, Receipt, TrendingUp } from 'lucide-react'
import { useSuperAdminDashboard, useCompanies } from '@/lib/hooks/use-superadmin'

export default function SuperAdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useSuperAdminDashboard()
  const { data: companies, isLoading: companiesLoading } = useCompanies()

  if (statsLoading || companiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#642DFC]" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Companies', value: stats?.totalCompanies || 0, icon: Building2, color: '#642DFC' },
    { label: 'Active Companies', value: stats?.activeCompanies || 0, icon: TrendingUp, color: '#10B981' },
    { label: 'Total Employees', value: stats?.totalEmployees || 0, icon: Users, color: '#3B82F6' },
    { label: 'Total Contractors', value: stats?.totalContractors || 0, icon: Briefcase, color: '#F59E0B' },
    { label: 'Pending Requests', value: stats?.pendingRequests || 0, icon: FileText, color: '#EF4444' },
    { label: 'Pending Invoices', value: stats?.pendingInvoices || 0, icon: Receipt, color: '#8B5CF6' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-[24px] font-semibold text-[#353B41]">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#EFF2F5] p-6"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#353B41]">{stat.value}</p>
                <p className="text-[14px] text-[#8593A3]">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Companies */}
      <div className="bg-white rounded-2xl border border-[#EFF2F5] p-6">
        <h2 className="text-[18px] font-semibold text-[#353B41] mb-4">Recent Companies</h2>
        <div className="space-y-3">
          {companies?.slice(0, 5).map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl"
            >
              <div>
                <p className="text-[14px] font-medium text-[#353B41]">
                  {company.displayName || company.legalName}
                </p>
                <p className="text-[12px] text-[#8593A3]">
                  {company.employeeCount} employees, {company.contractorCount} contractors
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                  company.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {company.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Step 2.4: Create Clients (Companies) List Page

**File: `src/app/superadmin/clients/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Building2 } from 'lucide-react'
import { useCompanies } from '@/lib/hooks/use-superadmin'

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: companies, isLoading } = useCompanies()

  const filteredCompanies = companies?.filter((company) =>
    company.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#642DFC]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold text-[#353B41]">
          Clients ({companies?.length || 0})
        </h1>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5C2]" />
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-12 pr-4 border border-[#DEE4EB] rounded-lg bg-white text-[14px] focus:outline-none focus:border-[#642DFC]"
        />
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl border border-[#EFF2F5] overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_100px_40px] gap-4 px-6 py-4 border-b border-[#EFF2F5] bg-[#F4F7FA]">
          <span className="text-[12px] font-medium text-[#353B41] uppercase tracking-wider">Company</span>
          <span className="text-[12px] font-medium text-[#353B41] uppercase tracking-wider">Employees</span>
          <span className="text-[12px] font-medium text-[#353B41] uppercase tracking-wider">Contractors</span>
          <span className="text-[12px] font-medium text-[#353B41] uppercase tracking-wider">Status</span>
          <span></span>
        </div>

        {filteredCompanies?.map((company) => (
          <Link
            key={company.id}
            href={`/superadmin/clients/${company.id}`}
            className="grid grid-cols-[1fr_120px_120px_100px_40px] gap-4 px-6 py-4 border-b border-[#EFF2F5] hover:bg-[#F4F7FA] items-center group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#642DFC]/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#642DFC]" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#353B41]">
                  {company.displayName || company.legalName}
                </p>
                <p className="text-[12px] text-[#8593A3]">{company.legalName}</p>
              </div>
            </div>
            <span className="text-[14px] text-[#8593A3]">{company.employeeCount}</span>
            <span className="text-[14px] text-[#8593A3]">{company.contractorCount}</span>
            <span
              className={`px-2 py-1 rounded text-[12px] font-medium ${
                company.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {company.isActive ? 'Active' : 'Inactive'}
            </span>
            <ChevronRight className="w-5 h-5 text-[#642DFC] opacity-0 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  )
}
```

---

## Phase 3: Team & Access Control

### Step 3.1: Create Team Member Table

**SQL Migration**:

```sql
-- Migration: create_superadmin_teammember
-- Description: Create table for managing SuperAdmin team members

CREATE TABLE IF NOT EXISTS superadmin_teammember (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID REFERENCES users_user(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'support', 'viewer')),
  department VARCHAR(100),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_teammember_user ON superadmin_teammember(user_id);
CREATE INDEX idx_teammember_role ON superadmin_teammember(role);

-- Enable RLS
ALTER TABLE superadmin_teammember ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only superadmins can access
CREATE POLICY "Superadmins can manage team"
  ON superadmin_teammember
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users_user
      WHERE users_user.id = auth.uid()
      AND users_user.user_type = 'superadmin'
    )
  );

-- Insert initial superadmin as team member
INSERT INTO superadmin_teammember (user_id, role, department)
SELECT id, 'super_admin', 'Platform'
FROM users_user
WHERE email = 'admin@rapid.one'
ON CONFLICT (user_id) DO NOTHING;
```

### Step 3.2: Create Team Management Page

**File: `src/app/superadmin/team/page.tsx`**

Create a page similar to the clients page but for managing internal team members with role-based permissions.

---

## Phase 4: Requests Management

### Step 4.1: Create Special Request Table

**SQL Migration**:

```sql
-- Migration: create_request_specialrequest
-- Description: Create table for special requests from employers

CREATE TABLE IF NOT EXISTS request_specialrequest (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  request_id UUID REFERENCES request_request(id) ON DELETE CASCADE,
  special_type VARCHAR(50) NOT NULL CHECK (special_type IN (
    'equipment_purchase',
    'equipment_collection',
    'equipment_transfer',
    'gifts_individual',
    'gifts_bulk',
    'termination',
    'hiring_cancellation',
    'probation_extension',
    'probation_confirmation',
    'incentive_payment',
    'contract_amendment',
    'office_space'
  )),
  company_id UUID REFERENCES company_company(id),
  employee_id UUID REFERENCES employee_employee(id),
  contractor_id UUID REFERENCES contractor_contractor(id),
  request_data JSONB NOT NULL DEFAULT '{}',
  estimated_cost NUMERIC(15,2),
  approved_cost NUMERIC(15,2),
  assigned_to UUID REFERENCES users_user(id),
  fulfillment_status VARCHAR(20) DEFAULT 'pending' CHECK (fulfillment_status IN (
    'pending', 'in_progress', 'completed', 'cancelled'
  )),
  fulfillment_date DATE,
  fulfillment_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_specialrequest_type ON request_specialrequest(special_type);
CREATE INDEX idx_specialrequest_company ON request_specialrequest(company_id);
CREATE INDEX idx_specialrequest_status ON request_specialrequest(fulfillment_status);

-- Enable RLS
ALTER TABLE request_specialrequest ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Superadmins can manage requests"
  ON request_specialrequest
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users_user
      WHERE users_user.id = auth.uid()
      AND users_user.user_type = 'superadmin'
    )
  );

CREATE POLICY "Employers can view their requests"
  ON request_specialrequest
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM company_employer
      WHERE user_id = auth.uid()
    )
  );
```

### Step 4.2: Create Requests Service

**File: `src/lib/services/requests.service.ts`**

```typescript
import { createClient } from '@/lib/supabase/client'

export interface SpecialRequest {
  id: string
  specialType: string
  companyId: string
  companyName?: string
  employeeId?: string
  employeeName?: string
  requestData: Record<string, unknown>
  estimatedCost?: number
  approvedCost?: number
  fulfillmentStatus: string
  createdAt: string
}

class RequestsService {
  private get supabase() {
    return createClient()
  }

  async getSpecialRequests(filters?: {
    type?: string
    status?: string
    companyId?: string
  }): Promise<SpecialRequest[]> {
    let query = this.supabase
      .from('request_specialrequest')
      .select(`
        id,
        special_type,
        company_id,
        employee_id,
        request_data,
        estimated_cost,
        approved_cost,
        fulfillment_status,
        created_at,
        company:company_company(legal_name, display_name),
        employee:employee_employee(full_name)
      `)
      .order('created_at', { ascending: false })

    if (filters?.type) {
      query = query.eq('special_type', filters.type)
    }
    if (filters?.status) {
      query = query.eq('fulfillment_status', filters.status)
    }
    if (filters?.companyId) {
      query = query.eq('company_id', filters.companyId)
    }

    const { data, error } = await query

    if (error) throw error

    return (data || []).map((req) => ({
      id: req.id,
      specialType: req.special_type,
      companyId: req.company_id,
      companyName: req.company?.display_name || req.company?.legal_name,
      employeeId: req.employee_id,
      employeeName: req.employee?.full_name,
      requestData: req.request_data,
      estimatedCost: req.estimated_cost,
      approvedCost: req.approved_cost,
      fulfillmentStatus: req.fulfillment_status,
      createdAt: req.created_at,
    }))
  }

  async updateRequestStatus(
    requestId: string,
    status: string,
    notes?: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from('request_specialrequest')
      .update({
        fulfillment_status: status,
        fulfillment_notes: notes,
        fulfillment_date: status === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) throw error
  }
}

export const requestsService = new RequestsService()
```

---

## Phase 5: Invoicing

### Step 5.1: Create Invoice Tables

**SQL Migration**:

```sql
-- Migration: create_invoice_tables
-- Description: Create tables for invoice management

-- Main invoice table
CREATE TABLE IF NOT EXISTS invoice_invoice (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  company_id UUID REFERENCES company_company(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN ('payroll', 'service', 'contractor')),
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  subtotal NUMERIC(15,2) NOT NULL,
  tax_amount NUMERIC(15,2) DEFAULT 0,
  total_amount NUMERIC(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
    'draft', 'sent', 'viewed', 'approved', 'paid', 'overdue', 'cancelled'
  )),
  due_date DATE,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  paid_date DATE,
  payment_reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice line items
CREATE TABLE IF NOT EXISTS invoice_lineitem (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  invoice_id UUID REFERENCES invoice_invoice(id) ON DELETE CASCADE,
  description VARCHAR(500) NOT NULL,
  employee_id UUID REFERENCES employee_employee(id),
  contractor_id UUID REFERENCES contractor_contractor(id),
  quantity NUMERIC(10,2) DEFAULT 1,
  unit_price NUMERIC(15,2) NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_invoice_company ON invoice_invoice(company_id);
CREATE INDEX idx_invoice_status ON invoice_invoice(status);
CREATE INDEX idx_invoice_date ON invoice_invoice(billing_period_start, billing_period_end);
CREATE INDEX idx_lineitem_invoice ON invoice_lineitem(invoice_id);

-- Enable RLS
ALTER TABLE invoice_invoice ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lineitem ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Superadmins can manage invoices"
  ON invoice_invoice FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users_user
      WHERE users_user.id = auth.uid()
      AND users_user.user_type = 'superadmin'
    )
  );

CREATE POLICY "Employers can view their invoices"
  ON invoice_invoice FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM company_employer
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Superadmins can manage line items"
  ON invoice_lineitem FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users_user
      WHERE users_user.id = auth.uid()
      AND users_user.user_type = 'superadmin'
    )
  );
```

---

## Phase 6: Services Management

### Step 6.1: Create Equipment Tables

**SQL Migration**:

```sql
-- Migration: create_asset_tables
-- Description: Create tables for equipment/asset tracking

CREATE TABLE IF NOT EXISTS asset_equipment (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  equipment_code VARCHAR(50) UNIQUE NOT NULL,
  equipment_type VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  serial_number VARCHAR(100),
  purchase_date DATE,
  purchase_price NUMERIC(15,2),
  current_value NUMERIC(15,2),
  condition VARCHAR(20) DEFAULT 'new' CHECK (condition IN ('new', 'good', 'fair', 'poor', 'disposed')),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'maintenance', 'disposed')),
  assigned_to_employee_id UUID REFERENCES employee_employee(id),
  assigned_to_contractor_id UUID REFERENCES contractor_contractor(id),
  assigned_at TIMESTAMPTZ,
  company_id UUID REFERENCES company_company(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asset_equipmenthistory (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  equipment_id UUID REFERENCES asset_equipment(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  from_employee_id UUID REFERENCES employee_employee(id),
  to_employee_id UUID REFERENCES employee_employee(id),
  from_company_id UUID REFERENCES company_company(id),
  to_company_id UUID REFERENCES company_company(id),
  notes TEXT,
  created_by_id UUID REFERENCES users_user(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_equipment_status ON asset_equipment(status);
CREATE INDEX idx_equipment_type ON asset_equipment(equipment_type);
CREATE INDEX idx_equipment_company ON asset_equipment(company_id);
CREATE INDEX idx_equipmenthistory_equipment ON asset_equipmenthistory(equipment_id);

-- Enable RLS
ALTER TABLE asset_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_equipmenthistory ENABLE ROW LEVEL SECURITY;
```

---

## Phase 7: Reports & Audit Logs

### Step 7.1: Create Audit Log Table

**SQL Migration**:

```sql
-- Migration: create_audit_log
-- Description: Create table for system audit logging

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID REFERENCES users_user(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only superadmins can read audit logs
CREATE POLICY "Superadmins can read audit logs"
  ON audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users_user
      WHERE users_user.id = auth.uid()
      AND users_user.user_type = 'superadmin'
    )
  );

-- Function to automatically log changes
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Phase 8: Settings

### Step 8.1: Platform Settings

Create a settings page for platform-wide configuration stored in a simple key-value table or JSON column.

---

## Implementation Checklist

Use this checklist to track progress:

### Phase 1: Authentication & Layout
- [ ] Apply migration to add superadmin user type
- [ ] Create superadmin user in database
- [ ] Create `src/app/superadmin/layout.tsx`
- [ ] Create `src/app/superadmin/page.tsx`
- [ ] Create `src/app/superadmin/not-found.tsx`
- [ ] Test layout renders correctly

### Phase 2: Dashboard & Companies
- [ ] Create `src/lib/services/superadmin.service.ts`
- [ ] Create `src/lib/hooks/use-superadmin.ts`
- [ ] Create `src/app/superadmin/dashboard/page.tsx`
- [ ] Create `src/app/superadmin/clients/page.tsx`
- [ ] Create `src/app/superadmin/clients/[id]/page.tsx`
- [ ] Test dashboard shows real stats

### Phase 3: Team & Access Control
- [ ] Apply migration to create `superadmin_teammember` table
- [ ] Create team service methods
- [ ] Create `src/app/superadmin/team/page.tsx`
- [ ] Create `src/app/superadmin/team/[id]/page.tsx`
- [ ] Test team CRUD operations

### Phase 4: Requests Management
- [ ] Apply migration to create `request_specialrequest` table
- [ ] Create `src/lib/services/requests.service.ts`
- [ ] Create `src/lib/hooks/use-requests.ts`
- [ ] Create `src/app/superadmin/requests/page.tsx`
- [ ] Create `src/app/superadmin/requests/[id]/page.tsx`
- [ ] Test request status updates

### Phase 5: Invoicing
- [ ] Apply migration to create invoice tables
- [ ] Create `src/lib/services/invoices.service.ts`
- [ ] Create `src/lib/hooks/use-invoices.ts`
- [ ] Create `src/app/superadmin/invoices/page.tsx`
- [ ] Create `src/app/superadmin/invoices/[id]/page.tsx`
- [ ] Test invoice generation

### Phase 6: Services Management
- [ ] Apply migration to create asset tables
- [ ] Create `src/lib/services/equipment.service.ts`
- [ ] Create `src/app/superadmin/services/page.tsx`
- [ ] Create `src/app/superadmin/services/equipment/page.tsx`
- [ ] Create remaining service pages (insurance, bgv, gifts, office-space)

### Phase 7: Reports & Audit Logs
- [ ] Apply migration to create audit_log table
- [ ] Create `src/lib/services/audit.service.ts`
- [ ] Create `src/app/superadmin/reports/page.tsx`
- [ ] Create `src/app/superadmin/audit-logs/page.tsx`
- [ ] Add audit triggers to key tables

### Phase 8: Settings
- [ ] Create `src/app/superadmin/settings/page.tsx`
- [ ] Add platform configuration options
- [ ] Test settings persistence

---

## Notes for Implementation

1. **Follow existing patterns**: Look at `src/lib/services/employees.service.ts` and `src/lib/hooks/use-employees.ts` for reference.

2. **Use Supabase MCP for migrations**: Apply SQL migrations using the Supabase MCP `apply_migration` tool.

3. **Match existing UI**: Use the same Tailwind classes and color scheme as the employer dashboard.

4. **Test incrementally**: After each phase, verify the feature works before moving on.

5. **Handle loading states**: Always show a loading spinner while data is being fetched.

6. **Error handling**: Wrap service calls in try/catch and show user-friendly error messages.
