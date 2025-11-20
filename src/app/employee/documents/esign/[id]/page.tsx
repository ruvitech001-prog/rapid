'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ESignDocumentPage() {
  const router = useRouter()
  const params = useParams()
  const [agreed, setAgreed] = useState(false)

  // Mock document data
  const document = {
    id: params.id,
    title: 'Employment Contract - 2024',
    type: 'Employment Agreement',
    uploadedBy: 'HR Department',
    uploadedOn: '2024-02-20',
    requiresSignature: true,
    status: 'pending',
  }

  const handleSign = () => {
    if (!agreed) {
      alert('Please agree to the terms before signing')
      return
    }
    console.log('Signing document:', document.id)
    alert('Document signed successfully with e-signature!')
    router.push('/employee/documents/library')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">E-Signature Required</h1>
          <p className="mt-1 text-sm text-gray-500">Review and sign the document</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {/* Document Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Document Title</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{document.title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{document.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Uploaded By</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{document.uploadedBy}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {new Date(document.uploadedOn).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Document Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Document Preview</h2>
        <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50 min-h-[600px]">
          <div className="max-w-3xl mx-auto space-y-4 text-sm">
            <h3 className="text-center text-xl font-bold text-gray-900">EMPLOYMENT AGREEMENT</h3>
            <p className="text-center text-gray-600">This Agreement is made on {new Date().toLocaleDateString()}</p>

            <div className="mt-6 space-y-4">
              <p><strong>BETWEEN:</strong> Acme Corporation Pvt Ltd (hereinafter referred to as "the Employer")</p>
              <p><strong>AND:</strong> John Doe (hereinafter referred to as "the Employee")</p>

              <div className="mt-4">
                <p className="font-bold">1. POSITION AND DUTIES</p>
                <p className="mt-2">The Employee is employed as Senior Developer and shall perform duties as assigned by the Employer.</p>
              </div>

              <div className="mt-4">
                <p className="font-bold">2. COMPENSATION</p>
                <p className="mt-2">The Employee shall receive an annual salary of ₹6,00,000 (Six Lakh Rupees only), payable monthly.</p>
              </div>

              <div className="mt-4">
                <p className="font-bold">3. CONFIDENTIALITY</p>
                <p className="mt-2">The Employee agrees to maintain confidentiality of all proprietary information...</p>
              </div>

              <div className="mt-4">
                <p className="font-bold">4. TERMINATION</p>
                <p className="mt-2">Either party may terminate this agreement with 30 days written notice...</p>
              </div>

              <div className="mt-8 border-t pt-6">
                <p className="text-xs text-gray-500 italic">
                  [Full document content would be displayed here in actual implementation]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Digital Signature</h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">Before you sign:</h3>
          <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
            <li>Please read the entire document carefully</li>
            <li>Your digital signature is legally binding</li>
            <li>Once signed, you will receive a copy via email</li>
            <li>Contact HR if you have any questions or concerns</li>
          </ul>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
            />
            <span className="text-sm text-gray-900">
              I have read and agree to the terms and conditions mentioned in this document.
              I understand that my digital signature is legally binding.
            </span>
          </label>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs text-gray-500">Signing as:</p>
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john.doe@acme.com</p>
            </div>
            <button
              onClick={handleSign}
              disabled={!agreed}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Sign Document
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="h-5 w-5 text-blue-600 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">Secure E-Signature</p>
            <p className="text-xs text-blue-800 mt-1">
              This document uses industry-standard encryption and digital signature technology.
              Your signature is time-stamped and cryptographically sealed for legal validity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
