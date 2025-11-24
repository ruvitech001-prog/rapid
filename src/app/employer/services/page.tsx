'use client';

import { useState } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  features: string[];
  price?: string;
}

export default function ServicesPage() {
  const [services] = useState<Service[]>([
    {
      id: '1',
      name: 'Employee Management',
      description: 'Complete employee lifecycle management including onboarding, profile management, and offboarding',
      status: 'active',
      features: ['Employee Profiles', 'Document Management', 'Bulk Upload', 'Directory'],
      price: 'Included',
    },
    {
      id: '2',
      name: 'Payroll Processing',
      description: 'Automated payroll calculation with compliance for Indian regulations',
      status: 'active',
      features: ['Auto Calculation', 'TDS Management', 'Bank Integration', 'Payslip Generation'],
      price: 'Included',
    },
    {
      id: '3',
      name: 'Leave Management',
      description: 'Flexible leave policy management and employee leave requests',
      status: 'active',
      features: ['Leave Policies', 'Leave Requests', 'Calendar View', 'Approval Workflow'],
      price: 'Included',
    },
    {
      id: '4',
      name: 'Expense Management',
      description: 'Track and manage employee expense claims with approval workflows',
      status: 'active',
      features: ['Expense Tracking', 'Receipts Upload', 'Approval Flow', 'Reporting'],
      price: 'Included',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-2">View and manage your platform services</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  service.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.status}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  {service.price && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{service.price}</span>
                    </p>
                  )}
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
