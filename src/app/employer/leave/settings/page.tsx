'use client';

import { useState } from 'react';

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Policy Settings</h1>
            <p className="text-gray-600 mt-2">Configure leave policies for your organization</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Policy
          </button>
        </div>

        {/* Edit/Add Form */}
        {(editingPolicy || isAddingNew) && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isAddingNew ? 'Add New Policy' : 'Edit Policy'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Days *
                </label>
                <input
                  type="number"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.carryForward}
                  onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Allow Carry Forward
                </label>
              </div>
              {formData.carryForward && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Carry Forward Days
                  </label>
                  <input
                    type="number"
                    value={formData.maxCarryForward}
                    onChange={(e) => setFormData({ ...formData, maxCarryForward: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Policy
              </button>
            </div>
          </div>
        )}

        {/* Policies List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carry Forward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Carry Forward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{policy.days} days</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      policy.carryForward ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                    <div className="text-sm text-gray-900">{policy.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(policy.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Settings */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Weekend Policy</p>
                <p className="text-sm text-gray-500">Configure which days are considered weekends</p>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Saturday & Sunday</option>
                <option>Sunday Only</option>
                <option>Custom</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Leave Approval</p>
                <p className="text-sm text-gray-500">Require manager approval for leave requests</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Negative Balance</p>
                <p className="text-sm text-gray-500">Allow employees to take leave with negative balance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
