'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Calendar, CalendarDays, Gift, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { colors } from '@/lib/design-tokens';

interface Holiday {
  id: number;
  name: string;
  date: string;
  type: 'National' | 'Optional' | 'Company';
  optional: boolean;
}

export default function HolidaysPage() {
  const [holidays] = useState<Holiday[]>([
    { id: 1, name: 'New Year Day', date: '2025-01-01', type: 'National', optional: false },
    { id: 2, name: 'Republic Day', date: '2025-01-26', type: 'National', optional: false },
    { id: 3, name: 'Holi', date: '2025-03-14', type: 'National', optional: false },
    { id: 4, name: 'Good Friday', date: '2025-04-18', type: 'National', optional: false },
    { id: 5, name: 'Independence Day', date: '2025-08-15', type: 'National', optional: false },
    { id: 6, name: 'Diwali', date: '2025-10-20', type: 'National', optional: false },
    { id: 7, name: 'Christmas', date: '2025-12-25', type: 'National', optional: false },
    { id: 8, name: 'Company Founding Day', date: '2025-06-10', type: 'Company', optional: false },
    { id: 9, name: 'Eid ul-Fitr', date: '2025-03-30', type: 'Optional', optional: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'National':
        return { bg: `${colors.error600}10`, text: colors.error600 };
      case 'Optional':
        return { bg: `${colors.warning600}10`, text: colors.warning600 };
      case 'Company':
        return { bg: `${colors.iconBlue}10`, text: colors.iconBlue };
      default:
        return { bg: `${colors.neutral500}10`, text: colors.neutral500 };
    }
  };

  const nationalHolidays = holidays.filter(h => h.type === 'National');
  const optionalHolidays = holidays.filter(h => h.type === 'Optional');
  const companyHolidays = holidays.filter(h => h.type === 'Company');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holidays</h1>
          <p className="mt-1" style={{ color: colors.neutral500 }}>Manage company holidays and important dates</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-10 px-4 rounded-lg border bg-white text-sm focus:outline-none"
            style={{ borderColor: colors.border }}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <Button onClick={() => setShowModal(true)} className="gap-2" style={{ backgroundColor: colors.primary500 }}>
            <Plus className="h-4 w-4" />
            Add Holiday
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border shadow-none" style={{ borderColor: colors.border, backgroundColor: colors.secondaryBlue50 }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>TOTAL HOLIDAYS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{holidays.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Calendar className="h-6 w-6" style={{ color: colors.iconBlue }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-none bg-white" style={{ borderColor: colors.border }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>NATIONAL HOLIDAYS</p>
                <p className="text-3xl font-bold mt-2" style={{ color: colors.error600 }}>{nationalHolidays.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.error600}10` }}>
                <CalendarDays className="h-6 w-6" style={{ color: colors.error600 }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-none bg-white" style={{ borderColor: colors.border }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>OPTIONAL HOLIDAYS</p>
                <p className="text-3xl font-bold mt-2" style={{ color: colors.warning600 }}>{optionalHolidays.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.warning600}10` }}>
                <Gift className="h-6 w-6" style={{ color: colors.warning600 }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-none bg-white" style={{ borderColor: colors.border }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>COMPANY HOLIDAYS</p>
                <p className="text-3xl font-bold mt-2" style={{ color: colors.iconBlue }}>{companyHolidays.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.iconBlue}10` }}>
                <Calendar className="h-6 w-6" style={{ color: colors.iconBlue }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holidays Table */}
      <Card className="rounded-2xl border shadow-none overflow-hidden" style={{ borderColor: colors.border }}>
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">Holiday Calendar - {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: colors.neutral50 }}>
                <tr style={{ borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>HOLIDAY NAME</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>DAY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>TYPE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>STATUS</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: colors.border }} className="divide-y">
                {holidays.map((holiday) => {
                  const typeColors = getTypeColor(holiday.type);
                  const date = new Date(holiday.date);
                  const isPast = date < new Date();
                  return (
                    <tr key={holiday.id} className="hover:opacity-90 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: typeColors.bg }}>
                            <Calendar className="h-5 w-5" style={{ color: typeColors.text }} />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{holiday.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.neutral500 }}>
                        {date.toLocaleDateString('en-IN', { weekday: 'long' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: typeColors.bg, color: typeColors.text }}>
                          {holiday.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: isPast ? `${colors.neutral500}10` : `${colors.success600}10`,
                            color: isPast ? colors.neutral500 : colors.success600
                          }}
                        >
                          {isPast ? 'Completed' : 'Upcoming'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg transition-colors" style={{ color: colors.iconBlue }}>
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-lg transition-colors" style={{ color: colors.error600 }}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Holiday Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md rounded-2xl border shadow-xl" style={{ borderColor: colors.border }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900">Add New Holiday</CardTitle>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg" style={{ backgroundColor: colors.neutral50 }}>
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>HOLIDAY NAME *</Label>
                <Input
                  type="text"
                  placeholder="Enter holiday name"
                  className="h-10 px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>DATE *</Label>
                <Input
                  type="date"
                  className="h-10 px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.border }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-wider" style={{ color: colors.neutral500 }}>TYPE *</Label>
                <select className="w-full h-10 px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none" style={{ borderColor: colors.border }}>
                  <option value="National">National Holiday</option>
                  <option value="Optional">Optional Holiday</option>
                  <option value="Company">Company Holiday</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)} className="border text-gray-700" style={{ borderColor: colors.border }}>
                  Cancel
                </Button>
                <Button style={{ backgroundColor: colors.primary500 }}>
                  Add Holiday
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
