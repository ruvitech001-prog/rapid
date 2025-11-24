'use client';

import { useState } from 'react';
import { Upload, FileText, Trash2, Download } from 'lucide-react';

export default function DocumentsPage() {
  const [documents] = useState([
    { id: 1, name: 'Company Policy Handbook', type: 'PDF', uploadDate: '2024-01-15', size: '2.4 MB' },
    { id: 2, name: 'Employee Agreement Template', type: 'DOCX', uploadDate: '2024-02-01', size: '1.2 MB' },
    { id: 3, name: 'Code of Conduct', type: 'PDF', uploadDate: '2024-02-15', size: '3.1 MB' },
    { id: 4, name: 'IT Acceptable Use Policy', type: 'PDF', uploadDate: '2024-03-01', size: '1.8 MB' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
          <p className="text-slate-600 mt-1">Manage company documents and policies</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Upload size={20} />
          Upload Document
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Document Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Upload Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Size</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-500" size={20} />
                    <span className="text-sm font-medium text-slate-900">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{doc.type}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{doc.uploadDate}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{doc.size}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded transition-colors text-blue-600">
                      <Download size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded transition-colors text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
