'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, FileText, Settings, ChevronRight, HelpCircle, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingProgress, OnboardingChecklist, OnboardingStep } from '@/components/onboarding';

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const companyName = 'Acme Inc.';
  const userName = 'John';

  const [onboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'company',
      title: 'Step 1: Complete company profile',
      description: 'Completed on 15/Jan/2023',
      status: 'completed',
      icon: 'file',
    },
    {
      id: 'compliance',
      title: 'Step 2: Set up compliance',
      description: 'Add statutory details - PF, ESI, PT',
      status: 'pending',
      icon: 'shield',
      href: '/employer/onboarding/setup?step=compliance',
    },
    {
      id: 'payroll',
      title: 'Step 3: Configure payroll',
      description: 'Set up salary structures and pay schedules',
      status: 'pending',
      icon: 'file',
      href: '/employer/onboarding/setup?step=payroll',
    },
    {
      id: 'team',
      title: 'Step 4: Invite your team',
      description: 'Add employees and contractors',
      status: 'pending',
      icon: 'user',
      href: '/employer/onboarding/setup?step=team',
    },
    {
      id: 'payment',
      title: 'Step 5: Set up payment method',
      description: 'Add bank account for payroll processing',
      status: 'pending',
      icon: 'file',
      href: '/employer/onboarding/setup?step=payment',
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

  const quickActions = [
    { icon: Users, label: 'Add Employee', href: '/employer/team/add' },
    { icon: FileText, label: 'Run Payroll', href: '/employer/payroll/run' },
    { icon: Settings, label: 'Settings', href: '/employer/settings' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {userName}!</h1>
        <p className="text-gray-500 mt-1">Let's get {companyName} set up on Rapid</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <OnboardingProgress percentage={progressPercentage} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Company Setup Progress</h3>
                  <p className="text-gray-600 mt-1">
                    {completedSteps} of {totalSteps} steps completed. Complete all steps to start
                    running payroll for your team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <OnboardingChecklist
                steps={onboardingSteps}
                onStartStep={handleStartStep}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200 hover:border-primary/30 cursor-pointer transition-colors"
                  onClick={() => router.push(action.href)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium text-gray-900">{action.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                {companyName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium text-amber-600">Setup in Progress</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Employees</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-medium">Pro (Trial)</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push('/employer/company')}
              >
                View Company Profile
              </Button>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Getting Started Guide</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Compliance Checklist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Contact Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </CardContent>
          </Card>

          {/* Help Note */}
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="p-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Need help?</span> Our team is available 24/7 to
                assist you with the setup process. Reach out to{' '}
                <a href="mailto:support@rapid.one" className="underline">
                  support@rapid.one
                </a>
              </p>
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
