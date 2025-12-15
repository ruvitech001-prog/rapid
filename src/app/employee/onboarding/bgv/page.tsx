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
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Briefcase,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import {
  useBGVChecks,
  useInitiateBGV,
  useProcessBGVCheck,
  useCompleteBGV,
} from '@/lib/hooks'

const bgvSchema = z.object({
  consent_given: z.boolean().refine((val) => val === true, 'BGV consent required'),
  authorization_given: z.boolean().refine((val) => val === true, 'Authorization required'),
})

type BGVFormData = z.infer<typeof bgvSchema>

interface BGVCheckItem {
  id: string
  checkName: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  result: 'pending' | 'passed' | 'failed'
  initiatedAt?: string
  completedAt?: string
}

const DEFAULT_CHECKS: BGVCheckItem[] = [
  { id: 'temp-1', checkName: 'Identity Verification', status: 'pending', result: 'pending' },
  { id: 'temp-2', checkName: 'Address Verification', status: 'pending', result: 'pending' },
  { id: 'temp-3', checkName: 'Education Verification', status: 'pending', result: 'pending' },
  { id: 'temp-4', checkName: 'Employment History', status: 'pending', result: 'pending' },
  { id: 'temp-5', checkName: 'Criminal Record Check', status: 'pending', result: 'pending' },
]

export default function BGVPage() {
  const { user } = useAuth()
  const employeeId = user?.id

  const [consentGiven, setConsentGiven] = useState(false)
  const [authorizationGiven, setAuthorizationGiven] = useState(false)
  const [processingCheckId, setProcessingCheckId] = useState<string | null>(null)

  // Hooks
  const { data: bgvChecksData, isLoading, refetch } = useBGVChecks(employeeId)
  const initiateBGV = useInitiateBGV()
  const processBGVCheck = useProcessBGVCheck()
  const completeBGV = useCompleteBGV()

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<BGVFormData>({
    resolver: zodResolver(bgvSchema),
    defaultValues: {
      consent_given: false,
      authorization_given: false,
    },
  })

  // Map server data to display format
  const bgvChecks: BGVCheckItem[] = bgvChecksData && bgvChecksData.length > 0
    ? bgvChecksData.map((check) => ({
        id: check.id,
        checkName: check.checkName,
        status: check.status,
        result: check.result,
        initiatedAt: check.initiatedAt,
        completedAt: check.completedAt,
      }))
    : DEFAULT_CHECKS

  const bgvInitiated = bgvChecksData && bgvChecksData.length > 0
  const completedChecks = bgvChecks.filter((c) => c.status === 'completed').length
  const allInProgress = bgvChecks.some((c) => c.status === 'in_progress')

  // Auto-process checks when initiated
  useEffect(() => {
    if (bgvInitiated && allInProgress && !processingCheckId) {
      const inProgressCheck = bgvChecks.find((c) => c.status === 'in_progress')
      if (inProgressCheck && employeeId) {
        processNextCheck(inProgressCheck.id)
      }
    }
  }, [bgvInitiated, allInProgress, bgvChecks, employeeId, processingCheckId])

  const processNextCheck = async (checkId: string) => {
    if (!employeeId) return

    try {
      setProcessingCheckId(checkId)
      await processBGVCheck.mutateAsync({ checkId, employeeId })
      await refetch()
    } catch (error) {
      console.error('Error processing BGV check:', error)
    } finally {
      setProcessingCheckId(null)
    }
  }

  const getCheckIcon = (status: BGVCheckItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getResultBadge = (result: BGVCheckItem['result']) => {
    switch (result) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return null
    }
  }

  const handleInitiateBGV = async () => {
    if (!employeeId) {
      toast.error('User not authenticated')
      return
    }

    if (!consentGiven || !authorizationGiven) {
      toast.error('Please provide consent and authorization')
      return
    }

    try {
      await initiateBGV.mutateAsync({ employeeId })
      toast.success('Background verification initiated successfully')
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to initiate BGV')
    }
  }

  const onSubmit = async () => {
    if (!employeeId) {
      toast.error('User not authenticated')
      return
    }

    if (!bgvInitiated) {
      toast.error('Please initiate BGV first')
      return
    }

    const allPassed = bgvChecks.every((check) => check.result === 'passed')
    if (!allPassed) {
      toast.error('All BGV checks must pass before completion')
      return
    }

    try {
      await completeBGV.mutateAsync({ employeeId })
      toast.success('BGV verification completed successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to complete BGV')
    }
  }

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
        title="Background Verification"
        description="Complete your background verification checks"
        breadcrumbs={[
          { label: 'Home', href: '/employee/dashboard' },
          { label: 'Onboarding', href: '/employee/onboarding' },
          { label: 'BGV' },
        ]}
      />

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Verification Status</h3>
          <Badge
            variant={completedChecks === bgvChecks.length ? 'default' : 'secondary'}
          >
            {completedChecks}/{bgvChecks.length} Complete
          </Badge>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedChecks / bgvChecks.length) * 100}%` }}
          ></div>
        </div>
      </Card>

      <FormWrapper
        title="Background Verification"
        description={
          bgvInitiated
            ? 'Review your background verification results'
            : 'Initiate your background verification process'
        }
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={
          bgvInitiated
            ? completedChecks === bgvChecks.length
              ? 'Complete'
              : 'Verifying...'
            : 'Next'
        }
        isLoading={initiateBGV.isPending || completeBGV.isPending}
      >
        <div className="space-y-6">
          {!bgvInitiated && (
            <>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-2">
                <div className="flex gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">About BGV:</p>
                    <p>
                      We conduct comprehensive background verification checks to ensure workplace
                      safety and security. This process includes identity, address, education, and
                      employment history verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Checks to be Performed:</h4>
                {bgvChecks.map((check) => (
                  <div key={check.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{check.checkName}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to the background verification process and authorize the company to
                    collect and process my personal information for this purpose.
                  </span>
                </label>
                {errors.consent_given && (
                  <p className="text-sm text-red-600">{errors.consent_given.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={authorizationGiven}
                    onChange={(e) => setAuthorizationGiven(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I authorize the background verification agency to contact my previous
                    employers, educational institutions, and other relevant authorities to verify
                    my information.
                  </span>
                </label>
                {errors.authorization_given && (
                  <p className="text-sm text-red-600">{errors.authorization_given.message}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleInitiateBGV}
                disabled={initiateBGV.isPending || !consentGiven || !authorizationGiven}
                className="w-full"
              >
                {initiateBGV.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initiating...
                  </>
                ) : (
                  'Initiate Background Verification'
                )}
              </Button>
            </>
          )}

          {bgvInitiated && (
            <>
              <div className="space-y-3">
                {bgvChecks.map((check) => (
                  <Card key={check.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getCheckIcon(check.status)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{check.checkName}</h4>
                          {check.initiatedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Initiated: {new Date(check.initiatedAt).toLocaleString()}
                            </p>
                          )}
                          {check.completedAt && (
                            <p className="text-xs text-gray-500">
                              Completed: {new Date(check.completedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>{getResultBadge(check.result)}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {completedChecks === bgvChecks.length && bgvChecks.every((c) => c.result === 'passed') && (
                <div className="p-4 bg-green-50 border border-green-200 rounded flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Background Verification Complete</p>
                    <p>All checks have been completed successfully. You can now proceed to the next step.</p>
                  </div>
                </div>
              )}

              {completedChecks < bgvChecks.length && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded flex items-start gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Verification In Progress</p>
                    <p>
                      Your background checks are being processed. This typically takes 3-5 working
                      days. You can check back later for updates.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </FormWrapper>
    </div>
  )
}
