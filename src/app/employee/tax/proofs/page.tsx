'use client'

import { useRef } from 'react'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useTaxProofs, useUploadTaxProof, useDeleteTaxProof } from '@/lib/hooks'

export default function TaxProofsUploadPage() {
  const { user } = useAuth()
  const employeeId = user?.id
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentUploadRef = useRef<{ category: string; subCategory: string } | null>(null)

  const { data: uploadedProofs = [], isLoading } = useTaxProofs(employeeId)
  const uploadMutation = useUploadTaxProof()
  const deleteMutation = useDeleteTaxProof()

  const proofCategories = [
    { category: 'Section 80C', items: ['LIC Premium', 'PPF', 'ELSS', 'NSC', 'FD', 'Tuition Fees'] },
    { category: 'Section 80D', items: ['Health Insurance - Self', 'Health Insurance - Parents', 'Preventive Checkup'] },
    { category: 'HRA', items: ['Rent Receipts', 'Rental Agreement'] },
    { category: 'Section 80E', items: ['Education Loan Certificate'] },
    { category: 'Section 24', items: ['Home Loan Interest Certificate'] },
    { category: 'Others', items: ['NPS Statement', 'Donation Receipts'] },
  ]

  const handleFileUpload = (category: string, subCategory: string) => {
    currentUploadRef.current = { category, subCategory }
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !employeeId || !currentUploadRef.current) return

    const { category, subCategory } = currentUploadRef.current

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB')
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed')
      return
    }

    try {
      await uploadMutation.mutateAsync({
        employeeId,
        file,
        category,
        subCategory,
      })
      toast.success(`Proof uploaded for ${category} - ${subCategory}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload proof')
    }

    // Reset file input
    e.target.value = ''
    currentUploadRef.current = null
  }

  const handleDelete = async (proofId: string) => {
    if (!employeeId) return

    try {
      await deleteMutation.mutateAsync({ proofId, employeeId })
      toast.success('Proof deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete proof')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tax Proofs Upload</h1>
        <p className="mt-1 text-sm text-gray-500">Submit investment proofs to support your tax declarations</p>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-900 mb-2">Important Deadline:</h3>
        <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
          <li>All proofs must be submitted before March 31st</li>
          <li>Upload clear scanned copies or original documents</li>
          <li>File formats: PDF, JPG, PNG (Max 5MB per file)</li>
          <li>Proofs will be verified by the finance team</li>
        </ul>
      </div>

      {/* Upload Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proofCategories.map((cat) => (
          <div key={cat.category} className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">{cat.category}</h2>
            </div>
            <div className="p-4 space-y-3">
              {cat.items.map((item) => (
                <div key={item} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-900">{item}</span>
                  <button
                    onClick={() => handleFileUpload(cat.category, item)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Uploaded Proofs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Uploaded Proofs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub-Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploadedProofs.map((proof) => (
                <tr key={proof.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proof.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proof.subCategory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proof.fileName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(proof.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(proof.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <a
                      href={proof.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(proof.id)}
                      disabled={deleteMutation.isPending || proof.status === 'approved'}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {uploadedProofs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No proofs uploaded yet</h3>
            <p className="mt-1 text-sm text-gray-500">Upload your investment proofs to claim tax benefits</p>
          </div>
        )}
      </div>

      {/* Submission Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-medium text-blue-900 mb-3">Submission Status</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{uploadedProofs.length}</p>
            <p className="text-xs text-blue-800 mt-1">Total Uploaded</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{uploadedProofs.filter(p => p.status === 'approved').length}</p>
            <p className="text-xs text-green-800 mt-1">Approved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{uploadedProofs.filter(p => p.status === 'pending').length}</p>
            <p className="text-xs text-yellow-800 mt-1">Pending</p>
          </div>
        </div>
      </div>
    </div>
  )
}
