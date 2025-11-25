'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, Plus, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingStepSidebar, SidebarStep } from '@/components/onboarding';

type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  // Personal Details (Step 1)
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  fatherName: string;
  maritalStatus: string;
  spouseName: string;
  aadhaarNumber: string;
  panNumber: string;
  passportNumber: string;
  highestQualification: string;
  // Employment Eligibility (Step 2)
  workAuthorization: string;
  visaStatus: string;
  visaExpiry: string;
  // Contact Details (Step 3)
  email: string;
  phone: string;
  currentAddress: string;
  permanentAddress: string;
  // Emergency Contact (Step 4)
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyAddress: string;
  // Bank Details (Step 5)
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  // Statutory & Tax (Step 6)
  pfNumber: string;
  uanNumber: string;
  esicNumber: string;
}

export default function SubmitDetailsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [showAutosaveToast, setShowAutosaveToast] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    firstName: 'Vidushi',
    middleName: 'NA',
    lastName: 'Maheshwari',
    dateOfBirth: '',
    sex: '',
    fatherName: '',
    maritalStatus: 'Married',
    spouseName: '',
    aadhaarNumber: '',
    panNumber: '',
    passportNumber: '',
    highestQualification: '',
    workAuthorization: 'yes',
    visaStatus: '',
    visaExpiry: '',
    email: '',
    phone: '',
    currentAddress: '',
    permanentAddress: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    emergencyAddress: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    pfNumber: '',
    uanNumber: '',
    esicNumber: '',
  });

  const sidebarSteps: SidebarStep[] = [
    { id: 'personal', number: 1, label: 'Personal details', status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'upcoming' },
    { id: 'employment', number: 2, label: 'Employment eligibility', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'upcoming' },
    { id: 'contact', number: 3, label: 'Contact details', status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'upcoming' },
    { id: 'emergency', number: 4, label: 'Emergency contact', status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'upcoming' },
    { id: 'bank', number: 5, label: 'Bank details', status: currentStep === 5 ? 'current' : currentStep > 5 ? 'completed' : 'upcoming' },
    { id: 'statutory', number: 6, label: 'Statutory & tax details', status: currentStep === 6 ? 'current' : 'upcoming' },
  ];

  const stepTitles: Record<FormStep, string> = {
    1: 'Personal details',
    2: 'Employment eligibility',
    3: 'Contact details',
    4: 'Emergency contact',
    5: 'Bank details',
    6: 'Statutory & tax details',
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as FormStep);
    } else {
      // Submit and go to next onboarding step
      router.push('/employee/onboarding/ekyc');
    }
  };

  const handleExit = () => {
    router.push('/employee/onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Autosave Toast */}
      {showAutosaveToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
            <span className="text-sm text-gray-700">Your data has been autosaved.</span>
            <button
              onClick={() => setShowAutosaveToast(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Step 2: Submit additional details
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
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {stepTitles[currentStep]}
                </h2>

                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">First name*</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="h-11 bg-purple-50 border-purple-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Middle name</Label>
                      <Input
                        value={formData.middleName}
                        onChange={(e) => handleChange('middleName', e.target.value)}
                        className="h-11 bg-purple-50 border-purple-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Last name*</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="h-11 bg-purple-50 border-purple-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Date of birth*</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                          placeholder="Date of birth*"
                          className="h-11 border-gray-200"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      <p className="text-xs text-gray-500">
                        It will be used for processing payroll, so make sure it matches your government ID
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Sex*</Label>
                      <select
                        value={formData.sex}
                        onChange={(e) => handleChange('sex', e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Sex*</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <p className="text-xs text-gray-500">
                        We know sex is non-binary but for insurance and payroll purposes, we need to ask this information.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Father's name</Label>
                      <Input
                        value={formData.fatherName}
                        onChange={(e) => handleChange('fatherName', e.target.value)}
                        placeholder="Father's name"
                        className="h-11 border-gray-200"
                      />
                      <p className="text-xs text-gray-500">Your father's full legal name</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Marital status*</Label>
                      <select
                        value={formData.maritalStatus}
                        onChange={(e) => handleChange('maritalStatus', e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    {formData.maritalStatus === 'Married' && (
                      <div className="space-y-2">
                        <Label className="text-gray-600">Spouse's name</Label>
                        <Input
                          value={formData.spouseName}
                          onChange={(e) => handleChange('spouseName', e.target.value)}
                          placeholder="Spouse's name"
                          className="h-11 border-gray-200"
                        />
                        <p className="text-xs text-gray-500">Your spouse's full legal name</p>
                      </div>
                    )}

                    {/* Document uploads */}
                    <div className="space-y-2">
                      <Label className="text-gray-600">Aadhaar card</Label>
                      <Input
                        value={formData.aadhaarNumber}
                        onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                        placeholder="Aadhaar card"
                        className="h-11 border-gray-200"
                      />
                      <p className="text-xs text-gray-500">
                        Upload both front and back side of your aadhaar card in .jpeg format
                      </p>
                      <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">PAN card</Label>
                      <Input
                        value={formData.panNumber}
                        onChange={(e) => handleChange('panNumber', e.target.value)}
                        placeholder="PAN card"
                        className="h-11 border-gray-200"
                      />
                      <p className="text-xs text-gray-500">Upload a copy of your PAN card</p>
                      <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Passport</Label>
                      <Input
                        value={formData.passportNumber}
                        onChange={(e) => handleChange('passportNumber', e.target.value)}
                        placeholder="Passport"
                        className="h-11 border-gray-200"
                      />
                      <p className="text-xs text-gray-500">Upload a copy of your Passport</p>
                      <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Highest qualification</Label>
                      <Input
                        value={formData.highestQualification}
                        onChange={(e) => handleChange('highestQualification', e.target.value)}
                        placeholder="Highest qualification"
                        className="h-11 border-gray-200"
                      />
                      <p className="text-xs text-gray-500">Upload a copy of your highest qualification</p>
                      <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Employment Eligibility */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Are you authorized to work in India?*</Label>
                      <select
                        value={formData.workAuthorization}
                        onChange={(e) => handleChange('workAuthorization', e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Visa status (if applicable)</Label>
                      <Input
                        value={formData.visaStatus}
                        onChange={(e) => handleChange('visaStatus', e.target.value)}
                        placeholder="Enter visa type"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Visa expiry date (if applicable)</Label>
                      <Input
                        type="date"
                        value={formData.visaExpiry}
                        onChange={(e) => handleChange('visaExpiry', e.target.value)}
                        className="h-11 border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Details */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Email address*</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@example.com"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Phone number*</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Current address*</Label>
                      <textarea
                        value={formData.currentAddress}
                        onChange={(e) => handleChange('currentAddress', e.target.value)}
                        placeholder="Enter your current address"
                        className="w-full min-h-[100px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Permanent address*</Label>
                      <textarea
                        value={formData.permanentAddress}
                        onChange={(e) => handleChange('permanentAddress', e.target.value)}
                        placeholder="Enter your permanent address"
                        className="w-full min-h-[100px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Emergency Contact */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Contact name*</Label>
                      <Input
                        value={formData.emergencyName}
                        onChange={(e) => handleChange('emergencyName', e.target.value)}
                        placeholder="Full name"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Relationship*</Label>
                      <select
                        value={formData.emergencyRelation}
                        onChange={(e) => handleChange('emergencyRelation', e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Phone number*</Label>
                      <Input
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Address</Label>
                      <textarea
                        value={formData.emergencyAddress}
                        onChange={(e) => handleChange('emergencyAddress', e.target.value)}
                        placeholder="Enter address"
                        className="w-full min-h-[100px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Bank Details */}
                {currentStep === 5 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Bank name*</Label>
                      <Input
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        placeholder="e.g., HDFC Bank"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Account number*</Label>
                      <Input
                        value={formData.accountNumber}
                        onChange={(e) => handleChange('accountNumber', e.target.value)}
                        placeholder="Enter account number"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">IFSC code*</Label>
                      <Input
                        value={formData.ifscCode}
                        onChange={(e) => handleChange('ifscCode', e.target.value)}
                        placeholder="e.g., HDFC0001234"
                        className="h-11 border-gray-200 uppercase"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Account holder name*</Label>
                      <Input
                        value={formData.accountHolderName}
                        onChange={(e) => handleChange('accountHolderName', e.target.value)}
                        placeholder="Name as per bank records"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Cancelled cheque / Passbook</Label>
                      <p className="text-xs text-gray-500">Upload a copy for verification</p>
                      <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 6: Statutory & Tax */}
                {currentStep === 6 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">PF Number (if existing)</Label>
                      <Input
                        value={formData.pfNumber}
                        onChange={(e) => handleChange('pfNumber', e.target.value)}
                        placeholder="Enter existing PF number"
                        className="h-11 border-gray-200"
                      />
                      <p className="text-xs text-gray-500">
                        If you have an existing PF account, provide the number for transfer
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">UAN Number (if existing)</Label>
                      <Input
                        value={formData.uanNumber}
                        onChange={(e) => handleChange('uanNumber', e.target.value)}
                        placeholder="Enter UAN number"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">ESIC Number (if applicable)</Label>
                      <Input
                        value={formData.esicNumber}
                        onChange={(e) => handleChange('esicNumber', e.target.value)}
                        placeholder="Enter ESIC number"
                        className="h-11 border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-end mt-8">
                  <Button
                    onClick={handleNext}
                    className="bg-gray-400 hover:bg-gray-500 text-white gap-2"
                  >
                    Next
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
