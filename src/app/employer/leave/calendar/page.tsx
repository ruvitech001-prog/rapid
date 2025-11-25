'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LeaveEvent {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending';
}

export default function LeaveCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const [leaveEvents] = useState<LeaveEvent[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      leaveType: 'Casual Leave',
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      status: 'approved',
    },
    {
      id: '2',
      employeeName: 'Sarah Smith',
      leaveType: 'Sick Leave',
      startDate: '2024-03-10',
      endDate: '2024-03-11',
      status: 'approved',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      leaveType: 'Earned Leave',
      startDate: '2024-03-20',
      endDate: '2024-03-22',
      status: 'pending',
    },
  ]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isDateInRange = (date: Date, startDate: string, endDate: string) => {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return checkDate >= start && checkDate <= end;
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return leaveEvents.filter(event =>
      isDateInRange(date, event.startDate, event.endDate)
    );
  };

  const approvedCount = leaveEvents.filter(e => e.status === 'approved').length;
  const pendingCount = leaveEvents.filter(e => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Leave Calendar</h1>
          <p className="text-[#8593A3] mt-1">View team availability and leave schedules</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
            className={view === 'month' ? 'bg-[#642DFC] hover:bg-[#5020d9]' : 'border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]'}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
            className={view === 'week' ? 'bg-[#642DFC] hover:bg-[#5020d9]' : 'border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]'}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL LEAVES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{leaveEvents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">APPROVED</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{approvedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">PENDING</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Controls */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="w-10 h-10 rounded-lg bg-[#F4F7FA] hover:bg-[#DEE4EB] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#8593A3]" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-lg bg-[#F4F7FA] hover:bg-[#DEE4EB] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#8593A3]" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardContent className="p-0">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-[#F4F7FA] border-b border-[#DEE4EB]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="px-4 py-3 text-center">
                <span className="text-[11px] font-semibold text-[#8593A3] tracking-wider">{day.toUpperCase()}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-32 p-2 bg-[#F4F7FA]/30 border-b border-r border-[#DEE4EB]"></div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const events = getEventsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`min-h-32 p-2 border-b border-r border-[#DEE4EB] ${
                    isToday ? 'ring-2 ring-inset ring-[#586AF5]' : ''
                  }`}
                >
                  <div className={`text-sm font-semibold mb-2 ${
                    isToday ? 'text-[#586AF5]' : 'text-gray-700'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1.5 rounded-lg truncate ${
                          event.status === 'approved'
                            ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]'
                            : 'bg-[#CC7A00]/10 text-[#CC7A00]'
                        }`}
                        title={`${event.employeeName} - ${event.leaveType}`}
                      >
                        {event.employeeName}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-[#8593A3] pl-1">
                        +{events.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 rounded"></div>
              <span className="text-sm text-gray-700">Approved Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#CC7A00]/10 border border-[#CC7A00]/30 rounded"></div>
              <span className="text-sm text-gray-700">Pending Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#586AF5] rounded"></div>
              <span className="text-sm text-gray-700">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Leaves */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">Upcoming Leaves</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaveEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">{event.employeeName}</p>
                <p className="text-xs text-[#8593A3]">{event.leaveType}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">
                  {new Date(event.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} -{' '}
                  {new Date(event.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  event.status === 'approved' ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' : 'bg-[#CC7A00]/10 text-[#CC7A00]'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
