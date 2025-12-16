'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEmployees } from '@/lib/hooks';
import { useAuth } from '@/lib/auth';
import type { OfferFormData } from '@/app/employer/offers/new/page';

interface Props {
  formData: OfferFormData;
  updateFormData: (updates: Partial<OfferFormData>) => void;
  errors: Record<string, string>;
}

export function BenefitsForm({ formData, updateFormData, errors }: Props) {
  const { user } = useAuth();
  const companyId = user?.companyId;

  // Fetch employees for referral dropdown
  const { data: employees = [] } = useEmployees(companyId || undefined);

  const handleReferralChange = (value: string) => {
    updateFormData({ referredBy: value });
    // Auto-enable referral bonus if an employee is selected
    if (value !== 'none') {
      updateFormData({
        referralBonus: { ...formData.referralBonus, enabled: true },
      });
    } else {
      updateFormData({
        referralBonus: { enabled: false, amount: 0 },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Benefits</h2>
        <p className="text-sm text-gray-500">
          Select benefits and perks for the new hire
        </p>
      </div>

      <div className="space-y-5">
        {/* Health Insurance */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-gray-900 font-medium">Health Insurance</Label>
              <p className="text-xs text-gray-500 mt-1">
                Provide comprehensive health coverage for your employees
              </p>
            </div>
            <Switch
              checked={formData.healthInsurance.enabled}
              onCheckedChange={(checked) =>
                updateFormData({
                  healthInsurance: { ...formData.healthInsurance, enabled: checked },
                })
              }
            />
          </div>

          {formData.healthInsurance.enabled && (
            <div className="space-y-2 pt-2">
              <Label className="text-gray-700">Select Plan</Label>
              <Select
                value={formData.healthInsurance.plan}
                onValueChange={(value: 'pro' | 'power' | 'premium') =>
                  updateFormData({
                    healthInsurance: { ...formData.healthInsurance, plan: value },
                  })
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose health insurance plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pro">Pro - Basic Coverage</SelectItem>
                  <SelectItem value="power">Power - Enhanced Coverage</SelectItem>
                  <SelectItem value="premium">Premium - Comprehensive Coverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Welcome Swag */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-gray-900 font-medium">Welcome Swag</Label>
              <p className="text-xs text-gray-500 mt-1">
                Welcome new hires with branded merchandise
              </p>
            </div>
            <Switch
              checked={formData.welcomeSwag.enabled}
              onCheckedChange={(checked) =>
                updateFormData({
                  welcomeSwag: { ...formData.welcomeSwag, enabled: checked },
                })
              }
            />
          </div>

          {formData.welcomeSwag.enabled && (
            <div className="space-y-2 pt-2">
              <Label className="text-gray-700">Select Package</Label>
              <Select
                value={formData.welcomeSwag.plan}
                onValueChange={(value: 'pro' | 'power' | 'premium') =>
                  updateFormData({
                    welcomeSwag: { ...formData.welcomeSwag, plan: value },
                  })
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose welcome swag package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pro">
                    Pro - T-shirt, Cap, Flask ($59)
                  </SelectItem>
                  <SelectItem value="power">
                    Power - Pro + Laptop Bag, Sling Bag ($109)
                  </SelectItem>
                  <SelectItem value="premium">
                    Premium - Power + Jacket, Coffee Set ($189)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Background Check */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <Label className="text-gray-900 font-medium">Background check*</Label>
            <p className="text-xs text-gray-500 mt-1">
              Mandatory background verification for all new hires
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Select Plan*</Label>
            <Select
              value={formData.backgroundCheck.plan}
              onValueChange={(value: 'pro' | 'power' | 'premium') =>
                updateFormData({
                  backgroundCheck: { ...formData.backgroundCheck, plan: value },
                })
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose BGV plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pro">Pro - ID, Court, Address ($29)</SelectItem>
                <SelectItem value="power">
                  Power - Pro + Education, Employment ($49)
                </SelectItem>
                <SelectItem value="premium">
                  Premium - Power + Reference, Credit, Drug test ($79)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.backgroundCheck && (
              <p className="text-xs text-red-600">{errors.backgroundCheck}</p>
            )}
          </div>
        </div>

        {/* Referred by existing employee */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <Label className="text-gray-900 font-medium">
              Referred by an existing employee?*
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Track employee referrals and reward successful hires
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Select Employee</Label>
            <Select value={formData.referredBy} onValueChange={handleReferralChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.fullName} - {emp.employeeCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Referral Bonus - Conditional */}
        {formData.referredBy !== 'none' && (
          <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-4">
            <div>
              <Label className="text-gray-900 font-medium">Referral Bonus</Label>
              <p className="text-xs text-gray-500 mt-1">
                Offer Incentives to existing employees for referring successful hires. Paid
                after 3 months of service of the new hire.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  INR
                </span>
                <Input
                  type="number"
                  value={formData.referralBonus.amount || ''}
                  onChange={(e) =>
                    updateFormData({
                      referralBonus: {
                        ...formData.referralBonus,
                        amount: Number(e.target.value),
                      },
                    })
                  }
                  className="h-12 pl-14"
                  placeholder="25000"
                />
              </div>
              <p className="text-xs text-gray-500">
                This will be paid to the referring employee after 3 months of the new hire's service
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
