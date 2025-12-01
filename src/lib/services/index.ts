export { employeesService } from './employees.service'
export type {
  Employee,
  EmployeeContract,
  EmployeeWithContract,
  EmployeeListItem,
} from './employees.service'

export { contractorsService } from './contractors.service'
export type {
  Contractor,
  ContractorContract,
  ContractorWithContract,
  ContractorListItem,
} from './contractors.service'

export { leavesService } from './leaves.service'
export type {
  LeaveRequest,
  LeaveBalance,
  LeaveRequestWithEmployee,
  LeaveRequestFilters,
} from './leaves.service'

export { expensesService } from './expenses.service'
export type {
  ExpenseClaim,
  ExpenseClaimWithEmployee,
  ExpenseRequestFilters,
} from './expenses.service'

export { dashboardService } from './dashboard.service'
export type {
  EmployerDashboardStats,
  EmployeeDashboardStats,
} from './dashboard.service'

export { contractsService } from './contracts.service'
export type {
  EmployeeContract as EmployeeContractDB,
  ContractorContract as ContractorContractDB,
  EmployeeContractWithDetails,
  ContractorContractWithDetails,
} from './contracts.service'

export { ServiceError } from './base.service'

// SuperAdmin services
export { superadminRequestsService } from './superadmin-requests.service'
export { superadminTeamService } from './superadmin-team.service'
export { superadminDashboardService } from './superadmin-dashboard.service'
