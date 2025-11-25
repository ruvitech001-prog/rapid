/**
 * Mock Roles Data Generator
 * Generates default role configurations for companies
 */

export interface Role {
  id: string
  company_id: string
  name: string
  description: string
  permissions: string[]
  user_count: number
  created_at: string
  updated_at: string
}

export function generateMockRoles(company_id: string): Role[] {
  return [
    {
      id: 'role-001',
      company_id,
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: [
        'users_view', 'users_create', 'users_edit', 'users_delete',
        'roles_view', 'roles_create', 'roles_edit', 'roles_delete',
        'teams_view', 'teams_create', 'teams_edit', 'teams_delete',
        'payroll_view', 'payroll_edit',
        'reports_view', 'reports_export',
      ],
      user_count: 2,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 'role-002',
      company_id,
      name: 'Manager',
      description: 'Can manage teams, view payroll, and manage users',
      permissions: [
        'users_view', 'users_edit',
        'teams_view', 'teams_edit',
        'payroll_view',
        'reports_view', 'reports_export',
      ],
      user_count: 5,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 'role-003',
      company_id,
      name: 'User',
      description: 'Basic access to view information',
      permissions: [
        'users_view',
        'teams_view',
        'reports_view',
      ],
      user_count: 12,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ]
}
