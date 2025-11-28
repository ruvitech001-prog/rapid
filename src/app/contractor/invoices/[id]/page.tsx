'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Edit2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface InvoiceData {
  id: string
  date: string
  dueDate: string
  amount: number
  subTotal: number
  gstAmount: number
  status: 'paid' | 'pending'
  company: {
    name: string
    pan: string
    gst: string
    address: string
    city: string
  }
  client: {
    name: string
    address: string
    city: string
    pincode: string
    country: string
    companyCode: string
  }
  items: {
    sno: number
    description: string
    taxRate: string
    amount: number
  }[]
  bankDetails: {
    accountName: string
    accountNo: string
    ifscCode: string
    accountType: string
    bankAddress: string
  }
  otherTerms: string[]
}

const mockInvoiceData: InvoiceData = {
  id: '234',
  date: '01/Jun/2023',
  dueDate: '10/Jun/2023',
  amount: 50000,
  subTotal: 42016,
  gstAmount: 7564,
  status: 'pending',
  company: {
    name: 'Auriga IT Consulting Pvt. Ltd.',
    pan: 'XXXXXXXX',
    gst: 'XXXXXXXX',
    address: 'Transport Bhawan Sansad Marg',
    city: 'New Delhi, 110001',
  },
  client: {
    name: 'Rapid EOR Tech Private Limited',
    address: '3rd Floor, 166/168/169 Arekere Mico Lyt, BG Road',
    city: 'Bangalore, Karnataka 560076',
    pincode: '560076',
    country: 'India',
    companyCode: 'BC23654970',
  },
  items: [
    {
      sno: 1,
      description: 'Rapid Management Fees',
      taxRate: '18%',
      amount: 35680,
    },
    {
      sno: 2,
      description: 'Reimbursement of expenses',
      taxRate: '0%',
      amount: 6336,
    },
  ],
  bankDetails: {
    accountName: 'Rapid EOR Tech Private Limited',
    accountNo: '####',
    ifscCode: '###',
    accountType: '####',
    bankAddress: '####',
  },
  otherTerms: ['-E & OE', '-Payment due in 7 days'],
}

export default function InvoiceDetailPage({ params: _params }: { params: { id: string } }) {
  const router = useRouter()
  const [invoice] = useState<InvoiceData>(mockInvoiceData)

  const handleDownload = () => {
    alert(`Downloading invoice ${invoice.id}...`)
  }

  const handleEdit = () => {
    alert(`Editing invoice ${invoice.id}...`)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">
            Invoice of {invoice.company.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="text-center mb-8 pb-8 border-b border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
          </div>

          {/* From Section */}
          <div className="mb-8 pb-8 border-b border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{invoice.company.name}</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{invoice.company.address}</p>
                  <p>{invoice.company.city}</p>
                  <p className="mt-3">
                    <span className="font-semibold">PAN:</span> {invoice.company.pan}
                  </p>
                  <p>
                    <span className="font-semibold">GST:</span> {invoice.company.gst}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-700">
                <div className="mb-4">
                  <p className="font-semibold">
                    <span className="text-gray-600">INVOICE ID:</span>{' '}
                    <span className="text-gray-900 font-bold">{invoice.id}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Date:</span> {invoice.date}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="text-gray-600">Due Date:</span> {invoice.dueDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* To Section */}
          <div className="mb-8 pb-8 border-b border-gray-300">
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-2">To: {invoice.client.name}</p>
              <p>{invoice.client.address}</p>
              <p>
                {invoice.client.city}, {invoice.client.country}
              </p>
              <p>{invoice.client.companyCode}</p>
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
                    Item & Description
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Tax Rate
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.sno} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.sno}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                      {item.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.taxRate}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-gray-700 font-medium">
                      ₹{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    Sub Total
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    ₹{invoice.subTotal.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    GST Amount
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    ₹{invoice.gstAmount.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-primary/5">
                  <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                    Total Due
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg text-primary">
                    ₹{invoice.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="mb-8 pb-8 border-b border-gray-300">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Amount in words:</span> Fifty Thousand Rupees
            </p>
          </div>

          {/* Bank Details & Other Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Bank Details: ####</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <span className="font-semibold">Account Name:</span>{' '}
                  {invoice.bankDetails.accountName}
                </p>
                <p>
                  <span className="font-semibold">Account No.:</span>{' '}
                  {invoice.bankDetails.accountNo}
                </p>
                <p>
                  <span className="font-semibold">Bank IFSC code (SWIFT):</span>{' '}
                  {invoice.bankDetails.ifscCode}
                </p>
                <p>
                  <span className="font-semibold">Account Type:</span>{' '}
                  {invoice.bankDetails.accountType}
                </p>
                <p>
                  <span className="font-semibold">Bank Address:</span>{' '}
                  {invoice.bankDetails.bankAddress}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Other Terms</h4>
              <div className="text-sm text-gray-700 space-y-2">
                {invoice.otherTerms.map((term, idx) => (
                  <p key={idx}>{term}</p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <Badge
          variant={invoice.status === 'paid' ? 'default' : 'secondary'}
          className="text-base py-1.5 px-3"
        >
          {invoice.status === 'paid' ? 'Paid' : 'Pending'}
        </Badge>
        {invoice.status === 'pending' && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            Payment is due by {invoice.dueDate}
          </div>
        )}
      </div>
    </div>
  )
}
