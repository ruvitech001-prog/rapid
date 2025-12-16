'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 1 | 2;

interface FormData {
  legalName: string;
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  phoneNumber: string;
  entityType: string;
  taxId: string;
  taxIdDocuments: File[];
}

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    legalName: '',
    country: 'India',
    state: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    zipCode: '',
    phoneNumber: '',
    entityType: '',
    taxId: '',
    taxIdDocuments: [],
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateZipCode = (zipCode: string): boolean => {
    // Indian PIN code validation: 6 digits
    return /^\d{6}$/.test(zipCode);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.taxIdDocuments.length > 5) {
      setError('Maximum 5 files allowed');
      return;
    }
    setFormData({
      ...formData,
      taxIdDocuments: [...formData.taxIdDocuments, ...files],
    });
    setError('');
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      taxIdDocuments: formData.taxIdDocuments.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.legalName || !formData.country || !formData.state || !formData.city ||
        !formData.addressLine1 || !formData.zipCode || !formData.phoneNumber ||
        !formData.taxId) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateZipCode(formData.zipCode)) {
      setError('Please enter a valid 6-digit ZIP code');
      return;
    }

    setLoading(true);
    // TODO: Implement actual company creation via API
    setTimeout(() => {
      setCurrentStep(2); // Go to welcome page
    }, 1000);
  };

  // Auto-redirect from welcome page after 3 seconds
  useEffect(() => {
    if (currentStep === 2) {
      const timer = setTimeout(() => {
        router.push('/employer/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router]);

  // Welcome Page (Step 2)
  if (currentStep === 2) {
    return (
      <AuthLayout>
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Rapid</h1>
          <p className="text-xl text-gray-600 mb-6">
            We are happy to have you onboard!!!
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Redirecting to your dashboard in 3 seconds...
            </p>
          </div>

          <Button
            onClick={() => router.push('/employer/dashboard')}
            className="bg-primary hover:bg-primary/90"
          >
            Go to Dashboard
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // Company Details Form (Step 1)
  return (
    <AuthLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Let's get some details about your Company
        </h1>
        <p className="text-sm text-gray-500">
          Please provide your company information to complete the setup
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Legal Name */}
        <div className="space-y-2">
          <Label htmlFor="legalName" className="text-gray-700">
            Company's Legal Name*
          </Label>
          <Input
            id="legalName"
            type="text"
            name="legalName"
            value={formData.legalName}
            onChange={handleChange}
            placeholder="Acme Technologies Private Limited"
            className="h-12 border-gray-200"
            required
          />
        </div>

        {/* Country, State, City */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-700">
              Country*
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
          <div className="space-y-2">
            <Label htmlFor="state" className="text-gray-700">
              State*
            </Label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full h-12 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select state</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-700">
              City*
            </Label>
            <Input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Mumbai"
              className="h-12 border-gray-200"
              required
            />
          </div>
        </div>

        {/* Address Line 1 */}
        <div className="space-y-2">
          <Label htmlFor="addressLine1" className="text-gray-700">
            Address Line 1*
          </Label>
          <Input
            id="addressLine1"
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Building No., Street Name"
            className="h-12 border-gray-200"
            required
          />
        </div>

        {/* Address Line 2 */}
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
            placeholder="Locality, Landmark (optional)"
            className="h-12 border-gray-200"
          />
        </div>

        {/* Zip Code & Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-gray-700">
              Zip Code*
            </Label>
            <Input
              id="zipCode"
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="400001"
              maxLength={6}
              className="h-12 border-gray-200"
              required
            />
            <p className="text-xs text-gray-500">6-digit PIN code</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-700">
              Phone number*
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="h-12 border-gray-200"
              required
            />
          </div>
        </div>

        {/* Entity Type & Tax ID */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="entityType" className="text-gray-700">
              Entity Type*
            </Label>
            <Input
              id="entityType"
              type="text"
              name="entityType"
              value={formData.entityType}
              onChange={handleChange}
              placeholder="C-Corp"
              className="h-12 border-gray-200"
              required
            />
            <p className="text-xs text-gray-500">Default: C-Corp for USA</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-gray-700">
              Tax ID*
            </Label>
            <Input
              id="taxId"
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              placeholder="12-3456789"
              className="h-12 border-gray-200"
              required
            />
          </div>
        </div>

        {/* Tax ID Document Upload */}
        <div className="space-y-2">
          <Label className="text-gray-700">
            Tax ID Document* (Max 5 files)
          </Label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mb-3">
              PDF, JPG, PNG (Max 5 files)
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="tax-doc-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('tax-doc-upload')?.click()}
              className="border-primary text-primary"
            >
              Choose Files
            </Button>
          </div>

          {/* Uploaded Files List */}
          {formData.taxIdDocuments.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.taxIdDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
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
        </div>
      </div>
    </AuthLayout>
  );
}
