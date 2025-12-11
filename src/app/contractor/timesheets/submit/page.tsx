'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useSaveTimesheet, useSubmitTimesheet, useContractorOwnContracts } from '@/lib/hooks'

export default function SubmitTimesheetPage() {
  const router = useRouter()
  const { user } = useAuth()
  const contractorId = user?.id

  // Get contractor's contracts to get the contract ID
  const { data: contracts, isLoading: contractsLoading } = useContractorOwnContracts(contractorId)
  const currentContract = useMemo(() => contracts?.find(c => c.is_current), [contracts])

  const saveTimesheetMutation = useSaveTimesheet()
  const submitTimesheetMutation = useSubmitTimesheet()

  const [weekStart, setWeekStart] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [entries, setEntries] = useState([
    { day: 'Monday', hours: '' },
    { day: 'Tuesday', hours: '' },
    { day: 'Wednesday', hours: '' },
    { day: 'Thursday', hours: '' },
    { day: 'Friday', hours: '' },
    { day: 'Saturday', hours: '' },
    { day: 'Sunday', hours: '' },
  ])

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries]
    if (newEntries[index]) {
      newEntries[index].hours = value
      setEntries(newEntries)
    }
  }

  const totalHours = entries.reduce((sum, entry) => sum + (parseFloat(entry.hours) || 0), 0)

  // Calculate week end date (6 days after start)
  const getWeekEndDate = (startDate: string): string => {
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return end.toISOString().split('T')[0] ?? ''
  }

  const isSubmitting = saveTimesheetMutation.isPending || submitTimesheetMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contractorId) {
      toast.error('Please log in to submit a timesheet')
      return
    }

    if (!currentContract?.id) {
      toast.error('No active contract found. Please contact support.')
      return
    }

    if (!weekStart) {
      toast.error('Please select the week start date')
      return
    }

    if (totalHours === 0) {
      toast.error('Please enter at least some hours worked')
      return
    }

    try {
      // First save the timesheet (creates draft or updates existing)
      const savedTimesheet = await saveTimesheetMutation.mutateAsync({
        contractorId,
        contractId: currentContract.id,
        weekStartDate: weekStart,
        weekEndDate: getWeekEndDate(weekStart),
        mondayHours: parseFloat(entries[0]?.hours || '0') || 0,
        tuesdayHours: parseFloat(entries[1]?.hours || '0') || 0,
        wednesdayHours: parseFloat(entries[2]?.hours || '0') || 0,
        thursdayHours: parseFloat(entries[3]?.hours || '0') || 0,
        fridayHours: parseFloat(entries[4]?.hours || '0') || 0,
        saturdayHours: parseFloat(entries[5]?.hours || '0') || 0,
        sundayHours: parseFloat(entries[6]?.hours || '0') || 0,
        taskDescription: taskDescription || undefined,
      })

      // Then submit it (changes status from draft to submitted)
      await submitTimesheetMutation.mutateAsync(savedTimesheet.id)

      toast.success('Timesheet submitted successfully!')
      router.push('/contractor/timesheet')
    } catch (error) {
      console.error('Failed to submit timesheet:', error)
      toast.error('Failed to submit timesheet. Please try again.')
    }
  }

  // Get hourly rate from contract for estimated payment
  const hourlyRate = currentContract?.hourly_rate || 0

  if (contractsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submit Timesheet</h1>
        <p className="mt-1 text-sm text-gray-500">Record your weekly work hours</p>
      </div>

      {!currentContract && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            No active contract found. Please contact your employer to set up your contract.
          </p>
        </div>
      )}

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
          {weekStart && (
            <p className="mt-2 text-xs text-gray-500">
              Week ending: {getWeekEndDate(weekStart)}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
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
                      onChange={(e) => handleEntryChange(index, e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-6 py-4 text-sm text-gray-900">Total Hours</td>
                <td className="px-6 py-4 text-sm text-blue-600">{totalHours}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Describe the work done during this week..."
          />
        </div>

        {hourlyRate > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">
              Estimated Payment: ₹{(totalHours * hourlyRate).toLocaleString()}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Based on your hourly rate of ₹{hourlyRate.toLocaleString()}/hour
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !currentContract}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Timesheet'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
