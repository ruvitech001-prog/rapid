'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitTimesheetPage() {
  const router = useRouter()
  const [weekStart, setWeekStart] = useState('')
  const [entries, setEntries] = useState([
    { day: 'Monday', hours: '', description: '' },
    { day: 'Tuesday', hours: '', description: '' },
    { day: 'Wednesday', hours: '', description: '' },
    { day: 'Thursday', hours: '', description: '' },
    { day: 'Friday', hours: '', description: '' },
  ])

  const handleEntryChange = (index: number, field: 'hours' | 'description', value: string) => {
    const newEntries = [...entries]
    if (newEntries[index]) {
      newEntries[index][field] = value
      setEntries(newEntries)
    }
  }

  const totalHours = entries.reduce((sum, entry) => sum + (parseFloat(entry.hours) || 0), 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting timesheet:', { weekStart, entries, totalHours })
    alert('Timesheet submitted successfully!')
    router.push('/contractor/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submit Timesheet</h1>
        <p className="mt-1 text-sm text-gray-500">Record your weekly work hours</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Week Starting *</label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Work Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry, index) => (
                <tr key={entry.day}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.day}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={entry.hours}
                      onChange={(e) => handleEntryChange(index, 'hours', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="8"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={entry.description}
                      onChange={(e) => handleEntryChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Describe the work done..."
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-6 py-4 text-sm text-gray-900">Total Hours</td>
                <td className="px-6 py-4 text-sm text-blue-600">{totalHours}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">Estimated Payment: ₹{(totalHours * 500).toLocaleString()}</p>
          <p className="text-xs text-blue-700 mt-1">Based on your hourly rate of ₹500/hour</p>
        </div>

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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit Timesheet
          </button>
        </div>
      </form>
    </div>
  )
}
