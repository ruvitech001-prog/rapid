/**
 * Team Management Screen
 * GROUP A - Example Screen 1 (LIST + CREATE pattern)
 *
 * This screen demonstrates:
 * - DataTableWrapper usage for listing
 * - ModalFormWrapper usage for creating
 * - Mock data integration with getMockDataByCompany
 * - Form validation with Zod
 * - Toast notifications
 * - React state management
 *
 * @route /employer/settings/teams
 */

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader, DataTableWrapper, ModalFormWrapper } from '@/components/templates'
import { getMockDataByCompany, getCurrentMockCompany } from '@/lib/mock-data'
import { addMockData, generateId } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Validation schema for team form
 * Uses Zod for type-safe validation
 */
const teamFormSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
})

type TeamFormData = z.infer<typeof teamFormSchema>

/**
 * Team interface for TypeScript type safety
 */
interface Team {
  id: string
  company_id: string
  name: string
  description: string
  manager_id?: string
  created_at: string
}

export default function TeamManagementPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const company = getCurrentMockCompany()
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
  })

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Load teams on component mount
   * Uses mock data for development
   */
  useEffect(() => {
    const loadTeams = async () => {
      try {
        setIsLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Get mock data by company ID
        const mockTeams = getMockDataByCompany('teams', company.id)
        setTeams(mockTeams || [])
      } catch (error) {
        console.error('Error loading teams:', error)
        toast.error('Failed to load teams')
      } finally {
        setIsLoading(false)
      }
    }

    loadTeams()
  }, [company.id])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Handle form submission for creating new team
   */
  const onSubmit = async (data: TeamFormData) => {
    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create new team object
      const newTeam: Team = {
        id: generateId(),
        company_id: company.id,
        name: data.name,
        description: data.description,
        manager_id: undefined,
        created_at: new Date().toISOString().split('T')[0],
      }

      // Add to mock data
      addMockData('teams', newTeam)

      // Update local state
      setTeams([...teams, newTeam])

      // Close modal and reset form
      setIsModalOpen(false)
      reset()

      // Show success message
      toast.success(`Team "${data.name}" created successfully`)
    } catch (error) {
      console.error('Error creating team:', error)
      toast.error('Failed to create team')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle team deletion
   * Note: In production, this would call an API
   */
  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      const updatedTeams = teams.filter((t) => t.id !== teamId)
      setTeams(updatedTeams)
      toast.success('Team deleted successfully')
    }
  }

  /**
   * Handle team edit
   * Note: In a real app, this would open a separate edit modal
   */
  const handleEditTeam = (team: Team) => {
    console.log('Edit team:', team)
    toast.info('Edit functionality - coming soon')
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Team Management"
        description="Create and manage your organization teams"
        breadcrumbs={[
          { label: 'Home', href: '/employer/dashboard' },
          { label: 'Settings', href: '/employer/settings' },
          { label: 'Teams' },
        ]}
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Team
          </Button>
        }
      />

      {/* Teams Table */}
      <DataTableWrapper<Team>
        columns={[
          {
            key: 'name',
            label: 'Team Name',
          },
          {
            key: 'description',
            label: 'Description',
          },
          {
            key: 'created_at',
            label: 'Created',
          },
          {
            key: 'id',
            label: 'Actions',
            render: (_, team: Team) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditTeam(team)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteTeam(team.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={teams}
        isLoading={isLoading}
        emptyMessage="No teams created yet. Create your first team to get started."
      />

      {/* Create Team Modal */}
      <ModalFormWrapper
        title="Create New Team"
        description="Add a new team to your organization"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          reset()
        }}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? 'Creating...' : 'Create Team'}
        isLoading={isSubmitting}
      >
        {/* Team Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Team Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Engineering, Product, Design"
            {...register('name')}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Input
            id="description"
            placeholder="Brief description of the team's purpose"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Helper text */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          Teams help organize your employees and assign managers. You can add members after
          creation.
        </div>
      </ModalFormWrapper>
    </div>
  )
}
