'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Loader2 } from 'lucide-react';

type Status = 'built' | 'in_progress' | 'planned';

interface Feature {
  name: string;
  status: Status;
  path?: string;
}

interface Module {
  name: string;
  features: Feature[];
}

const modules: Module[] = [
  {
    name: 'Authentication',
    features: [
      { name: 'Login Page (Split-screen layout)', status: 'built', path: '/auth/login' },
      { name: 'Signup Page (Multi-type)', status: 'built', path: '/auth/signup' },
      { name: 'Forgot Password', status: 'built', path: '/auth/forgot-password' },
      { name: 'Reset Password', status: 'built', path: '/auth/reset-password' },
      { name: 'Email Verification', status: 'built', path: '/auth/verify-email' },
      { name: 'Company Onboarding', status: 'built', path: '/auth/company-onboarding' },
    ],
  },
  {
    name: 'Employee Onboarding',
    features: [
      { name: 'Onboarding Dashboard', status: 'built', path: '/employee/onboarding' },
      { name: 'Offer Letter View', status: 'built', path: '/employee/onboarding/offer-letter' },
      { name: 'Details Form (6 steps)', status: 'built', path: '/employee/onboarding/details' },
      { name: 'eKYC Verification', status: 'built', path: '/employee/onboarding/ekyc' },
      { name: 'Document Signing', status: 'built', path: '/employee/onboarding/documents' },
      { name: 'Employment Agreement', status: 'built', path: '/employee/onboarding/agreement' },
      { name: 'Background Verification', status: 'built', path: '/employee/onboarding/bgv' },
      { name: 'Insurance Selection', status: 'built', path: '/employee/onboarding/insurance' },
      { name: 'Completion Screen', status: 'built', path: '/employee/onboarding/complete' },
    ],
  },
  {
    name: 'Employer Onboarding',
    features: [
      { name: 'Onboarding Dashboard', status: 'built', path: '/employer/onboarding' },
      { name: 'Setup Form (4 steps)', status: 'built', path: '/employer/onboarding/setup' },
      { name: 'Completion Screen', status: 'built', path: '/employer/onboarding/complete' },
    ],
  },
  {
    name: 'Contractor Onboarding',
    features: [
      { name: 'Onboarding Dashboard', status: 'built', path: '/contractor/onboarding' },
      { name: 'Contract Review', status: 'built', path: '/contractor/onboarding/contract' },
      { name: 'Details Form (3 steps)', status: 'built', path: '/contractor/onboarding/details' },
      { name: 'Identity Verification', status: 'built', path: '/contractor/onboarding/verification' },
      { name: 'Completion Screen', status: 'built', path: '/contractor/onboarding/complete' },
    ],
  },
  {
    name: 'Employee Portal',
    features: [
      { name: 'Dashboard', status: 'built', path: '/employee/dashboard' },
      { name: 'Profile Management', status: 'built', path: '/employee/profile' },
      { name: 'Payslips List', status: 'built', path: '/employee/payslips' },
      { name: 'Payslip Detail View', status: 'built', path: '/employee/payslips/2024-01' },
      { name: 'Leave Application', status: 'built', path: '/employee/leave/apply' },
      { name: 'Leave History', status: 'built', path: '/employee/leave/history' },
      { name: 'Attendance Clock-in', status: 'built', path: '/employee/attendance/clockin' },
      { name: 'Attendance History', status: 'built', path: '/employee/attendance/history' },
      { name: 'Attendance Regularization', status: 'built', path: '/employee/attendance/regularization' },
      { name: 'Expense Submission', status: 'built', path: '/employee/expenses/submit' },
      { name: 'Expense History', status: 'built', path: '/employee/expenses/history' },
      { name: 'Tax Declaration', status: 'built', path: '/employee/tax/declaration' },
      { name: 'Tax Proofs', status: 'built', path: '/employee/tax/proofs' },
      { name: 'Tax Deductions', status: 'built', path: '/employee/tax/deductions' },
      { name: 'Form 16', status: 'built', path: '/employee/tax/form16' },
      { name: 'Document Library', status: 'built', path: '/employee/documents/library' },
      { name: 'Document Upload', status: 'built', path: '/employee/documents/upload' },
      { name: 'Document e-Sign', status: 'built', path: '/employee/documents/esign/1' },
      { name: 'Notifications', status: 'built', path: '/employee/notifications' },
      { name: 'Settings', status: 'built', path: '/employee/settings' },
    ],
  },
  {
    name: 'Employer Portal',
    features: [
      { name: 'Dashboard', status: 'built', path: '/employer/dashboard' },
      { name: 'Employee Directory', status: 'built', path: '/employer/employees' },
      { name: 'Add New Employee', status: 'built', path: '/employer/employees/new' },
      { name: 'Employee Detail View', status: 'built', path: '/employer/employees/1' },
      { name: 'Employee Edit', status: 'built', path: '/employer/employees/1/edit' },
      { name: 'Contractor Directory', status: 'built', path: '/employer/contractors' },
      { name: 'Add New Contractor', status: 'built', path: '/employer/contractors/new' },
      { name: 'Contractor Timesheets', status: 'built', path: '/employer/contractors/timesheets' },
      { name: 'Contractor Onboarding Flow', status: 'built', path: '/employer/contractor-onboarding' },
      { name: 'Payroll Dashboard', status: 'built', path: '/employer/payroll/dashboard' },
      { name: 'Run Payroll', status: 'built', path: '/employer/payroll/run' },
      { name: 'Salary Structure Setup', status: 'built', path: '/employer/payroll/salary-structure' },
      { name: 'Leave Requests', status: 'built', path: '/employer/leave/requests' },
      { name: 'Leave Settings', status: 'built', path: '/employer/leave/settings' },
      { name: 'Leave Calendar', status: 'built', path: '/employer/leave/calendar' },
      { name: 'Attendance Report', status: 'built', path: '/employer/attendance/report' },
      { name: 'Expense Requests', status: 'built', path: '/employer/expenses/requests' },
      { name: 'Compliance - EPF', status: 'built', path: '/employer/compliance/epf' },
      { name: 'Compliance - TDS', status: 'built', path: '/employer/compliance/tds' },
      { name: 'Requests Management', status: 'built', path: '/employer/requests' },
      { name: 'New Request', status: 'built', path: '/employer/requests/new' },
      { name: 'Equipment Requests', status: 'built', path: '/employer/requests/equipment' },
      { name: 'Gift Requests', status: 'built', path: '/employer/requests/gifts' },
      { name: 'Salary Amendment', status: 'built', path: '/employer/requests/salary-amendment' },
      { name: 'Invoices List', status: 'built', path: '/employer/invoices' },
      { name: 'Invoice Approval', status: 'built', path: '/employer/invoices/approve' },
      { name: 'Paid Invoices', status: 'built', path: '/employer/invoices/paid' },
      { name: 'Documents', status: 'built', path: '/employer/documents' },
      { name: 'Reports', status: 'built', path: '/employer/reports' },
      { name: 'Company Profile', status: 'built', path: '/employer/company' },
      { name: 'User Profile', status: 'built', path: '/employer/profile' },
      { name: 'Settings', status: 'built', path: '/employer/settings' },
      { name: 'Team Management', status: 'built', path: '/employer/settings/teams' },
      { name: 'Salary Structure Settings', status: 'built', path: '/employer/settings/salary-structure' },
      { name: 'Policies', status: 'built', path: '/employer/settings/policies' },
      { name: 'Access Control', status: 'built', path: '/employer/access-control' },
      { name: 'Audit Logs', status: 'built', path: '/employer/audit-logs' },
      { name: 'Holidays', status: 'built', path: '/employer/holidays' },
      { name: 'Clients', status: 'built', path: '/employer/clients' },
      { name: 'Contracts', status: 'built', path: '/employer/contracts' },
      { name: 'Timesheet', status: 'built', path: '/employer/timesheet' },
      { name: 'Perks', status: 'built', path: '/employer/perks' },
      { name: 'Services', status: 'built', path: '/employer/services' },
      { name: 'Updates', status: 'built', path: '/employer/updates' },
    ],
  },
  {
    name: 'Contractor Portal',
    features: [
      { name: 'Dashboard', status: 'built', path: '/contractor/dashboard' },
      { name: 'Profile', status: 'built', path: '/contractor/profile' },
      { name: 'Timesheet Overview', status: 'built', path: '/contractor/timesheet' },
      { name: 'Timesheet Details', status: 'built', path: '/contractor/timesheet/details' },
      { name: 'Submit Timesheet', status: 'built', path: '/contractor/timesheets/submit' },
      { name: 'Invoices List', status: 'built', path: '/contractor/invoices' },
      { name: 'Invoice Detail', status: 'built', path: '/contractor/invoices/1' },
      { name: 'Settings', status: 'built', path: '/contractor/settings' },
    ],
  },
  {
    name: 'Common Pages',
    features: [
      { name: 'Homepage', status: 'built', path: '/' },
      { name: 'Help Center', status: 'built', path: '/help' },
      { name: 'Terms of Service', status: 'built', path: '/terms' },
      { name: 'Privacy Policy', status: 'built', path: '/privacy' },
    ],
  },
  {
    name: 'Figma Design Matching',
    features: [
      { name: 'Auth Pages Layout', status: 'built' },
      { name: 'Dashboard Layouts', status: 'in_progress' },
      { name: 'Form Styling', status: 'in_progress' },
      { name: 'Table Components', status: 'in_progress' },
      { name: 'Card Components', status: 'in_progress' },
      { name: 'Navigation Components', status: 'built' },
      { name: 'Color System', status: 'built' },
      { name: 'Typography', status: 'in_progress' },
    ],
  },
];

export default function ProjectStatusPage() {
  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'built':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4 text-amber-500" />;
      case 'planned':
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case 'built':
        return 'Built';
      case 'in_progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
    }
  };

  const totalFeatures = modules.reduce((acc, m) => acc + m.features.length, 0);
  const builtFeatures = modules.reduce(
    (acc, m) => acc + m.features.filter((f) => f.status === 'built').length,
    0
  );
  const inProgressFeatures = modules.reduce(
    (acc, m) => acc + m.features.filter((f) => f.status === 'in_progress').length,
    0
  );
  const overallProgress = Math.round((builtFeatures / totalFeatures) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Project Status</h1>
          <p className="text-gray-500 text-sm mt-1">Feature scope and implementation progress</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
            <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">{builtFeatures} Built</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-amber-500" />
              <span className="text-gray-600">{inProgressFeatures} In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-gray-300" />
              <span className="text-gray-600">{totalFeatures - builtFeatures - inProgressFeatures} Planned</span>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((module) => {
            const moduleBuilt = module.features.filter((f) => f.status === 'built').length;
            const moduleProgress = Math.round((moduleBuilt / module.features.length) * 100);

            return (
              <div key={module.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{module.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {moduleBuilt}/{module.features.length}
                    </span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {module.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(feature.status)}
                        {feature.path ? (
                          <Link
                            href={feature.path}
                            className="text-sm text-gray-700 hover:text-primary hover:underline"
                          >
                            {feature.name}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-700">{feature.name}</span>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          feature.status === 'built'
                            ? 'bg-green-50 text-green-700'
                            : feature.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {getStatusText(feature.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 pb-8">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
