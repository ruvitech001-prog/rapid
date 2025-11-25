'use client'

import { X } from 'lucide-react'

interface RejectionReasonModalProps {
  isOpen: boolean
  onClose: () => void
  reason: string
}

export function RejectionReasonModal({ isOpen, onClose, reason }: RejectionReasonModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Reason for rejection</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          {reason}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
