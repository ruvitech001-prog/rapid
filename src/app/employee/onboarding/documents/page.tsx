'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, FormWrapper } from '@/components/templates'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  PenTool,
} from 'lucide-react'
import { toast } from 'sonner'

const documentsSchema = z.object({
  agreement_type: z.enum([
    'employment_agreement',
    'confidentiality',
    'ip_assignment',
    'non_compete',
  ]),
  read_and_understood: z.boolean().refine((val) => val === true, 'Must confirm understanding'),
  signature_consent: z.boolean().refine((val) => val === true, 'Signature consent required'),
})

type DocumentsFormData = z.infer<typeof documentsSchema>

interface Document {
  id: string
  name: string
  type: 'employment_agreement' | 'confidentiality' | 'ip_assignment' | 'non_compete'
  status: 'pending' | 'sent' | 'signed' | 'failed'
  sent_at?: string
  signed_at?: string
  pages: number
}

const DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: 'Employment Agreement',
    type: 'employment_agreement',
    status: 'pending',
    pages: 8,
  },
  {
    id: 'doc-002',
    name: 'Confidentiality Agreement',
    type: 'confidentiality',
    status: 'pending',
    pages: 4,
  },
  {
    id: 'doc-003',
    name: 'Intellectual Property Assignment',
    type: 'ip_assignment',
    status: 'pending',
    pages: 3,
  },
  {
    id: 'doc-004',
    name: 'Non-Compete Agreement',
    type: 'non_compete',
    status: 'pending',
    pages: 2,
  },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(DOCUMENTS)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [signingInProgress, setSigningInProgress] = useState<string | null>(null)
  const [showSignatureFlow, setShowSignatureFlow] = useState(false)
  const [isSubmittingAll, setIsSubmittingAll] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      agreement_type: 'employment_agreement',
      read_and_understood: false,
      signature_consent: false,
    },
  })

  const handleSendForSignature = async (doc: Document) => {
    try {
      setSigningInProgress(doc.id)
      setSelectedDocument(doc)
      setShowSignatureFlow(true)

      await new Promise((resolve) => setTimeout(resolve, 1200))

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id
            ? {
                ...d,
                status: 'sent',
                sent_at: new Date().toLocaleTimeString(),
              }
            : d
        )
      )

      toast.success(`${doc.name} sent for signature`)
    } catch (error) {
      console.error('Error sending document:', error)
      toast.error('Failed to send document')
    } finally {
      setSigningInProgress(null)
      setTimeout(() => setShowSignatureFlow(false), 500)
    }
  }

  const handleSignDocument = async (doc: Document) => {
    try {
      setSigningInProgress(doc.id)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id
            ? {
                ...d,
                status: 'signed',
                signed_at: new Date().toLocaleTimeString(),
              }
            : d
        )
      )

      toast.success(`${doc.name} signed successfully`)
    } catch (error) {
      console.error('Error signing document:', error)
      toast.error('Failed to sign document')
    } finally {
      setSigningInProgress(null)
    }
  }

  const onSubmit = async () => {
    try {
      setIsSubmittingAll(true)

      const unsignedDocs = documents.filter((d) => d.status !== 'signed')
      if (unsignedDocs.length > 0) {
        toast.error('All documents must be signed before completion')
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('All documents signed successfully!')
      reset()
    } catch (error) {
      console.error('Error submitting documents:', error)
      toast.error('Failed to complete document signing')
    } finally {
      setIsSubmittingAll(false)
    }
  }

  const getDocumentIcon = (status: Document['status']) => {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'sent':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-100 text-green-800">Signed</Badge>
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">Pending Signature</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const completedCount = documents.filter((d) => d.status === 'signed').length
  const totalCount = documents.length

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Document Signing"
        description="Review and sign required employment documents"
        breadcrumbs={[
          { label: 'Home', href: '/employee/dashboard' },
          { label: 'Onboarding', href: '/employee/onboarding' },
          { label: 'Documents' },
        ]}
      />

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Document Status</h3>
          <Badge variant={completedCount === totalCount ? 'default' : 'secondary'}>
            {completedCount}/{totalCount} Signed
          </Badge>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </Card>

      <FormWrapper
        title="Sign Documents"
        description="Review and electronically sign all required documents using Zoho Sign"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={
          isSubmittingAll ? 'Completing...' : completedCount === totalCount ? 'Complete' : 'Review'
        }
        isLoading={isSubmittingAll}
      >
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-2">
            <div className="flex gap-2">
              <PenTool className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About Zoho Sign:</p>
                <p>
                  We use Zoho Sign for secure, legally binding electronic signatures. Each
                  document will be sent to your email for secure signature.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getDocumentIcon(doc.status)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.pages} pages</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Preview
                    </Button>

                    {doc.status === 'pending' && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSendForSignature(doc)}
                        disabled={signingInProgress === doc.id}
                        className="flex items-center gap-2"
                      >
                        {signingInProgress === doc.id ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <PenTool className="w-4 h-4" />
                            Send for Signature
                          </>
                        )}
                      </Button>
                    )}

                    {doc.status === 'sent' && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSignDocument(doc)}
                        disabled={signingInProgress === doc.id}
                        className="flex items-center gap-2"
                      >
                        {signingInProgress === doc.id ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin" />
                            Signing...
                          </>
                        ) : (
                          <>
                            <PenTool className="w-4 h-4" />
                            Sign Now
                          </>
                        )}
                      </Button>
                    )}

                    {doc.status === 'signed' && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Signed at {doc.signed_at}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {showSignatureFlow && selectedDocument && (
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-900">Signing Flow</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>
                    ✓ Document sent to your registered email (
                    <span className="font-medium">your.email@company.com</span>)
                  </p>
                  <p>✓ Click the link in the email to open Zoho Sign</p>
                  <p>✓ Review the document</p>
                  <p>✓ Draw your signature or upload a signature image</p>
                  <p>✓ Complete the signature process</p>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...{
                  name: 'read_and_understood',
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      // Form update handled by Controller
                    }
                  },
                }}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">
                I have read and understood all the documents and their terms and conditions.
              </span>
            </label>
            {errors.read_and_understood && (
              <p className="text-sm text-red-600">{errors.read_and_understood.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...{
                  name: 'signature_consent',
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      // Form update handled by Controller
                    }
                  },
                }}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">
                I authorize the use of my electronic signature and agree that it is legally
                binding and valid.
              </span>
            </label>
            {errors.signature_consent && (
              <p className="text-sm text-red-600">{errors.signature_consent.message}</p>
            )}
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                All documents must be signed before you can proceed to the next step of
                onboarding.
              </p>
            </div>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}
