'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

// Toggle switch component
function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
        enabled ? 'bg-[#642DFC]' : 'bg-[#DEE4EB]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
          enabled ? 'translate-x-[18px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  )
}

export default function PerksPage() {
  const [healthPolicyEnabled, setHealthPolicyEnabled] = useState(true)
  const [currentPlan] = useState<'pro' | 'power' | 'premium'>('pro')

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="font-semibold text-[24px] text-[#353B41] leading-none">
          Perks &amp; Benefits
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Create Request Button */}
          <button className="flex items-center gap-2 px-4 py-3 border border-[#586AF5] rounded-lg bg-white hover:bg-[#F4F7FA] transition-colors">
            <span className="font-semibold text-[12px] text-[#586AF5] tracking-[0.75px]">+ Create request</span>
            <ChevronDown className="w-4 h-4 text-[#586AF5]" />
          </button>

          {/* Hire Another Button */}
          <button className="flex items-center gap-2 px-4 py-3 bg-[#642DFC] rounded-lg hover:bg-[#5620e0] transition-colors min-w-[139px] justify-center">
            <span className="font-semibold text-[12px] text-white tracking-[0.75px]">Hire another</span>
          </button>

          {/* Notification Bell */}
          <button className="flex items-center justify-center w-10 h-10 border border-[#EFF2F5] rounded-lg bg-white hover:bg-[#F4F7FA] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#8593A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#8593A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Health Insurance Section */}
      <div className="space-y-2">
        <h2 className="font-semibold text-[20px] text-[#353B41] tracking-[0.15px]">
          Health insurance
        </h2>
        <p className="text-[12px] text-[#6A7682] tracking-[0.25px]">
          One line about this
        </p>
      </div>

      {/* Toggle Row */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-[16px] text-[#505862] tracking-[0.5px]">
              Health policy for the entire team
            </span>
            <span className="text-[12px] text-[#6A7682] tracking-[0.25px]">
              Applying standard insurance policy by Rapid
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ToggleSwitch enabled={healthPolicyEnabled} onToggle={() => setHealthPolicyEnabled(!healthPolicyEnabled)} />
          <ChevronRight className="w-6 h-6 text-[#8593A3]" />
        </div>
      </div>

      {/* Health Care Plan Comparison Table */}
      <div className="border border-[#DEE4EB] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4">
          {/* Coverage Header */}
          <div className="p-4 bg-white border-r border-[#DEE4EB]">
            <span className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px]">
              Coverage
            </span>
          </div>
          {/* Pro Header */}
          <div className="p-4 bg-[#EFF2F5] border-r border-[#DEE4EB] text-center">
            <span className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px]">
              Pro
            </span>
          </div>
          {/* Power Header */}
          <div className="p-4 bg-[#EFF2F5] border-r border-[#DEE4EB] text-center">
            <span className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px]">
              Power
            </span>
          </div>
          {/* Premium Header */}
          <div className="p-4 bg-[#EFF2F5] text-center">
            <span className="font-semibold text-[16px] text-[#353B41] tracking-[0.15px]">
              Premium
            </span>
          </div>
        </div>

        {/* Health Insurance Sum Assured Row */}
        <div className="grid grid-cols-4 border-t border-[#DEE4EB]">
          <div className="p-4 border-r border-[#DEE4EB]">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              Health Insurance (Sum Assured)
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 500,000
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 1,000,000
            </span>
          </div>
          <div className="p-4 text-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 2,000,000
            </span>
          </div>
        </div>

        {/* Family Row */}
        <div className="grid grid-cols-4 border-t border-[#DEE4EB]">
          <div className="p-4 border-r border-[#DEE4EB]">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              Family
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              Employee only
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center">
            <div className="font-medium text-[14px] text-[#505862] tracking-[0.25px] leading-4">
              <p>Employee</p>
              <p>+</p>
              <p>Spouse</p>
              <p>+</p>
              <p>upto 4 children</p>
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="font-medium text-[14px] text-[#505862] tracking-[0.25px] leading-4">
              <p>Employee</p>
              <p>+</p>
              <p>Spouse</p>
              <p>+</p>
              <p>upto 4 children</p>
              <p>+</p>
              <p>Either parents or</p>
              <p>parents in law</p>
            </div>
          </div>
        </div>

        {/* OPD Row */}
        <div className="grid grid-cols-4 border-t border-[#DEE4EB]">
          <div className="p-4 border-r border-[#DEE4EB]">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              OPD incl. Dental and Vision Cover (within Health Insurance)
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center flex items-center justify-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 10,000
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center flex items-center justify-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 15,000
            </span>
          </div>
          <div className="p-4 text-center flex items-center justify-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 20,000
            </span>
          </div>
        </div>

        {/* Maternity Cover Row */}
        <div className="grid grid-cols-4 border-t border-[#DEE4EB]">
          <div className="p-4 border-r border-[#DEE4EB]">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              Maternity Cover (within Health Insurance)
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center flex items-center justify-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              —
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center flex items-center justify-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 150,000
            </span>
          </div>
          <div className="p-4 text-center flex items-center justify-center">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 150,000
            </span>
          </div>
        </div>

        {/* Accident and Disability Insurance Row */}
        <div className="grid grid-cols-4 border-t border-[#DEE4EB]">
          <div className="p-4 border-r border-[#DEE4EB]">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              Accident and Disability Insurance
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center flex items-center justify-center col-span-3">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              INR 30,00,000 only for Employee
            </span>
          </div>
        </div>

        {/* Comprehensive Health Benefits Row */}
        <div className="grid grid-cols-4 border-t border-[#DEE4EB]">
          <div className="p-4 border-r border-[#DEE4EB]">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              Comprehensive health benefits for a superior employee experience
            </span>
          </div>
          <div className="p-4 border-r border-[#DEE4EB] text-center flex items-center justify-center col-span-3">
            <span className="font-medium text-[14px] text-[#505862] tracking-[0.25px]">
              Included
            </span>
          </div>
        </div>

        {/* Cost Section */}
        <div className="grid grid-cols-4 border-t border-[#DEE4EB] bg-[#F6F2FF]">
          <div className="p-6 border-r border-[#DEE4EB]/50">
            <span className="font-semibold text-[16px] text-black tracking-[0.15px]">
              Cost (Paid Annually)
            </span>
          </div>
          <div className="p-6 border-r border-[#DEE4EB]/50 text-center flex flex-col items-center justify-center gap-4">
            <span className="font-medium text-[24px] text-black tracking-[0.25px]">
              $349
            </span>
            <button
              className={`px-4 py-3 rounded-lg border text-[12px] font-semibold tracking-[0.75px] transition-colors ${
                currentPlan === 'pro'
                  ? 'border-[rgba(133,147,163,0.4)] text-[#A8B5C2] bg-white cursor-default'
                  : 'border-[#586AF5] text-[#586AF5] bg-white hover:bg-[#586AF5]/5'
              }`}
            >
              {currentPlan === 'pro' ? 'Current plan' : 'Select plan'}
            </button>
          </div>
          <div className="p-6 border-r border-[#DEE4EB]/50 text-center flex flex-col items-center justify-center gap-4">
            <span className="font-medium text-[24px] text-black tracking-[0.25px]">
              $999
            </span>
            <button
              className={`px-4 py-3 rounded-lg border text-[12px] font-semibold tracking-[0.75px] transition-colors ${
                currentPlan === 'power'
                  ? 'border-[rgba(133,147,163,0.4)] text-[#A8B5C2] bg-white cursor-default'
                  : 'border-[#586AF5] text-[#586AF5] bg-white hover:bg-[#586AF5]/5'
              }`}
            >
              {currentPlan === 'power' ? 'Current plan' : 'Upgrade plan'}
            </button>
          </div>
          <div className="p-6 text-center flex flex-col items-center justify-center gap-4">
            <span className="font-medium text-[24px] text-black tracking-[0.25px]">
              $2099
            </span>
            <button
              className={`px-4 py-3 rounded-lg border text-[12px] font-semibold tracking-[0.75px] transition-colors ${
                currentPlan === 'premium'
                  ? 'border-[rgba(133,147,163,0.4)] text-[#A8B5C2] bg-white cursor-default'
                  : 'border-[#586AF5] text-[#586AF5] bg-white hover:bg-[#586AF5]/5'
              }`}
            >
              {currentPlan === 'premium' ? 'Current plan' : 'Upgrade plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
