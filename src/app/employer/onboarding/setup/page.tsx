'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, ChevronRight, Plus, Building2, Users, CreditCard, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingStepSidebar, SidebarStep } from '@/components/onboarding';

type SetupStep = 'compliance' | 'payroll' | 'team' | 'payment';

function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = (searchParams.get('step') as SetupStep) || 'compliance';

  const [currentStep, setCurrentStep] = useState<SetupStep>(initialStep);
  const stepOrder: SetupStep[] = ['compliance', 'payroll', 'team', 'payment'];
  const currentStepIndex = stepOrder.indexOf(currentStep) + 1;

  const [formData, setFormData] = useState({
    // Compliance
    pfNumber: '',
    esicNumber: '',
    ptState: '',
    ptNumber: '',
    lwfNumber: '',
    // Payroll
    payFrequency: 'monthly',
    payDay: '1',
    salaryStructure: 'ctc',
    // Team
    employees: [] as { name: string; email: string; role: string }[],
    // Payment
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });

  const sidebarSteps: SidebarStep[] = [
    { id: 'compliance', number: 1, label: 'Compliance Setup', status: currentStep === 'compliance' ? 'current' : currentStepIndex > 1 ? 'completed' : 'upcoming' },
    { id: 'payroll', number: 2, label: 'Payroll Configuration', status: currentStep === 'payroll' ? 'current' : currentStepIndex > 2 ? 'completed' : 'upcoming' },
    { id: 'team', number: 3, label: 'Invite Team', status: currentStep === 'team' ? 'current' : currentStepIndex > 3 ? 'completed' : 'upcoming' },
    { id: 'payment', number: 4, label: 'Payment Method', status: currentStep === 'payment' ? 'current' : 'upcoming' },
  ];

  const stepTitles: Record<SetupStep, { title: string; description: string; icon: React.ElementType }> = {
    compliance: { title: 'Compliance Setup', description: 'Set up statutory compliance for your organization', icon: Shield },
    payroll: { title: 'Payroll Configuration', description: 'Configure how you want to run payroll', icon: CreditCard },
    team: { title: 'Invite Your Team', description: 'Add employees and contractors to your organization', icon: Users },
    payment: { title: 'Payment Method', description: 'Add a bank account for payroll disbursement', icon: Building2 },
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    } else {
      router.push('/employer/onboarding/complete');
    }
  };

  const handleExit = () => {
    router.push('/employer/onboarding');
  };

  const CurrentIcon = stepTitles[currentStep].icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">Company Setup</h1>
          <Button variant="outline" onClick={handleExit} className="gap-2">
            <X className="w-4 h-4" />
            Exit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OnboardingStepSidebar steps={sidebarSteps} currentStep={currentStepIndex} />
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CurrentIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {stepTitles[currentStep].title}
                    </h2>
                    <p className="text-sm text-gray-500">{stepTitles[currentStep].description}</p>
                  </div>
                </div>

                {/* Compliance Step */}
                {currentStep === 'compliance' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">PF Establishment Code</Label>
                      <Input
                        value={formData.pfNumber}
                        onChange={(e) => handleChange('pfNumber', e.target.value)}
                        placeholder="e.g., MH/12345/2024"
                        className="h-11 border-gray-200"
                      />
                      <p className="text-xs text-gray-500">Required for PF compliance if you have 20+ employees</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">ESIC Number</Label>
                      <Input
                        value={formData.esicNumber}
                        onChange={(e) => handleChange('esicNumber', e.target.value)}
                        placeholder="e.g., 12-34-567890-000"
                        className="h-11 border-gray-200"
                      />
                      <p className="text-xs text-gray-500">Required if any employee earns less than 21,000/month</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-600">Professional Tax State</Label>
                        <select
                          value={formData.ptState}
                          onChange={(e) => handleChange('ptState', e.target.value)}
                          className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
                        >
                          <option value="">Select state</option>
                          <option value="maharashtra">Maharashtra</option>
                          <option value="karnataka">Karnataka</option>
                          <option value="gujarat">Gujarat</option>
                          <option value="west_bengal">West Bengal</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">PT Registration Number</Label>
                        <Input
                          value={formData.ptNumber}
                          onChange={(e) => handleChange('ptNumber', e.target.value)}
                          placeholder="Enter PT number"
                          className="h-11 border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">LWF Number (if applicable)</Label>
                      <Input
                        value={formData.lwfNumber}
                        onChange={(e) => handleChange('lwfNumber', e.target.value)}
                        placeholder="Labour Welfare Fund number"
                        className="h-11 border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Payroll Step */}
                {currentStep === 'payroll' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Pay Frequency*</Label>
                      <select
                        value={formData.payFrequency}
                        onChange={(e) => handleChange('payFrequency', e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Pay Day*</Label>
                      <select
                        value={formData.payDay}
                        onChange={(e) => handleChange('payDay', e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="1">1st of the month</option>
                        <option value="7">7th of the month</option>
                        <option value="15">15th of the month</option>
                        <option value="last">Last day of the month</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Salary Structure*</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleChange('salaryStructure', 'ctc')}
                          className={`p-4 rounded-lg border-2 text-left transition-colors ${
                            formData.salaryStructure === 'ctc'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900">CTC Based</p>
                          <p className="text-sm text-gray-500 mt-1">Define Cost to Company, deductions calculated automatically</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange('salaryStructure', 'gross')}
                          className={`p-4 rounded-lg border-2 text-left transition-colors ${
                            formData.salaryStructure === 'gross'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900">Gross Salary Based</p>
                          <p className="text-sm text-gray-500 mt-1">Define gross salary, employer costs added on top</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Step */}
                {currentStep === 'team' && (
                  <div className="space-y-5">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        Add your team members below. They'll receive an email invitation to complete their onboarding.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-600">Full Name</Label>
                          <Input placeholder="John Doe" className="h-11 border-gray-200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-600">Email</Label>
                          <Input type="email" placeholder="john@company.com" className="h-11 border-gray-200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-600">Role</Label>
                          <select className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none">
                            <option value="employee">Employee</option>
                            <option value="contractor">Contractor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>

                      <Button variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Another
                      </Button>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-500">
                        Or <button className="text-primary hover:underline">upload a CSV</button> to add multiple team members at once
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="space-y-5">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        This bank account will be used for all payroll disbursements. Make sure it has sufficient funds before running payroll.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Bank Name*</Label>
                      <Input
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        placeholder="e.g., HDFC Bank"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Account Number*</Label>
                      <Input
                        value={formData.accountNumber}
                        onChange={(e) => handleChange('accountNumber', e.target.value)}
                        placeholder="Enter account number"
                        className="h-11 border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">IFSC Code*</Label>
                      <Input
                        value={formData.ifscCode}
                        onChange={(e) => handleChange('ifscCode', e.target.value)}
                        placeholder="e.g., HDFC0001234"
                        className="h-11 border-gray-200 uppercase"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Account Holder Name*</Label>
                      <Input
                        value={formData.accountHolderName}
                        onChange={(e) => handleChange('accountHolderName', e.target.value)}
                        placeholder="Company legal name"
                        className="h-11 border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-end mt-8">
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                  >
                    {currentStep === 'payment' ? 'Complete Setup' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployerSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SetupContent />
    </Suspense>
  );
}
