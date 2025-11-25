'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, FormWrapper } from '@/components/templates'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  User,
  Briefcase,
} from 'lucide-react'
import { toast } from 'sonner'

const bgvSchema = z.object({
  consent_given: z.boolean().refine((val) => val === true, 'BGV consent required'),
  authorization_given: z.boolean().refine((val) => val === true, 'Authorization required'),
})

type BGVFormData = z.infer<typeof bgvSchema>

interface BGVCheckStatus {
  check_type: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  initiated_date?: string
  completed_date?: string
  result?: 'passed' | 'failed' | 'pending'
}

const INITIAL_BGV_CHECKS: BGVCheckStatus[] = [
  {
    check_type: 'Identity Verification',
    status: 'pending',
    result: 'pending',
  },
  {
    check_type: 'Address Verification',
    status: 'pending',
    result: 'pending',
  },
  {
    check_type: 'Education Verification',
    status: 'pending',
    result: 'pending',
  },
  {
    check_type: 'Employment History',
    status: 'pending',
    result: 'pending',
  },
  {
    check_type: 'Criminal Record Check',
    status: 'pending',
    result: 'pending',
  },
]

export default function BGVPage() {
  const [bgvChecks, setBgvChecks] = useState<BGVCheckStatus[]>(INITIAL_BGV_CHECKS)
  const [isInitiating, setIsInitiating] = useState(false)
  const [bgvInitiated, setBgvInitiated] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<BGVFormData>({
    resolver: zodResolver(bgvSchema),
    defaultValues: {
      consent_given: false,
      authorization_given: false,
    },
  })

  const getCheckIcon = (status: BGVCheckStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getResultBadge = (result?: string) => {
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

  const initiateBGV = async () => {
    try {
      setIsInitiating(true)

      // Simulate BGV initiation with progressive status updates
      setBgvChecks((prev) =>
        prev.map((check) => ({
          ...check,
          status: 'in_progress',
          initiated_date: new Date().toLocaleString(),
        }))
      )

      // Simulate checks completing one by one
      const checkTypes = bgvChecks.map((_, i) => i)
      for (const index of checkTypes) {
        await new Promise((resolve) => setTimeout(resolve, 1200))

        setBgvChecks((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            status: 'completed',
            completed_date: new Date().toLocaleTimeString(),
            result: 'passed',
          }
          return updated
        })
      }

      setBgvInitiated(true)
      toast.success('Background verification initiated successfully')
    } catch (error) {
      console.error('Error initiating BGV:', error)
      toast.error('Failed to initiate BGV')
    } finally {
      setIsInitiating(false)
    }
  }

  const onSubmit = async () => {
    try {
      if (!bgvInitiated) {
        toast.error('Please initiate BGV first')
        return
      }

      const allPassed = bgvChecks.every((check) => check.result === 'passed')
      if (!allPassed) {
        toast.error('All BGV checks must pass before completion')
        return
      }

      toast.success('BGV verification completed successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to process BGV')
    }
  }

  const completedChecks = bgvChecks.filter((c) => c.status === 'completed').length

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
        isLoading={isInitiating}
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
                {bgvChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{check.check_type}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consent_given')}
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
                    {...register('authorization_given')}
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
                onClick={initiateBGV}
                disabled={isInitiating}
                className="w-full"
              >
                {isInitiating ? 'Initiating...' : 'Initiate Background Verification'}
              </Button>
            </>
          )}

          {bgvInitiated && (
            <>
              <div className="space-y-3">
                {bgvChecks.map((check, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getCheckIcon(check.status)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{check.check_type}</h4>
                          {check.initiated_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Initiated: {check.initiated_date}
                            </p>
                          )}
                          {check.completed_date && (
                            <p className="text-xs text-gray-500">
                              Completed: {check.completed_date}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>{getResultBadge(check.result)}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {completedChecks === bgvChecks.length && (
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
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
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
