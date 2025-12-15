'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Check, FileText, Clock, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useContractorProfile, useSignDocument } from '@/lib/hooks';

export default function ContractorContractPage() {
  const router = useRouter();
  const { user } = useAuth();
  const contractorId = user?.id;
  const { data: profile } = useContractorProfile(contractorId);
  const signDocument = useSignDocument();

  const [agreed, setAgreed] = useState(false);

  const contractDetails = {
    client: profile?.contract?.companyName || 'Client Company',
    project: profile?.contract?.scopeOfWork || 'Contract Services',
    rate: profile?.contract?.hourlyRate ? `$${profile.contract.hourlyRate}/hour` : '$75/hour',
    duration: '6 months',
    startDate: profile?.contract?.startDate
      ? new Date(profile.contract.startDate).toLocaleDateString()
      : new Date().toLocaleDateString(),
    endDate: profile?.contract?.endDate
      ? new Date(profile.contract.endDate).toLocaleDateString()
      : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    hoursPerWeek: '40 hours max',
  };

  const handleSign = async () => {
    if (!contractorId || !user?.email) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // In a real scenario, we'd have a contract document ID from the backend
      // For now, we create a placeholder contract signing
      await signDocument.mutateAsync({
        documentId: `contract_${contractorId}_${Date.now()}`,
        signerId: contractorId,
        signerName: profile?.full_name || user.email,
        signerEmail: user.email,
        employeeId: contractorId, // Used for cache invalidation
      });

      toast.success('Contract signed successfully!');
      router.push('/contractor/onboarding/details');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign contract');
    }
  };

  const isSigning = signDocument.isPending;

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
        <h1 className="text-2xl font-bold text-gray-900">Contractor Agreement</h1>
        <p className="text-gray-500 mt-1">Review and sign your contract with {contractDetails.client}</p>
      </div>

      {/* Contract Summary */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Contract Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Rate</p>
                <p className="font-semibold text-gray-900">{contractDetails.rate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Max Hours</p>
                <p className="font-semibold text-gray-900">{contractDetails.hoursPerWeek}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-semibold text-gray-900">{contractDetails.startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-semibold text-gray-900">{contractDetails.endDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Document */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Contractor Services Agreement</CardTitle>
                <p className="text-sm text-gray-500">PDF Document - 8 pages</p>
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
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary">rapid</h2>

              <h3 className="text-xl font-semibold text-gray-900">CONTRACTOR SERVICES AGREEMENT</h3>

              <div className="space-y-4 text-gray-700">
                <p>
                  This Contractor Services Agreement (&quot;Agreement&quot;) is made between {contractDetails.client}
                  (&quot;Client&quot;) and the Contractor identified below.
                </p>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">1. Services</h4>
                  <p className="text-sm">
                    The Contractor agrees to provide services related to: {contractDetails.project}.
                    The specific deliverables and milestones will be agreed upon in writing.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">2. Compensation</h4>
                  <p className="text-sm">
                    The Client shall pay the Contractor at a rate of {contractDetails.rate},
                    up to a maximum of {contractDetails.hoursPerWeek} per week unless otherwise agreed.
                    Payment will be processed within 3-5 business days of approved timesheet submission.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">3. Term</h4>
                  <p className="text-sm">
                    This Agreement shall commence on {contractDetails.startDate} and continue until
                    {contractDetails.endDate}, unless terminated earlier in accordance with the terms herein.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">4. Independent Contractor Status</h4>
                  <p className="text-sm">
                    The Contractor is an independent contractor and not an employee of the Client.
                    The Contractor is responsible for their own taxes, insurance, and work expenses.
                  </p>
                </div>

                <p className="text-sm text-gray-500 italic">
                  ...and 4 more sections. Please download the full document to review all terms.
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
                I have read and agree to the Contractor Services Agreement
              </p>
              <p className="text-sm text-gray-500 mt-1">
                By signing, you acknowledge that you are entering into a legally binding agreement
                and confirm your independent contractor status.
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Sign Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSign}
          disabled={!agreed || isSigning}
          className="bg-primary hover:bg-primary/90 text-white px-8"
        >
          {isSigning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing...
            </>
          ) : (
            'Sign & Continue'
          )}
        </Button>
      </div>
    </div>
  );
}
