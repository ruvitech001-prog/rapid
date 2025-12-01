/**
 * Roles & Permissions Screen
 * GROUP A - Screen 2 (LIST + CREATE pattern)
 *
 * This screen demonstrates:
 * - DataTableWrapper usage for displaying roles
 * - ModalFormWrapper for creating and editing roles
 * - Zod validation for role form
 * - Permission management UI
 * - Form state management with react-hook-form
 * - Toast notifications for feedback
 *
 * @route /employer/access-control
 */

'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, ModalFormWrapper } from '@/components/templates'
import { getCurrentMockCompany, getMockDataByCompany, addMockData, generateId } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Lock, Plus } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Available permissions in the system
 */
const AVAILABLE_PERMISSIONS = [
  { id: 'users_view', label: 'View Users' },
  { id: 'users_create', label: 'Create Users' },
  { id: 'users_edit', label: 'Edit Users' },
  { id: 'users_delete', label: 'Delete Users' },
  { id: 'roles_view', label: 'View Roles' },
  { id: 'roles_create', label: 'Create Roles' },
  { id: 'roles_edit', label: 'Edit Roles' },
  { id: 'roles_delete', label: 'Delete Roles' },
  { id: 'teams_view', label: 'View Teams' },
  { id: 'teams_create', label: 'Create Teams' },
  { id: 'teams_edit', label: 'Edit Teams' },
  { id: 'teams_delete', label: 'Delete Teams' },
  { id: 'payroll_view', label: 'View Payroll' },
  { id: 'payroll_edit', label: 'Edit Payroll' },
  { id: 'reports_view', label: 'View Reports' },
  { id: 'reports_export', label: 'Export Reports' },
]

/**
 * Default permission sets
 */
const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'users_view', 'users_create', 'users_edit', 'users_delete',
    'roles_view', 'roles_create', 'roles_edit', 'roles_delete',
    'teams_view', 'teams_create', 'teams_edit', 'teams_delete',
    'payroll_view', 'payroll_edit',
    'reports_view', 'reports_export',
  ],
  manager: [
    'users_view',
    'users_edit',
    'teams_view',
    'teams_edit',
    'payroll_view',
    'reports_view',
    'reports_export',
  ],
  user: [
    'users_view',
    'teams_view',
    'reports_view',
  ],
}

/**
 * Validation schema for role form
 */
const roleFormSchema = z.object({
  name: z.string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be less than 50 characters'),
  description: z.string()
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description must be less than 500 characters'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
})

type RoleFormData = z.infer<typeof roleFormSchema>

/**
 * Role interface for TypeScript type safety
 */
interface Role {
  id: string
  company_id: string
  name: string
  description: string
  permissions: string[]
  user_count?: number
  created_at: string
  updated_at: string
}

export default function AccessControlPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const company = getCurrentMockCompany()
  const [roles, setRoles] = useState<Role[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  })

  const selectedPermissions = watch('permissions')

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Load roles on component mount
   */
  useEffect(() => {
    if (!company) return

    const mockRoles = getMockDataByCompany('roles', company.id)
    if (mockRoles && mockRoles.length > 0) {
      setRoles(mockRoles)
    } else {
      // Initialize with default roles if none exist
      const today = new Date().toISOString().split('T')[0] || new Date().toISOString()
      const defaultRoles: Role[] = [
        {
          id: generateId(),
          company_id: company.id,
          name: 'Admin',
          description: 'Full system access with all permissions',
          permissions: DEFAULT_ROLE_PERMISSIONS.admin || [],
          user_count: 2,
          created_at: today,
          updated_at: today,
        },
        {
          id: generateId(),
          company_id: company.id,
          name: 'Manager',
          description: 'Can manage teams, view payroll, and manage users',
          permissions: DEFAULT_ROLE_PERMISSIONS.manager || [],
          user_count: 5,
          created_at: today,
          updated_at: today,
        },
        {
          id: generateId(),
          company_id: company.id,
          name: 'User',
          description: 'Basic access to view information',
          permissions: DEFAULT_ROLE_PERMISSIONS.user || [],
          user_count: 12,
          created_at: today,
          updated_at: today,
        },
      ]
      setRoles(defaultRoles)
      // Store in mock data
      defaultRoles.forEach(role => addMockData('roles', role))
    }
  }, [company?.id])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Handle opening create modal
   */
  const handleCreate = () => {
    setEditingRole(null)
    reset({
      name: '',
      description: '',
      permissions: [],
    })
    setIsModalOpen(true)
  }

  /**
   * Handle opening edit modal
   */
  const handleEdit = (role: Role) => {
    setEditingRole(role)
    reset({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })
    setIsModalOpen(true)
  }

  /**
   * Handle form submission
   */
  const onSubmit = async (data: RoleFormData) => {
    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const today = new Date().toISOString().split('T')[0] || new Date().toISOString()

      if (editingRole) {
        // Update existing role
        const updatedRole: Role = {
          ...editingRole,
          ...data,
          updated_at: today,
        }
        setRoles(roles.map(r => r.id === editingRole.id ? updatedRole : r))
        toast.success(`Role "${data.name}" updated successfully`)
      } else {
        // Create new role
        const newRole: Role = {
          id: generateId(),
          company_id: company?.id || '',
          ...data,
          user_count: 0,
          created_at: today,
          updated_at: today,
        }
        setRoles([...roles, newRole])
        addMockData('roles', newRole)
        toast.success(`Role "${data.name}" created successfully`)
      }

      setIsModalOpen(false)
      reset()
    } catch (error) {
      console.error('Error saving role:', error)
      toast.error('Failed to save role')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle role deletion
   */
  const handleDelete = (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      const roleToDelete = roles.find(r => r.id === roleId)
      setRoles(roles.filter(r => r.id !== roleId))
      toast.success(`Role "${roleToDelete?.name}" deleted successfully`)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles and their associated permissions"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Access Control' },
        ]}
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        }
      />

      {/* Roles Table */}
      <div className="bg-white rounded-lg border">
        {roles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No roles found. Create one to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {role.name}
                      {role.name.toLowerCase() === 'admin' && (
                        <Badge variant="destructive" className="text-xs">Admin</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{role.description}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {role.permissions.length} of {AVAILABLE_PERMISSIONS.length} permissions
                    </span>
                  </TableCell>
                  <TableCell>{role.user_count || 0} users</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {role.name.toLowerCase() !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(role.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create/Edit Role Modal */}
      <ModalFormWrapper
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          reset()
        }}
        title={editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Role'}
        description={editingRole ? 'Update role details and permissions' : 'Create a new role with selected permissions'}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Saving...' : 'Save Role'}
        isLoading={isSubmitting}
      >
        {/* Role Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Role Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Senior Manager"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the purpose and responsibilities of this role"
            className="min-h-20"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Permissions Checklist */}
        <div className="space-y-3">
          <Label className="text-base">Permissions *</Label>
          <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto border">
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Controller
                    name="permissions"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={permission.id}
                        checked={(field.value || []).includes(permission.id)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || []
                          if (checked) {
                            field.onChange([...currentValue, permission.id])
                          } else {
                            field.onChange(currentValue.filter(p => p !== permission.id))
                          }
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={permission.id} className="font-normal cursor-pointer">
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          {errors.permissions && (
            <p className="text-sm text-red-600">{errors.permissions.message}</p>
          )}
          {selectedPermissions && selectedPermissions.length > 0 && (
            <p className="text-sm text-gray-600">
              {selectedPermissions.length} of {AVAILABLE_PERMISSIONS.length} permissions selected
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <p className="font-medium mb-1">Tip:</p>
          <p>Assign only the permissions necessary for this role. Admin has all permissions by default.</p>
        </div>
      </ModalFormWrapper>
    </div>
  )
}
