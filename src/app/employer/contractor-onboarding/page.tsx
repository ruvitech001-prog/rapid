/**
 * Contractor Onboarding Hub
 * Landing page for contractor onboarding process
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/templates'
import { ArrowRight, UserCheck, FileText, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function ContractorOnboardingPage() {
  const steps = [
    {
      number: 1,
      title: 'Personal Details',
      description: 'Provide your basic information and contract details',
      icon: UserCheck,
      href: '/employer/contractor-onboarding/personal',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      number: 2,
      title: 'Tax & Compliance',
      description: 'Complete tax information and banking details',
      icon: FileText,
      href: '/employer/contractor-onboarding/tax',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      number: 3,
      title: 'Payment Setup',
      description: 'Configure payment preferences and schedule',
      icon: CreditCard,
      href: '/employer/contractor-onboarding/payment',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Contractor Onboarding"
        description="Complete your contractor profile setup in 3 steps"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Contractor Onboarding' },
        ]}
      />

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <Card key={step.number} className={`${step.color} border`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center font-bold text-lg mb-3`}>
                      {step.number}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                  <Icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{step.description}</p>
                <Link href={step.href}>
                  <Button variant="outline" className="w-full gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Information Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">About Contractor Onboarding</h3>
          <p className="text-sm text-blue-800">
            Complete all three steps to finalize your contractor profile. You can save your progress and return anytime.
            All information is securely encrypted and complies with local regulations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
