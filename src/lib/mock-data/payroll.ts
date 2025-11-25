/**
 * Mock Payroll Data Generator
 */

import {
  generateId,
  PAYMENT_STATUSES,
  formatDate,
  subtractDays,
  getRandomElement,
  getRandomNumber,
} from "./utils"

export interface MockPayrollRun {
  id: string
  company_id: string
  month: number
  year: number
  status: string
  total_gross: number
  total_deductions: number
  total_net: number
  processed_at: string | null
  created_at: string
}

export function generateMockPayrollRuns(
  count: number = 12,
  company_id: string = "",
): MockPayrollRun[] {
  const runs: MockPayrollRun[] = []
  const currentDate = new Date()

  for (let i = 0; i < count; i++) {
    const monthsAgo = i
    const runDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsAgo, 1)
    const status = getRandomElement(["draft", "processing", "completed"])

    runs.push({
      id: generateId(),
      company_id: company_id || generateId(),
      month: runDate.getMonth() + 1,
      year: runDate.getFullYear(),
      status,
      total_gross: getRandomNumber(5000000, 10000000),
      total_deductions: getRandomNumber(1000000, 2000000),
      total_net: getRandomNumber(3000000, 8000000),
      processed_at: status !== "draft" ? formatDate(new Date()) : null,
      created_at: formatDate(runDate),
    })
  }

  return runs
}

export interface MockPayslip {
  id: string
  employee_id: string
  payroll_run_id: string
  month: number
  year: number
  gross_salary: number
  deductions: number
  net_salary: number
  components: Record<string, number>
  status: "provisional" | "final"
  created_at: string
}

export function generateMockPayslips(
  count: number = 25,
  employee_ids: string[] = [],
  payroll_run_ids: string[] = [],
): MockPayslip[] {
  const payslips: MockPayslip[] = []
  const currentDate = new Date()

  employee_ids.forEach((employee_id) => {
    for (let i = 0; i < 12; i++) {
      const monthsAgo = i
      const payslipDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsAgo, 1)

      const grossSalary = getRandomNumber(500000, 1500000)
      const deductions = grossSalary * 0.2
      const netSalary = grossSalary - deductions

      payslips.push({
        id: generateId(),
        employee_id,
        payroll_run_id: payroll_run_ids[i % payroll_run_ids.length] || generateId(),
        month: payslipDate.getMonth() + 1,
        year: payslipDate.getFullYear(),
        gross_salary: grossSalary,
        deductions,
        net_salary: netSalary,
        components: {
          basic_salary: grossSalary * 0.4,
          hra: grossSalary * 0.15,
          dearness_allowance: grossSalary * 0.1,
          conveyance_allowance: grossSalary * 0.05,
          special_allowance: grossSalary * 0.2,
          performance_bonus: grossSalary * 0.1,
        },
        status: i > 2 ? "final" : "provisional",
        created_at: formatDate(payslipDate),
      })
    }
  })

  return payslips.slice(0, count)
}
