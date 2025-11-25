/**
 * Mock Tax Declaration Data Generator
 */

import { generateId, formatDate, subtractDays, getRandomElement, getRandomNumber } from "./utils"

export interface MockTaxDeclaration {
  id: string
  employee_id: string
  financial_year: string
  tax_regime: "old" | "new"
  gross_income: number
  deductions: {
    section_80c: number
    section_80d: number
    section_80e: number
    section_80ccd: number
    home_loan_interest: number
    hra_exemption: number
  }
  status: "draft" | "submitted" | "approved" | "rejected"
  submitted_at: string | null
  created_at: string
  updated_at: string
}

export function generateMockTaxDeclarations(
  count: number = 15,
  employee_ids: string[] = [],
): MockTaxDeclaration[] {
  const declarations: MockTaxDeclaration[] = []

  employee_ids.slice(0, count).forEach((employee_id) => {
    const status = getRandomElement(["draft", "submitted", "approved"] as const)

    declarations.push({
      id: generateId(),
      employee_id,
      financial_year: "2024-2025",
      tax_regime: getRandomElement(["old", "new"] as const),
      gross_income: getRandomNumber(600000, 2000000),
      deductions: {
        section_80c: getRandomNumber(0, 150000),
        section_80d: getRandomNumber(0, 50000),
        section_80e: getRandomNumber(0, 50000),
        section_80ccd: getRandomNumber(0, 100000),
        home_loan_interest: getRandomNumber(0, 200000),
        hra_exemption: getRandomNumber(0, 300000),
      },
      status,
      submitted_at: status !== "draft" ? formatDate(new Date()) : null,
      created_at: formatDate(subtractDays(new Date(), getRandomNumber(1, 30))),
      updated_at: formatDate(new Date()),
    })
  })

  return declarations
}

export interface MockTaxProof {
  id: string
  tax_declaration_id: string
  proof_type: string
  document_url: string
  status: "pending" | "verified" | "rejected"
  uploaded_at: string
  verified_at: string | null
  rejection_reason: string | null
}

export function generateMockTaxProofs(
  count: number = 10,
  tax_declaration_ids: string[] = [],
): MockTaxProof[] {
  const proofs: MockTaxProof[] = []

  const proofTypes = [
    "80c_life_insurance",
    "80c_ppf",
    "80d_medical_insurance",
    "80e_education_loan",
    "home_loan_interest",
    "rental_agreement",
  ]

  for (let i = 0; i < count; i++) {
    const status = getRandomElement(["pending", "verified", "rejected"] as const)
    const uploadedDate = subtractDays(new Date(), getRandomNumber(1, 60))

    proofs.push({
      id: generateId(),
      tax_declaration_id: tax_declaration_ids[i % tax_declaration_ids.length] || generateId(),
      proof_type: getRandomElement(proofTypes),
      document_url: `/documents/proof-${i + 1}.pdf`,
      status,
      uploaded_at: formatDate(uploadedDate),
      verified_at: status !== "pending" ? formatDate(new Date()) : null,
      rejection_reason: status === "rejected" ? "Document not clear" : null,
    })
  }

  return proofs
}
