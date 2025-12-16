'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Calendar, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PredefinedJobDescriptionModal } from '@/components/modals/predefined-job-description-modal';
import { NoticePeriodModal } from '@/components/modals/notice-period-modal';
import { StockOptionsModal } from '@/components/modals/stock-options-modal';
import { colors } from '@/lib/design-tokens';

export default function CreateEmployeeContractPage() {
  // Form state
  const [country] = useState('India');
  const [startDate] = useState('11/12/2022');

  // Modal states
  const [jobDescriptionModalOpen, setJobDescriptionModalOpen] = useState(false);
  const [noticePeriodModalOpen, setNoticePeriodModalOpen] = useState(false);
  const [stockOptionsModalOpen, setStockOptionsModalOpen] = useState(false);

  // Benefits toggles
  const [leavePolicy, setLeavePolicy] = useState(true);
  const [probationNoticePeriod, setProbationNoticePeriod] = useState(true);
  const [holidayCalendar, setHolidayCalendar] = useState(true);
  const [backgroundCheck, setBackgroundCheck] = useState(true);
  const [healthCare, setHealthCare] = useState(true);
  const [stockOptions, setStockOptions] = useState(true);

  // Values from modals
  const [selectedJobDescription, setSelectedJobDescription] = useState<string | null>(null);
  const [noticePeriodValue, setNoticePeriodValue] = useState('15 days');
  const [stockOptionsData, setStockOptionsData] = useState({
    type: 'Incentive Stock Options (ISOs)',
    vestingSchedule: '',
    vestingStartDate: '',
    numberOfOptions: '',
    vestingExpirationDate: ''
  });

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-semibold" style={{ color: colors.neutral800 }}>
          Create employee contract
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/employer/contracts">
            <Button
              variant="ghost"
              className="font-semibold text-[12px] tracking-[0.75px]"
              style={{ color: colors.iconBlue }}
            >
              Cancel
            </Button>
          </Link>
          <Button
            variant="outline"
            className="font-semibold text-[12px] tracking-[0.75px]"
            style={{ color: colors.iconBlue, borderColor: colors.iconBlue }}
          >
            Save draft
          </Button>
          <Button
            className="text-white font-semibold text-[12px] tracking-[0.75px]"
            style={{ backgroundColor: colors.primary500 }}
          >
            Save & Preview
          </Button>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Left Sidebar - Navigation */}
        <div className="w-[150px] shrink-0">
          <nav className="space-y-2">
            <a href="#job-details" className="block text-[16px] font-semibold leading-[47px]" style={{ color: colors.primary500 }}>
              Job Details
            </a>
            <a href="#compensations" className="block text-[16px] font-semibold leading-[47px]" style={{ color: colors.neutral500 }}>
              Compensations
            </a>
            <a href="#benefits" className="block text-[16px] font-semibold leading-[47px]" style={{ color: colors.neutral500 }}>
              Benefits
            </a>
          </nav>
        </div>

        {/* Main Form */}
        <div className="flex-1 max-w-[532px] border-l pl-12" style={{ borderColor: colors.border }}>
          {/* Job Details Section */}
          <section id="job-details" className="mb-12">
            <h2 className="text-[20px] font-semibold mb-8" style={{ color: colors.neutral800 }}>Job details</h2>

            <div className="space-y-8">
              {/* Country */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Country</label>
                <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                  <span className="text-xl">🇮🇳</span>
                  <span className="flex-1 text-[16px] text-[#353B41]">{country}</span>
                  <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                </div>
              </div>

              {/* Entity */}
              <div>
                <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                  <span className="flex-1 text-[16px] text-[#A8B5C2]">Entity*</span>
                  <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                </div>
              </div>

              {/* Employee first name */}
              <Input
                placeholder="Employee first name"
                className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
              />

              {/* Middle name */}
              <Input
                placeholder="Middle name"
                className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
              />

              {/* Last name */}
              <Input
                placeholder="Last name"
                className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
              />

              {/* Employee personal email */}
              <Input
                placeholder="Employee personal email"
                className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
              />

              {/* Employee phone number */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Employee phone number</label>
                <Input
                  defaultValue="+91-"
                  className="h-12 border-[#DEE4EB] text-[16px] text-[#353B41]"
                />
              </div>

              {/* Start date */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Start date</label>
                <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                  <Calendar className="h-5 w-5 text-[#A8B5C2]" />
                  <span className="flex-1 text-[16px] text-[#353B41]">{startDate}</span>
                </div>
              </div>

              {/* Job title */}
              <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                <span className="flex-1 text-[16px] text-[#A8B5C2]">Job title</span>
                <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
              </div>

              {/* Job description */}
              <div className="space-y-3">
                <textarea
                  placeholder="Job description"
                  value={selectedJobDescription || ''}
                  onChange={(e) => setSelectedJobDescription(e.target.value)}
                  className="w-full h-[103px] px-4 py-3 bg-white border border-[#DEE4EB] rounded-md text-[16px] placeholder:text-[#A8B5C2] resize-none focus:outline-none focus:border-[#586AF5]"
                />
                <Button
                  variant="ghost"
                  className="text-[#586AF5] font-semibold text-[12px] tracking-[0.75px] px-3"
                  onClick={() => setJobDescriptionModalOpen(true)}
                >
                  Select predefined job description
                </Button>
              </div>
            </div>
          </section>

          {/* Compensation Section */}
          <section id="compensations" className="mb-12">
            <h2 className="text-[20px] font-semibold mb-8" style={{ color: colors.neutral800 }}>Compensation</h2>

            <div className="space-y-8">
              {/* Currency */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Currency*</label>
                <div className="flex items-center gap-4 px-4 py-3 bg-[#F4F7FA] border border-[#DEE4EB] rounded-md">
                  <span className="flex-1 text-[16px] text-[#353B41]">INR</span>
                  <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                </div>
              </div>

              {/* Gross salary */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Gross salary*</label>
                <Input
                  defaultValue="10,00,000"
                  className="h-12 border-[#DEE4EB] text-[16px] text-[#353B41]"
                />
              </div>

              {/* Salary breakup */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Salary breakup</label>
                <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                  <span className="flex-1 text-[16px] text-[#A8B5C2]">Select breakup template</span>
                  <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                </div>
              </div>

              {/* Joining bonus */}
              <Input
                placeholder="Joining bonus"
                className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
              />

              {/* Salary payment frequency */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Salary payment frequency*</label>
                <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                  <span className="flex-1 text-[16px] text-[#353B41]">Monthly</span>
                  <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits">
            <h2 className="text-[20px] font-semibold mb-8" style={{ color: colors.neutral800 }}>Benefits</h2>

            <div className="space-y-6">
              {/* Leave policy */}
              <div className="flex items-start justify-between py-4 border-b border-[#DEE4EB]">
                <div className="space-y-2">
                  <p className="text-[16px] text-[#505862]">Leave policy</p>
                  <p className="text-[12px] text-[#6A7682]">On the basis of the company settings</p>
                </div>
                <Switch
                  checked={leavePolicy}
                  onCheckedChange={setLeavePolicy}
                  className="data-[state=checked]:bg-[#642DFC]"
                />
              </div>

              {/* Probation/notice period */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-[16px] text-[#505862]">Probation/notice period</p>
                    <p className="text-[12px] text-[#6A7682]">On the basis of the default company settings</p>
                  </div>
                  <Switch
                    checked={probationNoticePeriod}
                    onCheckedChange={setProbationNoticePeriod}
                    className="data-[state=checked]:bg-[#642DFC]"
                  />
                </div>

                {probationNoticePeriod && (
                  <>
                    <div className="flex items-center gap-4 px-4 py-3 bg-[#F4F7FA] border border-[#DEE4EB] rounded-md mt-4">
                      <span className="flex-1 text-[16px] text-[#353B41]">{noticePeriodValue}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-[#586AF5] font-semibold text-[12px] tracking-[0.75px] px-3 gap-2"
                      onClick={() => setNoticePeriodModalOpen(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  </>
                )}
                <div className="border-b border-[#DEE4EB] mt-4" />
              </div>

              {/* Holiday calendar */}
              <div className="flex items-start justify-between py-4 border-b border-[#DEE4EB]">
                <div className="space-y-2">
                  <p className="text-[16px] text-[#505862]">Holiday calendar</p>
                  <p className="text-[12px] text-[#6A7682]">On the basis of the company settings</p>
                </div>
                <Switch
                  checked={holidayCalendar}
                  onCheckedChange={setHolidayCalendar}
                  className="data-[state=checked]:bg-[#642DFC]"
                />
              </div>

              {/* Background check */}
              <div className="flex items-start justify-between py-4 border-b border-[#DEE4EB]">
                <div className="space-y-2">
                  <p className="text-[16px] text-[#505862]">Background check</p>
                  <p className="text-[12px] text-[#6A7682]">On the basis of the company settings</p>
                </div>
                <Switch
                  checked={backgroundCheck}
                  onCheckedChange={setBackgroundCheck}
                  className="data-[state=checked]:bg-[#642DFC]"
                />
              </div>

              {/* Health care */}
              <div className="flex items-start justify-between py-4 border-b border-[#DEE4EB]">
                <div className="space-y-2">
                  <p className="text-[16px] text-[#505862]">Health care</p>
                  <p className="text-[12px] text-[#6A7682]">On the basis of the company settings</p>
                </div>
                <Switch
                  checked={healthCare}
                  onCheckedChange={setHealthCare}
                  className="data-[state=checked]:bg-[#642DFC]"
                />
              </div>

              {/* Stock options */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-[16px] text-[#505862]">Stock options</p>
                    <p className="text-[12px] text-[#6A7682]">On the basis of the default company settings</p>
                  </div>
                  <Switch
                    checked={stockOptions}
                    onCheckedChange={setStockOptions}
                    className="data-[state=checked]:bg-[#642DFC]"
                  />
                </div>

                {stockOptions && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[16px] text-[#8593A3]">Type of stocks</label>
                      <div className="flex items-center gap-4 px-4 py-3 bg-[#F4F7FA] border border-[#DEE4EB] rounded-md">
                        <span className="flex-1 text-[16px] text-[#353B41]">{stockOptionsData.type}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="text-[#586AF5] font-semibold text-[12px] tracking-[0.75px] px-3 gap-2"
                      onClick={() => setStockOptionsModalOpen(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>

                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <Calendar className="h-5 w-5 text-[#A8B5C2]" />
                      <span className="flex-1 text-[16px] text-[#A8B5C2]">
                        {stockOptionsData.vestingStartDate || 'Vesting start date'}
                      </span>
                    </div>

                    <Input
                      placeholder="Number of options being granted"
                      value={stockOptionsData.numberOfOptions}
                      onChange={(e) => setStockOptionsData(prev => ({ ...prev, numberOfOptions: e.target.value }))}
                      className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
                    />

                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <span className="flex-1 text-[16px] text-[#A8B5C2]">
                        {stockOptionsData.vestingSchedule || 'Vesting schedule'}
                      </span>
                      <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                    </div>

                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <Calendar className="h-5 w-5 text-[#A8B5C2]" />
                      <span className="flex-1 text-[16px] text-[#A8B5C2]">
                        {stockOptionsData.vestingExpirationDate || 'Vesting expiration date'}
                      </span>
                    </div>
                  </>
                )}
                <div className="border-b border-[#DEE4EB] mt-4" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <PredefinedJobDescriptionModal
        open={jobDescriptionModalOpen}
        onOpenChange={setJobDescriptionModalOpen}
        onSelect={(description) => {
          setSelectedJobDescription(description);
          setJobDescriptionModalOpen(false);
        }}
      />

      <NoticePeriodModal
        open={noticePeriodModalOpen}
        onOpenChange={setNoticePeriodModalOpen}
        currentValue={noticePeriodValue}
        onSave={(value) => {
          setNoticePeriodValue(value);
          setNoticePeriodModalOpen(false);
        }}
      />

      <StockOptionsModal
        open={stockOptionsModalOpen}
        onOpenChange={setStockOptionsModalOpen}
        currentData={stockOptionsData}
        onSave={(data) => {
          setStockOptionsData(data);
          setStockOptionsModalOpen(false);
        }}
      />
    </div>
  );
}
