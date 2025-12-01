'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'
import { useEmployeeExpenses } from '@/lib/hooks'

export default function ExpenseHistoryPage() {
  const { user } = useAuth()
  const employeeId = user?.id

  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const { data: expenseClaims = [], isLoading } = useEmployeeExpenses(employeeId)

  // Transform data
  const expenses = useMemo(() => {
    return expenseClaims.map((exp) => ({
      id: exp.id,
      category: exp.expense_category || 'Other',
      amount: exp.amount || 0,
      merchant: exp.merchant_name || '',
      date: exp.expense_date || '',
      submittedOn: exp.created_at || '',
      status: exp.status || 'pending',
      approvedAmount: exp.amount, // No separate approved_amount field
      rejectionReason: exp.rejection_reason,
    }))
  }, [expenseClaims])

  const filteredExpenses = expenses.filter((expense) => {
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter
    const matchesCategory =
      categoryFilter === 'all' ||
      expense.category.toLowerCase().includes(categoryFilter.toLowerCase())
    return matchesStatus && matchesCategory
  })

  const totalApproved = expenses
    .filter((e) => e.status === 'approved')
    .reduce((sum, e) => sum + (e.approvedAmount || e.amount || 0), 0)
  const totalPending = expenses
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + (e.amount || 0), 0)

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-blue-100 text-blue-800',
    }
    return (
      <Badge
        variant="outline"
        className={styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#642DFC]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense History</h1>
          <p className="mt-2 text-muted-foreground">View all your expense claims</p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/employee/expenses/submit">
            <Plus className="h-4 w-4" />
            Submit Expense
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{expenses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-primary">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                totalApproved
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-orange-600">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                totalPending
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {
                expenses.filter(
                  (e) => e.date && new Date(e.date).getMonth() === new Date().getMonth()
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="travel">Travel</option>
                <option value="food">Food & Meals</option>
                <option value="accommodation">Accommodation</option>
                <option value="internet">Internet & Phone</option>
                <option value="office">Office Supplies</option>
                <option value="client">Client Entertainment</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length > 0 ? (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Merchant
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{expense.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{expense.merchant}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {expense.date
                          ? new Date(expense.date).toLocaleDateString('en-IN')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                          expense.amount
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {expense.submittedOn
                          ? new Date(expense.submittedOn).toLocaleDateString('en-IN')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStatusBadge(expense.status)}
                          {expense.status === 'rejected' && expense.rejectionReason && (
                            <p className="text-xs text-destructive">{expense.rejectionReason}</p>
                          )}
                          {expense.status === 'approved' && expense.approvedAmount && (
                            <p className="text-xs text-primary">
                              Approved:{' '}
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                              }).format(expense.approvedAmount)}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No expenses found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
