'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import type { OfferFormData } from '@/app/employer/offers/new/page';

interface Props {
  formData: OfferFormData;
}

export function OfferReview({ formData }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Calculate total CTC
  const calculateTotalCTC = () => {
    let total = formData.grossAnnualSalary;

    if (formData.variableCompensation.enabled) {
      if (formData.variableCompensation.calculationBasis === 'percentage') {
        total += (formData.grossAnnualSalary * formData.variableCompensation.calculationValue) / 100;
      } else {
        total += formData.variableCompensation.calculationValue;
      }
    }

    return total;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review Offer</h2>
        <p className="text-sm text-gray-500">
          Please review all details before sending the offer
        </p>
      </div>

      {/* Offer Letter Preview */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center border-b pb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">OFFER LETTER</h3>
            <p className="text-sm text-gray-500">Confidential</p>
          </div>

          {/* Employee Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Employee Information
            </h4>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Full Name</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.firstName} {formData.middleName} {formData.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.personalEmail}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">PAN</p>
                <p className="text-sm font-semibold text-gray-900">{formData.employeePan}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Start Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(formData.startDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Job Details
            </h4>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Job Title</p>
                <p className="text-sm font-semibold text-gray-900">{formData.jobTitle}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Job Description
                </p>
                <p className="text-sm text-gray-700">{formData.jobDescription}</p>
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Compensation
            </h4>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Gross Annual Salary
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(formData.grossAnnualSalary)}
                </span>
              </div>

              {formData.variableCompensation.enabled && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Variable Compensation
                    </span>
                    <p className="text-xs text-gray-500">Performance-based bonus</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formData.variableCompensation.calculationBasis === 'percentage'
                      ? `${formData.variableCompensation.calculationValue}% of CTC`
                      : formatCurrency(formData.variableCompensation.calculationValue)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-3 bg-primary/10 rounded-lg px-4">
                <span className="text-base font-bold text-gray-900">Total CTC</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(calculateTotalCTC())}
                </span>
              </div>
            </div>
          </div>

          {/* One-Time Payouts */}
          {(formData.joiningBonus.enabled || formData.specialPayout.enabled) && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                One-Time Payouts
              </h4>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                {formData.joiningBonus.enabled && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Joining Bonus</span>
                      <p className="text-xs text-gray-500">
                        Paid after 3 months of service
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(formData.joiningBonus.amount)}
                    </span>
                  </div>
                )}

                {formData.specialPayout.enabled && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Special Payout
                      </span>
                      <p className="text-xs text-gray-500">{formData.specialPayout.reason}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(formData.specialPayout.amount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Benefits & Perks
            </h4>
            <div className="space-y-2 bg-gray-50 rounded-lg p-4">
              {formData.healthInsurance.enabled && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Health Insurance</span>
                  <Badge variant="secondary" className="capitalize">
                    {formData.healthInsurance.plan} Plan
                  </Badge>
                </div>
              )}

              {formData.welcomeSwag.enabled && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Welcome Swag</span>
                  <Badge variant="secondary" className="capitalize">
                    {formData.welcomeSwag.plan} Package
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Background Check</span>
                <Badge variant="secondary" className="capitalize">
                  {formData.backgroundCheck.plan} Plan
                </Badge>
              </div>

              {formData.referredBy !== 'none' && (
                <div className="flex items-center justify-between py-2 border-t border-gray-200 mt-2 pt-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Referral Bonus</span>
                    <p className="text-xs text-gray-500">For referring employee</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {formatCurrency(formData.referralBonus.amount)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t pt-6 text-center">
            <p className="text-xs text-gray-500">
              This offer is subject to successful completion of background verification and
              signing of the employment agreement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Success Message Placeholder */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-sm text-blue-700">
          Review the offer details above. Click "Send Offer" to proceed with rolling out this offer.
        </p>
      </div>
    </div>
  );
}
