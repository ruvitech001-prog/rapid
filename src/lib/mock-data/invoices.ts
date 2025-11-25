/**
 * Mock Invoice Data Generator
 */

import {
  generateId,
  PAYMENT_STATUSES,
  formatDate,
  subtractDays,
  getRandomElement,
  getRandomNumber,
} from "./utils"

export interface MockInvoice {
  id: string
  contractor_id: string
  company_id: string
  invoice_number: string
  billing_period_start: string
  billing_period_end: string
  amount: number
  tax_amount: number
  total_amount: number
  currency: string
  status: string
  issued_date: string
  due_date: string
  paid_date: string | null
  notes: string | null
  created_at: string
}

export function generateMockInvoices(
  count: number = 12,
  company_id: string = "",
  contractor_ids: string[] = [],
): MockInvoice[] {
  const invoices: MockInvoice[] = []
  const currentDate = new Date()

  for (let i = 0; i < count; i++) {
    const monthsAgo = i
    const invoiceDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsAgo, 1)
    const amount = getRandomNumber(50000, 500000)
    const taxAmount = amount * 0.18 // 18% GST
    const status = getRandomElement(PAYMENT_STATUSES)

    invoices.push({
      id: generateId(),
      contractor_id: contractor_ids[i % contractor_ids.length] || generateId(),
      company_id: company_id || generateId(),
      invoice_number: `INV-2024-${String(i + 1).padStart(4, "0")}`,
      billing_period_start: formatDate(invoiceDate),
      billing_period_end: formatDate(new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, 0)),
      amount,
      tax_amount: taxAmount,
      total_amount: amount + taxAmount,
      currency: "INR",
      status,
      issued_date: formatDate(invoiceDate),
      due_date: formatDate(subtractDays(invoiceDate, -30)),
      paid_date: status === "processed" ? formatDate(new Date()) : null,
      notes: "Invoice for services rendered",
      created_at: formatDate(invoiceDate),
    })
  }

  return invoices
}

export interface MockInvoiceLineItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
}

export function generateMockInvoiceLineItems(
  invoice_ids: string[],
  itemsPerInvoice: number = 3,
): MockInvoiceLineItem[] {
  const items: MockInvoiceLineItem[] = []

  invoice_ids.forEach((invoice_id) => {
    for (let i = 0; i < itemsPerInvoice; i++) {
      const quantity = getRandomNumber(1, 10)
      const unitPrice = getRandomNumber(1000, 10000)

      items.push({
        id: generateId(),
        invoice_id,
        description: `Service or deliverable ${i + 1}`,
        quantity,
        unit_price: unitPrice,
        total_price: quantity * unitPrice,
      })
    }
  })

  return items
}
