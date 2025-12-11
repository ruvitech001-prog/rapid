// Employee hooks
export {
  useEmployees,
  useEmployee,
  useEmployeeCount,
  useUpdateEmployee,
  useDeactivateEmployee,
} from './use-employees'

// Contractor hooks
export {
  useContractors,
  useContractor,
  useContractorCount,
  useUpdateContractor,
  useDeactivateContractor,
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

// Payroll hooks
export {
  useEmployeePayrollHistory,
  useCurrentPayslip,
  useCompanyPayrollSummary,
  useTotalPayrollCost,
  useEmployeesForPayroll,
  useProcessPayroll,
  usePayrollRuns,
} from './use-payroll'
export type { EmployeePayrollData, PayrollRun } from './use-payroll'

// Attendance hooks
export {
  useAttendanceStats,
  useCompanyAttendanceStats,
  useMonthlyAttendanceCalendar,
  useTodayAttendance,
  useAttendanceHistory,
  useClockIn,
  useClockOut,
} from './use-attendance'

// Notifications hooks
export {
  useEmployeeNotifications,
  useEmployerNotifications,
  useUnreadNotificationCount,
} from './use-notifications'

// Invoice hooks
export {
  useCompanyInvoices,
  usePendingInvoices,
  useRecentlyPaidInvoices,
  useInvoiceSummary,
  useCostOverview,
  usePayInvoice,
  useApproveInvoice,
  useRejectInvoice,
  useContractorInvoices,
  useCreateInvoice,
} from './use-invoices'

// Contracts hooks
export {
  useEmployeeContracts,
  useContractorContracts,
  useEmployeeContract,
  useContractorContract,
  useContractStats,
  useContractorOwnContracts,
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
  useSuperAdminWorkforce,
} from './use-superadmin-dashboard'
export type { WorkforceFilters } from './use-superadmin-dashboard'

export {
  useSuperAdminAuditLogs,
  useEntityAuditHistory,
} from './use-superadmin-audit'

export {
  useSuperAdminInvoices,
  useSuperAdminInvoiceStats,
} from './use-superadmin-invoices'

export {
  useSuperAdminPayrollRuns,
  useSuperAdminUpcomingPayroll,
  useSuperAdminPayrollStats,
} from './use-superadmin-payroll'

export {
  useSuperAdminLeaves,
  useSuperAdminLeaveStats,
} from './use-superadmin-leaves'

// Document hooks
export {
  useEmployeeDocuments,
  useContractorDocuments,
  useCompanyDocuments,
  useDocumentsByCategory,
  useDocumentsByType,
  useVerifiedDocumentsCount,
  useDocument,
  usePendingSignatureDocuments,
  useSignedDocuments,
  useUploadEmployeeDocument,
  useUploadContractorDocument,
  useDeleteDocument,
  useSignDocument,
} from './use-documents'

// Timesheet hooks
export {
  useContractorTimesheets,
  useCompanyTimesheets,
  useTimesheet,
  usePendingTimesheetCount,
  useSubmitTimesheet,
  useApproveTimesheet,
  useRejectTimesheet,
  useSaveTimesheet,
} from './use-timesheets'

// Tax hooks
export {
  useInvestmentDeclaration,
  useDeclarationHistory,
  useForm16,
  useTaxSummary,
  useSaveDeclaration,
  useSubmitDeclaration,
  useTaxDeclarationStatus,
  useForm16Availability,
  useTaxProofs,
  useUploadTaxProof,
  useDeleteTaxProof,
  useDownloadForm16,
} from './use-tax'

// Profile hooks
export {
  useEmployeeProfile,
  useContractorProfile,
  useUpdateEmployeeInfo,
  useUpdateContractorInfo,
  useSaveAddress,
  useAddBankAccount,
  useUpdateBankAccount,
  useAddEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
} from './use-profile'

// Settings hooks
export { useSettings, useSaveSettings } from './use-settings'

// User preferences hooks
export { useUserPreferences, useUpdateUserPreferences } from './use-user-preferences'
export type { UserPreferences, UpdateUserPreferencesInput } from './use-user-preferences'

// Clients hooks (SuperAdmin)
export {
  useClients,
  useClient,
  useCreateClient,
  useUpdateClient,
  useDeactivateClient,
  useReactivateClient,
} from './use-clients'
export type { ClientDetails, ClientFilters, UpdateClientInput, CreateClientInput } from './use-clients'

// Permission hooks
export { usePermissions, PermissionGate } from './use-permissions'
export type { Permission, SuperAdminRole } from '../permissions'

// Auth action hooks
export { useChangePassword } from './use-auth-actions'

// Employer requests hooks
export {
  useEmployerRequests,
  useEmployerRequestCounts,
  useApproveEmployerRequest,
  useRejectEmployerRequest,
  useWithdrawEmployerRequest,
} from './use-employer-requests'
export type {
  EmployerRequest,
  EmployerRequestFilters,
  EmployerRequestCounts,
} from './use-employer-requests'

// Employee assets hooks
export {
  useEmployeeAssets,
  usePendingAssetConfirmations,
  useAssetDetail,
  useConfirmAssetReceipt,
} from './use-employee-assets'

// Enhanced Employer Dashboard hooks
export {
  useTeamHeadcount,
  useProbationEnding,
  useUpcomingCelebrations,
  useJoiningThisMonth,
  useCompanySetupStatus,
  useCostOverviewPeriod,
} from './use-employer-dashboard'

// Teams hooks
export {
  useCompanyTeams,
  useTeam,
  useTeamMembers,
  useEmployeeTeam,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
  useAssignEmployeeToTeam,
  useRemoveEmployeeFromTeam,
  useUpdateTeamMembership,
} from './use-teams'
