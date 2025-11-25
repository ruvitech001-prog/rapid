'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ChevronRight, MessageSquare, HelpCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingProgress, OnboardingChecklist, OnboardingStep } from '@/components/onboarding';

export default function EmployeeOnboardingPage() {
  const router = useRouter();
  const userName = 'Navin';
  const companyName = 'Amnic.in';
  const role = 'UI/UX Designer';

  const [onboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'account',
      title: 'Step 1: Create your employee account',
      description: 'Completed on 29/Dec/2022',
      status: 'completed',
      icon: 'user',
    },
    {
      id: 'details',
      title: 'Step 2: Submit additional details',
      description: 'Complete by 26/Jan/2023',
      status: 'pending',
      icon: 'file',
      href: '/employee/onboarding/details',
    },
    {
      id: 'identity',
      title: 'Step 3: Identity verification',
      description: 'Complete by 26/Jan/2023',
      status: 'pending',
      icon: 'shield',
      href: '/employee/onboarding/ekyc',
    },
    {
      id: 'documents',
      title: 'Step 4: Upload documents',
      description: 'Complete by 26/Jan/2023',
      status: 'pending',
      icon: 'upload',
      href: '/employee/onboarding/documents',
    },
    {
      id: 'agreement',
      title: 'Step 5: Sign your employment agreement',
      description: 'Complete by 26/Jan/2023',
      status: 'pending',
      icon: 'pen',
      href: '/employee/onboarding/agreement',
    },
    {
      id: 'bgv',
      title: 'Step 6: Background verification',
      description: 'Complete by 26/Jan/2023',
      status: 'pending',
      icon: 'search',
      href: '/employee/onboarding/bgv',
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
        <p className="text-gray-500 mt-1">Welcome aboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Welcome Card & Help */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome to Rapid Card */}
          <Card className="bg-amber-50 border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Welcome to Rapid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Offer Letter Preview */}
              <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Offer Letter</p>
                    <p className="text-sm text-gray-500">{role}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/employee/onboarding/offer-letter')}
                >
                  View
                </Button>
              </div>

              {/* Congratulations Message */}
              <div>
                <p className="font-semibold text-gray-900">
                  Congratulations on your new role at {companyName}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Here, at Rapid, we'll make sure you have the best employee
                  experience - it's where you'll sign your contract, get paid,
                  manage expense and requests, access our benefits and all
                  employee paperwork.
                </p>
                <p className="text-sm text-gray-600 mt-3">Happy onboarding!</p>
              </div>
            </CardContent>
          </Card>

          {/* Payday Info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payday</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Upon onboarding completion, your first payday will be on{' '}
                  <span className="font-medium">03/Feb/2023</span> and will cover pay for days worked since your start date.
                </p>
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
                    <p className="font-medium text-gray-900">Knowledge repository</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Live chat</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-500">
                For any further assistance, please reach out to us via{' '}
                <a href="mailto:support@rapid.one" className="text-primary hover:underline">
                  support@rapid.one
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Progress & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <OnboardingProgress percentage={progressPercentage} />
                <div>
                  <p className="text-gray-900">
                    Great! <span className="font-semibold">{progressPercentage}%</span> of your onboarding is complete.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalSteps - completedSteps} more step{totalSteps - completedSteps !== 1 ? 's' : ''} to go and you'll be able to start your employment. Don't forget to complete it before{' '}
                    <span className="font-medium">29/Jan/2023</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Card */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your onboarding checklist</CardTitle>
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

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition">
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
