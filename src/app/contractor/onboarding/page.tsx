'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ChevronRight, MessageSquare, HelpCircle, Info, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingProgress, OnboardingChecklist, OnboardingStep } from '@/components/onboarding';

export default function ContractorOnboardingPage() {
  const router = useRouter();
  const userName = 'Alex';
  const clientName = 'Acme Inc.';
  const projectName = 'Website Redesign';

  const [onboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'account',
      title: 'Step 1: Create your account',
      description: 'Completed on 10/Jan/2023',
      status: 'completed',
      icon: 'user',
    },
    {
      id: 'contract',
      title: 'Step 2: Review & sign contract',
      description: 'Review terms and sign your contract',
      status: 'pending',
      icon: 'pen',
      href: '/contractor/onboarding/contract',
    },
    {
      id: 'details',
      title: 'Step 3: Submit personal details',
      description: 'Bank account, tax info, and identity',
      status: 'pending',
      icon: 'file',
      href: '/contractor/onboarding/details',
    },
    {
      id: 'verification',
      title: 'Step 4: Identity verification',
      description: 'Verify your identity for payments',
      status: 'pending',
      icon: 'shield',
      href: '/contractor/onboarding/verification',
    },
  ]);

  const completedSteps = onboardingSteps.filter(s => s.status === 'completed').length;
  const totalSteps = onboardingSteps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const handleStartStep = (stepId: string) => {
    const step = onboardingSteps.find(s => s.id === stepId);
    if (step?.href) {
      router.push(step.href);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hey {userName}!</h1>
        <p className="text-gray-500 mt-1">Welcome to Rapid</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome Card */}
          <Card className="bg-cyan-50 border-cyan-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contract Preview */}
              <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Contractor Agreement</p>
                    <p className="text-sm text-gray-500">{clientName} - {projectName}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/contractor/onboarding/contract')}
                >
                  Review
                </Button>
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Rate</p>
                    <p className="font-medium text-gray-900">$75/hour</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">6 months</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Review your contract details and complete the onboarding to start submitting timesheets and getting paid.
              </p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p>Once your onboarding is complete:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Submit timesheets weekly or monthly</li>
                    <li>Invoices are generated automatically</li>
                    <li>Payments processed within 3-5 business days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Contractor Guide</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Live Support</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Questions? Contact us at{' '}
                <a href="mailto:contractors@rapid.one" className="text-primary hover:underline">
                  contractors@rapid.one
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <OnboardingProgress percentage={progressPercentage} />
                <div>
                  <p className="text-gray-900">
                    <span className="font-semibold">{progressPercentage}%</span> complete
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete all steps to start working with {clientName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Onboarding checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <OnboardingChecklist
                steps={onboardingSteps}
                onStartStep={handleStartStep}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Chat */}
      <div className="fixed bottom-8 right-8 z-40">
        <button className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition">
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
