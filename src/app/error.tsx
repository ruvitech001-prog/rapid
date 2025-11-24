'use client';

import { useEffect } from 'react';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-4 max-w-md">
        <div className="mb-8">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Something Went Wrong</h1>
          <p className="text-slate-600 text-lg mb-8">
            An unexpected error occurred. Our team has been notified.
          </p>
          {error.message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm text-red-700 font-mono">{error.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-medium"
          >
            <Home size={20} />
            Go Home
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-300">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <Link href="/help" className="text-blue-600 hover:underline">
              Help & Support
            </Link>
          </div>
        </div>

        {error.digest && (
          <p className="text-xs text-slate-500 mt-8">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
