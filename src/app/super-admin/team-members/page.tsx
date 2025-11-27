'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TeamMembersPage() {
  const teamMembers = [
    { id: 1, name: 'John Doe', email: 'john@techcorp.com', company: 'TechCorp Inc', role: 'Employee', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@global.com', company: 'Global Solutions', role: 'Contractor', joinDate: '2024-02-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@innovationlabs.com', company: 'Innovation Labs', role: 'Employee', joinDate: '2024-01-20' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@digital.com', company: 'Digital Services', role: 'Employee', joinDate: '2024-03-05' },
    { id: 5, name: 'David Brown', email: 'david@creative.com', company: 'Creative Agency', role: 'Contractor', joinDate: '2024-03-20' },
    { id: 6, name: 'Emily Davis', email: 'emily@techcorp.com', company: 'TechCorp Inc', role: 'Employee', joinDate: '2024-02-01' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Members Management</h1>
          <p className="text-muted-foreground mt-2">Manage all team members across all companies</p>
        </div>
        <Button asChild>
          <Link href="#add-member">
            <Plus className="h-4 w-4 mr-2" />
            Add New Member
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." className="pl-10" />
            </div>
            <Button variant="outline">Filter by Company</Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Team Members</CardTitle>
          <CardDescription>System-wide employee and contractor directory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Company</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{member.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{member.email}</td>
                    <td className="py-3 px-4">{member.company}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'Employee'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{member.joinDate}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{teamMembers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{teamMembers.filter(m => m.role === 'Employee').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{teamMembers.filter(m => m.role === 'Contractor').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{new Set(teamMembers.map(m => m.company)).size}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
