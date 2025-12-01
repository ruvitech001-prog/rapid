'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Shield,
  Users,
  Edit,
  Trash2,
  MoreVertical,
  Loader2,
  Search,
  Building2,
} from 'lucide-react'
import {
  useSuperAdminTeam,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
} from '@/lib/hooks'
import type { TeamMember, TeamMemberRole } from '@/types/superadmin'
import { toast } from 'sonner'

// Design tokens
const colors = {
  primary500: '#642DFC',
  primary50: '#F6F2FF',
  neutral800: '#353B41',
  neutral700: '#505862',
  neutral600: '#6A7682',
  neutral500: '#8593A3',
  neutral50: '#F4F7FA',
  success600: '#22957F',
  success50: '#EDF9F7',
  warning600: '#CC7A00',
  warning50: '#FFF8EB',
  rose600: '#DB2777',
  rose50: '#FDF2F8',
  border: '#DEE4EB',
}

const ROLE_CONFIG: Record<TeamMemberRole, { label: string; color: string; bgColor: string }> = {
  super_admin: { label: 'Super Admin', color: colors.primary500, bgColor: colors.primary50 },
  admin: { label: 'Admin', color: colors.success600, bgColor: colors.success50 },
  support: { label: 'Support', color: colors.warning600, bgColor: colors.warning50 },
  viewer: { label: 'Viewer', color: colors.rose600, bgColor: colors.rose50 },
}

export default function AccessControlPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<TeamMemberRole | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    role: 'viewer' as TeamMemberRole,
  })

  // Fetch data using hooks
  const {
    data: teamMembers = [],
    isLoading,
    refetch,
  } = useSuperAdminTeam({
    role: roleFilter === 'all' ? undefined : roleFilter,
  })

  const createMember = useCreateTeamMember()
  const updateMember = useUpdateTeamMember()
  const deleteMember = useDeleteTeamMember()

  // Filter by search
  const filteredMembers = teamMembers.filter((member) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    )
  })

  const handleOpenCreate = () => {
    setEditingMember(null)
    setFormData({ email: '', role: 'viewer' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({ email: member.email, role: member.role })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingMember) {
        await updateMember.mutateAsync({
          id: editingMember.id,
          data: { role: formData.role },
        })
        toast.success('Team member updated successfully')
      } else {
        // For create, we would need to find user by email first
        // For now, show a message
        toast.info('To add a new team member, they must have an existing user account')
      }
      setIsModalOpen(false)
      refetch()
    } catch {
      toast.error('Failed to save team member')
    }
  }

  const handleDelete = async (member: TeamMember) => {
    if (!confirm(`Are you sure you want to remove ${member.name} from the team?`)) return
    try {
      await deleteMember.mutateAsync(member.id)
      toast.success('Team member removed')
      refetch()
    } catch {
      toast.error('Failed to remove team member')
    }
  }

  const handleToggleActive = async (member: TeamMember) => {
    try {
      await updateMember.mutateAsync({
        id: member.id,
        data: { isActive: !member.isActive },
      })
      toast.success(member.isActive ? 'Member deactivated' : 'Member activated')
      refetch()
    } catch {
      toast.error('Failed to update member status')
    }
  }

  const getRoleConfig = (role: TeamMemberRole) => {
    return ROLE_CONFIG[role] || ROLE_CONFIG.viewer
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.neutral800 }}>
            Access Control
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.neutral600 }}>
            Manage team members and their access levels
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          style={{ backgroundColor: colors.primary500 }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['super_admin', 'admin', 'support', 'viewer'] as TeamMemberRole[]).map((role) => {
          const config = getRoleConfig(role)
          const count = teamMembers.filter((m) => m.role === role).length
          return (
            <Card
              key={role}
              className="rounded-xl cursor-pointer transition-colors hover:shadow-md"
              style={{ borderColor: colors.border }}
              onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: config.bgColor }}
                  >
                    <Shield className="h-5 w-5" style={{ color: config.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: colors.neutral800 }}>
                      {count}
                    </p>
                    <p className="text-xs" style={{ color: colors.neutral500 }}>
                      {config.label}s
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as TeamMemberRole | 'all')}
        >
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Members Table */}
      <Card className="rounded-xl" style={{ borderColor: colors.border }}>
        <CardContent className="p-0">
          {filteredMembers.length === 0 ? (
            <div className="p-12 text-center" style={{ color: colors.neutral500 }}>
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No team members found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: colors.neutral50 }}>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold uppercase"
                    style={{ color: colors.neutral500 }}
                  >
                    Member
                  </th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold uppercase"
                    style={{ color: colors.neutral500 }}
                  >
                    Role
                  </th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold uppercase"
                    style={{ color: colors.neutral500 }}
                  >
                    Assigned Clients
                  </th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold uppercase"
                    style={{ color: colors.neutral500 }}
                  >
                    Status
                  </th>
                  <th
                    className="text-right py-3 px-4 text-xs font-semibold uppercase"
                    style={{ color: colors.neutral500 }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const roleConfig = getRoleConfig(member.role)
                  return (
                    <tr
                      key={member.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                            style={{
                              backgroundColor: colors.primary50,
                              color: colors.primary500,
                            }}
                          >
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: colors.neutral800 }}>
                              {member.name}
                            </p>
                            <p className="text-xs" style={{ color: colors.neutral500 }}>
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className="font-normal"
                          style={{
                            backgroundColor: roleConfig.bgColor,
                            color: roleConfig.color,
                          }}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {roleConfig.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {member.assignedClients.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" style={{ color: colors.neutral500 }} />
                            <span style={{ color: colors.neutral600 }}>
                              {member.assignedClients.length} client{member.assignedClients.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: colors.neutral500 }}>
                            All clients
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className="font-normal"
                          style={{
                            backgroundColor: member.isActive ? colors.success50 : colors.neutral50,
                            color: member.isActive ? colors.success600 : colors.neutral500,
                          }}
                        >
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(member)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(member)}>
                              {member.isActive ? (
                                <>Deactivate</>
                              ) : (
                                <>Activate</>
                              )}
                            </DropdownMenuItem>
                            {member.role !== 'super_admin' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(member)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? `Edit ${editingMember.name}` : 'Add Team Member'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!editingMember && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@rapid.one"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <p className="text-xs" style={{ color: colors.neutral500 }}>
                  User must have an existing account
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v as TeamMemberRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: colors.neutral50 }}>
                <p className="font-medium mb-1" style={{ color: colors.neutral700 }}>
                  Role Permissions:
                </p>
                <ul className="space-y-1" style={{ color: colors.neutral600 }}>
                  {formData.role === 'super_admin' && (
                    <>
                      <li>• Full system access</li>
                      <li>• Manage all clients and users</li>
                      <li>• Configure system settings</li>
                    </>
                  )}
                  {formData.role === 'admin' && (
                    <>
                      <li>• Manage assigned clients</li>
                      <li>• Approve requests</li>
                      <li>• View reports</li>
                    </>
                  )}
                  {formData.role === 'support' && (
                    <>
                      <li>• Handle support requests</li>
                      <li>• View client information</li>
                      <li>• Limited edit access</li>
                    </>
                  )}
                  {formData.role === 'viewer' && (
                    <>
                      <li>• View-only access</li>
                      <li>• View reports and dashboards</li>
                      <li>• No edit permissions</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: colors.primary500 }}
              disabled={createMember.isPending || updateMember.isPending}
            >
              {createMember.isPending || updateMember.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingMember ? (
                'Update'
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
