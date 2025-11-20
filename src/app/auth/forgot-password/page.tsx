'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle, InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!email) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    // Mock sending reset email
    setTimeout(() => {
      console.log('Password reset requested for:', email)
      setLoading(false)
      setSent(true)
    }, 1000)
  }

  if (sent) {
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
                Check your email
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We've sent password reset instructions to
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {email}
              </p>
            </div>
          </div>

          {/* Instructions Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <InfoIcon className="h-5 w-5 text-primary mt-0.5" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">Click the link in the email</p>
                  <p className="text-xs text-muted-foreground mt-1">Use the secure link we sent to reset your password</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <InfoIcon className="h-5 w-5 text-primary mt-0.5" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">Link expires in 24 hours</p>
                  <p className="text-xs text-muted-foreground mt-1">Make sure to reset your password within one day</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam or junk folder. If you still don't see it, you can{' '}
              <button
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
                className="text-primary hover:underline font-medium"
              >
                try another email
              </button>.
            </p>
          </div>

          {/* Back to Login */}
          <Link href="/auth/login" className="block text-center text-sm font-medium text-primary hover:text-primary/90">
            ← Back to login
          </Link>
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
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardDescription>Recover your account access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
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
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>

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
