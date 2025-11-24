import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-4 max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-800 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-600 text-lg mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home size={20} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-300">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
            <Link href="/help" className="text-blue-600 hover:underline">
              Help & Support
            </Link>
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
