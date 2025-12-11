import { z } from 'zod'

// =============================================
// COMMON SCHEMAS
// =============================================

export const uuidSchema = z.string().uuid('Invalid UUID format')

export const positiveNumberSchema = z.number().positive('Must be a positive number')

export const nonNegativeNumberSchema = z.number().nonnegative('Cannot be negative')

export const dateStringSchema = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  { message: 'Invalid date format' }
)

// =============================================
// LEAVE REQUEST SCHEMAS
// =============================================

export const leaveTypeSchema = z.enum([
  'casual',
  'sick',
  'earned',
  'unpaid',
  'maternity',
  'paternity',
  'bereavement',
  'compensatory',
], { errorMap: () => ({ message: 'Invalid leave type' }) })

export const halfDayPeriodSchema = z.enum(['first_half', 'second_half'])

export const createLeaveRequestSchema = z.object({
  employeeId: uuidSchema,
  leaveType: z.string().min(1, 'Leave type is required'),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason must be less than 500 characters'),
  isHalfDay: z.boolean().optional().default(false),
  halfDayPeriod: halfDayPeriodSchema.optional(),
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  { message: 'Start date must be before or equal to end date', path: ['endDate'] }
).refine(
  (data) => !data.isHalfDay || data.halfDayPeriod !== undefined,
  { message: 'Half day period is required when is_half_day is true', path: ['halfDayPeriod'] }
)

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>

// =============================================
// EXPENSE CLAIM SCHEMAS
// =============================================

export const expenseCategorySchema = z.enum([
  'travel',
  'food',
  'accommodation',
  'communication',
  'office_supplies',
  'medical',
  'training',
  'other',
])

export const createExpenseClaimSchema = z.object({
  employeeId: uuidSchema,
  category: z.string().min(1, 'Category is required'),
  amount: positiveNumberSchema.refine(
    (val) => val <= 1000000,
    { message: 'Amount cannot exceed 10,00,000' }
  ),
  description: z.string().min(5, 'Description must be at least 5 characters').max(500, 'Description too long'),
  expenseDate: dateStringSchema,
  receiptUrl: z.string().url('Invalid receipt URL').optional().nullable(),
  billNumber: z.string().optional().nullable(),
}).refine(
  (data) => new Date(data.expenseDate) <= new Date(),
  { message: 'Expense date cannot be in the future', path: ['expenseDate'] }
)

export type CreateExpenseClaimInput = z.infer<typeof createExpenseClaimSchema>

// =============================================
// INVOICE SCHEMAS
// =============================================

export const invoiceStatusSchema = z.enum([
  'draft',
  'pending',
  'approved',
  'paid',
  'rejected',
  'cancelled',
])

export const createInvoiceSchema = z.object({
  contractorId: uuidSchema,
  companyId: uuidSchema,
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  billingPeriodStart: dateStringSchema,
  billingPeriodEnd: dateStringSchema,
  amount: positiveNumberSchema,
  taxAmount: nonNegativeNumberSchema.optional().default(0),
  totalAmount: positiveNumberSchema,
  description: z.string().optional(),
  dueDate: dateStringSchema.optional(),
}).refine(
  (data) => new Date(data.billingPeriodStart) <= new Date(data.billingPeriodEnd),
  { message: 'Billing period start must be before end', path: ['billingPeriodEnd'] }
).refine(
  (data) => data.totalAmount >= data.amount,
  { message: 'Total amount must be greater than or equal to base amount', path: ['totalAmount'] }
)

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>

// =============================================
// TIMESHEET SCHEMAS
// =============================================

export const timesheetEntrySchema = z.object({
  date: dateStringSchema,
  hours: z.number().min(0, 'Hours cannot be negative').max(24, 'Hours cannot exceed 24'),
  description: z.string().optional(),
  projectCode: z.string().optional(),
})

export const saveTimesheetSchema = z.object({
  contractorId: uuidSchema,
  companyId: uuidSchema,
  weekStartDate: dateStringSchema,
  weekEndDate: dateStringSchema,
  entries: z.array(timesheetEntrySchema).min(1, 'At least one entry is required'),
  totalHours: nonNegativeNumberSchema.max(168, 'Total hours cannot exceed 168 per week'),
  notes: z.string().max(1000, 'Notes too long').optional(),
}).refine(
  (data) => new Date(data.weekStartDate) < new Date(data.weekEndDate),
  { message: 'Week start must be before week end', path: ['weekEndDate'] }
).refine(
  (data) => {
    const calculatedTotal = data.entries.reduce((sum, e) => sum + e.hours, 0)
    return Math.abs(calculatedTotal - data.totalHours) < 0.01
  },
  { message: 'Total hours must match sum of entries', path: ['totalHours'] }
)

export type SaveTimesheetInput = z.infer<typeof saveTimesheetSchema>

// =============================================
// ATTENDANCE SCHEMAS
// =============================================

export const clockInSchema = z.object({
  employeeId: uuidSchema,
  companyId: uuidSchema,
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  workType: z.enum(['office', 'wfh', 'field', 'hybrid']).optional().default('office'),
  notes: z.string().max(500).optional(),
})

export type ClockInInput = z.infer<typeof clockInSchema>

export const clockOutSchema = z.object({
  attendanceId: uuidSchema,
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  notes: z.string().max(500).optional(),
})

export type ClockOutInput = z.infer<typeof clockOutSchema>

// =============================================
// PAYROLL SCHEMAS
// =============================================

export const processPayrollSchema = z.object({
  companyId: uuidSchema,
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
  employeeIds: z.array(uuidSchema).optional(),
  notes: z.string().max(1000).optional(),
})

export type ProcessPayrollInput = z.infer<typeof processPayrollSchema>

// =============================================
// VALIDATION HELPERS
// =============================================

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    throw new ValidationError(errors, result.error.errors)
  }
  return result.data
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: z.ZodIssue[]
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}
