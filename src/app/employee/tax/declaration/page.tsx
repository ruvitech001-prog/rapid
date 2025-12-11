'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import {
  useInvestmentDeclaration,
  useSaveDeclaration,
  useSubmitDeclaration,
} from '@/lib/hooks'

export default function TaxDeclarationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const employeeId = user?.id
  const [selectedRegime, setSelectedRegime] = useState<'old' | 'new'>('old')

  const { data: existingDeclaration, isLoading } = useInvestmentDeclaration(employeeId)
  const saveDeclaration = useSaveDeclaration()
  const submitDeclaration = useSubmitDeclaration()

  const [declarations, setDeclarations] = useState({
    hra: { rent: '', landlordName: '', landlordPAN: '', address: '' },
    section80C: { ppf: '', elss: '', insurance: '', nsc: '', fd: '' },
    section80D: { selfInsurance: '', parentsInsurance: '', preventiveCheckup: '' },
    section80E: { educationLoan: '' },
    section24: { homeLoanInterest: '' },
    otherInvestments: { nps: '', educationCess: '' },
  })

  // Load existing declaration data
  useEffect(() => {
    if (existingDeclaration) {
      setSelectedRegime((existingDeclaration.tax_regime as 'old' | 'new') || 'old')
      setDeclarations({
        hra: {
          rent: existingDeclaration.hra_rent_paid?.toString() || '',
          landlordName: existingDeclaration.hra_landlord_name || '',
          landlordPAN: existingDeclaration.hra_landlord_pan || '',
          address: existingDeclaration.hra_rental_address || '',
        },
        section80C: {
          ppf: existingDeclaration.section_80c_ppf?.toString() || '',
          elss: existingDeclaration.section_80c_elss?.toString() || '',
          insurance: existingDeclaration.section_80c_lic?.toString() || '',
          nsc: existingDeclaration.section_80c_nsc?.toString() || '',
          fd: existingDeclaration.section_80c_fd?.toString() || '',
        },
        section80D: {
          selfInsurance: existingDeclaration.section_80d_health_insurance?.toString() || '',
          parentsInsurance: existingDeclaration.section_80d_parents_insurance?.toString() || '',
          preventiveCheckup: existingDeclaration.section_80d_preventive_checkup?.toString() || '',
        },
        section80E: {
          educationLoan: existingDeclaration.section_80e_education_loan?.toString() || '',
        },
        section24: {
          homeLoanInterest: existingDeclaration.section_24b_home_loan_interest?.toString() || '',
        },
        otherInvestments: {
          nps: existingDeclaration.section_80ccd_nps?.toString() || '',
          educationCess: '',
        },
      })
    }
  }, [existingDeclaration])

  const handleChange = (section: string, field: string, value: string) => {
    setDeclarations({
      ...declarations,
      [section]: {
        ...declarations[section as keyof typeof declarations],
        [field]: value
      }
    })
  }

  const calculateTotal80C = () => {
    const { ppf, elss, insurance, nsc, fd } = declarations.section80C
    return (parseFloat(ppf || '0') + parseFloat(elss || '0') + parseFloat(insurance || '0') +
            parseFloat(nsc || '0') + parseFloat(fd || '0'))
  }

  const calculateTotal80D = () => {
    const { selfInsurance, parentsInsurance, preventiveCheckup } = declarations.section80D
    return (parseFloat(selfInsurance || '0') + parseFloat(parentsInsurance || '0') +
            parseFloat(preventiveCheckup || '0'))
  }

  const totalDeductions = calculateTotal80C() + calculateTotal80D() +
                          parseFloat(declarations.section80E.educationLoan || '0') +
                          parseFloat(declarations.section24.homeLoanInterest || '0') +
                          parseFloat(declarations.otherInvestments.nps || '0')

  const handleSave = async () => {
    if (!employeeId) return

    try {
      await saveDeclaration.mutateAsync({
        employeeId,
        declaration: {
          tax_regime: selectedRegime,
          hra_rent_paid: parseFloat(declarations.hra.rent) || 0,
          hra_landlord_name: declarations.hra.landlordName,
          hra_landlord_pan: declarations.hra.landlordPAN,
          hra_rental_address: declarations.hra.address,
          section_80c_ppf: parseFloat(declarations.section80C.ppf) || 0,
          section_80c_elss: parseFloat(declarations.section80C.elss) || 0,
          section_80c_lic: parseFloat(declarations.section80C.insurance) || 0,
          section_80c_nsc: parseFloat(declarations.section80C.nsc) || 0,
          section_80c_fd: parseFloat(declarations.section80C.fd) || 0,
          section_80d_health_insurance: parseFloat(declarations.section80D.selfInsurance) || 0,
          section_80d_parents_insurance: parseFloat(declarations.section80D.parentsInsurance) || 0,
          section_80d_preventive_checkup: parseFloat(declarations.section80D.preventiveCheckup) || 0,
          section_80e_education_loan: parseFloat(declarations.section80E.educationLoan) || 0,
          section_24b_home_loan_interest: parseFloat(declarations.section24.homeLoanInterest) || 0,
          section_80ccd_nps: parseFloat(declarations.otherInvestments.nps) || 0,
        },
      })
      toast.success('Declaration saved as draft')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save declaration')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!employeeId) return

    try {
      // First save the declaration
      const saved = await saveDeclaration.mutateAsync({
        employeeId,
        declaration: {
          tax_regime: selectedRegime,
          hra_rent_paid: parseFloat(declarations.hra.rent) || 0,
          hra_landlord_name: declarations.hra.landlordName,
          hra_landlord_pan: declarations.hra.landlordPAN,
          hra_rental_address: declarations.hra.address,
          section_80c_ppf: parseFloat(declarations.section80C.ppf) || 0,
          section_80c_elss: parseFloat(declarations.section80C.elss) || 0,
          section_80c_lic: parseFloat(declarations.section80C.insurance) || 0,
          section_80c_nsc: parseFloat(declarations.section80C.nsc) || 0,
          section_80c_fd: parseFloat(declarations.section80C.fd) || 0,
          section_80d_health_insurance: parseFloat(declarations.section80D.selfInsurance) || 0,
          section_80d_parents_insurance: parseFloat(declarations.section80D.parentsInsurance) || 0,
          section_80d_preventive_checkup: parseFloat(declarations.section80D.preventiveCheckup) || 0,
          section_80e_education_loan: parseFloat(declarations.section80E.educationLoan) || 0,
          section_24b_home_loan_interest: parseFloat(declarations.section24.homeLoanInterest) || 0,
          section_80ccd_nps: parseFloat(declarations.otherInvestments.nps) || 0,
        },
      })

      // Then submit it
      await submitDeclaration.mutateAsync(saved.id)
      toast.success('Tax declaration submitted successfully!')
      router.push('/employee/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit declaration')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const isSubmitting = saveDeclaration.isPending || submitDeclaration.isPending

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tax Declaration</h1>
        <p className="mt-2 text-muted-foreground">Declare your investments and claim tax exemptions</p>
      </div>

      {/* Tax Regime Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Tax Regime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRegime('old')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                selectedRegime === 'old' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-medium">Old Tax Regime</h3>
              <p className="text-sm text-muted-foreground mt-1">With deductions and exemptions (80C, HRA, etc.)</p>
            </button>
            <button
              onClick={() => setSelectedRegime('new')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                selectedRegime === 'new' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-medium">New Tax Regime</h3>
              <p className="text-sm text-muted-foreground mt-1">Lower tax rates without deductions</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {selectedRegime === 'old' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HRA Declaration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">HRA Declaration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Annual Rent Paid</label>
                <input
                  type="number"
                  value={declarations.hra.rent}
                  onChange={(e) => handleChange('hra', 'rent', e.target.value)}
                  placeholder="120000"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Landlord Name</label>
                <input
                  type="text"
                  value={declarations.hra.landlordName}
                  onChange={(e) => handleChange('hra', 'landlordName', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Landlord PAN</label>
                <input
                  type="text"
                  value={declarations.hra.landlordPAN}
                  onChange={(e) => handleChange('hra', 'landlordPAN', e.target.value)}
                  maxLength={10}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rental Address</label>
                <input
                  type="text"
                  value={declarations.hra.address}
                  onChange={(e) => handleChange('hra', 'address', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 80C */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Section 80C (Max ₹1,50,000)</h2>
            <p className="text-sm text-gray-500 mb-4">Investments in PPF, ELSS, Insurance, NSC, etc.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">PPF</label>
                <input
                  type="number"
                  value={declarations.section80C.ppf}
                  onChange={(e) => handleChange('section80C', 'ppf', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ELSS Mutual Funds</label>
                <input
                  type="number"
                  value={declarations.section80C.elss}
                  onChange={(e) => handleChange('section80C', 'elss', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Life Insurance Premium</label>
                <input
                  type="number"
                  value={declarations.section80C.insurance}
                  onChange={(e) => handleChange('section80C', 'insurance', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">NSC</label>
                <input
                  type="number"
                  value={declarations.section80C.nsc}
                  onChange={(e) => handleChange('section80C', 'nsc', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tax Saver FD</label>
                <input
                  type="number"
                  value={declarations.section80C.fd}
                  onChange={(e) => handleChange('section80C', 'fd', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">Total 80C:</span>
                <span className="text-sm font-bold text-blue-600">₹{calculateTotal80C().toLocaleString()}</span>
              </div>
              {calculateTotal80C() > 150000 && (
                <p className="text-xs text-red-600 mt-1">Maximum limit is ₹1,50,000</p>
              )}
            </div>
          </div>

          {/* Section 80D */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Section 80D (Health Insurance)</h2>
            <p className="text-sm text-gray-500 mb-4">Max ₹25,000 for self + ₹25,000 for parents (₹50,000 for senior citizens)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Self & Family Premium</label>
                <input
                  type="number"
                  value={declarations.section80D.selfInsurance}
                  onChange={(e) => handleChange('section80D', 'selfInsurance', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parents Premium</label>
                <input
                  type="number"
                  value={declarations.section80D.parentsInsurance}
                  onChange={(e) => handleChange('section80D', 'parentsInsurance', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preventive Health Checkup</label>
                <input
                  type="number"
                  value={declarations.section80D.preventiveCheckup}
                  onChange={(e) => handleChange('section80D', 'preventiveCheckup', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">Total 80D:</span>
                <span className="text-sm font-bold text-blue-600">₹{calculateTotal80D().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Other Deductions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Other Deductions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Section 80E (Education Loan Interest)</label>
                <input
                  type="number"
                  value={declarations.section80E.educationLoan}
                  onChange={(e) => handleChange('section80E', 'educationLoan', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Section 24 (Home Loan Interest)</label>
                <input
                  type="number"
                  value={declarations.section24.homeLoanInterest}
                  onChange={(e) => handleChange('section24', 'homeLoanInterest', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">NPS (Additional 80CCD(1B))</label>
                <input
                  type="number"
                  value={declarations.otherInvestments.nps}
                  onChange={(e) => handleChange('otherInvestments', 'nps', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Max ₹50,000</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-900 mb-4">Declaration Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-800">Total Deductions:</span>
                <span className="text-lg font-bold text-green-900">₹{totalDeductions.toLocaleString()}</span>
              </div>
              <p className="text-xs text-green-700">
                Your TDS will be reduced based on these declarations. Please submit proofs before March 31st.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {saveDeclaration.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {submitDeclaration.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Declaration
            </Button>
          </div>
        </form>
      )}

      {selectedRegime === 'new' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <p className="text-lg font-medium text-gray-900">New Tax Regime Selected</p>
            <p className="text-sm text-gray-600 mt-2">
              No investment declarations required under the new tax regime.
              You&apos;ll enjoy lower tax rates without claiming deductions.
            </p>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-6"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
