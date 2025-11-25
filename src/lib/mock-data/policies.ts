/**
 * Mock Policies Data
 */

export interface PolicyConfig {
  id: string
  company_id: string
  policy_name: string
  leave_policies: {
    annual_leave: number
    sick_leave: number
    casual_leave: number
    maternity_leave: number
    carry_forward: boolean
    encashment: boolean
  }
  expense_policies: {
    monthly_limit: number
  }
  notice_period: number
  description?: string
  created_at: string
}

export function generateMockPolicies(company_id: string): PolicyConfig[] {
  return [
    {
      id: 'policy-001',
      company_id,
      policy_name: 'Standard Company Policy 2024',
      leave_policies: {
        annual_leave: 20,
        sick_leave: 10,
        casual_leave: 8,
        maternity_leave: 90,
        carry_forward: true,
        encashment: true,
      },
      expense_policies: {
        monthly_limit: 10000,
      },
      notice_period: 30,
      created_at: '2024-01-01',
    },
  ]
}
