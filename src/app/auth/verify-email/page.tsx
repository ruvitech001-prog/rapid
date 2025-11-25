'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!verificationCode) {
      setError('Please enter the verification code');
      setLoading(false);
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      setLoading(false);
      return;
    }

    // Mock verification
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 1000);
  };

  const handleResend = async () => {
    setResending(true);
    // Mock resend
    setTimeout(() => {
      setResending(false);
      setError('');
    }, 1000);
  };

  if (verified) {
    return (
      <AuthLayout>
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h1>
          <p className="text-gray-500 mb-8">
            Your email has been successfully verified. You can now access your account.
          </p>

          {/* Continue Button */}
          <Button
            onClick={() => router.push('/employer/dashboard')}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium mb-6"
          >
            Continue to Dashboard
          </Button>

          {/* Back to Login */}
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

  return (
    <AuthLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-500">
          We've sent a 6-digit verification code to your email. Enter it below to verify your account.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Verification Code */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-gray-700">
            Verification Code*
          </Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            disabled={loading}
            className="h-12 border-gray-200 text-center text-xl tracking-[0.5em] font-mono"
            required
          />
          <p className="text-xs text-gray-500">
            Check your email for the 6-digit code
          </p>
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
            'Verify email'
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
              {resending ? 'Sending...' : 'Resend code'}
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
