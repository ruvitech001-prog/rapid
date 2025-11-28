'use client';

import { useState } from 'react';
import { Settings, CheckCircle, Users, DollarSign, Calendar, Receipt, Zap, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  features: string[];
  price?: string;
  icon: string;
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
      icon: 'users',
    },
    {
      id: '2',
      name: 'Payroll Processing',
      description: 'Automated payroll calculation with compliance for Indian regulations',
      status: 'active',
      features: ['Auto Calculation', 'TDS Management', 'Bank Integration', 'Payslip Generation'],
      price: 'Included',
      icon: 'dollar',
    },
    {
      id: '3',
      name: 'Leave Management',
      description: 'Flexible leave policy management and employee leave requests',
      status: 'active',
      features: ['Leave Policies', 'Leave Requests', 'Calendar View', 'Approval Workflow'],
      price: 'Included',
      icon: 'calendar',
    },
    {
      id: '4',
      name: 'Expense Management',
      description: 'Track and manage employee expense claims with approval workflows',
      status: 'active',
      features: ['Expense Tracking', 'Receipts Upload', 'Approval Flow', 'Reporting'],
      price: 'Included',
      icon: 'receipt',
    },
    {
      id: '5',
      name: 'Compliance',
      description: 'Stay compliant with EPF, ESI, TDS, and other statutory requirements',
      status: 'active',
      features: ['EPF Management', 'ESI Compliance', 'TDS Filing', 'Reports'],
      price: 'Included',
      icon: 'shield',
    },
    {
      id: '6',
      name: 'Performance Management',
      description: 'Track and manage employee performance with goals and reviews',
      status: 'inactive',
      features: ['Goal Setting', 'Reviews', '360 Feedback', 'Analytics'],
      price: 'Coming Soon',
      icon: 'zap',
    },
  ]);

  const getIcon = (iconType: string) => {
    const iconClass = "h-6 w-6";
    switch (iconType) {
      case 'users': return <Users className={iconClass} />;
      case 'dollar': return <DollarSign className={iconClass} />;
      case 'calendar': return <Calendar className={iconClass} />;
      case 'receipt': return <Receipt className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      default: return <Settings className={iconClass} />;
    }
  };

  const getIconColor = (iconType: string) => {
    switch (iconType) {
      case 'users': return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
      case 'dollar': return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'calendar': return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      case 'receipt': return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' };
      case 'shield': return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
      case 'zap': return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
      default: return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
    }
  };

  const activeServices = services.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-[#8593A3] mt-1">View and manage your platform services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL SERVICES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{services.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Settings className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIVE SERVICES</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{activeServices}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">COMING SOON</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{services.length - activeServices}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const colors = getIconColor(service.icon);
          return (
            <Card key={service.id} className="rounded-2xl border border-[#DEE4EB] shadow-none hover:border-[#586AF5] transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text}`}>
                      {getIcon(service.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-[#8593A3] mt-1">{service.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.status === 'active'
                      ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]'
                      : 'bg-[#8593A3]/10 text-[#8593A3]'
                  }`}>
                    {service.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider mb-2">FEATURES</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span key={idx} className={`${colors.bg} ${colors.text} text-xs px-3 py-1 rounded-full font-medium`}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#DEE4EB]">
                  {service.price && (
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">{service.price}</span>
                    </p>
                  )}
                  <Button
                    variant={service.status === 'active' ? 'default' : 'outline'}
                    className={service.status === 'active'
                      ? 'bg-[#642DFC] hover:bg-[#5020d9]'
                      : 'border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]'
                    }
                  >
                    {service.status === 'active' ? 'Manage' : 'Learn More'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
