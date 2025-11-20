'use client'

import { useState } from 'react'

export default function DocumentsLibraryPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const documents = [
    { id: 1, name: 'Employment Contract.pdf', category: 'Contract', uploadedBy: 'HR Team', uploadedOn: '2024-01-15', size: '245 KB', signed: true },
    { id: 2, name: 'Offer Letter.pdf', category: 'Offer', uploadedBy: 'HR Team', uploadedOn: '2024-01-10', size: '180 KB', signed: true },
    { id: 3, name: 'Payslip_Feb2024.pdf', category: 'Payslip', uploadedBy: 'System', uploadedOn: '2024-03-01', size: '95 KB', signed: false },
    { id: 4, name: 'Form16_FY2023-24.pdf', category: 'Tax', uploadedBy: 'System', uploadedOn: '2024-06-15', size: '210 KB', signed: false },
    { id: 5, name: 'Leave Policy.pdf', category: 'Policy', uploadedBy: 'HR Team', uploadedOn: '2024-01-01', size: '320 KB', signed: false },
  ]

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDownload = (docName: string) => {
    alert(`Downloading ${docName}...`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents Library</h1>
        <p className="mt-1 text-sm text-gray-500">Access all your work-related documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-600">Total Documents</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{documents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-600">Contracts</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{documents.filter(d => d.category === 'Contract').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-600">E-Signed</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{documents.filter(d => d.signed).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-600">Recent</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {documents.filter(d => new Date(d.uploadedOn) > new Date(Date.now() - 30*24*60*60*1000)).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Contract">Contracts</option>
              <option value="Offer">Offer Letters</option>
              <option value="Payslip">Payslips</option>
              <option value="Tax">Tax Documents</option>
              <option value="Policy">Policies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.size}</p>
                </div>
              </div>
              {doc.signed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  E-Signed
                </span>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Category:</span>
                <span className="font-medium text-gray-900">{doc.category}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Uploaded by:</span>
                <span className="font-medium text-gray-900">{doc.uploadedBy}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Date:</span>
                <span className="font-medium text-gray-900">{new Date(doc.uploadedOn).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleDownload(doc.name)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Download
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
