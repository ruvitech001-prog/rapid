'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useUploadEmployeeDocument } from '@/lib/hooks'

export default function UploadDocumentsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const employeeId = user?.id

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')

  const uploadDocument = useUploadEmployeeDocument()

  const categories = [
    'Identity Proof (Aadhaar/PAN)',
    'Address Proof',
    'Education Certificates',
    'Experience Letters',
    'Bank Passbook',
    'Resignation Letter',
    'Medical Certificates',
    'Other Documents',
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB')
        return
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, JPG, PNG, and DOCX files are allowed')
        return
      }

      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!employeeId || !selectedFile || !selectedCategory) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await uploadDocument.mutateAsync({
        employeeId,
        input: {
          file: selectedFile,
          category: selectedCategory,
          description,
        },
      })
      toast.success('Document uploaded successfully!')
      router.push('/employee/documents/library')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload document')
    }
  }

  const isSubmitting = uploadDocument.isPending

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
        <p className="mt-1 text-sm text-gray-500">Upload your work-related documents</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Upload Guidelines:</h3>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>Supported formats: PDF, JPG, PNG, DOCX</li>
          <li>Maximum file size: 10MB</li>
          <li>Ensure documents are clear and readable</li>
          <li>All uploads are secure and encrypted</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Document Category *</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload File *</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    onChange={handleFileChange}
                    required
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, JPG, PNG, DOCX up to 10MB</p>
              {selectedFile && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add any additional notes about this document..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedFile || !selectedCategory}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Upload Document
          </button>
        </div>
      </form>
    </div>
  )
}
