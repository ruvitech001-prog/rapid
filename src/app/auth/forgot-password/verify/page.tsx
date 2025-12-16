'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0] || '';
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    setResendSuccess(false);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const code = otp.join('');

    // Validation
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      setLoading(false);
      return;
    }

    // TODO: Implement actual OTP verification via Supabase
    // Mock verification for now
    setTimeout(() => {
      // Simulate wrong code error
      if (code === '111111') {
        setError('The verification code is wrong. Please enter correct verification code');
        setLoading(false);
        return;
      }

      // Simulate expired code error
      if (code === '000000') {
        setError('The verfication code has expired. Pls fetch new verification code using Resend code link.');
        setLoading(false);
        return;
      }

      // On success, redirect to reset password page
      router.push(`/auth/forgot-password/reset?email=${encodeURIComponent(email)}`);
    }, 1000);
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    // TODO: Implement actual resend via Supabase
    setTimeout(() => {
      setResending(false);
      setResendSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    }, 1000);
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify your email address</h1>
        <p className="text-gray-500">
          We have sent a verification code to your email. This code is valid for 60 mins.
          Check your spam folders in case you don't see this in your mailbox.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success Message for Resend */}
      {resendSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
          We resent the verification code to your email
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Verification Code - 6 separate input boxes */}
        <div className="space-y-2">
          <Label className="text-gray-700">
            Enter Code*
          </Label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className="h-14 w-14 border-gray-200 text-center text-2xl font-mono focus:border-primary focus:ring-primary"
                required
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-primary hover:underline font-medium"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
        </div>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
