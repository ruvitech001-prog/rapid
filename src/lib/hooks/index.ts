// Employee hooks
export { useEmployees, useEmployee, useEmployeeCount } from './use-employees'

// Contractor hooks
export {
  useContractors,
  useContractor,
  useContractorCount,
} from './use-contractors'

// Leave hooks
export {
  useLeaveRequests,
  useLeaveBalances,
  usePendingLeaveCount,
  useApproveLeave,
  useRejectLeave,
  useEmployeeLeaveRequests,
  useCreateLeaveRequest,
} from './use-leaves'

// Expense hooks
export {
  useExpenseRequests,
  usePendingExpenseCount,
  useApproveExpense,
  useRejectExpense,
  useEmployeeExpenses,
  useCreateExpenseClaim,
} from './use-expenses'

// Dashboard hooks
export { useEmployerDashboard, useEmployeeDashboard } from './use-dashboard'

// Contracts hooks
export {
  useEmployeeContracts,
  useContractorContracts,
  useEmployeeContract,
  useContractorContract,
  useContractStats,
} from './use-contracts'

// SuperAdmin hooks
export {
  useSuperAdminRequests,
  useSuperAdminRequest,
  useSuperAdminRequestCounts,
  useApproveRequest,
  useRejectRequest,
  useAssignRequest,
} from './use-superadmin-requests'

export {
  useSuperAdminTeam,
  useSuperAdminTeamMember,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  useAssignClients,
} from './use-superadmin-team'

export {
  useSuperAdminDashboard,
  useSuperAdminCompanies,
} from './use-superadmin-dashboard'
