'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OfferFormData } from '@/app/employer/offers/new/page';

interface Props {
  formData: OfferFormData;
  updateFormData: (updates: Partial<OfferFormData>) => void;
  errors: Record<string, string>;
}

export function JobCompensationForm({ formData, updateFormData, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Job Details & Compensation</h2>
        <p className="text-sm text-gray-500">
          Define the role, responsibilities, and compensation structure
        </p>
      </div>

      <div className="space-y-5">
        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-gray-700">
            Start Date*
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData({ startDate: e.target.value })}
            className="h-12"
          />
          {errors.startDate && (
            <p className="text-xs text-red-600">{errors.startDate}</p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-gray-700">
            Job Title*
          </Label>
          <Input
            id="jobTitle"
            type="text"
            value={formData.jobTitle}
            onChange={(e) => updateFormData({ jobTitle: e.target.value })}
            className="h-12"
            placeholder="Senior Software Engineer"
          />
          {errors.jobTitle && (
            <p className="text-xs text-red-600">{errors.jobTitle}</p>
          )}
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="text-gray-700">
            Job Description*
          </Label>
          <Textarea
            id="jobDescription"
            value={formData.jobDescription}
            onChange={(e) => updateFormData({ jobDescription: e.target.value })}
            className="min-h-24"
            placeholder="Describe the role, responsibilities, and expectations..."
          />
          {errors.jobDescription && (
            <p className="text-xs text-red-600">{errors.jobDescription}</p>
          )}
        </div>

        {/* Gross Annual Salary */}
        <div className="space-y-2">
          <Label htmlFor="grossAnnualSalary" className="text-gray-700">
            Gross Annual Salary (per year)*
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              INR
            </span>
            <Input
              id="grossAnnualSalary"
              type="number"
              value={formData.grossAnnualSalary || ''}
              onChange={(e) =>
                updateFormData({ grossAnnualSalary: Number(e.target.value) })
              }
              className="h-12 pl-14"
              placeholder="1200000"
            />
          </div>
          {errors.grossAnnualSalary && (
            <p className="text-xs text-red-600">{errors.grossAnnualSalary}</p>
          )}
        </div>

        {/* Annual Variable Compensation */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-gray-900 font-medium">
                Annual Variable Compensation
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Offer a variable performance bonus in the Cost to Company (CTC) structure.
                A very popular way to rewarding employees. You can always change the values
                while rolling out an offer.
              </p>
            </div>
            <Switch
              checked={formData.variableCompensation.enabled}
              onCheckedChange={(checked) =>
                updateFormData({
                  variableCompensation: { ...formData.variableCompensation, enabled: checked },
                })
              }
            />
          </div>

          {formData.variableCompensation.enabled && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-gray-700">Calculation basis</Label>
                <Select
                  value={formData.variableCompensation.calculationBasis}
                  onValueChange={(value: 'percentage' | 'fixed') =>
                    updateFormData({
                      variableCompensation: {
                        ...formData.variableCompensation,
                        calculationBasis: value,
                      },
                    })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Calculation Value</Label>
                <div className="relative">
                  {formData.variableCompensation.calculationBasis === 'percentage' ? (
                    <>
                      <Input
                        type="number"
                        value={formData.variableCompensation.calculationValue}
                        onChange={(e) =>
                          updateFormData({
                            variableCompensation: {
                              ...formData.variableCompensation,
                              calculationValue: Number(e.target.value),
                            },
                          })
                        }
                        className="h-12 pr-10"
                        placeholder="10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        INR
                      </span>
                      <Input
                        type="number"
                        value={formData.variableCompensation.calculationValue}
                        onChange={(e) =>
                          updateFormData({
                            variableCompensation: {
                              ...formData.variableCompensation,
                              calculationValue: Number(e.target.value),
                            },
                          })
                        }
                        className="h-12 pl-14"
                        placeholder="120000"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Joining/Sign-on Bonus */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-gray-900 font-medium">Joining/Sign-on Bonus</Label>
              <p className="text-xs text-gray-500 mt-1">
                Offer incentives to new hires for joining your team. Paid after 3 months of
                service. Recovered if the employee quits before a year. One time payment.
              </p>
            </div>
            <Switch
              checked={formData.joiningBonus.enabled}
              onCheckedChange={(checked) =>
                updateFormData({
                  joiningBonus: { ...formData.joiningBonus, enabled: checked },
                })
              }
            />
          </div>

          {formData.joiningBonus.enabled && (
            <div className="space-y-2 pt-2">
              <Label className="text-gray-700">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  INR
                </span>
                <Input
                  type="number"
                  value={formData.joiningBonus.amount || ''}
                  onChange={(e) =>
                    updateFormData({
                      joiningBonus: {
                        ...formData.joiningBonus,
                        amount: Number(e.target.value),
                      },
                    })
                  }
                  className="h-12 pl-14"
                  placeholder="50000"
                />
              </div>
            </div>
          )}
        </div>

        {/* Special Payout */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-gray-900 font-medium">Special Payout</Label>
              <p className="text-xs text-gray-500 mt-1">
                Offer a one time payment to handle relocations, notice period buy outs or any
                other special situation.
              </p>
            </div>
            <Switch
              checked={formData.specialPayout.enabled}
              onCheckedChange={(checked) =>
                updateFormData({
                  specialPayout: { ...formData.specialPayout, enabled: checked },
                })
              }
            />
          </div>

          {formData.specialPayout.enabled && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-gray-700">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    INR
                  </span>
                  <Input
                    type="number"
                    value={formData.specialPayout.amount || ''}
                    onChange={(e) =>
                      updateFormData({
                        specialPayout: {
                          ...formData.specialPayout,
                          amount: Number(e.target.value),
                        },
                      })
                    }
                    className="h-12 pl-14"
                    placeholder="30000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Reason</Label>
                <Input
                  type="text"
                  value={formData.specialPayout.reason}
                  onChange={(e) =>
                    updateFormData({
                      specialPayout: {
                        ...formData.specialPayout,
                        reason: e.target.value,
                      },
                    })
                  }
                  className="h-12"
                  placeholder="Relocation, Notice buyout, etc."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
