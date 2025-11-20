'use client'

import { Bell } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface HeaderProps {
  title?: string
  showNotifications?: boolean
  notificationCount?: number
}

export function Header({
  title,
  showNotifications = true,
  notificationCount = 0,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background h-16 flex items-center px-6">
      {/* Left Side - Title */}
      {title && <h1 className="text-sm font-semibold text-muted-foreground">{title}</h1>}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side - Notifications */}
      {showNotifications && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-white rounded-full text-xs font-bold flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="px-4 py-3 border-b border-border">
              <p className="font-medium text-sm">Notifications</p>
            </div>
            {notificationCount === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              <>
                <DropdownMenuItem disabled className="text-xs py-2">
                  You have {notificationCount} new notification{notificationCount > 1 ? 's' : ''}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs py-2">
                  View all
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
