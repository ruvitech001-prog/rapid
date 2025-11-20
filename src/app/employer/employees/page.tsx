'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

interface Employee {
  id: string
  name: string
  email: string
  designation: string
  department: string
  employeeId: string
  joinDate: string
  status: 'active' | 'inactive' | 'on-leave'
  salary: number
}

export default function EmployeesPage() {
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      employeeId: 'EMP001',
      joinDate: '2023-01-15',
      status: 'active',
      salary: 1200000,
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah.smith@company.com',
      designation: 'Product Manager',
      department: 'Product',
      employeeId: 'EMP002',
      joinDate: '2023-03-20',
      status: 'active',
      salary: 1500000,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.j@company.com',
      designation: 'UI/UX Designer',
      department: 'Design',
      employeeId: 'EMP003',
      joinDate: '2023-06-10',
      status: 'on-leave',
      salary: 900000,
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice.brown@company.com',
      designation: 'HR Manager',
      department: 'Human Resources',
      employeeId: 'EMP004',
      joinDate: '2022-11-05',
      status: 'active',
      salary: 1100000,
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.w@company.com',
      designation: 'DevOps Engineer',
      department: 'Engineering',
      employeeId: 'EMP005',
      joinDate: '2023-07-22',
      status: 'active',
      salary: 1300000,
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const departments = ['all', ...new Set(employees.map((emp) => emp.department))]

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment =
      filterDepartment === 'all' || emp.department === filterDepartment
    const matchesStatus =
      filterStatus === 'all' || emp.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const statusConfig = {
    active: { label: 'Active', class: 'bg-green-100 text-green-800' },
    'on-leave': { label: 'On Leave', class: 'bg-yellow-100 text-yellow-800' },
    inactive: { label: 'Inactive', class: 'bg-red-100 text-red-800' },
  }

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'name',
      header: 'Employee',
      cell: ({ row }) => {
        const employee = row.original
        return (
          <div>
            <p className="font-medium">{employee.name}</p>
            <p className="text-sm text-muted-foreground">{employee.email}</p>
            <p className="text-xs text-muted-foreground">
              {employee.designation}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
    },
    {
      accessorKey: 'joinDate',
      header: 'Join Date',
      cell: ({ row }) => (
        <span>
          {new Date(row.getValue('joinDate') as string).toLocaleDateString(
            'en-IN'
          )}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const config = statusConfig[status as keyof typeof statusConfig]
        return (
          <Badge variant="outline" className={config.class}>
            {config.label}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link href={`/employer/employees/${row.original.id}`}>View</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link href={`/employer/employees/${row.original.id}/edit`}>Edit</Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's employees
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/employer/employees/new">
            <Plus className="h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Employee List ({filteredEmployees.length} of {employees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length > 0 ? (
            <DataTable columns={columns} data={filteredEmployees} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No employees found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
