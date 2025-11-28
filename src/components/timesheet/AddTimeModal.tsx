'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select as _Select,
  SelectContent as _SelectContent,
  SelectItem as _SelectItem,
  SelectTrigger as _SelectTrigger,
  SelectValue as _SelectValue,
} from '@/components/ui/select'

interface AddTimeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TimesheetFormData) => void
}

export interface TimesheetFormData {
  clientName: string
  project: string
  startDate: string
  fromTime: string
  toTime: string
  description: string
  files?: File[]
}

const projects: Record<string, string[]> = {
  'Aditya Birla Group': ['Project A', 'Project B', 'Project C', 'Project D', 'Project E', 'Project F'],
  'XYZ Corp': ['Project X', 'Project Y', 'Project Z'],
  'ABC Company': ['Project 1', 'Project 2'],
}

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
  const minutes = (i % 2) * 30
  const isPM = hours >= 12
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`
})

export function AddTimeModal({ isOpen, onClose, onSubmit }: AddTimeModalProps) {
  const [formData, setFormData] = useState<TimesheetFormData>({
    clientName: 'Aditya Birla Group',
    project: 'Project A',
    startDate: '',
    fromTime: '11:30 AM',
    toTime: '11:30 PM',
    description: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [duration, setDuration] = useState<number>(0)

  // Calculate duration
  useEffect(() => {
    const calculateDuration = () => {
      try {
        const parseTime = (timeStr: string) => {
          const [time, meridiem] = timeStr.split(' ')
          if (!time) return 0
          const [hoursStr, minutesStr] = time.split(':')
          let hours = Number(hoursStr) || 0
          const minutes = Number(minutesStr) || 0

          if (meridiem === 'PM' && hours !== 12) hours += 12
          if (meridiem === 'AM' && hours === 12) hours = 0

          return hours * 60 + minutes
        }

        const fromMinutes = parseTime(formData.fromTime)
        const toMinutes = parseTime(formData.toTime)

        let diff = toMinutes - fromMinutes
        if (diff < 0) diff += 24 * 60 // Next day

        setDuration(Math.round(diff / 60 * 10) / 10) // Round to nearest 0.1
      } catch {
        setDuration(0)
      }
    }

    calculateDuration()
  }, [formData.fromTime, formData.toTime])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, files: uploadedFiles })
    // Reset form
    setFormData({
      clientName: 'Aditya Birla Group',
      project: 'Project A',
      startDate: '',
      fromTime: '11:30 AM',
      toTime: '11:30 PM',
      description: '',
    })
    setUploadedFiles([])
    onClose()
  }

  if (!isOpen) return null

  const availableProjects = projects[formData.clientName] || []

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Add time</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="client">Client Name</Label>
            <select
              id="client"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  clientName: e.target.value,
                  project: projects[e.target.value]?.[0] || '',
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-primary focus:outline-none"
            >
              {Object.keys(projects).map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <select
              id="project"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-primary focus:outline-none"
            >
              {availableProjects.map((proj) => (
                <option key={proj} value={proj}>
                  {proj}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Start date</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            {/* From Time */}
            <div className="space-y-2">
              <Label htmlFor="fromTime">From time</Label>
              <select
                id="fromTime"
                value={formData.fromTime}
                onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-primary focus:outline-none text-sm"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* To Time */}
            <div className="space-y-2">
              <Label htmlFor="toTime">To time</Label>
              <select
                id="toTime"
                value={formData.toTime}
                onChange={(e) => setFormData({ ...formData, toTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-primary focus:outline-none text-sm"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium">
              {duration} hours
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the work done..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload file</Label>
            <div className="space-y-3">
              {/* File Preview */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative h-20 w-20 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center group"
                    >
                      <div className="text-center text-xs text-gray-600">
                        <div className="font-medium truncate px-1">{file.name}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Input */}
              <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-xs text-gray-600">Click to upload</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
