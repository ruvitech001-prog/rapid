'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, User, Briefcase } from 'lucide-react';

type UserType = 'employer' | 'employee' | 'contractor';

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<UserType>('employer');

  const userTypes = [
    { id: 'employer' as UserType, label: 'Employer', icon: Building2, description: 'Manage employees, payroll, and compliance' },
    { id: 'employee' as UserType, label: 'Employee', icon: User, description: 'Access payslips, apply leave, manage profile' },
    { id: 'contractor' as UserType, label: 'Contractor', icon: Briefcase, description: 'Submit timesheets and track invoices' },
  ];

  const dashboardPaths: Record<UserType, string> = {
    employer: '/employer/dashboard',
    employee: '/employee/dashboard',
    contractor: '/contractor/dashboard',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">rapid</h1>
          <p className="text-gray-600">Hire your remote team rapidly</p>
        </div>

        {/* User Type Chip Selector */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 text-center mb-4">Select your role</p>
          <div className="flex justify-center gap-3">
            {userTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Type Description */}
        <div className="text-center mb-8 px-4">
          <p className="text-gray-600">
            {userTypes.find((t) => t.id === selectedType)?.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/auth/signup?type=${selectedType}`}
            className="block w-full px-6 py-3 bg-primary text-white text-center rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign Up as {userTypes.find((t) => t.id === selectedType)?.label}
          </Link>
          <Link
            href={`/auth/login?type=${selectedType}`}
            className="block w-full px-6 py-3 border border-primary text-primary text-center rounded-lg font-medium hover:bg-primary/5 transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Quick Access to Dashboards (Demo Mode) */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-3">Demo: Quick access to dashboards</p>
          <div className="flex justify-center gap-2">
            {userTypes.map((type) => (
              <Link
                key={type.id}
                href={dashboardPaths[type.id]}
                className="text-xs text-primary hover:underline"
              >
                {type.label} Dashboard
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
