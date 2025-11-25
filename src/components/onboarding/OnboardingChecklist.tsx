'use client';

import { CheckCircle2, FileText, User, Shield, Upload, PenLine, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'locked';
  href?: string;
  icon?: 'user' | 'file' | 'shield' | 'upload' | 'pen' | 'search';
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  onStartStep?: (stepId: string) => void;
}

const iconMap = {
  user: User,
  file: FileText,
  shield: Shield,
  upload: Upload,
  pen: PenLine,
  search: Search,
};

export function OnboardingChecklist({ steps, onStartStep }: OnboardingChecklistProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const Icon = step.icon ? iconMap[step.icon] : FileText;

        return (
          <div
            key={step.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.status === 'completed'
                  ? 'bg-green-50'
                  : 'bg-gray-50'
              }`}>
                <Icon className={`w-5 h-5 ${
                  step.status === 'completed'
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>

            {step.status === 'completed' ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Done</span>
              </div>
            ) : step.status === 'pending' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStartStep?.(step.id)}
                className="border-gray-200 hover:bg-gray-50"
              >
                Start
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-200 text-gray-400"
              >
                Locked
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
