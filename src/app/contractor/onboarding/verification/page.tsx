'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Upload, Camera, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VerificationStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: string;
}

export default function ContractorVerificationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'document' | 'selfie' | 'review'>('document');
  const [documentType, setDocumentType] = useState('aadhaar');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { id: 'document', name: 'Document Upload', status: 'pending' },
    { id: 'selfie', name: 'Selfie Verification', status: 'pending' },
    { id: 'liveness', name: 'Liveness Check', status: 'pending' },
    { id: 'match', name: 'Face Match', status: 'pending' },
  ]);

  const completedSteps = verificationSteps.filter(s => s.status === 'completed').length;

  const handleDocumentUpload = async () => {
    setVerificationSteps(prev => prev.map(s =>
      s.id === 'document' ? { ...s, status: 'in_progress' } : s
    ));

    await new Promise(resolve => setTimeout(resolve, 1500));

    setVerificationSteps(prev => prev.map(s =>
      s.id === 'document'
        ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
        : s
    ));

    setCurrentStep('selfie');
  };

  const handleSelfieCapture = async () => {
    setVerificationSteps(prev => prev.map(s =>
      s.id === 'selfie' ? { ...s, status: 'in_progress' } : s
    ));

    await new Promise(resolve => setTimeout(resolve, 1500));

    setVerificationSteps(prev => prev.map(s =>
      s.id === 'selfie'
        ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
        : s
    ));

    // Auto liveness check
    setVerificationSteps(prev => prev.map(s =>
      s.id === 'liveness' ? { ...s, status: 'in_progress' } : s
    ));

    await new Promise(resolve => setTimeout(resolve, 1000));

    setVerificationSteps(prev => prev.map(s =>
      s.id === 'liveness'
        ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
        : s
    ));

    setCurrentStep('review');
  };

  const handleCompleteVerification = async () => {
    setIsVerifying(true);

    setVerificationSteps(prev => prev.map(s =>
      s.id === 'match' ? { ...s, status: 'in_progress' } : s
    ));

    await new Promise(resolve => setTimeout(resolve, 2000));

    setVerificationSteps(prev => prev.map(s =>
      s.id === 'match'
        ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
        : s
    ));

    setIsVerifying(false);

    // Navigate to complete page
    setTimeout(() => {
      router.push('/contractor/onboarding/complete');
    }, 1000);
  };

  const getStatusIcon = (status: VerificationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
        <p className="text-gray-500 mt-1">Verify your identity to start receiving payments</p>
      </div>

      {/* Progress Card */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Verification Progress</CardTitle>
            <span className="text-sm text-gray-500">{completedSteps}/{verificationSteps.length} Complete</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verificationSteps.map((step) => (
              <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(step.status)}
                  <span className="text-sm font-medium text-gray-700">{step.name}</span>
                </div>
                {step.timestamp && (
                  <span className="text-xs text-gray-500">{step.timestamp}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Document Upload */}
      {currentStep === 'document' && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Step 1: Upload Identity Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Document Type*</Label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="passport">Passport</option>
                <option value="pan">PAN Card</option>
                <option value="driving_license">Driving License</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Document Number*</Label>
              <Input
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder={documentType === 'aadhaar' ? '1234 5678 9101' : 'Enter document number'}
                className="h-11 border-gray-200"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="font-medium text-gray-700">Upload Document</p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to upload front and back of your document
              </p>
              <Button variant="outline" className="mt-4">
                Choose File
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Tips for better results:</span>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Ensure good lighting</li>
                  <li>All text should be clearly readable</li>
                  <li>Avoid glare or shadows</li>
                </ul>
              </p>
            </div>

            <Button
              onClick={handleDocumentUpload}
              disabled={!documentNumber}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Upload & Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Selfie Verification */}
      {currentStep === 'selfie' && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Step 2: Take a Selfie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Guidelines:</span>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Face the camera directly</li>
                  <li>Good lighting, neutral background</li>
                  <li>Remove glasses and hats</li>
                  <li>Neutral expression</li>
                </ul>
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700">Camera Preview</p>
              <p className="text-sm text-gray-500 mt-1">
                Position your face within the circle
              </p>
            </div>

            <Button
              onClick={handleSelfieCapture}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Capture Selfie
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Complete */}
      {currentStep === 'review' && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Step 3: Complete Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Document & Selfie Captured</p>
                  <p className="text-sm text-green-700 mt-1">
                    Click below to complete the verification process. We'll match your selfie with your document photo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Document Photo</p>
                <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Your Selfie</p>
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1" defaultChecked />
                <span className="text-sm text-gray-700">
                  I confirm that the document and selfie belong to me and all information provided is accurate.
                </span>
              </label>
            </div>

            <Button
              onClick={handleCompleteVerification}
              disabled={isVerifying}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isVerifying ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Complete Verification'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
