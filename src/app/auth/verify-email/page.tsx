'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!verificationCode) {
      setError('Please enter the verification code')
      setLoading(false)
      return
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits')
      setLoading(false)
      return
    }

    // Mock verification
    setTimeout(() => {
      setLoading(false)
      setVerified(true)
    }, 1000)
  }

  const handleResend = async () => {
    setResending(true)
    // Mock resend
    setTimeout(() => {
      setResending(false)
      setError('')
    }, 1000)
  }

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Email verified
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your email has been successfully verified. You can now access your account.
              </p>
            </div>
          </div>

          {/* Info Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground">
                Click the button below to continue to your dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button
            onClick={() => router.push('/employer/dashboard')}
            className="w-full"
            size="lg"
          >
            Continue to Dashboard
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <Link href="/auth/login" className="text-sm font-medium text-primary hover:text-primary/90">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              rapid
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We've sent a 6-digit code to your email. Enter it below to verify.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardDescription>Secure your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Verification Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                  required
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  Check your email for the 6-digit code
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
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
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-primary hover:text-primary/90 font-medium"
                  >
                    {resending ? 'Sending...' : 'Resend'}
                  </button>
                </p>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <Link href="/auth/login" className="text-sm font-medium text-primary hover:text-primary/90">
                  ← Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
