'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Users, UserCheck, UserX, ChevronRight } from 'lucide-react'
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

  const activeCount = employees.filter(e => e.status === 'active').length
  const onLeaveCount = employees.filter(e => e.status === 'on-leave').length
  const inactiveCount = employees.filter(e => e.status === 'inactive').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-[#8593A3] mt-1">
            Manage your organization&apos;s employees
          </p>
        </div>
        <Button asChild size="lg" className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Link href="/employer/employees/new">
            <Plus className="h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL EMPLOYEES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{employees.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIVE</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{activeCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">ON LEAVE</p>
                <p className="text-3xl font-bold text-[#CC7A00] mt-2">{onLeaveCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC7A00]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#CC7A00]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">INACTIVE</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{inactiveCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <UserX className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">SEARCH</Label>
              <Input
                id="search"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-[#DEE4EB] focus:border-[#586AF5] focus:ring-[#586AF5]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">DEPARTMENT</Label>
              <select
                id="department"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[11px] font-semibold text-[#8593A3] tracking-wider">STATUS</Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#DEE4EB] bg-white px-3 py-2 text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
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
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">
              Employee List
              <span className="ml-2 text-sm font-normal text-[#8593A3]">
                ({filteredEmployees.length} of {employees.length})
              </span>
            </CardTitle>
            <Link href="/employer/employees" className="text-sm font-medium text-[#586AF5] hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length > 0 ? (
            <DataTable columns={columns} data={filteredEmployees} />
          ) : (
            <div className="text-center py-12">
              <p className="text-[#8593A3]">
                No employees found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
