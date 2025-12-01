export const queryKeys = {
  employees: {
    all: ['employees'] as const,
    list: (companyId: string) =>
      [...queryKeys.employees.all, 'list', companyId] as const,
    byCompany: (companyId: string) =>
      [...queryKeys.employees.all, 'list', companyId] as const,
    detail: (id: string) =>
      [...queryKeys.employees.all, 'detail', id] as const,
    count: (companyId: string) =>
      [...queryKeys.employees.all, 'count', companyId] as const,
  },
  contractors: {
    all: ['contractors'] as const,
    list: (companyId: string) =>
      [...queryKeys.contractors.all, 'list', companyId] as const,
    byCompany: (companyId: string) =>
      [...queryKeys.contractors.all, 'list', companyId] as const,
    detail: (id: string) =>
      [...queryKeys.contractors.all, 'detail', id] as const,
    count: (companyId: string) =>
      [...queryKeys.contractors.all, 'count', companyId] as const,
  },
  contracts: {
    all: ['contracts'] as const,
    employees: (companyId: string) =>
      [...queryKeys.contracts.all, 'employees', companyId] as const,
    contractors: (companyId: string) =>
      [...queryKeys.contracts.all, 'contractors', companyId] as const,
    employeeDetail: (contractId: string) =>
      [...queryKeys.contracts.all, 'employee', contractId] as const,
    contractorDetail: (contractId: string) =>
      [...queryKeys.contracts.all, 'contractor', contractId] as const,
    stats: (companyId: string) =>
      [...queryKeys.contracts.all, 'stats', companyId] as const,
  },
  leaves: {
    all: ['leaves'] as const,
    requests: (companyId: string, filters?: { status?: string }) =>
      [...queryKeys.leaves.all, 'requests', companyId, filters] as const,
    balances: (employeeId: string) =>
      [...queryKeys.leaves.all, 'balances', employeeId] as const,
    pendingCount: (companyId: string) =>
      [...queryKeys.leaves.all, 'pendingCount', companyId] as const,
  },
  expenses: {
    all: ['expenses'] as const,
    requests: (companyId: string, filters?: { status?: string }) =>
      [...queryKeys.expenses.all, 'requests', companyId, filters] as const,
    pendingCount: (companyId: string) =>
      [...queryKeys.expenses.all, 'pendingCount', companyId] as const,
  },
  dashboard: {
    employer: (companyId: string) =>
      ['dashboard', 'employer', companyId] as const,
    employee: (employeeId: string) =>
      ['dashboard', 'employee', employeeId] as const,
  },
  companies: {
    all: ['companies'] as const,
    list: () => [...queryKeys.companies.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.companies.all, 'detail', id] as const,
  },
  superadmin: {
    all: ['superadmin'] as const,
    requests: {
      all: ['superadmin', 'requests'] as const,
      list: (filters?: Record<string, unknown>) =>
        ['superadmin', 'requests', 'list', filters] as const,
      detail: (id: string) =>
        ['superadmin', 'requests', 'detail', id] as const,
      counts: () => ['superadmin', 'requests', 'counts'] as const,
    },
    team: {
      all: ['superadmin', 'team'] as const,
      list: () => ['superadmin', 'team', 'list'] as const,
      detail: (id: string) =>
        ['superadmin', 'team', 'detail', id] as const,
    },
    dashboard: () => ['superadmin', 'dashboard'] as const,
    companies: {
      all: ['superadmin', 'companies'] as const,
      list: () => ['superadmin', 'companies', 'list'] as const,
      detail: (id: string) =>
        ['superadmin', 'companies', 'detail', id] as const,
    },
  },
}
