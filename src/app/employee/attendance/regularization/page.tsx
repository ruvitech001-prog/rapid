'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AttendanceRegularizationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: '',
    requestType: '',
    clockIn: '',
    clockOut: '',
    reason: '',
  })

  const pendingRegularizations = [
    { id: 1, date: '2024-02-18', type: 'Missing Clock Out', requestedClockOut: '06:30 PM', status: 'pending', submittedOn: '2024-02-19' },
    { id: 2, date: '2024-02-15', type: 'Late Clock In', requestedClockIn: '09:00 AM', actualClockIn: '09:35 AM', status: 'approved', approvedOn: '2024-02-16' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual regularization submission
    toast.success('Attendance regularization request submitted successfully!')
    router.push('/employee/attendance/history')
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Regularization</h1>
        <p className="mt-1 text-sm text-gray-500">Request corrections to your attendance records</p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">When to request regularization:</h3>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>Forgot to clock in or clock out</li>
          <li>System error during attendance marking</li>
          <li>Working from a different location</li>
          <li>Emergency situations requiring immediate leave</li>
        </ul>
      </div>

      {/* Regularization Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">New Regularization Request</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Request Type *</label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                <option value="missing_clockin">Missing Clock In</option>
                <option value="missing_clockout">Missing Clock Out</option>
                <option value="late_clockin">Late Clock In</option>
                <option value="early_clockout">Early Clock Out</option>
                <option value="full_day">Full Day Absent</option>
              </select>
            </div>

            {(formData.requestType === 'missing_clockin' || formData.requestType === 'late_clockin') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Requested Clock In Time *</label>
                <input
                  type="time"
                  name="clockIn"
                  value={formData.clockIn}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {(formData.requestType === 'missing_clockout' || formData.requestType === 'early_clockout') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Requested Clock Out Time *</label>
                <input
                  type="time"
                  name="clockOut"
                  value={formData.clockOut}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Reason for Regularization *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Please provide a detailed reason for this regularization request..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">Important:</h4>
            <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
              <li>Regularization requests must be submitted within 3 days</li>
              <li>All requests require manager approval</li>
              <li>Provide valid reasons with supporting documents if required</li>
              <li>Excessive regularization requests may affect performance reviews</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>

      {/* Previous Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Previous Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRegularizations.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(request.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.requestedClockOut && `Clock Out: ${request.requestedClockOut}`}
                    {request.requestedClockIn && `Clock In: ${request.requestedClockIn}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.submittedOn ? new Date(request.submittedOn).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {getStatusBadge(request.status)}
                      {request.status === 'approved' && request.approvedOn && (
                        <p className="text-xs text-gray-500 mt-1">
                          Approved on {new Date(request.approvedOn).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pendingRegularizations.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't submitted any regularization requests</p>
          </div>
        )}
      </div>
    </div>
  )
}
