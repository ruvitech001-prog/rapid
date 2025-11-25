'use client';

import { Check } from 'lucide-react';

export interface SidebarStep {
  id: string;
  number: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface OnboardingStepSidebarProps {
  steps: SidebarStep[];
  currentStep: number;
}

export function OnboardingStepSidebar({ steps, currentStep }: OnboardingStepSidebarProps) {
  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-start">
            {/* Step indicator */}
            <div className="flex flex-col items-center mr-4">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`w-0.5 h-8 mt-1 ${
                    isCompleted ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>

            {/* Step label */}
            <div className="pt-1">
              <p
                className={`text-sm font-medium ${
                  isCurrent
                    ? 'text-primary'
                    : isCompleted
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
