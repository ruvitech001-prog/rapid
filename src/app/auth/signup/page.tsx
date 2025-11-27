'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Eye, EyeOff, ArrowLeft, ChevronRight } from 'lucide-react';
import { AuthLayout, StepIndicator, PermissionToggle } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  authorizedToWork: boolean;
  documentsAccess: boolean;
  payslipsAccess: boolean;
  expensesAccess: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    authorizedToWork: true,
    documentsAccess: true,
    payslipsAccess: true,
    expensesAccess: true,
  });

  const steps = [
    { number: 1, label: 'Personal details' },
    { number: 2, label: 'Permissions' },
  ];

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError('Please fill in all fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock signup
    setTimeout(() => {
      console.log('Signup data:', formData);
      router.push('/auth/verify-email');
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentStep(1);
      setLoading(false);
    }, 500);
  };

  // Initial screen - just name and Google option
  if (currentStep === 0 || (!formData.name && currentStep === 1)) {
    return (
      <AuthLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SignUp</h1>
          <p className="text-gray-500">
            To signup, you can either continue with Google or your email address on which you received the registration link.
            For further assistance contact us at{' '}
            <a href="mailto:care@rapid.one" className="text-primary hover:underline">
              care@rapid.one
            </a>
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Full name*
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="h-12 border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-3 border border-primary rounded-lg hover:bg-primary/5 transition-colors font-medium text-primary"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {formData.name && (
            <Button
              onClick={() => setCurrentStep(1)}
              className="w-full h-12 bg-primary hover:bg-primary/90"
            >
              Continue with Email
            </Button>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal details</h1>
            <p className="text-sm text-gray-500">
              Some of the details cannot be edited as it impacts your contract.
              If you wish to make changes, please contact us at{' '}
              <a href="mailto:care@rapid.one" className="text-primary hover:underline">
                care@rapid.one
              </a>
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4">
            {/* Work Authorization Toggle */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Are you authorized to work in India?</p>
                <p className="text-sm text-gray-500">
                  You should be eligible for employment in India to take up this job
                </p>
              </div>
              <Switch
                checked={formData.authorizedToWork}
                onCheckedChange={(checked) => handleChange('authorizedToWork', checked)}
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">
                Full name*
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="h-12 border-gray-200"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email address*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="h-12 border-gray-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password*
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="h-12 border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirm password*
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="h-12 border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Phone with OTP */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Phone number*
              </Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="h-12 border-gray-200 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-6 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Get OTP
                </Button>
              </div>
            </div>

            {/* Next Button */}
            <Button
              type="button"
              onClick={handleNext}
              className="w-full h-12 bg-gray-400 hover:bg-gray-500 text-white mt-6"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </>
      )}

      {/* Step 2: Permissions */}
      {currentStep === 2 && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Permissions</h1>
            <p className="text-sm text-gray-500">
              Grant permissions to <span className="font-medium">Aminc.in</span>, so they can view your documents.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-1">
              <PermissionToggle
                title="Documents & data view access"
                description="Allow Client to view your documents, profile & related info"
                checked={formData.documentsAccess}
                onChange={(checked) => handleChange('documentsAccess', checked)}
              />
              <PermissionToggle
                title="Payslips view access"
                description="Allow Aminc.in to view your payslips"
                checked={formData.payslipsAccess}
                onChange={(checked) => handleChange('payslipsAccess', checked)}
              />
              <PermissionToggle
                title="Expenses, leaves & other requests view"
                description="Allow Client to view your above info"
                checked={formData.expensesAccess}
                onChange={(checked) => handleChange('expensesAccess', checked)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-10">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 px-8 bg-gray-400 hover:bg-gray-500 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
