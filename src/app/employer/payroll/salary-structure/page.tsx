'use client';

import { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SalaryComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  calculationType: 'fixed' | 'percentage';
  value: number;
  taxable: boolean;
  mandatory: boolean;
}

export default function SalaryStructurePage() {
  const [components, setComponents] = useState<SalaryComponent[]>([
    {
      id: '1',
      name: 'Basic Salary',
      type: 'earning',
      calculationType: 'percentage',
      value: 40,
      taxable: true,
      mandatory: true,
    },
    {
      id: '2',
      name: 'House Rent Allowance',
      type: 'earning',
      calculationType: 'percentage',
      value: 30,
      taxable: true,
      mandatory: false,
    },
    {
      id: '3',
      name: 'Special Allowance',
      type: 'earning',
      calculationType: 'percentage',
      value: 30,
      taxable: true,
      mandatory: false,
    },
    {
      id: '4',
      name: 'EPF (Employee)',
      type: 'deduction',
      calculationType: 'percentage',
      value: 12,
      taxable: false,
      mandatory: true,
    },
    {
      id: '5',
      name: 'Professional Tax',
      type: 'deduction',
      calculationType: 'fixed',
      value: 200,
      taxable: false,
      mandatory: true,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingComponent, setEditingComponent] = useState<SalaryComponent | null>(null);

  const [formData, setFormData] = useState<SalaryComponent>({
    id: '',
    name: '',
    type: 'earning',
    calculationType: 'fixed',
    value: 0,
    taxable: false,
    mandatory: false,
  });

  const handleAddNew = () => {
    setFormData({
      id: '',
      name: '',
      type: 'earning',
      calculationType: 'fixed',
      value: 0,
      taxable: false,
      mandatory: false,
    });
    setIsAdding(true);
    setEditingComponent(null);
  };

  const handleEdit = (component: SalaryComponent) => {
    setFormData(component);
    setEditingComponent(component);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (isAdding) {
      setComponents([...components, { ...formData, id: Date.now().toString() }]);
    } else if (editingComponent) {
      setComponents(components.map(c => c.id === editingComponent.id ? formData : c));
    }
    setIsAdding(false);
    setEditingComponent(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingComponent(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      setComponents(components.filter(c => c.id !== id));
    }
  };

  const earningComponents = components.filter(c => c.type === 'earning');
  const deductionComponents = components.filter(c => c.type === 'deduction');

  const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";
  const selectClass = "w-full h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Structure Configuration</h1>
          <p className="text-[#8593A3] mt-1">Define salary components and calculation rules</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]"
        >
          <Plus className="h-4 w-4" />
          Add Component
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL COMPONENTS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{components.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">EARNINGS</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{earningComponents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DEDUCTIONS</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{deductionComponents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form Modal */}
      {(isAdding || editingComponent) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isAdding ? 'Add New Component' : 'Edit Component'}
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
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">COMPONENT NAME *</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TYPE *</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'earning' | 'deduction' })}
                    className={selectClass}
                  >
                    <option value="earning">Earning</option>
                    <option value="deduction">Deduction</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CALCULATION TYPE *</Label>
                  <select
                    value={formData.calculationType}
                    onChange={(e) => setFormData({ ...formData, calculationType: e.target.value as 'fixed' | 'percentage' })}
                    className={selectClass}
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage of CTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">VALUE *</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                      className={inputClass}
                    />
                    <span className="absolute right-3 top-2.5 text-[#8593A3]">
                      {formData.calculationType === 'percentage' ? '%' : '₹'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.taxable}
                    onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
                    className="h-4 w-4 text-[#586AF5] focus:ring-[#586AF5] border-[#DEE4EB] rounded"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    Taxable Component
                  </label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.mandatory}
                    onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                    className="h-4 w-4 text-[#586AF5] focus:ring-[#586AF5] border-[#DEE4EB] rounded"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    Mandatory Component
                  </label>
                </div>
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
                  Save Component
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earnings */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="bg-[#2DD4BF]/10 border-b border-[#DEE4EB]">
          <CardTitle className="text-[#2DD4BF] flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-b border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">COMPONENT NAME</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CALCULATION TYPE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">VALUE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TAXABLE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">MANDATORY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {earningComponents.map((component) => (
                  <tr key={component.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{component.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{component.calculationType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {component.calculationType === 'percentage' ? `${component.value}%` : `₹${component.value}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        component.taxable ? 'bg-[#CC7A00]/10 text-[#CC7A00]' : 'bg-[#F4F7FA] text-[#8593A3]'
                      }`}>
                        {component.taxable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        component.mandatory ? 'bg-[#586AF5]/10 text-[#586AF5]' : 'bg-[#F4F7FA] text-[#8593A3]'
                      }`}>
                        {component.mandatory ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(component)}
                          className="text-[#586AF5] hover:underline font-medium"
                        >
                          Edit
                        </button>
                        {!component.mandatory && (
                          <button
                            onClick={() => handleDelete(component.id)}
                            className="text-[#FF7373] hover:underline font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Deductions */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="bg-[#FF7373]/10 border-b border-[#DEE4EB]">
          <CardTitle className="text-[#FF7373] flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Deductions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-b border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">COMPONENT NAME</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CALCULATION TYPE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">VALUE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TAXABLE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">MANDATORY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {deductionComponents.map((component) => (
                  <tr key={component.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{component.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{component.calculationType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {component.calculationType === 'percentage' ? `${component.value}%` : `₹${component.value}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        component.taxable ? 'bg-[#CC7A00]/10 text-[#CC7A00]' : 'bg-[#F4F7FA] text-[#8593A3]'
                      }`}>
                        {component.taxable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        component.mandatory ? 'bg-[#586AF5]/10 text-[#586AF5]' : 'bg-[#F4F7FA] text-[#8593A3]'
                      }`}>
                        {component.mandatory ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(component)}
                          className="text-[#586AF5] hover:underline font-medium"
                        >
                          Edit
                        </button>
                        {!component.mandatory && (
                          <button
                            onClick={() => handleDelete(component.id)}
                            className="text-[#FF7373] hover:underline font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
