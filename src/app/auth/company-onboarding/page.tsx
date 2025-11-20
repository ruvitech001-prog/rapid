'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Step = 1 | 2 | 3 | 4 | 5

export default function CompanyOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState({
    // Step 1: Company Details
    companyName: '',
    legalName: '',
    industry: '',
    size: '',
    // Step 2: Tax Information
    pan: '',
    gstin: '',
    tan: '',
    // Step 3: Statutory Details
    epfNumber: '',
    esicNumber: '',
    ptNumber: '',
    // Step 4: Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = () => {
    console.log('Company onboarding data:', formData)
    // Redirect to employer dashboard
    router.push('/employer/dashboard')
  }

  const steps = [
    { number: 1, name: 'Company Details', description: 'Basic information' },
    { number: 2, name: 'Tax Information', description: 'PAN, GSTIN, TAN' },
    { number: 3, name: 'Statutory Details', description: 'EPF, ESIC numbers' },
    { number: 4, name: 'Address', description: 'Company location' },
    { number: 5, name: 'Review', description: 'Confirm details' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            rapid
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Complete your setup
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Step {currentStep} of 5
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    currentStep >= step.number
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  {step.number}
                </div>
                <span className="mt-2 text-xs font-medium text-foreground hidden md:block">
                  {step.name}
                </span>
              </div>
              {step.number < 5 && (
                <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <Card>
          {/* Step 1: Company Details */}
          {currentStep === 1 && (
            <div>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Basic information about your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal Name *</Label>
                  <Input
                    id="legalName"
                    type="text"
                    name="legalName"
                    required
                    value={formData.legalName}
                    onChange={handleChange}
                    placeholder="Acme Technologies Private Limited"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <select
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size *</Label>
                  <select
                    id="size"
                    name="size"
                    required
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
              </CardContent>
            </div>
          )}

          {/* Step 2: Tax Information */}
          {currentStep === 2 && (
            <div>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
                <CardDescription>PAN, GSTIN, and TAN details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number *</Label>
                  <Input
                    id="pan"
                    type="text"
                    name="pan"
                    required
                    maxLength={10}
                    value={formData.pan}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">10 characters (e.g., ABCDE1234F)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    type="text"
                    name="gstin"
                    maxLength={15}
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="22ABCDE1234F1Z5"
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">15 characters (optional)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tan">TAN Number</Label>
                  <Input
                    id="tan"
                    type="text"
                    name="tan"
                    maxLength={10}
                    value={formData.tan}
                    onChange={handleChange}
                    placeholder="ABCD12345E"
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">10 characters (optional)</p>
                </div>
              </CardContent>
            </div>
          )}

          {/* Step 3: Statutory Details */}
          {currentStep === 3 && (
            <div>
              <CardHeader>
                <CardTitle>Statutory Details</CardTitle>
                <CardDescription>EPF, ESIC, and PT registration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="epfNumber">EPF Number</Label>
                  <Input
                    id="epfNumber"
                    type="text"
                    name="epfNumber"
                    value={formData.epfNumber}
                    onChange={handleChange}
                    placeholder="MH/12345/2024"
                  />
                  <p className="text-xs text-muted-foreground">EPF establishment code (optional)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="esicNumber">ESIC Number</Label>
                  <Input
                    id="esicNumber"
                    type="text"
                    name="esicNumber"
                    value={formData.esicNumber}
                    onChange={handleChange}
                    placeholder="12-34-567890-000"
                  />
                  <p className="text-xs text-muted-foreground">ESIC registration number (optional)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ptNumber">Professional Tax Number</Label>
                  <Input
                    id="ptNumber"
                    type="text"
                    name="ptNumber"
                    value={formData.ptNumber}
                    onChange={handleChange}
                    placeholder="PT123456789"
                  />
                  <p className="text-xs text-muted-foreground">State PT registration (optional)</p>
                </div>
              </CardContent>
            </div>
          )}

          {/* Step 4: Address */}
          {currentStep === 4 && (
            <div>
              <CardHeader>
                <CardTitle>Company Address</CardTitle>
                <CardDescription>Where is your company located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Building No., Street Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Locality, Landmark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="">Select state</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      type="text"
                      name="country"
                      value={formData.country}
                      disabled
                      className="bg-muted text-muted-foreground"
                    />
                  </div>
                </div>
              </CardContent>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div>
              <CardHeader>
                <CardTitle>Review & Confirm</CardTitle>
                <CardDescription>Please verify all details are correct</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Company Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company Name:</span>
                      <span className="font-medium">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Legal Name:</span>
                      <span className="font-medium">{formData.legalName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span className="font-medium">{formData.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{formData.size}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Tax Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PAN:</span>
                      <span className="font-medium">{formData.pan || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GSTIN:</span>
                      <span className="font-medium">{formData.gstin || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TAN:</span>
                      <span className="font-medium">{formData.tan || '-'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Address</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-foreground">
                    <p>
                      {formData.addressLine1}<br />
                      {formData.addressLine2 && <>{formData.addressLine2}<br /></>}
                      {formData.city}, {formData.state} - {formData.pincode}<br />
                      {formData.country}
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3">
          <Button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline"
          >
            Previous
          </Button>
          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
            >
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
