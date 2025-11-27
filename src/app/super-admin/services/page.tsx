'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      name: 'Health Insurance Plans',
      description: 'Comprehensive health coverage for employees',
      activeClients: 15,
      totalBeneficiaries: 2543,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Background Verification',
      description: 'Employee background checks and verification services',
      activeClients: 8,
      totalBeneficiaries: 450,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Office Space Requests',
      description: 'Manage office space allocation and requests',
      activeClients: 12,
      totalBeneficiaries: 1200,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Equipment Tracking',
      description: 'Track and manage company equipment allocation',
      activeClients: 10,
      totalBeneficiaries: 890,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Gifts & Rewards',
      description: 'Employee recognition and gifts program',
      activeClients: 5,
      totalBeneficiaries: 200,
      status: 'Inactive',
    },
  ]

  const serviceMetrics = [
    { name: 'Total Services', value: services.length },
    { name: 'Active Services', value: services.filter(s => s.status === 'Active').length },
    { name: 'Total Clients Using Services', value: 25 },
    { name: 'Total Beneficiaries', value: 5283 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services Management</h1>
          <p className="text-muted-foreground mt-2">Manage employee services and benefits programs</p>
        </div>
        <Button asChild>
          <Link href="#add-service">
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </Link>
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
              <p className="text-2xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services Cards */}
      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Active Clients</p>
                      <p className="font-semibold">{service.activeClients}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Beneficiaries</p>
                      <p className="font-semibold">{service.totalBeneficiaries}</p>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Service
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
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
    </div>
  )
}
