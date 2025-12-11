'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  useSuperAdminServices,
  useSuperAdminServiceStats,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/lib/hooks/use-superadmin-services'
import type { SuperAdminService, ServiceCategory, CreateServiceInput, UpdateServiceInput } from '@/lib/services/superadmin-services.service'

const categoryLabels: Record<ServiceCategory, string> = {
  health_insurance: 'Health Insurance',
  bgv: 'Background Verification',
  equipment: 'Equipment',
  gifts: 'Gifts & Rewards',
  office_space: 'Office Space',
  other: 'Other',
}

export default function ServicesPage() {
  const { data: services, isLoading: servicesLoading, error: servicesError } = useSuperAdminServices()
  const { data: stats, isLoading: statsLoading } = useSuperAdminServiceStats()
  const createService = useCreateService()
  const updateService = useUpdateService()
  const deleteService = useDeleteService()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<SuperAdminService | null>(null)
  const [formData, setFormData] = useState<CreateServiceInput>({
    name: '',
    description: '',
    category: undefined,
  })

  const serviceMetrics = [
    { name: 'Total Services', value: stats?.totalServices ?? 0 },
    { name: 'Active Services', value: stats?.activeServices ?? 0 },
    { name: 'Total Clients Using Services', value: stats?.totalClientsUsingServices ?? 0 },
    { name: 'Total Beneficiaries', value: stats?.totalBeneficiaries ?? 0 },
  ]

  const handleAddService = async () => {
    if (!formData.name.trim()) {
      toast.error('Service name is required')
      return
    }

    try {
      await createService.mutateAsync(formData)
      toast.success('Service created successfully')
      setIsAddDialogOpen(false)
      setFormData({ name: '', description: '', category: undefined })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create service')
    }
  }

  const handleEditService = async () => {
    if (!selectedService) return
    if (!formData.name.trim()) {
      toast.error('Service name is required')
      return
    }

    try {
      const input: UpdateServiceInput = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
      }
      await updateService.mutateAsync({ id: selectedService.id, input })
      toast.success('Service updated successfully')
      setIsEditDialogOpen(false)
      setSelectedService(null)
      setFormData({ name: '', description: '', category: undefined })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update service')
    }
  }

  const handleDeleteService = async () => {
    if (!selectedService) return

    try {
      await deleteService.mutateAsync(selectedService.id)
      toast.success('Service deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedService(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete service')
    }
  }

  const openEditDialog = (service: SuperAdminService) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      category: service.category || undefined,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (service: SuperAdminService) => {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }

  if (servicesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load services</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services Management</h1>
          <p className="text-muted-foreground mt-2">Manage employee services and benefits programs</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {serviceMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <p className="text-2xl font-bold">{metric.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services Cards */}
      <div className="space-y-4">
        {servicesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : services && services.length > 0 ? (
          services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        service.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {service.category && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {categoryLabels[service.category]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{service.description || 'No description'}</p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Active Clients</p>
                        <p className="font-semibold">{service.activeClients ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Beneficiaries</p>
                        <p className="font-semibold">{service.totalBeneficiaries ?? 0}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(service)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Service
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => openDeleteDialog(service)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first service</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Service Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Service Configuration</CardTitle>
          <CardDescription>Global settings for all services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-blue-50">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Service Announcement</h4>
                <p className="text-sm text-blue-700 mt-1">
                  New equipment tracking system will be deployed on April 15th. All clients will be notified automatically.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Service Approvals</h4>
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">Pending approvals</p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Review
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Provider Contracts</h4>
                <p className="text-2xl font-bold text-primary">8</p>
                <p className="text-sm text-muted-foreground">Active contracts</p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Manage
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Service SLAs</h4>
                <p className="text-2xl font-bold text-green-600">100%</p>
                <p className="text-sm text-muted-foreground">Compliance rate</p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service offering for your clients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                placeholder="e.g., Health Insurance Plans"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => setFormData({ ...formData, category: value as ServiceCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the service..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService} disabled={createService.isPending}>
              {createService.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the service details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Health Insurance Plans"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => setFormData({ ...formData, category: value as ServiceCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe the service..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditService} disabled={updateService.isPending}>
              {updateService.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedService?.name}&quot;? This action will deactivate the service and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteService} disabled={deleteService.isPending}>
              {deleteService.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
