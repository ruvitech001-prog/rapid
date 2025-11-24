'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Building2,
  Clock,
  PieChart,
  Coffee,
  Mail,
  Folder,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface NavSection {
  title?: string
  items: NavItem[]
}

interface SidebarProps {
  role: 'employer' | 'employee' | 'contractor'
  userEmail?: string
  userName?: string
  userInitials?: string
}

const EMPLOYER_SECTIONS: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/employer/dashboard', icon: <Home className="h-4 w-4" /> },
    ],
  },
  {
    title: 'TEAM',
    items: [
      { label: 'Employees', href: '/employer/employees', icon: <Building2 className="h-4 w-4" /> },
      { label: 'Contractors', href: '/employer/contractors', icon: <Users className="h-4 w-4" /> },
      { label: 'Contracts', href: '/employer/contracts', icon: <FileText className="h-4 w-4" /> },
      { label: 'Timesheet', href: '/employer/timesheet', icon: <Clock className="h-4 w-4" /> },
      { label: 'Reports', href: '/employer/reports', icon: <PieChart className="h-4 w-4" /> },
      { label: 'Perks & Benefits', href: '/employer/perks', icon: <Coffee className="h-4 w-4" /> },
      { label: 'Requests', href: '/employer/requests', icon: <Mail className="h-4 w-4" /> },
      { label: 'Leaves', href: '/employer/leave/requests', icon: <Calendar className="h-4 w-4" /> },
    ],
  },
  {
    title: 'COMPANY',
    items: [
      { label: 'Invoices', href: '/employer/invoices', icon: <DollarSign className="h-4 w-4" /> },
      { label: 'Documents', href: '/employer/documents', icon: <Folder className="h-4 w-4" /> },
      { label: 'Settings', href: '/employer/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]

const EMPLOYEE_SECTIONS: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/employee/dashboard', icon: <Home className="h-4 w-4" /> },
    ],
  },
  {
    title: 'WORK',
    items: [
      { label: 'Attendance', href: '/employee/attendance/clockin', icon: <Calendar className="h-4 w-4" /> },
      { label: 'Leave', href: '/employee/leave/apply', icon: <Calendar className="h-4 w-4" /> },
      { label: 'Expenses', href: '/employee/expenses/submit', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    title: 'PAYROLL',
    items: [
      { label: 'Payslips', href: '/employee/payslips', icon: <DollarSign className="h-4 w-4" /> },
      { label: 'Tax Documents', href: '/employee/tax/declaration', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { label: 'Profile', href: '/employee/profile', icon: <Users className="h-4 w-4" /> },
      { label: 'Documents', href: '/employee/documents/library', icon: <FileText className="h-4 w-4" /> },
      { label: 'Notifications', href: '/employee/notifications', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    items: [
      { label: 'Help & Support', href: '/help', icon: <HelpCircle className="h-4 w-4" /> },
    ],
  },
]

const CONTRACTOR_SECTIONS: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/contractor/dashboard', icon: <Home className="h-4 w-4" /> },
    ],
  },
  {
    title: 'WORK',
    items: [
      { label: 'Timesheets', href: '/contractor/timesheets/submit', icon: <Calendar className="h-4 w-4" /> },
      { label: 'Invoices', href: '/contractor/invoices', icon: <DollarSign className="h-4 w-4" /> },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { label: 'Profile', href: '/contractor/profile', icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    items: [
      { label: 'Help & Support', href: '/help', icon: <HelpCircle className="h-4 w-4" /> },
    ],
  },
]

export function Sidebar({
  role = 'employer',
  userEmail = 'user@example.com',
  userName = 'User Name',
  userInitials = 'UN',
}: SidebarProps) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()

  const sections =
    role === 'employer'
      ? EMPLOYER_SECTIONS
      : role === 'employee'
        ? EMPLOYEE_SECTIONS
        : CONTRACTOR_SECTIONS

  const isActive = (href: string) => {
    if (pathname === href) return true
    // Check if pathname starts with the href and next character is / or end
    return pathname.startsWith(href + '/') || pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 h-screen w-64 border-r border-border bg-slate-50 transition-all duration-300 md:relative md:z-10 flex flex-col',
          !open && '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="border-b border-border p-6 space-y-4">
          <h1 className="text-2xl font-bold text-primary">rapid</h1>
          {role === 'employer' && (
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">☀️</span>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">India</p>
                  <p className="text-xs font-medium">09:30 IST</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors outline-none focus:outline-none focus:ring-0',
                        active
                          ? 'bg-primary-hover text-primary '
                          : 'text-muted-foreground hover:text-foreground hover:no-underline'
                      )}
                    >
                      <span className={active ? 'text-primary' : 'text-muted-foreground'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-border p-4 space-y-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 rounded-md p-2 hover:bg-white transition-colors text-left">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href={`/${role}/profile`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${role}/settings`}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/api/auth/logout" className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
            <a href="/api/auth/logout" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </a>
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
