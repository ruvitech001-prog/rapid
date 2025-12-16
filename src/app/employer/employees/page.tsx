'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  ChevronDown,
  X,
  MoreVertical,
  Download,
  Users,
  Bell,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  useEmployees,
  useCompanyTeams,
  useCreateTeam,
  useAssignEmployeeToTeam,
} from '@/lib/hooks'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'
import { colors } from '@/lib/design-tokens'

interface Employee {
  id: string
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  designation: string
  team_name: string
  badge_status: 'none' | 'ex_employee' | 'manager' | 'on_notice_period'
  reporting_manager_name: string | null
}

export default function EmployeesPage() {
  const { user } = useAuth()
  const companyId = user?.companyId

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [showExEmployee, setShowExEmployee] = useState(false)
  const [showManager, setShowManager] = useState(false)
  const [showOnNotice, setShowOnNotice] = useState(false)
  const [selectedDesignation, setSelectedDesignation] = useState<string>('')
  const [displayCount, setDisplayCount] = useState(6)

  // Sheet states
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [createTeamSheetOpen, setCreateTeamSheetOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Form states for edit
  const [editTeamId, setEditTeamId] = useState('')
  const [editReportingManager, setEditReportingManager] = useState('')

  // Form states for create team
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDescription, setNewTeamDescription] = useState('')
  const [newTeamManager, setNewTeamManager] = useState('')

  // Fetch real employee data
  const { data: employeesData = [], isLoading } = useEmployees(companyId || undefined)

  // Fetch teams from database
  const { data: teamsData = [] } = useCompanyTeams(companyId || null)

  // Mutations for team operations
  const createTeamMutation = useCreateTeam(companyId || '')
  const assignEmployeeMutation = useAssignEmployeeToTeam(companyId || '')

  // Transform data to match expected interface
  const employees: Employee[] = useMemo(() => {
    return employeesData.map(emp => {
      // Map status to badge_status
      let badge_status: 'none' | 'ex_employee' | 'manager' | 'on_notice_period' = 'none'
      if (emp.status === 'exited') badge_status = 'ex_employee'
      else if (emp.status === 'on_notice') badge_status = 'on_notice_period'

      // Split full name
      const nameParts = emp.fullName.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      return {
        id: emp.id,
        employee_code: emp.employeeCode,
        first_name: firstName,
        last_name: lastName,
        email: emp.email,
        phone: emp.phone,
        designation: emp.designation,
        team_name: emp.department, // Using department as team
        badge_status,
        reporting_manager_name: null,
      }
    })
  }, [employeesData])

  // Get unique teams (from database) and designations
  const teams = useMemo(() => {
    // Combine database teams with unique department names from employees
    const dbTeamNames = teamsData.map(t => t.name)
    const employeeTeams = [...new Set(employees.map(e => e.team_name))]
    return [...new Set([...dbTeamNames, ...employeeTeams])].filter(Boolean)
  }, [teamsData, employees])
  const designations = useMemo(() => [...new Set(employees.map(e => e.designation))], [employees])

  // Count badges
  const exEmployeeCount = employees.filter(e => e.badge_status === 'ex_employee').length
  const managerCount = employees.filter(e => e.badge_status === 'manager').length
  const onNoticeCount = employees.filter(e => e.badge_status === 'on_notice_period').length

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm ||
        emp.employee_code.toLowerCase().includes(searchLower) ||
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchLower)

      // Team filter
      const matchesTeam = selectedTeams.length === 0 || selectedTeams.includes(emp.team_name)

      // Badge filters
      const matchesBadge =
        (!showExEmployee && !showManager && !showOnNotice) ||
        (showExEmployee && emp.badge_status === 'ex_employee') ||
        (showManager && emp.badge_status === 'manager') ||
        (showOnNotice && emp.badge_status === 'on_notice_period')

      // Designation filter
      const matchesDesignation = !selectedDesignation || emp.designation === selectedDesignation

      return matchesSearch && matchesTeam && matchesBadge && matchesDesignation
    })
  }, [employees, searchTerm, selectedTeams, showExEmployee, showManager, showOnNotice, selectedDesignation])

  const displayedEmployees = filteredEmployees.slice(0, displayCount)
  const hasMore = displayCount < filteredEmployees.length

  const handleEditTeamDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    // Find the team ID from team name
    const team = teamsData.find(t => t.name === employee.team_name)
    setEditTeamId(team?.id || '')
    setEditReportingManager(employee.reporting_manager_name || '')
    setEditSheetOpen(true)
  }

  const handleUpdateTeamDetails = async () => {
    if (!selectedEmployee) return

    if (!editTeamId) {
      toast.error('Please select a team')
      return
    }

    // Find reporting manager ID if name is provided
    const reportingManagerId = editReportingManager
      ? employees.find(e => `${e.first_name} ${e.last_name}` === editReportingManager)?.id
      : undefined

    assignEmployeeMutation.mutate(
      {
        teamId: editTeamId,
        employeeId: selectedEmployee.id,
        reportingManagerId,
        role: 'member',
      },
      {
        onSuccess: () => {
          setEditSheetOpen(false)
        },
      }
    )
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Team name is required')
      return
    }

    // Find manager ID if name is provided
    const managerId = newTeamManager
      ? employees.find(e => `${e.first_name} ${e.last_name}` === newTeamManager)?.id
      : undefined

    createTeamMutation.mutate(
      {
        name: newTeamName,
        description: newTeamDescription || undefined,
        managerId,
      },
      {
        onSuccess: () => {
          setCreateTeamSheetOpen(false)
          setNewTeamName('')
          setNewTeamDescription('')
          setNewTeamManager('')
        },
      }
    )
  }

  const handleDownloadEmployees = () => {
    if (filteredEmployees.length === 0) {
      toast.error('No employees to export')
      return
    }

    const headers = ['ID', 'Name', 'Designation', 'Team', 'Email', 'Phone']
    const rows = filteredEmployees.map(emp => [
      emp.employee_code,
      `${emp.first_name} ${emp.last_name}`,
      emp.designation,
      emp.team_name,
      emp.email,
      emp.phone
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Employee list exported successfully')
  }

  const removeTeamFilter = (team: string) => {
    setSelectedTeams(prev => prev.filter(t => t !== team))
  }

  const toggleTeamFilter = (team: string) => {
    setSelectedTeams(prev =>
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    )
  }

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'ex_employee':
        return 'bg-[#F4F7FA] text-[#505862]'
      case 'manager':
        return 'bg-[#F6F2FF] text-[#505862]'
      case 'on_notice_period':
        return 'bg-[#FFF7E5] text-[#995200]'
      default:
        return ''
    }
  }

  const getBadgeLabel = (status: string) => {
    switch (status) {
      case 'ex_employee':
        return 'EX-EMPLOYEE'
      case 'manager':
        return 'MANAGER'
      case 'on_notice_period':
        return 'ON NOTICE PERIOD'
      default:
        return ''
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary500 }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: colors.neutral800 }}>
          Employees ({filteredEmployees.length})
        </h1>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" style={{ borderColor: colors.iconBlue, color: colors.iconBlue }}>
                + Create request
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/employer/requests/new/expense">Expense Request</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/employer/requests/new/special">Special Request</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild className="text-white" style={{ backgroundColor: colors.primary500 }}>
            <Link href="/employer/employees/new">
              Hire another
              <ChevronDown className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" size="icon" style={{ borderColor: colors.neutral100 }}>
            <Bell className="h-5 w-5" style={{ color: colors.neutral500 }} />
          </Button>
        </div>
      </div>

      {/* Second Row: Create team & Download */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="bg-[#EEEFFD] text-[#586AF5] hover:bg-[#EEEFFD]/80"
            onClick={() => setCreateTeamSheetOpen(true)}
          >
            <Users className="mr-2 h-4 w-4" />
            Create team
          </Button>
          <Button
            variant="outline"
            className="border-[#586AF5] text-[#586AF5]"
            onClick={handleDownloadEmployees}
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-[600px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8B5C2]" />
          <Input
            placeholder="Search by ID, name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border-[#DEE4EB] focus:border-[#586AF5]"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[#6A7682]">
          <Filter className="h-5 w-5" />
          <span className="text-lg">Filters :</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className={`rounded-lg ${showExEmployee ? 'bg-[#F6F2FF] border-[#642DFC] text-[#642DFC]' : 'border-[#DEE4EB] text-[#8593A3]'}`}
          onClick={() => setShowExEmployee(!showExEmployee)}
        >
          Ex-employee ({exEmployeeCount})
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`rounded-lg ${showManager ? 'bg-[#F6F2FF] border-[#642DFC] text-[#642DFC]' : 'border-[#DEE4EB] text-[#8593A3]'}`}
          onClick={() => setShowManager(!showManager)}
        >
          Manager ({managerCount})
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`rounded-lg ${showOnNotice ? 'bg-[#F6F2FF] border-[#642DFC] text-[#642DFC]' : 'border-[#DEE4EB] text-[#8593A3]'}`}
          onClick={() => setShowOnNotice(!showOnNotice)}
        >
          On notice period ({onNoticeCount})
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-lg border-[#DEE4EB] text-[#8593A3]">
              Designation
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedDesignation('')}>
              All Designations
            </DropdownMenuItem>
            {designations.map(designation => (
              <DropdownMenuItem key={designation} onClick={() => setSelectedDesignation(designation)}>
                {designation}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-lg border-[#DEE4EB] text-[#8593A3]">
              Team {selectedTeams.length > 0 && <span className="text-[#642DFC]">({selectedTeams.length})</span>}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {teams.map(team => (
              <DropdownMenuItem
                key={team}
                onClick={() => toggleTeamFilter(team)}
                className={selectedTeams.includes(team) ? 'bg-[#F6F2FF]' : ''}
              >
                {team}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filter Tags */}
      {selectedTeams.length > 0 && (
        <div className="flex items-center gap-3">
          {selectedTeams.map(team => (
            <div
              key={team}
              className="flex items-center gap-2 px-3 py-1 bg-[#F6F2FF] rounded-lg"
            >
              <span className="text-sm font-semibold text-[#642DFC]">{team}</span>
              <button onClick={() => removeTeamFilter(team)}>
                <X className="h-4 w-4 text-[#8593A3] hover:text-[#642DFC]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white border border-[#DEE4EB] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#DEE4EB]">
              <th className="px-6 py-4 text-left text-xs font-medium text-[#353B41] uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#353B41] uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#353B41] uppercase tracking-wider">Start Date</th>
              {teams.length > 1 && (
                <th className="px-6 py-4 text-left text-xs font-medium text-[#353B41] uppercase tracking-wider">Team</th>
              )}
              <th className="px-6 py-4 text-left text-xs font-medium text-[#353B41] uppercase tracking-wider">CTC</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#353B41] uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((employee, index) => (
              <tr key={employee.id} className={index !== displayedEmployees.length - 1 ? 'border-b border-[#DEE4EB]' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Employee Picture */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {employee.first_name[0]}{employee.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#353B41]">
                        {employee.first_name} {employee.last_name}
                      </p>
                      <p className="text-xs text-[#8593A3]">
                        {employee.designation}
                      </p>
                      {employee.badge_status !== 'none' && (
                        <Badge className={`mt-1 text-[10px] font-medium uppercase tracking-wider ${getBadgeStyle(employee.badge_status)}`}>
                          {getBadgeLabel(employee.badge_status)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-[#586AF5]">{employee.email}</p>
                    <p className="text-xs text-[#8593A3]">{employee.phone || 'Not provided'}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#8593A3]">
                  {/* TODO: Add start_date to employee data */}
                  -
                </td>
                {teams.length > 1 && (
                  <td className="px-6 py-4 text-sm text-[#8593A3]">
                    {employee.team_name}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-[#8593A3]">
                  {/* TODO: Add CTC from contract */}
                  -
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4 text-[#8593A3]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[147px]">
                      <DropdownMenuItem asChild>
                        <Link href={`/employer/employees/${employee.id}`} className="text-xs font-semibold text-[#8593A3]">
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditTeamDetails(employee)}
                        className="text-xs font-semibold text-[#8593A3]"
                      >
                        Edit team details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Load More Button */}
        {hasMore && (
          <div className="p-6">
            <Button
              variant="secondary"
              className="bg-[#EEEFFD] text-[#586AF5] hover:bg-[#EEEFFD]/80"
              onClick={() => setDisplayCount(prev => prev + 6)}
            >
              Load more
            </Button>
          </div>
        )}
      </div>

      {/* Edit Team Details Sheet */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="w-[576px] sm:max-w-[576px]">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-xl font-semibold text-[#353B41]">
              Edit team details
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="text-[#8593A3]">Employee name</Label>
              <Input
                value={selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : ''}
                disabled
                className="h-12 border-[#DEE4EB] bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#8593A3]">Team name</Label>
              <Select value={editTeamId} onValueChange={setEditTeamId}>
                <SelectTrigger className="h-12 border-[#DEE4EB]">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teamsData.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#8593A3]">Reporting manager</Label>
              <Select value={editReportingManager} onValueChange={setEditReportingManager}>
                <SelectTrigger className="h-12 border-[#DEE4EB]">
                  <SelectValue placeholder="Select reporting manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {employees
                    .filter(e => e.id !== selectedEmployee?.id)
                    .map(emp => (
                      <SelectItem key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
                        {emp.first_name} {emp.last_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                variant="ghost"
                onClick={() => setEditSheetOpen(false)}
                className="text-[#586AF5]"
                disabled={assignEmployeeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTeamDetails}
                className="bg-[#642DFC] hover:bg-[#5020d9]"
                disabled={assignEmployeeMutation.isPending}
              >
                {assignEmployeeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Create Team Sheet */}
      <Sheet open={createTeamSheetOpen} onOpenChange={setCreateTeamSheetOpen}>
        <SheetContent className="w-[576px] sm:max-w-[576px]">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-xl font-semibold text-[#353B41]">
              Create team
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="text-[#8593A3]">Team name</Label>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="h-12 border-[#DEE4EB]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#8593A3]">Description (optional)</Label>
              <Input
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                placeholder="Enter team description"
                className="h-12 border-[#DEE4EB]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#8593A3]">Team manager (optional)</Label>
              <Select value={newTeamManager} onValueChange={setNewTeamManager}>
                <SelectTrigger className="h-12 border-[#DEE4EB]">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
                      {emp.first_name} {emp.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                variant="ghost"
                onClick={() => setCreateTeamSheetOpen(false)}
                className="text-[#586AF5]"
                disabled={createTeamMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTeam}
                className="bg-[#642DFC] hover:bg-[#5020d9]"
                disabled={createTeamMutation.isPending}
              >
                {createTeamMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
