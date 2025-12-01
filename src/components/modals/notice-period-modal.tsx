'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NoticePeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentValue: string;
  onSave: (value: string) => void;
}

const periodOptions = [
  { value: '7 days', label: '7 days' },
  { value: '15 days', label: '15 days' },
  { value: '30 days', label: '30 days' },
  { value: '45 days', label: '45 days' },
  { value: '60 days', label: '60 days' },
  { value: '90 days', label: '90 days' },
  { value: 'custom', label: 'Custom' },
];

export function NoticePeriodModal({
  open,
  onOpenChange,
  currentValue,
  onSave,
}: NoticePeriodModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(currentValue);
  const [customValue, setCustomValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (open) {
      const matchingOption = periodOptions.find(opt => opt.value === currentValue);
      if (matchingOption) {
        setSelectedPeriod(currentValue);
      } else {
        setSelectedPeriod('custom');
        setCustomValue(currentValue);
      }
    }
  }, [open, currentValue]);

  const handleSave = () => {
    if (selectedPeriod === 'custom') {
      onSave(customValue || '15 days');
    } else {
      onSave(selectedPeriod);
    }
  };

  const displayValue = selectedPeriod === 'custom'
    ? (customValue || 'Custom')
    : selectedPeriod;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-[#DEE4EB]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[20px] font-semibold text-[#353B41]">
              Edit notice period
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-[#8593A3]" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <p className="text-[14px] text-[#6A7682]">
            Set the notice period for this employee. This will override the default company settings.
          </p>

          {/* Period selector */}
          <div className="space-y-2">
            <label className="text-[16px] text-[#8593A3]">Notice period</label>
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-4 px-4 py-3 bg-white border border-[#DEE4EB] rounded-md cursor-pointer hover:border-[#A8B5C2] transition-colors"
              >
                <span className="flex-1 text-[16px] text-[#353B41]">{displayValue}</span>
                <ChevronDown className={`h-5 w-5 text-[#A8B5C2] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DEE4EB] rounded-md shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  {periodOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSelectedPeriod(option.value);
                        setShowDropdown(false);
                      }}
                      className={`px-4 py-3 cursor-pointer hover:bg-[#F4F7FA] transition-colors ${
                        selectedPeriod === option.value ? 'bg-[#F8F5FF] text-[#642DFC]' : 'text-[#353B41]'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom input */}
          {selectedPeriod === 'custom' && (
            <div className="space-y-2">
              <label className="text-[16px] text-[#8593A3]">Custom period</label>
              <Input
                placeholder="e.g., 21 days"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
              />
            </div>
          )}

          {/* Info text */}
          <div className="p-4 bg-[#F4F7FA] rounded-lg">
            <p className="text-[12px] text-[#6A7682]">
              The notice period defines how much advance notice is required before terminating the employment contract.
              This applies to both employer and employee.
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
