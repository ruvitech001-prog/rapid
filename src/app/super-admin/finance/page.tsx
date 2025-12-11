'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  IndianRupee,
  Loader2,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useSuperAdminFinanceDeclarations,
  useSuperAdminFinanceStats,
  useSuperAdminTaxProofs,
  useUpdateDeclarationStatus,
  useVerifyTaxProof,
} from '@/lib/hooks/use-superadmin-finance'
import type { EmployeeFinanceDetails, TaxProof } from '@/lib/services/superadmin-finance.service'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  verified: 'bg-green-100 text-green-700',
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getCurrentFinancialYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  if (month >= 4) {
    return `${year}-${year + 1}`
  } else {
    return `${year - 1}-${year}`
  }
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('declarations')
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear())
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedDeclaration, setSelectedDeclaration] = useState<EmployeeFinanceDetails | null>(null)
  const [selectedProof, setSelectedProof] = useState<TaxProof | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')

  const { data: stats, isLoading: statsLoading } = useSuperAdminFinanceStats(selectedFY)
  const { data: declarationsData, isLoading: declarationsLoading } = useSuperAdminFinanceDeclarations({
    financialYear: selectedFY,
    status: statusFilter === 'all' ? undefined : statusFilter,
  })
  const { data: proofsData, isLoading: proofsLoading } = useSuperAdminTaxProofs({
    status: statusFilter === 'all' ? undefined : statusFilter,
  })

  const updateDeclarationStatus = useUpdateDeclarationStatus()
  const verifyTaxProof = useVerifyTaxProof()

  const handleDeclarationAction = async () => {
    if (!selectedDeclaration) return

    try {
      await updateDeclarationStatus.mutateAsync({
        id: selectedDeclaration.id,
        status: actionType === 'approve' ? 'approved' : 'rejected',
      })
      toast.success(`Declaration ${actionType}d successfully`)
      setIsActionDialogOpen(false)
      setSelectedDeclaration(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${actionType} declaration`)
    }
  }

  const handleProofAction = async () => {
    if (!selectedProof) return

    try {
      await verifyTaxProof.mutateAsync({
        documentId: selectedProof.id,
        status: actionType === 'approve' ? 'verified' : 'rejected',
      })
      toast.success(`Tax proof ${actionType === 'approve' ? 'verified' : 'rejected'} successfully`)
      setIsActionDialogOpen(false)
      setSelectedProof(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${actionType} tax proof`)
    }
  }

  const openDeclarationAction = (declaration: EmployeeFinanceDetails, action: 'approve' | 'reject') => {
    setSelectedDeclaration(declaration)
    setSelectedProof(null)
    setActionType(action)
    setIsActionDialogOpen(true)
  }

  const openProofAction = (proof: TaxProof, action: 'approve' | 'reject') => {
    setSelectedProof(proof)
    setSelectedDeclaration(null)
    setActionType(action)
    setIsActionDialogOpen(true)
  }

  const financialYears = [
    '2024-2025',
    '2023-2024',
    '2022-2023',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance Management</h1>
          <p className="text-muted-foreground mt-2">Review tax declarations and proof submissions</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedFY} onValueChange={setSelectedFY}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Financial Year" />
            </SelectTrigger>
            <SelectContent>
              {financialYears.map((fy) => (
                <SelectItem key={fy} value={fy}>
                  FY {fy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Declarations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <p className="text-2xl font-bold">{stats?.totalDeclarations ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <p className="text-2xl font-bold text-yellow-600">{stats?.pendingDeclarations ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tax Regime Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm">Old: {stats?.oldRegimeCount ?? 0}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm">New: {stats?.newRegimeCount ?? 0}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(stats?.totalDeductionsDeclared ?? 0)}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Financial Records</CardTitle>
              <CardDescription>Review and approve employee tax declarations and proofs</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="declarations">Tax Declarations</TabsTrigger>
              <TabsTrigger value="proofs">Tax Proofs</TabsTrigger>
            </TabsList>

            <TabsContent value="declarations" className="mt-4">
              {declarationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : declarationsData?.data && declarationsData.data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Financial Year</TableHead>
                      <TableHead>Tax Regime</TableHead>
                      <TableHead>Total Deductions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {declarationsData.data.map((declaration) => (
                      <TableRow key={declaration.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{declaration.employeeName}</p>
                            <p className="text-sm text-muted-foreground">{declaration.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{declaration.companyName || '-'}</TableCell>
                        <TableCell>{declaration.financialYear}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {declaration.taxRegime}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(declaration.totalDeductions)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[declaration.status]}>
                            {declaration.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {declaration.status === 'submitted' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600"
                                onClick={() => openDeclarationAction(declaration, 'approve')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => openDeclarationAction(declaration, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No declarations found</h3>
                  <p className="text-muted-foreground">
                    No tax declarations match your current filters
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="proofs" className="mt-4">
              {proofsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : proofsData?.data && proofsData.data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proofsData.data.map((proof) => (
                      <TableRow key={proof.id}>
                        <TableCell className="font-medium">{proof.employeeName}</TableCell>
                        <TableCell>{proof.documentType}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {proof.fileName}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(proof.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[proof.status]}>
                            {proof.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {proof.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600"
                                onClick={() => openProofAction(proof, 'approve')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => openProofAction(proof, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tax proofs found</h3>
                  <p className="text-muted-foreground">
                    No tax proofs match your current filters
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'}{' '}
              {selectedDeclaration ? 'Declaration' : 'Tax Proof'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Are you sure you want to ${selectedDeclaration ? 'approve this tax declaration' : 'verify this tax proof'}?`
                : `Are you sure you want to reject this ${selectedDeclaration ? 'tax declaration' : 'tax proof'}?`}
            </DialogDescription>
          </DialogHeader>

          {selectedDeclaration && (
            <div className="py-4 space-y-2">
              <p><strong>Employee:</strong> {selectedDeclaration.employeeName}</p>
              <p><strong>Financial Year:</strong> {selectedDeclaration.financialYear}</p>
              <p><strong>Tax Regime:</strong> {selectedDeclaration.taxRegime.toUpperCase()}</p>
              <p><strong>Total Deductions:</strong> {formatCurrency(selectedDeclaration.totalDeductions)}</p>
            </div>
          )}

          {selectedProof && (
            <div className="py-4 space-y-2">
              <p><strong>Employee:</strong> {selectedProof.employeeName}</p>
              <p><strong>Document:</strong> {selectedProof.documentType}</p>
              <p><strong>File:</strong> {selectedProof.fileName}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={selectedDeclaration ? handleDeclarationAction : handleProofAction}
              disabled={updateDeclarationStatus.isPending || verifyTaxProof.isPending}
            >
              {(updateDeclarationStatus.isPending || verifyTaxProof.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {actionType === 'approve' ? (selectedDeclaration ? 'Approve' : 'Verify') : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
