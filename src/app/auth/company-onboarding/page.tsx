'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { AuthLayout } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 1 | 2 | 3 | 4 | 5;

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Company Details
    companyName: '',
    legalName: '',
    industry: '',
    size: '',
    // Step 2: Tax Information
    pan: '',
    gstin: '',
    tan: '',
    // Step 3: Statutory Details
    epfNumber: '',
    esicNumber: '',
    ptNumber: '',
    // Step 4: Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    console.log('Company onboarding data:', formData);
    setTimeout(() => {
      router.push('/employer/dashboard');
    }, 1000);
  };

  const steps = [
    { number: 1, label: 'Company' },
    { number: 2, label: 'Tax' },
    { number: 3, label: 'Statutory' },
    { number: 4, label: 'Address' },
    { number: 5, label: 'Review' },
  ];

  const stepTitles: Record<Step, { title: string; description: string }> = {
    1: { title: 'Company Details', description: 'Basic information about your company' },
    2: { title: 'Tax Information', description: 'PAN, GSTIN, and TAN details' },
    3: { title: 'Statutory Details', description: 'EPF, ESIC, and PT registration details' },
    4: { title: 'Company Address', description: 'Where is your company located?' },
    5: { title: 'Review & Confirm', description: 'Please verify all details are correct' },
  };

  return (
    <AuthLayout>
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="mt-1 text-xs text-gray-500 hidden sm:block">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mx-1 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {stepTitles[currentStep].title}
        </h1>
        <p className="text-sm text-gray-500">
          {stepTitles[currentStep].description}
        </p>
      </div>

      {/* Step 1: Company Details */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-700">
              Company Name*
            </Label>
            <Input
              id="companyName"
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Acme Inc."
              className="h-12 border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalName" className="text-gray-700">
              Legal Name*
            </Label>
            <Input
              id="legalName"
              type="text"
              name="legalName"
              required
              value={formData.legalName}
              onChange={handleChange}
              placeholder="Acme Technologies Private Limited"
              className="h-12 border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-gray-700">
              Industry*
            </Label>
            <select
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleChange}
              className="w-full h-12 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="size" className="text-gray-700">
              Company Size*
            </Label>
            <select
              id="size"
              name="size"
              required
              value={formData.size}
              onChange={handleChange}
              className="w-full h-12 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Tax Information */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pan" className="text-gray-700">
              PAN Number*
            </Label>
            <Input
              id="pan"
              type="text"
              name="pan"
              required
              maxLength={10}
              value={formData.pan}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              className="h-12 border-gray-200 uppercase"
            />
            <p className="text-xs text-gray-500">10 characters (e.g., ABCDE1234F)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gstin" className="text-gray-700">
              GSTIN
            </Label>
            <Input
              id="gstin"
              type="text"
              name="gstin"
              maxLength={15}
              value={formData.gstin}
              onChange={handleChange}
              placeholder="22ABCDE1234F1Z5"
              className="h-12 border-gray-200 uppercase"
            />
            <p className="text-xs text-gray-500">15 characters (optional)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tan" className="text-gray-700">
              TAN Number
            </Label>
            <Input
              id="tan"
              type="text"
              name="tan"
              maxLength={10}
              value={formData.tan}
              onChange={handleChange}
              placeholder="ABCD12345E"
              className="h-12 border-gray-200 uppercase"
            />
            <p className="text-xs text-gray-500">10 characters (optional)</p>
          </div>
        </div>
      )}

      {/* Step 3: Statutory Details */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="epfNumber" className="text-gray-700">
              EPF Number
            </Label>
            <Input
              id="epfNumber"
              type="text"
              name="epfNumber"
              value={formData.epfNumber}
              onChange={handleChange}
              placeholder="MH/12345/2024"
              className="h-12 border-gray-200"
            />
            <p className="text-xs text-gray-500">EPF establishment code (optional)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="esicNumber" className="text-gray-700">
              ESIC Number
            </Label>
            <Input
              id="esicNumber"
              type="text"
              name="esicNumber"
              value={formData.esicNumber}
              onChange={handleChange}
              placeholder="12-34-567890-000"
              className="h-12 border-gray-200"
            />
            <p className="text-xs text-gray-500">ESIC registration number (optional)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ptNumber" className="text-gray-700">
              Professional Tax Number
            </Label>
            <Input
              id="ptNumber"
              type="text"
              name="ptNumber"
              value={formData.ptNumber}
              onChange={handleChange}
              placeholder="PT123456789"
              className="h-12 border-gray-200"
            />
            <p className="text-xs text-gray-500">State PT registration (optional)</p>
          </div>
        </div>
      )}

      {/* Step 4: Address */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1" className="text-gray-700">
              Address Line 1*
            </Label>
            <Input
              id="addressLine1"
              type="text"
              name="addressLine1"
              required
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Building No., Street Name"
              className="h-12 border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2" className="text-gray-700">
              Address Line 2
            </Label>
            <Input
              id="addressLine2"
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Locality, Landmark"
              className="h-12 border-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-700">
                City*
              </Label>
              <Input
                id="city"
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                className="h-12 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-700">
                State*
              </Label>
              <select
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full h-12 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select state</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Telangana">Telangana</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-gray-700">
                Pincode*
              </Label>
              <Input
                id="pincode"
                type="text"
                name="pincode"
                required
                maxLength={6}
                value={formData.pincode}
                onChange={handleChange}
                placeholder="400001"
                className="h-12 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-700">
                Country
              </Label>
              <Input
                id="country"
                type="text"
                name="country"
                value={formData.country}
                disabled
                className="h-12 border-gray-200 bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {currentStep === 5 && (
        <div className="space-y-4">
          {/* Company Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Company Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Company Name:</span>
                <span className="font-medium text-gray-900">{formData.companyName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Legal Name:</span>
                <span className="font-medium text-gray-900">{formData.legalName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Industry:</span>
                <span className="font-medium text-gray-900 capitalize">{formData.industry || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Size:</span>
                <span className="font-medium text-gray-900">{formData.size || '-'}</span>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tax Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">PAN:</span>
                <span className="font-medium text-gray-900 uppercase">{formData.pan || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GSTIN:</span>
                <span className="font-medium text-gray-900 uppercase">{formData.gstin || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">TAN:</span>
                <span className="font-medium text-gray-900 uppercase">{formData.tan || '-'}</span>
              </div>
            </div>
          </div>

          {/* Statutory Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Statutory Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">EPF Number:</span>
                <span className="font-medium text-gray-900">{formData.epfNumber || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ESIC Number:</span>
                <span className="font-medium text-gray-900">{formData.esicNumber || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PT Number:</span>
                <span className="font-medium text-gray-900">{formData.ptNumber || '-'}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Address</h3>
            <p className="text-sm text-gray-900">
              {formData.addressLine1 && <>{formData.addressLine1}<br /></>}
              {formData.addressLine2 && <>{formData.addressLine2}<br /></>}
              {formData.city && formData.state && (
                <>{formData.city}, {formData.state} - {formData.pincode}<br /></>
              )}
              {formData.country}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="h-12 px-8 bg-gray-400 hover:bg-gray-500 text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="h-12 px-8 bg-primary hover:bg-primary/90 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Completing...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        )}
      </div>
    </AuthLayout>
  );
}
