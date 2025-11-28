'use client'

import { useState } from 'react'
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

const eKYCSchema = z.object({
  document_type: z.enum(['aadhar', 'passport', 'driving_license', 'voter_id']),
  document_number: z.string().min(6, 'Valid document number required'),
  full_name: z.string().min(2, 'Full name required'),
  date_of_birth: z.string().min(1, 'Date of birth required'),
  consent: z.boolean().refine((val) => val === true, 'Consent required to proceed'),
})

type EKYCFormData = z.infer<typeof eKYCSchema>

interface VerificationStatus {
  step: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  timestamp?: string
}

export default function EKYCPage() {
  const [currentStep, setCurrentStep] = useState<'document' | 'capture' | 'verification'>('document')
  const [verificationStatuses, setVerificationStatuses] = useState<VerificationStatus[]>([
    { step: 'Document Upload', status: 'pending' },
    { step: 'Face Capture', status: 'pending' },
    { step: 'Liveness Check', status: 'pending' },
    { step: 'Document Verification', status: 'pending' },
    { step: 'Data Verification', status: 'pending' },
  ])
  const [isVerifying, setIsVerifying] = useState(false)
  const [capturedImageFile, setCapturedImageFile] = useState<File | null>(null)
  const [capturedFaceFile, setCapturedFaceFile] = useState<File | null>(null)

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

  const handleDocumentCapture = async () => {
    try {
      setVerificationStatuses((prev) =>
        prev.map((s) => (s.step === 'Document Upload' ? { ...s, status: 'in_progress' } : s))
      )

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockFile = new File(
        ['mock-document-image'],
        `document-${Date.now()}.jpg`,
        { type: 'image/jpeg' }
      )
      setCapturedImageFile(mockFile)

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Document Upload'
            ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
            : s
        )
      )

      toast.success('Document captured successfully')
      setCurrentStep('capture')
    } catch (error) {
      setVerificationStatuses((prev) =>
        prev.map((s) => (s.step === 'Document Upload' ? { ...s, status: 'failed' } : s))
      )
      toast.error('Failed to capture document')
    }
  }

  const handleFaceCapture = async () => {
    try {
      setVerificationStatuses((prev) =>
        prev.map((s) => (s.step === 'Face Capture' ? { ...s, status: 'in_progress' } : s))
      )

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockFile = new File(['mock-face-image'], `face-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })
      setCapturedFaceFile(mockFile)

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Face Capture'
            ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
            : s
        )
      )

      toast.success('Face captured successfully')

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Liveness Check' ? { ...s, status: 'in_progress' } : s
        )
      )

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Liveness Check'
            ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
            : s
        )
      )

      toast.success('Liveness check completed')
      setCurrentStep('verification')
    } catch (error) {
      setVerificationStatuses((prev) =>
        prev.map((s) => (s.step === 'Face Capture' ? { ...s, status: 'failed' } : s))
      )
      toast.error('Failed to capture face')
    }
  }

  const onSubmit = async (_data: EKYCFormData) => {
    try {
      if (!capturedImageFile || !capturedFaceFile) {
        toast.error('Please complete document and face capture')
        return
      }

      setIsVerifying(true)

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Document Verification' ? { ...s, status: 'in_progress' } : s
        )
      )

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Document Verification'
            ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
            : s
        )
      )

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Data Verification' ? { ...s, status: 'in_progress' } : s
        )
      )

      await new Promise((resolve) => setTimeout(resolve, 1200))

      setVerificationStatuses((prev) =>
        prev.map((s) =>
          s.step === 'Data Verification'
            ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
            : s
        )
      )

      toast.success('eKYC verification completed successfully')
    } catch (error) {
      console.error('Error during verification:', error)
      toast.error('Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = (status: VerificationStatus['status']) => {
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
          submitLabel={
            verificationStatuses.find((s) => s.step === 'Document Upload')?.status === 'in_progress'
              ? 'Capturing...'
              : 'Capture Document'
          }
          isLoading={
            verificationStatuses.find((s) => s.step === 'Document Upload')?.status === 'in_progress'
          }
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

            {capturedImageFile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  Document captured: {capturedImageFile.name}
                </p>
              </div>
            )}
          </div>
        </FormWrapper>
      )}

      {currentStep === 'capture' && (
        <FormWrapper
          title="Step 2: Face Capture"
          description="Take a selfie for liveness verification"
          onSubmit={handleFaceCapture}
          submitLabel={
            verificationStatuses.find((s) => s.step === 'Face Capture')?.status === 'in_progress'
              ? 'Capturing...'
              : 'Capture Face'
          }
          isLoading={
            verificationStatuses.find((s) => s.step === 'Face Capture')?.status === 'in_progress'
          }
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
                    <li>We'll perform a liveness check</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
              <div className="flex justify-center mb-3">
                <Camera className="w-12 h-12 text-blue-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">Click "Capture Face" to take a selfie</p>
              <p className="text-xs text-gray-500">
                Your face will be compared with your document for verification
              </p>
            </div>

            {capturedFaceFile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  Face captured: {capturedFaceFile.name}
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
