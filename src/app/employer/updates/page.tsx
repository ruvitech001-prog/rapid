'use client';

import { useState } from 'react';
import { Bell, Trash2, Clock, CheckCircle, DollarSign, Users, Calendar, Shield, AlertCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Update {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'payroll' | 'employee' | 'leave' | 'compliance' | 'system';
  read: boolean;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([
    {
      id: 1,
      title: 'Payroll Processing Complete',
      description: 'November payroll has been successfully processed and dispatched.',
      date: '2024-11-20',
      type: 'payroll',
      read: false,
    },
    {
      id: 2,
      title: 'New Employee Onboarded',
      description: 'Sarah Johnson has completed onboarding and is now active in the system.',
      date: '2024-11-18',
      type: 'employee',
      read: false,
    },
    {
      id: 3,
      title: 'Leave Approval Pending',
      description: '3 leave requests are awaiting your approval. Please review them.',
      date: '2024-11-15',
      type: 'leave',
      read: true,
    },
    {
      id: 4,
      title: 'System Maintenance Scheduled',
      description: 'System will be under maintenance on Nov 25 from 2-4 PM IST.',
      date: '2024-11-10',
      type: 'system',
      read: true,
    },
    {
      id: 5,
      title: 'Compliance Report Due',
      description: 'Monthly EPF compliance report is due on Nov 30. Please ensure all data is updated.',
      date: '2024-11-05',
      type: 'compliance',
      read: true,
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payroll':
        return DollarSign;
      case 'employee':
        return Users;
      case 'leave':
        return Calendar;
      case 'compliance':
        return Shield;
      case 'system':
        return Settings;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payroll':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      case 'employee':
        return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
      case 'leave':
        return { bg: 'bg-[#CC7A00]/10', text: 'text-[#CC7A00]' };
      case 'compliance':
        return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' };
      case 'system':
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
      default:
        return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
    }
  };

  const markAsRead = (id: number) => {
    setUpdates(updates.map(u => u.id === id ? { ...u, read: true } : u));
  };

  const deleteUpdate = (id: number) => {
    setUpdates(updates.filter(u => u.id !== id));
  };

  const unreadCount = updates.filter(u => !u.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Updates & Notifications</h1>
          <p className="text-[#8593A3] mt-1">Stay informed with the latest updates</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="gap-2 border-[#DEE4EB] text-gray-700 hover:bg-[#F4F7FA]">
            <CheckCircle className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL UPDATES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{updates.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Bell className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">UNREAD</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">READ</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{updates.length - unreadCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {updates.map((update) => {
          const Icon = getTypeIcon(update.type);
          const colors = getTypeColor(update.type);
          return (
            <Card
              key={update.id}
              className={`rounded-2xl border shadow-none transition-all ${
                update.read
                  ? 'border-[#DEE4EB] bg-white'
                  : 'border-[#586AF5] bg-[#EBF5FF]'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{update.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors.bg} ${colors.text}`}>
                        {update.type}
                      </span>
                      {!update.read && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#586AF5] text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#8593A3] mb-3">{update.description}</p>
                    <div className="flex items-center gap-2 text-sm text-[#8593A3]">
                      <Clock className="h-4 w-4" />
                      {new Date(update.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!update.read && (
                      <button
                        onClick={() => markAsRead(update.id)}
                        className="p-2 hover:bg-[#2DD4BF]/10 rounded-lg transition-colors text-[#2DD4BF]"
                        title="Mark as read"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteUpdate(update.id)}
                      className="p-2 hover:bg-[#FF7373]/10 rounded-lg transition-colors text-[#FF7373]"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {updates.length === 0 && (
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F4F7FA] flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-[#8593A3]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Updates</h3>
            <p className="text-[#8593A3]">You're all caught up! No new notifications.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
