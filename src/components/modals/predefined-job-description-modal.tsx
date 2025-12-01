'use client';

import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PredefinedJobDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (description: string) => void;
}

const jobDescriptions = [
  {
    id: '1',
    title: 'UI/UX Designer',
    description: 'We are looking for a talented UI/UX Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts.',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    description: 'We are seeking a skilled Frontend Developer to join our team. You will be responsible for implementing visual elements that users see and interact within a web application. You should have strong proficiency in JavaScript, HTML, CSS, and modern frameworks.',
  },
  {
    id: '3',
    title: 'Backend Developer',
    description: 'We are looking for an experienced Backend Developer to join our engineering team. You will be responsible for the server-side logic, database architecture, and API development. Experience with Node.js, Python, or Java is required.',
  },
  {
    id: '4',
    title: 'Product Manager',
    description: 'We are hiring a Product Manager to lead product development initiatives. You will define product vision, strategy and roadmap. The ideal candidate has strong analytical skills and experience working with cross-functional teams.',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    description: 'We are looking for a DevOps Engineer to help us build and maintain our infrastructure. You will be responsible for CI/CD pipelines, cloud infrastructure, and monitoring systems. Experience with AWS, Docker, and Kubernetes is preferred.',
  },
  {
    id: '6',
    title: 'QA Engineer',
    description: 'We are seeking a QA Engineer to ensure the quality of our software products. You will design and execute test plans, identify bugs, and work closely with developers to resolve issues. Experience with automated testing frameworks is a plus.',
  },
];

export function PredefinedJobDescriptionModal({
  open,
  onOpenChange,
  onSelect,
}: PredefinedJobDescriptionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredDescriptions = jobDescriptions.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    const selected = jobDescriptions.find((job) => job.id === selectedId);
    if (selected) {
      onSelect(selected.description);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-[#DEE4EB]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[20px] font-semibold text-[#353B41]">
              Select predefined job description
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-[#8593A3]" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A8B5C2]" />
            <Input
              placeholder="Search job titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-[#DEE4EB] text-[16px] placeholder:text-[#A8B5C2]"
            />
          </div>

          {/* Job descriptions list */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredDescriptions.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedId(job.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedId === job.id
                    ? 'border-[#642DFC] bg-[#F8F5FF]'
                    : 'border-[#DEE4EB] hover:border-[#A8B5C2]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedId === job.id
                        ? 'border-[#642DFC]'
                        : 'border-[#DEE4EB]'
                    }`}
                  >
                    {selectedId === job.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#642DFC]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#353B41] mb-2">
                      {job.title}
                    </h3>
                    <p className="text-[14px] text-[#6A7682] leading-[20px] line-clamp-3">
                      {job.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
            onClick={handleSelect}
            disabled={!selectedId}
            className="bg-[#642DFC] hover:bg-[#5020d9] text-white font-semibold text-[12px] tracking-[0.75px] disabled:opacity-50"
          >
            Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
