'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Sparkles, Calendar, CreditCard, FileText, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function OnboardingCompletePage() {
  const router = useRouter();
  const userName = 'Navin';
  const companyName = 'Amnic.in';
  const startDate = '28/Jan/2023';

  useEffect(() => {
    // Trigger confetti animation
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
        colors: ['#642DFC', '#22C55E', '#FCD34D', '#F472B6'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#642DFC', '#22C55E', '#FCD34D', '#F472B6'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const nextSteps = [
    {
      icon: Calendar,
      title: 'Your first day',
      description: `Your employment starts on ${startDate}. Make sure to log in on your first day!`,
    },
    {
      icon: CreditCard,
      title: 'First paycheck',
      description: 'Your first payday will be on 03/Feb/2023 covering days worked since start.',
    },
    {
      icon: FileText,
      title: 'Complete your profile',
      description: 'Add your photo and review your profile information in the settings.',
    },
    {
      icon: Users,
      title: 'Meet your team',
      description: 'Check out the company directory to meet your new colleagues.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center p-6">
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

        {/* Congratulations Message */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            Congratulations, {userName}!
          </h1>
          <p className="text-xl text-gray-600">
            You've successfully completed your onboarding
          </p>
          <p className="text-gray-500">
            Welcome to <span className="font-semibold text-primary">{companyName}</span>! We're excited to have you on board.
          </p>
        </div>

        {/* Completion Badge */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
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

        {/* What's Next */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 text-center">What's next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="border-gray-200 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
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

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => router.push('/employee/dashboard')}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500">
          Need help? Contact us at{' '}
          <a href="mailto:support@rapid.one" className="text-primary hover:underline">
            support@rapid.one
          </a>
        </p>
      </div>
    </div>
  );
}
