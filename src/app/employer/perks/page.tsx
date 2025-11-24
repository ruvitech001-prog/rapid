'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function PerksPage() {
  const [perks] = useState([
    { id: 1, name: 'Health Insurance', description: 'Comprehensive health coverage for employees and families', active: true },
    { id: 2, name: 'Flexible Working Hours', description: 'Work from home and flexible scheduling options', active: true },
    { id: 3, name: 'Annual Bonus', description: 'Performance-based annual bonus', active: true },
    { id: 4, name: 'Paid Time Off', description: '20 days paid leave per year', active: true },
    { id: 5, name: 'Professional Development', description: 'Training and certification support', active: true },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Perks & Benefits</h1>
          <p className="text-slate-600 mt-1">Manage employee benefits and perks</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={20} />
          Add Perk
        </button>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {perks.map((perk) => (
          <div key={perk.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{perk.name}</h3>
                <p className="text-sm text-slate-600 mt-2">{perk.description}</p>
              </div>
              {perk.active && (
                <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium ml-2">
                  Active
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 text-slate-700 rounded transition-colors hover:bg-slate-50 font-medium">
                <Edit2 size={16} />
                Edit
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded transition-colors hover:bg-red-50 font-medium">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
