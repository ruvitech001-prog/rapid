'use client';

import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'leave',
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement request creation via API
    router.push('/employer/requests');
  };

  const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";
  const selectClass = "w-full h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/employer/requests">
          <Button variant="outline" size="icon" className="border-[#DEE4EB] hover:bg-[#F4F7FA]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Request</h1>
          <p className="text-[#8593A3] mt-1">Submit a new request to your team</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Request Type */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">REQUEST TYPE *</Label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="leave">Leave Request</option>
                <option value="equipment">Equipment Request</option>
                <option value="access">Access Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TITLE *</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter request title"
                required
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DESCRIPTION *</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about your request"
                rows={4}
                required
                className="w-full px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900">Assignment & Priority</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Assignee */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ASSIGN TO *</Label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                required
                className={selectClass}
              >
                <option value="">Select a person</option>
                <option value="manager">Your Manager</option>
                <option value="hr">HR Team</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Priority & Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PRIORITY *</Label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DUE DATE</Label>
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]"
          >
            Cancel
          </Button>
          <Button type="submit" className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
            <Send className="h-4 w-4" />
            Create Request
          </Button>
        </div>
      </form>
    </div>
  );
}
