'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Trash2, Eye, Plus } from 'lucide-react'

export default function CompanyPage() {
  const companies = [
    {
      id: 1,
      name: 'TechCorp Inc',
      email: 'admin@techcorp.com',
      status: 'Active',
      employees: 456,
      joinDate: '2023-01-15',
      subscription: 'Premium',
    },
    {
      id: 2,
      name: 'Global Solutions',
      email: 'info@global.com',
      status: 'Active',
      employees: 234,
      joinDate: '2023-03-20',
      subscription: 'Standard',
    },
    {
      id: 3,
      name: 'Innovation Labs',
      email: 'contact@innov.com',
      status: 'Active',
      employees: 567,
      joinDate: '2022-06-10',
      subscription: 'Premium',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Companies</h1>
          <p className="text-muted-foreground mt-2">Manage all registered companies</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Search by company name or email..." />
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
          <CardDescription>Complete list of registered companies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Company Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Employees</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Subscription</th>
                  <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{company.name}</td>
                    <td className="py-3 px-4">{company.email}</td>
                    <td className="py-3 px-4">{company.employees}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {company.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{company.subscription}</td>
                    <td className="py-3 px-4 text-muted-foreground">{company.joinDate}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
