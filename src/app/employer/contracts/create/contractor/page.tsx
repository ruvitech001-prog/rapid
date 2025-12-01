'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Calendar, Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

type ContractorType = 'fixed_rate' | 'hourly' | 'milestone';

interface Milestone {
  id: number;
  name: string;
  description: string;
  fee: string;
}

export default function CreateContractorContractPage() {
  const [contractorType, setContractorType] = useState<ContractorType>('fixed_rate');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, name: 'Initial', description: '', fee: '200,000' }
  ]);

  // Benefits toggles
  const [backgroundCheck, setBackgroundCheck] = useState(true);
  const [noticePeriod, setNoticePeriod] = useState(true);
  const [stockOptions, setStockOptions] = useState(true);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { id: milestones.length + 1, name: '', description: '', fee: '' }
    ]);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-semibold text-[#353B41]">
          Create contractor contract
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/employer/contracts">
            <Button
              variant="ghost"
              className="text-[#586AF5] font-semibold text-[12px] tracking-[0.75px]"
            >
              Cancel
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-[#586AF5] text-[#586AF5] font-semibold text-[12px] tracking-[0.75px]"
          >
            Save draft
          </Button>
          <Button
            className="bg-[#642DFC] hover:bg-[#5020d9] text-white font-semibold text-[12px] tracking-[0.75px]"
          >
            Save & Preview
          </Button>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Left Sidebar - Navigation */}
        <div className="w-[150px] shrink-0">
          <nav className="space-y-2">
            <a href="#job-details" className="block text-[16px] font-semibold text-[#642DFC] leading-[47px]">
              Job Details
            </a>
            <a href="#compensations" className="block text-[16px] font-semibold text-[#8593A3] leading-[47px]">
              Compensations
            </a>
            <a href="#benefits" className="block text-[16px] font-semibold text-[#8593A3] leading-[47px]">
              Benefits
            </a>
          </nav>
        </div>

        {/* Main Form */}
        <div className="flex-1 max-w-[532px] border-l border-[#DEE4EB] pl-12">
          {/* Job Details Section */}
          <section id="job-details" className="mb-12">
            <h2 className="text-[20px] font-semibold text-[#353B41] mb-8">Job details</h2>

            <div className="space-y-8">
              {/* Country */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Country</label>
                <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                  <span className="text-xl">🇮🇳</span>
                  <span className="flex-1 text-[16px] text-[#353B41]">India</span>
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

              {/* Contract name */}
              <div>
                <Input
                  placeholder="Contract name"
                  className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[16px] text-[#8593A3]">Start date</label>
                  <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                    <Calendar className="h-5 w-5 text-[#A8B5C2]" />
                    <span className="flex-1 text-[16px] text-[#353B41]">11/12/2022</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[16px] text-[#8593A3]">Termination date</label>
                  <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                    <Calendar className="h-5 w-5 text-[#A8B5C2]" />
                    <span className="flex-1 text-[16px] text-[#353B41]">12/12/2022</span>
                  </div>
                </div>
              </div>

              {/* Contractor first name - focused state */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8357FD]">Contractor first name</label>
                <div className="flex items-center px-4 py-3 bg-white border-2 border-[#A281FD] rounded-md">
                  <span className="text-[34px] text-[#8357FD] font-thin">I</span>
                </div>
              </div>

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

              {/* Contractor personal email */}
              <Input
                placeholder="Contractor personal email"
                className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
              />

              {/* Contractor phone number */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Contractor phone number</label>
                <Input
                  defaultValue="+91-"
                  className="h-12 border-[#DEE4EB] text-[16px] text-[#353B41]"
                />
              </div>

              {/* Contractor type */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Contractor type*</label>
                <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md cursor-pointer"
                     onClick={() => {
                       const types: ContractorType[] = ['fixed_rate', 'hourly', 'milestone'];
                       const currentIndex = types.indexOf(contractorType);
                       const nextType = types[(currentIndex + 1) % types.length];
                       if (nextType) setContractorType(nextType);
                     }}>
                  <span className="flex-1 text-[16px] text-[#353B41]">
                    {contractorType === 'fixed_rate' ? 'Fixed rate' :
                     contractorType === 'hourly' ? 'Hourly' : 'Milestone'}
                  </span>
                  <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
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
                  className="w-full h-[103px] px-4 py-3 bg-white border border-[#DEE4EB] rounded-md text-[16px] placeholder:text-[#A8B5C2] resize-none focus:outline-none focus:border-[#586AF5]"
                />
                <Link href="/employer/contracts/create/contractor?modal=job-description">
                  <Button
                    variant="ghost"
                    className="text-[#586AF5] font-semibold text-[12px] tracking-[0.75px] px-3"
                  >
                    Select predefined job description
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Compensation Section */}
          <section id="compensations" className="mb-12">
            <h2 className="text-[20px] font-semibold text-[#353B41] mb-8">Compensation</h2>

            <div className="space-y-8">
              {/* Currency */}
              <div className="space-y-1">
                <label className="text-[16px] text-[#8593A3]">Currency*</label>
                <div className="flex items-center gap-4 px-4 py-3 bg-[#F4F7FA] border border-[#DEE4EB] rounded-md">
                  <span className="flex-1 text-[16px] text-[#353B41]">USD</span>
                  <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                </div>
              </div>

              {/* Conditional fields based on contractor type */}
              {contractorType === 'fixed_rate' && (
                <>
                  {/* Payment rate */}
                  <div className="space-y-1">
                    <label className="text-[16px] text-[#8593A3]">Payment rate*</label>
                    <Input
                      defaultValue="200,000"
                      className="h-12 border-[#DEE4EB] text-[16px] text-[#353B41]"
                    />
                  </div>

                  {/* Payment frequency */}
                  <div className="space-y-1">
                    <label className="text-[16px] text-[#8593A3]">Payment frequency*</label>
                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <span className="flex-1 text-[16px] text-[#353B41]">Monthly</span>
                      <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                    </div>
                  </div>
                </>
              )}

              {contractorType === 'hourly' && (
                <>
                  {/* Hourly Rate */}
                  <div className="space-y-1">
                    <label className="text-[16px] text-[#8593A3]">Hourly Rate*</label>
                    <Input
                      defaultValue="250,000"
                      className="h-12 border-[#DEE4EB] text-[16px] text-[#353B41]"
                    />
                  </div>

                  {/* Invoice cycle */}
                  <div className="space-y-1">
                    <label className="text-[16px] text-[#8593A3]">Invoice cycle*</label>
                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <span className="flex-1 text-[16px] text-[#353B41]">Monthly</span>
                      <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                    </div>
                  </div>

                  {/* Payment frequency */}
                  <div className="space-y-1">
                    <label className="text-[16px] text-[#8593A3]">Payment frequency*</label>
                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <span className="flex-1 text-[16px] text-[#353B41]">Monthly</span>
                      <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                    </div>
                  </div>
                </>
              )}

              {contractorType === 'milestone' && (
                <>
                  {/* Milestones */}
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="space-y-4">
                      <h3 className="text-[16px] text-[#8593A3]">Milestone {index + 1}</h3>

                      <div className="space-y-1">
                        <label className="text-[16px] text-[#8593A3]">Name*</label>
                        <Input
                          defaultValue={milestone.name}
                          placeholder="Milestone name"
                          className="h-12 border-[#DEE4EB] text-[16px] text-[#353B41]"
                        />
                      </div>

                      <div className="space-y-1">
                        <textarea
                          placeholder="Description"
                          defaultValue={milestone.description}
                          className="w-full h-[80px] px-4 py-3 bg-white border border-[#DEE4EB] rounded-md text-[16px] placeholder:text-[#A8B5C2] resize-none focus:outline-none focus:border-[#586AF5]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[16px] text-[#8593A3]">Fee*</label>
                        <Input
                          defaultValue={milestone.fee}
                          placeholder="Fee"
                          className="h-12 border-[#DEE4EB] text-[16px] text-[#353B41]"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="border-[#586AF5] text-[#586AF5] font-semibold text-[12px] tracking-[0.75px]"
                    onClick={addMilestone}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add another milestone
                  </Button>
                </>
              )}
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits">
            <h2 className="text-[20px] font-semibold text-[#353B41] mb-8">Benefits</h2>

            <div className="space-y-6">
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

              {/* Notice period */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-[16px] text-[#505862]">Notice period</p>
                    <p className="text-[12px] text-[#6A7682]">On the basis of the default company settings</p>
                  </div>
                  <Switch
                    checked={noticePeriod}
                    onCheckedChange={setNoticePeriod}
                    className="data-[state=checked]:bg-[#642DFC]"
                  />
                </div>

                {noticePeriod && (
                  <>
                    <div className="flex items-center gap-4 px-4 py-3 bg-[#F4F7FA] border border-[#DEE4EB] rounded-md mt-4">
                      <span className="flex-1 text-[16px] text-[#353B41]">15 days</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-[#586AF5] font-semibold text-[12px] tracking-[0.75px] px-3 gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  </>
                )}
                <div className="border-b border-[#DEE4EB] mt-4" />
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
                        <span className="flex-1 text-[16px] text-[#353B41]">Incentive Stock Options (ISOs)</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="text-[#586AF5] font-semibold text-[12px] tracking-[0.75px] px-3 gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>

                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <Calendar className="h-5 w-5 text-[#A8B5C2]" />
                      <span className="flex-1 text-[16px] text-[#A8B5C2]">Vesting start date</span>
                    </div>

                    <Input
                      placeholder="Number of options being granted"
                      className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
                    />

                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <span className="flex-1 text-[16px] text-[#A8B5C2]">Vesting schedule</span>
                      <ChevronDown className="h-5 w-5 text-[#A8B5C2]" />
                    </div>

                    <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
                      <Calendar className="h-5 w-5 text-[#A8B5C2]" />
                      <span className="flex-1 text-[16px] text-[#A8B5C2]">Vesting expiration date</span>
                    </div>
                  </>
                )}
                <div className="border-b border-[#DEE4EB] mt-4" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
