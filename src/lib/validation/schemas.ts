import { z } from 'zod'

// =============================================
// COMMON SCHEMAS
// =============================================

export const uuidSchema = z.string().uuid('Invalid UUID format')

export const dateSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  { message: 'Invalid date format' }
)

export const positiveNumberSchema = z.number().positive('Value must be positive')

export const nonNegativeNumberSchema = z.number().min(0, 'Value cannot be negative')

// =============================================
// LEAVE REQUEST SCHEMAS
// =============================================

export const createLeaveRequestSchema = z.object({
  employee_id: uuidSchema,
  leave_type_id: uuidSchema,
  start_date: dateSchema,
  end_date: dateSchema,
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
  is_half_day: z.boolean().optional().default(false),
  half_day_type: z.enum(['first_half', 'second_half']).optional(),
}).refine(
  (data) => new Date(data.end_date) >= new Date(data.start_date),
  { message: 'End date must be on or after start date', path: ['end_date'] }
).refine(
  (data) => !data.is_half_day || data.half_day_type,
  { message: 'Half day type is required when is_half_day is true', path: ['half_day_type'] }
)

export const approveLeaveRequestSchema = z.object({
  request_id: uuidSchema,
  approved_by: uuidSchema,
  comments: z.string().max(500).optional(),
})

export const rejectLeaveRequestSchema = z.object({
  request_id: uuidSchema,
  rejected_by: uuidSchema,
  rejection_reason: z.string().min(1, 'Rejection reason is required').max(500),
})

export type CreateLeaveRequest = z.infer<typeof createLeaveRequestSchema>
export type ApproveLeaveRequest = z.infer<typeof approveLeaveRequestSchema>
export type RejectLeaveRequest = z.infer<typeof rejectLeaveRequestSchema>

// =============================================
// EXPENSE CLAIM SCHEMAS
// =============================================

export const createExpenseClaimSchema = z.object({
  employee_id: uuidSchema,
  category: z.string().min(1, 'Category is required'),
  amount: positiveNumberSchema,
  currency: z.string().default('INR'),
  expense_date: dateSchema,
  description: z.string().min(1, 'Description is required').max(1000),
  receipt_url: z.string().url('Invalid receipt URL').optional(),
  merchant_name: z.string().max(200).optional(),
})

export const approveExpenseClaimSchema = z.object({
  claim_id: uuidSchema,
  approved_by: uuidSchema,
  approved_amount: positiveNumberSchema.optional(),
  comments: z.string().max(500).optional(),
})

export const rejectExpenseClaimSchema = z.object({
  claim_id: uuidSchema,
  rejected_by: uuidSchema,
  rejection_reason: z.string().min(1, 'Rejection reason is required').max(500),
})

export type CreateExpenseClaim = z.infer<typeof createExpenseClaimSchema>
export type ApproveExpenseClaim = z.infer<typeof approveExpenseClaimSchema>
export type RejectExpenseClaim = z.infer<typeof rejectExpenseClaimSchema>

// =============================================
// INVOICE SCHEMAS
// =============================================

export const createInvoiceSchema = z.object({
  company_id: uuidSchema,
  contractor_id: uuidSchema.optional(),
  invoice_number: z.string().min(1, 'Invoice number is required'),
  billing_period_start: dateSchema,
  billing_period_end: dateSchema,
  subtotal: nonNegativeNumberSchema,
  tax_amount: nonNegativeNumberSchema.default(0),
  total_amount: nonNegativeNumberSchema,
  due_date: dateSchema,
  notes: z.string().max(1000).optional(),
}).refine(
  (data) => new Date(data.billing_period_end) >= new Date(data.billing_period_start),
  { message: 'Billing period end must be on or after start', path: ['billing_period_end'] }
).refine(
  (data) => new Date(data.due_date) >= new Date(data.billing_period_end),
  { message: 'Due date must be on or after billing period end', path: ['due_date'] }
)

export type CreateInvoice = z.infer<typeof createInvoiceSchema>

// =============================================
// TIMESHEET SCHEMAS
// =============================================

export const timesheetEntrySchema = z.object({
  date: dateSchema,
  hours: z.number().min(0, 'Hours cannot be negative').max(24, 'Hours cannot exceed 24'),
  description: z.string().max(500).optional(),
  project_id: uuidSchema.optional(),
  task_type: z.string().max(100).optional(),
})

export const saveTimesheetSchema = z.object({
  contractor_id: uuidSchema,
  week_start: dateSchema,
  entries: z.array(timesheetEntrySchema).min(1, 'At least one entry is required'),
  total_hours: z.number().min(0).max(168, 'Total hours cannot exceed 168 per week'),
})

export const submitTimesheetSchema = z.object({
  timesheet_id: uuidSchema,
  submitted_by: uuidSchema,
})

export type TimesheetEntry = z.infer<typeof timesheetEntrySchema>
export type SaveTimesheet = z.infer<typeof saveTimesheetSchema>
export type SubmitTimesheet = z.infer<typeof submitTimesheetSchema>

// =============================================
// ATTENDANCE SCHEMAS
// =============================================

export const clockInSchema = z.object({
  employee_id: uuidSchema,
  company_id: uuidSchema,
  clock_in_location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  work_type: z.enum(['office', 'wfh', 'field', 'hybrid']).default('office'),
  notes: z.string().max(500).optional(),
})

export const clockOutSchema = z.object({
  attendance_id: uuidSchema,
  clock_out_location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  notes: z.string().max(500).optional(),
})

export type ClockIn = z.infer<typeof clockInSchema>
export type ClockOut = z.infer<typeof clockOutSchema>

// =============================================
// PAYROLL SCHEMAS
// =============================================

export const processPayrollSchema = z.object({
  company_id: uuidSchema,
  pay_period_month: z.number().min(1).max(12),
  pay_period_year: z.number().min(2020).max(2100),
  employee_ids: z.array(uuidSchema).min(1, 'At least one employee is required'),
  processed_by: uuidSchema,
  notes: z.string().max(1000).optional(),
})

export type ProcessPayroll = z.infer<typeof processPayrollSchema>

// =============================================
// VALIDATION HELPER FUNCTIONS
// =============================================

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    throw new Error(`Validation failed: ${errors}`)
  }
  return result.data
}

export function validateSafe<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    return { success: false, error: errors }
  }
  return { success: true, data: result.data }
}
