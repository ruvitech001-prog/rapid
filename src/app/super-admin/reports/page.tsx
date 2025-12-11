'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Download, Eye, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function ReportsPage() {
  const savedReports = [
    {
      id: 1,
      name: 'Monthly Payroll Summary',
      description: 'Overview of payroll across all companies',
      lastGenerated: '2024-04-10',
      frequency: 'Monthly',
    },
    {
      id: 2,
      name: 'Employee Distribution',
      description: 'Breakdown of employees by company and role',
      lastGenerated: '2024-04-08',
      frequency: 'Weekly',
    },
    {
      id: 3,
      name: 'Revenue Analysis',
      description: 'Revenue trends and performance metrics',
      lastGenerated: '2024-04-09',
      frequency: 'Monthly',
    },
    {
      id: 4,
      name: 'Compliance Report',
      description: 'Compliance status and audit findings',
      lastGenerated: '2024-04-05',
      frequency: 'Quarterly',
    },
    {
      id: 5,
      name: 'Invoice Status Report',
      description: 'Outstanding invoices and payment status',
      lastGenerated: '2024-04-10',
      frequency: 'Weekly',
    },
  ]

  const reportCategories = [
    {
      title: 'Financial Reports',
      icon: TrendingUp,
      reports: ['Payroll Summary', 'Revenue Analysis', 'Expense Tracking', 'Invoice Report'],
    },
    {
      title: 'Operational Reports',
      icon: BarChart3,
      reports: ['Employee Distribution', 'Team Member Activity', 'Attendance Report', 'Leave Summary'],
    },
    {
      title: 'Compliance & Audit',
      icon: PieChartIcon,
      reports: ['Compliance Status', 'Audit Trail', 'Access Control', 'Security Report'],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-2">Generate and manage system reports</p>
        </div>
        <Button onClick={() => toast.info('Custom report builder coming soon')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCategories.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.reports.map((report) => (
                    <li key={report}>
                      <Button variant="ghost" className="w-full justify-start text-left h-auto py-2">
                        {report}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Saved Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Reports</CardTitle>
          <CardDescription>Your custom and scheduled reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      Generated: {report.lastGenerated}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {report.frequency}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>Create custom reports with flexible columns and filters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Report Name</label>
              <input type="text" placeholder="e.g., Q1 2024 Summary" className="w-full border rounded-md p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Report Type</label>
              <select className="w-full border rounded-md p-2 mt-1">
                <option>Financial</option>
                <option>Operational</option>
                <option>Compliance</option>
                <option>Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Available Columns</label>
            <div className="border rounded-md p-4 bg-muted/50">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Company Name', 'Total Employees', 'Monthly Revenue', 'Active Contracts', 'Payroll Status', 'Invoice Status', 'Compliance Status', 'Last Updated', 'Contact Email'].map((col) => (
                  <label key={col} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                    <span className="text-sm">{col}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <input type="date" className="w-full border rounded-md p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Filter by Status</label>
              <select className="w-full border rounded-md p-2 mt-1">
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button>
              <Eye className="h-4 w-4 mr-2" />
              Preview Report
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Set up automatic report generation and delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <p className="font-medium">Monthly Payroll Summary</p>
                <p className="text-sm text-muted-foreground">Every 1st of the month at 00:00 UTC</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <p className="font-medium">Weekly Revenue Report</p>
                <p className="text-sm text-muted-foreground">Every Monday at 08:00 IST</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Scheduled Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
