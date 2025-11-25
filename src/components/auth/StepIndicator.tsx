'use client';

import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const getStepStatus = (stepNumber: number): 'completed' | 'active' | 'pending' => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => {
        const status = getStepStatus(step.number);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step Circle and Label */}
            <div className="flex items-center gap-2">
              {/* Circle */}
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold transition-all ${
                  status === 'completed'
                    ? 'bg-primary text-white'
                    : status === 'active'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>

              {/* Label */}
              <span
                className={`text-sm font-medium ${
                  status === 'completed' || status === 'active'
                    ? 'text-primary'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className="w-12 h-px bg-gray-200 mx-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
