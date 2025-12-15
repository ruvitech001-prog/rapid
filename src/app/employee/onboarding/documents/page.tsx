'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, FormWrapper } from '@/components/templates'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  PenTool,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { useEmployeeProfile } from '@/lib/hooks'
import {
  useOnboardingDocuments,
  useEnsureOnboardingDocuments,
  useSendForSignature,
  useSignDocument,
  useCompleteOnboardingDocuments,
} from '@/lib/hooks'

const documentsSchema = z.object({
  read_and_understood: z.boolean().refine((val) => val === true, 'Must confirm understanding'),
  signature_consent: z.boolean().refine((val) => val === true, 'Signature consent required'),
})

type DocumentsFormData = z.infer<typeof documentsSchema>

interface OnboardingDocument {
  id: string
  file_name: string
  document_type: string
  signature_status?: string | null
  is_signed?: boolean | null
  signed_at?: string | null
  signature_sent_at?: string | null
}

const getDocumentDisplayName = (docType: string): string => {
  const names: Record<string, string> = {
    employment_agreement: 'Employment Agreement',
    confidentiality: 'Confidentiality Agreement',
    ip_assignment: 'Intellectual Property Assignment',
    non_compete: 'Non-Compete Agreement',
    offer_letter: 'Offer Letter',
    appointment_letter: 'Appointment Letter',
  }
  return names[docType] || docType
}

const getDocumentPages = (docType: string): number => {
  const pages: Record<string, number> = {
    employment_agreement: 8,
    confidentiality: 4,
    ip_assignment: 3,
    non_compete: 2,
    offer_letter: 2,
    appointment_letter: 3,
  }
  return pages[docType] || 1
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const employeeId = user?.id
  const { data: profile } = useEmployeeProfile(employeeId)

  const [readAndUnderstood, setReadAndUnderstood] = useState(false)
  const [signatureConsent, setSignatureConsent] = useState(false)
  const [signingDocId, setSigningDocId] = useState<string | null>(null)

  // Hooks
  const { data: documents = [], isLoading, refetch } = useOnboardingDocuments(employeeId)
  const ensureDocuments = useEnsureOnboardingDocuments()
  const sendForSignature = useSendForSignature()
  const signDocument = useSignDocument()
  const completeOnboarding = useCompleteOnboardingDocuments()

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      read_and_understood: false,
      signature_consent: false,
    },
  })

  // Ensure documents exist on mount
  useEffect(() => {
    if (employeeId && profile?.company_id && documents.length === 0 && !isLoading) {
      ensureDocuments.mutate(
        { employeeId, companyId: profile.company_id },
        {
          onSuccess: () => {
            refetch()
          },
        }
      )
    }
  }, [employeeId, profile?.company_id, documents.length, isLoading, ensureDocuments, refetch])

  const handleSendForSignature = async (doc: OnboardingDocument) => {
    if (!employeeId || !user?.email) {
      toast.error('User not authenticated')
      return
    }

    try {
      setSigningDocId(doc.id)
      await sendForSignature.mutateAsync({
        documentId: doc.id,
        employeeEmail: user.email,
        employeeId,
      })
      toast.success(`${getDocumentDisplayName(doc.document_type)} sent for signature`)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send document')
    } finally {
      setSigningDocId(null)
    }
  }

  const handleSignDocument = async (doc: OnboardingDocument) => {
    if (!employeeId || !user?.email) {
      toast.error('User not authenticated')
      return
    }

    try {
      setSigningDocId(doc.id)
      await signDocument.mutateAsync({
        documentId: doc.id,
        signerId: employeeId,
        signerName: profile?.full_name || user.email,
        signerEmail: user.email,
        employeeId,
      })
      toast.success(`${getDocumentDisplayName(doc.document_type)} signed successfully`)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign document')
    } finally {
      setSigningDocId(null)
    }
  }

  const onSubmit = async () => {
    if (!employeeId) {
      toast.error('User not authenticated')
      return
    }

    const unsignedDocs = documents.filter((d) => !d.is_signed)
    if (unsignedDocs.length > 0) {
      toast.error('All documents must be signed before completion')
      return
    }

    try {
      await completeOnboarding.mutateAsync({ employeeId })
      toast.success('All documents signed successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to complete document signing')
    }
  }

  const getDocumentStatus = (doc: OnboardingDocument): 'pending' | 'sent' | 'signed' => {
    if (doc.is_signed) return 'signed'
    if (doc.signature_status === 'sent') return 'sent'
    return 'pending'
  }

  const getDocumentIcon = (status: 'pending' | 'sent' | 'signed') => {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'sent':
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: 'pending' | 'sent' | 'signed') => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-100 text-green-800">Signed</Badge>
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">Pending Signature</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const completedCount = documents.filter((d) => d.is_signed).length
  const totalCount = documents.length || 4

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          ></div>
        </div>
      </Card>

      <FormWrapper
        title="Sign Documents"
        description="Review and electronically sign all required documents using Zoho Sign"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={
          completeOnboarding.isPending
            ? 'Completing...'
            : completedCount === totalCount
              ? 'Complete'
              : 'Review'
        }
        isLoading={completeOnboarding.isPending}
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
            {documents.map((doc) => {
              const status = getDocumentStatus(doc)
              const isProcessing = signingDocId === doc.id

              return (
                <Card key={doc.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getDocumentIcon(status)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {getDocumentDisplayName(doc.document_type)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {getDocumentPages(doc.document_type)} pages
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">{getStatusBadge(status)}</div>
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

                      {status === 'pending' && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSendForSignature(doc)}
                          disabled={isProcessing}
                          className="flex items-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
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

                      {status === 'sent' && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSignDocument(doc)}
                          disabled={isProcessing}
                          className="flex items-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
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

                      {status === 'signed' && doc.signed_at && (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Signed at {new Date(doc.signed_at).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {documents.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                Documents will be generated for your onboarding process.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={readAndUnderstood}
                onChange={(e) => setReadAndUnderstood(e.target.checked)}
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
                checked={signatureConsent}
                onChange={(e) => setSignatureConsent(e.target.checked)}
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
