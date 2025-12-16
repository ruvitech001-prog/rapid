'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // TODO: Implement actual verification code sending via Supabase Auth
    // Check if email exists in database
    // For now, simulate email not found for demo
    if (email === 'notfound@example.com') {
      setError("We didn't find an account associated with this email address. Please give a valid account email address");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  // Redirect to verification page after email is sent
  if (sent) {
    router.push(`/auth/forgot-password/verify?email=${encodeURIComponent(email)}`);
    return null;
  }

  return (
    <AuthLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot password</h1>
        <p className="text-gray-500">
          No worries. Please let us know your account's email address to send a verification code to reset your password.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Email address*
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="h-12 border-gray-200 focus:border-primary focus:ring-primary"
            required
          />
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
              Sending...
            </>
          ) : (
            'Send verification code'
          )}
        </Button>
      </form>

      {/* Contact Support */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Having trouble logging in?{' '}
          <a
            href="https://rapid.one/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>

      {/* Back to Login */}
      <div className="mt-4 text-center">
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
