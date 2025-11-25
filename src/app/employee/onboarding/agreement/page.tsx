'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Check, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmploymentAgreementPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  const handleSign = async () => {
    setSigning(true);
    // Simulate signing process
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/employee/onboarding/complete');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary hover:underline font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employment Agreement</h1>
        <p className="text-gray-500 mt-1">Please review and sign your employment agreement</p>
      </div>

      {/* Document Preview */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Employment Contract</CardTitle>
                <p className="text-sm text-gray-500">PDF Document - 12 pages</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-50 rounded-xl p-8 min-h-[400px]">
            {/* Simulated document preview */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary">rapid</h2>

              <h3 className="text-xl font-semibold text-gray-900">EMPLOYMENT AGREEMENT</h3>

              <div className="space-y-4 text-gray-700">
                <p>
                  This Employment Agreement ("Agreement") is entered into as of the date last signed below
                  by and between Rapid Technologies Private Limited ("Company") and the Employee named below.
                </p>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">1. Position and Duties</h4>
                  <p className="text-sm">
                    The Company agrees to employ the Employee as UI/UX Designer. The Employee agrees to
                    perform faithfully and diligently the duties of the position and such other duties as
                    may be assigned from time to time.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">2. Compensation</h4>
                  <p className="text-sm">
                    The Employee shall receive an annual salary of INR 10,00,000 (Ten Lakhs Rupees),
                    payable in accordance with the Company's standard payroll practices.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">3. Benefits</h4>
                  <p className="text-sm">
                    The Employee shall be entitled to participate in all employee benefit plans and
                    programs generally available to employees, subject to the terms and conditions
                    of such plans and programs.
                  </p>
                </div>

                <p className="text-sm text-gray-500 italic">
                  ...and 9 more sections. Please download the full document to review all terms.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Checkbox */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  agreed
                    ? 'bg-primary border-primary'
                    : 'bg-white border-gray-300'
                }`}
              >
                {agreed && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                I have read and agree to the terms of this Employment Agreement
              </p>
              <p className="text-sm text-gray-500 mt-1">
                By checking this box and signing below, you confirm that you have reviewed the
                complete Employment Agreement and agree to be bound by its terms and conditions.
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Sign Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSign}
          disabled={!agreed || signing}
          className="bg-primary hover:bg-primary/90 text-white px-8"
        >
          {signing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Signing...
            </>
          ) : (
            'Sign Agreement'
          )}
        </Button>
      </div>
    </div>
  );
}
