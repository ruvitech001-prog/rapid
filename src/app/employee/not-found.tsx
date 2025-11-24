import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function EmployeeNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="text-center px-4 max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-800 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-green-900 mb-4">Page Not Found</h2>
          <p className="text-green-700 text-lg mb-8">
            The employee page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/employee/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Home size={20} />
            Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-200 text-green-900 rounded-lg hover:bg-green-300 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-green-300">
          <h3 className="text-sm font-semibold text-green-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/employee/payslips" className="text-green-600 hover:underline">
              Payslips
            </Link>
            <Link href="/employee/attendance/history" className="text-green-600 hover:underline">
              Attendance
            </Link>
            <Link href="/employee/leave/apply" className="text-green-600 hover:underline">
              Leave
            </Link>
            <Link href="/employee/expenses/submit" className="text-green-600 hover:underline">
              Expenses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
