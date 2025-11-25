'use client';

import { useState } from 'react';
import { Plus, Settings, Calendar, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LeavePolicy {
  id: string;
  name: string;
  days: number;
  carryForward: boolean;
  maxCarryForward: number;
  description: string;
}

export default function LeaveSettingsPage() {
  const [policies, setPolicies] = useState<LeavePolicy[]>([
    {
      id: '1',
      name: 'Casual Leave',
      days: 12,
      carryForward: false,
      maxCarryForward: 0,
      description: 'Leave for personal matters',
    },
    {
      id: '2',
      name: 'Sick Leave',
      days: 10,
      carryForward: false,
      maxCarryForward: 0,
      description: 'Leave for medical reasons',
    },
    {
      id: '3',
      name: 'Earned Leave',
      days: 15,
      carryForward: true,
      maxCarryForward: 10,
      description: 'Annual earned leave',
    },
    {
      id: '4',
      name: 'Maternity Leave',
      days: 180,
      carryForward: false,
      maxCarryForward: 0,
      description: 'Maternity leave for female employees',
    },
    {
      id: '5',
      name: 'Paternity Leave',
      days: 15,
      carryForward: false,
      maxCarryForward: 0,
      description: 'Paternity leave for male employees',
    },
  ]);

  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<LeavePolicy>({
    id: '',
    name: '',
    days: 0,
    carryForward: false,
    maxCarryForward: 0,
    description: '',
  });

  const handleEdit = (policy: LeavePolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      name: '',
      days: 0,
      carryForward: false,
      maxCarryForward: 0,
      description: '',
    });
    setIsAddingNew(true);
    setEditingPolicy(null);
  };

  const handleSave = () => {
    if (isAddingNew) {
      setPolicies([...policies, { ...formData, id: Date.now().toString() }]);
    } else if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? formData : p));
    }
    setEditingPolicy(null);
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setEditingPolicy(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this leave policy?')) {
      setPolicies(policies.filter(p => p.id !== id));
    }
  };

  const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Policy Settings</h1>
          <p className="text-[#8593A3] mt-1">Configure leave policies for your organization</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]"
        >
          <Plus className="h-4 w-4" />
          Add New Policy
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL POLICIES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{policies.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Settings className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">WITH CARRY FORWARD</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{policies.filter(p => p.carryForward).length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL ANNUAL DAYS</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{policies.reduce((sum, p) => sum + p.days, 0)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit/Add Form Modal */}
      {(editingPolicy || isAddingNew) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isAddingNew ? 'Add New Policy' : 'Edit Policy'}
              </h2>
              <button
                onClick={handleCancel}
                className="w-8 h-8 rounded-lg bg-[#F4F7FA] hover:bg-[#DEE4EB] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8593A3]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">POLICY NAME *</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ANNUAL DAYS *</Label>
                  <Input
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DESCRIPTION</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.carryForward}
                    onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
                    className="h-4 w-4 text-[#586AF5] focus:ring-[#586AF5] border-[#DEE4EB] rounded"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    Allow Carry Forward
                  </label>
                </div>

                {formData.carryForward && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">MAX CARRY FORWARD DAYS</Label>
                    <Input
                      type="number"
                      value={formData.maxCarryForward}
                      onChange={(e) => setFormData({ ...formData, maxCarryForward: parseInt(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#642DFC] hover:bg-[#5020d9]"
                >
                  Save Policy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policies List */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Leave Policies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">POLICY NAME</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ANNUAL DAYS</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CARRY FORWARD</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">MAX CARRY FORWARD</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DESCRIPTION</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{policy.days} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        policy.carryForward ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' : 'bg-[#F4F7FA] text-[#8593A3]'
                      }`}>
                        {policy.carryForward ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {policy.carryForward ? `${policy.maxCarryForward} days` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#8593A3] max-w-xs truncate">{policy.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(policy)}
                          className="text-[#586AF5] hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(policy.id)}
                          className="text-[#FF7373] hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Weekend Policy</p>
              <p className="text-sm text-[#8593A3]">Configure which days are considered weekends</p>
            </div>
            <select className="h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20">
              <option>Saturday & Sunday</option>
              <option>Sunday Only</option>
              <option>Custom</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Leave Approval</p>
              <p className="text-sm text-[#8593A3]">Require manager approval for leave requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-[#DEE4EB] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#586AF5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#DEE4EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#586AF5]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Negative Balance</p>
              <p className="text-sm text-[#8593A3]">Allow employees to take leave with negative balance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-[#DEE4EB] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#586AF5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#DEE4EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#586AF5]"></div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
