import { BaseService } from './base.service'

export interface SuperAdminInvoice {
  id: string
  invoiceNumber: string
  company: string
  companyId: string
  contractorName: string
  amount: number
  date: string
  dueDate: string | null
  status: string
  type: string
}

export interface SuperAdminInvoiceStats {
  totalInvoiced: number
  pendingPayment: number
  paidAmount: number
  overdueAmount: number
}

export interface SuperAdminInvoiceFilters {
  search?: string
  status?: string
  companyId?: string
}

class SuperAdminInvoicesServiceClass extends BaseService {
  async getInvoices(filters?: SuperAdminInvoiceFilters): Promise<SuperAdminInvoice[]> {
    // Fetch contractor invoices with contractor and company info
    let query = this.supabase
      .from('contractor_invoice')
      .select(`
        id,
        invoice_number,
        invoice_date,
        due_date,
        total_amount,
        status,
        contractor:contractor_contractor(
          id,
          full_name,
          contract:contractor_contractorcontract(
            company:company_company(id, legal_name)
          )
        )
      `)
      .order('invoice_date', { ascending: false })

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    const { data: invoices, error } = await query

    if (error) this.handleError(error)

    const results: SuperAdminInvoice[] = []

    invoices?.forEach((inv) => {
      const contractor = inv.contractor as {
        id: string
        full_name: string
        contract: Array<{ company: { id: string; legal_name: string } | null }>
      } | null

      // Get the company from the first active contract
      const company = contractor?.contract?.[0]?.company

      const invoice: SuperAdminInvoice = {
        id: inv.id,
        invoiceNumber: inv.invoice_number || `INV-${inv.id.slice(0, 8)}`,
        company: company?.legal_name || 'Unknown Company',
        companyId: company?.id || '',
        contractorName: contractor?.full_name || 'Unknown Contractor',
        amount: Number(inv.total_amount) || 0,
        date: inv.invoice_date || '',
        dueDate: inv.due_date,
        status: this.formatStatus(inv.status),
        type: 'Contractor Invoice',
      }

      results.push(invoice)
    })

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      return results.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchLower) ||
          inv.company.toLowerCase().includes(searchLower) ||
          inv.contractorName.toLowerCase().includes(searchLower)
      )
    }

    // Apply company filter
    if (filters?.companyId) {
      return results.filter((inv) => inv.companyId === filters.companyId)
    }

    return results
  }

  async getStats(): Promise<SuperAdminInvoiceStats> {
    const { data: invoices, error } = await this.supabase
      .from('contractor_invoice')
      .select('total_amount, status')

    if (error) this.handleError(error)

    let totalInvoiced = 0
    let pendingPayment = 0
    let paidAmount = 0
    let overdueAmount = 0

    invoices?.forEach((inv) => {
      const amount = Number(inv.total_amount) || 0
      totalInvoiced += amount

      switch (inv.status) {
        case 'paid':
          paidAmount += amount
          break
        case 'overdue':
          overdueAmount += amount
          break
        case 'draft':
        case 'sent':
        case 'approved':
          pendingPayment += amount
          break
      }
    })

    return {
      totalInvoiced,
      pendingPayment,
      paidAmount,
      overdueAmount,
    }
  }

  /**
   * Mark invoice as paid
   */
  async markInvoiceAsPaid(invoiceId: string, paymentReference?: string): Promise<void> {
    const { error } = await this.supabase
      .from('contractor_invoice')
      .update({
        status: 'paid',
        paid_date: new Date().toISOString().split('T')[0],
        payment_reference: paymentReference || `PAY-${Date.now()}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)

    if (error) this.handleError(error)
  }

  /**
   * Send payment reminder for an invoice
   * In a real implementation, this would integrate with an email service
   */
  async sendPaymentReminder(invoiceId: string): Promise<{ success: boolean; message: string }> {
    // Get invoice details for the reminder
    const { data: invoice, error } = await this.supabase
      .from('contractor_invoice')
      .select(`
        id,
        invoice_number,
        total_amount,
        due_date,
        contractor:contractor_contractor(
          id,
          full_name,
          user:users_user(email)
        )
      `)
      .eq('id', invoiceId)
      .single()

    if (error) this.handleError(error)

    if (!invoice) {
      throw new Error('Invoice not found')
    }

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll log and return success
    console.log('[Payment Reminder] Sending reminder for invoice:', {
      invoiceNumber: invoice.invoice_number,
      amount: invoice.total_amount,
      dueDate: invoice.due_date,
      contractor: (invoice.contractor as { full_name: string })?.full_name,
    })

    return {
      success: true,
      message: `Payment reminder sent for invoice ${invoice.invoice_number}`,
    }
  }

  /**
   * Generate a new invoice for a company/contractor
   */
  async generateInvoice(data: {
    contractorId: string
    contractId: string
    billingPeriodStart: string
    billingPeriodEnd: string
    hours?: number
    rate?: number
    subtotal: number
  }): Promise<SuperAdminInvoice> {
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`
    const now = new Date()
    const dueDate = new Date(now)
    dueDate.setDate(dueDate.getDate() + 30) // 30 days payment terms

    // Calculate GST (18% total)
    const cgstAmount = data.subtotal * 0.09
    const sgstAmount = data.subtotal * 0.09
    const totalAmount = data.subtotal + cgstAmount + sgstAmount

    const { data: newInvoice, error } = await this.supabase
      .from('contractor_invoice')
      .insert({
        contractor_id: data.contractorId,
        contract_id: data.contractId,
        invoice_number: invoiceNumber,
        invoice_date: now.toISOString().split('T')[0],
        billing_period_start: data.billingPeriodStart,
        billing_period_end: data.billingPeriodEnd,
        hours: data.hours || null,
        rate: data.rate || null,
        subtotal: data.subtotal,
        cgst_percent: 9,
        sgst_percent: 9,
        cgst_amount: cgstAmount,
        sgst_amount: sgstAmount,
        total_amount: totalAmount,
        status: 'draft',
        due_date: dueDate.toISOString().split('T')[0],
      })
      .select(`
        id,
        invoice_number,
        invoice_date,
        due_date,
        total_amount,
        status,
        contractor:contractor_contractor(
          id,
          full_name,
          contract:contractor_contractorcontract(
            company:company_company(id, legal_name)
          )
        )
      `)
      .single()

    if (error) this.handleError(error)

    const contractor = newInvoice.contractor as {
      id: string
      full_name: string
      contract: Array<{ company: { id: string; legal_name: string } | null }>
    } | null

    const company = contractor?.contract?.[0]?.company

    return {
      id: newInvoice.id,
      invoiceNumber: newInvoice.invoice_number,
      company: company?.legal_name || 'Unknown Company',
      companyId: company?.id || '',
      contractorName: contractor?.full_name || 'Unknown Contractor',
      amount: Number(newInvoice.total_amount) || 0,
      date: newInvoice.invoice_date || '',
      dueDate: newInvoice.due_date,
      status: this.formatStatus(newInvoice.status),
      type: 'Contractor Invoice',
    }
  }

  /**
   * Update invoice status
   */
  async updateInvoiceStatus(invoiceId: string, status: 'draft' | 'sent' | 'approved' | 'paid' | 'overdue' | 'cancelled'): Promise<void> {
    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'paid') {
      updates.paid_date = new Date().toISOString().split('T')[0]
    }

    const { error } = await this.supabase
      .from('contractor_invoice')
      .update(updates)
      .eq('id', invoiceId)

    if (error) this.handleError(error)
  }

  private formatStatus(status: string | null): string {
    const statusMap: Record<string, string> = {
      draft: 'Draft',
      sent: 'Sent',
      approved: 'Approved',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled',
    }
    return statusMap[status || ''] || 'Pending'
  }
}

export const superadminInvoicesService = new SuperAdminInvoicesServiceClass()
