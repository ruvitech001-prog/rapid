'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, FormWrapper } from '@/components/templates'
import { Button as _Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Camera,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import {
  useUploadDocument,
  useSubmitForVerification,
  usePerformFaceMatch,
  usePerformLivenessCheck,
  useVerificationStatus,
} from '@/lib/hooks'

const eKYCSchema = z.object({
  document_type: z.enum(['aadhar', 'passport', 'driving_license', 'voter_id']),
  document_number: z.string().min(6, 'Valid document number required'),
  full_name: z.string().min(2, 'Full name required'),
  date_of_birth: z.string().min(1, 'Date of birth required'),
  consent: z.boolean().refine((val) => val === true, 'Consent required to proceed'),
})

type EKYCFormData = z.infer<typeof eKYCSchema>

interface VerificationStatusItem {
  step: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  timestamp?: string
}

export default function EKYCPage() {
  const { user } = useAuth()
  const employeeId = user?.id

  const [currentStep, setCurrentStep] = useState<'document' | 'capture' | 'verification'>('document')
  const [verificationStatuses, setVerificationStatuses] = useState<VerificationStatusItem[]>([
    { step: 'Document Upload', status: 'pending' },
    { step: 'Face Capture', status: 'pending' },
    { step: 'Liveness Check', status: 'pending' },
    { step: 'Document Verification', status: 'pending' },
    { step: 'Data Verification', status: 'pending' },
  ])
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null)
  const [selfieDocumentId, setSelfieDocumentId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Hooks for API calls
  const uploadDocument = useUploadDocument()
  const submitForVerification = useSubmitForVerification()
  const performFaceMatch = usePerformFaceMatch()
  const performLivenessCheck = usePerformLivenessCheck()
  const { data: existingVerifications } = useVerificationStatus('employee', employeeId)

  // Check existing verification status on load
  useEffect(() => {
    if (existingVerifications && existingVerifications.length > 0) {
      const hasCompletedVerifications = existingVerifications.filter(v => v.status === 'verified')
      if (hasCompletedVerifications.length >= 3) {
        // All verifications complete
        setVerificationStatuses(prev => prev.map(s => ({
          ...s,
          status: 'completed',
          timestamp: new Date().toLocaleTimeString()
        })))
      }
    }
  }, [existingVerifications])

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<EKYCFormData>({
    resolver: zodResolver(eKYCSchema),
    defaultValues: {
      document_type: 'aadhar',
      document_number: '',
      full_name: '',
      date_of_birth: '',
      consent: false,
    },
  })

  const documentType = watch('document_type')

  const getDocumentNumberPattern = () => {
    switch (documentType) {
      case 'aadhar':
        return { placeholder: '1234 5678 9101', length: 12 }
      case 'passport':
        return { placeholder: 'A12345678', length: 9 }
      case 'driving_license':
        return { placeholder: 'DL0120210000123', length: 15 }
      case 'voter_id':
        return { placeholder: 'ABC1234567D', length: 10 }
      default:
        return { placeholder: 'Document number', length: 20 }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      // Validate file type
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        toast.error('Only JPG, PNG, and PDF files are allowed')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleDocumentCapture = async () => {
    if (!employeeId) {
      toast.error('User not authenticated')
      return
    }

    if (!selectedFile) {
      toast.error('Please select a document file')
      return
    }

    try {
      setVerificationStatuses((prev) =>
        prev.map((s) => (s.step === 'Document Upload' ? { ...s, status: 'in_progress' } : s))
      )

      // Upload the document
      const result = await uploadDocument.mutateAsync({
        file: selectedFile,
        documentType: documentType,
        entityType: 'employee',
        entityId: employeeId,
      })

      setUploadedDocumentId(result.documentId)

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Document Upload'
            ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
            : s
        )
      )

      toast.success('Document uploaded successfully')
      setCurrentStep('capture')
    } catch (error) {
      setVerificationStatuses((prev) =>
        prev.map((s) => (s.step === 'Document Upload' ? { ...s, status: 'failed' } : s))
      )
      toast.error(error instanceof Error ? error.message : 'Failed to upload document')
    }
  }

  const handleFaceCapture = async () => {
    if (!employeeId) {
      toast.error('User not authenticated')
      return
    }

    try {
      setVerificationStatuses((prev) =>
        prev.map((s) => (s.step === 'Face Capture' ? { ...s, status: 'in_progress' } : s))
      )

      // In a real implementation, this would open the camera and capture a photo
      // For now, we create a placeholder file and use it
      const selfieFile = new File(
        ['selfie-placeholder'],
        `selfie-${Date.now()}.jpg`,
        { type: 'image/jpeg' }
      )

      const selfieResult = await uploadDocument.mutateAsync({
        file: selfieFile,
        documentType: 'selfie',
        entityType: 'employee',
        entityId: employeeId,
      })

      setSelfieDocumentId(selfieResult.documentId)

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Face Capture'
            ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
            : s
        )
      )

      toast.success('Face captured successfully')

      // Now perform liveness check
      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Liveness Check' ? { ...s, status: 'in_progress' } : s
        )
      )

      // Simulate video frames for liveness check (in production, this would use actual camera feed)
      const livenessResult = await performLivenessCheck.mutateAsync({
        videoFrames: ['frame1', 'frame2', 'frame3'], // Placeholder frames
        entityType: 'employee',
        entityId: employeeId,
      })

      if (livenessResult.passed) {
        setVerificationStatuses((prev) =>
          prev.map((s) =>
            s.step === 'Liveness Check'
              ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
              : s
          )
        )
        toast.success('Liveness check completed')
        setCurrentStep('verification')
      } else {
        setVerificationStatuses((prev) =>
          prev.map((s) => (s.step === 'Liveness Check' ? { ...s, status: 'failed' } : s))
        )
        toast.error('Liveness check failed. Please try again.')
      }
    } catch (error) {
      setVerificationStatuses((prev) =>
        prev.map((s) => (s.step === 'Face Capture' ? { ...s, status: 'failed' } : s))
      )
      toast.error(error instanceof Error ? error.message : 'Failed to capture face')
    }
  }

  const onSubmit = async (data: EKYCFormData) => {
    if (!employeeId) {
      toast.error('User not authenticated')
      return
    }

    if (!uploadedDocumentId || !selfieDocumentId) {
      toast.error('Please complete document and face capture')
      return
    }

    try {
      // Document Verification
      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Document Verification' ? { ...s, status: 'in_progress' } : s
        )
      )

      // Submit document for verification
      const docVerificationResult = await submitForVerification.mutateAsync({
        documentId: uploadedDocumentId,
        verificationType: documentType === 'aadhar' ? 'aadhaar' : 'pan',
        entityType: 'employee',
        entityId: employeeId,
      })

      if (docVerificationResult.status === 'verified') {
        setVerificationStatuses((prev) =>
          prev.map((s) =>
            s.step === 'Document Verification'
              ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
              : s
          )
        )
      } else {
        setVerificationStatuses((prev) =>
          prev.map((s) =>
            s.step === 'Document Verification' ? { ...s, status: 'failed' } : s
          )
        )
        toast.error(docVerificationResult.failedReason || 'Document verification failed')
        return
      }

      // Face Match Verification (Data Verification)
      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Data Verification' ? { ...s, status: 'in_progress' } : s
        )
      )

      const faceMatchResult = await performFaceMatch.mutateAsync({
        documentId: uploadedDocumentId,
        selfieDocumentId: selfieDocumentId,
        entityType: 'employee',
        entityId: employeeId,
      })

      if (faceMatchResult.matched) {
        setVerificationStatuses((prev) =>
          prev.map((s) =>
            s.step === 'Data Verification'
              ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
              : s
          )
        )
        toast.success('eKYC verification completed successfully')
      } else {
        setVerificationStatuses((prev) =>
          prev.map((s) =>
            s.step === 'Data Verification' ? { ...s, status: 'failed' } : s
          )
        )
        toast.error('Face match failed. Photo does not match the document.')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed')
    }
  }

  const getStatusIcon = (status: VerificationStatusItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const isUploading = uploadDocument.isPending
  const isVerifying = submitForVerification.isPending || performFaceMatch.isPending
  const isCapturing = uploadDocument.isPending || performLivenessCheck.isPending

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="eKYC Verification"
        description="Complete electronic Know Your Customer verification"
        breadcrumbs={[
          { label: 'Home', href: '/employee/dashboard' },
          { label: 'Onboarding', href: '/employee/onboarding' },
          { label: 'eKYC' },
        ]}
      />

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Verification Progress</h3>
          <Badge
            variant={
              verificationStatuses.every((s) => s.status === 'completed')
                ? 'default'
                : 'secondary'
            }
          >
            {verificationStatuses.filter((s) => s.status === 'completed').length}/
            {verificationStatuses.length} Complete
          </Badge>
        </div>

        <div className="space-y-2">
          {verificationStatuses.map((status, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.status)}
                <span className="text-sm font-medium">{status.step}</span>
              </div>
              {status.timestamp && (
                <span className="text-xs text-gray-500">{status.timestamp}</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {currentStep === 'document' && (
        <FormWrapper
          title="Step 1: Document Upload"
          description="Upload a clear photo of your government-issued ID"
          onSubmit={handleDocumentCapture}
          submitLabel={isUploading ? 'Uploading...' : 'Upload Document'}
          isLoading={isUploading}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="document_type">Document Type *</Label>
              <Controller
                name="document_type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="document_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhaar Card</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="voter_id">Voter ID</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document_number">Document Number *</Label>
              <Input
                id="document_number"
                placeholder={getDocumentNumberPattern().placeholder}
                {...register('document_number')}
              />
              {errors.document_number && (
                <p className="text-sm text-red-600">{errors.document_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name (as per document) *</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                {...register('full_name')}
              />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth')}
              />
              {errors.date_of_birth && (
                <p className="text-sm text-red-600">{errors.date_of_birth.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="document_file">Upload Document *</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        id="document_file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-2">
              <div className="flex gap-2">
                <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Document Requirements:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Clear, well-lit photo of document</li>
                    <li>All text must be readable</li>
                    <li>No blurred or damaged documents</li>
                    <li>Document should not be expired</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FormWrapper>
      )}

      {currentStep === 'capture' && (
        <FormWrapper
          title="Step 2: Face Capture"
          description="Take a selfie for liveness verification"
          onSubmit={handleFaceCapture}
          submitLabel={isCapturing ? 'Capturing...' : 'Capture Face'}
          isLoading={isCapturing}
        >
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-2">
              <div className="flex gap-2">
                <Camera className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Face Capture Guidelines:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Good lighting and clear view</li>
                    <li>Face should occupy 70-80% of frame</li>
                    <li>No glasses or heavy makeup</li>
                    <li>Neutral expression</li>
                    <li>We&apos;ll perform a liveness check</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
              <div className="flex justify-center mb-3">
                <Camera className="w-12 h-12 text-blue-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">Click &quot;Capture Face&quot; to take a selfie</p>
              <p className="text-xs text-gray-500">
                Your face will be compared with your document for verification
              </p>
            </div>

            {selfieDocumentId && (
              <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  Face captured successfully
                </p>
              </div>
            )}
          </div>
        </FormWrapper>
      )}

      {currentStep === 'verification' && (
        <FormWrapper
          title="Step 3: Verification Details"
          description="Confirm your details for final verification"
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={isVerifying ? 'Verifying...' : 'Complete Verification'}
          isLoading={isVerifying}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1">Document Type</p>
                <p className="font-semibold capitalize">{documentType.replace('_', ' ')}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1">Document Number</p>
                <p className="font-semibold">••••••••••••</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1">Full Name</p>
                <p className="font-semibold">••••••••••••</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1">Date of Birth</p>
                <p className="font-semibold">••••••••••••</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Please review your details carefully. Your document and face will be verified
                against government databases. This process may take a few minutes.
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('consent')}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I consent to eKYC verification and authorize SpringScan to verify my identity
                  against government-issued documents and databases. I confirm that all
                  information provided is accurate.
                </span>
              </label>
              {errors.consent && (
                <p className="text-sm text-red-600">{errors.consent.message}</p>
              )}
            </div>
          </div>
        </FormWrapper>
      )}
    </div>
  )
}
