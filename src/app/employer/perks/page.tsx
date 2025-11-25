'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Gift, Heart, Briefcase, GraduationCap, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Perk {
  id: number;
  name: string;
  description: string;
  category: 'Health' | 'Work-Life' | 'Financial' | 'Learning';
  active: boolean;
  enrolledCount: number;
}

export default function PerksPage() {
  const [perks] = useState<Perk[]>([
    { id: 1, name: 'Health Insurance', description: 'Comprehensive health coverage for employees and families', category: 'Health', active: true, enrolledCount: 145 },
    { id: 2, name: 'Flexible Working Hours', description: 'Work from home and flexible scheduling options', category: 'Work-Life', active: true, enrolledCount: 120 },
    { id: 3, name: 'Annual Bonus', description: 'Performance-based annual bonus up to 20% of CTC', category: 'Financial', active: true, enrolledCount: 150 },
    { id: 4, name: 'Paid Time Off', description: '20 days paid leave per year plus public holidays', category: 'Work-Life', active: true, enrolledCount: 150 },
    { id: 5, name: 'Professional Development', description: 'Training and certification support up to ₹50,000/year', category: 'Learning', active: true, enrolledCount: 85 },
    { id: 6, name: 'Gym Membership', description: 'Free gym membership at partner fitness centers', category: 'Health', active: true, enrolledCount: 78 },
  ]);

  const [showModal, setShowModal] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health':
        return Heart;
      case 'Work-Life':
        return Briefcase;
      case 'Financial':
        return Gift;
      case 'Learning':
        return GraduationCap;
      default:
        return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Health':
        return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' };
      case 'Work-Life':
        return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
      case 'Financial':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'Learning':
        return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      default:
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
    }
  };

  const healthPerks = perks.filter(p => p.category === 'Health').length;
  const financialPerks = perks.filter(p => p.category === 'Financial').length;
  const activePerks = perks.filter(p => p.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perks & Benefits</h1>
          <p className="text-[#8593A3] mt-1">Manage employee benefits and perks programs</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Plus className="h-4 w-4" />
          Add Perk
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL PERKS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{perks.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Gift className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIVE PERKS</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{activePerks}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">HEALTH BENEFITS</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{healthPerks}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">FINANCIAL BENEFITS</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{financialPerks}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Gift className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {perks.map((perk) => {
          const Icon = getCategoryIcon(perk.category);
          const colors = getCategoryColor(perk.category);
          return (
            <Card key={perk.id} className="rounded-2xl border border-[#DEE4EB] shadow-none hover:border-[#586AF5] transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{perk.name}</h3>
                      {perk.active && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#2DD4BF]/10 text-[#2DD4BF]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#8593A3] mb-3">{perk.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {perk.category}
                      </span>
                      <span className="text-sm text-[#8593A3]">{perk.enrolledCount} enrolled</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-[#DEE4EB]">
                  <Button variant="outline" className="flex-1 gap-2 border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2 border-[#FF7373]/20 text-[#FF7373] hover:bg-[#FF7373]/10">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Perk Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md rounded-2xl border border-[#DEE4EB] shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900">Add New Perk</CardTitle>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#F4F7FA] rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PERK NAME *</Label>
                <Input
                  type="text"
                  placeholder="Enter perk name"
                  className="h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DESCRIPTION *</Label>
                <textarea
                  placeholder="Enter perk description"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-[#8593A3] tracking-wider">CATEGORY *</Label>
                <select className="w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none">
                  <option value="Health">Health</option>
                  <option value="Work-Life">Work-Life Balance</option>
                  <option value="Financial">Financial</option>
                  <option value="Learning">Learning & Development</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)} className="border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]">
                  Cancel
                </Button>
                <Button className="bg-[#642DFC] hover:bg-[#5020d9]">
                  Add Perk
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
