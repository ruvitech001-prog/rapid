'use client';

import { useState } from 'react';
import { Upload, FileText, Trash2, Download, File, FolderOpen, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  category: string;
}

export default function DocumentsPage() {
  const [documents] = useState<Document[]>([
    { id: 1, name: 'Company Policy Handbook', type: 'PDF', uploadDate: '2024-01-15', size: '2.4 MB', category: 'Policies' },
    { id: 2, name: 'Employee Agreement Template', type: 'DOCX', uploadDate: '2024-02-01', size: '1.2 MB', category: 'Templates' },
    { id: 3, name: 'Code of Conduct', type: 'PDF', uploadDate: '2024-02-15', size: '3.1 MB', category: 'Policies' },
    { id: 4, name: 'IT Acceptable Use Policy', type: 'PDF', uploadDate: '2024-03-01', size: '1.8 MB', category: 'Policies' },
    { id: 5, name: 'Leave Application Form', type: 'DOCX', uploadDate: '2024-03-10', size: '0.5 MB', category: 'Templates' },
    { id: 6, name: 'Expense Report Template', type: 'XLSX', uploadDate: '2024-03-15', size: '0.8 MB', category: 'Templates' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(documents.map(d => d.category))];
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return { bg: 'bg-[#FF7373]/10', text: 'text-[#FF7373]' };
      case 'DOCX':
        return { bg: 'bg-[#586AF5]/10', text: 'text-[#586AF5]' };
      case 'XLSX':
        return { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]' };
      default:
        return { bg: 'bg-[#8593A3]/10', text: 'text-[#8593A3]' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-[#8593A3] mt-1">Manage company documents and policies</p>
        </div>
        <Button className="gap-2 bg-[#642DFC] hover:bg-[#5020d9]">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-[#EBF5FF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TOTAL DOCUMENTS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{documents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                <File className="h-6 w-6 text-[#586AF5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">POLICIES</p>
                <p className="text-3xl font-bold text-[#FF7373] mt-2">{documents.filter(d => d.category === 'Policies').length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7373]/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#FF7373]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#DEE4EB] shadow-none bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#8593A3] tracking-wider">TEMPLATES</p>
                <p className="text-3xl font-bold text-[#2DD4BF] mt-2">{documents.filter(d => d.category === 'Templates').length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-[#2DD4BF]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8593A3]" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#586AF5] focus:outline-none focus:ring-2 focus:ring-[#586AF5]/20"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#586AF5] text-white'
                      : 'bg-[#F4F7FA] text-[#8593A3] hover:bg-[#DEE4EB]'
                  }`}
                >
                  {category === 'all' ? 'All Documents' : category}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="rounded-2xl border border-[#DEE4EB] shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-gray-900">All Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F4F7FA] border-y border-[#DEE4EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">DOCUMENT NAME</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">TYPE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">CATEGORY</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">UPLOAD DATE</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#8593A3] tracking-wider">SIZE</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#8593A3] tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE4EB]">
                {filteredDocuments.map((doc) => {
                  const iconColors = getFileIcon(doc.type);
                  return (
                    <tr key={doc.id} className="hover:bg-[#F4F7FA]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${iconColors.bg} flex items-center justify-center`}>
                            <FileText className={`h-5 w-5 ${iconColors.text}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${iconColors.bg} ${iconColors.text}`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">
                        {new Date(doc.uploadDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8593A3]">{doc.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-[#586AF5]/10 rounded-lg transition-colors text-[#586AF5]">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-[#FF7373]/10 rounded-lg transition-colors text-[#FF7373]">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
