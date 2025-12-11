'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useInvoiceDetail } from '@/lib/hooks/use-invoices'

function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  if (num === 0) return 'Zero'
  if (num < 0) return 'Minus ' + numberToWords(-num)

  let words = ''

  if (Math.floor(num / 10000000) > 0) {
    words += numberToWords(Math.floor(num / 10000000)) + ' Crore '
    num %= 10000000
  }

  if (Math.floor(num / 100000) > 0) {
    words += numberToWords(Math.floor(num / 100000)) + ' Lakh '
    num %= 100000
  }

  if (Math.floor(num / 1000) > 0) {
    words += numberToWords(Math.floor(num / 1000)) + ' Thousand '
    num %= 1000
  }

  if (Math.floor(num / 100) > 0) {
    words += ones[Math.floor(num / 100)] + ' Hundred '
    num %= 100
  }

  if (num > 0) {
    if (num < 20) {
      words += ones[num]
    } else {
      words += tens[Math.floor(num / 10)]
      if (num % 10 > 0) {
        words += ' ' + ones[num % 10]
      }
    }
  }

  return words.trim() + ' Rupees Only'
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading, error } = useInvoiceDetail(id)

  const handleDownload = () => {
    window.print()
  }

  const handleBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Invoice not found</h3>
            <p className="text-gray-500 mt-2">
              The invoice you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { invoice, contractor, company, bankAccount } = data
  const subtotal = invoice.subtotal || 0
  const cgstAmount = invoice.cgst_amount || 0
  const sgstAmount = invoice.sgst_amount || 0
  const igstAmount = invoice.igst_amount || 0
  const totalGst = cgstAmount + sgstAmount + igstAmount
  const totalAmount = invoice.total_amount || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">
            Invoice #{invoice.invoice_number}
          </h1>
        </div>
        <Button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      {/* Invoice Document */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="text-center mb-8 pb-8 border-b border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900">TAX INVOICE</h2>
          </div>

          {/* From Section */}
          <div className="mb-8 pb-8 border-b border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {contractor?.businessName || contractor?.name || 'Contractor'}
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  {contractor?.address && <p>{contractor.address}</p>}
                  {contractor?.city && <p>{contractor.city}</p>}
                  {contractor?.pan && (
                    <p className="mt-3">
                      <span className="font-semibold">PAN:</span> {contractor.pan}
                    </p>
                  )}
                  {contractor?.gst && (
                    <p>
                      <span className="font-semibold">GSTIN:</span> {contractor.gst}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right text-sm text-gray-700">
                <div className="mb-4">
                  <p className="font-semibold">
                    <span className="text-gray-600">INVOICE NO:</span>{' '}
                    <span className="text-gray-900 font-bold">{invoice.invoice_number}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Date:</span> {formatDate(invoice.invoice_date)}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="text-gray-600">Due Date:</span> {formatDate(invoice.due_date)}
                  </p>
                  {invoice.billing_period_start && invoice.billing_period_end && (
                    <p className="mt-2">
                      <span className="text-gray-600">Billing Period:</span>{' '}
                      {formatDate(invoice.billing_period_start)} - {formatDate(invoice.billing_period_end)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* To Section */}
          <div className="mb-8 pb-8 border-b border-gray-300">
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-2">Bill To: {company?.name || 'Company'}</p>
              {company?.address && <p>{company.address}</p>}
              {company?.city && <p>{company.city}</p>}
              {company?.gstin && (
                <p className="mt-2">
                  <span className="font-semibold">GSTIN:</span> {company.gstin}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    S.No.
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Description
                  </th>
                  {invoice.hours && (
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      Hours
                    </th>
                  )}
                  {invoice.rate && (
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      Rate
                    </th>
                  )}
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">1</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    Professional Services for {formatDate(invoice.billing_period_start)} - {formatDate(invoice.billing_period_end)}
                  </td>
                  {invoice.hours && (
                    <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                      {invoice.hours}
                    </td>
                  )}
                  {invoice.rate && (
                    <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                      {formatCurrency(invoice.rate)}
                    </td>
                  )}
                  <td className="border border-gray-300 px-4 py-3 text-right text-gray-700 font-medium">
                    {formatCurrency(subtotal)}
                  </td>
                </tr>
                {/* Subtotal Row */}
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td colSpan={invoice.hours && invoice.rate ? 4 : 2} className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    Sub Total
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    {formatCurrency(subtotal)}
                  </td>
                </tr>
                {/* CGST Row */}
                {cgstAmount > 0 && (
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <td colSpan={invoice.hours && invoice.rate ? 4 : 2} className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      CGST ({invoice.cgst_percent || 0}%)
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(cgstAmount)}
                    </td>
                  </tr>
                )}
                {/* SGST Row */}
                {sgstAmount > 0 && (
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <td colSpan={invoice.hours && invoice.rate ? 4 : 2} className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      SGST ({invoice.sgst_percent || 0}%)
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(sgstAmount)}
                    </td>
                  </tr>
                )}
                {/* IGST Row */}
                {igstAmount > 0 && (
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <td colSpan={invoice.hours && invoice.rate ? 4 : 2} className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      IGST ({invoice.igst_percent || 0}%)
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(igstAmount)}
                    </td>
                  </tr>
                )}
                {/* Total GST if multiple components */}
                {totalGst > 0 && (cgstAmount + sgstAmount > 0 || igstAmount > 0) && (
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <td colSpan={invoice.hours && invoice.rate ? 4 : 2} className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      Total GST
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(totalGst)}
                    </td>
                  </tr>
                )}
                {/* Grand Total Row */}
                <tr className="bg-primary/5">
                  <td colSpan={invoice.hours && invoice.rate ? 4 : 2} className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                    Total Amount
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg text-primary">
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="mb-8 pb-8 border-b border-gray-300">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Amount in words:</span>{' '}
              {numberToWords(Math.round(totalAmount))}
            </p>
          </div>

          {/* Bank Details & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bankAccount && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Bank Details</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Account Name:</span>{' '}
                    {bankAccount.accountHolderName}
                  </p>
                  <p>
                    <span className="font-semibold">Account No.:</span>{' '}
                    {bankAccount.accountNumber}
                  </p>
                  <p>
                    <span className="font-semibold">IFSC Code:</span>{' '}
                    {bankAccount.ifscCode}
                  </p>
                  {bankAccount.bankName && (
                    <p>
                      <span className="font-semibold">Bank:</span>{' '}
                      {bankAccount.bankName}
                    </p>
                  )}
                  {bankAccount.accountType && (
                    <p>
                      <span className="font-semibold">Account Type:</span>{' '}
                      {bankAccount.accountType}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p>- E & OE (Errors and Omissions Excepted)</p>
                <p>- Payment due within 7 days from invoice date</p>
                <p>- Subject to jurisdiction of local courts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badge */}
      <div className="flex items-center gap-3 print:hidden">
        <Badge
          variant={invoice.status === 'paid' ? 'default' : 'secondary'}
          className={`text-base py-1.5 px-3 ${
            invoice.status === 'paid'
              ? 'bg-green-100 text-green-800'
              : invoice.status === 'approved'
              ? 'bg-blue-100 text-blue-800'
              : invoice.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {invoice.status === 'paid'
            ? 'Paid'
            : invoice.status === 'approved'
            ? 'Approved'
            : invoice.status === 'rejected'
            ? 'Rejected'
            : 'Pending'}
        </Badge>
        {invoice.status === 'pending' && invoice.due_date && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            Payment is due by {formatDate(invoice.due_date)}
          </div>
        )}
        {invoice.status === 'paid' && invoice.paid_date && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            Paid on {formatDate(invoice.paid_date)}
            {invoice.payment_reference && ` (Ref: ${invoice.payment_reference})`}
          </div>
        )}
        {invoice.status === 'rejected' && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            This invoice was rejected. Please contact your employer for details.
          </div>
        )}
      </div>
    </div>
  )
}
