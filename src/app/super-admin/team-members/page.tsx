'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useSuperAdminWorkforce,
  useSuperAdminCompanies,
  type WorkforceFilters,
  useUpdateEmployee,
  useDeactivateEmployee,
  useUpdateContractor,
  useDeactivateContractor,
} from '@/lib/hooks'
import { toast } from 'sonner'

type WorkforceMember = NonNullable<ReturnType<typeof useSuperAdminWorkforce>['data']>[0]

export default function TeamMembersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'employee' | 'contractor'>('all')
  const [selectedMember, setSelectedMember] = useState<WorkforceMember | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState('')

  const filters: WorkforceFilters = useMemo(
    () => ({
      search: searchQuery || undefined,
      companyId: selectedCompany !== 'all' ? selectedCompany : undefined,
      type: selectedType !== 'all' ? selectedType : undefined,
    }),
    [searchQuery, selectedCompany, selectedType]
  )

  const { data: workforce, isLoading, error, refetch } = useSuperAdminWorkforce(filters)
  const { data: companies } = useSuperAdminCompanies()

  // Mutations for employees
  const updateEmployeeMutation = useUpdateEmployee()
  const deactivateEmployeeMutation = useDeactivateEmployee()

  // Mutations for contractors
  const updateContractorMutation = useUpdateContractor()
  const deactivateContractorMutation = useDeactivateContractor()

  const isProcessing = updateEmployeeMutation.isPending ||
    deactivateEmployeeMutation.isPending ||
    updateContractorMutation.isPending ||
    deactivateContractorMutation.isPending

  const handleViewProfile = (member: WorkforceMember) => {
    setSelectedMember(member)
    setIsViewModalOpen(true)
  }

  const handleEdit = (member: WorkforceMember) => {
    setSelectedMember(member)
    setEditName(member.name)
    setIsEditModalOpen(true)
  }

  const handleDeactivate = (member: WorkforceMember) => {
    setSelectedMember(member)
    setIsDeactivateModalOpen(true)
  }

  const confirmDeactivate = async () => {
    if (!selectedMember) return

    if (selectedMember.role === 'Employee') {
      deactivateEmployeeMutation.mutate(
        { employeeId: selectedMember.id, employeeName: selectedMember.name },
        {
          onSuccess: () => {
            setIsDeactivateModalOpen(false)
            refetch()
          },
        }
      )
    } else {
      deactivateContractorMutation.mutate(
        { contractorId: selectedMember.id, contractorName: selectedMember.name },
        {
          onSuccess: () => {
            setIsDeactivateModalOpen(false)
            refetch()
          },
        }
      )
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedMember || !editName.trim()) return

    if (selectedMember.role === 'Employee') {
      updateEmployeeMutation.mutate(
        { employeeId: selectedMember.id, updates: { fullName: editName } },
        {
          onSuccess: () => {
            setIsEditModalOpen(false)
            refetch()
          },
        }
      )
    } else {
      updateContractorMutation.mutate(
        { contractorId: selectedMember.id, updates: { fullName: editName } },
        {
          onSuccess: () => {
            setIsEditModalOpen(false)
            refetch()
          },
        }
      )
    }
  }

  const stats = useMemo(() => {
    if (!workforce) return { total: 0, employees: 0, contractors: 0, companies: 0 }
    const uniqueCompanies = new Set(workforce.map((m) => m.companyId))
    return {
      total: workforce.length,
      employees: workforce.filter((m) => m.role === 'Employee').length,
      contractors: workforce.filter((m) => m.role === 'Contractor').length,
      companies: uniqueCompanies.size,
    }
  }, [workforce])

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Members Management</h1>
            <p className="text-muted-foreground mt-2">Manage all team members across all companies</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Team Members</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Failed to load team member data'}
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies?.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.legalName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as 'all' | 'employee' | 'contractor')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="employee">Employees</SelectItem>
                <SelectItem value="contractor">Contractors</SelectItem>
              </SelectContent>
            </Select>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !workforce || workforce.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery || selectedCompany !== 'all' || selectedType !== 'all'
                ? 'No team members match your filters.'
                : 'No team members found.'}
            </div>
          ) : (
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
                  {workforce.map((member) => (
                    <tr key={`${member.role}-${member.id}`} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{member.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{member.email}</td>
                      <td className="py-3 px-4">{member.company}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.role === 'Employee'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(member)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivate(member)}>
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
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.employees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.contractors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.companies}</p>
          </CardContent>
        </Card>
      </div>

      {/* View Profile Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Team Member Profile</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                  {selectedMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Company</p>
                  <p className="font-medium">{selectedMember.company}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Role</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedMember.role === 'Employee'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {selectedMember.role}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Join Date</p>
                  <p>{selectedMember.joinDate ? new Date(selectedMember.joinDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={selectedMember.email} type="email" disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed directly</p>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input defaultValue={selectedMember.company} disabled />
                <p className="text-xs text-muted-foreground">Company cannot be changed</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isProcessing || !editName.trim()}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Modal */}
      <Dialog open={isDeactivateModalOpen} onOpenChange={setIsDeactivateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate Team Member</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="py-4">
              <p className="text-muted-foreground">
                Are you sure you want to deactivate <strong>{selectedMember.name}</strong>?
                They will no longer have access to the system.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeactivateModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeactivate} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
