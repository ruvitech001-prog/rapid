import { BaseService } from './base.service'
import type { Tables } from '@/types/database.types'

export type ContractorInvoice = Tables<'contractor_invoice'>

export interface InvoiceWithContractor extends ContractorInvoice {
  contractorName: string
  contractorCode: string
  businessName: string | null
}

export interface InvoiceFilters {
  status?: 'pending' | 'approved' | 'paid' | 'rejected'
  contractorId?: string
}

export interface InvoiceSummary {
  pending: number
  pendingAmount: number
  paid: number
  paidAmount: number
  thisMonth: number
  thisMonthAmount: number
}

export interface ContractorInvoiceWithCompany extends ContractorInvoice {
  companyName: string
}

class InvoicesServiceClass extends BaseService {
  // Get invoices for a company (employer view)
  async getCompanyInvoices(
    companyId: string,
    filters?: InvoiceFilters
  ): Promise<InvoiceWithContractor[]> {
    // Get contractor contracts for this company
    const { data: contracts } = await this.supabase
      .from('contractor_contractorcontract')
      .select('id, contractor_id')
      .eq('company_id', companyId)
      .eq('is_current', true)

    const contractIds = contracts?.map((c) => c.id).filter(Boolean) || []

    if (contractIds.length === 0) return []

    // Build invoice query
    let query = this.supabase
      .from('contractor_invoice')
      .select('*')
      .in('contract_id', contractIds)
      .order('invoice_date', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.contractorId) {
      query = query.eq('contractor_id', filters.contractorId)
    }

    const { data: invoices, error } = await query

    if (error) this.handleError(error)

    // Get contractor details
    const contractorIds =
      invoices
        ?.map((i) => i.contractor_id)
        .filter((id): id is string => id !== null) || []

    let contractorsMap: Record<
      string,
      { name: string; code: string; businessName: string | null }
    > = {}

    if (contractorIds.length > 0) {
      const { data: contractors } = await this.supabase
        .from('contractor_contractor')
        .select('id, full_name, contractor_code, business_name')
        .in('id', contractorIds)

      contractorsMap =
        contractors?.reduce(
          (acc, c) => {
            acc[c.id] = {
              name: c.full_name,
              code: c.contractor_code || '',
              businessName: c.business_name,
            }
            return acc
          },
          {} as Record<
            string,
            { name: string; code: string; businessName: string | null }
          >
        ) || {}
    }

    return (invoices || []).map((invoice) => ({
      ...invoice,
      contractorName: invoice.contractor_id
        ? contractorsMap[invoice.contractor_id]?.name || ''
        : '',
      contractorCode: invoice.contractor_id
        ? contractorsMap[invoice.contractor_id]?.code || ''
        : '',
      businessName: invoice.contractor_id
        ? contractorsMap[invoice.contractor_id]?.businessName || null
        : null,
    }))
  }

  // Get pending invoices for employer dashboard
  async getPendingInvoices(
    companyId: string,
    limit: number = 5
  ): Promise<InvoiceWithContractor[]> {
    const invoices = await this.getCompanyInvoices(companyId, {
      status: 'pending',
    })
    return invoices.slice(0, limit)
  }

  // Get recently paid invoices
  async getRecentlyPaidInvoices(
    companyId: string,
    limit: number = 5
  ): Promise<InvoiceWithContractor[]> {
    const invoices = await this.getCompanyInvoices(companyId, {
      status: 'paid',
    })
    return invoices.slice(0, limit)
  }

  // Get invoice summary for employer
  async getInvoiceSummary(companyId: string): Promise<InvoiceSummary> {
    const allInvoices = await this.getCompanyInvoices(companyId)

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const pending = allInvoices.filter((i) => i.status === 'pending')
    const paid = allInvoices.filter((i) => i.status === 'paid')
    const thisMonth = allInvoices.filter(
      (i) => new Date(i.invoice_date) >= thisMonthStart
    )

    return {
      pending: pending.length,
      pendingAmount: pending.reduce(
        (sum, i) => sum + (i.total_amount || 0),
        0
      ),
      paid: paid.length,
      paidAmount: paid.reduce((sum, i) => sum + (i.total_amount || 0), 0),
      thisMonth: thisMonth.length,
      thisMonthAmount: thisMonth.reduce(
        (sum, i) => sum + (i.total_amount || 0),
        0
      ),
    }
  }

  // Pay an invoice
  async payInvoice(
    invoiceId: string,
    paymentReference: string
  ): Promise<ContractorInvoice> {
    const { data, error } = await this.supabase
      .from('contractor_invoice')
      .update({
        status: 'paid',
        paid_date: new Date().toISOString().split('T')[0],
        payment_reference: paymentReference,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // Approve an invoice
  async approveInvoice(invoiceId: string): Promise<ContractorInvoice> {
    const { data, error } = await this.supabase
      .from('contractor_invoice')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // Reject an invoice
  async rejectInvoice(
    invoiceId: string,
    reason: string
  ): Promise<ContractorInvoice> {
    const { data, error } = await this.supabase
      .from('contractor_invoice')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // === Contractor-specific methods ===

  // Get invoice by ID with full details
  async getInvoiceById(invoiceId: string): Promise<{
    invoice: ContractorInvoice
    contractor: {
      name: string
      code: string
      pan: string | null
      gst: string | null
      businessName: string | null
      address: string | null
      city: string | null
    } | null
    company: {
      name: string
      address: string | null
      city: string | null
      gstin: string | null
    } | null
    bankAccount: {
      accountHolderName: string
      accountNumber: string
      ifscCode: string
      bankName: string | null
      accountType: string | null
    } | null
  } | null> {
    // Get the invoice
    const { data: invoice, error } = await this.supabase
      .from('contractor_invoice')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      this.handleError(error)
    }
    if (!invoice) return null

    // Get contractor details
    let contractor = null
    if (invoice.contractor_id) {
      const { data: contractorData } = await this.supabase
        .from('contractor_contractor')
        .select('full_name, contractor_code, pan_number, gstin, business_name')
        .eq('id', invoice.contractor_id)
        .single()

      if (contractorData) {
        // Get contractor address
        const { data: addressData } = await this.supabase
          .from('commons_address')
          .select('address_line_1, city, state')
          .eq('id', invoice.contractor_id)
          .single()

        contractor = {
          name: contractorData.full_name,
          code: contractorData.contractor_code || '',
          pan: contractorData.pan_number,
          gst: contractorData.gstin,
          businessName: contractorData.business_name,
          address: addressData?.address_line_1 || null,
          city: addressData ? `${addressData.city}, ${addressData.state}` : null,
        }
      }
    }

    // Get company details via contract
    let company = null
    if (invoice.contract_id) {
      const { data: contract } = await this.supabase
        .from('contractor_contractorcontract')
        .select('company_id')
        .eq('id', invoice.contract_id)
        .single()

      if (contract?.company_id) {
        const { data: companyData } = await this.supabase
          .from('company_company')
          .select('legal_name, gstin, registered_address_id')
          .eq('id', contract.company_id)
          .single()

        if (companyData) {
          // Get company address if available
          let companyAddress = null
          let companyCity = null
          if (companyData.registered_address_id) {
            const { data: addressData } = await this.supabase
              .from('commons_address')
              .select('address_line_1, city, state')
              .eq('id', companyData.registered_address_id)
              .single()

            if (addressData) {
              companyAddress = addressData.address_line_1
              companyCity = addressData.city ? `${addressData.city}, ${addressData.state}` : null
            }
          }

          company = {
            name: companyData.legal_name,
            address: companyAddress,
            city: companyCity,
            gstin: companyData.gstin,
          }
        }
      }
    }

    // Get bank account
    let bankAccount = null
    if (invoice.contractor_id) {
      const { data: bankData } = await this.supabase
        .from('commons_bankaccount')
        .select('account_holder_name, account_number, ifsc_code, bank_name, account_type')
        .eq('contractor_id', invoice.contractor_id)
        .eq('is_primary', true)
        .single()

      if (bankData) {
        bankAccount = {
          accountHolderName: bankData.account_holder_name,
          accountNumber: bankData.account_number,
          ifscCode: bankData.ifsc_code,
          bankName: bankData.bank_name,
          accountType: bankData.account_type,
        }
      }
    }

    return { invoice, contractor, company, bankAccount }
  }

  // Get invoices for a contractor
  async getContractorInvoices(contractorId: string): Promise<ContractorInvoiceWithCompany[]> {
    const { data: invoices, error } = await this.supabase
      .from('contractor_invoice')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('invoice_date', { ascending: false })

    if (error) this.handleError(error)
    if (!invoices || invoices.length === 0) return []

    // Get contract IDs to fetch company info
    const contractIds = invoices
      .map((i) => i.contract_id)
      .filter((id): id is string => id !== null)

    if (contractIds.length === 0) {
      return invoices.map((inv) => ({ ...inv, companyName: 'Unknown Company' }))
    }

    // Get contracts to find company IDs
    const { data: contracts } = await this.supabase
      .from('contractor_contractorcontract')
      .select('id, company_id')
      .in('id', contractIds)

    const contractCompanyMap = contracts?.reduce(
      (acc, c) => {
        acc[c.id] = c.company_id || ''
        return acc
      },
      {} as Record<string, string>
    ) || {}

    // Get company details
    const companyIds = [...new Set(Object.values(contractCompanyMap).filter(Boolean))]

    let companiesMap: Record<string, string> = {}
    if (companyIds.length > 0) {
      const { data: companies } = await this.supabase
        .from('company_company')
        .select('id, legal_name')
        .in('id', companyIds)

      companiesMap = companies?.reduce(
        (acc, c) => {
          acc[c.id] = c.legal_name
          return acc
        },
        {} as Record<string, string>
      ) || {}
    }

    return invoices.map((inv) => {
      const companyId = inv.contract_id ? contractCompanyMap[inv.contract_id] : ''
      return {
        ...inv,
        companyName: companyId ? companiesMap[companyId] || 'Unknown Company' : 'Unknown Company',
      }
    })
  }

  // Create a new invoice (contractor)
  async createInvoice(invoice: {
    contractorId: string
    contractId: string
    invoiceNumber: string
    invoiceDate: string
    dueDate: string
    billingPeriodStart: string
    billingPeriodEnd: string
    hours?: number
    rate?: number
    subtotal: number
    cgstPercent?: number
    cgstAmount?: number
    sgstPercent?: number
    sgstAmount?: number
    igstPercent?: number
    igstAmount?: number
    totalAmount: number
  }): Promise<ContractorInvoice> {
    const { data, error } = await this.supabase
      .from('contractor_invoice')
      .insert({
        contractor_id: invoice.contractorId,
        contract_id: invoice.contractId,
        invoice_number: invoice.invoiceNumber,
        invoice_date: invoice.invoiceDate,
        due_date: invoice.dueDate,
        billing_period_start: invoice.billingPeriodStart,
        billing_period_end: invoice.billingPeriodEnd,
        hours: invoice.hours || null,
        rate: invoice.rate || null,
        subtotal: invoice.subtotal,
        cgst_percent: invoice.cgstPercent || null,
        cgst_amount: invoice.cgstAmount || null,
        sgst_percent: invoice.sgstPercent || null,
        sgst_amount: invoice.sgstAmount || null,
        igst_percent: invoice.igstPercent || null,
        igst_amount: invoice.igstAmount || null,
        total_amount: invoice.totalAmount,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) this.handleError(error)
    return data
  }

  // Get cost overview for employer (last N months)
  async getCostOverview(
    companyId: string,
    months: number = 6
  ): Promise<{ month: string; cost: number }[]> {
    // Get employee payroll costs
    const { data: contracts } = await this.supabase
      .from('employee_employeecontract')
      .select('gross_salary, start_date')
      .eq('company_id', companyId)
      .eq('is_current', true)
      .eq('is_active', true)

    // Get contractor invoices
    const allInvoices = await this.getCompanyInvoices(companyId, {
      status: 'paid',
    })

    const overview: { month: string; cost: number }[] = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthStr = date.toLocaleString('default', { month: 'short' })

      // Employee payroll for this month
      let employeeCost = 0
      contracts?.forEach((c) => {
        const startDate = new Date(c.start_date)
        if (startDate <= monthEnd) {
          employeeCost += c.gross_salary
        }
      })

      // Contractor invoices for this month
      const monthInvoices = allInvoices.filter((inv) => {
        const invDate = new Date(inv.invoice_date)
        return (
          invDate.getMonth() === date.getMonth() &&
          invDate.getFullYear() === date.getFullYear()
        )
      })
      const contractorCost = monthInvoices.reduce(
        (sum, inv) => sum + (inv.total_amount || 0),
        0
      )

      overview.push({
        month: monthStr,
        cost: employeeCost + contractorCost,
      })
    }

    return overview
  }
}

export const invoicesService = new InvoicesServiceClass()
