'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Upload, Camera, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import {
  useUploadDocument,
  useSubmitForVerification,
  useCaptureSelfie,
  usePerformFaceMatch,
  usePerformLivenessCheck,
} from '@/lib/hooks/use-verification';

interface VerificationStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: string;
}

export default function ContractorVerificationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<'document' | 'selfie' | 'review'>('document');
  const [documentType, setDocumentType] = useState('aadhaar');
  const [documentNumber, setDocumentNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
  const [selfieDocumentId, setSelfieDocumentId] = useState<string | null>(null);

  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { id: 'document', name: 'Document Upload', status: 'pending' },
    { id: 'selfie', name: 'Selfie Verification', status: 'pending' },
    { id: 'liveness', name: 'Liveness Check', status: 'pending' },
    { id: 'match', name: 'Face Match', status: 'pending' },
  ]);

  const uploadDocument = useUploadDocument();
  const submitForVerification = useSubmitForVerification();
  const captureSelfie = useCaptureSelfie();
  const performFaceMatch = usePerformFaceMatch();
  const performLivenessCheck = usePerformLivenessCheck();

  const completedSteps = verificationSteps.filter(s => s.status === 'completed').length;
  const contractorId = user?.contractorId || user?.id || '';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDocumentUpload = async () => {
    if (!selectedFile || !contractorId) {
      toast.error('Please select a file to upload');
      return;
    }

    setVerificationSteps(prev => prev.map(s =>
      s.id === 'document' ? { ...s, status: 'in_progress' } : s
    ));

    try {
      // Upload the document
      const uploadResult = await uploadDocument.mutateAsync({
        file: selectedFile,
        documentType: documentType,
        entityType: 'contractor',
        entityId: contractorId,
      });

      setUploadedDocumentId(uploadResult.documentId);

      // Submit for verification
      await submitForVerification.mutateAsync({
        documentId: uploadResult.documentId,
        verificationType: documentType === 'aadhaar' ? 'aadhaar' : 'pan',
        entityType: 'contractor',
        entityId: contractorId,
      });

      setVerificationSteps(prev => prev.map(s =>
        s.id === 'document'
          ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
          : s
      ));

      toast.success('Document uploaded and verified successfully');
      setCurrentStep('selfie');
    } catch (error) {
      setVerificationSteps(prev => prev.map(s =>
        s.id === 'document' ? { ...s, status: 'failed' } : s
      ));
      toast.error(error instanceof Error ? error.message : 'Failed to upload document');
    }
  };

  const handleSelfieCapture = async () => {
    if (!contractorId) {
      toast.error('User not found');
      return;
    }

    setVerificationSteps(prev => prev.map(s =>
      s.id === 'selfie' ? { ...s, status: 'in_progress' } : s
    ));

    try {
      // In a real implementation, we'd capture from the webcam
      // For now, we'll simulate with a placeholder image
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(0, 0, 640, 480);
      }
      const imageData = canvas.toDataURL('image/jpeg');

      const selfieResult = await captureSelfie.mutateAsync({
        imageData,
        entityType: 'contractor',
        entityId: contractorId,
      });

      setSelfieDocumentId(selfieResult.documentId);

      setVerificationSteps(prev => prev.map(s =>
        s.id === 'selfie'
          ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() }
          : s
      ));

      // Auto liveness check
      setVerificationSteps(prev => prev.map(s =>
        s.id === 'liveness' ? { ...s, status: 'in_progress' } : s
      ));

      const livenessResult = await performLivenessCheck.mutateAsync({
        videoFrames: [imageData], // In production, would be multiple frames
        entityType: 'contractor',
        entityId: contractorId,
      });

      setVerificationSteps(prev => prev.map(s =>
        s.id === 'liveness'
          ? { ...s, status: livenessResult.passed ? 'completed' : 'failed', timestamp: new Date().toLocaleTimeString() }
          : s
      ));

      if (livenessResult.passed) {
        toast.success('Selfie captured and liveness verified');
        setCurrentStep('review');
      } else {
        toast.error('Liveness check failed. Please try again.');
      }
    } catch (error) {
      setVerificationSteps(prev => prev.map(s =>
        ['selfie', 'liveness'].includes(s.id) ? { ...s, status: 'failed' } : s
      ));
      toast.error(error instanceof Error ? error.message : 'Failed to capture selfie');
    }
  };

  const handleCompleteVerification = async () => {
    if (!uploadedDocumentId || !selfieDocumentId || !contractorId) {
      toast.error('Missing verification data');
      return;
    }

    setVerificationSteps(prev => prev.map(s =>
      s.id === 'match' ? { ...s, status: 'in_progress' } : s
    ));

    try {
      const matchResult = await performFaceMatch.mutateAsync({
        documentId: uploadedDocumentId,
        selfieDocumentId: selfieDocumentId,
        entityType: 'contractor',
        entityId: contractorId,
      });

      setVerificationSteps(prev => prev.map(s =>
        s.id === 'match'
          ? { ...s, status: matchResult.matched ? 'completed' : 'failed', timestamp: new Date().toLocaleTimeString() }
          : s
      ));

      if (matchResult.matched) {
        toast.success(`Verification complete! Match score: ${matchResult.score.toFixed(1)}%`);
        // Navigate to complete page
        setTimeout(() => {
          router.push('/contractor/onboarding/complete');
        }, 1000);
      } else {
        toast.error('Face match failed. Please try again with clearer photos.');
      }
    } catch (error) {
      setVerificationSteps(prev => prev.map(s =>
        s.id === 'match' ? { ...s, status: 'failed' } : s
      ));
      toast.error(error instanceof Error ? error.message : 'Face match verification failed');
    }
  };

  const getStatusIcon = (status: VerificationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const isUploading = uploadDocument.isPending || submitForVerification.isPending;
  const isCapturingSelfie = captureSelfie.isPending || performLivenessCheck.isPending;
  const isVerifying = performFaceMatch.isPending;

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

            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              {selectedFile ? (
                <>
                  <p className="font-medium text-green-700">File Selected</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedFile.name}</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-700">Upload Document</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click to upload front and back of your document
                  </p>
                </>
              )}
              <Button variant="outline" className="mt-4">
                {selectedFile ? 'Change File' : 'Choose File'}
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
              disabled={!documentNumber || !selectedFile || isUploading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload & Continue'
              )}
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
              disabled={isCapturingSelfie}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isCapturingSelfie ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Capture Selfie'
              )}
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
                    Click below to complete the verification process. We&apos;ll match your selfie with your document photo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Document Photo</p>
                <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Your Selfie</p>
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
