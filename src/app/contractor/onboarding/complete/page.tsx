'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Sparkles, Clock, FileText, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function ContractorOnboardingCompletePage() {
  const router = useRouter();
  const clientName = 'Acme Inc.';

  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#642DFC', '#22C55E', '#06B6D4', '#F59E0B'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#642DFC', '#22C55E', '#06B6D4', '#F59E0B'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const nextSteps = [
    {
      icon: Clock,
      title: 'Submit timesheets',
      description: 'Log your hours weekly to track your work and get paid.',
      action: () => router.push('/contractor/timesheets/submit'),
    },
    {
      icon: FileText,
      title: 'View invoices',
      description: 'Access auto-generated invoices based on your timesheets.',
      action: () => router.push('/contractor/invoices'),
    },
    {
      icon: DollarSign,
      title: 'Payment history',
      description: 'Track all your payments and download receipts.',
      action: () => router.push('/contractor/payments'),
    },
    {
      icon: BarChart3,
      title: 'View analytics',
      description: 'See your earnings breakdown and performance metrics.',
      action: () => router.push('/contractor/analytics'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            You're ready to go!
          </h1>
          <p className="text-xl text-gray-600">
            Your contractor profile is complete
          </p>
          <p className="text-gray-500">
            You can now start working with <span className="font-semibold text-primary">{clientName}</span>.
            Submit your timesheets to get paid!
          </p>
        </div>

        {/* Completion Badge */}
        <Card className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-white/80 text-sm">Onboarding Status</p>
                <p className="text-xl font-bold">100% Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">How payments work:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p className="text-sm text-gray-600">Submit your timesheet by end of each week/month</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p className="text-sm text-gray-600">Client reviews and approves your hours</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p className="text-sm text-gray-600">Invoice is auto-generated and payment is processed</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">4</span>
              </div>
              <p className="text-sm text-gray-600">Receive funds in your bank within 3-5 business days</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 text-center">Get started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200 hover:border-cyan-300 cursor-pointer transition-all hover:shadow-md"
                  onClick={step.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Go to Dashboard */}
        <div className="flex justify-center">
          <Button
            onClick={() => router.push('/contractor/dashboard')}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Need help? Contact us at{' '}
          <a href="mailto:contractors@rapid.one" className="text-primary hover:underline">
            contractors@rapid.one
          </a>
        </p>
      </div>
    </div>
  );
}
