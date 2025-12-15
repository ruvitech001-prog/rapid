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

// Payroll service
export { payrollService } from './payroll.service'
export type {
  PayslipData,
  PayrollSummary,
  EmployeePayrollHistory,
  EmployeePayrollData,
  PayrollRun,
} from './payroll.service'

// Attendance service
export { attendanceService } from './attendance.service'
export type { AttendanceStats, DailyAttendance, AttendanceRecord } from './attendance.service'

// Notifications service
export { notificationsService } from './notifications.service'
export type { Notification } from './notifications.service'

// Invoices service
export { invoicesService } from './invoices.service'
export type {
  ContractorInvoice,
  ContractorInvoiceWithCompany,
  InvoiceWithContractor,
  InvoiceFilters,
  InvoiceSummary,
} from './invoices.service'

// SuperAdmin services
export { superadminRequestsService } from './superadmin-requests.service'
export { superadminTeamService } from './superadmin-team.service'
export { superadminDashboardService } from './superadmin-dashboard.service'
export { superadminAuditService } from './superadmin-audit.service'
export type {
  AuditAction,
  EntityType,
  AuditLogEntry,
  AuditLogFilters,
  PaginatedAuditLogs,
} from './superadmin-audit.service'

// Clients service (SuperAdmin)
export { clientsService } from './clients.service'
export type {
  ClientDetails,
  ClientFilters,
  UpdateClientInput,
  CreateClientInput,
} from './clients.service'

// Documents service
export { documentsService } from './documents.service'
export type {
  Document,
  DocumentWithDetails,
  DocumentUploadInput,
  ESignatureResult,
} from './documents.service'

// Timesheets service
export { timesheetsService } from './timesheets.service'
export type {
  Timesheet,
  TimesheetWithDetails,
  TimesheetFilters,
} from './timesheets.service'

// Tax service
export { taxService } from './tax.service'
export type {
  InvestmentDeclaration,
  TaxSummary,
  Form16Data,
  TaxDeclarationDeadline,
  Form16Availability,
  TaxProof,
} from './tax.service'

// Profile service
export { profileService } from './profile.service'
export type {
  EmployeeProfile,
  ContractorProfile,
  Address,
  BankAccount,
  EmergencyContact,
} from './profile.service'

// Settings service
export { settingsService } from './settings.service'
export type { SystemSettings } from './settings.service'

// User preferences service
export { userPreferencesService } from './user-preferences.service'
export type {
  UserPreferences,
  NotificationPreferences,
  UpdateUserPreferencesInput,
} from './user-preferences.service'

// Auth service
export { authService } from './auth.service'

// Employer requests service
export { employerRequestsService } from './employer-requests.service'
export type {
  EmployerRequest,
  EmployerRequestFilters,
  EmployerRequestCounts,
} from './employer-requests.service'

// Employee assets service
export { employeeAssetsService } from './employee-assets.service'
export type {
  EmployeeAsset,
  AssetType,
  AssetStatus,
  AssetConfirmationInput,
  PendingAssetSummary,
} from './employee-assets.service'

// Teams service
export { teamsService } from './teams.service'
export type {
  Team,
  TeamMember,
  CreateTeamInput,
  UpdateTeamInput,
  AssignTeamMemberInput,
} from './teams.service'

// Third-party integration services

// Springverify (eKYC/BGV)
export { springverifyService } from './springverify.service'
export type {
  SpringverifyCandidate,
  SpringverifyVerification,
  SpringverifyStatus,
  SpringverifyWebhookPayload,
  SpringverifyCheckType,
} from './springverify.service'

// Zoho Sign (E-Signatures)
export { zohoSignService } from './zoho-sign.service'
export type {
  ZohoSignRequest,
  ZohoWebhookPayload,
} from './zoho-sign.service'

// Plum (Health Insurance)
export { plumService } from './plum.service'
export type {
  PlumInsurancePlan,
  PlumMember,
  PlumDependent,
  PlumPolicy,
  PlumWebhookPayload,
  EnrollMemberInput,
  AddDependentInput,
} from './plum.service'

// Keka (HRMS/Payroll)
export { kekaService } from './keka.service'
export type {
  KekaEmployee,
  KekaCreateEmployeeInput,
  KekaSalaryComponent,
  KekaSalary,
  KekaLeaveType,
  KekaLeaveBalance,
  KekaLeaveRequest,
  KekaCreateLeaveRequestInput,
  KekaWebhookPayload,
} from './keka.service'
