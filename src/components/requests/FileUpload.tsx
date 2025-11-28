'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, Image, File } from 'lucide-react'
import { Label } from '@/components/ui/label'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  file?: File
}

interface FileUploadProps {
  label?: string
  value: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
  accept?: string
  maxFiles?: number
  maxSize?: number // in MB
  disabled?: boolean
}

export function FileUpload({
  label = 'Upload documents',
  value,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxFiles = 10,
  maxSize = 10, // 10MB default
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback((files: FileList | null) => {
    if (!files || disabled) return

    const newFiles: UploadedFile[] = []

    Array.from(files).forEach((file) => {
      // Check max files
      if (value.length + newFiles.length >= maxFiles) return

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
        return
      }

      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      })
    })

    if (newFiles.length > 0) {
      onChange([...value, ...newFiles])
    }
  }, [value, onChange, maxFiles, maxSize, disabled])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = (fileId: string) => {
    onChange(value.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />
    }
    if (type.includes('pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />
    }
    return <File className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium text-gray-900">{label}</Label>}

      {/* Drop zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-[#642DFC] bg-[#642DFC]/5' : 'border-[#DEE4EB]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#642DFC]/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          disabled={disabled}
        />

        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          <span className="text-[#642DFC] font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PDF, JPG, PNG, DOC up to {maxSize}MB (max {maxFiles} files)
        </p>
      </div>

      {/* Uploaded files list */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(file.id)
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
