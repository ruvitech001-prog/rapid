'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Shield, Users, Lock, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AccessControlPage() {
  const roles = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with cross-tenant visibility',
      permissions: 24,
      users: 3,
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Company-level admin with full access to company resources',
      permissions: 20,
      users: 18,
    },
    {
      id: 3,
      name: 'Manager',
      description: 'Can manage team members and view reports',
      permissions: 12,
      users: 45,
    },
    {
      id: 4,
      name: 'Employee',
      description: 'Standard employee with basic access',
      permissions: 6,
      users: 2100,
    },
    {
      id: 5,
      name: 'Contractor',
      description: 'Limited access for contractors and freelancers',
      permissions: 4,
      users: 380,
    },
  ]

  const permissions = [
    { category: 'Users', items: ['Create', 'Read', 'Update', 'Delete'] },
    { category: 'Companies', items: ['Create', 'Read', 'Update', 'Delete'] },
    { category: 'Payroll', items: ['View', 'Edit', 'Run', 'Export'] },
    { category: 'Invoices', items: ['Create', 'View', 'Approve', 'Delete'] },
    { category: 'Audit Logs', items: ['Read', 'Export'] },
    { category: 'Reports', items: ['View', 'Create', 'Export', 'Delete'] },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Access Control & Roles</h1>
          <p className="text-muted-foreground mt-2">Manage roles, permissions, and user access levels</p>
        </div>
        <Button asChild>
          <Link href="#add-role">
            <Plus className="h-4 w-4 mr-2" />
            Create New Role
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>All roles configured in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{role.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          <Lock className="h-3 w-3 inline mr-1" />
                          {role.permissions} permissions
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <Users className="h-3 w-3 inline mr-1" />
                          {role.users} users
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        {role.id !== 1 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Role
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permission Categories */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Permission Categories</CardTitle>
              <CardDescription>System permission modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {permissions.map((perm) => (
                  <div key={perm.category} className="pb-3 border-b last:border-0">
                    <h4 className="font-semibold text-sm">{perm.category}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {perm.items.map((item) => (
                        <span key={item} className="text-xs bg-muted px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>Overview of role permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Permission</th>
                  <th className="text-center py-3 px-4 font-semibold">Super Admin</th>
                  <th className="text-center py-3 px-4 font-semibold">Admin</th>
                  <th className="text-center py-3 px-4 font-semibold">Manager</th>
                  <th className="text-center py-3 px-4 font-semibold">Employee</th>
                  <th className="text-center py-3 px-4 font-semibold">Contractor</th>
                </tr>
              </thead>
              <tbody>
                {['View Users', 'Create Users', 'Edit Users', 'Delete Users', 'View Payroll', 'Run Payroll', 'View Audit Logs', 'Export Reports'].map((perm) => (
                  <tr key={perm} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{perm}</td>
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" defaultChecked={perm !== 'Delete Users' && perm !== 'View Audit Logs'} className="h-4 w-4" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" defaultChecked={perm === 'View Users' || perm === 'View Payroll' || perm === 'Export Reports'} className="h-4 w-4" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" defaultChecked={perm === 'View Users' || perm === 'View Payroll'} className="h-4 w-4" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" defaultChecked={perm === 'View Users'} className="h-4 w-4" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
