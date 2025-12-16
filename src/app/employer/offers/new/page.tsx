'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  EmployeeDetailsForm,
  JobCompensationForm,
  BenefitsForm,
  OfferReview,
} from '@/components/employer/offers';

// Types for offer form data
export interface OfferFormData {
  // Page 1: Employee Details
  team: string;
  firstName: string;
  middleName: string;
  lastName: string;
  employeePan: string;
  personalEmail: string;

  // Page 2: Job Details & Compensation
  startDate: string;
  jobTitle: string;
  jobDescription: string;
  grossAnnualSalary: number;
  variableCompensation: {
    enabled: boolean;
    calculationBasis: 'percentage' | 'fixed';
    calculationValue: number;
  };
  joiningBonus: {
    enabled: boolean;
    amount: number;
  };
  specialPayout: {
    enabled: boolean;
    amount: number;
    reason: string;
  };

  // Page 3: Benefits
  healthInsurance: {
    enabled: boolean;
    plan: 'pro' | 'power' | 'premium' | '';
  };
  welcomeSwag: {
    enabled: boolean;
    plan: 'pro' | 'power' | 'premium' | '';
  };
  backgroundCheck: {
    enabled: boolean;
    plan: 'pro' | 'power' | 'premium';
  };
  referredBy: string; // Employee ID or 'none'
  referralBonus: {
    enabled: boolean;
    amount: number;
  };
}

const initialFormData: OfferFormData = {
  team: '',
  firstName: '',
  middleName: '',
  lastName: '',
  employeePan: '',
  personalEmail: '',
  startDate: '',
  jobTitle: '',
  jobDescription: '',
  grossAnnualSalary: 0,
  variableCompensation: {
    enabled: false,
    calculationBasis: 'percentage',
    calculationValue: 10,
  },
  joiningBonus: {
    enabled: false,
    amount: 0,
  },
  specialPayout: {
    enabled: false,
    amount: 0,
    reason: '',
  },
  healthInsurance: {
    enabled: false,
    plan: '',
  },
  welcomeSwag: {
    enabled: false,
    plan: '',
  },
  backgroundCheck: {
    enabled: true,
    plan: 'pro',
  },
  referredBy: 'none',
  referralBonus: {
    enabled: false,
    amount: 0,
  },
};

export default function NewOfferPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<OfferFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (updates: Partial<OfferFormData>) => {
    setFormData({ ...formData, ...updates });
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => delete newErrors[field]);
      return newErrors;
    });
  };

  const handleNext = () => {
    // Validate current page before proceeding
    const isValid = validateCurrentPage();
    if (isValid) {
      setCurrentPage((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const validateCurrentPage = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentPage === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.employeePan.trim()) newErrors.employeePan = 'PAN is required';
      if (!formData.personalEmail.trim()) newErrors.personalEmail = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.personalEmail)) {
        newErrors.personalEmail = 'Please enter a valid email address';
      }
    } else if (currentPage === 2) {
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
      if (!formData.jobDescription.trim()) newErrors.jobDescription = 'Job description is required';
      if (!formData.grossAnnualSalary || formData.grossAnnualSalary <= 0) {
        newErrors.grossAnnualSalary = 'Gross annual salary is required';
      }
    } else if (currentPage === 3) {
      if (!formData.backgroundCheck.plan) {
        newErrors.backgroundCheck = 'Background check plan is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Final validation
    const isValid = validateCurrentPage();
    if (!isValid) return;

    // TODO: Implement actual offer creation via API
    console.log('Creating offer with data:', formData);

    // Show success and redirect
    alert('Offer created successfully!');
    router.push('/employer/offers');
  };

  const steps = [
    { number: 1, label: 'Employee Details' },
    { number: 2, label: 'Job & Compensation' },
    { number: 3, label: 'Benefits' },
    { number: 4, label: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/employer/offers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Offer</h1>
            <p className="text-sm text-gray-500">
              Complete all steps to roll out an offer to a new hire
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentPage > step.number
                        ? 'bg-green-500 text-white'
                        : currentPage === step.number
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentPage > step.number ? '✓' : step.number}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentPage === step.number ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      currentPage > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {currentPage === 1 && (
            <EmployeeDetailsForm
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentPage === 2 && (
            <JobCompensationForm
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentPage === 3 && (
            <BenefitsForm
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentPage === 4 && <OfferReview formData={formData} />}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          {currentPage > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentPage < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="px-8 bg-primary hover:bg-primary/90"
            >
              Review Offer
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              className="px-8 bg-primary hover:bg-primary/90"
            >
              Send Offer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
