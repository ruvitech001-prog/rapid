/**
 * Special Request Type Selector
 * Allows user to select which type of special request to create
 *
 * @route /employer/requests/new/special
 */

'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Gift, Package, PackageOpen, UserX, UserMinus, Clock, CheckCircle, DollarSign, Building, FileEdit } from 'lucide-react'
import { Button } from '@/components/ui/button'

const REQUEST_TYPES = [
  {
    id: 'gifts',
    label: 'Send gifts',
    description: 'Send gifts to team members',
    icon: Gift,
    href: '/employer/requests/new/special/gifts',
  },
  {
    id: 'purchase-equipment',
    label: 'Purchase equipment',
    description: 'Request equipment purchase for team member',
    icon: Package,
    href: '/employer/requests/new/special/purchase-equipment',
  },
  {
    id: 'collect-equipment',
    label: 'Collect equipment',
    description: 'Collect equipment from team member',
    icon: PackageOpen,
    href: '/employer/requests/new/special/collect-equipment',
  },
  {
    id: 'termination',
    label: 'Termination',
    description: 'Process employee termination',
    icon: UserX,
    href: '/employer/requests/new/special/termination',
  },
  {
    id: 'hiring-cancellation',
    label: 'Cancellation of hiring',
    description: 'Cancel pending hire',
    icon: UserMinus,
    href: '/employer/requests/new/special/hiring-cancellation',
  },
  {
    id: 'probation-extension',
    label: 'Extension of probation',
    description: 'Extend probation period',
    icon: Clock,
    href: '/employer/requests/new/special/probation-extension',
  },
  {
    id: 'probation-confirmation',
    label: 'Confirmation of probation',
    description: 'Confirm probation completion',
    icon: CheckCircle,
    href: '/employer/requests/new/special/probation-confirmation',
  },
  {
    id: 'incentive',
    label: 'Incentive payment',
    description: 'Process bonus or incentive payment',
    icon: DollarSign,
    href: '/employer/requests/new/special/incentive',
  },
  {
    id: 'office-space',
    label: 'Renting an office space',
    description: 'Request office space rental',
    icon: Building,
    href: '/employer/requests/new/special/office-space',
  },
  {
    id: 'contract-amendment',
    label: 'Contract amendment',
    description: 'Amend employee contract (salary, stock options, etc.)',
    icon: FileEdit,
    href: '/employer/requests/new/special/contract-amendment',
  },
]

export default function SpecialRequestSelectorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-gray-600"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Create a special request</h1>
          <p className="text-gray-600 mt-1">Select the type of request you want to create</p>
        </div>

        {/* Request Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REQUEST_TYPES.map((type) => (
            <button
              key={type.id}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#DEE4EB] hover:border-[#642DFC]/50 hover:bg-[#642DFC]/5 transition-colors text-left"
              onClick={() => router.push(type.href)}
            >
              <div className="w-10 h-10 rounded-lg bg-[#642DFC]/10 flex items-center justify-center flex-shrink-0">
                <type.icon className="w-5 h-5 text-[#642DFC]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{type.label}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
