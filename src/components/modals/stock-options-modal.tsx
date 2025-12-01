'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StockOptionsData {
  type: string;
  vestingSchedule: string;
  vestingStartDate: string;
  numberOfOptions: string;
  vestingExpirationDate: string;
}

interface StockOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: StockOptionsData;
  onSave: (data: StockOptionsData) => void;
}

const stockTypes = [
  { value: 'Incentive Stock Options (ISOs)', label: 'Incentive Stock Options (ISOs)' },
  { value: 'Non-Qualified Stock Options (NSOs)', label: 'Non-Qualified Stock Options (NSOs)' },
  { value: 'Restricted Stock Units (RSUs)', label: 'Restricted Stock Units (RSUs)' },
  { value: 'Employee Stock Purchase Plan (ESPP)', label: 'Employee Stock Purchase Plan (ESPP)' },
];

const vestingSchedules = [
  { value: '4 years with 1-year cliff', label: '4 years with 1-year cliff' },
  { value: '3 years with 1-year cliff', label: '3 years with 1-year cliff' },
  { value: '4 years monthly vesting', label: '4 years monthly vesting' },
  { value: '3 years monthly vesting', label: '3 years monthly vesting' },
  { value: 'Immediate vesting', label: 'Immediate vesting' },
  { value: 'Custom', label: 'Custom' },
];

export function StockOptionsModal({
  open,
  onOpenChange,
  currentData,
  onSave,
}: StockOptionsModalProps) {
  const [formData, setFormData] = useState<StockOptionsData>(currentData);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(currentData);
    }
  }, [open, currentData]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-[#DEE4EB]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[20px] font-semibold text-[#353B41]">
              Edit stock options
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-[#8593A3]" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          <p className="text-[14px] text-[#6A7682]">
            Configure the stock options for this employee. These settings will override the default company settings.
          </p>

          {/* Type of stocks */}
          <div className="space-y-2">
            <label className="text-[16px] text-[#8593A3]">Type of stocks</label>
            <div className="relative">
              <div
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md cursor-pointer hover:border-[#A8B5C2] transition-colors"
              >
                <span className="flex-1 text-[16px] text-[#353B41]">{formData.type || 'Select type'}</span>
                <ChevronDown className={`h-5 w-5 text-[#A8B5C2] transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DEE4EB] rounded-md shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  {stockTypes.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setFormData({ ...formData, type: option.value });
                        setShowTypeDropdown(false);
                      }}
                      className={`px-4 py-3 cursor-pointer hover:bg-[#F4F7FA] transition-colors ${
                        formData.type === option.value ? 'bg-[#F8F5FF] text-[#642DFC]' : 'text-[#353B41]'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Number of options */}
          <div className="space-y-2">
            <label className="text-[16px] text-[#8593A3]">Number of options being granted</label>
            <Input
              placeholder="e.g., 10,000"
              value={formData.numberOfOptions}
              onChange={(e) => setFormData({ ...formData, numberOfOptions: e.target.value })}
              className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
            />
          </div>

          {/* Vesting schedule */}
          <div className="space-y-2">
            <label className="text-[16px] text-[#8593A3]">Vesting schedule</label>
            <div className="relative">
              <div
                onClick={() => setShowScheduleDropdown(!showScheduleDropdown)}
                className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md cursor-pointer hover:border-[#A8B5C2] transition-colors"
              >
                <span className={`flex-1 text-[16px] ${formData.vestingSchedule ? 'text-[#353B41]' : 'text-[#A8B5C2]'}`}>
                  {formData.vestingSchedule || 'Select vesting schedule'}
                </span>
                <ChevronDown className={`h-5 w-5 text-[#A8B5C2] transition-transform ${showScheduleDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showScheduleDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DEE4EB] rounded-md shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  {vestingSchedules.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setFormData({ ...formData, vestingSchedule: option.value });
                        setShowScheduleDropdown(false);
                      }}
                      className={`px-4 py-3 cursor-pointer hover:bg-[#F4F7FA] transition-colors ${
                        formData.vestingSchedule === option.value ? 'bg-[#F8F5FF] text-[#642DFC]' : 'text-[#353B41]'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vesting start date */}
          <div className="space-y-2">
            <label className="text-[16px] text-[#8593A3]">Vesting start date</label>
            <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
              <Calendar className="h-5 w-5 text-[#A8B5C2]" />
              <Input
                type="date"
                value={formData.vestingStartDate}
                onChange={(e) => setFormData({ ...formData, vestingStartDate: e.target.value })}
                className="flex-1 border-0 p-0 h-auto text-[16px] placeholder:text-[#A8B5C2] focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Vesting expiration date */}
          <div className="space-y-2">
            <label className="text-[16px] text-[#8593A3]">Vesting expiration date</label>
            <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md">
              <Calendar className="h-5 w-5 text-[#A8B5C2]" />
              <Input
                type="date"
                value={formData.vestingExpirationDate}
                onChange={(e) => setFormData({ ...formData, vestingExpirationDate: e.target.value })}
                className="flex-1 border-0 p-0 h-auto text-[16px] placeholder:text-[#A8B5C2] focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Info text */}
          <div className="p-4 bg-[#F4F7FA] rounded-lg">
            <p className="text-[12px] text-[#6A7682]">
              Stock options give employees the right to purchase company shares at a predetermined price.
              The vesting schedule determines when these options become exercisable.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-[#DEE4EB]">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#586AF5] font-semibold text-[12px] tracking-[0.75px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#642DFC] hover:bg-[#5020d9] text-white font-semibold text-[12px] tracking-[0.75px]"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
