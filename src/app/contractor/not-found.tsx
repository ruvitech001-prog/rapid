import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function ContractorNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="text-center px-4 max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-purple-800 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-purple-900 mb-4">Page Not Found</h2>
          <p className="text-purple-700 text-lg mb-8">
            The contractor page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/contractor/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Home size={20} />
            Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-200 text-purple-900 rounded-lg hover:bg-purple-300 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-300">
          <h3 className="text-sm font-semibold text-purple-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/contractor/timesheets/submit" className="text-purple-600 hover:underline">
              Timesheets
            </Link>
            <Link href="/contractor/invoices" className="text-purple-600 hover:underline">
              Invoices
            </Link>
            <Link href="/contractor/profile" className="text-purple-600 hover:underline">
              Profile
            </Link>
            <Link href="/contractor/settings" className="text-purple-600 hover:underline">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
