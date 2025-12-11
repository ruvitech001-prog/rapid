'use client'

import { useState } from 'react'
import { FileText, Download, Eye, Loader2, Search, Filter, X } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { useEmployeeDocuments } from '@/lib/hooks'
import type { DocumentWithDetails } from '@/lib/services'

export default function DocumentsLibraryPage() {
  const { user } = useAuth()
  const employeeId = user?.id
  const { data: documents, isLoading } = useEmployeeDocuments(employeeId)

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<DocumentWithDetails | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const documentList = documents || []

  const filteredDocs = documentList.filter(doc => {
    const matchesCategory = categoryFilter === 'all' || doc.document_category === categoryFilter
    const matchesSearch = (doc.file_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Calculate stats
  const categories = [...new Set(documentList.map(d => d.document_category).filter((c): c is string => !!c))]
  const verifiedCount = documentList.filter(d => d.is_verified).length
  const recentCount = documentList.filter(d => {
    if (!d.created_at) return false
    const uploadDate = new Date(d.created_at)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return uploadDate > thirtyDaysAgo
  }).length

  const handleDownload = async (doc: DocumentWithDetails) => {
    if (!doc.storage_url) {
      toast.error('Download URL not available for this document')
      return
    }

    setIsDownloading(doc.id)
    try {
      toast.info(`Downloading ${doc.file_name}...`)

      // Fetch the file from the URL
      const response = await fetch(doc.storage_url)
      if (!response.ok) {
        throw new Error('Failed to fetch document')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.file_name || 'document'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`${doc.file_name} downloaded successfully`)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download document. Please try again.')
    } finally {
      setIsDownloading(null)
    }
  }

  const handleView = (doc: DocumentWithDetails) => {
    if (doc.storage_url) {
      // Open in new tab for direct viewing
      window.open(doc.storage_url, '_blank')
    } else {
      // Show document details modal if no URL
      setSelectedDoc(doc)
      setIsViewModalOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents Library</h1>
        <p className="mt-1 text-sm text-gray-500">Access all your work-related documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{documentList.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{recentCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                      <p className="text-xs text-gray-500">{doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'Unknown size'}</p>
                    </div>
                  </div>
                  {doc.is_verified && (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Category:</span>
                    <span className="font-medium text-gray-900">{doc.document_category || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Type:</span>
                    <span className="font-medium text-gray-900">{doc.document_type}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Date:</span>
                    <span className="font-medium text-gray-900">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-IN') : '-'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={isDownloading === doc.id}
                    className="flex-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDownloading === doc.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download
                  </button>
                  <button
                    onClick={() => handleView(doc)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredDocs.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          Showing {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Document Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Information about the selected document
            </DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedDoc.file_name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedDoc.file_size ? `${Math.round(selectedDoc.file_size / 1024)} KB` : 'Unknown size'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{selectedDoc.document_category || 'General'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium">{selectedDoc.document_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Status</span>
                  <Badge className={selectedDoc.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {selectedDoc.is_verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Uploaded</span>
                  <span className="font-medium">
                    {selectedDoc.created_at ? new Date(selectedDoc.created_at).toLocaleDateString('en-IN') : '-'}
                  </span>
                </div>
                {selectedDoc.verification_status && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Verification Status</span>
                    <span className="font-medium capitalize">{selectedDoc.verification_status}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleDownload(selectedDoc)}
                  disabled={isDownloading === selectedDoc.id || !selectedDoc.storage_url}
                  className="flex-1"
                >
                  {isDownloading === selectedDoc.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
