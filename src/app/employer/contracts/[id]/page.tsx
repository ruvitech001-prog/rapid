'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  Mail,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock contract data - in real app this would come from API
const getContractData = (id: string) => {
  // Mock data based on ID
  const contracts: Record<string, { name: string; role: string; salary: string; startDate: string }> = {
    '222': { name: 'Prithviraj Singh Shekhawat', role: 'UI/UX Designer', salary: 'INR 10,00,000', startDate: '28/Jan/2023' },
    '223': { name: 'Vidushi Maheshwari', role: 'UI/UX Designer', salary: 'INR 10,00,000', startDate: '28/Jan/2023' },
    '224': { name: 'Rakesh Gaur', role: 'UI/UX Designer', salary: 'INR 10,00,000', startDate: '28/Jan/2023' },
    '225': { name: 'Diviksha Soni', role: 'UI/UX Designer', salary: 'INR 10,00,000', startDate: '28/Jan/2023' },
    '226': { name: 'Sudhanshu Sawnani', role: 'Accountant', salary: 'INR 8,00,000', startDate: '28/Jan/2023' },
    '227': { name: 'Smita Agarwal', role: 'Developer', salary: 'INR 12,00,000', startDate: '28/Jan/2023' },
    '228': { name: 'Khushi Mathur', role: 'Developer', salary: 'INR 12,00,000', startDate: '28/Jan/2023' },
    '234': { name: 'Prithviraj Singh Shekhawat', role: 'Software Engineer', salary: 'INR 15,00,000', startDate: '28/Jan/2023' },
    '235': { name: 'Vidushi Maheshwari', role: 'Product Manager', salary: 'INR 18,00,000', startDate: '28/Jan/2023' },
    '237': { name: 'Rakesh Gaur', role: 'Backend Developer', salary: 'INR 14,00,000', startDate: '28/Jan/2023' },
    '238': { name: 'Khushi Mathur', role: 'Frontend Developer', salary: 'INR 12,00,000', startDate: '28/Jan/2023' },
    '239': { name: 'Sudhanshu Sawnani', role: 'DevOps Engineer', salary: 'INR 16,00,000', startDate: '28/Jan/2023' },
    '240': { name: 'Smita Agarwal', role: 'QA Engineer', salary: 'INR 10,00,000', startDate: '28/Jan/2023' },
  };

  return contracts[id] || { name: 'Unknown', role: 'Unknown', salary: 'INR 10,00,000', startDate: '28/Jan/2023' };
};

export default function ContractDetailPage() {
  const params = useParams();
  const contractId = params.id as string;
  const contractData = getContractData(contractId);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="min-h-screen">
      {/* Top Header with Back, Title, and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <Link href="/employer/contracts">
            <Button
              variant="ghost"
              className="text-[#586AF5] hover:bg-[#586AF5]/10 font-semibold text-[18px] tracking-[0.75px] px-6 py-4 h-auto gap-2"
            >
              <ArrowLeft className="h-6 w-6" />
              Back
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Create Request Button */}
          <Button
            variant="outline"
            className="border-[#586AF5] text-[#586AF5] hover:bg-[#586AF5]/10 font-semibold text-[12px] tracking-[0.75px] px-4 py-3 h-auto"
          >
            + Create request
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>

          {/* Notification Bell */}
          <Button
            variant="outline"
            size="icon"
            className="border-[#EFF2F5] h-10 w-10"
          >
            <Bell className="h-5 w-5 text-[#8593A3]" />
          </Button>
        </div>
      </div>

      {/* Contract Title and Download */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-semibold text-[#353B41]">
          Contract of {contractData.name}
        </h1>

        <Button
          variant="outline"
          className="border-[#586AF5] text-[#586AF5] hover:bg-[#586AF5]/10 font-semibold text-[12px] tracking-[0.75px] px-4 py-3 h-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Contract Document Preview */}
      <div className="flex justify-center mb-8">
        <div className="bg-white border border-[#DEE4EB] rounded-2xl w-[801px] min-h-[1133px] relative overflow-hidden shadow-sm">
          {/* Decorative Purple Shape - Top Right */}
          <div className="absolute top-0 right-0 w-[342px] h-[280px] overflow-hidden">
            <div className="absolute -top-20 -right-20">
              <div className="w-[340px] h-[315px] bg-[#642DFC] rounded-[30px] transform rotate-[308deg]" />
            </div>
            <div className="absolute -top-40 right-20">
              <div className="w-[237px] h-[288px] bg-[#EFF2F5] rounded-[22px] transform rotate-[308deg]" />
            </div>
          </div>

          {/* Logo */}
          <div className="pt-6 pl-8">
            <h2 className="text-[32px] font-bold text-[#642DFC]">rapid</h2>
          </div>

          {/* Contract Content */}
          <div className="px-16 pt-12">
            {/* Title */}
            <h3 className="text-[16px] font-semibold text-[#353B41] text-center mb-8">
              PROFESSIONAL SERVICE AGREEMENT
            </h3>

            {/* Contract Body */}
            <div className="text-[12px] leading-[16px] text-[#353B41] space-y-4 tracking-[0.25px]">
              <p>
                I am pleased to offer you the position of {contractData.role} at Amnic.in, earning {contractData.salary} per year, with a target start date of {contractData.startDate}. This contract is indefinite.
              </p>

              <p>
                If there is anything you are unclear about, disagree with or wish to discuss about the agreement or about the position, please resubmit your request through{' '}
                <span className="text-[#586AF5]">this web form</span>
              </p>

              <p>
                You can discuss this offer and seek advice on the agreement with your family, a union, a lawyer, or someone else you trust.
              </p>

              <p>
                We are looking forward to working with you.
              </p>
            </div>

            {/* Second Paragraph Section */}
            <div className="text-[12px] leading-[16px] text-[#353B41] space-y-4 tracking-[0.25px] mt-8">
              <p>
                I am pleased to offer you the position of {contractData.role} at Amnic.in, earning {contractData.salary} per year, with a target start date of {contractData.startDate}. This contract is indefinite.
              </p>

              <p>
                If there is anything you are unclear about, disagree with or wish to discuss about the agreement or about the position, please resubmit your request through{' '}
                <span className="text-[#586AF5]">this web form</span>
              </p>

              <p>
                You can discuss this offer and seek advice on the agreement with your family, a union, a lawyer, or someone else you trust.
              </p>

              <p>
                We are looking forward to working with you.
              </p>
            </div>

            {/* Signature */}
            <div className="text-[12px] leading-[16px] text-[#353B41] tracking-[0.25px] mt-8">
              <p>Yours sincerely,</p>
              <p>Akash Nagraj</p>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0">
            {/* Divider Line */}
            <div className="mx-16 h-px bg-[#EFF2F5]" />

            {/* Contact Info */}
            <div className="flex justify-between px-16 py-8">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#A281FD]" />
                <span className="text-[13px] text-[#8593A3] tracking-[0.34px]">contactus@rapid.one</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-[#A281FD] flex-shrink-0" />
                <span className="text-[13px] text-[#8593A3] tracking-[0.34px] max-w-[300px]">
                  105-UDB Landmark, Tonk road, Gopalpura, Jaipur -302022, Rajasthan, INDIA
                </span>
              </div>
            </div>

            {/* Gray Bottom Bar */}
            <div className="h-[27px] bg-[#EFF2F5]" />
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="p-1 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5 text-[#8593A3]" />
        </button>

        <div className="flex items-center gap-5">
          {[1, 2, 3].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-5 h-5 flex items-center justify-center text-[12px] font-medium uppercase tracking-[1.5px] ${
                currentPage === page
                  ? 'bg-[#642DFC] text-white rounded-full'
                  : 'text-[#8593A3]'
              }`}
            >
              {page}
            </button>
          ))}

          <span className="text-[12px] font-medium text-[#8593A3] tracking-[1.5px]">...</span>

          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`text-[12px] font-medium uppercase tracking-[1.5px] ${
              currentPage === totalPages
                ? 'w-5 h-5 bg-[#642DFC] text-white rounded-full flex items-center justify-center'
                : 'text-[#8593A3]'
            }`}
          >
            {totalPages}
          </button>
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="p-1 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5 text-[#8593A3]" />
        </button>
      </div>
    </div>
  );
}
