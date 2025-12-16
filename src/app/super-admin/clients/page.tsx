'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
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
import { useClients, useUpdateClient, useDeactivateClient, useReactivateClient, useCreateClient } from '@/lib/hooks'
import { usePermissions, PermissionGate } from '@/lib/hooks/use-permissions'
import { toast } from 'sonner'
import type { ClientDetails, CreateClientInput } from '@/lib/hooks'
import { Label } from '@/components/ui/label'
import { colors } from '@/lib/design-tokens'

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Fetch clients with filters
  const { data: clientsData, isLoading, error, refetch } = useClients({
    search: searchQuery || undefined,
    status: statusFilter,
  })

  const clients = clientsData?.data || []

  // Mutations
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const deactivateClient = useDeactivateClient()
  const reactivateClient = useReactivateClient()

  // Permissions
  const { can } = usePermissions()
  const canCreateClients = can('clients.create')
  const canManageClients = can('clients.edit')
  const canDeactivate = can('clients.deactivate')

  // Modal states
  const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Edit form state
  const [editLegalName, setEditLegalName] = useState('')
  const [editDisplayName, setEditDisplayName] = useState('')

  // Create form state
  const [newLegalName, setNewLegalName] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')

  // Handler: View Client Details
  const handleViewClient = (client: ClientDetails) => {
    setSelectedClient(client)
    setIsViewModalOpen(true)
  }

  // Handler: Edit Client
  const handleEditClient = (client: ClientDetails) => {
    setSelectedClient(client)
    setEditLegalName(client.legalName)
    setEditDisplayName(client.displayName || '')
    setIsEditModalOpen(true)
  }

  // Handler: Deactivate Client
  const handleDeactivateClient = (client: ClientDetails) => {
    setSelectedClient(client)
    setIsDeactivateModalOpen(true)
  }

  // Handler: Confirm Deactivation
  const confirmDeactivation = async () => {
    if (!selectedClient) return

    if (selectedClient.isActive) {
      deactivateClient.mutate(selectedClient.id, {
        onSuccess: () => {
          setIsDeactivateModalOpen(false)
          setSelectedClient(null)
        },
      })
    } else {
      reactivateClient.mutate(selectedClient.id, {
        onSuccess: () => {
          setIsDeactivateModalOpen(false)
          setSelectedClient(null)
        },
      })
    }
  }

  // Handler: Save Edit
  const handleSaveEdit = async () => {
    if (!selectedClient) return

    updateClient.mutate(
      {
        id: selectedClient.id,
        data: {
          legalName: editLegalName,
          displayName: editDisplayName || null,
        },
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false)
          setSelectedClient(null)
        },
      }
    )
  }

  // Handler: Add New Client
  const handleAddClient = () => {
    if (!canCreateClients) {
      toast.error('You do not have permission to create clients')
      return
    }
    setNewLegalName('')
    setNewDisplayName('')
    setNewAdminEmail('')
    setIsCreateModalOpen(true)
  }

  // Handler: Save New Client
  const handleSaveNewClient = async () => {
    if (!newLegalName.trim()) {
      toast.error('Legal name is required')
      return
    }
    if (!newAdminEmail.trim()) {
      toast.error('Admin email is required')
      return
    }

    createClient.mutate(
      {
        legalName: newLegalName,
        displayName: newDisplayName || undefined,
        adminEmail: newAdminEmail,
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false)
          setNewLegalName('')
          setNewDisplayName('')
          setNewAdminEmail('')
        },
      }
    )
  }

  const isProcessing = createClient.isPending || updateClient.isPending || deactivateClient.isPending || reactivateClient.isPending

  // Stats computed from current clients (already filtered by API)
  const stats = useMemo(() => {
    if (!clients.length) return { total: 0, active: 0, inactive: 0, totalEmployees: 0 }
    return {
      total: clientsData?.total || clients.length,
      active: clients.filter((c) => c.isActive).length,
      inactive: clients.filter((c) => !c.isActive).length,
      totalEmployees: clients.reduce((sum, c) => sum + c.employeeCount + c.contractorCount, 0),
    }
  }, [clients, clientsData?.total])

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients Management</h1>
            <p className="text-muted-foreground mt-2">Manage all client companies and their settings</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Clients</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Failed to load client data'}
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
          <h1 className="text-3xl font-bold text-foreground">Clients Management</h1>
          <p className="text-muted-foreground mt-2">Manage all client companies and their settings</p>
        </div>
        <Button onClick={handleAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {statusFilter === 'all' ? 'All Status' : statusFilter === 'active' ? 'Active' : 'Inactive'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>Complete list of registered companies</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery || statusFilter !== 'all' ? 'No clients match your filters.' : 'No clients found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Company Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Display Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Employees</th>
                    <th className="text-left py-3 px-4 font-semibold">Contractors</th>
                    <th className="text-left py-3 px-4 font-semibold">Registered Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{client.legalName}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {client.displayName || '-'}
                      </td>
                      <td className="py-3 px-4">{client.employeeCount}</td>
                      <td className="py-3 px-4">{client.contractorCount}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            client.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {client.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewClient(client)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canManageClients && (
                              <DropdownMenuItem onClick={() => handleEditClient(client)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDeactivate && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className={client.isActive ? 'text-destructive' : 'text-green-600'}
                                  onClick={() => handleDeactivateClient(client)}
                                >
                                  {client.isActive ? (
                                    <>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Reactivate
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </>
                            )}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workforce</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.totalEmployees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '-' : stats.inactive}</p>
          </CardContent>
        </Card>
      </div>

      {/* View Client Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              {selectedClient?.legalName}
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Legal Name</p>
                  <p className="font-medium">{selectedClient.legalName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Display Name</p>
                  <p className="font-medium">{selectedClient.displayName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="font-medium">{selectedClient.employeeCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contractors</p>
                  <p className="font-medium">{selectedClient.contractorCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registered</p>
                  <p className="font-medium">
                    {new Date(selectedClient.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedClient.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {selectedClient.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewModalOpen(false)
              if (selectedClient) handleEditClient(selectedClient)
            }}>
              Edit Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Legal Name</label>
                <Input
                  value={editLegalName}
                  onChange={(e) => setEditLegalName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <Input
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="Optional display name"
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isProcessing || !editLegalName.trim()}>
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate/Reactivate Confirmation Modal */}
      <Dialog open={isDeactivateModalOpen} onOpenChange={setIsDeactivateModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {selectedClient?.isActive ? 'Deactivate Client' : 'Reactivate Client'}
            </DialogTitle>
            <DialogDescription>
              {selectedClient?.isActive
                ? 'Are you sure you want to deactivate this client?'
                : 'Are you sure you want to reactivate this client?'}
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                {selectedClient.isActive ? (
                  <>
                    This will deactivate <strong>{selectedClient.legalName}</strong> and all associated employees and contractors will lose access.
                  </>
                ) : (
                  <>
                    This will reactivate <strong>{selectedClient.legalName}</strong> and restore access for all associated employees and contractors.
                  </>
                )}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeactivateModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant={selectedClient?.isActive ? 'destructive' : 'default'}
              onClick={confirmDeactivation}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {selectedClient?.isActive ? 'Deactivate' : 'Reactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Client Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client company. An admin account will be associated with the provided email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="legalName">Legal Name *</Label>
              <Input
                id="legalName"
                value={newLegalName}
                onChange={(e) => setNewLegalName(e.target.value)}
                placeholder="e.g., Acme Corporation Pvt Ltd"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="e.g., Acme Corp (optional)"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">Admin Email *</Label>
              <Input
                id="adminEmail"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@company.com"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The primary contact for this client company
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewClient}
              disabled={isProcessing || !newLegalName.trim() || !newAdminEmail.trim()}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Create Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
