'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OfferLetterPage() {
  const router = useRouter();

  const employeeData = {
    name: 'Rakesh Gaur',
    address: '4th floor, UDB Landmark,',
    city: 'Jaipur, Rajasthan, India',
    pincode: '302018',
    position: 'UI/UX Designer',
    company: 'Amnic.in',
    salary: 'INR 10,00,000',
    startDate: '28/Jan/2023',
    signerName: 'Akash Nagraj',
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
      <h1 className="text-2xl font-bold text-gray-900">Offer letter</h1>

      {/* Alert Banner */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">
                Get started by submitting your additional details
              </p>
              <p className="text-sm text-gray-500 mt-1">
                To ensure, you're eligible for next month's payroll, complete this by 26/Jan/2023
              </p>
              <Button
                size="sm"
                className="mt-3 bg-gray-900 hover:bg-gray-800"
                onClick={() => router.push('/employee/onboarding/details')}
              >
                Submit details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      {/* Offer Letter Document */}
      <Card className="border-gray-200">
        <CardContent className="p-8 md:p-12">
          {/* Company Logo */}
          <h2 className="text-3xl font-bold text-primary mb-8">rapid</h2>

          {/* Employee Address */}
          <div className="text-sm text-gray-700 mb-8">
            <p className="font-semibold">{employeeData.name}</p>
            <p>{employeeData.address}</p>
            <p>{employeeData.city}</p>
            <p>{employeeData.pincode}</p>
          </div>

          {/* Letter Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-6">Offer of employment</h3>

          {/* Letter Body */}
          <div className="space-y-4 text-gray-700">
            <p>Dear {employeeData.name},</p>

            <p>
              I am pleased to offer you the position of{' '}
              <span className="font-medium">{employeeData.position}</span> at{' '}
              <span className="font-medium">{employeeData.company}</span>, earning{' '}
              <span className="font-medium">{employeeData.salary}</span> per year, with a target
              start date of <span className="font-medium">{employeeData.startDate}</span>. This
              contract is indefinite.
            </p>

            <p>
              If there is anything you are unclear about, disagree with or wish to discuss about
              the agreement or about the position, please resubmit your request through{' '}
              <a href="#" className="text-primary hover:underline">
                this web form
              </a>
              .
            </p>

            <p>
              You can discuss this offer and seek advice on the agreement with your family, a
              union, a lawyer, or someone else you trust.
            </p>

            <p>We are looking forward to working with you.</p>

            <div className="mt-8">
              <p>Yours sincerely,</p>
              <p className="font-medium mt-1">{employeeData.signerName}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
