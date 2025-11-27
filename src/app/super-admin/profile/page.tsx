'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload, Save } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload or change your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="text-lg font-semibold">PA</AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <Input defaultValue="Peter" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <Input defaultValue="Anderson" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <Input defaultValue="peter@rapid.one" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input defaultValue="+91 98765 43210" className="mt-1" />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your password and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" placeholder="Enter current password" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" placeholder="Enter new password" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <Input type="password" placeholder="Confirm new password" className="mt-1" />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Control how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium text-sm">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive email updates</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium text-sm">System Alerts</p>
              <p className="text-xs text-muted-foreground">Notifications for critical events</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium text-sm">Payroll Updates</p>
              <p className="text-xs text-muted-foreground">Updates about payroll processing</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your account login history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Login from Chrome on macOS</p>
                <p className="text-xs text-muted-foreground">192.168.1.100 • Today at 9:30 AM</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Login from Chrome on macOS</p>
                <p className="text-xs text-muted-foreground">192.168.1.100 • Yesterday at 10:15 AM</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Login from Chrome on macOS</p>
                <p className="text-xs text-muted-foreground">192.168.1.100 • 2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
