'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingStepSidebar, SidebarStep } from '@/components/onboarding';

type FormStep = 1 | 2 | 3;

export default function ContractorDetailsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);

  const [formData, setFormData] = useState({
    // Personal (Step 1)
    fullName: '',
    email: '',
    phone: '',
    address: '',
    // Bank (Step 2)
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    // Tax (Step 3)
    panNumber: '',
    gstNumber: '',
    businessType: 'individual',
  });

  const sidebarSteps: SidebarStep[] = [
    { id: 'personal', number: 1, label: 'Personal Information', status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'upcoming' },
    { id: 'bank', number: 2, label: 'Bank Details', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'upcoming' },
    { id: 'tax', number: 3, label: 'Tax Information', status: currentStep === 3 ? 'current' : 'upcoming' },
  ];

  const stepTitles: Record<FormStep, { title: string; description: string }> = {
    1: { title: 'Personal Information', description: 'Basic contact and identity details' },
    2: { title: 'Bank Details', description: 'Where you want to receive payments' },
    3: { title: 'Tax Information', description: 'Tax IDs and business details' },
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as FormStep);
    } else {
      router.push('/contractor/onboarding/complete');
    }
  };

  const handleExit = () => {
    router.push('/contractor/onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Step 3: Submit personal details
          </h1>
          <Button variant="outline" onClick={handleExit} className="gap-2">
            <X className="w-4 h-4" />
            Exit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OnboardingStepSidebar steps={sidebarSteps} currentStep={currentStep} />
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {stepTitles[currentStep].title}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {stepTitles[currentStep].description}
                </p>

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Full Name*</Label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Your legal full name"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Email Address*</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@example.com"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Phone Number*</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Address*</Label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Your full address"
                        className="w-full min-h-[100px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Identity Document</Label>
                      <p className="text-xs text-gray-500">Upload a government-issued ID (Aadhaar, Passport, or PAN)</p>
                      <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Bank Details */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-2">
                      <p className="text-sm text-amber-800">
                        Please ensure your bank details are correct. All payments will be sent to this account.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Bank Name*</Label>
                      <Input
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        placeholder="e.g., HDFC Bank"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Account Number*</Label>
                      <Input
                        value={formData.accountNumber}
                        onChange={(e) => handleChange('accountNumber', e.target.value)}
                        placeholder="Enter your account number"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">IFSC Code*</Label>
                      <Input
                        value={formData.ifscCode}
                        onChange={(e) => handleChange('ifscCode', e.target.value)}
                        placeholder="e.g., HDFC0001234"
                        className="h-11 border-gray-200 uppercase"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Account Holder Name*</Label>
                      <Input
                        value={formData.accountHolderName}
                        onChange={(e) => handleChange('accountHolderName', e.target.value)}
                        placeholder="Name as per bank records"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Cancelled Cheque / Passbook</Label>
                      <p className="text-xs text-gray-500">Upload for verification</p>
                      <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Tax Information */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Business Type*</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleChange('businessType', 'individual')}
                          className={`p-4 rounded-lg border-2 text-left transition-colors ${
                            formData.businessType === 'individual'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900">Individual</p>
                          <p className="text-sm text-gray-500 mt-1">Freelancer or sole proprietor</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange('businessType', 'company')}
                          className={`p-4 rounded-lg border-2 text-left transition-colors ${
                            formData.businessType === 'company'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900">Company</p>
                          <p className="text-sm text-gray-500 mt-1">Registered business entity</p>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">PAN Number*</Label>
                      <Input
                        value={formData.panNumber}
                        onChange={(e) => handleChange('panNumber', e.target.value)}
                        placeholder="ABCDE1234F"
                        className="h-11 border-gray-200 uppercase"
                      />
                      <p className="text-xs text-gray-500">
                        {formData.businessType === 'company' ? 'Company PAN' : 'Individual PAN'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">GST Number (Optional)</Label>
                      <Input
                        value={formData.gstNumber}
                        onChange={(e) => handleChange('gstNumber', e.target.value)}
                        placeholder="22ABCDE1234F1Z5"
                        className="h-11 border-gray-200 uppercase"
                      />
                      <p className="text-xs text-gray-500">
                        Required if you are GST registered
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">PAN Card Copy</Label>
                      <p className="text-xs text-gray-500">Upload a copy of your PAN card</p>
                      <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-end mt-8">
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                  >
                    {currentStep === 3 ? 'Complete' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
